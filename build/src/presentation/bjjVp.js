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
const vc_js_1 = __importDefault(require("vc-js"));
const jsonld_signatures_1 = __importDefault(require("jsonld-signatures"));
const did_1 = __importDefault(require("../did/did"));
const utils_1 = __importDefault(require("../utils"));
const vc_1 = __importDefault(require("../credential/vc"));
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonld_signatures_1.default.purposes;
const constants_1 = require("../constants");
const v1_1 = __importDefault(require("../../libs/w3cache/v1"));
const babyjubjub2021_1 = require("@hypersign-protocol/babyjubjub2021");
const babyjubjubsignature2021_1 = require("@hypersign-protocol/babyjubjubsignature2021");
const documentLoader = jsonld_signatures_1.default.extendContextLoader(v1_1.default);
class HyperSignBJJVP {
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
    signByClientSpec(params) {
        throw new Error('Method not implemented.');
    }
    verifyByClientSpec(params) {
        throw new Error('Method not implemented.');
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
     *  - params.domain               : Domain url
     * @returns {Promise<IVerifiablePresentation>}
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
                throw new Error('HID-SSI-SDK:: params.presentation is required for signing a presentation');
            }
            if (!params.challenge) {
                throw new Error('HID-SSI-SDK:: params.challenge is required for signing a presentation');
            }
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: params.verificationMethodId is required for signing a presentation');
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
                throw new Error('HID-SSI-SDK:: params.holderDid or params.holderDidDocSigned is required for signing a presentation');
            }
            const { didDocument: signerDidDoc } = resolvedDidDoc;
            // TODO: take verification method from params
            const publicKeyId = params.verificationMethodId; // TODO: bad idea -  should not hardcode it.
            const publicKeyVerMethod = signerDidDoc['verificationMethod'].find((x) => x.id == publicKeyId);
            const keyPair = yield babyjubjub2021_1.BabyJubJubKeys2021.fromKeys({
                privateKeyMultibase: params.privateKeyMultibase,
                publicKeyMultibase: publicKeyVerMethod.publicKeyMultibase,
                options: {
                    id: publicKeyVerMethod.id,
                    controller: publicKeyVerMethod.controller,
                },
            });
            const suite = new babyjubjubsignature2021_1.BabyJubJubSignature2021Suite({
                verificationMethod: publicKeyId,
                key: keyPair,
            });
            params.presentation['@context'].push('https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BJJSignature2021.jsonld');
            const signedVP = yield jsonld_signatures_1.default.sign(params.presentation, {
                suite,
                purpose: new AuthenticationProofPurpose({
                    controller: {
                        '@context': ['https://www.w3.org/2018/credentials/v1'],
                        id: publicKeyId,
                        authentication: [publicKeyId],
                    },
                    domain: params.domain,
                    challenge: params.challenge,
                }),
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
     *  - params.issuerVerificationMethodId : verificationMethodId of issuer
     *  - params.domain                     : Optional domain
     *  - params.challenge                  : Random challenge
     * @returns {Promise<object>}
     */
    verify(params) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            /* eslint-disable */
            const that = this;
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
            const credentialResult = Array();
            const verifiableCredential = params.signedPresentation.verifiableCredential;
            for (let i = 0; i < verifiableCredential.length; i++) {
                if (((_a = verifiableCredential[i].proof) === null || _a === void 0 ? void 0 : _a.type) === 'BabyJubJubSignatureProof2021') {
                    const res = yield this.hsDid.resolve({ did: verifiableCredential[i].issuer });
                    const didDocument = res.didDocument;
                    const vm = didDocument.verificationMethod.find((x) => x.id == params.issuerVerificationMethodId);
                    const credentailRes = yield this.verifyProof(verifiableCredential[i], {
                        suite: new babyjubjubsignature2021_1.BabyJubJubSignatureProof2021({
                            key: yield babyjubjub2021_1.BabyJubJubKeys2021.fromKeys({
                                publicKeyMultibase: vm === null || vm === void 0 ? void 0 : vm.publicKeyMultibase,
                                options: {
                                    id: vm === null || vm === void 0 ? void 0 : vm.id,
                                    controller: vm === null || vm === void 0 ? void 0 : vm.controller,
                                },
                            }),
                        }),
                    });
                    credentialResult.push(credentailRes);
                }
                else {
                    const credentailRes = yield that.vc.bjjVC.verify({
                        credential: verifiableCredential[i],
                        issuerDid: verifiableCredential[i].issuer,
                        verificationMethodId: (_b = verifiableCredential[i].proof) === null || _b === void 0 ? void 0 : _b.verificationMethod,
                    });
                    credentialResult.push(credentailRes);
                }
            }
            const { didDocument: holderDID } = resolvedDidDoc;
            const holderDidDoc = holderDID;
            const holderPublicKeyId = params.holderVerificationMethodId;
            const holderPublicKeyVerMethod = holderDidDoc.verificationMethod.find((x) => x.id == holderPublicKeyId);
            const holderController = {
                '@context': constants_1.DID.CONTROLLER_CONTEXT,
                id: holderDidDoc.id,
                authentication: holderDidDoc.authentication,
            };
            // TODO:  need to use domainname.
            const presentationPurpose = new AuthenticationProofPurpose({
                controller: holderController,
                domain: params.domain,
                challenge: params.challenge,
            });
            const keyPair = yield babyjubjub2021_1.BabyJubJubKeys2021.fromKeys({
                publicKeyMultibase: holderPublicKeyVerMethod.publicKeyMultibase,
                options: {
                    id: holderPublicKeyVerMethod.id,
                    controller: holderPublicKeyVerMethod.controller,
                },
            });
            const vpSuite_holder = new babyjubjubsignature2021_1.BabyJubJubSignature2021Suite({
                verificationMethod: holderPublicKeyId,
                key: keyPair,
            });
            /* eslint-enable */
            const result = yield jsonld_signatures_1.default.verify(params.signedPresentation, {
                purpose: presentationPurpose,
                suite: vpSuite_holder,
                documentLoader,
                //   checkStatus: async function (options) {
                //     return await that.vc.checkCredentialStatus({ credentialId: options.credential.id });
                //   },
            });
            result.results.push({ credentialResult });
            return result;
        });
    }
    verifyProof(derivedProofs, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = derivedProofs.proof.verificationMethod;
            const result = yield jsonld_signatures_1.default.verify(derivedProofs, {
                suite: params.suite,
                purpose: new AssertionProofPurpose({
                    controller: {
                        '@context': ['https://www.w3.org/ns/did/v1'],
                        id,
                        assertionMethod: [id],
                    },
                }),
                documentLoader,
            });
            return result;
        });
    }
}
exports.default = HyperSignBJJVP;
