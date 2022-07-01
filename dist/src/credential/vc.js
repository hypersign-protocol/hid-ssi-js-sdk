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
var utils_1 = __importDefault(require("../utils"));
var jsonld_1 = require("jsonld");
var uuid_1 = require("uuid");
var schema_1 = __importDefault(require("../schema/schema"));
var did_1 = __importDefault(require("../did/did"));
var ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
var ed25519_signature_2020_1 = require("@digitalbazaar/ed25519-signature-2020");
var ed25519 = require('@stablelib/ed25519');
var credRPC_1 = require("./credRPC");
var constants_1 = require("../constants");
var credential_1 = require("../generated/ssi/credential");
var crypto_1 = __importDefault(require("crypto"));
var sha256 = crypto_1.default.createHash('sha256');
var HypersignVerifiableCredential = /** @class */ (function () {
    function HypersignVerifiableCredential() {
        var _this = this;
        this.getId = function () {
            return constants_1.VC.PREFIX + (0, uuid_1.v4)();
        };
        this.checkIfAllRequiredPropsAreSent = function (sentAttributes, requiredProps) {
            return !requiredProps.some(function (x) { return sentAttributes.indexOf(x) === -1; });
        };
        this.getCredentialSubject = function (schemaProperty, attributesMap) {
            var cs = {};
            var sentPropes = Object.keys(attributesMap);
            if (schemaProperty.properties) {
                schemaProperty['propertiesParsed'] = JSON.parse(schemaProperty.properties);
            }
            var SchemaProps = Object.keys(schemaProperty['propertiesParsed']);
            var props = [];
            // Check for "additionalProperties" in schemaProperty
            if (!schemaProperty.additionalProperties) {
                if (sentPropes.length > SchemaProps.length || !_this.checkIfAllRequiredPropsAreSent(SchemaProps, sentPropes))
                    throw new Error("Only ".concat(JSON.stringify(SchemaProps), " attributes are possible. additionalProperties is false in the schema"));
                props = SchemaProps;
            }
            else {
                props = sentPropes;
            }
            // Check all required propes
            var requiredPros = Object.values(schemaProperty.required);
            if (!_this.checkIfAllRequiredPropsAreSent(sentPropes, requiredPros))
                throw new Error("".concat(JSON.stringify(requiredPros), " are required properties"));
            // Attach the values of props
            props.forEach(function (p) {
                cs[p] = attributesMap[p];
            });
            return cs;
        };
        //
        // TODO: https://www.w3.org/TR/vc-data-model/#data-schemas
        // TODO: handle schemaUrl variable properly later.
        this.getCredentialContext = function (schemaId, schemaProperties) {
            var context = [];
            var schemaUrl = "".concat(_this.hsSchema.schemaRpc.schemaRestEp, "/").concat(schemaId, ":");
            context.push(constants_1.VC.CREDENTAIL_BASE_CONTEXT);
            //context.push(VC.CREDENTAIL_SECURITY_SUITE);
            context.push({
                hs: schemaUrl,
            });
            var props = Object.keys(schemaProperties);
            props.forEach(function (x) {
                var obj = {};
                obj[x] = "hs:".concat(x);
                context.push(obj);
            });
            return context;
        };
        this.hsSchema = new schema_1.default();
        this.hsDid = new did_1.default();
        this.credStatusRPC = new credRPC_1.CredentialRPC();
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
    HypersignVerifiableCredential.prototype.sign = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKeyMultibaseConverted, credentialStatus, credentialBytes, signed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privateKeyMultibaseConverted = utils_1.default.convertEd25519verificationkey2020toStableLibKeysInto({
                            privKey: params.privateKeyMultibase,
                        }).privateKeyMultibase;
                        credentialStatus = JSON.parse(params.message);
                        return [4 /*yield*/, credential_1.CredentialStatus.encode(credentialStatus)];
                    case 1:
                        credentialBytes = (_a.sent()).finish();
                        signed = ed25519.sign(privateKeyMultibaseConverted, credentialBytes);
                        return [2 /*return*/, Buffer.from(signed).toString('base64')];
                }
            });
        });
    };
    HypersignVerifiableCredential.prototype.dateNow = function (date) {
        if (date) {
            return new Date(date).toISOString().slice(0, -5) + 'Z';
        }
        else {
            return new Date().toISOString().slice(0, -5) + 'Z';
        }
    };
    HypersignVerifiableCredential.prototype.sha256Hash = function (message) {
        return sha256.update(message).digest('hex');
    };
    HypersignVerifiableCredential.prototype.checkCredentialStatus = function (credentialId) {
        return __awaiter(this, void 0, void 0, function () {
            var credentialStatus, claim, currentStatus, statusReason;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!credentialId) {
                            throw new Error('CredentialId must be passed to check its status');
                        }
                        return [4 /*yield*/, this.credStatusRPC.resolveCredentialStatus(credentialId)];
                    case 1:
                        credentialStatus = _a.sent();
                        if (!credentialStatus) {
                            throw new Error('Error while checking credential status of credentialID ' + credentialId);
                        }
                        claim = credentialStatus.claim;
                        currentStatus = claim.currentStatus, statusReason = claim.statusReason;
                        /// TODO:  probably we should also verify the credential HASH by recalculating the hash of the crdential and
                        // matching with credentialHash property.
                        // const { credentialHash } = credentialStatus;
                        if (currentStatus != constants_1.VC.CRED_STATUS_TYPES.LIVE) {
                            console.log('WARN: Credential status is  not LIVE, currentStatus ' + currentStatus);
                            console.log('WARN: Status reason is ' + statusReason);
                            return [2 /*return*/, { verified: false }];
                        }
                        return [2 /*return*/, { verified: true }];
                }
            });
        });
    };
    // encode a multibase base58-btc multicodec key
    // TEST
    HypersignVerifiableCredential.prototype.getCredential = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaDoc, e_1, issuerDid, subjectDid, issuerDidDoc, subjectDidDoc, vc, schemaInternal, schemaProperties;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schemaDoc = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.hsSchema.resolve({ schemaId: params.schemaId })];
                    case 2:
                        schemaDoc = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        throw new Error('HID-SSI-SDK:: Error: Could not resolve the schema from schemaId = ' + params.schemaId);
                    case 4:
                        issuerDid = params.issuerDid;
                        subjectDid = params.subjectDid;
                        return [4 /*yield*/, this.hsDid.resolve({ did: issuerDid })];
                    case 5:
                        issuerDidDoc = (_a.sent()).didDocument;
                        return [4 /*yield*/, this.hsDid.resolve({ did: subjectDid })];
                    case 6:
                        subjectDidDoc = (_a.sent()).didDocument;
                        if (!issuerDidDoc) {
                            throw new Error('HID-SSI-SDK:: Error: Could not fetch issuer did doc, issuer did = ' + issuerDid);
                        }
                        if (!subjectDidDoc) {
                            throw new Error('HID-SSI-SDK:: Error: Could not fetch subject did doc, subject did = ' + subjectDid);
                        }
                        vc = {};
                        schemaInternal = schemaDoc.schema;
                        schemaProperties = JSON.parse(schemaInternal.properties);
                        // context
                        vc['@context'] = this.getCredentialContext(params.schemaId, schemaProperties);
                        /// TODO:  need to implement this properly
                        vc.id = this.getId();
                        // Type
                        vc.type = [];
                        vc.type.push('VerifiableCredential');
                        vc.type.push(schemaDoc.name);
                        vc.expirationDate = this.dateNow(params.expirationDate);
                        vc.issuanceDate = this.dateNow('12/11/2021'); // TODO: need to remove this.
                        vc.issuer = issuerDid;
                        vc.credentialSubject = {};
                        vc.credentialSubject = __assign({}, this.getCredentialSubject(schemaDoc.schema, params.fields));
                        vc.credentialSubject['id'] = subjectDid;
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
                        return [2 /*return*/, vc];
                }
            });
        });
    };
    HypersignVerifiableCredential.prototype.issueCredential = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var signerDidDoc, publicKeyId, publicKeyVerMethod, convertedKeyPair, keyPair, suite, credentialHash, credentialStatus, proofValue, issuerDID, issuerDidDoc, issuerPublicKeyId, issuerPublicKeyVerMethod, proof, resp, signedVC;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hsDid.resolve({ did: params.issuerDid })];
                    case 1:
                        signerDidDoc = (_a.sent()).didDocument;
                        if (!signerDidDoc)
                            throw new Error('Could not resolve issuerDid = ' + params.issuerDid);
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
                        credentialHash = this.sha256Hash(JSON.stringify(params.credential));
                        credentialStatus = {
                            claim: {
                                id: params.credential.id,
                                currentStatus: constants_1.VC.CRED_STATUS_TYPES.LIVE,
                                statusReason: 'Credential is active',
                            },
                            issuer: params.credential.issuer,
                            issuanceDate: params.credential.issuanceDate,
                            expirationDate: params.credential.expirationDate,
                            credentialHash: credentialHash,
                        };
                        return [4 /*yield*/, this.sign({
                                message: JSON.stringify(credentialStatus),
                                privateKeyMultibase: params.privateKey,
                            })];
                    case 3:
                        proofValue = _a.sent();
                        return [4 /*yield*/, this.hsDid.resolve({ did: params.credential.issuer })];
                    case 4:
                        issuerDID = (_a.sent()).didDocument;
                        issuerDidDoc = issuerDID;
                        issuerPublicKeyId = issuerDidDoc.authentication[0];
                        issuerPublicKeyVerMethod = issuerDidDoc.verificationMethod.find(function (x) { return x.id == issuerPublicKeyId; });
                        proof = {
                            type: constants_1.VC.VERIFICATION_METHOD_TYPE,
                            created: this.dateNow(),
                            updated: this.dateNow(),
                            verificationMethod: issuerPublicKeyVerMethod.id,
                            proofValue: proofValue,
                            proofPurpose: constants_1.VC.PROOF_PURPOSE,
                        };
                        return [4 /*yield*/, this.credStatusRPC.registerCredentialStatus(credentialStatus, proof)];
                    case 5:
                        resp = _a.sent();
                        if (!resp || resp.code != 0) {
                            throw new Error('Error while issuing the credential error = ' + resp.rawLog);
                        }
                        return [4 /*yield*/, vc_js_1.default.issue({
                                credential: params.credential,
                                suite: suite,
                                documentLoader: jsonld_1.documentLoader,
                            })];
                    case 6:
                        signedVC = _a.sent();
                        return [2 /*return*/, signedVC];
                }
            });
        });
    };
    // TODO:  Implement a method to update credential status of a doc.
    //https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L251
    HypersignVerifiableCredential.prototype.verifyCredential = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var issuerDID, issuerDidDoc, publicKeyId, publicKeyVerMethod, publicKeyMultibase, assertionController, keyPair, suite, that, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.credential)
                            throw new Error('Credential can not be undefined');
                        return [4 /*yield*/, this.hsDid.resolve({ did: params.issuerDid })];
                    case 1:
                        issuerDID = (_a.sent()).didDocument;
                        issuerDidDoc = issuerDID;
                        publicKeyId = issuerDidDoc.assertionMethod[0];
                        publicKeyVerMethod = issuerDidDoc.verificationMethod.find(function (x) { return x.id == publicKeyId; });
                        publicKeyMultibase = utils_1.default.convertedStableLibKeysIntoEd25519verificationkey2020({
                            publicKey: publicKeyVerMethod.publicKeyMultibase,
                        }).publicKeyMultibase;
                        publicKeyVerMethod.publicKeyMultibase = publicKeyMultibase;
                        assertionController = {
                            '@context': constants_1.DID.CONTROLLER_CONTEXT,
                            id: issuerDidDoc.id,
                            assertionMethod: issuerDidDoc.assertionMethod,
                        };
                        return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(__assign({ privateKeyMultibase: '' }, publicKeyVerMethod))];
                    case 2:
                        keyPair = _a.sent();
                        suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                            verificationMethod: publicKeyId,
                            key: keyPair,
                        });
                        that = this;
                        return [4 /*yield*/, vc_js_1.default.verifyCredential({
                                credential: params.credential,
                                controller: assertionController,
                                suite: suite,
                                documentLoader: jsonld_1.documentLoader,
                                checkStatus: function (options) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, that.checkCredentialStatus(options.credential.id)];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        });
                                    });
                                },
                            })];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return HypersignVerifiableCredential;
}());
exports.default = HypersignVerifiableCredential;
