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
                        //console.log(kp)
                        privateKeyMultibase = kp.privateKeyMultibase;
                        publicKeyMultibase = kp.publicKeyMultibase;
                        (0, chai_1.expect)(kp).to.be.a('object');
                        (0, chai_1.should)().exist(kp.privateKeyMultibase);
                        (0, chai_1.should)().exist(kp.publicKeyMultibase);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#generate() to generate did', function () {
    it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
        return hypersignDID.generate({ publicKeyMultibase: '' }).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
        });
    });
    it('should be able to generate didDocument', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignDID.generate({ publicKeyMultibase: publicKeyMultibase })];
                    case 1:
                        didDocument = _a.sent();
                        //console.log(didDocument)
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
    it('should be able to generate didDocument with custom id', function () {
        return __awaiter(this, void 0, void 0, function () {
            var methodSpecificId, didDocument, didDocId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        methodSpecificId = 'e157620d69d003e12d935c37b8c21baa78d24898398829b39d943d253c006332';
                        return [4 /*yield*/, hypersignDID.generate({ publicKeyMultibase: publicKeyMultibase, methodSpecificId: methodSpecificId })];
                    case 1:
                        didDocument = _a.sent();
                        didDocId = didDocument['id'];
                        (0, chai_1.expect)(didDocument).to.be.a('object');
                        (0, chai_1.expect)(didDocId).to.be.equal('did:hid:testnet:' + methodSpecificId);
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
    it('should be able to generate didDocument with custom id using HypersignSSISDk instance', function () {
        return __awaiter(this, void 0, void 0, function () {
            var methodSpecificId, params, didDocument, didDocId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        methodSpecificId = 'e157620d69d003e12d935c37b8c21baa78d24898398829b39d943d253c006332';
                        params = {
                            offlineSigner: offlineSigner,
                            nodeRestEndpoint: config_1.hidNodeEp.rest,
                            nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                            namespace: config_1.hidNodeEp.namespace,
                        };
                        hypersignSSISDK = new index_1.HypersignSSISdk(params);
                        return [4 /*yield*/, hypersignSSISDK.init()];
                    case 1:
                        _a.sent();
                        hypersignDID = hypersignSSISDK.did;
                        return [4 /*yield*/, hypersignDID.generate({ publicKeyMultibase: publicKeyMultibase, methodSpecificId: methodSpecificId })];
                    case 2:
                        didDocument = _a.sent();
                        didDocId = didDocument['id'];
                        (0, chai_1.expect)(didDocument).to.be.a('object');
                        (0, chai_1.expect)(didDocId).to.be.equal('did:hid:testnet:' + methodSpecificId);
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
});
describe('#register() this is to register did on the blockchain', function () {
    it('should not able to register did document and throw error as didDocument is not passed or it is empty', function () {
        return hypersignDID.register({ didDocument: {}, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId }).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocString is required to register a did');
        });
    });
    it('should not be able to register did document as privateKeyMultibase is null or empty', function () {
        return hypersignDID.register({ didDocument: didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethodId }).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
        });
    });
    it('should not be able to register did document as verificationMethodId is null or empty', function () {
        return hypersignDID.register({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: '' }).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
        });
    });
    it('should be able to register didDocument in the blockchain', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignDID.register({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId })];
                    case 1:
                        result = _a.sent();
                        //console.log(result)
                        transactionHash = result.transactionHash;
                        (0, chai_1.should)().exist(result.code);
                        (0, chai_1.should)().exist(result.height);
                        (0, chai_1.should)().exist(result.rawLog);
                        (0, chai_1.should)().exist(result.transactionHash);
                        (0, chai_1.should)().exist(result.gasUsed);
                        (0, chai_1.should)().exist(result.gasWanted);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#resolve() this is to resolve didDocument based on didDocId', function () {
    it('should not able to resolve did document and throw error didDocId is not passed', function () {
        return hypersignDID.resolve({ params: { did: '' } }).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a did');
        });
    });
    it('should be able to resolve did', function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            did: didDocId,
                        };
                        return [4 /*yield*/, hypersignDID.resolve(params)];
                    case 1:
                        result = _a.sent();
                        //console.log(result);
                        (0, chai_1.expect)(result).to.be.a('object');
                        (0, chai_1.expect)(result.didDocument.id).to.be.equal(didDocId);
                        (0, chai_1.expect)(result.didDocumentMetadata).to.be.a('object');
                        versionId = result.didDocumentMetadata.versionId;
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#update() this is to update didDocument based on didDocId', function () {
    it('should not be able to update did document as privateKeyMultibase is null or empty', function () {
        return hypersignDID
            .update({ didDocument: didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethodId, versionId: '1.0' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
        });
    });
    it('should not be able to update did document as verificationMethodId is null or empty', function () {
        return hypersignDID
            .update({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
        });
    });
    it('should not be able to update did document as versionId is null or empty', function () {
        return hypersignDID
            .update({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId, versionId: '' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
        });
    });
    it('should not be able to update did document as versionId pased is incorrect', function () {
        var updateBody = { didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId, versionId: '1.0.1' };
        return hypersignDID.update(updateBody).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, "Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: Expected ".concat(didDocId, " with version ").concat(versionId, ". Got version ").concat(updateBody.versionId, ": Unexpected DID version"));
        });
    });
    it('should be able to update did document', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignDID.update({
                            didDocument: didDocument,
                            privateKeyMultibase: privateKeyMultibase,
                            verificationMethodId: verificationMethodId,
                            versionId: versionId,
                        })];
                    case 1:
                        result = _a.sent();
                        //console.log(result);
                        (0, chai_1.should)().exist(result.code);
                        (0, chai_1.should)().exist(result.height);
                        (0, chai_1.should)().exist(result.rawLog);
                        (0, chai_1.should)().exist(result.transactionHash);
                        (0, chai_1.should)().exist(result.gasUsed);
                        (0, chai_1.should)().exist(result.gasWanted);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#resolve() did after updating did document', function () {
    it('should be able to resolve did', function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            did: didDocId,
                        };
                        return [4 /*yield*/, hypersignDID.resolve(params)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).to.be.a('object');
                        (0, chai_1.expect)(result.didDocument.id).to.be.equal(didDocId);
                        (0, chai_1.expect)(result.didDocumentMetadata).to.be.a('object');
                        (0, chai_1.expect)(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.not.equal(publicKeyMultibase);
                        versionId = result.didDocumentMetadata.versionId;
                        return [2 /*return*/];
                }
            });
        });
    });
    // should we able to get same publicKeyMultibase as generated in the begining in didDoc
    it('should be able to resolve did if params.ed25519verificationkey2020 is passed', function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            did: didDocId,
                            ed25519verificationkey2020: true,
                        };
                        return [4 /*yield*/, hypersignDID.resolve(params)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).to.be.a('object');
                        (0, chai_1.expect)(result.didDocument.id).to.be.equal(didDocId);
                        (0, chai_1.expect)(result.didDocumentMetadata).to.be.a('object');
                        (0, chai_1.expect)(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.equal(publicKeyMultibase);
                        versionId = result.didDocumentMetadata.versionId;
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should be able to resolve DID even without offline signer passed to the constructor; making resolve RPC offchain activity', function () {
        return __awaiter(this, void 0, void 0, function () {
            var hypersignDID, params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hypersignDID = new index_1.HypersignDID();
                        params = {
                            did: didDocId,
                            ed25519verificationkey2020: true,
                        };
                        return [4 /*yield*/, hypersignDID.resolve(params)];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).to.be.a('object');
                        (0, chai_1.expect)(result.didDocument.id).to.be.equal(didDocId);
                        (0, chai_1.expect)(result.didDocumentMetadata).to.be.a('object');
                        (0, chai_1.expect)(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.equal(publicKeyMultibase);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#deactivate() this is to deactivate didDocument based on didDocId', function () {
    it('should not be able to deactivate did document as privateKeyMultibase is null or empty', function () {
        return hypersignDID
            .deactivate({ didDocument: didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethodId, versionId: '1.0' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
        });
    });
    it('should not be able to deactivate did document as verificationMethodId is null or empty', function () {
        return hypersignDID
            .deactivate({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
        });
    });
    it('should not be able to deactivate did document as versionId is null or empty', function () {
        return hypersignDID
            .deactivate({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId, versionId: '' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
        });
    });
    it('should not be able to deactivate did document as versionId pased is incorrect', function () {
        var deactivateBody = { didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId, versionId: '1.0.1' };
        return hypersignDID.deactivate(deactivateBody).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, "Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: Expected ".concat(didDocId, " with version ").concat(versionId, ". Got version ").concat(deactivateBody.versionId, ": Unexpected DID version"));
        });
    });
    it('should be able to deactivate did document', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignDID.deactivate({
                            didDocument: didDocument,
                            privateKeyMultibase: privateKeyMultibase,
                            verificationMethodId: verificationMethodId,
                            versionId: versionId,
                        })];
                    case 1:
                        result = _a.sent();
                        //console.log(JSON.stringify(result));
                        (0, chai_1.should)().exist(result.code);
                        (0, chai_1.should)().exist(result.height);
                        (0, chai_1.should)().exist(result.rawLog);
                        (0, chai_1.should)().exist(result.transactionHash);
                        (0, chai_1.should)().exist(result.gasUsed);
                        (0, chai_1.should)().exist(result.gasWanted);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#sign() this is to sign didDoc', function () {
    var publicKey = {
        '@context': '',
        id: '',
        type: '',
        publicKeyBase58: '',
    };
    var controller = {
        '@context': '',
        id: '',
        authentication: [],
    };
    it('should not able to sign did document and throw error as privateKey is not passed or it is empty', function () {
        var params = {
            privateKeyMultibase: privateKeyMultibase,
            challenge: challenge,
            domain: domain,
            did: didDocId,
            didDocument: didDocument,
            verificationMethodId: verificationMethodId,
            publicKey: publicKey,
            controller: controller,
        };
        params.privateKeyMultibase = '';
        return hypersignDID.sign(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKey is required to sign a did');
        });
    });
    it('should not able to sign did document and throw error as challenge is not passed or it is empty', function () {
        var params = {
            privateKeyMultibase: privateKeyMultibase,
            challenge: challenge,
            domain: domain,
            did: didDocId,
            didDocument: didDocument,
            verificationMethodId: verificationMethodId,
            publicKey: publicKey,
            controller: controller,
        };
        params.challenge = '';
        return hypersignDID.sign(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.challenge is required to sign a did');
        });
    });
    it('should not able to sign did document and throw error as domain is not passed or it is empty', function () {
        var params = {
            privateKeyMultibase: privateKeyMultibase,
            challenge: challenge,
            domain: domain,
            did: didDocId,
            didDocument: didDocument,
            verificationMethodId: verificationMethodId,
            publicKey: publicKey,
            controller: controller,
        };
        params.domain = '';
        return hypersignDID.sign(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.domain is required to sign a did');
        });
    });
    it('should not able to sign did document and throw error as did is not resolved', function () {
        var params = {
            privateKeyMultibase: privateKeyMultibase,
            challenge: challenge,
            domain: domain,
            did: didDocId,
            didDocument: didDocument,
            verificationMethodId: verificationMethodId,
            publicKey: publicKey,
            controller: controller,
        };
        return hypersignDID.sign(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, "HID-SSI-SDK:: Error: could not resolve did ".concat(params.did));
        });
    });
    it('should not able to sign did document and throw error as verificationMethodId is invalid or wrong', function () {
        var params = {
            privateKeyMultibase: privateKeyMultibase,
            challenge: challenge,
            domain: domain,
            did: '',
            didDocument: didDocument,
            verificationMethodId: verificationMethodId,
            publicKey: publicKey,
            controller: controller,
        };
        params.verificationMethodId = '';
        return hypersignDID.sign(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: Incorrect verification method id');
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
                            controller: controller,
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
});
describe('#verify() method to verify did document', function () {
    it('should not able to verify did document and throw error as verificationMethodId is not passed or it is empty', function () {
        return hypersignDID
            .verify({ didDocument: signedDocument, verificationMethodId: '', challenge: challenge, domain: domain })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to verify a did');
        });
    });
    it('should not able to verify did document and throw error as challenge is not passed or it is empty', function () {
        return hypersignDID
            .verify({ didDocument: signedDocument, verificationMethodId: verificationMethodId, challenge: '', domain: domain })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.challenge is required to verify a did');
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
    it('should not able to verify did document and throw error as unknown verification method id is passed', function () {
        var verMethIdMod = verificationMethodId + 'somerandomtext';
        return hypersignDID
            .verify({ didDocument: signedDocument, verificationMethodId: verMethIdMod, challenge: challenge, domain: domain })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: could not find verification method for verificationMethodId: ' +
                verMethIdMod +
                ' in did document');
        });
    });
    it('should not able to verify did document and throw error as proof is not present in the signedDID doc', function () {
        var signedDIDDoc = signedDocument;
        delete signedDIDDoc['proof'];
        return hypersignDID
            .verify({ didDocument: signedDIDDoc, verificationMethodId: verificationMethodId, challenge: challenge, domain: domain })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument.proof is not present in the signed did document');
        });
    });
});
