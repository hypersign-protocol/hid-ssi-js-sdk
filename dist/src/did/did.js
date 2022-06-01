"use strict";
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
var uuid_1 = require("uuid");
var didRPC_1 = require("./didRPC");
var utils_1 = __importDefault(require("../utils"));
var ed25519 = require('@stablelib/ed25519');
var did_1 = require("../generated/ssi/did");
var ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
var DID = /** @class */ (function () {
    function DID(publicKey) {
        this.getId = function () { return "".concat(constant.DID.SCHEME, ":").concat((0, uuid_1.v4)()); };
        this.context = [constant.DID.DID_BASE_CONTEXT];
        this.id = this.getId();
        this.controller = [this.id];
        this.alsoKnownAs = [this.id];
        var verificationMethod = {
            id: this.id + '#' + publicKey,
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
    DID.prototype.getDidString = function () {
        return JSON.stringify(this);
    };
    return DID;
}());
var HypersignDID = /** @class */ (function () {
    function HypersignDID() {
        this.didrpc = new didRPC_1.DIDRpc();
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
        if (!params.publicKeyMultibase) {
            throw new Error('HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
        }
        var publicKeyMultibase1 = utils_1.default.convertEd25519verificationkey2020toStableLibKeysInto({
            publicKey: params.publicKeyMultibase,
        }).publicKeyMultibase;
        var newDid = new DID(publicKeyMultibase1);
        return newDid.getDidString();
    };
    // TODO:  this method MUST also accept signature/proof
    HypersignDID.prototype.register = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var didDocString, privateKeyMultibase, verificationMethodId, signature, didDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.didDocString) {
                            throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
                        }
                        if (!params.privateKeyMultibase) {
                            throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
                        }
                        if (!params.privateKeyMultibase) {
                            throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
                        }
                        didDocString = params.didDocString, privateKeyMultibase = params.privateKeyMultibase, verificationMethodId = params.verificationMethodId;
                        return [4 /*yield*/, this.sign({ didDocString: didDocString, privateKeyMultibase: privateKeyMultibase })];
                    case 1:
                        signature = _a.sent();
                        didDoc = JSON.parse(didDocString);
                        return [4 /*yield*/, this.didrpc.registerDID(didDoc, signature, verificationMethodId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HypersignDID.prototype.resolve = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.did) {
                            throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
                        }
                        return [4 /*yield*/, this.didrpc.resolveDID(params.did)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Update DID Document
    HypersignDID.prototype.update = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var didDocString, privateKeyMultibase, verificationMethodId, versionId, signature, didDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.didDocString) {
                            throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to update a did');
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
                        didDocString = params.didDocString, privateKeyMultibase = params.privateKeyMultibase, verificationMethodId = params.verificationMethodId, versionId = params.versionId;
                        return [4 /*yield*/, this.sign({ didDocString: didDocString, privateKeyMultibase: privateKeyMultibase })];
                    case 1:
                        signature = _a.sent();
                        didDoc = JSON.parse(didDocString);
                        return [4 /*yield*/, this.didrpc.updateDID(didDoc, signature, verificationMethodId, versionId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HypersignDID.prototype.deactivate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var didDocString, privateKeyMultibase, verificationMethodId, versionId, signature, didDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.didDocString) {
                            throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to deactivate a did');
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
                        didDocString = params.didDocString, privateKeyMultibase = params.privateKeyMultibase, verificationMethodId = params.verificationMethodId, versionId = params.versionId;
                        return [4 /*yield*/, this.sign({ didDocString: didDocString, privateKeyMultibase: privateKeyMultibase })];
                    case 1:
                        signature = _a.sent();
                        didDoc = JSON.parse(didDocString);
                        return [4 /*yield*/, this.didrpc.deactivateDID(didDoc, signature, verificationMethodId, versionId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /// Did Auth
    HypersignDID.prototype.signDid = function (params) {
        throw new Error('HID-SSI-SDK:: Error: Method not impplemented');
    };
    // verify the signature
    HypersignDID.prototype.verify = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('HID-SSI-SDK:: Error: Method not implemented');
            });
        });
    };
    return HypersignDID;
}());
exports.default = HypersignDID;
