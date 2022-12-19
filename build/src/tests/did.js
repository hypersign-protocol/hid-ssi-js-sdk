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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var did_1 = __importDefault(require("../did/did"));
var chai_1 = require("chai");
var hypersignDid = new did_1.default();
var seed = '';
var privateKeyMultibase;
var publicKeyMultibase;
var verificationMethodId;
var didDocument;
var didDocId;
var signedDocument;
var challenge = '1231231231';
var domain = 'www.adbv.com';
describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignDid.generateKeys({ seed: seed })];
                    case 1:
                        result = _a.sent();
                        privateKeyMultibase = result.privateKeyMultibase;
                        publicKeyMultibase = result.publicKeyMultibase;
                        (0, chai_1.expect)(result).to.be.a('object');
                        (0, chai_1.should)().exist(result.privateKeyMultibase);
                        (0, chai_1.should)().exist(result.publicKeyMultibase);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#generate() method to generate did document', function () {
    it('should not able to generate did document and throw error as publickKeyMultibase is not passed or it is empty', function () {
        return hypersignDid.generate({ publicKeyMultibase: '' }).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
        });
    });
    it('should return didDocument', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignDid.generate({ publicKeyMultibase: publicKeyMultibase })];
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
            privateKey: privateKeyMultibase,
            challenge: challenge,
            domain: domain,
            did: didDocId,
            doc: didDocument,
            verificationMethodId: verificationMethodId,
            publicKey: publicKey,
            controller: controller,
        };
        params.privateKey = '';
        return hypersignDid.signDid(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKey is required to sign a did');
        });
    });
    it('should not able to sign did document and throw error as challenge is not passed or it is empty', function () {
        var params = {
            privateKey: privateKeyMultibase,
            challenge: challenge,
            domain: domain,
            did: didDocId,
            doc: didDocument,
            verificationMethodId: verificationMethodId,
            publicKey: publicKey,
            controller: controller,
        };
        params.challenge = '';
        return hypersignDid.signDid(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.challenge is required to sign a did');
        });
    });
    it('should not able to sign did document and throw error as domain is not passed or it is empty', function () {
        var params = {
            privateKey: privateKeyMultibase,
            challenge: challenge,
            domain: domain,
            did: didDocId,
            doc: didDocument,
            verificationMethodId: verificationMethodId,
            publicKey: publicKey,
            controller: controller,
        };
        params.domain = '';
        return hypersignDid.signDid(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.domain is required to sign a did');
        });
    });
    it('should not able to sign did document and throw error as did is not resolved', function () {
        var params = {
            privateKey: privateKeyMultibase,
            challenge: challenge,
            domain: domain,
            did: didDocId,
            doc: didDocument,
            verificationMethodId: verificationMethodId,
            publicKey: publicKey,
            controller: controller,
        };
        return hypersignDid.signDid(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a public did');
        });
    });
    // it('should not able to sign did document and throw error as neither did nor doc is passed', function () {
    //   const params = {
    //     privateKey: privateKeyMultibase as string,
    //     challenge: challenge as string,
    //     domain: domain as string,
    //     did: didDocId as string,
    //     doc: didDocId,
    //     verificationMethodId: verificationMethodId as string,
    //     publicKey,
    //     controller,
    //   };
    //   params.did = '';
    //   return hypersignDid.signDid(params).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did or params.doc is required to sign a did');
    //   });
    // });
    it('should able to sign did document', function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            privateKey: privateKeyMultibase,
                            challenge: challenge,
                            domain: domain,
                            did: '',
                            doc: didDocument,
                            verificationMethodId: verificationMethodId,
                            publicKey: publicKey,
                            controller: controller,
                        };
                        return [4 /*yield*/, hypersignDid.signDid(params)];
                    case 1:
                        signedDocument = _a.sent();
                        (0, chai_1.expect)(signedDocument).to.be.a('object');
                        signedDocument = signedDocument.signedDidDocument;
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
        return hypersignDid
            .verify({ doc: signedDocument, verificationMethodId: '', challenge: challenge, domain: domain })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to verify a did');
        });
    });
    it('should not able to verify did document and throw error as challenge is not passed or it is empty', function () {
        return hypersignDid
            .verify({ doc: signedDocument, verificationMethodId: verificationMethodId, challenge: '', domain: domain })
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
                    case 0: return [4 /*yield*/, hypersignDid.verify({
                            doc: signedDocument,
                            verificationMethodId: verificationMethodId,
                            challenge: challenge,
                            domain: domain,
                        })];
                    case 1:
                        result = _a.sent();
                        (0, chai_1.expect)(result).to.be.a('object');
                        (0, chai_1.should)().exist(result.verificationResult);
                        (0, chai_1.should)().exist(result.verificationResult.verified);
                        (0, chai_1.should)().exist(result.verificationResult.results);
                        (0, chai_1.expect)(result.verificationResult.results).to.be.a('array');
                        (0, chai_1.expect)(result.verificationResult.verified).to.equal(true);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#register() this is to register didDoc on blockchain', function () {
    // it('should not be able to register did document on blockchain as didDocument is null or empty', function () {
    //   return hypersignDid.register({ didDocument: {}, privateKeyMultibase, verificationMethodId }).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.didDocString is required to register a did');
    //   });
    // });
    it('should not be able to register did document on blockchain as privateKeyMultibase is null or empty', function () {
        return hypersignDid
            .register({ didDocument: signedDocument, privateKeyMultibase: '', verificationMethodId: verificationMethodId })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
        });
    });
    it('should not be able to register did document on blockchain as verificationMethodId is null or empty', function () {
        return hypersignDid
            .register({ didDocument: signedDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: '' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
        });
    });
    it("should not be able to register did document on blockchain as  wallet has no balance and  hidClient can't be initialized", function () {
        return hypersignDid
            .register({ didDocument: signedDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, "Cannot read property 'signAndBroadcast' of undefined");
        });
    });
});
describe('#resolve() this is to resolve didDoc', function () {
    it('should not be able to resolve didDocument as did is not passed or it is empty', function () {
        var params = {
            did: '',
        };
        return hypersignDid.resolve(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a did');
        });
    });
    it("should not be able to resolve did document on blockchain as hidClient can't be initialized", function () {
        var params = { did: didDocId };
        return hypersignDid.resolve(params).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'connect ECONNREFUSED 127.0.0.1:80');
        });
    });
});
describe('#update() this is to update didDoc', function () {
    // it('should not be able to update did document as didDocument is null or empty', function () {
    //   return hypersignDid
    //     .update({ didDocument: {}, privateKeyMultibase, verificationMethodId, versionId: '1.0' })
    //     .catch(function (err) {
    //       expect(function () {
    //         throw err;
    //       }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to update a did');
    //     });
    // });
    it('should not be able to update did document as privateKeyMultibase is null or empty', function () {
        return hypersignDid
            .update({ didDocument: didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethodId, versionId: '1.0' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
        });
    });
    it('should not be able to update did document as verificationMethodId is null or empty', function () {
        return hypersignDid
            .update({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
        });
    });
    it('should not be able to update did document as versionId is null or empty', function () {
        return hypersignDid
            .update({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId, versionId: '' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
        });
    });
    it("should not be able to update did document on hidClient can't be initialized", function () {
        return hypersignDid
            .update({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId, versionId: '1.0' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, "Cannot read property 'signAndBroadcast' of undefined");
        });
    });
});
describe('#deactivate() this is to deactivate didDoc', function () {
    // it('should not be able to deactivate did document as didDocument is null or empty', function () {
    //   return hypersignDid
    //     .deactivate({ didDocument: {}, privateKeyMultibase, verificationMethodId, versionId: '1.0' })
    //     .catch(function (err) {
    //       expect(function () {
    //         throw err;
    //       }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did');
    //     });
    // });
    it('should not be able to deactivate did document as privateKeyMultibase is null or empty', function () {
        return hypersignDid
            .deactivate({ didDocument: didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethodId, versionId: '1.0' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
        });
    });
    it('should not be able to deactivate did document as verificationMethodId is null or empty', function () {
        return hypersignDid
            .deactivate({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
        });
    });
    it('should not be able to deactivate did document as versionId is null or empty', function () {
        return hypersignDid
            .deactivate({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId, versionId: '' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
        });
    });
    it("should not be able to deactivate did document on hidClient can't be initialized", function () {
        return hypersignDid
            .deactivate({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId, versionId: '1.0' })
            .catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, "Cannot read property 'signAndBroadcast' of undefined");
        });
    });
});
