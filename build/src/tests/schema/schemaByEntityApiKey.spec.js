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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../../index");
const config_1 = require("../config");
const schema_1 = __importDefault(require("../../schema/schema"));
let signedSchema;
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let schemaId;
let hypersignDID;
let hypersignSchema;
let verificationMethod;
let schemaDoc;
// const entityApiSecretKey =
//   '8fc3d16ce8f040fd2fc4e5ccc1d73.6b6e55d4d54cd90c85bbcc92d9469873e60c0d7878681223e2fe63fca3abafb63390f939a77b3d73bf2eb58a654810b38';
const entityApiSecret = "69b91e007904228e3313e586ba695.bc7705956989e43bbd7060e845c2763a381cbc80f935ac848119b8c2d7d00616346eeb74efe22a0ff140506a0c6157ef6";
const schemaBody = {
    name: 'schema for university student registration',
    description: 'This is a test schema generated for student registration',
    author: '',
    fields: [{ name: 'name', type: 'string', isRequired: false }, { name: 'roll number', type: 'integer', isRequired: true }],
    additionalProperties: false,
};
beforeEach(function () {
    return __awaiter(this, void 0, void 0, function* () {
        offlineSigner = yield (0, config_1.createWallet)(config_1.mnemonic);
        hypersignSchema = new index_1.HypersignSchema({
            offlineSigner,
            nodeRestEndpoint: config_1.hidNodeEp.rest,
            nodeRpcEndpoint: config_1.hidNodeEp.rpc,
            namespace: config_1.hidNodeEp.namespace,
        });
        yield hypersignSchema.init();
        hypersignDID = new index_1.HypersignDID({
            offlineSigner,
            nodeRestEndpoint: config_1.hidNodeEp.rest,
            nodeRpcEndpoint: config_1.hidNodeEp.rpc,
            namespace: config_1.hidNodeEp.namespace,
        });
        yield hypersignDID.init();
    });
});
describe('Schema test scenario with entityApiSecretKey', () => {
    describe("testing hypersignSchema initiation", function () {
        it('It should throw error as hypersignSchema is neither init using offlineSigner nor using entityApiKey', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            };
            const hypersignSchema = new index_1.HypersignSchema(params);
            return yield hypersignSchema.init().catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: SchemaRpc class is not initialise with offlinesigner');
            });
        }));
    });
    describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
        it('should return publickeyMultibase and privateKeyMultibase', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const kp = yield hypersignDID.generateKeys();
                privateKeyMultibase = kp.privateKeyMultibase;
                publicKeyMultibase = kp.publicKeyMultibase;
                (0, chai_1.expect)(kp).to.be.a('object');
                (0, chai_1.should)().exist(kp.privateKeyMultibase);
                (0, chai_1.should)().exist(kp.publicKeyMultibase);
            });
        });
    });
    describe('#generate() to generate did', function () {
        it('should be able to generate didDocument', function () {
            return __awaiter(this, void 0, void 0, function* () {
                didDocument = yield hypersignDID.generate({ publicKeyMultibase });
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
            });
        });
    });
    describe('#register() this is to register did on the blockchain', function () {
        it('should be able to register didDocument in the blockchain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield hypersignDID.register({ didDocument, privateKeyMultibase, verificationMethodId });
                (0, chai_1.should)().exist(result.transactionHash);
            });
        });
    });
    describe('#generate() method to create schema', function () {
        it('should not be able to create a new schema as author is not passed', function () {
            const tempSchemaBody = Object.assign({}, schemaBody);
            return hypersignSchema.generate(tempSchemaBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: Author must be passed');
            });
        });
        it('should able to create a new schema', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSchemaBody = Object.assign({}, schemaBody);
                tempSchemaBody.author = didDocId;
                schemaDoc = yield hypersignSchema.generate(tempSchemaBody);
                schemaId = schemaDoc['id'];
                (0, chai_1.expect)(schemaDoc).to.be.a('object');
                (0, chai_1.should)().exist(schemaDoc['type']);
                (0, chai_1.should)().exist(schemaDoc['modelVersion']);
                (0, chai_1.should)().exist(schemaDoc['id']);
                (0, chai_1.should)().exist(schemaDoc['name']);
                (0, chai_1.should)().exist(schemaDoc['author']);
                (0, chai_1.should)().exist(schemaDoc['authored']);
                (0, chai_1.should)().exist(schemaDoc['schema']);
                (0, chai_1.expect)(schemaDoc.schema).to.be.a('object');
                (0, chai_1.expect)(schemaDoc['name']).to.be.equal(tempSchemaBody.name);
                (0, chai_1.expect)(schemaDoc['author']).to.be.equal(tempSchemaBody.author);
            });
        });
    });
    describe('#sign() function to sign schema', function () {
        it('should not be able to sign schema as privateKeyMultibase is not passed', () => __awaiter(this, void 0, void 0, function* () {
            return hypersignSchema.sign({
                privateKeyMultibase: '',
                schema: schemaDoc,
                verificationMethodId: didDocument['assertionMethod'][0]
            }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase must be passed');
            });
        }));
        it('should not be able to sign schema as verificationMethodId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            return hypersignSchema.sign({
                privateKeyMultibase,
                schema: schemaDoc,
                verificationMethodId: ""
            }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId must be passed');
            });
        }));
        it('should not be able to sign schema as schema is not passed', () => __awaiter(this, void 0, void 0, function* () {
            return hypersignSchema.sign({
                privateKeyMultibase,
                verificationMethodId: didDocument['assertionMethod'][0]
            }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: Schema must be passed');
            });
        }));
        it('should be able to sign newly created schema', function () {
            return __awaiter(this, void 0, void 0, function* () {
                signedSchema = yield hypersignSchema.sign({
                    privateKeyMultibase: privateKeyMultibase,
                    schema: schemaDoc,
                    verificationMethodId: didDocument['assertionMethod'][0],
                });
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
            });
        });
    });
    describe('#register() function to register schema entitApiSecretKey', () => {
        it('Should not be able to register schema as schema is not passed in params', () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {
                schemas: signedSchema
            };
            return hypersignSchema.register(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema must be passed');
            });
        }));
        it('Should not be able to register schema as schema object does not have proof field', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSchemaDetail = Object.assign({}, signedSchema);
            delete tempSchemaDetail.proof;
            return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must be passed');
            });
        }));
        it('Should not be able to register schema as schema proof does not have "created" field or it is empty ', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSchemaDetail = JSON.parse(JSON.stringify(Object.assign({}, signedSchema)));
            tempSchemaDetail.proof.created = "";
            return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain created');
            });
        }));
        it('Should not be able to register schema as schema proof does not have "proofPurpose" field or it is empty ', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSchemaDetail = JSON.parse(JSON.stringify(Object.assign({}, signedSchema)));
            tempSchemaDetail.proof.proofPurpose = "";
            return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain proofPurpose');
            });
        }));
        it('Should not be able to register schema as schema proof does not have "proofValue" field or it is empty ', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSchemaDetail = JSON.parse(JSON.stringify(Object.assign({}, signedSchema)));
            tempSchemaDetail.proof.proofValue = "";
            return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain proofValue');
            });
        }));
        it('Should not be able to register schema as schema proof does not have "type" field or it is empty ', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSchemaDetail = JSON.parse(JSON.stringify(Object.assign({}, signedSchema)));
            tempSchemaDetail.proof.type = "";
            return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain type');
            });
        }));
        it('Should not be able to register schema as schema proof does not have "verificationMethod" field or it is empty ', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSchemaDetail = JSON.parse(JSON.stringify(Object.assign({}, signedSchema)));
            tempSchemaDetail.proof.verificationMethod = "";
            return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain verificationMethod');
            });
        }));
        it('Should be able to register schema using entitApiSecretKey', () => __awaiter(void 0, void 0, void 0, function* () {
            const hypersignSchema = new schema_1.default({
                entityApiSecretKey: entityApiSecret,
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            });
            yield hypersignSchema.init();
            const registerdSchema = yield hypersignSchema.register({ schema: signedSchema });
            (0, chai_1.should)().exist(registerdSchema.transactionHash);
        }));
    });
    describe('#resolve() should be able to resolve schema generated using entityApiSecretKey', function () {
        it('should be able to resolve schema', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                schemaId,
            };
            const result = yield hypersignSchema.resolve(params);
            (0, chai_1.expect)(result).to.be.a('object');
            (0, chai_1.should)().exist(result.type);
            (0, chai_1.expect)(result.type).to.be.a('string');
            (0, chai_1.should)().exist(result.modelVersion);
            (0, chai_1.expect)(result.modelVersion).to.be.a('string');
            (0, chai_1.should)().exist(result.id);
            (0, chai_1.expect)(result.id).to.be.a('string');
            (0, chai_1.expect)(result.id).to.be.equal(schemaId);
            (0, chai_1.expect)(result.name).to.be.a('string');
            (0, chai_1.should)().exist(result.name);
            (0, chai_1.should)().exist(result.author);
            (0, chai_1.expect)(result.author).to.be.a('string');
            (0, chai_1.should)().exist(result.authored);
            (0, chai_1.expect)(result.authored).to.be.a('string');
            (0, chai_1.should)().exist(result.schema);
            (0, chai_1.expect)(result.schema).to.be.a('object');
            (0, chai_1.should)().exist(result.proof);
            (0, chai_1.expect)(result.proof).to.be.a('object');
            (0, chai_1.expect)(result.proof.verificationMethod).to.be.equal(verificationMethod);
            (0, chai_1.expect)(result.proof).to.be.a('object');
        }));
    });
});
