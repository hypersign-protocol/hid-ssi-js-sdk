"use strict";
/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jcs_1 = require("jcs");
const vc_js_1 = __importDefault(require("vc-js"));
const jsonld_signatures_1 = __importDefault(require("jsonld-signatures"));
const did_1 = __importDefault(require("../did/did"));
const ed25519_signature_2020_1 = require("@digitalbazaar/ed25519-signature-2020");
const ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
const utils_1 = __importDefault(require("../utils"));
const vc_1 = __importDefault(require("../credential/vc"));
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonld_signatures_1.default.purposes;
const constants_1 = require("../constants");
const v1_1 = __importDefault(require("../../libs/w3cache/v1"));
const jsonld_signatures_2 = require("jsonld-signatures");
const ethereumeip712signature2021suite_1 = require("ethereumeip712signature2021suite");
const documentLoader = v1_1.default;
class HypersignVerifiablePresentation {
    constructor(params = {}) {
        const { namespace, nodeRpcEndpoint, nodeRestEndpoint } = params;
        this.namespace = namespace && namespace != '' ? namespace : '';
        const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
        const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
        const offlineConstuctorParams = { nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp };
        this.vc = new vc_1.default(offlineConstuctorParams);
        this.hsDid = new did_1.default(offlineConstuctorParams);
        this.id = '';
        this.type = [];
        this.verifiableCredential = [];
        this.holder = '';
        this.proof = {};
    }
    _getId() {
        return __awaiter(this, void 0, void 0, function* () {
            const uuid = yield utils_1.default.getUUID();
            let id;
            if (this.namespace && this.namespace != '') {
                id = `${constants_1.VP.SCHEME}:${constants_1.VP.METHOD}:${this.namespace}:${uuid}`;
            }
            else {
                id = `${constants_1.VP.SCHEME}:${constants_1.VP.METHOD}:${uuid}`;
            }
            return id;
        });
    }
    /**
     * Generates a new presentation document
     * @params
     *  - params.verifiableCredentials: Array of Verifiable Credentials
     *  - params.holderDid            : DID of the subject
     * @returns {Promise<object>}
     */
    generate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this._getId();
            const presentation = vc_js_1.default.createPresentation({
                verifiableCredential: params.verifiableCredentials,
                id: id,
                holder: params.holderDid,
            });
            return presentation;
        });
    }
    /**
     * Signs a new presentation document
     * @params
     *  - params.presentation         : Array of Verifiable Credentials
     *  - params.holderDid            : *Optional* DID of the subject
     *  - params.holderDidDocSigned   : *Optional* DID Doc of the subject
     *  - params.verificationMethodId : verificationMethodId of holder
     *  - params.privateKeyMultibase  : Private key associated with the verification method
     *  - params.challenge            : Any random challenge
     * @returns {Promise<object>}
     */
    sign(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.holderDid && params.holderDidDocSigned) {
                throw new Error('HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
            }
            if (!params.privateKeyMultibase) {
                throw new Error('HID-SSI-SDK:: params.privateKeyMultibase is required for signing a presentation');
            }
            if (!params.presentation) {
                throw new Error('HID-SSI-SDK:: params.presentation is required for signinng a presentation');
            }
            if (!params.challenge) {
                throw new Error('HID-SSI-SDK:: params.challenge is required for signinng a presentation');
            }
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: params.verificationMethodId is required for signinng a presentation');
            }
            if (!this.hsDid) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            let resolvedDidDoc;
            if (params.holderDid) {
                resolvedDidDoc = yield this.hsDid.resolve({ did: params.holderDid });
            }
            else if (params.holderDidDocSigned) {
                resolvedDidDoc = {};
                resolvedDidDoc.didDocument = params.holderDidDocSigned;
            }
            else {
                throw new Error('HID-SSI-SDK:: params.holderDid or params.holderDidDocSigned is required for signinng a presentation');
            }
            const { didDocument: signerDidDoc } = resolvedDidDoc;
            // TODO: take verification method from params
            const publicKeyId = params.verificationMethodId; // TODO: bad idea -  should not hardcode it.
            const publicKeyVerMethod = signerDidDoc['verificationMethod'].find((x) => x.id == publicKeyId);
            const convertedKeyPair = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                publicKey: publicKeyVerMethod.publicKeyMultibase,
            });
            publicKeyVerMethod['publicKeyMultibase'] = convertedKeyPair.publicKeyMultibase;
            const keyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(Object.assign({ privateKeyMultibase: params.privateKeyMultibase }, publicKeyVerMethod));
            const suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                verificationMethod: publicKeyId,
                key: keyPair,
            });
            const signedVP = yield vc_js_1.default.signPresentation({
                presentation: params.presentation,
                suite,
                challenge: params.challenge,
                documentLoader,
            });
            return signedVP;
        });
    }
    // https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L392
    /**
     * Verifies signed presentation document
     * @params
     *  - params.signedPresentation         : Signed presentation document
     *  - params.holderDid                  : DID of the subject
     *  - params.holderDidDocSigned         : DIDdocument of the subject
     *  - params.holderVerificationMethodId : verificationMethodId of holder
     *  - params.issuerDid                  : DID of the issuer
     *  - params.issuerVerificationMethodId : Optional DIDDoc of the issuer
     *  - params.domain                     : Optional domain
     *  - params.challenge                  : Random challenge
     * @returns {Promise<object>}
     */
    verify(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.holderDid && params.holderDidDocSigned) {
                throw new Error('HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
            }
            if (!params.issuerDid) {
                throw new Error('HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
            }
            if (!params.challenge) {
                throw new Error('HID-SSI-SDK:: params.challenge is required for verifying a presentation');
            }
            if (!params.holderVerificationMethodId) {
                throw new Error('HID-SSI-SDK:: params.holderVerificationMethodId is required for verifying a presentation');
            }
            if (!params.issuerVerificationMethodId) {
                throw new Error('HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
            }
            if (!this.vc || !this.hsDid) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            if (!params.signedPresentation.proof) {
                throw new Error('HID-SSI-SDK:: params.signedPresentation must be signed');
            }
            ///---------------------------------------
            /// Holder
            let resolvedDidDoc;
            if (params.holderDid) {
                resolvedDidDoc = yield this.hsDid.resolve({ did: params.holderDid });
            }
            else if (params.holderDidDocSigned) {
                resolvedDidDoc = {};
                resolvedDidDoc.didDocument = params.holderDidDocSigned;
            }
            else {
                throw new Error('Either holderDid or holderDidDocSigned should be provided');
            }
            const { didDocument: holderDID } = resolvedDidDoc;
            const holderDidDoc = holderDID;
            const holderPublicKeyId = params.holderVerificationMethodId;
            const holderPublicKeyVerMethod = holderDidDoc.verificationMethod.find((x) => x.id == holderPublicKeyId);
            // Connvert the 45 byte pub key of holder into 48 byte
            const { publicKeyMultibase: holderPublicKeyMultibase } = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                publicKey: holderPublicKeyVerMethod.publicKeyMultibase,
            });
            holderPublicKeyVerMethod.publicKeyMultibase = holderPublicKeyMultibase;
            const holderController = {
                '@context': constants_1.DID.CONTROLLER_CONTEXT,
                id: holderDidDoc.id,
                authentication: holderDidDoc.authentication,
            };
            // TODO:  need to use domainname.
            const presentationPurpose = new AuthenticationProofPurpose({
                controller: holderController,
                challenge: params.challenge,
            });
            const keyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(Object.assign({ privateKeyMultibase: '' }, holderPublicKeyVerMethod));
            const vpSuite_holder = new ed25519_signature_2020_1.Ed25519Signature2020({
                verificationMethod: holderPublicKeyId,
                key: keyPair,
            });
            ///---------------------------------------
            /// Issuer
            const { didDocument: issuerDID } = yield this.hsDid.resolve({ did: params.issuerDid });
            if (issuerDID === null || issuerDID === undefined) {
                throw new Error('Issuer DID is not registered');
            }
            const issuerDidDoc = issuerDID;
            const issuerDidDocController = issuerDidDoc.controller;
            const issuerDidDocControllerVerificationMethod = params.issuerVerificationMethodId.split('#')[0];
            if (!issuerDidDocController.includes(issuerDidDocControllerVerificationMethod)) {
                throw new Error(issuerDidDocControllerVerificationMethod + ' is not a controller of ' + params.issuerDid);
            }
            const issuerPublicKeyId = params.issuerVerificationMethodId;
            let issuerPublicKeyVerMethod = issuerDidDoc.verificationMethod.find((x) => x.id == issuerPublicKeyId);
            if (issuerPublicKeyVerMethod === null || issuerPublicKeyVerMethod === undefined) {
                const { didDocument: controllerDidDocT } = yield this.hsDid.resolve({
                    did: issuerDidDocControllerVerificationMethod,
                });
                const controllerDidDoc = controllerDidDocT;
                issuerPublicKeyVerMethod = controllerDidDoc.verificationMethod.find((x) => x.id == issuerPublicKeyId);
            }
            // Connvert the 45 byte pub key of issuer into 48 byte
            const { publicKeyMultibase: issuerPublicKeyMultibase } = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                publicKey: issuerPublicKeyVerMethod.publicKeyMultibase,
            });
            issuerPublicKeyVerMethod.publicKeyMultibase = issuerPublicKeyMultibase;
            const issuerController = {
                '@context': constants_1.DID.CONTROLLER_CONTEXT,
                id: issuerDidDoc.id,
                assertionMethod: issuerDidDoc.assertionMethod,
            };
            const purpose = new AssertionProofPurpose({
                controller: issuerController,
            });
            const issuerKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(Object.assign({ privateKeyMultibase: '' }, issuerPublicKeyVerMethod));
            const vcSuite_issuer = new ed25519_signature_2020_1.Ed25519Signature2020({
                verificationMethod: issuerPublicKeyId,
                key: issuerKeyPair,
            });
            /* eslint-disable */
            const that = this;
            /* eslint-enable */
            const result = yield vc_js_1.default.verify({
                presentation: params.signedPresentation,
                presentationPurpose,
                purpose,
                suite: [vpSuite_holder, vcSuite_issuer],
                documentLoader,
                unsignedPresentation: true,
                checkStatus: function (options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield that.vc.checkCredentialStatus({ credentialId: options.credential.id });
                    });
                },
            });
            return result;
        });
    }
    signByClientSpec(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.holderDid) {
                throw new Error('HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
            }
            if (!params.presentation) {
                throw new Error('HID-SSI-SDK:: params.presentation is required for signinng a presentation');
            }
            if (!params.challenge) {
                throw new Error('HID-SSI-SDK:: params.challenge is required for signinng a presentation');
            }
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: params.verificationMethodId is required for signinng a presentation');
            }
            if (!this.hsDid) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            let resolvedDidDoc;
            if (params.holderDid) {
                resolvedDidDoc = yield this.hsDid.resolve({ did: params.holderDid });
            }
            else {
                throw new Error('holderDid should be provided');
            }
            const vcs = [];
            params.presentation.verifiableCredential.forEach((vc) => {
                return vcs.push(jcs_1.JCS.cannonicalize(vc));
            });
            params.presentation.verifiableCredential = Array();
            params.presentation.verifiableCredential = vcs;
            const EthereumEip712Signature2021obj = new ethereumeip712signature2021suite_1.EthereumEip712Signature2021({}, params.web3Obj);
            const proof = yield EthereumEip712Signature2021obj.createProof({
                document: params.presentation,
                purpose: new jsonld_signatures_2.purposes.AuthenticationProofPurpose({
                    challenge: params.challenge,
                    domain: params.domain,
                    controller: {
                        '@context': constants_1.DID.CONTROLLER_CONTEXT,
                        id: resolvedDidDoc.didDocument.id,
                        authentication: resolvedDidDoc.didDocument.authentication,
                    },
                }),
                verificationMethod: params.verificationMethodId,
                date: new Date().toISOString(),
                documentLoader,
                domain: params.domain ? { name: params.domain } : undefined,
            });
            params.presentation.proof = proof;
            const signedVP = params.presentation;
            return signedVP;
        });
    }
    verifyByClientSpec(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (params.holderDid && params.holderDidDocSigned) {
                    throw new Error('HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
                }
                if (!params.issuerDid) {
                    throw new Error('HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
                }
                if (!params.challenge) {
                    throw new Error('HID-SSI-SDK:: params.challenge is required for verifying a presentation');
                }
                if (!params.holderVerificationMethodId) {
                    throw new Error('HID-SSI-SDK:: params.holderVerificationMethodId is required for verifying a presentation');
                }
                if (!params.issuerVerificationMethodId) {
                    throw new Error('HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
                }
                if (!this.vc || !this.hsDid) {
                    throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
                }
                if (!params.signedPresentation.proof) {
                    throw new Error('HID-SSI-SDK:: params.signedPresentation must be signed');
                }
                // Holder DID
                let resolvedDidDoc;
                if (params.holderDid) {
                    resolvedDidDoc = yield this.hsDid.resolve({ did: params.holderDid });
                }
                else if (params.holderDidDocSigned) {
                    resolvedDidDoc = {};
                    resolvedDidDoc.didDocument = params.holderDidDocSigned;
                }
                else {
                    throw new Error('Either holderDid or holderDidDocSigned should be provided');
                }
                // Issuer DID
                const { didDocument: issuerDID } = yield this.hsDid.resolve({ did: params.issuerDid });
                if (issuerDID === null || issuerDID === undefined) {
                    throw new Error('Issuer DID is not registered');
                }
                const publicKeyId = params.issuerVerificationMethodId;
                const issuerDidDoc = issuerDID;
                const publicKeyVerMethod = issuerDidDoc.verificationMethod.find((x) => x.id == publicKeyId);
                // TODO: Get rid of this hack later.
                // Convert 45 byte publick key into 48
                const { publicKeyMultibase } = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                    publicKey: publicKeyVerMethod.publicKeyMultibase,
                });
                publicKeyVerMethod.publicKeyMultibase = publicKeyMultibase;
                const assertionController = {
                    '@context': ['DID.CONTROLLER_CONTEXT'],
                    id: issuerDidDoc.id,
                    assertionMethod: issuerDidDoc.assertionMethod,
                };
                const keyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(Object.assign({ privateKeyMultibase: '' }, publicKeyVerMethod));
                const suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                    verificationMethod: publicKeyId,
                    key: keyPair,
                });
                const EthereumEip712Signature2021obj = new ethereumeip712signature2021suite_1.EthereumEip712Signature2021({}, params.web3Obj);
                /* eslint-disable */
                const that = this;
                const checkStatus = function (options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield that.vc.checkCredentialStatus({ credentialId: options.credential.id });
                    });
                };
                let finalResult = {
                    verified: false,
                    credentialResults: Array(),
                    presentationResult: {},
                    error: null,
                };
                switch (params.signedPresentation.proof['type']) {
                    case 'EthereumEip712Signature2021': {
                        const res = Array();
                        const VCs = params.signedPresentation.verifiableCredential;
                        for (let i = 0; i < VCs.length; i++) {
                            const result = yield vc_js_1.default.verifyCredential({
                                credential: JSON.parse(VCs[i]),
                                controller: assertionController,
                                suite,
                                documentLoader,
                                checkStatus,
                            });
                            res.push(result);
                        }
                        const proof = params.signedPresentation.proof;
                        const document = Object.assign({}, params.signedPresentation);
                        delete document.proof;
                        const verificaitonResult = yield EthereumEip712Signature2021obj.verifyProof({
                            document,
                            domain: params.domain ? { name: params.domain } : undefined,
                            proof,
                            types: params.signedPresentation.proof['eip712'].types,
                            purpose: new AuthenticationProofPurpose({
                                challenge: params.challenge,
                                domain: params.domain,
                                controller: {
                                    '@context': 'DID.CONTROLLER_CONTEXT',
                                    id: resolvedDidDoc.didDocument.id,
                                    authentication: resolvedDidDoc.didDocument.authentication,
                                },
                            }),
                            documentLoader,
                        });
                        if (!verificaitonResult.verified) {
                            throw verificaitonResult.error;
                        }
                        finalResult = {
                            verified: true,
                            credentialResults: res,
                            presentationResult: verificaitonResult,
                            error: null,
                        };
                        break;
                    }
                    case 'Ed25519Signature2020': {
                        throw new Error('HID-SSI-SDK:: Error: Ed25519Signature2020 is not supported yet');
                        break;
                    }
                    default: {
                        throw new Error('HID-SSI-SDK:: Error: Invalid proof type');
                    }
                }
                return finalResult;
            }
            catch (error) {
                return {
                    verified: false,
                    credentialResults: Array(),
                    presentationResult: {},
                    error: error,
                };
            }
        });
    }
}
exports.default = HypersignVerifiablePresentation;
