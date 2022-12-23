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
var chai_1 = require("chai");
var index_1 = __importDefault(require("../index"));
var config_1 = require("./config");
var privateKeyMultibase;
var publicKeyMultibase;
var didDocId;
var schemaId;
var signedDocument;
var verificationMethodId;
var didDocument;
var schemaObject;
var schemaSignature;
var challenge = '1231231231';
var domain = 'www.adbv.com';
var offlineSigner;
var hsSdk;
var credentialId;
var credentialDetail;
var verifiablePresentation;
var signedPresentation;
var verifiableCredentialPresentationId;
var credentialStatusId;
var credentialBody = {
    schemaId: '',
    subjectDid: '',
    type: [],
    issuerDid: '',
    fields: { name: 'Varsha' },
};
var schemaBody = {
    name: 'testSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [{ name: 'name', type: 'string', isRequired: false }],
    additionalProperties: false,
};
var issueCredentialBody = {
    credential: credentialDetail,
    issuerDid: didDocId,
    verificationMethodId: verificationMethodId,
    privateKey: privateKeyMultibase,
};
beforeEach(function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, config_1.createWallet)(config_1.mnemonic)];
                case 1:
                    offlineSigner = _a.sent();
                    hsSdk = new index_1.default(offlineSigner, config_1.hidNodeEp.rpc, config_1.hidNodeEp.rest, config_1.hidNodeEp.namespace);
                    return [4 /*yield*/, hsSdk.init()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
// Generate public and private key pair
describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', function () {
        return __awaiter(this, void 0, void 0, function () {
            var kp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hsSdk.did.generateKeys()];
                    case 1:
                        kp = _a.sent();
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
//Generate did
describe('#generate() to generate did', function () {
    it('should be able to generate didDocument', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hsSdk.did.generate({ publicKeyMultibase: publicKeyMultibase })];
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
                        return [4 /*yield*/, hsSdk.did.signDid(params)];
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
describe('#register() this is to register did on the blockchain', function () {
    it('should be able to register didDocument in the blockchain', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hsSdk.did.register({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId })];
                    case 1:
                        result = _a.sent();
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
// Generate schema
describe('#getSchema() method to create schema', function () {
    it('should able to create a new schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schemaBody.author = didDocId;
                        return [4 /*yield*/, hsSdk.schema.getSchema(schemaBody)];
                    case 1:
                        schemaObject = _a.sent();
                        schemaId = schemaObject['id'];
                        (0, chai_1.expect)(schemaObject).to.be.a('object');
                        (0, chai_1.should)().exist(schemaObject['type']);
                        (0, chai_1.should)().exist(schemaObject['modelVersion']);
                        (0, chai_1.should)().exist(schemaObject['id']);
                        (0, chai_1.should)().exist(schemaObject['name']);
                        (0, chai_1.should)().exist(schemaObject['author']);
                        (0, chai_1.should)().exist(schemaObject['authored']);
                        (0, chai_1.should)().exist(schemaObject['schema']);
                        (0, chai_1.expect)(schemaObject.schema).to.be.a('object');
                        (0, chai_1.expect)(schemaObject['name']).to.be.equal(schemaBody.name);
                        (0, chai_1.expect)(schemaObject['author']).to.be.equal(schemaBody.author);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#sign() function to sign schema', function () {
    it('should be able to sign newly created schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var signedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hsSdk.schema.signSchema({ privateKey: privateKeyMultibase, schema: schemaObject })];
                    case 1:
                        signedSchema = _a.sent();
                        schemaSignature = signedSchema;
                        (0, chai_1.expect)(signedSchema).to.be.a('string');
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#registerSchema() function to register schema on blockchain', function () {
    it('should be able to register schema on blockchain', function () {
        return __awaiter(this, void 0, void 0, function () {
            var proof, schema, params, registeredSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proof = {};
                        proof['type'] = 'Ed25519Signature2020';
                        proof['created'] = schemaObject.authored;
                        proof['verificationMethod'] = didDocument['assertionMethod'][0];
                        proof['proofValue'] = schemaSignature;
                        proof['proofPurpose'] = 'assertion';
                        schema = schemaObject;
                        params = { schema: schema, proof: proof };
                        return [4 /*yield*/, hsSdk.schema.registerSchema(params)];
                    case 1:
                        registeredSchema = _a.sent();
                        (0, chai_1.expect)(registeredSchema).to.be.a('object');
                        (0, chai_1.should)().exist(registeredSchema.code);
                        (0, chai_1.should)().exist(registeredSchema.height);
                        (0, chai_1.should)().exist(registeredSchema.rawLog);
                        (0, chai_1.should)().exist(registeredSchema.transactionHash);
                        (0, chai_1.should)().exist(registeredSchema.gasUsed);
                        (0, chai_1.should)().exist(registeredSchema.gasWanted);
                        (0, chai_1.expect)(registeredSchema.rawLog).to.be.a('string');
                        return [2 /*return*/];
                }
            });
        });
    });
});
//  Test case related to credential
describe('#getCredential() method to generate a credential', function () {
    it('should not be able to generate new credential for a schema as both subjectDid and subjectDidDocSigned is passed', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempCredentialBody;
            return __generator(this, function (_a) {
                tempCredentialBody = __assign({}, credentialBody);
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.subjectDid = didDocId;
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                return [2 /*return*/, hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: Both subjectDid and subjectDidDoc cannot be passed');
                    })];
            });
        });
    });
    it('should not be able to generate new credential for a schema as not able to resolve subjectDid or subjectDidDoc as  neither subjectDid nor subjectDidDocSigned is passed', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempCredentialBody;
            return __generator(this, function (_a) {
                tempCredentialBody = __assign({}, credentialBody);
                tempCredentialBody.issuerDid = didDocId;
                return [2 /*return*/, hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: Could not resolve the subjectDid or subjectDidDoc');
                    })];
            });
        });
    });
    it('should not be able to generate new credential for a schema as nether schemaId nor schema Context is passed', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempCredentialBody;
            return __generator(this, function (_a) {
                tempCredentialBody = __assign({}, credentialBody);
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                return [2 /*return*/, hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'schemaId is required when schemaContext and type not passed');
                    })];
            });
        });
    });
    it('should not be able to generate new credential for a schema as wrong issuer did is passed', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempCredentialBody;
            return __generator(this, function (_a) {
                tempCredentialBody = __assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.issuerDid = didDocId + 'xyz';
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                return [2 /*return*/, hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, "HID-SSI-SDK:: Error: Could not fetch issuer did doc, issuer did = ".concat(tempCredentialBody.issuerDid));
                    })];
            });
        });
    });
    it('should not be able to generate new credential for a schema as not able to get subject did doc based on subjectDid passed', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempCredentialBody;
            return __generator(this, function (_a) {
                tempCredentialBody = __assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody['subjectDid'] = didDocId;
                return [2 /*return*/, hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, "HID-SSI-SDK:: Error: Could not fetch subject did doc, subject did ".concat(tempCredentialBody.subjectDid));
                    })];
            });
        });
    });
    it('should not be able to generate new credential for a schema as expiration date is passed in wrong format', function () {
        return __awaiter(this, void 0, void 0, function () {
            var todaysDate, tempExpirationDate, expirationDate, tempCredentialBody;
            return __generator(this, function (_a) {
                todaysDate = new Date();
                tempExpirationDate = todaysDate.setDate(todaysDate.getDate() + 2);
                expirationDate = tempExpirationDate.toString();
                tempCredentialBody = __assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                tempCredentialBody['expirationDate'] = expirationDate;
                tempCredentialBody.issuerDid = didDocId;
                return [2 /*return*/, hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'Invalid time value');
                    })];
            });
        });
    });
    it('should not be able to generate new credential for a schema as additional properties in schema is set to false but sending additional properties in field value at the time of generating credential', function () {
        return __awaiter(this, void 0, void 0, function () {
            var expirationDate, tempCredentialBody;
            return __generator(this, function (_a) {
                expirationDate = new Date('12/11/2027');
                tempCredentialBody = __assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                tempCredentialBody['expirationDate'] = expirationDate;
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields['type'] = 'string';
                tempCredentialBody.fields['value'] = 'Varsha';
                tempCredentialBody.fields['name'] = 'name';
                return [2 /*return*/, hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, "Only [\"".concat(schemaBody.fields[0].name, "\"] attributes are possible. additionalProperties is false in the schema"));
                    })];
            });
        });
    });
    it('should be able to generate new credential for a schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var expirationDate, tempCredentialBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expirationDate = new Date('12/11/2027');
                        tempCredentialBody = __assign({}, credentialBody);
                        tempCredentialBody.schemaId = schemaId;
                        tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                        tempCredentialBody['expirationDate'] = expirationDate;
                        tempCredentialBody.issuerDid = didDocId;
                        tempCredentialBody.fields = { name: 'varsha' };
                        return [4 /*yield*/, hsSdk.vc.getCredential(tempCredentialBody)];
                    case 1:
                        credentialDetail = _a.sent();
                        (0, chai_1.expect)(credentialDetail).to.be.a('object');
                        (0, chai_1.should)().exist(credentialDetail['@context']);
                        (0, chai_1.should)().exist(credentialDetail['id']);
                        credentialId = credentialDetail.id;
                        (0, chai_1.should)().exist(credentialDetail['type']);
                        (0, chai_1.should)().exist(credentialDetail['expirationDate']);
                        (0, chai_1.should)().exist(credentialDetail['issuanceDate']);
                        (0, chai_1.should)().exist(credentialDetail['issuer']);
                        (0, chai_1.should)().exist(credentialDetail['credentialSubject']);
                        (0, chai_1.should)().exist(credentialDetail['credentialSchema']);
                        (0, chai_1.should)().exist(credentialDetail['credentialStatus']);
                        (0, chai_1.expect)(credentialDetail['credentialStatus'].type).to.be.equal('CredentialStatusList2017');
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#issueCredential() method for issuing credential', function () {
    it('should not be able to issueCredential as verificationMethodId is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempIssueCredentialBody;
            return __generator(this, function (_a) {
                tempIssueCredentialBody = __assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = '';
                tempIssueCredentialBody.privateKey = privateKeyMultibase;
                return [2 /*return*/, hsSdk.vc.issueCredential(tempIssueCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to issue credential');
                    })];
            });
        });
    });
    it('should not be able to issueCredential as credentialObject is null or undefined', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempIssueCredentialBody;
            return __generator(this, function (_a) {
                tempIssueCredentialBody = __assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = undefined;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKey = privateKeyMultibase;
                return [2 /*return*/, hsSdk.vc.issueCredential(tempIssueCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credential is required to issue credential');
                    })];
            });
        });
    });
    it('should not be able to issueCredential as privateKey is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempIssueCredentialBody;
            return __generator(this, function (_a) {
                tempIssueCredentialBody = __assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKey = '';
                return [2 /*return*/, hsSdk.vc.issueCredential(tempIssueCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKey is required to issue credential');
                    })];
            });
        });
    });
    it('should not be able to issueCredential as issuerDid is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempIssueCredentialBody;
            return __generator(this, function (_a) {
                tempIssueCredentialBody = __assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = '';
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKey = publicKeyMultibase;
                return [2 /*return*/, hsSdk.vc.issueCredential(tempIssueCredentialBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to issue credential');
                    })];
            });
        });
    });
    it('should be able to issue credential to particular user', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempIssueCredentialBody, issuedCredResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempIssueCredentialBody = __assign({}, issueCredentialBody);
                        tempIssueCredentialBody.credential = credentialDetail;
                        tempIssueCredentialBody.issuerDid = didDocId;
                        tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                        tempIssueCredentialBody.privateKey = privateKeyMultibase;
                        return [4 /*yield*/, hsSdk.vc.issueCredential(tempIssueCredentialBody)];
                    case 1:
                        issuedCredResult = _a.sent();
                        credentialStatusId = issuedCredResult['credentialStatus'].id;
                        (0, chai_1.expect)(issuedCredResult).to.be.a('object');
                        (0, chai_1.should)().exist(issuedCredResult['@context']);
                        (0, chai_1.should)().exist(issuedCredResult['id']);
                        (0, chai_1.should)().exist(issuedCredResult['type']);
                        (0, chai_1.should)().exist(issuedCredResult['expirationDate']);
                        (0, chai_1.should)().exist(issuedCredResult['issuanceDate']);
                        (0, chai_1.should)().exist(issuedCredResult['issuer']);
                        (0, chai_1.should)().exist(issuedCredResult['credentialSubject']);
                        (0, chai_1.should)().exist(issuedCredResult['credentialSchema']);
                        (0, chai_1.should)().exist(issuedCredResult['credentialStatus']);
                        (0, chai_1.should)().exist(issuedCredResult['proof']);
                        (0, chai_1.expect)(issuedCredResult['id']).to.be.equal(credentialId);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#verifyCredential() method to verify a credential', function () {
    it('should not be able to verify credential as verificationMethodId is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    credential: credentialDetail,
                    issuerDid: didDocId,
                    verificationMethodId: verificationMethodId,
                };
                params.verificationMethodId = '';
                return [2 /*return*/, hsSdk.vc.verifyCredential(params).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to verify credential');
                    })];
            });
        });
    });
    it('should not be able to verify credential as credential is null or undefined', function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    credential: credentialDetail,
                    issuerDid: didDocId,
                    verificationMethodId: verificationMethodId,
                };
                params.credential = undefined;
                return [2 /*return*/, hsSdk.vc.verifyCredential(params).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Credential is required to verify credential');
                    })];
            });
        });
    });
    it('should not be able to verify credential as credential is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    credential: credentialDetail,
                    issuerDid: didDocId,
                    verificationMethodId: verificationMethodId,
                };
                params.issuerDid = '';
                return [2 /*return*/, hsSdk.vc.verifyCredential(params).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to verify credential');
                    })];
            });
        });
    });
    it('should be able to verify credential', function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, verificationResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            credential: credentialDetail,
                            issuerDid: didDocId,
                            verificationMethodId: verificationMethodId,
                        };
                        return [4 /*yield*/, hsSdk.vc.verifyCredential(params)];
                    case 1:
                        verificationResult = _a.sent();
                        (0, chai_1.expect)(verificationResult).to.be.a('object');
                        (0, chai_1.should)().exist(verificationResult.verified);
                        (0, chai_1.expect)(verificationResult.verified).to.be.equal(true);
                        (0, chai_1.should)().exist(verificationResult.results);
                        (0, chai_1.expect)(verificationResult.results).to.be.a('array');
                        (0, chai_1.should)().exist(verificationResult.statusResult);
                        (0, chai_1.expect)(verificationResult.statusResult.verified).to.be.equal(true);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#checkCredentialStatus() method to check status of the credential', function () {
    it('should not be able to check credential as credentialId is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, hsSdk.vc.checkCredentialStatus().catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'CredentialId must be passed to check its status');
                    })];
            });
        });
    });
    it('should not be able to check credential as credentialId is invalid', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, hsSdk.vc.checkCredentialStatus({ credentialId: credentialId + 'x' }).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'No credential status found. Probably invalid credentialId');
                    })];
            });
        });
    });
    it('should be able to check credential status', function () {
        return __awaiter(this, void 0, void 0, function () {
            var credentialStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hsSdk.vc.checkCredentialStatus(credentialId)];
                    case 1:
                        credentialStatus = _a.sent();
                        (0, chai_1.expect)(credentialStatus).to.be.a('object');
                        (0, chai_1.should)().exist(credentialStatus.verified);
                        (0, chai_1.expect)(credentialStatus.verified).to.be.equal(true);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#updateCredentialStatus this method is to change credential status to revoked or suspended', function () {
    it('should be able to change credential status to suspended', function () {
        return __awaiter(this, void 0, void 0, function () {
            var credentialStatus, params, updatedCredResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hsSdk.vc.resolveCredentialStatus({ credentialId: credentialId })];
                    case 1:
                        credentialStatus = _a.sent();
                        params = {
                            credStatus: credentialStatus,
                            issuerDid: didDocId,
                            verificationMethodId: verificationMethodId,
                            privateKey: privateKeyMultibase,
                            status: 'SUSPENDED',
                            statusReason: 'Suspending this credential for some time',
                        };
                        return [4 /*yield*/, hsSdk.vc.updateCredentialStatus(params)];
                    case 2:
                        updatedCredResult = _a.sent();
                        (0, chai_1.expect)(updatedCredResult).to.be.a('object');
                        (0, chai_1.expect)(updatedCredResult.code).to.be.equal(0);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should be able to change credential status to Live', function () {
        return __awaiter(this, void 0, void 0, function () {
            var credentialStatus, params, updatedCredResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hsSdk.vc.resolveCredentialStatus({ credentialId: credentialId })];
                    case 1:
                        credentialStatus = _a.sent();
                        params = {
                            credStatus: credentialStatus,
                            issuerDid: didDocId,
                            verificationMethodId: verificationMethodId,
                            privateKey: privateKeyMultibase,
                            status: 'LIVE',
                            statusReason: 'Setting the status to LIVE',
                        };
                        return [4 /*yield*/, hsSdk.vc.updateCredentialStatus(params)];
                    case 2:
                        updatedCredResult = _a.sent();
                        (0, chai_1.expect)(updatedCredResult).to.be.a('object');
                        (0, chai_1.expect)(updatedCredResult.code).to.be.equal(0);
                        return [2 /*return*/];
                }
            });
        });
    });
});
//Test case for verifying presentation
describe('#getPresentation() method to generate presentation', function () {
    var presentationBody = {
        verifiableCredentials: [credentialDetail],
        holderDid: didDocId,
    };
    it('should be able to generate presentation', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempPresentationBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempPresentationBody = __assign({}, presentationBody);
                        tempPresentationBody.verifiableCredentials[0] = credentialDetail;
                        tempPresentationBody.holderDid = didDocId;
                        return [4 /*yield*/, hsSdk.vp.getPresentation(tempPresentationBody)];
                    case 1:
                        verifiablePresentation = _a.sent();
                        (0, chai_1.should)().exist(verifiablePresentation['@context']);
                        (0, chai_1.should)().exist(verifiablePresentation['type']);
                        (0, chai_1.expect)(verifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
                        (0, chai_1.should)().exist(verifiablePresentation['verifiableCredential']);
                        (0, chai_1.expect)(verifiablePresentation.verifiableCredential).to.be.a('array');
                        (0, chai_1.should)().exist(verifiablePresentation['id']);
                        (0, chai_1.should)().exist(verifiablePresentation['holder']);
                        verifiableCredentialPresentationId = verifiablePresentation.id;
                        (0, chai_1.expect)(verifiablePresentation['verifiableCredential'][0].id).to.be.equal(credentialId);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#signPresentation() method to sign presentation', function () {
    var signPresentationBody = {
        presentation: verifiablePresentation,
        holderDid: didDocId,
        verificationMethodId: verificationMethodId,
        privateKey: privateKeyMultibase,
        challenge: challenge,
    };
    it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempSignPresentationBody;
            return __generator(this, function (_a) {
                tempSignPresentationBody = __assign({}, signPresentationBody);
                tempSignPresentationBody.presentation = verifiablePresentation;
                tempSignPresentationBody.holderDid = didDocId;
                tempSignPresentationBody.verificationMethodId = verificationMethodId;
                tempSignPresentationBody.privateKey = privateKeyMultibase;
                tempSignPresentationBody['holderDidDocSigned'] = signedDocument;
                return [2 /*return*/, hsSdk.vp.signPresentation(tempSignPresentationBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
                    })];
            });
        });
    });
    it('should not be able to sign presentation as privateKey in null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempSignPresentationBody;
            return __generator(this, function (_a) {
                tempSignPresentationBody = __assign({}, signPresentationBody);
                tempSignPresentationBody.privateKey = '';
                return [2 /*return*/, hsSdk.vp.signPresentation(tempSignPresentationBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: params.privateKey is required for signinng a presentation');
                    })];
            });
        });
    });
    it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempSignPresentationBody;
            return __generator(this, function (_a) {
                tempSignPresentationBody = __assign({}, signPresentationBody);
                tempSignPresentationBody.privateKey = privateKeyMultibase;
                tempSignPresentationBody.presentation = undefined;
                return [2 /*return*/, hsSdk.vp.signPresentation(tempSignPresentationBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: params.presentation is required for signinng a presentation');
                    })];
            });
        });
    });
    it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempSignPresentationBody;
            return __generator(this, function (_a) {
                tempSignPresentationBody = __assign({}, signPresentationBody);
                tempSignPresentationBody.privateKey = privateKeyMultibase;
                tempSignPresentationBody.presentation = verifiablePresentation;
                tempSignPresentationBody.challenge = '';
                return [2 /*return*/, hsSdk.vp.signPresentation(tempSignPresentationBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for signinng a presentation');
                    })];
            });
        });
    });
    it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempSignPresentationBody;
            return __generator(this, function (_a) {
                tempSignPresentationBody = __assign({}, signPresentationBody);
                tempSignPresentationBody.privateKey = privateKeyMultibase;
                tempSignPresentationBody.presentation = verifiablePresentation;
                tempSignPresentationBody.challenge = challenge;
                tempSignPresentationBody.verificationMethodId = '';
                return [2 /*return*/, hsSdk.vp.signPresentation(tempSignPresentationBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: params.verificationMethodId is required for signinng a presentation');
                    })];
            });
        });
    });
    it('should be able to sign presentation', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempSignPresentationBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempSignPresentationBody = __assign({}, signPresentationBody);
                        tempSignPresentationBody.presentation = verifiablePresentation;
                        tempSignPresentationBody.holderDid = didDocId;
                        tempSignPresentationBody.verificationMethodId = verificationMethodId;
                        tempSignPresentationBody.privateKey = privateKeyMultibase;
                        return [4 /*yield*/, hsSdk.vp.signPresentation(tempSignPresentationBody)];
                    case 1:
                        signedPresentation = _a.sent();
                        (0, chai_1.should)().exist(signedPresentation['@context']);
                        (0, chai_1.should)().exist(signedPresentation['type']);
                        (0, chai_1.expect)(signedPresentation.type[0]).to.be.equal('VerifiablePresentation');
                        (0, chai_1.should)().exist(signedPresentation['verifiableCredential']);
                        (0, chai_1.expect)(signedPresentation.id).to.be.equal(verifiableCredentialPresentationId);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#verifyPresentation() method to verify presentation', function () {
    var verifyPresentationBody = {
        signedPresentation: signedPresentation,
        holderDid: didDocId,
        holderVerificationMethodId: verificationMethodId,
        issuerVerificationMethodId: verificationMethodId,
        privateKey: privateKeyMultibase,
        challenge: challenge,
        issuerDid: didDocId,
    };
    it('should not be able to verify presentation as either holderDid or holderDidDocSigned is required but passed both', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempverifyPresentationBody;
            return __generator(this, function (_a) {
                tempverifyPresentationBody = __assign({}, verifyPresentationBody);
                tempverifyPresentationBody.signedPresentation = signedPresentation;
                tempverifyPresentationBody.holderDid = didDocId;
                tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
                tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
                tempverifyPresentationBody.privateKey = privateKeyMultibase;
                tempverifyPresentationBody['holderDidDocSigned'] = signedDocument;
                return [2 /*return*/, hsSdk.vp.verifyPresentation(tempverifyPresentationBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
                    })];
            });
        });
    });
    it('should not be able to verify presentation as issuerDid is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempverifyPresentationBody;
            return __generator(this, function (_a) {
                tempverifyPresentationBody = __assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = '';
                return [2 /*return*/, hsSdk.vp.verifyPresentation(tempverifyPresentationBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
                    })];
            });
        });
    });
    it('should not be able to verify presentation as challenge is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempverifyPresentationBody;
            return __generator(this, function (_a) {
                tempverifyPresentationBody = __assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = didDocId;
                tempverifyPresentationBody.challenge = '';
                return [2 /*return*/, hsSdk.vp.verifyPresentation(tempverifyPresentationBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for verifying a presentation');
                    })];
            });
        });
    });
    it('should not be able to verify presentation as holderVerificationMethodId is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempverifyPresentationBody;
            return __generator(this, function (_a) {
                tempverifyPresentationBody = __assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = didDocId;
                tempverifyPresentationBody.challenge = challenge;
                tempverifyPresentationBody.holderVerificationMethodId = '';
                return [2 /*return*/, hsSdk.vp.verifyPresentation(tempverifyPresentationBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: params.holderVerificationMethodId is required for verifying a presentation');
                    })];
            });
        });
    });
    it('should not be able to verify presentation as issuerVerificationMethodId is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempverifyPresentationBody;
            return __generator(this, function (_a) {
                tempverifyPresentationBody = __assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = didDocId;
                tempverifyPresentationBody.challenge = challenge;
                tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
                tempverifyPresentationBody.issuerVerificationMethodId = '';
                return [2 /*return*/, hsSdk.vp.verifyPresentation(tempverifyPresentationBody).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
                    })];
            });
        });
    });
    it('should be able to verify presentation', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempverifyPresentationBody, verifiedPresentationDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempverifyPresentationBody = __assign({}, verifyPresentationBody);
                        tempverifyPresentationBody.signedPresentation = signedPresentation;
                        tempverifyPresentationBody.issuerDid = didDocId;
                        tempverifyPresentationBody.holderDid = didDocId;
                        tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
                        tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
                        tempverifyPresentationBody.challenge = didDocId;
                        return [4 /*yield*/, hsSdk.vp.verifyPresentation(tempverifyPresentationBody)];
                    case 1:
                        verifiedPresentationDetail = _a.sent();
                        (0, chai_1.should)().exist(verifiedPresentationDetail.verified);
                        (0, chai_1.expect)(verifiedPresentationDetail.verified).to.be.equal(true);
                        (0, chai_1.expect)(verifiedPresentationDetail).to.be.a('object');
                        (0, chai_1.should)().exist(verifiedPresentationDetail.results);
                        (0, chai_1.expect)(verifiedPresentationDetail.results).to.be.a('array');
                        (0, chai_1.should)().exist(verifiedPresentationDetail.credentialResults);
                        (0, chai_1.expect)(verifiedPresentationDetail.credentialResults).to.be.a('array');
                        (0, chai_1.expect)(verifiedPresentationDetail.credentialResults[0].verified).to.be.equal(true);
                        (0, chai_1.expect)(verifiedPresentationDetail.credentialResults[0].credentialId).to.be.equal(credentialId);
                        return [2 /*return*/];
                }
            });
        });
    });
});
