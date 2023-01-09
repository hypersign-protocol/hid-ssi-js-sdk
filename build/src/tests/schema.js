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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("../index");
var config_1 = require("./config");
var hsSdk;
var privateKeyMultibase;
var publicKeyMultibase;
var verificationMethodId;
var didDocument;
var didDocId;
var offlineSigner;
var schemaSignature;
var hypersignSchema;
var schemaObject;
var schemaId;
var verificationMethod;
var hypersignDID;
var signedSchema;
var signSchema = {};
signSchema.proof = {};
var schemaBody = {
    name: 'testSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [{ name: 'name', type: 'integer', isRequired: false }],
    additionalProperties: false,
};
//add mnemonic of wallet that have balance
beforeEach(function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, config_1.createWallet)(config_1.mnemonic)];
                case 1:
                    offlineSigner = _a.sent();
                    // hsSdk = new HypersignSSISdk(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
                    // await hsSdk.init();
                    hypersignSchema = new index_1.HypersignSchema({
                        offlineSigner: offlineSigner,
                        nodeRestEndpoint: config_1.hidNodeEp.rest,
                        nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                        namespace: config_1.hidNodeEp.namespace,
                    });
                    return [4 /*yield*/, hypersignSchema.init()];
                case 2:
                    _a.sent();
                    hypersignDID = new index_1.HypersignDID({
                        offlineSigner: offlineSigner,
                        nodeRestEndpoint: config_1.hidNodeEp.rest,
                        nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                        namespace: config_1.hidNodeEp.namespace,
                    });
                    return [4 /*yield*/, hypersignDID.init()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
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
                        didDocId = didDocument['id'];
                        verificationMethod = didDocument['assertionMethod'][0];
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
describe('#register() this is to register did on the blockchain', function () {
    it('should be able to register didDocument in the blockchain', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignDID.register({ didDocument: didDocument, privateKeyMultibase: privateKeyMultibase, verificationMethodId: verificationMethodId })];
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
describe('#generate() method to create schema', function () {
    it('should not be able to create a new schema as author is not passed', function () {
        var tempSchemaBody = __assign({}, schemaBody);
        return hypersignSchema.generate(tempSchemaBody).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: Author must be passed');
        });
    });
    it('should able to create a new schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempSchemaBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempSchemaBody = __assign({}, schemaBody);
                        tempSchemaBody.author = didDocId;
                        return [4 /*yield*/, hypersignSchema.generate(tempSchemaBody)];
                    case 1:
                        schemaObject = _a.sent();
                        schemaId = schemaObject['id'];
                        //console.log(JSON.stringify(schemaObject, null, 2));
                        (0, chai_1.expect)(schemaObject).to.be.a('object');
                        (0, chai_1.should)().exist(schemaObject['type']);
                        (0, chai_1.should)().exist(schemaObject['modelVersion']);
                        (0, chai_1.should)().exist(schemaObject['id']);
                        (0, chai_1.should)().exist(schemaObject['name']);
                        (0, chai_1.should)().exist(schemaObject['author']);
                        (0, chai_1.should)().exist(schemaObject['authored']);
                        (0, chai_1.should)().exist(schemaObject['schema']);
                        (0, chai_1.expect)(schemaObject.schema).to.be.a('object');
                        (0, chai_1.expect)(schemaObject['name']).to.be.equal(tempSchemaBody.name);
                        (0, chai_1.expect)(schemaObject['author']).to.be.equal(tempSchemaBody.author);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#sign() function to sign schema', function () {
    it('should be able to sign newly created schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignSchema.sign({
                            privateKeyMultibase: privateKeyMultibase,
                            schema: schemaObject,
                            verificationMethodId: didDocument['assertionMethod'][0],
                        })];
                    case 1:
                        signedSchema = _a.sent();
                        //onsole.log(JSON.stringify(signedSchema, null, 2))
                        (0, chai_1.expect)(signedSchema).to.be.a('object');
                        (0, chai_1.should)().exist(signedSchema.proof);
                        (0, chai_1.should)().exist(signedSchema.proof.type);
                        (0, chai_1.should)().exist(signedSchema.proof.verificationMethod);
                        (0, chai_1.should)().exist(signedSchema.proof.proofPurpose);
                        (0, chai_1.should)().exist(signedSchema.proof.proofValue);
                        (0, chai_1.should)().exist(signedSchema.proof.created);
                        (0, chai_1.should)().exist(signedSchema.type);
                        (0, chai_1.should)().exist(signedSchema.modelVersion);
                        (0, chai_1.should)().exist(signedSchema.author);
                        (0, chai_1.should)().exist(signedSchema['id']);
                        (0, chai_1.should)().exist(signedSchema['name']);
                        (0, chai_1.should)().exist(signedSchema['author']);
                        (0, chai_1.should)().exist(signedSchema['authored']);
                        (0, chai_1.should)().exist(signedSchema['schema']);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#register() function to register schema on blockchain', function () {
    // it('should not be able to register  schema on blockchain as proof.created is null or empty', async function () {
    //   let tempParam = {} as Schema;
    //   tempParam.proof = {} as SchemaProof;
    //   Object.assign(tempParam, {...signedSchema})
    //   tempParam.proof.created = '';
    //   signedSchema.proof.created = signSchema.proof ? signSchema.proof.created : '';
    //   console.log({
    //     signedSchema, tempParam
    //   });
    //   return hypersignSchema.register({schema: tempParam}).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain created');
    //   });
    // });
    // it('should not be able to register  schema on blockchain as proof.proofPurpose is null or empty', async function () {
    //   let tempParam = {} as Schema;
    //   tempParam.proof = {} as SchemaProof;
    //   Object.assign(tempParam, {...signedSchema})
    //   tempParam.proof.proofPurpose = '';
    //   signedSchema.proof.proofPurpose = signSchema.proof? signSchema.proof.proofPurpose: ''
    //   console.log({tempParam, signedSchema})
    //   return hypersignSchema.register({schema: tempParam}).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain proofPurpose');
    //   });
    // });
    // it('should not be able to register  schema on blockchain as proof.proofValue is null or empty', async function () {
    //   let tempParam = {} as Schema;
    //   tempParam.proof = {} as SchemaProof;
    //   Object.assign(tempParam, {...signedSchema})
    //   tempParam.proof.proofValue = '';
    //   return hypersignSchema.register({schema: tempParam}).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain proofValue');
    //   });
    // });
    // it('should not be able to register  schema on blockchain as proof.type is null or empty', async function () {
    //   let tempParam = {} as Schema;
    //   tempParam.proof = {} as SchemaProof;
    //   Object.assign(tempParam, {...signedSchema})
    //   tempParam.proof.type = '';
    //   return hypersignSchema.register({schema: tempParam}).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain type');
    //   });
    // });
    // it('should not be able to register  schema on blockchain as proof.verificationMethod is null or empty', async function () {
    //   let tempParam = {} as Schema;
    //   tempParam.proof = {} as SchemaProof;
    //   Object.assign(tempParam, {...signedSchema})
    //   tempParam.proof.verificationMethod = '';
    //   return hypersignSchema.register({schema: tempParam}).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain verificationMethod');
    //   });
    // });
    // it('should not be able to register  schema on blockchain as schema.proof is null or empty', function () {
    //   const tempParam = {...signedSchema};
    //   tempParam.proof = undefined;
    //   return hypersignSchema.register({schema: tempParam}).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must be passed');
    //   });
    // });
    // it('should not be able to register schema on blockchain as schema is not passed', function () {
    //   const tempParam = {...signedSchema};
    //   tempParam.schema = undefined;
    //   tempParam.proof.created = '';
    //   return hypersignSchema.register(tempParam).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: schema must be passed');
    //   });
    // });
    // it('should not be able to register  schema on blockchain as proof.type is null or empty', async function () {
    //   const tempParam = { ...params };
    //   tempParam.schema = schemaObject;
    //   tempParam.proof.created = schemaObject.authored;
    //   tempParam.proof.proofValue = schemaSignature;
    //   tempParam.proof.proofPurpose = 'assertion';
    //   tempParam.proof.type = '';
    //   return hypersignSchema.register(tempParam).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain type');
    //   });
    // });
    // it('should not be able to register  schema on blockchain as proof.verificationMethod is null or empty', async function () {
    //   const tempParam = { ...params };
    //   tempParam.schema = schemaObject;
    //   tempParam.proof.proofPurpose = 'assertion';
    //   tempParam.proof.created = schemaObject.authored;
    //   tempParam.proof.proofValue = schemaSignature;
    //   tempParam.proof.type = 'Ed25519VerificationKey2020';
    //   return hypersignSchema.register(tempParam).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain verificationMethod');
    //   });
    // });
    it('should be able to register schema on blockchain', function () {
        return __awaiter(this, void 0, void 0, function () {
            var registeredSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignSchema.register({
                            schema: signedSchema,
                        })];
                    case 1:
                        registeredSchema = _a.sent();
                        //console.log(JSON.stringify(registeredSchema, null, 2))
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
describe('#resolve() this is to resolve schema', function () {
    it('should not able to resolve schema and throw error didDocId is not passed', function () {
        return hypersignSchema.resolve({ params: { schemaId: '' } }).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: SchemaId must be passed');
        });
    });
    it('should be able to resolve schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            schemaId: schemaId,
                        };
                        return [4 /*yield*/, hypersignSchema.resolve(params)];
                    case 1:
                        result = _a.sent();
                        //console.log(JSON.stringify(result, null, 2))
                        (0, chai_1.expect)(result).to.be.a('object');
                        (0, chai_1.expect)(result.id).to.be.equal(schemaId);
                        (0, chai_1.expect)(result.proof.verificationMethod).to.be.equal(verificationMethod);
                        (0, chai_1.expect)(result.proof).to.be.a('object');
                        return [2 /*return*/];
                }
            });
        });
    });
});
