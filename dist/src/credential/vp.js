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
var vc_js_1 = __importDefault(require("vc-js"));
var jsonld_signatures_1 = __importDefault(require("jsonld-signatures"));
var jsonld_1 = require("jsonld");
var uuid_1 = require("uuid");
var did_1 = __importDefault(require("../did/did"));
var ed25519_signature_2020_1 = require("@digitalbazaar/ed25519-signature-2020");
var ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
var utils_1 = __importDefault(require("../utils"));
var vc_1 = __importDefault(require("./vc"));
var _a = jsonld_signatures_1.default.purposes, AuthenticationProofPurpose = _a.AuthenticationProofPurpose, AssertionProofPurpose = _a.AssertionProofPurpose;
var constants_1 = require("../constants");
var HypersignVerifiablePresentation = /** @class */ (function () {
    function HypersignVerifiablePresentation() {
        this.getId = function () {
            return constants_1.VP.PREFIX + (0, uuid_1.v4)();
        };
        this.hsDid = new did_1.default();
        this.vc = new vc_1.default();
        this.id = '';
        this.type = [];
        this.verifiableCredential = [];
        this.holder = '';
        this.proof = {};
    }
    HypersignVerifiablePresentation.prototype.getPresentation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id, presentation;
            return __generator(this, function (_a) {
                id = this.getId();
                presentation = vc_js_1.default.createPresentation({
                    verifiableCredential: params.verifiableCredential,
                    id: id,
                    holder: params.holderDid,
                });
                return [2 /*return*/, presentation];
            });
        });
    };
    HypersignVerifiablePresentation.prototype.signPresentation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var signerDidDoc, publicKeyId, publicKeyVerMethod, convertedKeyPair, keyPair, suite, signedVP;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.holderDid) {
                            throw new Error('params.holderDid is required for signinng a presentation');
                        }
                        if (!params.privateKey) {
                            throw new Error('params.privateKey is required for signinng a presentation');
                        }
                        if (!params.presentation) {
                            throw new Error('params.presentation is required for signinng a presentation');
                        }
                        if (!params.challenge) {
                            throw new Error('params.challenge is required for signinng a presentation');
                        }
                        return [4 /*yield*/, this.hsDid.resolve({ did: params.holderDid })];
                    case 1:
                        signerDidDoc = (_a.sent()).didDocument;
                        publicKeyId = signerDidDoc['assertionMethod'][0];
                        publicKeyVerMethod = signerDidDoc['verificationMethod'].find(function (x) { return x.id == publicKeyId; });
                        convertedKeyPair = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                            publicKey: publicKeyVerMethod.publicKeyMultibase,
                        });
                        publicKeyVerMethod['publicKeyMultibase'] = convertedKeyPair.publicKeyMultibase;
                        return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(__assign({ privateKeyMultibase: params.privateKey }, publicKeyVerMethod))];
                    case 2:
                        keyPair = _a.sent();
                        suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                            verificationMethod: publicKeyId,
                            key: keyPair,
                        });
                        return [4 /*yield*/, vc_js_1.default.signPresentation({
                                presentation: params.presentation,
                                suite: suite,
                                challenge: params.challenge,
                                documentLoader: jsonld_1.documentLoader,
                            })];
                    case 3:
                        signedVP = _a.sent();
                        return [2 /*return*/, signedVP];
                }
            });
        });
    };
    // https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L392
    HypersignVerifiablePresentation.prototype.verifyPresentation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var holderDID, holderDidDoc, holderPublicKeyId, holderPublicKeyVerMethod, holderPublicKeyMultibase, holderController, presentationPurpose, keyPair, vpSuite_holder, issuerDID, issuerDidDoc, issuerPublicKeyId, issuerPublicKeyVerMethod, issuerPublicKeyMultibase, issuerController, purpose, issuerKeyPair, vcSuite_issuer, that, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.holderDid) {
                            throw new Error('params.signedPresentation is required for verifying a presentation');
                        }
                        if (!params.issuerDid) {
                            throw new Error('params.issuerDid is required for verifying a presentation');
                        }
                        if (!params.holderDid) {
                            throw new Error('params.holderDid is required for verifying a presentation');
                        }
                        if (!params.challenge) {
                            throw new Error('params.challenge is required for verifying a presentation');
                        }
                        return [4 /*yield*/, this.hsDid.resolve({ did: params.holderDid })];
                    case 1:
                        holderDID = (_a.sent()).didDocument;
                        holderDidDoc = holderDID;
                        holderPublicKeyId = holderDidDoc.authentication[0];
                        holderPublicKeyVerMethod = holderDidDoc.verificationMethod.find(function (x) { return x.id == holderPublicKeyId; });
                        holderPublicKeyMultibase = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                            publicKey: holderPublicKeyVerMethod.publicKeyMultibase,
                        }).publicKeyMultibase;
                        holderPublicKeyVerMethod.publicKeyMultibase = holderPublicKeyMultibase;
                        holderController = {
                            '@context': constants_1.DID.CONTROLLER_CONTEXT,
                            id: holderDidDoc.id,
                            authentication: holderDidDoc.authentication,
                        };
                        presentationPurpose = new AuthenticationProofPurpose({
                            controller: holderController,
                            challenge: params.challenge,
                        });
                        return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(__assign({ privateKeyMultibase: '' }, holderPublicKeyVerMethod))];
                    case 2:
                        keyPair = _a.sent();
                        vpSuite_holder = new ed25519_signature_2020_1.Ed25519Signature2020({
                            verificationMethod: holderPublicKeyId,
                            key: keyPair,
                        });
                        return [4 /*yield*/, this.hsDid.resolve({ did: params.issuerDid })];
                    case 3:
                        issuerDID = (_a.sent()).didDocument;
                        issuerDidDoc = issuerDID;
                        issuerPublicKeyId = issuerDidDoc.assertionMethod[0];
                        issuerPublicKeyVerMethod = issuerDidDoc.verificationMethod.find(function (x) { return x.id == issuerPublicKeyId; });
                        issuerPublicKeyMultibase = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                            publicKey: issuerPublicKeyVerMethod.publicKeyMultibase,
                        }).publicKeyMultibase;
                        issuerPublicKeyVerMethod.publicKeyMultibase = issuerPublicKeyMultibase;
                        issuerController = {
                            '@context': constants_1.DID.CONTROLLER_CONTEXT,
                            id: issuerDidDoc.id,
                            assertionMethod: issuerDidDoc.assertionMethod,
                        };
                        purpose = new AssertionProofPurpose({
                            controller: issuerController,
                        });
                        return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(__assign({ privateKeyMultibase: '' }, issuerPublicKeyVerMethod))];
                    case 4:
                        issuerKeyPair = _a.sent();
                        vcSuite_issuer = new ed25519_signature_2020_1.Ed25519Signature2020({
                            verificationMethod: issuerPublicKeyId,
                            key: issuerKeyPair,
                        });
                        that = this;
                        return [4 /*yield*/, vc_js_1.default.verify({
                                presentation: params.signedPresentation,
                                presentationPurpose: presentationPurpose,
                                purpose: purpose,
                                suite: [vpSuite_holder, vcSuite_issuer],
                                documentLoader: jsonld_1.documentLoader,
                                checkStatus: function (options) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.log('Iside checkStatus()');
                                                    return [4 /*yield*/, that.vc.checkCredentialStatus(options.credential.id)];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        });
                                    });
                                },
                            })];
                    case 5:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return HypersignVerifiablePresentation;
}());
exports.default = HypersignVerifiablePresentation;
