"use strict";
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
var jsonld_1 = require("jsonld");
var AuthenticationProofPurpose = jsonld_signatures_1.default.purposes.AuthenticationProofPurpose;
var didRPC_1 = require("./didRPC");
var utils_1 = __importDefault(require("../utils"));
var ed25519 = require('@stablelib/ed25519');
var did_1 = require("../generated/ssi/did");
var ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
var ed25519_signature_2020_1 = require("@digitalbazaar/ed25519-signature-2020");
var DIDDocument = /** @class */ (function () {
    function DIDDocument(publicKey, id) {
        this.context = [constant.DID.DID_BASE_CONTEXT];
        this.id = id;
        this.controller = [this.id];
        this.alsoKnownAs = [this.id];
        var verificationMethod = {
            id: this.id + '#key-1',
            type: constant.DID.VERIFICATION_METHOD_TYPE,
            controller: this.id,
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
var HypersignDID = /** @class */ (function () {
    function HypersignDID(namespace) {
        var _this = this;
        this.getId = function (methodSpecificId) {
            var did = '';
            did =
                _this.namespace && _this.namespace != ''
                    ? "".concat(constant.DID.SCHEME, ":").concat(constant.DID.METHOD, ":").concat(_this.namespace, ":").concat(methodSpecificId)
                    : "".concat(constant.DID.SCHEME, ":").concat(constant.DID.METHOD, ":").concat(methodSpecificId);
            return did;
        };
        this.didrpc = new didRPC_1.DIDRpc();
        this.namespace = namespace ? namespace : '';
    }
    // Sign the doc
    HypersignDID.prototype.sign = function (params) {
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
    // Generate a new key pair of type Ed25519VerificationKey2020
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
    /// Generate Did Document
    HypersignDID.prototype.generate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var publicKeyMultibase1, methodSpecificId, did, newDid;
            return __generator(this, function (_a) {
                if (!params.publicKeyMultibase) {
                    throw new Error('HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
                }
                publicKeyMultibase1 = utils_1.default.convertEd25519verificationkey2020toStableLibKeysInto({
                    publicKey: params.publicKeyMultibase,
                }).publicKeyMultibase;
                methodSpecificId = publicKeyMultibase1;
                did = this.getId(methodSpecificId);
                newDid = new DIDDocument(publicKeyMultibase1, did);
                return [2 /*return*/, utils_1.default.jsonToLdConvertor(__assign({}, newDid))];
            });
        });
    };
    // TODO:  this method MUST also accept signature/proof
    HypersignDID.prototype.register = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var didDocument, privateKeyMultibase, verificationMethodId, didDocStringJson, signature, didDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.didDocument) {
                            throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
                        }
                        if (!params.privateKeyMultibase) {
                            throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
                        }
                        if (!params.privateKeyMultibase) {
                            throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
                        }
                        didDocument = params.didDocument, privateKeyMultibase = params.privateKeyMultibase, verificationMethodId = params.verificationMethodId;
                        didDocStringJson = utils_1.default.ldToJsonConvertor(didDocument);
                        return [4 /*yield*/, this.sign({ didDocString: JSON.stringify(didDocStringJson), privateKeyMultibase: privateKeyMultibase })];
                    case 1:
                        signature = _a.sent();
                        didDoc = didDocStringJson;
                        return [4 /*yield*/, this.didrpc.registerDID(didDoc, signature, verificationMethodId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @param params params: { did?: string  }
     *
     *  if did is provided then it will resolve the did doc from the blockchain
     *
     * @returns  Promise : {context ,didDocument, VerificationResult , didDocumentMetadata}
     */
    HypersignDID.prototype.resolve = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.did) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.didrpc.resolveDID(params.did)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                didDocument: utils_1.default.jsonToLdConvertor(result.didDocument),
                                didDocumentMetadata: result.didDocumentMetadata,
                            }];
                    case 2: throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
                }
            });
        });
    };
    // Update DID Document
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
                        if (!params.privateKeyMultibase) {
                            throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
                        }
                        if (!params.versionId) {
                            throw new Error('HID-SSI-SDK:: Error: params.versionId is required to update a did');
                        }
                        didDocument = params.didDocument, privateKeyMultibase = params.privateKeyMultibase, verificationMethodId = params.verificationMethodId, versionId = params.versionId;
                        didDocStringJson = utils_1.default.ldToJsonConvertor(didDocument);
                        return [4 /*yield*/, this.sign({ didDocString: JSON.stringify(didDocStringJson), privateKeyMultibase: privateKeyMultibase })];
                    case 1:
                        signature = _a.sent();
                        didDoc = didDocStringJson;
                        return [4 /*yield*/, this.didrpc.updateDID(didDoc, signature, verificationMethodId, versionId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
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
                        if (!params.privateKeyMultibase) {
                            throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
                        }
                        if (!params.versionId) {
                            throw new Error('HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
                        }
                        didDocument = params.didDocument, privateKeyMultibase = params.privateKeyMultibase, verificationMethodId = params.verificationMethodId, versionId = params.versionId;
                        didDocStringJson = utils_1.default.ldToJsonConvertor(didDocument);
                        return [4 /*yield*/, this.sign({ didDocString: JSON.stringify(didDocStringJson), privateKeyMultibase: privateKeyMultibase })];
                    case 1:
                        signature = _a.sent();
                        didDoc = didDocStringJson;
                        return [4 /*yield*/, this.didrpc.deactivateDID(didDoc.id, signature, verificationMethodId, versionId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /// Did Auth
    /**
     *
     * @param params
     * -    params { privateKey, challenge, domain, did}
     * -    privateKey  :   private key in multibase format (base58 digitalbazar format)
     * -    challenge   :   challenge is a random string generated by the client
     * -    did         :   did of the user
     * -    domain      :   domain is the domain of the DID Document that is being authenticated
     * @returns signed {signedDidDocument}
     */
    HypersignDID.prototype.signDid = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKey, challenge, domain, did, doc, verificationMethodId, resolveddoc, error_1, publicKeyId, pubkey, publicKeyMultibase1, keyPair, suite, didDocumentLd, signedDidDocument;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privateKey = params.privateKey, challenge = params.challenge, domain = params.domain, did = params.did, doc = params.doc, verificationMethodId = params.verificationMethodId;
                        if (!privateKey) {
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
                        if (!did) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.didrpc.resolveDID(did)];
                    case 2:
                        resolveddoc = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (doc) {
                            resolveddoc = {};
                            resolveddoc.didDocument = doc;
                        }
                        else {
                            throw new Error('HID-SSI-SDK:: Error: params.did or params.doc is required to sign a did');
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a public did');
                    case 6:
                        publicKeyId = verificationMethodId;
                        pubkey = resolveddoc.didDocument.verificationMethod.find(function (item) { return item.id === publicKeyId; });
                        if (!pubkey) {
                            throw new Error('HID-SSI-SDK:: Incorrect verification method id');
                        }
                        publicKeyMultibase1 = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                            publicKey: pubkey.publicKeyMultibase,
                        }).publicKeyMultibase;
                        return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from({
                                id: publicKeyId,
                                privateKeyMultibase: privateKey,
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
                                documentLoader: jsonld_1.documentLoader,
                                compactProof: constant.compactProof,
                            })];
                    case 8:
                        signedDidDocument = _a.sent();
                        return [2 /*return*/, { signedDidDocument: signedDidDocument }];
                }
            });
        });
    };
    // verify the signature
    /**
     *
     * @param params IParams
     * -    params { doc: signedDidDocument}
     * -    doc  :   signed did document
     *
     * @returns VerificationResult {VerificationResult}
     */
    HypersignDID.prototype.verify = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, verificationMethodId, challenge, domain, didDoc, publicKeyId, pubkey, result, publicKeyMultibase1, keyPair, suite, controller, purpose;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc = params.doc, verificationMethodId = params.verificationMethodId, challenge = params.challenge, domain = params.domain;
                        if (!doc) {
                            throw new Error('HID-SSI-SDK:: Error: params.doc is required to verify a did');
                        }
                        if (!verificationMethodId) {
                            throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to verify a did');
                        }
                        if (!challenge) {
                            throw new Error('HID-SSI-SDK:: Error: params.challenge is required to verify a did');
                        }
                        didDoc = doc;
                        publicKeyId = verificationMethodId;
                        pubkey = didDoc.verificationMethod.find(function (item) { return item.id === publicKeyId; });
                        if (!pubkey) return [3 /*break*/, 3];
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
                                documentLoader: jsonld_1.documentLoader,
                                compactProof: constant.compactProof,
                            })];
                    case 2:
                        result = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, { verificationResult: result }];
                }
            });
        });
    };
    return HypersignDID;
}());
exports.default = HypersignDID;