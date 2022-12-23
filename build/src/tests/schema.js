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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var schema_1 = __importDefault(require("../schema/schema"));
var did_1 = __importDefault(require("../did/did"));
var chai_1 = require("chai");
var hypersignDid = new did_1.default();
var hypersignSchema = new schema_1.default();
var seed = '';
var schemaSignature;
var privateKeyMultibase;
var publicKeyMultibase;
var didDocId;
var schemaId;
var schemaObject;
var didDocument;
var verificationMethod;
var schemaBody = {
    name: 'testSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [{ name: 'name', type: 'integer', isRequired: false }],
    additionalProperties: false,
};
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
    it('should return didDocument', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignDid.generate({ publicKeyMultibase: publicKeyMultibase })];
                    case 1:
                        didDocument = _a.sent();
                        didDocId = didDocument['id'];
                        (0, chai_1.expect)(didDocument).to.be.a('object');
                        (0, chai_1.should)().exist(didDocument['@context']);
                        (0, chai_1.should)().exist(didDocument['id']);
                        (0, chai_1.should)().exist(didDocument['controller']);
                        (0, chai_1.should)().exist(didDocument['alsoKnownAs']);
                        verificationMethod = didDocument['verificationMethod'];
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
describe('#getSchema() method to create schema', function () {
    it('should not be able to create a new schema as author is not passed', function () {
        var tempSchemaBody = __assign({}, schemaBody);
        return hypersignSchema.getSchema(tempSchemaBody).catch(function (err) {
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
                        return [4 /*yield*/, hypersignSchema.getSchema(tempSchemaBody)];
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
                        (0, chai_1.expect)(schemaObject['name']).to.be.equal(tempSchemaBody.name);
                        (0, chai_1.expect)(schemaObject['author']).to.be.equal(tempSchemaBody.author);
                        return [2 /*return*/];
                }
            });
        });
    });
});
describe('#signSchema() method to sign schema', function () {
    it('should not be able to sign newly created schema as privateKey is not passed or empty', function () {
        return hypersignSchema.signSchema({ privateKey: '', schema: schemaObject }).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: PrivateKey must be passed');
        });
    });
    it('should be able to sign newly created schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var signedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hypersignSchema.signSchema({ privateKey: privateKeyMultibase, schema: schemaObject })];
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
describe('#registerSchema() method to register schema on blockchain', function () {
    var schema = schemaObject;
    var proof = {
        type: 'Ed25519Signature2020',
        created: '',
        verificationMethod: '',
        proofValue: '',
        proofPurpose: 'assertion',
    };
    var params = { schema: schema, proof: proof };
    it('should not be able to register  newly created schema on blockchain as schema is not passed', function () {
        var tempParam = __assign({}, params);
        tempParam.schema = undefined;
        tempParam.proof.created = '';
        return hypersignSchema.registerSchema(tempParam).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: Schema must be passed');
        });
    });
    it('should not be able to register  newly created schema on blockchain as proof.created is null or empty', function () {
        var tempParam = __assign({}, params);
        tempParam.schema = schemaObject;
        tempParam.proof.created = '';
        return hypersignSchema.registerSchema(tempParam).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain created');
        });
    });
    it('should not be able to register  newly created schema on blockchain as proof.proofPurpose is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempParam;
            return __generator(this, function (_a) {
                tempParam = __assign({}, params);
                tempParam.schema = schemaObject;
                tempParam.proof.created = schemaObject.authored;
                tempParam.proof.proofPurpose = '';
                return [2 /*return*/, hypersignSchema.registerSchema(tempParam).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain proofPurpose');
                    })];
            });
        });
    });
    it('should not be able to register  newly created schema on blockchain as proof.proofValue is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempParam;
            return __generator(this, function (_a) {
                tempParam = __assign({}, params);
                tempParam.schema = schemaObject;
                tempParam.proof.proofPurpose = 'assertion';
                tempParam.proof.created = schemaObject.authored;
                return [2 /*return*/, hypersignSchema.registerSchema(tempParam).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain proofValue');
                    })];
            });
        });
    });
    it('should not be able to register  newly created schema on blockchain as proof.type is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempParam;
            return __generator(this, function (_a) {
                tempParam = __assign({}, params);
                tempParam.schema = schemaObject;
                tempParam.proof.created = schemaObject.authored;
                tempParam.proof.proofValue = schemaSignature;
                tempParam.proof.proofPurpose = 'assertion';
                tempParam.proof.type = '';
                return [2 /*return*/, hypersignSchema.registerSchema(tempParam).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain type');
                    })];
            });
        });
    });
    it('should not be able to register  newly created schema on blockchain as proof.verificationMethod is null or empty', function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempParam;
            return __generator(this, function (_a) {
                tempParam = __assign({}, params);
                tempParam.schema = schemaObject;
                tempParam.proof.proofPurpose = 'assertion';
                tempParam.proof.created = schemaObject.authored;
                tempParam.proof.proofValue = schemaSignature;
                tempParam.proof.type = 'Ed25519Signature2020';
                return [2 /*return*/, hypersignSchema.registerSchema(tempParam).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain verificationMethod');
                    })];
            });
        });
    });
    it('should not be able to register newly created schema on blockchain as wallet do not have balance', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema, params;
            return __generator(this, function (_a) {
                proof['created'] = schemaObject.authored;
                proof['proofValue'] = schemaSignature;
                proof['type'] = 'Ed25519Signature2020';
                proof['proofPurpose'] = 'assertion';
                proof['verificationMethod'] = verificationMethod;
                schema = schemaObject;
                params = { schema: schema, proof: proof };
                return [2 /*return*/, hypersignSchema.registerSchema(params).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(TypeError, "Cannot read property 'signAndBroadcast' of undefined");
                    })];
            });
        });
    });
});
describe('#resolve() method to resolve schema', function () {
    it('should not be able to resolve schema as schemaId is not passed or it is null', function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = { schemaId: '' };
                return [2 /*return*/, hypersignSchema.resolve(params).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'HID-SSI-SDK:: Error: SchemaId must be passed');
                    })];
            });
        });
    });
    it("should not be able to resolve schema as hidClient can't be initialized", function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = { schemaId: schemaId };
                return [2 /*return*/, hypersignSchema.resolve(params).catch(function (err) {
                        (0, chai_1.expect)(function () {
                            throw err;
                        }).to.throw(Error, 'connect ECONNREFUSED 127.0.0.1:80');
                    })];
            });
        });
    });
});
