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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("../index");
var config_1 = require("./config");
var privateKeyMultibase;
var publicKeyMultibase;
var verificationMethodId;
var didDocument;
var didDocId;
var offlineSigner;
var versionId;
var hypersignDID;
var transactionHash;
var signedDocument;
var challenge = '1231231231';
var domain = 'www.adbv.com';
var hypersignSSISDK;
//add mnemonic of wallet that have balance
beforeEach(function () {
    return __awaiter(this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, config_1.createWallet)(config_1.mnemonic)];
                case 1:
                    offlineSigner = _a.sent();
                    params = {
                        offlineSigner: offlineSigner,
                        nodeRestEndpoint: config_1.hidNodeEp.rest,
                        nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                        namespace: config_1.hidNodeEp.namespace,
                    };
                    hypersignDID = new index_1.HypersignDID(params);
                    return [4 /*yield*/, hypersignDID.init()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
describe('DID Test scenarios', function () {
    //remove seed while creating did so that wallet can generate different did every time
    describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
        it('should return publickeyMultibase and privateKeyMultibase', function () {
            return __awaiter(this, void 0, void 0, function () {
                var kp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, hypersignDID.generateKeys()];
                        case 1:
                            kp = _a.sent();
                            privateKeyMultibase = kp.privateKeyMultibase;
                            publicKeyMultibase = kp.publicKeyMultibase;
                            (0, chai_1.expect)(kp).to.be.a('object');
                            (0, chai_1.should)().exist(kp.privateKeyMultibase);
                            (0, chai_1.should)().exist(kp.publicKeyMultibase);
                            (0, chai_1.should)().not.exist(kp.id);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should be able to generate didDocument', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, hypersignDID.generate({ publicKeyMultibase: publicKeyMultibase })];
                        case 1:
                            didDocument = _a.sent();
                            didDocId = didDocument['id'];
                            verificationMethodId = didDocument['verificationMethod'][0].id;
                            (0, chai_1.expect)(didDocument).to.be.a('object');
                            (0, chai_1.should)().exist(didDocument['@context']);
                            (0, chai_1.should)().exist(didDocument['id']);
                            (0, chai_1.should)().exist(didDocument['controller']);
                            (0, chai_1.should)().exist(didDocument['alsoKnownAs']);
                            (0, chai_1.should)().exist(didDocument['verificationMethod']);
                            (0, chai_1.expect)(didDocument['verificationMethod'] &&
                                didDocument['authentication'] &&
                                didDocument['assertionMethod'] &&
                                didDocument['keyAgreement'] &&
                                didDocument['capabilityInvocation'] &&
                                didDocument['capabilityDelegation'] &&
                                didDocument['service']).to.be.a('array');
                            (0, chai_1.should)().exist(didDocument['authentication']);
                            (0, chai_1.should)().exist(didDocument['assertionMethod']);
                            (0, chai_1.should)().exist(didDocument['keyAgreement']);
                            (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
                            (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
                            (0, chai_1.should)().exist(didDocument['service']);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should able to sign did document', function () {
            return __awaiter(this, void 0, void 0, function () {
                var params;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {
                                privateKeyMultibase: privateKeyMultibase,
                                challenge: challenge,
                                domain: domain,
                                did: '',
                                didDocument: didDocument,
                                verificationMethodId: verificationMethodId,
                            };
                            return [4 /*yield*/, hypersignDID.sign(params)];
                        case 1:
                            signedDocument = _a.sent();
                            //console.log(JSON.stringify(signedDocument))
                            (0, chai_1.expect)(signedDocument).to.be.a('object');
                            (0, chai_1.should)().exist(signedDocument['@context']);
                            (0, chai_1.should)().exist(signedDocument['id']);
                            (0, chai_1.expect)(didDocId).to.be.equal(signedDocument['id']);
                            (0, chai_1.should)().exist(signedDocument['controller']);
                            (0, chai_1.should)().exist(signedDocument['alsoKnownAs']);
                            (0, chai_1.should)().exist(signedDocument['verificationMethod']);
                            (0, chai_1.should)().exist(signedDocument['authentication']);
                            (0, chai_1.should)().exist(signedDocument['assertionMethod']);
                            (0, chai_1.should)().exist(signedDocument['keyAgreement']);
                            (0, chai_1.should)().exist(signedDocument['capabilityInvocation']);
                            (0, chai_1.should)().exist(signedDocument['capabilityDelegation']);
                            (0, chai_1.should)().exist(signedDocument['service']);
                            (0, chai_1.should)().exist(signedDocument['proof']);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should return verification result', function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, hypersignDID.verify({
                                didDocument: signedDocument,
                                verificationMethodId: verificationMethodId,
                                challenge: challenge,
                                domain: domain,
                            })];
                        case 1:
                            result = _a.sent();
                            console.log(JSON.stringify(result, null, 2));
                            (0, chai_1.expect)(result).to.be.a('object');
                            (0, chai_1.should)().exist(result);
                            (0, chai_1.should)().exist(result.verified);
                            (0, chai_1.should)().exist(result.results);
                            (0, chai_1.expect)(result.results).to.be.a('array');
                            (0, chai_1.expect)(result.verified).to.equal(true);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
