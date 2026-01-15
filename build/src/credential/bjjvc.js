"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jsonld_signatures_1 = __importDefault(require("jsonld-signatures"));
const jsonld_signatures_2 = require("jsonld-signatures");
const utils_1 = __importDefault(require("../utils"));
const schema_1 = __importDefault(require("../schema/schema"));
const did_1 = __importDefault(require("../did/did"));
const jsonSchemaValidator = __importStar(require("@cfworker/json-schema"));
const jsonld_signatures_3 = __importDefault(require("jsonld-signatures"));
const { AssertionProofPurpose } = jsonld_signatures_3.default.purposes;
const credRPC_1 = require("./credRPC");
const constants_1 = require("../constants");
const v1_1 = __importDefault(require("../../libs/w3cache/v1"));
const jsonld_signatures_4 = require("jsonld-signatures");
const credential_service_1 = __importDefault(require("../ssiApi/services/credential/credential.service"));
const constant = __importStar(require("../constants"));
const babyjubjub2021_1 = require("babyjubjub2021");
const babyjubjubsignature2021_1 = require("babyjubjubsignature2021");
const { Merklizer } = require('@iden3/js-jsonld-merklization');
const documentLoader = (0, jsonld_signatures_4.extendContextLoader)(v1_1.default);
class HypersignBJJVerifiableCredential {
    constructor(params = {}) {
        const { namespace, offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, entityApiSecretKey } = params;
        this.documentL = documentLoader;
        this.namespace = namespace && namespace != '' ? namespace : '';
        const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
        const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
        const offlineConstuctorParams = { offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp };
        this.credStatusRPC = new credRPC_1.CredentialRPC(offlineConstuctorParams);
        this.hsDid = new did_1.default(offlineConstuctorParams);
        this.hsSchema = new schema_1.default(offlineConstuctorParams);
        if (entityApiSecretKey && entityApiSecretKey != '') {
            this.credentialApiService = new credential_service_1.default(entityApiSecretKey);
            this.credStatusRPC = null;
        }
        else {
            this.credentialApiService = null;
        }
        this['@context'] = [];
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
    _jsonLdSign(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { credentialStatus, privateKeyMultibase, verificationMethodId } = params;
            const keyPair = yield babyjubjub2021_1.BabyJubJubKeys2021.fromKeys({
                options: { id: verificationMethodId, controller: verificationMethodId },
                privateKeyMultibase: privateKeyMultibase,
                publicKeyMultibase: params.publicKeyMultibase,
            });
            const suite = new babyjubjubsignature2021_1.BabyJubJubSignature2021Suite({ key: keyPair, verificationMethod: verificationMethodId });
            const signedCredStatus = yield jsonld_signatures_3.default.sign(credentialStatus, {
                suite,
                purpose: new AssertionProofPurpose(),
                documentLoader: v1_1.default,
            });
            return signedCredStatus.proof;
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
    _toTitleCase(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        });
    }
    /**
     * Initialise the offlinesigner to interact with Hypersign blockchain
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.credStatusRPC && !this.credentialApiService) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized with entityApiSecretKey');
            }
            if (this.credStatusRPC) {
                yield this.credStatusRPC.init();
            }
            if (this.credentialApiService) {
                yield this.credentialApiService.auth();
            }
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
            // const { didDocument: issuerDidDoc } = await this.hsDid.resolve({ did: issuerDid });
            if (params.subjectDid) {
                // resolvedsubjectDidDoc = await this.hsDid.resolve({ did: params.subjectDid });
            }
            else if (params.subjectDidDocSigned) {
                resolvedsubjectDidDoc = {};
                resolvedsubjectDidDoc.didDocument = params.subjectDidDocSigned;
            }
            else {
                throw new Error('HID-SSI-SDK:: Error: Could not resolve the subjectDid or subjectDidDoc');
            }
            // const { didDocument: subjectDidDoc } = resolvedsubjectDidDoc;
            // if (!issuerDidDoc) {
            //   throw new Error('HID-SSI-SDK:: Error: Could not fetch issuer did doc, issuer did = ' + issuerDid);
            // }
            // if (!subjectDidDoc) {
            //   throw new Error('HID-SSI-SDK:: Error: Could not fetch subject did doc, subject did = ' + subjectDid);
            // }
            if (params && params.schemaContext && params.type) {
                try {
                    const context = Array();
                    context.push(constants_1.VC.CREDENTAIL_BASE_CONTEXT);
                    context.push(constant.DID_BabyJubJubKey2021.BABYJUBJUBSIGNATURE);
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
                    vc.credentialSubject['id'] = subjectDid; //subjectDid && subjectDid != undefined ? subjectDid : subjectDidDoc.id;
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
            // const schemaInternal = schemaDoc.schema as SchemaProperty;
            // const schemaProperties = JSON.parse(schemaInternal.properties as string);
            // const schemaName = schemaDoc.name as string;
            // context
            // vc['@context'] = this._getCredentialContext(params.schemaId, schemaProperties, schemaName);
            vc['@context'] = [
                constants_1.VC.CREDENTAIL_BASE_CONTEXT,
                constant.DID_BabyJubJubKey2021.DID_BABYJUBJUBKEY2021,
                constant.DID_BabyJubJubKey2021.BABYJUBJUBSIGNATURE,
            ];
            vc['@context'].push(constants_1.VC.CONTEXT_HypersignCredentialStatus2023);
            const JsonSchema = this.hsSchema.vcJsonSchema(schemaDoc);
            vc['@context'].push(JsonSchema.$metadata.jsonLdContext);
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
            // ToDo: Implement Schema validation (JSON Schema Validator)
            const validator = new jsonSchemaValidator.Validator(JsonSchema, '2020-12', true);
            const result = validator.validate({
                credentialSubject: Object.assign({}, params.fields),
            });
            if (!result.valid) {
                throw result.errors;
            }
            // vc.credentialSubject = {
            //   ...this._getCredentialSubject(schemaDoc.schema as SchemaProperty, params.fields),
            // };
            vc.credentialSubject = params.fields;
            vc.credentialSubject['id'] = subjectDid; // subjectDid && subjectDid != undefined ? subjectDid : subjectDidDoc.id;
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
            // const { didDocument: signerDidDoc } = await this.hsDid.resolve({ did: params.issuerDid });
            let signerDidDoc;
            if (params.issuerDidDoc) {
                console.log('Got issuerDID doc so no need to resolve');
                signerDidDoc = params.issuerDidDoc;
            }
            else {
                console.log('Did not get issuerDID doc, need to resolve');
                signerDidDoc = (yield this.hsDid.resolve({ did: params.issuerDid })).didDocument;
            }
            if (signerDidDoc === null || signerDidDoc === undefined)
                throw new Error('HID-SSI-SDK:: Error: Could not resolve issuerDid = ' + params.issuerDid);
            const publicKeyId = params.verificationMethodId;
            const publicKeyVerMethod = signerDidDoc['verificationMethod'].find((x) => x.id == publicKeyId);
            if (!publicKeyVerMethod) {
                throw new Error('HID-SSI-SDK:: Error: Could not find verification method for id = ' + params.verificationMethodId);
            }
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
            /// Before we issue the credential the credential status has to be added
            /// for that we will call RegisterCredentialStatus RPC
            //  Let us generate credentialHash first
            // generating hash using merkelroot hash
            const merkelizerObj = yield Merklizer.merklizeJSONLD(JSON.stringify(params.credential), {
                documentLoader,
            });
            let credentialHash = yield merkelizerObj.mt.root();
            credentialHash = Buffer.from(credentialHash.bytes).toString('hex');
            const credentialStatus = {
                '@context': [constant.VC.CREDENTIAL_STATUS_CONTEXT, constant.DID_BabyJubJubKey2021.BABYJUBJUBSIGNATURE],
                id: params.credential.id,
                issuer: params.credential.issuer,
                issuanceDate: params.credential.issuanceDate,
                remarks: 'Credential is active',
                credentialMerkleRootHash: credentialHash,
            };
            const credProof = yield this._jsonLdSign({
                credentialStatus,
                privateKeyMultibase: params.privateKeyMultibase,
                verificationMethodId: params.verificationMethodId,
                publicKeyMultibase: publicKeyVerMethod.publicKeyMultibase,
            });
            let issuerDID;
            if (params.issuerDidDoc) {
                console.log('Got issuerDID doc so no need to resolve');
                issuerDID = params.issuerDidDoc;
            }
            else {
                console.log('Did not get issuerDID doc, need to resolve');
                issuerDID = (yield this.hsDid.resolve({ did: params.credential.issuer })).didDocument;
            }
            if (issuerDID === null || issuerDID === undefined)
                throw new Error('Could not resolve issuerDid = ' + params.credential.issuer);
            const credIssuerDidDoc = issuerDID;
            const credIssuerController = credIssuerDidDoc.controller;
            if (!credIssuerController.includes(params.issuerDid)) {
                throw new Error(params.issuerDid + ' is not a controller of ' + params.credential.issuer);
            }
            /// RegisterCRedeRPC
            const signedVC = yield jsonld_signatures_1.default.sign(params.credential, {
                purpose: new jsonld_signatures_2.purposes.AssertionProofPurpose({
                    controller: {
                        '@context': ['https://www.w3.org/ns/did/v1'],
                        id: issuerDID.id,
                        assertionMethod: issuerDID.assertionMethod,
                    },
                }),
                suite,
                documentLoader,
            });
            let credentialStatusRegistrationResult;
            if (params.registerCredential) {
                credentialStatusRegistrationResult = yield this.credStatusRPC.registerCredentialStatus(credentialStatus, credProof);
                if (!credentialStatusRegistrationResult || credentialStatusRegistrationResult.code != 0) {
                    throw new Error('HID-SSI-SDK:: Error while issuing the credential error = ' + credentialStatusRegistrationResult.rawLog);
                }
                return {
                    signedCredential: signedVC,
                    credentialStatus,
                    credentialStatusProof: credProof,
                    credentialStatusRegistrationResult,
                };
            }
            return { signedCredential: signedVC, credentialStatus, credentialStatusProof: credProof };
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
            // if (!params.issuerDid) {
            //   throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to verify credential');
            // }
            if (!params.issuerDid && !params.issuerDidDocument) {
                throw new Error('HID-SSI-SDK:: Error: params.issuerDid or params.issuerDidDocument is required to verify credential');
            }
            let issuerDID;
            if (params.issuerDid) {
                const { didDocument } = yield this.hsDid.resolve({ did: params.issuerDid });
                issuerDID = didDocument;
            }
            else {
                issuerDID = params.issuerDidDocument;
            }
            const issuerDidDoc = issuerDID;
            const publicKeyId = params.verificationMethodId;
            const publicKeyVerMethod = issuerDidDoc.verificationMethod.find((x) => x.id == publicKeyId);
            const keyPair = yield babyjubjub2021_1.BabyJubJubKeys2021.fromKeys({
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
            /* eslint-disable */
            const thats = this;
            /* eslint-enable */
            const result = yield jsonld_signatures_1.default.verify(params.credential, {
                purpose: new jsonld_signatures_2.purposes.AssertionProofPurpose({
                    controller: {
                        '@context': ['https://www.w3.org/ns/did/v1'],
                        id: issuerDID.id,
                        assertionMethod: issuerDID.assertionMethod,
                    },
                }),
                suite,
                documentLoader,
            });
            const statusCheck = yield thats.checkCredentialStatus({ credentialId: params.credential.id });
            result.statusResult = statusCheck;
            return result;
        });
    }
    /**
     * Resolves credential status from Hypersign Blokchain
     * @params
     *  - params.credentialId           : Verifiable credential id
     * @returns {Promise<IResolveCredential>}
     */
    resolveCredentialStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params || !params.credentialId)
                throw new Error('HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
            let credentialStatus = {};
            if (!this.credStatusRPC) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCred is not instantiated with Offlinesigner or not initialized');
            }
            credentialStatus = yield this.credStatusRPC.resolveCredentialStatus(params.credentialId);
            const response = Object.assign(Object.assign({}, credentialStatus.credentialStatusDocument), { proof: credentialStatus.credentialStatusProof });
            return response;
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
        var _a;
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
            /// Before we issue the credential the credential status has to be added
            /// for that we will call RegisterCredentialStatus RPC
            //  Let us generate credentialHash first
            const status = yield this._toTitleCase(params.status);
            if (!Object.values(constants_1.CredentialStatusEnums).includes(status)) {
                throw new Error(`HID-SSI-SDK:: Error: params.status is invalid`);
            }
            const claim = params.credentialStatus;
            const credentialStatus = {
                '@context': [constant.VC.CREDENTIAL_STATUS_CONTEXT, constant.DID_BabyJubJubKey2021.BABYJUBJUBSIGNATURE],
                id: claim.id,
                remarks: (_a = params.statusReason) !== null && _a !== void 0 ? _a : constants_1.VC.CRED_STATUS_REASON_TYPES[params.status],
                issuer: params.credentialStatus.issuer,
                issuanceDate: params.credentialStatus.issuanceDate,
                credentialMerkleRootHash: params.credentialStatus.credentialMerkleRootHash,
            };
            if (status === constants_1.VC.CRED_STATUS_TYPES.REVOKED) {
                credentialStatus['revoked'] = true;
            }
            else if (status === constants_1.VC.CRED_STATUS_TYPES.SUSPENDED) {
                credentialStatus['suspended'] = true;
            }
            const proofValue = yield this._jsonLdSign({
                credentialStatus,
                privateKeyMultibase: params.privateKeyMultibase,
                verificationMethodId: params.verificationMethodId,
                publicKeyMultibase: publicKeyVerMethod.publicKeyMultibase,
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
            /// UpdateCredRPC
            const resp = yield this.credStatusRPC.updateCredentialStatus(credentialStatus, proofValue);
            if (!resp || resp.code != 0) {
                throw new Error('HID-SSI-SDK:: Error while revoking the credential error = ' + resp.rawLog);
            }
            return resp;
        });
    }
    /**
     * Check status of credential on Hypersign Chain
     * @param
     * - params.credentialId     : Credential Id
     * @returns {Promise<{ verified: boolean }>}
     */
    checkCredentialStatus(params) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!params || !params.credentialId)
                throw new Error('HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
            const { credentialId } = params;
            let credentialStatus = {};
            if (!this.credStatusRPC) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCred is not instantiated with Offlinesigner');
            }
            credentialStatus = yield this.credStatusRPC.resolveCredentialStatus(credentialId);
            if (!credentialStatus) {
                throw new Error('HID-SSI-SDK:: Error: while checking credential status of credentialID ' + credentialId);
            }
            // const claim: Claim = credentialStatus.claim as Claim;
            const { remarks: statusReason } = credentialStatus.credentialStatusDocument;
            let currentStatus;
            /// TODO:  probably we should also verify the credential HASH by recalculating the hash of the crdential and
            // matching with credentialHash property.
            // const { credentialHash } = credentialStatus;
            if (!((_a = credentialStatus.credentialStatusDocument) === null || _a === void 0 ? void 0 : _a.revoked) && !((_b = credentialStatus.credentialStatusDocument) === null || _b === void 0 ? void 0 : _b.suspended)) {
                currentStatus = constants_1.VC.CRED_STATUS_TYPES.LIVE;
            }
            if (currentStatus != constants_1.VC.CRED_STATUS_TYPES.LIVE) {
                console.log('WARN: Credential status is  not LIVE, currentStatus ' + currentStatus);
                console.log('WARN: Status reason is ' + statusReason);
                return { verified: false };
            }
            return { verified: true };
        });
    }
    /**
     * Register credential status on Hypersign Chain
     * @param
     * - params.credentialStatus       : Credential status
     * - params.credentialStatusProof  : Status proof of the credential
     * @returns {Promise<{ transactionHash: string }>}
     */
    registerCredentialStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { credentialStatus, credentialStatusProof } = params;
            if (!credentialStatus || !credentialStatusProof)
                throw new Error('HID-SSI-SDK:: Error: credentialStatus and credentialStatusProof are required to register credential status');
            if (!this.credStatusRPC && !this.credentialApiService) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized with entityApiSecret');
            }
            let resp = {};
            if (this.credStatusRPC) {
                const result = yield this.credStatusRPC.registerCredentialStatus(credentialStatus, credentialStatusProof);
                if (!result || result.code != 0) {
                    throw new Error('HID-SSI-SDK:: Error while issuing the credential error = ' + result.rawLog);
                }
                resp.transactionHash = result.transactionHash;
            }
            else if (this.credentialApiService) {
                resp = yield this.credentialApiService.registerCredentialStatus({
                    credentialStatus,
                    credentialStatusProof,
                    namespace: this.namespace,
                });
            }
            return resp;
        });
    }
    /**
     * Generate transaction message
     * @param
     * - params.credentialStatus       : Credential status
     * - params.credentialStatusProof  : Status proof of the credential
     * @returns {Promise<{typeUrl: string, value: MsgRegisterCredentialStatus}>}
     */
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
    /**
     * Register multiple credential status
     * @param
     * - params.txnMessage      : Array of transaction message
     * @returns {Promise<DeliverTxResponse>}
     */
    registerCredentialStatusTxnBulk(txnMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!txnMessage || txnMessage.length <= 0)
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
    generateSeletiveDisclosure(param) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!param.verifiableCredential) {
                throw new Error('HID-SSI-SDK:: verifiableCredential is required');
            }
            if (!param.frame) {
                throw new Error('HID-SSI-SDK:: frame is required');
            }
            if (!param.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: verificationMethodId is required');
            }
            if (!param.issuerDid) {
                throw new Error('HID-SSI-SDK:: issuerDid is required');
            }
            param.frame['@context'] = param.verifiableCredential['@context'];
            const { didDocument: signerDidDoc } = yield this.hsDid.resolve({ did: param.issuerDid });
            const credIssuerDidDoc = signerDidDoc;
            const vm = (_a = credIssuerDidDoc.verificationMethod) === null || _a === void 0 ? void 0 : _a.find((vm) => vm.id == param.verificationMethodId);
            const suite = babyjubjub2021_1.BabyJubJubKeys2021.fromKeys({
                publicKeyMultibase: vm === null || vm === void 0 ? void 0 : vm.publicKeyMultibase,
                options: {
                    id: param.verificationMethodId,
                    controller: param.issuerDid,
                },
            });
            const verifyCredential = yield this.verify({
                credential: param.verifiableCredential,
                issuerDid: param.issuerDid,
                verificationMethodId: param.verificationMethodId,
            });
            if (!verifyCredential.verified == true) {
                throw new Error('proofDocument cannot be verified');
            }
            return yield (0, babyjubjubsignature2021_1.deriveProof)(param.verifiableCredential, param.frame, {
                suite,
                documentLoader,
            });
        });
    }
}
exports.default = HypersignBJJVerifiableCredential;
