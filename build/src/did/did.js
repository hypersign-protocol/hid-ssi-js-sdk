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
const constant = __importStar(require("../constants"));
const jsonld_signatures_1 = __importDefault(require("jsonld-signatures"));
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonld_signatures_1.default.purposes;
const didRPC_1 = require("./didRPC");
const utils_1 = __importDefault(require("../utils"));
const ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
const ed25519_signature_2020_1 = require("@digitalbazaar/ed25519-signature-2020");
const web3_1 = __importDefault(require("web3"));
const did_service_1 = __importDefault(require("../ssiApi/services/did/did.service"));
const jsonld_1 = __importDefault(require("jsonld"));
const crypto_1 = __importDefault(require("crypto"));
const IDID_1 = require("./IDID");
const enums_1 = require("../../libs/generated/ssi/client/enums");
const v1_1 = __importDefault(require("../../libs/w3cache/v1"));
const client_spec_1 = require("../../libs/generated/ssi/client_spec");
const bjjdid_1 = __importDefault(require("./bjjdid"));
const documentLoader = jsonld_signatures_1.default.extendContextLoader(v1_1.default);
class DIDDocument {
    constructor(publicKey, blockchainAccountId, id, keyType, verificationRelationships) {
        let vm;
        switch (keyType) {
            case enums_1.VerificationMethodTypes.Ed25519VerificationKey2020: {
                this['@context'] = [constant['DID_' + keyType].DID_BASE_CONTEXT, constant.VC.CREDENTIAIL_SECURITY_SUITE];
                this.id = id;
                this.controller = [this.id];
                this.alsoKnownAs = [this.id];
                vm = {
                    id: this.id + '#key-1',
                    type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
                    controller: this.id,
                    publicKeyMultibase: publicKey,
                };
                const verificationMethod = vm;
                this.verificationMethod = [verificationMethod];
                this.authentication = [];
                this.assertionMethod = [];
                this.keyAgreement = [];
                this.capabilityInvocation = [];
                this.capabilityDelegation = [];
                verificationRelationships === null || verificationRelationships === void 0 ? void 0 : verificationRelationships.forEach((value) => {
                    const vmId = verificationMethod.id;
                    this[value] = [vmId];
                });
                // TODO: we should take services object in consntructor
                this.service = [];
                break;
            }
            case enums_1.VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020: {
                this['@context'] = [
                    constant['DID_' + keyType].DID_BASE_CONTEXT,
                    constant['DID_' + keyType].SECP256K12020_RECOVERY_CONTEXT,
                ];
                this.id = id;
                this.controller = [this.id];
                this.alsoKnownAs = [this.id];
                vm = {
                    id: this.id + '#key-1',
                    type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
                    controller: this.id,
                    blockchainAccountId: blockchainAccountId,
                };
                const verificationMethod = vm;
                this.verificationMethod = [verificationMethod];
                this.authentication = [];
                this.assertionMethod = [];
                this.keyAgreement = [];
                this.capabilityInvocation = [];
                this.capabilityDelegation = [];
                verificationRelationships === null || verificationRelationships === void 0 ? void 0 : verificationRelationships.forEach((value) => {
                    const vmId = verificationMethod.id;
                    this[value] = [vmId];
                });
                // TODO: we should take services object in consntructor
                this.service = [];
                break;
            }
            case enums_1.VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019: {
                this['@context'] = [
                    constant['DID_' + keyType].DID_BASE_CONTEXT,
                    constant['DID_' + keyType].SECP256K12020_VERIFICATION_CONTEXT,
                ];
                this.id = id;
                this.controller = [this.id];
                this.alsoKnownAs = [this.id];
                vm = {
                    id: this.id + '#key-1',
                    type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
                    controller: this.id,
                    publicKeyMultibase: publicKey,
                    blockchainAccountId: blockchainAccountId,
                };
                const verificationMethod = vm;
                this.verificationMethod = [verificationMethod];
                this.authentication = [];
                this.assertionMethod = [];
                this.keyAgreement = [];
                this.capabilityInvocation = [];
                this.capabilityDelegation = [];
                verificationRelationships === null || verificationRelationships === void 0 ? void 0 : verificationRelationships.forEach((value) => {
                    const vmId = verificationMethod.id;
                    this[value] = [vmId];
                });
                // TODO: we should take services object in consntructor
                this.service = [];
                break;
            }
            default:
                throw new Error('Invalid');
        }
    }
}
/** Class representing HypersignDID */
class HypersignDID {
    /**
     * Creates instance of HypersignDID class
     * @constructor
     * @params
     *  - params.namespace        : namespace of did id, Default 'did:hid'
     *  - params.offlineSigner    : signer of type OfflineSigner
     *  - params.nodeRpcEndpoint  : RPC endpoint of the Hypersign blockchain, Default 'TEST'
     *  - params.nodeRestEndpoint : REST endpoint of the Hypersign blockchain
     */
    constructor(params = {}) {
        this._getId = (methodSpecificId) => {
            if (methodSpecificId && methodSpecificId.length < 32) {
                throw new Error('HID-SSI-SDK:: Error: methodSpecificId should be of minimum size 32');
            }
            let did = '';
            did =
                this.namespace && this.namespace != ''
                    ? `${constant.DID.SCHEME}:${constant.DID.METHOD}:${this.namespace}:${methodSpecificId}`
                    : `${constant.DID.SCHEME}:${constant.DID.METHOD}:${methodSpecificId}`;
            return did;
        };
        this._isValidMultibaseBase58String = (str) => {
            const multibaseBase58Regex = /^z([1-9A-HJ-NP-Za-km-z]+)$/;
            return multibaseBase58Regex.test(str);
        };
        const { offlineSigner, namespace, nodeRpcEndpoint, nodeRestEndpoint, entityApiSecretKey } = params;
        const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
        const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
        const rpcConstructorParams = {
            offlineSigner,
            nodeRpcEndpoint: nodeRPCEp,
            nodeRestEndpoint: nodeRestEp,
        };
        this.didrpc = new didRPC_1.DIDRpc(rpcConstructorParams);
        if (entityApiSecretKey && entityApiSecretKey != '') {
            this.didAPIService = new did_service_1.default(entityApiSecretKey);
            this.didrpc = null;
        }
        else {
            this.didAPIService = null;
        }
        this.namespace = namespace ? namespace : '';
        this.bjjDID = new bjjdid_1.default(params);
    }
    _getDateTime() {
        return new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
    }
    _jsonLdSign(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { didDocument, privateKeyMultibase, verificationMethodId } = params;
            const publicKeyId = verificationMethodId;
            const pubKey = (_a = didDocument.verificationMethod) === null || _a === void 0 ? void 0 : _a.find((item) => item.id === publicKeyId);
            const publicKeyMultibase1 = pubKey === null || pubKey === void 0 ? void 0 : pubKey.publicKeyMultibase;
            const keyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from({
                id: publicKeyId,
                privateKeyMultibase: privateKeyMultibase,
                publicKeyMultibase: publicKeyMultibase1,
            });
            const suite = new ed25519_signature_2020_1.Ed25519Signature2020({ key: keyPair });
            const signedDidDocument = (yield jsonld_signatures_1.default.sign(didDocument, {
                suite,
                purpose: new AssertionProofPurpose(),
                documentLoader,
            }));
            return signedDidDocument;
        });
    }
    _jsonLdNormalize(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const docToNormalize = params.doc;
            const normalizedoc = yield jsonld_1.default.normalize(docToNormalize, {
                format: 'application/n-quads',
                algorithm: 'URDNA2015',
            });
            return normalizedoc;
        });
    }
    _concat(arr1, arr2) {
        const concatenatedArr = new Uint8Array(arr1.length + arr2.length);
        concatenatedArr.set(arr1, 0);
        concatenatedArr.set(arr2, arr1.length);
        return concatenatedArr;
    }
    _filterVerificationRelationships(verificationRelationships) {
        let vR = [
            enums_1.VerificationMethodRelationships.assertionMethod,
            enums_1.VerificationMethodRelationships.authentication,
            enums_1.VerificationMethodRelationships.capabilityDelegation,
            enums_1.VerificationMethodRelationships.capabilityInvocation,
        ];
        if (verificationRelationships && verificationRelationships.length > 0) {
            const set1 = new Set(vR);
            const set2 = new Set(verificationRelationships);
            vR = Array.from(set1).filter((value) => set2.has(value));
        }
        return vR;
    }
    /**
     * Creates a new DID Document from wallet address
     * @params
     *  - params.blockChainAccountId  :
     *  - params.methodSpecificId   : methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId or may be walletaddress
     * @returns {Promise<object>} DidDocument object
     */
    _getBlockChainAccountID(chainId, address) {
        try {
            const web3 = new web3_1.default();
            const inDecimelChainId = web3.utils.hexToNumber(chainId);
            const blockChainAccountId = constant.CAIP_10_PREFIX.eip155 + ':' + inDecimelChainId + ':' + address;
            return blockChainAccountId;
        }
        catch (error) {
            throw new Error('HID-SSI-SDK:: Error: unsupported chain Id');
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.didrpc && !this.didAPIService) {
                throw new Error('HID-SSI-SDK:: Error:  HypersignDID class is not instantiated with Offlinesigner or have not been initilized with entityApiSecretKey');
            }
            if (this.didrpc) {
                yield this.didrpc.init();
            }
            if (this.didAPIService) {
                yield this.didAPIService.auth();
            }
        });
    }
    /**
     * Generate a new key pair of type Ed25519VerificationKey2020
     * @params params.seed - Optional, Seed to generate the key pair, if not passed, random seed will be taken
     * @params params.controller - Optional, controller field
     * @returns {Promise<object>} The key pair of type Ed25519
     */
    generateKeys(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let edKeyPair;
            if (params && params.seed && params.controller) {
                const seedBytes = params.seed instanceof Uint8Array ? params.seed : new Uint8Array(Buffer.from(params.seed));
                edKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate({ seed: seedBytes, id: params.controller });
            }
            else if (params && params.controller) {
                edKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate({ id: params.controller });
            }
            else if (params && params.seed) {
                const seedBytes = params.seed instanceof Uint8Array ? params.seed : new Uint8Array(Buffer.from(params.seed));
                edKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate({ seed: seedBytes });
            }
            else {
                edKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate();
            }
            const exportedKp = yield edKeyPair.export({ publicKey: true, privateKey: true });
            return Object.assign({}, exportedKp);
        });
    }
    /**
     * Generates a new DID Document
     * @params
     *  - params.publicKeyMultibase : public key
     *  - params.methodSpecificId   : Optional methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId
     *  - params.verificationRelationships: Optional, verification relationships where you want to add your verificaiton method ids
     * @returns {Promise<object>} DidDocument object
     */
    generate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let verificationRelationships = [];
            if (params.verificationRelationships && params.verificationRelationships.length > 0) {
                if (params.verificationRelationships.includes(enums_1.VerificationMethodRelationships.keyAgreement)) {
                    throw new Error('HID-SSI-SDK:: Error: keyAgreement is not allowed in verificationRelationships');
                }
                verificationRelationships = this._filterVerificationRelationships(params.verificationRelationships);
            }
            else {
                verificationRelationships = this._filterVerificationRelationships([]);
            }
            if (!params.publicKeyMultibase) {
                throw new Error('HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
            }
            const publicKeyMultibase1 = params.publicKeyMultibase;
            const methodSpecificId = publicKeyMultibase1;
            let didId;
            if (params.methodSpecificId) {
                didId = this._getId(params.methodSpecificId);
            }
            else {
                didId = this._getId(methodSpecificId);
            }
            const newDid = new DIDDocument(publicKeyMultibase1, '', didId, enums_1.VerificationMethodTypes.Ed25519VerificationKey2020, verificationRelationships);
            return utils_1.default.jsonToLdConvertor(Object.assign({}, newDid));
        });
    }
    /**
     * Register a new DID and Document in Hypersign blockchain - an onchain activity
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     * @returns {Promise<object>} Result of the registration
     */
    register(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {};
            // TODO:  this method MUST also accept signature/proof
            if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
            }
            if (!this.didrpc && !this.didAPIService) {
                throw new Error('HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"');
            }
            let { didDocument } = params;
            const didDoc = didDocument;
            const signInfos = [];
            if (!params.signData) {
                if (!params.privateKeyMultibase) {
                    throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
                }
                if (!params.verificationMethodId) {
                    throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
                }
                const { privateKeyMultibase, verificationMethodId } = params;
                let signature;
                let createdAt;
                if (!didDocument['@context']) {
                    throw new Error('HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
                }
                else {
                    didDocument = utils_1.default.removeEmptyString(didDocument);
                    const signedDidDoc = yield this._jsonLdSign({
                        didDocument: didDocument,
                        privateKeyMultibase,
                        verificationMethodId,
                    });
                    const { proof } = signedDidDoc;
                    signature = proof.proofValue;
                    createdAt = proof.created;
                }
                signInfos.push({
                    type: constant['DID_Ed25519VerificationKey2020'].SIGNATURE_TYPE,
                    created: createdAt !== null && createdAt !== void 0 ? createdAt : this._getDateTime(),
                    verificationMethod: verificationMethodId,
                    proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
                    proofValue: signature,
                });
            }
            else {
                if (params.signData.length < 1) {
                    throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
                }
                for (const i in params.signData) {
                    if (!params.signData[i].verificationMethodId) {
                        throw new Error(`HID-SSI-SDK:: Error: params.signData[${i}].verificationMethodId is required to register a did`);
                    }
                    if (!params.signData[i].privateKeyMultibase) {
                        throw new Error(`HID-SSI-SDK:: Error: params.signData[${i}].privateKeyMultibase is required to register a did`);
                    }
                    if (!params.signData[i].type) {
                        throw new Error(`HID-SSI-SDK:: Error: params.signData[${i}].type is required to register a did`);
                    }
                    const { type, privateKeyMultibase, verificationMethodId } = params.signData[i];
                    let createdAt;
                    if (type !== enums_1.VerificationMethodTypes.X25519KeyAgreementKey2020 &&
                        type !== enums_1.VerificationMethodTypes.X25519KeyAgreementKeyEIP5630) {
                        let signature;
                        if (!didDocument['@context']) {
                            throw new Error('HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
                        }
                        else {
                            didDocument = utils_1.default.removeEmptyString(didDocument);
                            const signedDidDoc = yield this._jsonLdSign({
                                didDocument: didDocument,
                                privateKeyMultibase,
                                verificationMethodId,
                            });
                            const { proof } = signedDidDoc;
                            signature = proof.proofValue;
                            createdAt = proof.created;
                        }
                        signInfos.push({
                            type: constant['DID_Ed25519VerificationKey2020'].SIGNATURE_TYPE,
                            created: createdAt !== null && createdAt !== void 0 ? createdAt : this._getDateTime(),
                            verificationMethod: verificationMethodId,
                            proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
                            proofValue: signature,
                        });
                        delete didDocument['proof'];
                    }
                }
            }
            if (this.didrpc) {
                const result = yield this.didrpc.registerDID(didDoc, signInfos);
                response.didDocument = params.didDocument;
                response.transactionHash = result.transactionHash;
            }
            else if (this.didAPIService) {
                const newSignInfos = signInfos;
                const result = yield this.didAPIService.registerDid({
                    didDocument,
                    signInfos: newSignInfos,
                });
                response.didDocument = didDocument;
                response.transactionHash = result.transactionHash;
            }
            return response;
        });
    }
    /**
     * Generate signature
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     * @returns {Promise<ISignInfo>} Generate Array
     */
    createSignInfos(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to create signature of a did');
            }
            if (!params.privateKeyMultibase) {
                throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to create signature of a did');
            }
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to create signature of a did');
            }
            let { didDocument } = params;
            const signInfos = [];
            const { privateKeyMultibase, verificationMethodId } = params;
            let signature;
            let createdAt;
            if (!didDocument['@context']) {
                throw new Error('HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
            }
            else {
                didDocument = utils_1.default.removeEmptyString(didDocument);
                const signedDidDocument = yield this._jsonLdSign({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId,
                });
                const { proof } = signedDidDocument;
                signature = proof.proofValue;
                createdAt = proof.created;
            }
            signInfos.push({
                signature,
                verification_method_id: verificationMethodId,
                created: createdAt,
                clientSpec: undefined,
            });
            return signInfos;
        });
    }
    /**
     * Resolves a DID into DIDDocument from Hypersign blockchain - an onchain activity
     * @params
     *  - params.did                        : DID
     * @returns  {Promise<IDIDResolve>} didDocument and didDocumentMetadata
     */
    resolve(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = {};
            if (!params.did) {
                throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
            }
            if (this.didrpc) {
                result = yield this.didrpc.resolveDID(params.did);
            }
            else if (this.didAPIService) {
                result = yield this.didAPIService.resolveDid({ did: params.did });
            }
            return {
                didDocument: utils_1.default.jsonToLdConvertor(result.didDocument),
                didDocumentMetadata: result.didDocumentMetadata,
            };
        });
    }
    /**
     * Update a DIDDocument in Hypersign blockchain - an onchain activity
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     *  - params.versionId            : Version of the document
     * @returns {Promise<{ transactionHash: string }>} Result of the update operation
     */
    update(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.readonly) {
                params.readonly = false;
            }
            const response = {};
            if (!params.didDocument) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to update a did');
            }
            if (!params.privateKeyMultibase) {
                throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
            }
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
            }
            if (!params.versionId) {
                throw new Error('HID-SSI-SDK:: Error: params.versionId is required to update a did');
            }
            if (!this.didrpc && !this.didAPIService) {
                throw new Error('HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"');
            }
            const { didDocument, privateKeyMultibase, verificationMethodId, versionId, otherSignInfo } = params;
            const signedDidDocument = yield this._jsonLdSign({
                didDocument,
                privateKeyMultibase,
                verificationMethodId,
            });
            const { proof } = signedDidDocument;
            let signInfos = [
                {
                    type: constant['DID_Ed25519VerificationKey2020'].SIGNATURE_TYPE,
                    created: (_a = proof.created) !== null && _a !== void 0 ? _a : this._getDateTime(),
                    verificationMethod: verificationMethodId,
                    proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
                    proofValue: proof.proofValue,
                },
            ];
            if (otherSignInfo) {
                signInfos = [...signInfos, ...otherSignInfo];
            }
            if (params.readonly === true) {
                return {
                    didDocument,
                    signInfos,
                    versionId,
                };
            }
            if (this.didrpc) {
                const result = yield this.didrpc.updateDID(didDocument, signInfos, versionId);
                response.transactionHash = result.transactionHash;
            }
            else if (this.didAPIService) {
                const newSignInfos = signInfos;
                const result = yield this.didAPIService.updateDid({
                    didDocument: didDocument,
                    signInfos: newSignInfos,
                    deactivate: false,
                });
                response.transactionHash = result.transactionHash;
            }
            return response;
        });
    }
    /**
     * Deactivate a DIDDocument in Hypersign blockchain - an onchain activity
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     *  - params.versionId            : Version of the document
     * @returns {Promise<object>} Result of the deactivatee operation
     */
    deactivate(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = {};
            if (!params.didDocument) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did');
            }
            if (!params.privateKeyMultibase) {
                throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
            }
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
            }
            if (!params.versionId) {
                throw new Error('HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
            }
            if (!this.didrpc && !this.didAPIService) {
                throw new Error('HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"');
            }
            const { didDocument, privateKeyMultibase, verificationMethodId, versionId } = params;
            const signedDidDocument = yield this._jsonLdSign({
                didDocument,
                privateKeyMultibase,
                verificationMethodId,
            });
            const { proof } = signedDidDocument;
            const signInfos = [
                {
                    type: constant['DID_Ed25519VerificationKey2020'].SIGNATURE_TYPE,
                    created: (_a = proof.created) !== null && _a !== void 0 ? _a : this._getDateTime(),
                    verificationMethod: verificationMethodId,
                    proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
                    proofValue: proof.proofValue,
                },
            ];
            if (this.didrpc) {
                const result = yield this.didrpc.deactivateDID(didDocument.id, signInfos, versionId);
                response.transactionHash = result.transactionHash;
            }
            else if (this.didAPIService) {
                const newSignInfos = signInfos;
                const result = yield this.didAPIService.updateDid({
                    didDocument: didDocument,
                    signInfos: newSignInfos,
                    deactivate: true,
                });
                response.transactionHash = result.transactionHash;
            }
            return response;
        });
    }
    /**
     * Signs a DIDDocument
     * @params
     *  - params.didDocument               :   Did document to be signed
     *  - params.privateKeyMultibase       :   private key in multibase format (base58 digitalbazar format)
     *  - params.challenge                 :   challenge is a random string generated by the client
     *  - params.did                       :   did of the user
     *  - params.domain                    :   domain is the domain of the DID Document that is being authenticated
     *  - params.verificationMethodId      :   verificationMethodId of the DID
     * -  params.purpose                   :   purpose of Auth (authentication or assertionMethod)
     * @returns {Promise<object>} Signed DID Document
     */
    sign(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { privateKeyMultibase, challenge, domain, did, didDocument, verificationMethodId } = params;
            let resolveddoc;
            if (!privateKeyMultibase) {
                throw new Error('HID-SSI-SDK:: Error: params.privateKey is required to sign a did');
            }
            const didAuthType = (_a = params.purpose) !== null && _a !== void 0 ? _a : 'authentication';
            try {
                // if did is prvovided then resolve the did doc from the blockchain or else use the did doc provided in the params object to sign the did doc with the proof
                if (did && this.didrpc) {
                    resolveddoc = yield this.didrpc.resolveDID(did);
                }
                else if (didDocument) {
                    resolveddoc = {};
                    resolveddoc.didDocument = didDocument;
                }
                else {
                    throw new Error('HID-SSI-SDK:: Error: params.did or params.didDocument is required to sign a did');
                }
            }
            catch (error) {
                throw new Error(`HID-SSI-SDK:: Error: could not resolve did ${did}`);
            }
            let signedDidDocument;
            if (didAuthType === 'authentication') {
                if (!challenge) {
                    throw new Error('HID-SSI-SDK:: Error: params.challenge is required to sign a did');
                }
                if (!domain) {
                    throw new Error('HID-SSI-SDK:: Error: params.domain is required to sign a did');
                }
                const publicKeyId = verificationMethodId;
                const pubkey = resolveddoc.didDocument.verificationMethod.find((item) => item.id === publicKeyId);
                if (!pubkey) {
                    throw new Error('HID-SSI-SDK:: Error: Incorrect verification method id');
                }
                const publicKeyMultibase1 = pubkey.publicKeyMultibase;
                const keyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from({
                    id: publicKeyId,
                    privateKeyMultibase,
                    publicKeyMultibase: publicKeyMultibase1,
                });
                const suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                    verificationMethod: publicKeyId,
                    key: keyPair,
                });
                const didDocumentLd = resolveddoc.didDocument;
                const controller = {
                    '@context': constant.DID.CONTROLLER_CONTEXT,
                    id: publicKeyId,
                    authentication: didDocumentLd.authentication,
                };
                signedDidDocument = (yield jsonld_signatures_1.default.sign(didDocumentLd, {
                    suite,
                    purpose: new AuthenticationProofPurpose({
                        controller,
                        challenge,
                        domain,
                    }),
                    documentLoader,
                    compactProof: constant.compactProof,
                }));
            }
            else if (didAuthType === 'assertionMethod') {
                signedDidDocument = yield this._jsonLdSign({
                    didDocument: resolveddoc.didDocument,
                    privateKeyMultibase,
                    verificationMethodId,
                });
            }
            else {
                throw new Error(`HID-SSI-SDK:: Error: unsupported purpose ${params.purpose}`);
            }
            return signedDidDocument;
        });
    }
    /**
     * Verifies a signed DIDDocument
     * @params
     *  - params.didDocument :   Signed DID Document
     *  - params.privateKey  :   private key in multibase format (base58 digitalbazar format)
     *  - params.challenge   :   challenge is a random string generated by the client required for authentication purpose
     *  - params.did         :   did of the user
     *  - params.domain      :   domain is the domain of the DID Document that is being authenticated
     *  -  params.purpose    :   purpose of Auth (authentication or assertion)
     * @returns Promise<{ verificationResult }> Verification Result
     */
    verify(params) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { didDocument, verificationMethodId, challenge, domain } = params;
            if (!didDocument) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to verify a did');
            }
            if (!didDocument['proof']) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocument.proof is not present in the signed did document');
            }
            if (!verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to verify a did');
            }
            const didAuthType = (_a = params.purpose) !== null && _a !== void 0 ? _a : 'authentication';
            const didDoc = didDocument;
            const publicKeyId = verificationMethodId;
            const pubkey = (_b = didDoc.verificationMethod) === null || _b === void 0 ? void 0 : _b.find((item) => item.id === publicKeyId);
            if (!pubkey) {
                throw new Error('HID-SSI-SDK:: Error: could not find verification method for verificationMethodId: ' +
                    verificationMethodId +
                    ' in did document');
            }
            const publicKeyMultibase1 = pubkey.publicKeyMultibase;
            const keyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from({
                id: publicKeyId,
                publicKeyMultibase: publicKeyMultibase1,
            });
            const suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                key: keyPair,
            });
            suite.date = new Date(new Date().getTime() - 100000).toISOString();
            let controller;
            let purpose;
            if (didAuthType === 'authentication') {
                if (!challenge) {
                    throw new Error('HID-SSI-SDK:: Error: params.challenge is required to verify a did');
                }
                controller = {
                    '@context': constant.DID.CONTROLLER_CONTEXT,
                    id: publicKeyId,
                    authentication: didDoc.authentication,
                };
                purpose = new AuthenticationProofPurpose({
                    controller,
                    challenge,
                    domain,
                });
            }
            else if (didAuthType === 'assertionMethod') {
                controller = {
                    '@context': constant.DID.CONTROLLER_CONTEXT,
                    id: publicKeyId,
                    assertionMethod: didDoc.assertionMethod,
                };
                purpose = new AssertionProofPurpose({
                    controller,
                });
            }
            else {
                throw new Error(`HID-SSI-SDK:: Error: unsupported purpose ${params.purpose}`);
            }
            const result = yield jsonld_signatures_1.default.verify(didDoc, {
                suite,
                purpose: purpose,
                documentLoader,
                compactProof: constant.compactProof,
            });
            return result;
        });
    }
    // using in API
    /**
     * Create DIDDocument using metamask or kepler
     * @param
     *  - params.methodSpecificId           : methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId or may be walletaddress
     *  - params.publicKey                  : Optional, Used for cosmos-ADR036
     *  - params.address                    : Checksum address from web3 wallet
     *  - params.chainId                    : Chain Id
     *  - params.clientSpec                 : ClientSpec either it is eth-personalSign or cosmos-ADR036\
     *  - params.verificationRelationships  : Optional, verification relationships where you want to add your verificaiton method ids
     * @returns {Promise<Did>}  DidDocument object
     */
    createByClientSpec(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this['window'] === 'undefined') {
                console.log('HID-SSI-SDK:: Warning:  Running in non browser mode');
            }
            if (!params.methodSpecificId) {
                throw new Error('HID-SSI-SDK:: Error: params.methodSpecificId is required to create didoc');
            }
            if (!params.chainId) {
                throw new Error('HID-SSI-SDK:: Error: params.chainId is required to create didoc');
            }
            if (!params.address) {
                throw new Error('HID-SSI-SDK:: Error: params.address is required to create didoc');
            }
            if (!params.clientSpec) {
                throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to create didoc');
            }
            if (!(params.clientSpec in IDID_1.IClientSpec)) {
                throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is invalid');
            }
            let didDoc;
            let verificationRelationships = [];
            if (params.verificationRelationships && params.verificationRelationships.length > 0) {
                if (params.verificationRelationships.includes(enums_1.VerificationMethodRelationships.keyAgreement)) {
                    throw new Error('HID-SSI-SDK:: Error: keyAgreement is not allowed in verificationRelationships');
                }
                verificationRelationships = this._filterVerificationRelationships(params.verificationRelationships);
            }
            else {
                verificationRelationships = this._filterVerificationRelationships([]);
            }
            switch (params.clientSpec) {
                case IDID_1.IClientSpec['eth-personalSign']: {
                    const blockChainAccountId = this._getBlockChainAccountID(params.chainId, params.address);
                    const didId = this._getId(params.methodSpecificId);
                    const newDid = new DIDDocument('', blockChainAccountId, didId, enums_1.VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020, verificationRelationships);
                    didDoc = Object.assign({}, newDid);
                    delete didDoc.service;
                    break;
                }
                case IDID_1.IClientSpec['cosmos-ADR036']: {
                    if (!params.publicKey) {
                        throw new Error('HID-SSI-SDK:: Error: params.publicKey is required to create didoc for ' +
                            enums_1.VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019);
                    }
                    if (!this._isValidMultibaseBase58String(params.publicKey)) {
                        throw new Error('HID-SSI-SDK:: Error: params.publicKey mustbe multibase encoded base58 string for ' +
                            enums_1.VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019);
                    }
                    const multibasePublicKey = params.publicKey;
                    const didId = this._getId(params.methodSpecificId);
                    const blockChainAccountId = 'cosmos:' + params.chainId + ':' + params.address;
                    const newDid = new DIDDocument(multibasePublicKey, blockChainAccountId, didId, enums_1.VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019, verificationRelationships);
                    didDoc = Object.assign({}, newDid);
                    break;
                }
                default: {
                    throw new Error('HID-SSI-SDK:: Error: params.clientSpec is invalid use object.generate() method');
                }
            }
            return didDoc;
        });
    }
    // public generateKeyPairBabyJubJub() {
    //   return;
    // }
    // public async createDIDbyBabyJubJub() {
    //   return;
    // }
    // using in API
    /**
     * Register did on chain generated using wallet
     * @param
     * - params.didDocument      : DidDocument to register
     * - params.signInfos        : Array of signature, verificationMethodId and clientSpec
     * @returns {Promise<{didDocument: Did,transactionHash: string }>}
     */
    registerByClientSpec(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {};
            if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
            }
            if (!this.didrpc && !this.didAPIService) {
                throw new Error('HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"');
            }
            if (!params.signInfos) {
                throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to register a did');
            }
            if (params.signInfos.length < 1) {
                throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            }
            if (!params.signInfos) {
                throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to register a did');
            }
            if (params.signInfos.length < 1) {
                throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            }
            for (const i in params.signInfos) {
                if (!params.signInfos[i]['verification_method_id']) {
                    throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to register a did`);
                }
                const clientSpec = params.signInfos[i]['clientSpec'];
                if (clientSpec && clientSpec.type && !(clientSpec.type in IDID_1.IClientSpec)) {
                    throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
                }
                if (!params.signInfos[i]['signature']) {
                    throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to register a did`);
                }
            }
            const didDoc = params.didDocument;
            const { signInfos } = params;
            if (this.didrpc) {
                const proofs = [];
                signInfos.forEach((sign) => {
                    var _a, _b;
                    let type;
                    let clientSpec;
                    if (((_a = sign.clientSpec) === null || _a === void 0 ? void 0 : _a.type) === IDID_1.IClientSpec['eth-personalSign']) {
                        type = constant['DID_EcdsaSecp256k1RecoveryMethod2020'].SIGNATURE_TYPE;
                        clientSpec = client_spec_1.ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN;
                    }
                    else if (((_b = sign['clientSpec']) === null || _b === void 0 ? void 0 : _b.type) === IDID_1.IClientSpec['cosmos-ADR036']) {
                        type = constant['DID_EcdsaSecp256k1VerificationKey2019'].SIGNATURE_TYPE;
                        clientSpec = client_spec_1.ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036;
                    }
                    else {
                        throw new Error('Invalid clientSpec type');
                    }
                    const proof = {
                        type,
                        created: sign['created'],
                        verificationMethod: sign['verification_method_id'],
                        proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
                        proofValue: sign['signature'],
                        clientSpecType: clientSpec,
                    };
                    proofs.push(proof);
                });
                const result = yield this.didrpc.registerDID(didDoc, proofs);
                response.didDocument = didDoc;
                response.transactionHash = result.transactionHash;
            }
            else if (this.didAPIService) {
                const newSignInfos = signInfos;
                const result = yield this.didAPIService.registerDid({
                    didDocument: didDoc,
                    signInfos: newSignInfos,
                });
                response.didDocument = didDoc;
                response.transactionHash = result.transactionHash;
            }
            return response;
        });
    }
    // using in API
    /**
     * Update a didDocument in Hypersign blockchain
     * @param
     * - params.didDocument      : LD DidDocument to updated
     * - params.versionId        : Version of the document. See the didDocumentMetadata when DID resolves
     * - params.signInfos        : Array of signature, verificationMethodId and clientSpec
     * @returns {Promise<{ transactionHash: string }>}  Result of the update operation
     */
    updateByClientSpec(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {};
            if (!this.didrpc && !this.didAPIService) {
                throw new Error('HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"');
            }
            if (!params.didDocument) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to update a did');
            }
            if (!params.signInfos) {
                throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to register a did');
            }
            if (params.signInfos.length < 1) {
                throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            }
            for (const i in params.signInfos) {
                if (!params.signInfos[i]['verification_method_id']) {
                    throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to register a did`);
                }
                const clientSpec = params.signInfos[i]['clientSpec'];
                if (clientSpec && clientSpec.type && !(clientSpec.type in IDID_1.IClientSpec)) {
                    throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
                }
                if (!params.signInfos[i]['signature']) {
                    throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to register a did`);
                }
            }
            if (!params.versionId) {
                throw new Error('HID-SSI-SDK:: Error: params.versionId is required to update a did');
            }
            const { didDocument, signInfos, versionId } = params;
            if (this.didrpc) {
                const proofs = [];
                signInfos.forEach((sign) => {
                    var _a, _b;
                    let type;
                    let clientSpec;
                    if (((_a = sign['clientSpec']) === null || _a === void 0 ? void 0 : _a.type) === IDID_1.IClientSpec['eth-personalSign']) {
                        type = constant['DID_EcdsaSecp256k1RecoveryMethod2020'].SIGNATURE_TYPE;
                        clientSpec = client_spec_1.ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN;
                    }
                    else if (((_b = sign['clientSpec']) === null || _b === void 0 ? void 0 : _b.type) === IDID_1.IClientSpec['cosmos-ADR036']) {
                        type = constant['DID_EcdsaSecp256k1VerificationKey2019'].SIGNATURE_TYPE;
                        clientSpec = client_spec_1.ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036;
                    }
                    else {
                        throw new Error('Invalid clientSpec type');
                    }
                    const proof = {
                        type,
                        created: sign['created'],
                        verificationMethod: sign['verification_method_id'],
                        proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
                        proofValue: sign['signature'],
                        clientSpecType: clientSpec,
                    };
                    proofs.push(proof);
                });
                const result = yield this.didrpc.updateDID(didDocument, proofs, versionId);
                response.transactionHash = result.transactionHash;
            }
            else if (this.didAPIService) {
                const newSignInfos = signInfos;
                const result = yield this.didAPIService.updateDid({
                    didDocument: didDocument,
                    signInfos: newSignInfos,
                    deactivate: false,
                });
                response.transactionHash = result.transactionHash;
            }
            return response;
        });
    }
    // using in API
    /**
     * Deactivate a didDocument in Hypersign blockchain - an onchain activity
     * @param
     * - params.didDocument      : LD DidDocument to updated
     * - params.versionId        : Version of the document. See the didDocumentMetadata when DID resolves
     * - params.signInfos        : Array of signature, verificationMethodId and clientSpec
     * @returns {Promise<{ transactionHash: string }>}  Result of the update operation
     */
    deactivateByClientSpec(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {};
            if (!this.didrpc && !this.didAPIService) {
                throw new Error('HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"');
            }
            if (!params.didDocument) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did');
            }
            if (!params.signInfos) {
                throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to deactivate a did');
            }
            if (params.signInfos.length < 1) {
                throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            }
            for (const i in params.signInfos) {
                if (!params.signInfos[i]['verification_method_id']) {
                    throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to deactivate a did`);
                }
                const clientSpec = params.signInfos[i]['clientSpec'];
                if (clientSpec && clientSpec.type && !(clientSpec.type in IDID_1.IClientSpec)) {
                    throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
                }
                if (!params.signInfos[i]['signature']) {
                    throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to deactivate a did`);
                }
            }
            if (!params.versionId) {
                throw new Error('HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
            }
            const { didDocument, signInfos, versionId } = params;
            const didDoc = didDocument;
            if (this.didrpc) {
                const proofs = [];
                signInfos.forEach((sign) => {
                    var _a, _b;
                    let type;
                    let clientSpec;
                    if (((_a = sign['clientSpec']) === null || _a === void 0 ? void 0 : _a.type) === IDID_1.IClientSpec['eth-personalSign']) {
                        type = constant['DID_EcdsaSecp256k1RecoveryMethod2020'].SIGNATURE_TYPE;
                        clientSpec = client_spec_1.ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN;
                    }
                    else if (((_b = sign['clientSpec']) === null || _b === void 0 ? void 0 : _b.type) === IDID_1.IClientSpec['cosmos-ADR036']) {
                        type = constant['DID_EcdsaSecp256k1VerificationKey2019'].SIGNATURE_TYPE;
                        clientSpec = client_spec_1.ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036;
                    }
                    else {
                        throw new Error('Invalid clientSpec type');
                    }
                    const proof = {
                        type,
                        created: sign['created'],
                        verificationMethod: sign['verification_method_id'],
                        proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
                        proofValue: sign['signature'],
                        clientSpecType: clientSpec,
                    };
                    proofs.push(proof);
                });
                const result = yield this.didrpc.deactivateDID(didDoc.id, proofs, versionId);
                response.transactionHash = result.transactionHash;
            }
            else if (this.didAPIService) {
                const newSignInfos = signInfos;
                const result = yield this.didAPIService.updateDid({
                    didDocument: didDocument,
                    signInfos: newSignInfos,
                    deactivate: true,
                });
                response.transactionHash = result.transactionHash;
            }
            return response;
        });
    }
    /**
     * Sign and Register a DIDDocument
     * @param
     * - params.didDocument           : DidDocument to be signed and register
     * - params.address               : Checksum address from web3 wallet
     * - params.verificationMethodId  : verificationMethodId of the DID
     * - params.web3                  : Web3 object
     * - params.clientSpec            : ClientSpec either it is eth-personalSign or cosmos-ADR036
     * - params.chainId               : OPtional, ChainId
     * @returns {Promise<{ didDocument: Did; transactionHash: string }>}
     */
    signAndRegisterByClientSpec(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
            }
            if (!params.clientSpec) {
                throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to sign');
            }
            if (!(params.clientSpec in IDID_1.IClientSpec)) {
                throw new Error('HID-SSI-SDK:: Error: invalid clientSpec');
            }
            if (!this.didrpc) {
                throw new Error('HID-SSI-SDK:: Error:  HypersignDID class is not instantiated with Offlinesigner or have not been initilized');
            }
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
            }
            if (!params.web3) {
                throw new Error('HID-SSI-SDK:: Error: params.web should be passed');
            }
            if (!params.address) {
                throw new Error('HID-SSI-SDK:: Error: params.address is required to sign a did');
            }
            const signedDidDoc = yield this.signByClientSpec({
                didDocument: params.didDocument,
                clientSpec: params.clientSpec,
                address: params.address,
                web3: params.web3,
                chainId: params.chainId,
                verificationMethodId: params.verificationMethodId,
            });
            const signInfos = [
                {
                    signature: signedDidDoc.proof.proofValue,
                    verification_method_id: params.verificationMethodId,
                    created: signedDidDoc.proof.created,
                    clientSpec: {
                        type: params.clientSpec === IDID_1.IClientSpec['cosmos-ADR036']
                            ? IDID_1.IClientSpec['cosmos-ADR036']
                            : IDID_1.IClientSpec['eth-personalSign'],
                    },
                },
            ];
            return yield this.registerByClientSpec({
                didDocument: params.didDocument,
                signInfos,
            });
        });
    }
    /**
     * Signs a DIDDocument
     * @param
     * - params.didDocument          : Did document to be signed
     * - params.clientSpec           : ClientSpec either it is eth-personalSign or cosmos-ADR036
     * - params.address              : Checksum address from web3 wallet
     * - params.web3                 : web3 object
     * - params.chainId              : Optional, chainId
     * - params.verificationMethodId : verificationMEthodId for generating signature
     * @returns {Promise<ISignedDIDDocument>}
     */
    signByClientSpec(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this['window'] === 'undefined') {
                throw new Error('HID-SSI-SDK:: Error:  Running in non browser mode');
            }
            if (!params.didDocument) {
                throw Error('HID-SSI-SDK:: Error: params.didDocument is required to sign');
            }
            if (params.didDocument['proof']) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocument should not contain proof in it');
            }
            if (!params.address) {
                throw new Error('HID-SSI-SDK:: Error: params.address is required to sign a did');
            }
            if (!params.clientSpec) {
                throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to sign');
            }
            if (!(params.clientSpec in IDID_1.IClientSpec)) {
                throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is invalid');
            }
            if (!params.web3) {
                throw new Error('HID-SSI-SDK:: Error: params.web3 is required to sign');
            }
            if (!params.verificationMethodId) {
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to sign');
            }
            const vmId = (_a = params.didDocument.verificationMethod) === null || _a === void 0 ? void 0 : _a.find((x) => x.id == params.verificationMethodId);
            if (!vmId || vmId == undefined) {
                throw new Error(`HID-SSI_SDK:: Error: invalid verificationMethodId`);
            }
            const didDoc = utils_1.default.removeEmptyString(params.didDocument);
            switch (params.clientSpec) {
                case IDID_1.IClientSpec['eth-personalSign']: {
                    // normalize didDoc with JSON LD
                    const normalizedDidDoc = yield this._jsonLdNormalize({ doc: didDoc });
                    const normalizedDidDocHash = new Uint8Array(Buffer.from(crypto_1.default.createHash('sha256').update(normalizedDidDoc).digest('hex'), 'hex'));
                    // construct proof
                    const proof = {
                        '@context': didDoc['@context'],
                        type: enums_1.ProofTypes.EcdsaSecp256k1RecoverySignature2020,
                        created: this._getDateTime(),
                        verificationMethod: params.verificationMethodId,
                        proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
                    };
                    // normalize proof with JSON LD
                    const normalizedProof = yield this._jsonLdNormalize({ doc: proof });
                    delete proof['@context'];
                    const normalizedProofHash = new Uint8Array(Buffer.from(crypto_1.default.createHash('sha256').update(normalizedProof).digest('hex'), 'hex'));
                    const combinedHash = yield this._concat(normalizedProofHash, normalizedDidDocHash);
                    const didDocJsonDigest = {
                        didId: didDoc.id,
                        didDocDigest: Buffer.from(combinedHash).toString('hex'),
                    };
                    const signature = yield params.web3.eth.personal.sign(JSON.stringify(didDocJsonDigest, (key, value) => {
                        if (value === '' || (Array.isArray(value) && value.length === 0)) {
                            return undefined;
                        }
                        return value;
                    }), params.address);
                    proof['proofValue'] = signature;
                    proof['clientSpecType'] = client_spec_1.ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN;
                    didDoc['proof'] = proof;
                    return didDoc;
                }
                case IDID_1.IClientSpec['cosmos-ADR036']: {
                    if (!params.chainId) {
                        throw new Error('HID-SSI-SDK:: Error:  params.chainId is required to sign for clientSpec ' +
                            IDID_1.IClientSpec['cosmos-ADR036'] +
                            ' and keyType ' +
                            enums_1.VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019);
                    }
                    const normalizedDidDoc = yield this._jsonLdNormalize({ doc: didDoc });
                    const normalizedDidDochash = new Uint8Array(Buffer.from(crypto_1.default.createHash('sha256').update(normalizedDidDoc).digest('hex'), 'hex'));
                    // construct proof
                    const proof = {
                        '@context': didDoc['@context'],
                        type: enums_1.ProofTypes.EcdsaSecp256k1Signature2019,
                        created: this._getDateTime(),
                        verificationMethod: params.verificationMethodId,
                        proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
                    };
                    const normalizedProof = yield this._jsonLdNormalize({ doc: proof });
                    delete proof['@context'];
                    const normalizedProofHash = new Uint8Array(Buffer.from(crypto_1.default.createHash('sha256').update(normalizedProof).digest('hex'), 'hex'));
                    const combinedHash = yield this._concat(normalizedProofHash, normalizedDidDochash);
                    const signRespObj = yield params.web3.requestMethod('signArbitrary', [
                        params.chainId,
                        params.address,
                        combinedHash,
                    ]);
                    proof['proofValue'] = signRespObj['signature'];
                    proof['clientSpecType'] = client_spec_1.ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036;
                    didDoc['proof'] = proof;
                    return didDoc;
                }
                default:
                    throw Error('HID-SSI-SDK:: Error: Invalid clientSpec');
                    break;
            }
        });
    }
    /**
     * Add verification method
     * @param
     * - params.didDocument          : Optional, unregistered Did document
     * - params.did                  : Optional, didDoc Id of registered didDoc
     * - params.type                 : key type
     * - params.id                   : Optional, verificationMethodId
     * - params.controller           : Optional, controller field
     * - params.publicKeyMultibase   : public key
     * - params.blockchainAccountId  : Optional, blockchain accountId
     * @return {Promise<Did>}  DidDocument object
     */
    addVerificationMethod(params) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let resolvedDidDoc;
            if (!params.did && (!params.didDocument || Object.keys(params.didDocument).length === 0)) {
                throw new Error('HID-SSI_SDK:: Error: params.did or params.didDocument is required to addVerificationMethod');
            }
            if (!params.type) {
                throw new Error('HID-SSI-SDK:: Error: params.type is required to addVerificationMethod');
            }
            const { type } = params;
            if (!(type in enums_1.VerificationMethodTypes)) {
                throw new Error('HID-SSI-SDK:: Error: params.type is invalid');
            }
            try {
                if (params.did) {
                    if (!this.didrpc) {
                        throw new Error('HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized');
                    }
                    resolvedDidDoc = yield this.didrpc.resolveDID(params.did);
                    if (!resolvedDidDoc.didDocument) {
                        if (!params.didDocument) {
                            throw new Error('HID-SSI_SDK:: Error: can not able to resolve did please send didDocument');
                        }
                    }
                }
                else if (params.didDocument) {
                    resolvedDidDoc = {};
                    resolvedDidDoc.didDocument = params.didDocument;
                }
                else {
                    throw new Error('HID-SSI-SDK:: Error: params.did or params.didDocument is required to addVerificationMethod');
                }
            }
            catch (e) {
                throw new Error(`HID-SSI-SDK:: Error: could not resolve did ${params.did}`);
            }
            if (type === enums_1.VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020 &&
                (!params.blockchainAccountId || params.blockchainAccountId.trim() === '')) {
                throw new Error(`HID-SSI-SDK:: Error: params.blockchainAccountId is required for keyType ${params.type}`);
            }
            if (type === enums_1.VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020 && (!params.id || params.id.trim() === '')) {
                throw new Error(`HID-SSI-SDK:: Error: params.id is required for keyType ${params.type}`);
            }
            if (type === enums_1.VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019 &&
                (!params.blockchainAccountId ||
                    params.blockchainAccountId.trim() === '' ||
                    !params.publicKeyMultibase ||
                    params.publicKeyMultibase.trim() === '')) {
                throw new Error(`HID-SSI-SDK:: Error: params.blockchainAccountId and params.publicKeyMultibase is required for keyType ${params.type}`);
            }
            if ((type === enums_1.VerificationMethodTypes.Ed25519VerificationKey2020 ||
                type === enums_1.VerificationMethodTypes.X25519KeyAgreementKey2020 ||
                type === enums_1.VerificationMethodTypes.X25519KeyAgreementKeyEIP5630) &&
                !params.publicKeyMultibase) {
                throw new Error('HID-SSI-SDK:: Error: params.publicKeyMultibase is required to addVerificationMethod');
            }
            const verificationMethod = {};
            const { didDocument } = resolvedDidDoc;
            if (params.id) {
                const checkIfVmIdExists = didDocument.verificationMethod.some((vm) => vm.id === params.id);
                if (checkIfVmIdExists) {
                    throw new Error(`HID-SSI-SDK:: Error: verificationMethod ${params.id} already exists`);
                }
            }
            const VMLength = didDocument.verificationMethod.length;
            verificationMethod['id'] = (_a = params === null || params === void 0 ? void 0 : params.id) !== null && _a !== void 0 ? _a : `${didDocument.id}#key-${VMLength + 1}`;
            verificationMethod['type'] = type;
            verificationMethod['controller'] = didDocument.id;
            if (type !== enums_1.VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020) {
                verificationMethod['publicKeyMultibase'] = (_b = params === null || params === void 0 ? void 0 : params.publicKeyMultibase) !== null && _b !== void 0 ? _b : '';
            }
            if (type !== enums_1.VerificationMethodTypes.Ed25519VerificationKey2020) {
                verificationMethod['blockchainAccountId'] = (_c = params === null || params === void 0 ? void 0 : params.blockchainAccountId) !== null && _c !== void 0 ? _c : '';
            }
            if (type == enums_1.VerificationMethodTypes.BabyJubJubKey2021) {
                delete verificationMethod['blockchainAccountId'];
            }
            didDocument.verificationMethod.push(verificationMethod);
            if (verificationMethod['type'] === enums_1.VerificationMethodTypes.X25519KeyAgreementKey2020 ||
                verificationMethod['type'] === enums_1.VerificationMethodTypes.X25519KeyAgreementKeyEIP5630) {
                didDocument.keyAgreement.push(verificationMethod['id']);
            }
            else {
                didDocument.authentication.push(verificationMethod['id']);
                didDocument.assertionMethod.push(verificationMethod['id']);
                didDocument.capabilityDelegation.push(verificationMethod['id']);
                didDocument.capabilityInvocation.push(verificationMethod['id']);
            }
            if (verificationMethod['type'] === enums_1.VerificationMethodTypes.X25519KeyAgreementKey2020) {
                const newContext = constant['DID_' + enums_1.VerificationMethodTypes.Ed25519VerificationKey2020].DID_KEYAGREEMENT_CONTEXT;
                if (!didDocument['@context'].includes(newContext)) {
                    didDocument['@context'].push(newContext);
                }
            }
            if (verificationMethod['type'] === enums_1.VerificationMethodTypes.X25519KeyAgreementKeyEIP5630) {
                const newContext = constant['DID_' + enums_1.VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020].DID_KEYAGREEMENT_CONTEXT;
                if (!didDocument['@context'].includes(newContext)) {
                    didDocument['@context'].push(newContext);
                }
            }
            if (verificationMethod['type'] === enums_1.VerificationMethodTypes.BabyJubJubKey2021) {
                const newContext = constant['DID_' + enums_1.VerificationMethodTypes.BabyJubJubKey2021].DID_BABYJUBJUBKEY2021;
                if (!didDocument['@context'].includes(newContext)) {
                    didDocument['@context'].push(newContext);
                }
            }
            return didDocument;
        });
    }
}
exports.default = HypersignDID;
