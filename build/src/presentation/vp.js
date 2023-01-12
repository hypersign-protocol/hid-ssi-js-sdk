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
var did_1 = __importDefault(require("../did/did"));
var ed25519_signature_2020_1 = require("@digitalbazaar/ed25519-signature-2020");
var ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
var utils_1 = __importDefault(require("../utils"));
var vc_1 = __importDefault(require("../credential/vc"));
var _a = jsonld_signatures_1.default.purposes, AuthenticationProofPurpose = _a.AuthenticationProofPurpose, AssertionProofPurpose = _a.AssertionProofPurpose;
var constants_1 = require("../constants");
var HypersignVerifiablePresentation = /** @class */ (function () {
    function HypersignVerifiablePresentation(params) {
        if (params === void 0) { params = {}; }
        var namespace = params.namespace, nodeRpcEndpoint = params.nodeRpcEndpoint, nodeRestEndpoint = params.nodeRestEndpoint;
        this.namespace = namespace && namespace != '' ? namespace : '';
        var nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
        var nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
        var offlineConstuctorParams = { nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp };
        this.vc = new vc_1.default(offlineConstuctorParams);
        this.hsDid = new did_1.default(offlineConstuctorParams);
        this.id = '';
        this.type = [];
        this.verifiableCredential = [];
        this.holder = '';
        this.proof = {};
    }
    HypersignVerifiablePresentation.prototype._getId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var uuid, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.default.getUUID()];
                    case 1:
                        uuid = _a.sent();
                        if (this.namespace && this.namespace != '') {
                            id = "".concat(constants_1.VP.SCHEME, ":").concat(constants_1.VP.METHOD, ":").concat(this.namespace, ":").concat(uuid);
                        }
                        else {
                            id = "".concat(constants_1.VP.SCHEME, ":").concat(constants_1.VP.METHOD, ":").concat(uuid);
                        }
                        return [2 /*return*/, id];
                }
            });
        });
    };
    /**
     * Generates a new presentation document
     * @params
     *  - params.verifiableCredentials: Array of Verifiable Credentials
     *  - params.holderDid            : DID of the subject
     * @returns {Promise<object>}
     */
    HypersignVerifiablePresentation.prototype.generate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id, presentation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getId()];
                    case 1:
                        id = _a.sent();
                        presentation = vc_js_1.default.createPresentation({
                            verifiableCredential: params.verifiableCredentials,
                            id: id,
                            holder: params.holderDid,
                        });
                        return [2 /*return*/, presentation];
                }
            });
        });
    };
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
    HypersignVerifiablePresentation.prototype.sign = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var resolvedDidDoc, signerDidDoc, publicKeyId, publicKeyVerMethod, convertedKeyPair, keyPair, suite, signedVP;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        if (!params.holderDid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.hsDid.resolve({ did: params.holderDid })];
                    case 1:
                        resolvedDidDoc = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        if (params.holderDidDocSigned) {
                            resolvedDidDoc = {};
                            resolvedDidDoc.didDocument = params.holderDidDocSigned;
                        }
                        else {
                            throw new Error('HID-SSI-SDK:: params.holderDid or params.holderDidDocSigned is required for signinng a presentation');
                        }
                        _a.label = 3;
                    case 3:
                        signerDidDoc = resolvedDidDoc.didDocument;
                        publicKeyId = params.verificationMethodId;
                        publicKeyVerMethod = signerDidDoc['verificationMethod'].find(function (x) { return x.id == publicKeyId; });
                        convertedKeyPair = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                            publicKey: publicKeyVerMethod.publicKeyMultibase,
                        });
                        publicKeyVerMethod['publicKeyMultibase'] = convertedKeyPair.publicKeyMultibase;
                        return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(__assign({ privateKeyMultibase: params.privateKeyMultibase }, publicKeyVerMethod))];
                    case 4:
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
                    case 5:
                        signedVP = _a.sent();
                        return [2 /*return*/, signedVP];
                }
            });
        });
    };
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
    HypersignVerifiablePresentation.prototype.verify = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var resolvedDidDoc, holderDID, holderDidDoc, holderPublicKeyId, holderPublicKeyVerMethod, holderPublicKeyMultibase, holderController, presentationPurpose, keyPair, vpSuite_holder, issuerDID, issuerDidDoc, issuerDidDocController, issuerDidDocControllerVerificationMethod, issuerPublicKeyId, issuerPublicKeyVerMethod, controllerDidDocT, controllerDidDoc, issuerPublicKeyMultibase, issuerController, purpose, issuerKeyPair, vcSuite_issuer, that, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        if (!params.holderDid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.hsDid.resolve({ did: params.holderDid })];
                    case 1:
                        resolvedDidDoc = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        if (params.holderDidDocSigned) {
                            resolvedDidDoc = {};
                            resolvedDidDoc.didDocument = params.holderDidDocSigned;
                        }
                        else {
                            throw new Error('Either holderDid or holderDidDocSigned should be provided');
                        }
                        _a.label = 3;
                    case 3:
                        holderDID = resolvedDidDoc.didDocument;
                        holderDidDoc = holderDID;
                        holderPublicKeyId = params.holderVerificationMethodId;
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
                    case 4:
                        keyPair = _a.sent();
                        vpSuite_holder = new ed25519_signature_2020_1.Ed25519Signature2020({
                            verificationMethod: holderPublicKeyId,
                            key: keyPair,
                        });
                        return [4 /*yield*/, this.hsDid.resolve({ did: params.issuerDid })];
                    case 5:
                        issuerDID = (_a.sent()).didDocument;
                        if (issuerDID === null || issuerDID === undefined) {
                            throw new Error('Issuer DID is not registered');
                        }
                        issuerDidDoc = issuerDID;
                        issuerDidDocController = issuerDidDoc.controller;
                        issuerDidDocControllerVerificationMethod = params.issuerVerificationMethodId.split('#')[0];
                        if (!issuerDidDocController.includes(issuerDidDocControllerVerificationMethod)) {
                            throw new Error(issuerDidDocControllerVerificationMethod + ' is not a controller of ' + params.issuerDid);
                        }
                        issuerPublicKeyId = params.issuerVerificationMethodId;
                        issuerPublicKeyVerMethod = issuerDidDoc.verificationMethod.find(function (x) { return x.id == issuerPublicKeyId; });
                        if (!(issuerPublicKeyVerMethod === null || issuerPublicKeyVerMethod === undefined)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.hsDid.resolve({
                                did: issuerDidDocControllerVerificationMethod,
                            })];
                    case 6:
                        controllerDidDocT = (_a.sent()).didDocument;
                        controllerDidDoc = controllerDidDocT;
                        issuerPublicKeyVerMethod = controllerDidDoc.verificationMethod.find(function (x) { return x.id == issuerPublicKeyId; });
                        _a.label = 7;
                    case 7:
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
                    case 8:
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
                                unsignedPresentation: true,
                                checkStatus: function (options) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, that.vc.checkCredentialStatus({ credentialId: options.credential.id })];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        });
                                    });
                                },
                            })];
                    case 9:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return HypersignVerifiablePresentation;
}());
exports.default = HypersignVerifiablePresentation;
