"use strict";
/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constant = __importStar(require("../constants"));
var jsonld_signatures_1 = __importDefault(require("jsonld-signatures"));
var AuthenticationProofPurpose = jsonld_signatures_1.default.purposes.AuthenticationProofPurpose;
var didRPC_1 = require("./didRPC");
var utils_1 = __importDefault(require("../utils"));
var ed25519 = require('@stablelib/ed25519');
var did_1 = require("../../libs/generated/ssi/did");
var ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
var ed25519_signature_2020_1 = require("@digitalbazaar/ed25519-signature-2020");
var web3_1 = __importDefault(require("web3"));
var IDID_1 = require("./IDID");
var v1_1 = __importDefault(require("../../libs/w3cache/v1"));
var DIDDocument = /** @class */ (function () {
    function DIDDocument(publicKey, blockchainAccountId, id, keyType) {
        this.context = [constant['DID_' + keyType].DID_BASE_CONTEXT];
        this.id = id;
        this.controller = [this.id];
        this.alsoKnownAs = [this.id];
        var verificationMethod = {
            id: this.id + '#key-1',
            type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
            controller: this.id,
            blockchainAccountId: blockchainAccountId,
            publicKeyMultibase: publicKey,
        };
        this.verificationMethod = [verificationMethod];
        this.authentication = [verificationMethod.id];
        this.assertionMethod = [verificationMethod.id];
        this.keyAgreement = [verificationMethod.id];
        this.capabilityInvocation = [verificationMethod.id];
        this.capabilityDelegation = [verificationMethod.id];
        // TODO: we should take services object in consntructor
        this.service = [];
    }
    return DIDDocument;
}());
/** Class representing HypersignDID */
var HypersignDID = /** @class */ (function () {
    /**
     * Creates instance of HypersignDID class
     * @constructor
     * @params
     *  - params.namespace        : namespace of did id, Default 'did:hid'
     *  - params.offlineSigner    : signer of type OfflineSigner
     *  - params.nodeRpcEndpoint  : RPC endpoint of the Hypersign blockchain, Default 'TEST'
     *  - params.nodeRestEndpoint : REST endpoint of the Hypersign blockchain
     */
    function HypersignDID(params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        this._getId = function (methodSpecificId) {
            var did = '';
            did =
                _this.namespace && _this.namespace != ''
                    ? "".concat(constant.DID.SCHEME, ":").concat(constant.DID.METHOD, ":").concat(_this.namespace, ":").concat(methodSpecificId)
                    : "".concat(constant.DID.SCHEME, ":").concat(constant.DID.METHOD, ":").concat(methodSpecificId);
            return did;
        };
        var offlineSigner = params.offlineSigner, namespace = params.namespace, nodeRpcEndpoint = params.nodeRpcEndpoint, nodeRestEndpoint = params.nodeRestEndpoint;
        var nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
        var nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
        var rpcConstructorParams = {
            offlineSigner: offlineSigner,
            nodeRpcEndpoint: nodeRPCEp,
            nodeRestEndpoint: nodeRestEp,
        };
        this.didrpc = new didRPC_1.DIDRpc(rpcConstructorParams);
        this.namespace = namespace ? namespace : '';
    }
    HypersignDID.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.didrpc) {
                            throw new Error('HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized');
                        }
                        return [4 /*yield*/, this.didrpc.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HypersignDID.prototype._sign = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKeyMultibaseConverted, didDocString, did, didBytes, signed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privateKeyMultibaseConverted = utils_1.default.convertEd25519verificationkey2020toStableLibKeysInto({
                            privKey: params.privateKeyMultibase,
                        }).privateKeyMultibase;
                        didDocString = params.didDocString;
                        did = JSON.parse(didDocString);
                        return [4 /*yield*/, did_1.Did.encode(did)];
                    case 1:
                        didBytes = (_a.sent()).finish();
                        signed = ed25519.sign(privateKeyMultibaseConverted, didBytes);
                        return [2 /*return*/, Buffer.from(signed).toString('base64')];
                }
            });
        });
    };
    /**
     * Generate a new key pair of type Ed25519VerificationKey2020
     * @params params.seed - Seed to generate the key pair
     * @returns {Promise<object>} The key pair of type Ed25519
     */
    HypersignDID.prototype.generateKeys = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var edKeyPair, seedBytes, exportedKp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(params && params.seed)) return [3 /*break*/, 2];
                        seedBytes = new Uint8Array(Buffer.from(params.seed));
                        return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate({ seed: seedBytes })];
                    case 1:
                        edKeyPair = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate()];
                    case 3:
                        edKeyPair = _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, edKeyPair.export({ publicKey: true, privateKey: true })];
                    case 5:
                        exportedKp = _a.sent();
                        return [2 /*return*/, {
                                privateKeyMultibase: exportedKp.privateKeyMultibase,
                                publicKeyMultibase: exportedKp.publicKeyMultibase, //48 bytes
                            }];
                }
            });
        });
    };
    /**
     * Generates a new DID Document
     * @params
     *  - params.publicKeyMultibase : public key
     *  - params.methodSpecificId   : Optional methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId
     * @returns {Promise<object>} DidDocument object
     */
    HypersignDID.prototype.generate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var publicKeyMultibase1, methodSpecificId, didId, newDid;
            return __generator(this, function (_a) {
                if (!params.publicKeyMultibase) {
                    throw new Error('HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
                }
                publicKeyMultibase1 = utils_1.default.convertEd25519verificationkey2020toStableLibKeysInto({
                    publicKey: params.publicKeyMultibase,
                }).publicKeyMultibase;
                methodSpecificId = publicKeyMultibase1;
                if (params.methodSpecificId) {
                    didId = this._getId(params.methodSpecificId);
                }
                else {
                    didId = this._getId(methodSpecificId);
                }
                newDid = new DIDDocument(publicKeyMultibase1, '', didId, IDID_1.IKeyType.Ed25519VerificationKey2020);
                return [2 /*return*/, utils_1.default.jsonToLdConvertor(__assign({}, newDid))];
            });
        });
    };
    /**
     * Creates a new DID Document from wallet address
     * @params
     *  - params.blockChainAccountId  :
     *  - params.methodSpecificId   : methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId or may be walletaddress
     * @returns {Promise<object>} DidDocument object
     */
    HypersignDID.prototype.create = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var didId, newDid;
            return __generator(this, function (_a) {
                if (typeof this['window'] === 'undefined') {
                    console.log('HID-SSI-SDK:: Warning:  Running in non browser mode');
                }
                if (!params.methodSpecificId) {
                    throw new Error('HID-SSI-SDK:: Error: params.methodSpecificId is required to create didoc');
                }
                if (!params.blockChainAccountId) {
                    throw new Error('HID-SSI-SDK:: Error: params.blockChainAccountId is required to create didoc');
                }
                if (!params.keyType) {
                    throw new Error('HID-SSI-SDK:: Error: params.keyType is required to create didoc');
                }
                if (!(params.keyType in IDID_1.IKeyType)) {
                    throw new Error('HID-SSI-SDK:: Error: params.keyType is invalid');
                }
                didId = this._getId(params.methodSpecificId);
                newDid = new DIDDocument('', params.methodSpecificId, didId, params.keyType);
                return [2 /*return*/, utils_1.default.jsonToLdConvertor(__assign({}, newDid))];
            });
        });
    };
    /**
     * Register a new DID and Document in Hypersign blockchain - an onchain activity
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     * @returns {Promise<object>} Result of the registration
     */
    HypersignDID.prototype.register = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var didDocument, privateKeyMultibase, verificationMethodId, didDocStringJson, signature, didDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // TODO:  this method MUST also accept signature/proof
                        if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
                            throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
                        }
                        if (!params.privateKeyMultibase) {
                            throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
                        }
                        if (!params.verificationMethodId) {
                            throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
                        }
                        if (!this.didrpc) {
                            throw new Error('HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized');
                        }
                        didDocument = params.didDocument, privateKeyMultibase = params.privateKeyMultibase, verificationMethodId = params.verificationMethodId;
                        didDocStringJson = utils_1.default.ldToJsonConvertor(didDocument);
                        return [4 /*yield*/, this._sign({ didDocString: JSON.stringify(didDocStringJson), privateKeyMultibase: privateKeyMultibase })];
                    case 1:
                        signature = _a.sent();
                        didDoc = didDocStringJson;
                        return [4 /*yield*/, this.didrpc.registerDID(didDoc, signature, verificationMethodId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HypersignDID.prototype.registerByClientSpec = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var didDocStringJson, signature, didDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
                            throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
                        }
                        if (!this.didrpc) {
                            throw new Error('HID-SSI-SDK:: Error:  HypersignDID class is not instantiated with Offlinesigner or have not been initilized');
                        }
                        if (!params.verificationMethodId) {
                            throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
                        }
                        if (!params.web3) {
                            new Error("'HID-SSI-SDK:: Error: params.web should be passed");
                        }
                        if (!params.address) {
                            new Error("'HID-SSI-SDK:: Error: params.address is required to sign a did");
                        }
                        didDocStringJson = utils_1.default.ldToJsonConvertor(params.didDocument);
                        console.log('INside sdk', didDocStringJson);
                        return [4 /*yield*/, params.web3.eth.personal.sign(didDocStringJson, params.address)];
                    case 1:
                        signature = _a.sent();
                        didDoc = didDocStringJson;
                        return [4 /*yield*/, this.didrpc.registerDID(didDoc, signature, params.verificationMethodId, IDID_1.IClientSpec.eth_personalSign)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Resolves a DID into DIDDocument from Hypersign blockchain - an onchain activity
     * @params
     *  - params.did                        : DID
     *  - params.ed25519verificationkey2020 : *Optional* True/False
     * @returns  {Promise<IDIDResolve>} didDocument and didDocumentMetadata
     */
    HypersignDID.prototype.resolve = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var result, didDoc, verificationMethods;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.did) {
                            throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
                        }
                        if (!this.didrpc) {
                            throw new Error('HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized');
                        }
                        return [4 /*yield*/, this.didrpc.resolveDID(params.did)];
                    case 1:
                        result = _a.sent();
                        if (params.ed25519verificationkey2020) {
                            didDoc = result.didDocument;
                            verificationMethods = didDoc.verificationMethod;
                            verificationMethods.forEach(function (verificationMethod) {
                                if (verificationMethod.type === constant.DID.VERIFICATION_METHOD_TYPE) {
                                    var ed25519PublicKey = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                                        publicKey: verificationMethod.publicKeyMultibase,
                                    });
                                    verificationMethod.publicKeyMultibase = ed25519PublicKey.publicKeyMultibase;
                                }
                            });
                            didDoc.verificationMethod = verificationMethods;
                        }
                        return [2 /*return*/, {
                                didDocument: utils_1.default.jsonToLdConvertor(result.didDocument),
                                didDocumentMetadata: result.didDocumentMetadata,
                            }];
                }
            });
        });
    };
    /**
     * Update a DIDDocument in Hypersign blockchain - an onchain activity
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     *  - params.versionId            : Version of the document
     * @returns {Promise<object>} Result of the update operation
     */
    HypersignDID.prototype.update = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var didDocument, privateKeyMultibase, verificationMethodId, versionId, didDocStringJson, signature, didDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        if (!this.didrpc) {
                            throw new Error('HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized');
                        }
                        didDocument = params.didDocument, privateKeyMultibase = params.privateKeyMultibase, verificationMethodId = params.verificationMethodId, versionId = params.versionId;
                        didDocStringJson = utils_1.default.ldToJsonConvertor(didDocument);
                        return [4 /*yield*/, this._sign({ didDocString: JSON.stringify(didDocStringJson), privateKeyMultibase: privateKeyMultibase })];
                    case 1:
                        signature = _a.sent();
                        didDoc = didDocStringJson;
                        return [4 /*yield*/, this.didrpc.updateDID(didDoc, signature, verificationMethodId, versionId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Deactivate a DIDDocument in Hypersign blockchain - an onchain activity
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     *  - params.versionId            : Version of the document
     * @returns {Promise<object>} Result of the deactivatee operation
     */
    HypersignDID.prototype.deactivate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var didDocument, privateKeyMultibase, verificationMethodId, versionId, didDocStringJson, signature, didDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        if (!this.didrpc) {
                            throw new Error('HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized');
                        }
                        didDocument = params.didDocument, privateKeyMultibase = params.privateKeyMultibase, verificationMethodId = params.verificationMethodId, versionId = params.versionId;
                        didDocStringJson = utils_1.default.ldToJsonConvertor(didDocument);
                        return [4 /*yield*/, this._sign({ didDocString: JSON.stringify(didDocStringJson), privateKeyMultibase: privateKeyMultibase })];
                    case 1:
                        signature = _a.sent();
                        didDoc = didDocStringJson;
                        return [4 /*yield*/, this.didrpc.deactivateDID(didDoc.id, signature, verificationMethodId, versionId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Signs a DIDDocument
     * @params
     *  - params.didDocument               :
     *  - params.privateKeyMultibase       :   private key in multibase format (base58 digitalbazar format)
     *  - params.challenge                 :   challenge is a random string generated by the client
     *  - params.did                       :   did of the user
     *  - params.domain                    :   domain is the domain of the DID Document that is being authenticated
     *  - params.verificationMethodId      :   verificationMethodId of the DID
     * @returns {Promise<object>} Signed DID Document
     */
    HypersignDID.prototype.sign = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKeyMultibase, challenge, domain, did, didDocument, verificationMethodId, resolveddoc, error_1, publicKeyId, pubkey, publicKeyMultibase1, keyPair, suite, didDocumentLd, signedDidDocument;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privateKeyMultibase = params.privateKeyMultibase, challenge = params.challenge, domain = params.domain, did = params.did, didDocument = params.didDocument, verificationMethodId = params.verificationMethodId;
                        if (!privateKeyMultibase) {
                            throw new Error('HID-SSI-SDK:: Error: params.privateKey is required to sign a did');
                        }
                        if (!challenge) {
                            throw new Error('HID-SSI-SDK:: Error: params.challenge is required to sign a did');
                        }
                        if (!domain) {
                            throw new Error('HID-SSI-SDK:: Error: params.domain is required to sign a did');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (!(did && this.didrpc)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.didrpc.resolveDID(did)];
                    case 2:
                        resolveddoc = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (didDocument) {
                            resolveddoc = {};
                            resolveddoc.didDocument = didDocument;
                        }
                        else {
                            throw new Error('HID-SSI-SDK:: Error: params.did or params.didDocument is required to sign a did');
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        throw new Error("HID-SSI-SDK:: Error: could not resolve did ".concat(did));
                    case 6:
                        publicKeyId = verificationMethodId;
                        pubkey = resolveddoc.didDocument.verificationMethod.find(function (item) { return item.id === publicKeyId; });
                        if (!pubkey) {
                            throw new Error('HID-SSI-SDK:: Error: Incorrect verification method id');
                        }
                        publicKeyMultibase1 = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                            publicKey: pubkey.publicKeyMultibase,
                        }).publicKeyMultibase;
                        return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from({
                                id: publicKeyId,
                                privateKeyMultibase: privateKeyMultibase,
                                publicKeyMultibase: publicKeyMultibase1,
                            })];
                    case 7:
                        keyPair = _a.sent();
                        suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                            verificationMethod: publicKeyId,
                            key: keyPair,
                        });
                        didDocumentLd = utils_1.default.jsonToLdConvertor(resolveddoc.didDocument);
                        didDocumentLd['@context'].push(constant.VC.CREDENTAIL_SECURITY_SUITE);
                        return [4 /*yield*/, jsonld_signatures_1.default.sign(didDocumentLd, {
                                suite: suite,
                                purpose: new AuthenticationProofPurpose({
                                    challenge: challenge,
                                    domain: domain,
                                }),
                                documentLoader: v1_1.default,
                                compactProof: constant.compactProof,
                            })];
                    case 8:
                        signedDidDocument = (_a.sent());
                        return [2 /*return*/, signedDidDocument];
                }
            });
        });
    };
    HypersignDID.prototype.signByClientSpec = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var web3;
            return __generator(this, function (_a) {
                if (typeof this['window'] === 'undefined') {
                    throw new Error('HID-SSI-SDK:: Error:  Running in non browser mode');
                }
                if (!params.didDocument) {
                    throw Error('HID-SSI-SDK:: Error: params.didDocument is required to sign');
                }
                if (!params.clientSpec) {
                    throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to sign');
                }
                if (!(params.clientSpec in IDID_1.IClientSpec)) {
                    throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is invalid');
                }
                switch (params.clientSpec) {
                    case IDID_1.IClientSpec.eth_personalSign: {
                        if (typeof params.chainId !== 'number') {
                            throw Error('HID-SSI-SDK:: Error: Invalid eth chain id');
                        }
                        web3 = new web3_1.default();
                        break;
                    }
                    case IDID_1.IClientSpec.cosmos_ADR036: {
                        throw Error('HID-SSI-SDK:: Error: Not Supported yet');
                    }
                    default:
                        break;
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Verifies a signed DIDDocument
     * @params
     *  - params.didDocument :   Signed DID Document
     *  - params.privateKey  :   private key in multibase format (base58 digitalbazar format)
     *  - params.challenge   :   challenge is a random string generated by the client
     *  - params.did         :   did of the user
     *  - params.domain      :   domain is the domain of the DID Document that is being authenticated
     * @returns Promise<{ verificationResult }> Verification Result
     */
    HypersignDID.prototype.verify = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var didDocument, verificationMethodId, challenge, domain, didDoc, publicKeyId, pubkey, publicKeyMultibase1, keyPair, suite, controller, purpose, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        didDocument = params.didDocument, verificationMethodId = params.verificationMethodId, challenge = params.challenge, domain = params.domain;
                        if (!didDocument) {
                            throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to verify a did');
                        }
                        if (!didDocument['proof']) {
                            throw new Error('HID-SSI-SDK:: Error: params.didDocument.proof is not present in the signed did document');
                        }
                        if (!verificationMethodId) {
                            throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to verify a did');
                        }
                        if (!challenge) {
                            throw new Error('HID-SSI-SDK:: Error: params.challenge is required to verify a did');
                        }
                        didDoc = didDocument;
                        publicKeyId = verificationMethodId;
                        pubkey = didDoc.verificationMethod.find(function (item) { return item.id === publicKeyId; });
                        if (!pubkey) {
                            throw new Error('HID-SSI-SDK:: Error: could not find verification method for verificationMethodId: ' +
                                verificationMethodId +
                                ' in did document');
                        }
                        publicKeyMultibase1 = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                            publicKey: pubkey.publicKeyMultibase,
                        }).publicKeyMultibase;
                        return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from({
                                id: publicKeyId,
                                publicKeyMultibase: publicKeyMultibase1,
                            })];
                    case 1:
                        keyPair = _a.sent();
                        suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                            key: keyPair,
                        });
                        suite.date = new Date(new Date().getTime() - 100000).toISOString();
                        controller = {
                            '@context': constant.DID.CONTROLLER_CONTEXT,
                            id: publicKeyId,
                            authentication: didDoc.authentication,
                        };
                        purpose = new AuthenticationProofPurpose({
                            controller: controller,
                            challenge: challenge,
                            domain: domain,
                        });
                        return [4 /*yield*/, jsonld_signatures_1.default.verify(didDoc, {
                                suite: suite,
                                purpose: purpose,
                                documentLoader: v1_1.default,
                                compactProof: constant.compactProof,
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return HypersignDID;
}());
exports.default = HypersignDID;
