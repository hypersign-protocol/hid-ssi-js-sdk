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
const { AssertionProofPurpose } = jsonld_signatures_1.default.purposes;
const didRPC_1 = require("./didRPC");
const utils_1 = __importDefault(require("../utils"));
const babyjubjub2021_1 = require("babyjubjub2021");
const babyjubjubsignature2021_1 = require("babyjubjubsignature2021");
const web3_1 = __importDefault(require("web3"));
const did_service_1 = __importDefault(require("../ssiApi/services/did/did.service"));
const enums_1 = require("../../libs/generated/ssi/client/enums");
const v1_1 = __importDefault(require("../../libs/w3cache/v1"));
const documentLoader = jsonld_signatures_1.default.extendContextLoader(v1_1.default);
class DIDDocument {
    constructor(publicKey, blockchainAccountId, id, keyType, verificationRelationships) {
        let vm;
        switch (keyType) {
            case enums_1.VerificationMethodTypes.Ed25519VerificationKey2020: {
                this['@context'] = [
                    constant['DID_' + keyType].DID_BASE_CONTEXT,
                    constant['DID_' + keyType].DID_BABYJUBJUBKEY2021,
                ];
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
            case enums_1.VerificationMethodTypes.BabyJubJubKey2021: {
                this['@context'] = [
                    constant['DID_' + keyType].DID_BASE_CONTEXT,
                    constant['DID_' + keyType].DID_BABYJUBJUBKEY2021,
                ];
                this.id = id;
                this.controller = [this.id];
                vm = {
                    id: this.id + '#key-1',
                    type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
                    controller: this.id,
                    publicKeyMultibase: publicKey,
                };
                const verificationMethod = vm;
                this.verificationMethod = [verificationMethod];
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                this.authentication = [vm.id];
                this.assertionMethod = [vm.id];
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
class HypersignBJJDID {
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
        /**
         * Signs a DIDDocument
         * @params
         *  - params.didDocument               :   Did document to be signed
         *  - params.privateKeyMultibase       :   private key in multibase format (base58 digitalbazar format)
         *  - params.challenge                 :   challenge is a random string generated by the client
         *  - params.did                       :   did of the user
         *  - params.domain                    :   domain is the domain of the DID Document that is being authenticated
         *  - params.verificationMethodId      :   verificationMethodId of the DID
         * @returns {Promise<object>} Signed DID Document
         */
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
    }
    sign(params) {
        throw new Error('Method not implemented.');
    }
    verify(params) {
        throw new Error('Method not implemented.');
    }
    addVerificationMethod(params) {
        throw new Error('Method not implemented.');
    }
    createByClientSpec(params) {
        throw new Error('Method not implemented.');
    }
    registerByClientSpec(params) {
        throw new Error('Method not implemented.');
    }
    updateByClientSpec(params) {
        throw new Error('Method not implemented.');
    }
    deactivateByClientSpec(params) {
        throw new Error('Method not implemented.');
    }
    signAndRegisterByClientSpec(params) {
        throw new Error('Method not implemented.');
    }
    signByClientSpec(params) {
        throw new Error('Method not implemented.');
    }
    _getDateTime() {
        return new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
    }
    _jsonLdSign(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { didDocument, privateKeyMultibase, verificationMethodId } = params;
            const publicKeyId = verificationMethodId + 'assertionMethod';
            const pubKey = (_a = didDocument.assertionMethod) === null || _a === void 0 ? void 0 : _a.find((item) => item.id === publicKeyId);
            const publicKeyMultibase1 = pubKey === null || pubKey === void 0 ? void 0 : pubKey.publicKeyMultibase;
            const keyPair = babyjubjub2021_1.BabyJubJubKeys2021.fromKeys({
                options: {
                    id: publicKeyId,
                    controller: publicKeyId,
                },
                privateKeyMultibase: privateKeyMultibase,
                publicKeyMultibase: publicKeyMultibase1,
            });
            const suite = new babyjubjubsignature2021_1.BabyJubJubSignature2021Suite({ key: keyPair });
            const signedDidDocument = (yield jsonld_signatures_1.default.sign(didDocument, {
                suite,
                purpose: new AssertionProofPurpose(),
                documentLoader,
            }));
            return signedDidDocument.proof;
        });
    }
    _filterVerificationRelationships(verificationRelationships) {
        let vR = [
            enums_1.VerificationMethodRelationships.assertionMethod,
            enums_1.VerificationMethodRelationships.authentication,
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
            if (params && params.mnemonic && params.controller) {
                edKeyPair = yield babyjubjub2021_1.BabyJubJubKeys2021.from(params.mnemonic, {
                    id: params.controller,
                });
            }
            else if (params && params.controller) {
                edKeyPair = yield babyjubjub2021_1.BabyJubJubKeys2021.generate({ id: params.controller });
            }
            else if (params && params.mnemonic) {
                edKeyPair = yield babyjubjub2021_1.BabyJubJubKeys2021.from(params.mnemonic);
            }
            else {
                edKeyPair = yield babyjubjub2021_1.BabyJubJubKeys2021.generate();
            }
            return Object.assign({}, edKeyPair);
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
            const newDid = new DIDDocument(publicKeyMultibase1, '', didId, enums_1.VerificationMethodTypes.BabyJubJubKey2021, verificationRelationships);
            return utils_1.default.jsonToLdConvertor(Object.assign({}, newDid));
        });
    }
    prepareDidDocument(did) {
        const did1 = {};
        Object.assign(did1, did);
        // delete did1.alsoKnownAs;
        //  TODO FIx
        if (did.assertionMethod) {
            did.assertionMethod.map((x) => {
                var _a;
                (_a = did.verificationMethod) === null || _a === void 0 ? void 0 : _a.find((vm) => {
                    if (vm.id === x) {
                        did1.assertionMethod = [
                            {
                                id: vm.id + 'assertionMethod',
                                type: vm.type,
                                publicKeyMultibase: vm.publicKeyMultibase,
                            },
                        ];
                    }
                });
            });
        }
        if (did.authentication) {
            did.authentication.map((x) => {
                var _a;
                (_a = did.verificationMethod) === null || _a === void 0 ? void 0 : _a.find((vm) => {
                    if (vm.id === x) {
                        did1.authentication = [
                            {
                                id: vm.id + 'authentication',
                                type: vm.type,
                                publicKeyMultibase: vm.publicKeyMultibase,
                            },
                        ];
                    }
                });
            });
        }
        did1.capabilityDelegation = [];
        did1.capabilityInvocation = [];
        did1.keyAgreement = [];
        delete did1.verificationMethod;
        return did1;
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
            //ToDO  check if did exists
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
                    const prepareDidDocument = this.prepareDidDocument(didDocument);
                    const proof = yield this._jsonLdSign({
                        didDocument: prepareDidDocument,
                        privateKeyMultibase,
                        verificationMethodId,
                    });
                    signature = proof.proofValue;
                    createdAt = proof.created;
                }
                signInfos.push({
                    type: constant['DID_BabyJubJubKey2021'].SIGNATURE_TYPE,
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
                            const proof = yield this._jsonLdSign({
                                didDocument: didDocument,
                                privateKeyMultibase,
                                verificationMethodId,
                            });
                            signature = proof.proofValue;
                            createdAt = proof.created;
                        }
                        signInfos.push({
                            type: constant['DID_BabyJubJubKey2021'].SIGNATURE_TYPE,
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
                if (result.code !== 0) {
                    throw new Error(result.rawLog);
                }
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
                const proof = yield this._jsonLdSign({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId,
                });
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
            const { didDocument, privateKeyMultibase, verificationMethodId, versionId } = params;
            const prepareDidDocument = this.prepareDidDocument(didDocument);
            const proof = yield this._jsonLdSign({
                didDocument: prepareDidDocument,
                privateKeyMultibase,
                verificationMethodId,
            });
            const signInfos = [
                {
                    type: constant['DID_BabyJubJubKey2021'].SIGNATURE_TYPE,
                    created: (_a = proof.created) !== null && _a !== void 0 ? _a : this._getDateTime(),
                    verificationMethod: verificationMethodId,
                    proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
                    proofValue: proof.proofValue,
                },
            ];
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
            const prepareDidDocument = this.prepareDidDocument(didDocument);
            const proof = yield this._jsonLdSign({
                didDocument: prepareDidDocument,
                privateKeyMultibase,
                verificationMethodId,
            });
            const signInfos = [
                {
                    type: constant['DID_BabyJubJubKey2021'].SIGNATURE_TYPE,
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
}
exports.default = HypersignBJJDID;
