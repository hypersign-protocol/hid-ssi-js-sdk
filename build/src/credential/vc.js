"use strict";
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
/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
const jsonld_signatures_1 = require("jsonld-signatures");
const vc_js_1 = __importDefault(require("vc-js"));
const utils_1 = __importDefault(require("../utils"));
const schema_1 = __importDefault(require("../schema/schema"));
const did_1 = __importDefault(require("../did/did"));
const ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
const ed25519_signature_2020_1 = require("@digitalbazaar/ed25519-signature-2020");
const ed25519 = require('@stablelib/ed25519');
const credRPC_1 = require("./credRPC");
const constants_1 = require("../constants");
const credential_1 = require("../../libs/generated/ssi/credential");
const crypto_1 = __importDefault(require("crypto"));
const v1_1 = __importDefault(require("../../libs/w3cache/v1"));
const ethereumeip712signature2021suite_1 = require("ethereumeip712signature2021suite");
const documentLoader = v1_1.default;
class HypersignVerifiableCredential {
    constructor(params = {}) {
        this._checkIfAllRequiredPropsAreSent = (sentAttributes, requiredProps) => {
            return !requiredProps.some((x) => sentAttributes.indexOf(x) === -1);
        };
        this._getCredentialSubject = (schemaProperty, attributesMap) => {
            const cs = {};
            const sentPropes = Object.keys(attributesMap);
            if (schemaProperty.properties) {
                schemaProperty['propertiesParsed'] = JSON.parse(schemaProperty.properties);
            }
            const SchemaProps = Object.keys(schemaProperty['propertiesParsed']);
            let props = [];
            // Check for "additionalProperties" in schemaProperty
            if (!schemaProperty.additionalProperties) {
                if (sentPropes.length > SchemaProps.length || !this._checkIfAllRequiredPropsAreSent(SchemaProps, sentPropes))
                    throw new Error(`Only ${JSON.stringify(SchemaProps)} attributes are possible. additionalProperties is false in the schema`);
                props = SchemaProps;
            }
            else {
                props = sentPropes;
            }
            // Check all required propes
            const requiredPros = Object.values(schemaProperty.required);
            if (!this._checkIfAllRequiredPropsAreSent(sentPropes, requiredPros))
                throw new Error(`${JSON.stringify(requiredPros)} are required properties`);
            // Attach the values of props
            props.forEach((p) => {
                cs[p] = attributesMap[p];
            });
            return cs;
        };
        //
        // TODO: https://www.w3.org/TR/vc-data-model/#data-schemas
        // TODO: handle schemaUrl variable properly later.
        this._getCredentialContext = (schemaId, schemaProperties) => {
            const context = [];
            let schemaUrl;
            if (this.hsSchema && this.hsSchema.schemaRpc) {
                schemaUrl = `${this.hsSchema.schemaRpc.schemaRestEp}/${schemaId}:`;
            }
            else {
                throw new Error('Error: HypersigSchema object may not be initialized');
            }
            context.push(constants_1.VC.CREDENTAIL_BASE_CONTEXT);
            //context.push(VC.CREDENTAIL_SECURITY_SUITE);
            context.push({
                hs: schemaUrl,
            });
            const props = Object.keys(schemaProperties);
            props.forEach((x) => {
                const obj = {};
                obj[x] = `hs:${x}`;
                context.push(obj);
            });
            return context;
        };
        const { namespace, offlineSigner, nodeRpcEndpoint, nodeRestEndpoint } = params;
        this.namespace = namespace && namespace != '' ? namespace : '';
        const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
        const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
        const offlineConstuctorParams = { offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp };
        this.credStatusRPC = new credRPC_1.CredentialRPC(offlineConstuctorParams);
        this.hsDid = new did_1.default(offlineConstuctorParams);
        this.hsSchema = new schema_1.default(offlineConstuctorParams);
        this.context = [];
        this.id = '';
        this.type = [];
        this.issuer = '';
        this.issuanceDate = '';
        this.expirationDate = '';
        this.credentialSubject = {};
        this.credentialSchema = {
            id: '',
            type: constants_1.VC.CREDENTAIL_SCHEMA_VALIDATOR_TYPE,
        };
        this.credentialStatus = {
            id: '',
            type: constants_1.VC.CREDENTAIL_STATUS_TYPE,
        };
        this.proof = {};
    }
    _sign(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { privateKeyMultibase: privateKeyMultibaseConverted } = utils_1.default.convertEd25519verificationkey2020toStableLibKeysInto({
                privKey: params.privateKeyMultibase,
            });
            // TODO:  do proper checck of paramaters
            const credentialStatus = JSON.parse(params.message);
            const credentialBytes = (yield credential_1.CredentialStatus.encode(credentialStatus)).finish();
            // const messageBytes = Buffer.from(params.message);
            const signed = ed25519.sign(privateKeyMultibaseConverted, credentialBytes);
            return Buffer.from(signed).toString('base64');
        });
    }
    _dateNow(date) {
        if (date) {
            return new Date(date).toISOString().slice(0, -5) + 'Z';
        }
        else {
            return new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
        }
    }
    _sha256Hash(message) {
        const sha256 = crypto_1.default.createHash('sha256');
        return sha256.update(message).digest('hex');
    }
    _getId() {
        return __awaiter(this, void 0, void 0, function* () {
            const uuid = yield utils_1.default.getUUID();
            let id;
            if (this.namespace && this.namespace != '') {
                id = `${constants_1.VC.SCHEME}:${constants_1.VC.METHOD}:${this.namespace}:${uuid}`;
            }
            else {
                id = `${constants_1.VC.SCHEME}:${constants_1.VC.METHOD}:${uuid}`;
            }
            return id;
        });
    }
    /**
     * Initialise the offlinesigner to interact with Hypersign blockchain
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.credStatusRPC) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            yield this.credStatusRPC.init();
        });
    }
    /**
     * Generates a new credential document
     * @params
     *  - params.schemaId             : Hypersign schema id
     *  - params.subjectDid           : DID of the subject, if not provided, will be taken from subjectDidDocSigned
     *  - params.schemaContext        :
     *  - params.type                 :
     *  - params.issuerDid            :  DID of the issuer
     *  - params.expirationDate       :  Date of the expiration for this credential
     *  - params.fields               :  Schema fields values for this credential
     * @returns {Promise<IVerifiableCredential>} Result a credential document
     */
    generate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let schemaDoc = {};
            if (params.subjectDid && params.subjectDidDocSigned) {
                throw new Error('HID-SSI-SDK:: Error: Both subjectDid and subjectDidDoc cannot be passed');
            }
            if (!this.credStatusRPC) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            const issuerDid = params.issuerDid;
            const subjectDid = params.subjectDid;
            let resolvedsubjectDidDoc;
            const { didDocument: issuerDidDoc } = yield this.hsDid.resolve({ did: issuerDid });
            //
            if (params.subjectDid) {
                resolvedsubjectDidDoc = yield this.hsDid.resolve({ did: params.subjectDid });
            }
            else if (params.subjectDidDocSigned) {
                resolvedsubjectDidDoc = {};
                resolvedsubjectDidDoc.didDocument = params.subjectDidDocSigned;
            }
            else {
                throw new Error('HID-SSI-SDK:: Error: Could not resolve the subjectDid or subjectDidDoc');
            }
            const { didDocument: subjectDidDoc } = resolvedsubjectDidDoc;
            if (!issuerDidDoc) {
                throw new Error('HID-SSI-SDK:: Error: Could not fetch issuer did doc, issuer did = ' + issuerDid);
            }
            if (!subjectDidDoc) {
                throw new Error('HID-SSI-SDK:: Error: Could not fetch subject did doc, subject did = ' + subjectDid);
            }
            if (params && params.schemaContext && params.type) {
                try {
                    const context = Array();
                    context.push(constants_1.VC.CREDENTAIL_BASE_CONTEXT);
                    params.schemaContext.forEach((x) => {
                        context.push(x);
                    });
                    const issuerDid = params.issuerDid;
                    const subjectDid = params.subjectDid;
                    const expirationDate = params.expirationDate;
                    const credentialSubject = params.fields;
                    const vc = {};
                    vc['@context'] = context;
                    vc.id = yield this._getId();
                    vc.type = [];
                    vc.type.push('VerifiableCredential');
                    params.type.forEach((x) => {
                        vc.type.push(x);
                    });
                    vc.issuer = issuerDid;
                    vc.issuanceDate = this._dateNow(new Date(new Date().getTime() - 100000).toISOString());
                    vc.expirationDate = this._dateNow(expirationDate);
                    vc.credentialSubject = credentialSubject;
                    vc.credentialSubject['id'] = subjectDid && subjectDid != undefined ? subjectDid : subjectDidDoc.id;
                    // TODO: confusion here is, what would be the status of this credential at the time of its creation?
                    // If this properpty is present , then checkStatus() must be passed at the time of verification of the credential
                    // Ref: https://github.com/digitalbazaar/vc-js/blob/7e14ef27bc688194635077d243d9025c0020448b/test/10-verify.spec.js#L188
                    vc.credentialStatus = {
                        id: this.credStatusRPC.credentialRestEP + '/' + vc.id,
                        type: this.credentialStatus.type,
                    };
                    return vc;
                }
                catch (error) {
                    throw new Error('HID-SSI-SDK:: Error: Could not create credential, error = ' + error);
                }
            }
            else if (!params.schemaId) {
                throw new Error('HID-SSI-SDK:: Error: schemaId is required when schemaContext and type not passed');
            }
            try {
                schemaDoc = yield this.hsSchema.resolve({ schemaId: params.schemaId });
            }
            catch (e) {
                throw new Error('HID-SSI-SDK:: Error: Could not resolve the schema from schemaId = ' + params.schemaId);
            }
            // TODO: do proper check for date and time
            //if(params.expirationDate < new Date()) throw  new Error("Expiration date can not be lesser than current date")
            const vc = {};
            const schemaInternal = schemaDoc.schema;
            const schemaProperties = JSON.parse(schemaInternal.properties);
            // context
            vc['@context'] = this._getCredentialContext(params.schemaId, schemaProperties);
            /// TODO:  need to implement this properly
            vc.id = yield this._getId();
            // Type
            vc.type = [];
            vc.type.push('VerifiableCredential');
            vc.type.push(schemaDoc.name);
            vc.expirationDate = this._dateNow(params.expirationDate);
            vc.issuanceDate = this._dateNow(); // TODO: need to remove this.
            vc.issuer = issuerDid;
            vc.credentialSubject = {};
            vc.credentialSubject = Object.assign({}, this._getCredentialSubject(schemaDoc.schema, params.fields));
            vc.credentialSubject['id'] = subjectDid && subjectDid != undefined ? subjectDid : subjectDidDoc.id;
            vc.credentialSchema = {
                id: schemaDoc.id,
                type: this.credentialSchema.type,
            };
            // TODO: confusion here is, what would be the status of this credential at the time of its creation?
            // If this properpty is present , then checkStatus() must be passed at the time of verification of the credential
            // Ref: https://github.com/digitalbazaar/vc-js/blob/7e14ef27bc688194635077d243d9025c0020448b/test/10-verify.spec.js#L188
            vc.credentialStatus = {
                id: this.credStatusRPC.credentialRestEP + '/' + vc.id,
                type: this.credentialStatus.type,
            };
            return vc;
        });
    }
    /**
     * Generates signed credentials document and registers its status on Hypersign blockchain
     * @params
     *  - params.credential             : Hypersign credentail document
     *  - params.privateKeyMultibase    : P
     *  - params.issuerDid              : DID of the issuer
     *  - params.verificationMethodId   : Verifcation Method of Issuer
     * @returns {Promise<{
     * signedCredential: IVerifiableCredential;
     * credentialStatus: CredentialStatus;
     * credentialStatusProof: CredentialProof;
     * credentialStatusRegistrationResult?: DeliverTxResponse;
     * }>}
     */
    issue(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to issue credential');
            }
            if (!params.credential) {
                throw new Error('HID-SSI-SDK:: Error: params.credential is required to issue credential');
            }
            if (!params.privateKeyMultibase) {
                throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to issue credential');
            }
            if (!params.issuerDid) {
                throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to issue credential');
            }
            if (!this.credStatusRPC) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            if (params.registerCredential == undefined) {
                params.registerCredential = true;
            }
            const { didDocument: signerDidDoc } = yield this.hsDid.resolve({ did: params.issuerDid });
            if (signerDidDoc === null || signerDidDoc === undefined)
                throw new Error('HID-SSI-SDK:: Error: Could not resolve issuerDid = ' + params.issuerDid);
            // TODO: take verification method from params
            const publicKeyId = params.verificationMethodId; // TODO: bad idea -  should not hardcode it.
            const publicKeyVerMethod = signerDidDoc['verificationMethod'].find((x) => x.id == publicKeyId);
            if (!publicKeyVerMethod) {
                throw new Error('HID-SSI-SDK:: Error: Could not find verification method for id = ' + params.verificationMethodId);
            }
            const convertedKeyPair = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                publicKey: publicKeyVerMethod.publicKeyMultibase,
            });
            publicKeyVerMethod['publicKeyMultibase'] = convertedKeyPair.publicKeyMultibase;
            const keyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(Object.assign({ privateKeyMultibase: params.privateKeyMultibase }, publicKeyVerMethod));
            const suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                verificationMethod: publicKeyId,
                key: keyPair,
            });
            /// Before we issue the credential the credential status has to be added
            /// for that we will call RegisterCredentialStatus RPC
            //  Let us generate credentialHash first
            const credentialHash = this._sha256Hash(JSON.stringify(params.credential));
            const credentialStatus = {
                claim: {
                    id: params.credential.id,
                    currentStatus: constants_1.VC.CRED_STATUS_TYPES.LIVE,
                    statusReason: 'Credential is active',
                },
                issuer: params.credential.issuer,
                issuanceDate: params.credential.issuanceDate,
                expirationDate: params.credential.expirationDate,
                credentialHash,
            };
            const proofValue = yield this._sign({
                message: JSON.stringify(credentialStatus),
                privateKeyMultibase: params.privateKeyMultibase,
            });
            // check params.issuer is a controller of params.credential.issuer
            const { didDocument: issuerDID } = yield this.hsDid.resolve({ did: params.credential.issuer });
            if (issuerDID === null || issuerDID === undefined)
                throw new Error('Could not resolve issuerDid = ' + params.credential.issuer);
            const credIssuerDidDoc = issuerDID;
            const credIssuerController = credIssuerDidDoc.controller;
            if (!credIssuerController.includes(params.issuerDid)) {
                throw new Error(params.issuerDid + ' is not a controller of ' + params.credential.issuer);
            }
            // const issuerDidDoc: Did = issuerDID as Did;
            // const issuerPublicKeyId = params.verificationMethodId;
            // const issuerPublicKeyVerMethod: VerificationMethod = issuerDidDoc.verificationMethod.find(
            //   (x) => x.id == issuerPublicKeyId
            // ) as VerificationMethod;
            const issuerPublicKeyVerMethod = publicKeyVerMethod;
            const proof = {
                type: constants_1.VC.VERIFICATION_METHOD_TYPE,
                created: this._dateNow(),
                updated: this._dateNow(),
                verificationMethod: issuerPublicKeyVerMethod.id,
                proofValue,
                proofPurpose: constants_1.VC.PROOF_PURPOSE,
            };
            /// RegisterCRedeRPC
            const signedVC = yield vc_js_1.default.issue({
                credential: params.credential,
                suite,
                documentLoader,
            });
            let credentialStatusRegistrationResult;
            if (params.registerCredential) {
                credentialStatusRegistrationResult = yield this.credStatusRPC.registerCredentialStatus(credentialStatus, proof);
                if (!credentialStatusRegistrationResult || credentialStatusRegistrationResult.code != 0) {
                    throw new Error('HID-SSI-SDK:: Error while issuing the credential error = ' + credentialStatusRegistrationResult.rawLog);
                }
                return {
                    signedCredential: signedVC,
                    credentialStatus,
                    credentialStatusProof: proof,
                    credentialStatusRegistrationResult,
                };
            }
            return { signedCredential: signedVC, credentialStatus, credentialStatusProof: proof };
        });
    }
    // Ref: https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L251
    /**
     * Verfies signed/issued credential
     * @params
     *  - params.credential             : Signed Hypersign credentail document of type IVerifiableCredential
     *  - params.issuerDid              : DID of the issuer
     *  - params.verificationMethodId   : Verifcation Method of Issuer
     * @returns {Promise<object>}
     */
    verify(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.credential) {
                throw new Error('HID-SSI-SDK:: params.credential is required to verify credential');
            }
            if (!params.credential.proof) {
                throw new Error('HID-SSI-SDK:: params.credential.proof is required to verify credential');
            }
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to verify credential');
            }
            if (!params.issuerDid) {
                throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to verify credential');
            }
            const { didDocument: issuerDID } = yield this.hsDid.resolve({ did: params.issuerDid });
            const issuerDidDoc = issuerDID;
            const publicKeyId = params.verificationMethodId;
            const publicKeyVerMethod = issuerDidDoc.verificationMethod.find((x) => x.id == publicKeyId);
            // TODO: Get rid of this hack later.
            // Convert 45 byte publick key into 48
            const { publicKeyMultibase } = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                publicKey: publicKeyVerMethod.publicKeyMultibase,
            });
            publicKeyVerMethod.publicKeyMultibase = publicKeyMultibase;
            const assertionController = {
                '@context': constants_1.DID.CONTROLLER_CONTEXT,
                id: issuerDidDoc.id,
                assertionMethod: issuerDidDoc.assertionMethod,
            };
            const keyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(Object.assign({ privateKeyMultibase: '' }, publicKeyVerMethod));
            const suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                verificationMethod: publicKeyId,
                key: keyPair,
            });
            /* eslint-disable */
            const that = this;
            /* eslint-enable */
            const result = yield vc_js_1.default.verifyCredential({
                credential: params.credential,
                controller: assertionController,
                suite,
                documentLoader,
                checkStatus: function (options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield that.checkCredentialStatus({ credentialId: options.credential.id });
                    });
                },
            });
            return result;
        });
    }
    /**
     * Resolves credential status from Hypersign Blokchain
     * @params
     *  - params.credentialId           : Verifiable credential id
     * @returns {Promise<CredentialStatus>}
     */
    resolveCredentialStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params || !params.credentialId)
                throw new Error('HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
            const credentialStatus = yield this.credStatusRPC.resolveCredentialStatus(params.credentialId);
            return credentialStatus;
        });
    }
    /**
     * Update credential status in blockchain Hypersign Blokchain
     * @params
     *  - params.credentialStatus           : Status of the credential of type CredentialStatus
     *  - params.issuerDid                  : DID of the issuer
     *  - params.verificationMethodId       : verificationMethodId
     *  - params.privateKeyMultibase        : privateKey of the issuer
     *  - params.status                     : Status LIVE/REVOKE/SUSPENDED
     *  - params.statusReason               : Reason for the status change
     * @returns {Promise<DeliverTxResponse>}
     */
    updateCredentialStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to update credential status');
            }
            if (!params.credentialStatus) {
                throw new Error('HID-SSI-SDK:: Error: params.credentialStatus is required to update credential status');
            }
            if (!params.privateKeyMultibase) {
                throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update credential status');
            }
            if (!params.issuerDid) {
                throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to update credential status');
            }
            if (!params.status) {
                throw new Error('HID-SSI-SDK:: Error: params.status is required to update credential status');
            }
            if (!this.credStatusRPC) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            const { didDocument: signerDidDoc } = yield this.hsDid.resolve({ did: params.issuerDid });
            if (!signerDidDoc)
                throw new Error('Could not resolve issuerDid = ' + params.issuerDid);
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
            /// Before we issue the credential the credential status has to be added
            /// for that we will call RegisterCredentialStatus RPC
            //  Let us generate credentialHash first
            params.status = params.status.toUpperCase();
            const claim = params.credentialStatus.claim;
            const credentialStatus = {
                claim: {
                    id: claim.id,
                    currentStatus: constants_1.VC.CRED_STATUS_TYPES[params.status],
                    statusReason: params.statusReason ? params.statusReason : constants_1.VC.CRED_STATUS_REASON_TYPES[params.status],
                },
                issuer: params.credentialStatus.issuer,
                issuanceDate: params.credentialStatus.issuanceDate,
                expirationDate: params.credentialStatus.expirationDate,
                credentialHash: params.credentialStatus.credentialHash,
            };
            const proofValue = yield this._sign({
                message: JSON.stringify(credentialStatus),
                privateKeyMultibase: params.privateKeyMultibase,
            });
            const { didDocument: issuerDID } = yield this.hsDid.resolve({ did: params.credentialStatus.issuer });
            const issuerDidDoc = issuerDID;
            const issuerDidDocController = issuerDidDoc.controller;
            const verificationMethodController = params.verificationMethodId.split('#')[0];
            if (!issuerDidDocController.includes(verificationMethodController)) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId does not belong to issuerDid');
            }
            const { didDocument: controllerDidDoc } = yield this.hsDid.resolve({ did: verificationMethodController });
            if (!controllerDidDoc)
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId does not belong to issuerDid');
            const didDocofController = controllerDidDoc;
            const issuerPublicKeyId = params.verificationMethodId;
            const issuerPublicKeyVerMethod = didDocofController.verificationMethod.find((x) => x.id == issuerPublicKeyId);
            const proof = {
                type: constants_1.VC.VERIFICATION_METHOD_TYPE,
                created: params.credentialStatus.issuanceDate,
                updated: this._dateNow(),
                verificationMethod: issuerPublicKeyVerMethod.id,
                proofValue,
                proofPurpose: constants_1.VC.PROOF_PURPOSE,
            };
            /// RegisterCRedeRPC
            // We use the same RPC (i.e. MsgRegisterCredentialStatus) for register and update of credential status on blockchain
            const resp = yield this.credStatusRPC.registerCredentialStatus(credentialStatus, proof);
            if (!resp || resp.code != 0) {
                throw new Error('HID-SSI-SDK:: Error while revoking the credential error = ' + resp.rawLog);
            }
            return resp;
        });
    }
    checkCredentialStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params || !params.credentialId)
                throw new Error('HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
            const { credentialId } = params;
            const credentialStatus = yield this.credStatusRPC.resolveCredentialStatus(credentialId);
            if (!credentialStatus) {
                throw new Error('HID-SSI-SDK:: Error: while checking credential status of credentialID ' + credentialId);
            }
            const claim = credentialStatus.claim;
            const { currentStatus, statusReason } = claim;
            /// TODO:  probably we should also verify the credential HASH by recalculating the hash of the crdential and
            // matching with credentialHash property.
            // const { credentialHash } = credentialStatus;
            if (currentStatus != constants_1.VC.CRED_STATUS_TYPES.LIVE) {
                console.log('WARN: Credential status is  not LIVE, currentStatus ' + currentStatus);
                console.log('WARN: Status reason is ' + statusReason);
                return { verified: false };
            }
            return { verified: true };
        });
    }
    registerCredentialStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { credentialStatus, credentialStatusProof } = params;
            if (!credentialStatus || !credentialStatusProof)
                throw new Error('HID-SSI-SDK:: Error: credentialStatus and credentialStatusProof are required to register credential status');
            if (!this.credStatusRPC) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            const resp = yield this.credStatusRPC.registerCredentialStatus(credentialStatus, credentialStatusProof);
            if (!resp || resp.code != 0) {
                throw new Error('HID-SSI-SDK:: Error while issuing the credential error = ' + resp.rawLog);
            }
            return resp;
        });
    }
    generateRegisterCredentialStatusTxnMessage(credentialStatus, proof) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!credentialStatus || !proof)
                throw new Error('HID-SSI-SDK:: Error: credentialStatus and proof are required to register credential status');
            if (!this.credStatusRPC) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            const txnMessage = yield this.credStatusRPC.generateCredentialStatusTxnMessage(credentialStatus, proof);
            return txnMessage;
        });
    }
    registerCredentialStatusTxnBulk(txnMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!txnMessage)
                throw new Error('HID-SSI-SDK:: Error: txnMessage is required to register credential status');
            if (!this.credStatusRPC) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            const resp = yield this.credStatusRPC.registerCredentialStatusBulk(txnMessage);
            if (!resp || resp.code != 0) {
                throw new Error('HID-SSI-SDK:: Error while issuing the credential error = ' + resp.rawLog);
            }
            return resp;
        });
    }
    /**
     * Issue credentials document with EthereumEip712Signature2021
   
    */
    issueByClientSpec(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to issue credential');
            }
            if (!params.issuerDid) {
                throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to issue credential');
            }
            if (!params.credential) {
                throw new Error('HID-SSI-SDK:: Error: params.credential is required to issue credential');
            }
            if (!this.credStatusRPC) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized');
            }
            if (!params.web3Obj) {
                throw new Error('HID-SSI-SDK:: Error: prams.web3Obj should be passed');
            }
            if (params.type == undefined) {
                params.type = 'Document';
            }
            if (params.registerCredential == undefined) {
                params.registerCredential = true;
            }
            const { didDocument: signerDidDoc } = yield this.hsDid.resolve({ did: params.issuerDid });
            if (signerDidDoc === null || signerDidDoc === undefined)
                throw new Error('HID-SSI-SDK:: Error: Could not resolve issuerDid = ' + params.issuerDid);
            const publicKeyId = params.verificationMethodId;
            const publicKeyVerMethod = signerDidDoc['verificationMethod'].find((x) => x.id == publicKeyId);
            if (!publicKeyVerMethod) {
                throw new Error('HID-SSI-SDK:: Error: Could not find verification method for id = ' + params.verificationMethodId);
            }
            const EthereumEip712Signature2021obj = new ethereumeip712signature2021suite_1.EthereumEip712Signature2021({}, params.web3Obj);
            const proof = yield EthereumEip712Signature2021obj.createProof({
                document: params.credential,
                purpose: new jsonld_signatures_1.purposes.AssertionProofPurpose(),
                verificationMethod: params.verificationMethodId,
                primaryType: params.type,
                date: new Date().toISOString(),
                domain: params.domain ? { name: params.domain } : undefined,
                documentLoader,
            });
            params.credential.proof = proof;
            const signedVC = params.credential;
            const { didDocument: issuerDID } = yield this.hsDid.resolve({ did: params.credential.issuer });
            if (issuerDID === null || issuerDID === undefined)
                throw new Error('Could not resolve issuerDid = ' + params.credential.issuer);
            const credIssuerDidDoc = issuerDID;
            const credIssuerController = credIssuerDidDoc.controller;
            if (!credIssuerController.includes(params.issuerDid)) {
                throw new Error(params.issuerDid + ' is not a controller of ' + params.credential.issuer);
            }
            if (params.registerCredential) {
                // register credential status
                return new Error('HID-SSI-SDK:: Error: registerCredential is not implemented');
            }
            return { signedCredential: signedVC };
        });
    }
    // verify credentila issued by client spec
    verifyByClientSpec(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.credential) {
                throw new Error('HID-SSI-SDK:: params.credential is required to verify credential');
            }
            if (!params.credential.proof) {
                throw new Error('HID-SSI-SDK:: params.credential.proof is required to verify credential');
            }
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to verify credential');
            }
            if (!params.issuerDid) {
                throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to verify credential');
            }
            if (!params.web3Obj) {
                throw new Error('HID-SSI-SDK:: Error: prams.web3Obj should be passed');
            }
            const { didDocument } = yield this.hsDid.resolve({ did: params.issuerDid });
            if (didDocument === null || didDocument === undefined)
                throw new Error('HID-SSI-SDK:: Error: Could not resolve issuerDid = ' + params.issuerDid);
            const EthereumEip712Signature2021obj = new ethereumeip712signature2021suite_1.EthereumEip712Signature2021({}, params.web3Obj);
            const { proof } = params.credential;
            const verificationResult = yield EthereumEip712Signature2021obj.verifyProof({
                proof: proof,
                document: params.credential,
                types: proof.eip712.types,
                domain: proof.eip712.domain,
                purpose: new jsonld_signatures_1.purposes.AssertionProofPurpose(),
                documentLoader,
            });
            return verificationResult;
        });
    }
}
exports.default = HypersignVerifiableCredential;
