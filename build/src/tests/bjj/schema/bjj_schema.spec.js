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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
const chai_1 = require("chai");
const config_1 = require("../../config");
let signedSchema2;
let invalidSchemaNamedSignedSchema1;
let invalidSchemaNamedSignedSchema2;
let invalidSchemaNamedSignedSchema3;
let randomProperty;
let privateKeyMultibase;
let publicKeyMultibase;
let offlineSigner;
let hsSdk;
let didDocument;
let verificationMethod;
let didDocId;
let schemaObject;
let signedSchema;
let schemaId;
let schemaObject2;
const schemaBody = {
    name: 'TestSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [{ name: 'name', type: 'string', isRequired: false }, { name: "address", type: "string", isRequired: true }],
    additionalProperties: false,
};
beforeEach(function () {
    return __awaiter(this, void 0, void 0, function* () {
        offlineSigner = yield (0, config_1.createWallet)(config_1.mnemonic);
        const params = {
            offlineSigner,
            nodeRestEndpoint: config_1.hidNodeEp.rest,
            nodeRpcEndpoint: config_1.hidNodeEp.rpc,
            namespace: config_1.hidNodeEp.namespace,
        };
        hsSdk = new index_1.HypersignSSISdk(params);
        yield hsSdk.init();
    });
});
describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const kp = yield hsSdk.did.bjjDID.generateKeys();
            privateKeyMultibase = kp.privateKeyMultibase;
            publicKeyMultibase = kp.publicKeyMultibase;
            (0, chai_1.expect)(kp).to.be.a('object');
            (0, chai_1.should)().exist(kp.privateKeyMultibase);
            (0, chai_1.should)().exist(kp.publicKeyMultibase);
            (0, chai_1.should)().not.exist(kp.id);
        });
    });
});
describe('DID Operation', () => {
    describe('#generate() method to generate new did', function () {
        it('should be able to generate a did using babyJubJub', () => __awaiter(this, void 0, void 0, function* () {
            didDocument = yield hsSdk.did.bjjDID.generate({
                publicKeyMultibase
            });
            didDocId = didDocument.id;
            verificationMethod = didDocument.verificationMethod;
            (0, chai_1.expect)(didDocument).to.be.a('object');
            (0, chai_1.should)().exist(didDocument['@context']);
            (0, chai_1.should)().exist(didDocument['id']);
            (0, chai_1.should)().exist(didDocument['controller']);
            (0, chai_1.should)().exist(didDocument['verificationMethod']);
            (0, chai_1.expect)(didDocument['verificationMethod'] &&
                didDocument['authentication'] &&
                didDocument['assertionMethod'] &&
                didDocument['keyAgreement'] &&
                didDocument['capabilityInvocation'] &&
                didDocument['capabilityDelegation'] &&
                didDocument['service']).to.be.a('array');
            (0, chai_1.expect)(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
            (0, chai_1.should)().exist(didDocument['authentication']);
            (0, chai_1.should)().exist(didDocument['assertionMethod']);
            (0, chai_1.should)().exist(didDocument['keyAgreement']);
            (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
            (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
            (0, chai_1.should)().exist(didDocument['service']);
            (0, chai_1.expect)(didDocument['authentication'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['assertionMethod'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['capabilityInvocation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['capabilityDelegation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['keyAgreement'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['service'].length).to.be.equal(0);
        }));
    });
    describe('#register() method to register did', function () {
        it('should be able to register did generated using BabyJubJubKey', () => __awaiter(this, void 0, void 0, function* () {
            const registerDid = yield hsSdk.did.bjjDID.register({
                didDocument: didDocument,
                privateKeyMultibase,
                verificationMethodId: verificationMethod[0].id
            });
            didDocument = registerDid.didDocument;
            (0, chai_1.expect)(didDocument).to.be.a('object');
            (0, chai_1.should)().exist(didDocument['@context']);
            (0, chai_1.should)().exist(didDocument['id']);
            (0, chai_1.should)().exist(didDocument['controller']);
            (0, chai_1.should)().exist(didDocument['verificationMethod']);
            (0, chai_1.expect)(didDocument['verificationMethod'] &&
                didDocument['authentication'] &&
                didDocument['assertionMethod'] &&
                didDocument['keyAgreement'] &&
                didDocument['capabilityInvocation'] &&
                didDocument['capabilityDelegation'] &&
                didDocument['service']).to.be.a('array');
            (0, chai_1.expect)(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
            (0, chai_1.should)().exist(didDocument['authentication']);
            (0, chai_1.should)().exist(didDocument['assertionMethod']);
            (0, chai_1.should)().exist(didDocument['keyAgreement']);
            (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
            (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
            (0, chai_1.should)().exist(didDocument['service']);
            (0, chai_1.expect)(didDocument['authentication'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['assertionMethod'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['capabilityInvocation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['capabilityDelegation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['keyAgreement'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['service'].length).to.be.equal(0);
            (0, chai_1.should)().exist(registerDid.transactionHash);
        }));
    });
});
describe('Schema Operations', () => {
    describe('#generate() method to create schema', function () {
        it('should not be able to create a new schema as author is not passed', function () {
            const tempSchemaBody = Object.assign({}, schemaBody);
            return hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: Author must be passed');
            });
        });
        it('should not be able to create a new schema as schema name is in camelCase and only pascalCase is allowed', function () {
            const tempSchemaBody = Object.assign({}, schemaBody);
            tempSchemaBody.author = didDocId;
            tempSchemaBody['name'] = 'testSchema';
            return hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema name should always be in PascalCase');
            });
        });
        it('should not be able to create a schema as schema name is in snakeCase and only pascalCase is allowed', function () {
            const tempSchemaBody = Object.assign({}, schemaBody);
            tempSchemaBody.author = didDocId;
            tempSchemaBody['name'] = 'testing_schema';
            return hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema name should always be in PascalCase');
            });
        });
        it('should not be able to create a schema as schema name is not in  pascalCase', function () {
            const tempSchemaBody = Object.assign({}, schemaBody);
            tempSchemaBody.author = didDocId;
            tempSchemaBody['name'] = 'Test credential Schema';
            return hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema name should always be in PascalCase');
            });
        });
        it("should not be able to create a schema as sub-property 'name' is not present in field property", function () {
            const tempSchemaBody = Object.assign({}, schemaBody);
            tempSchemaBody.author = didDocId;
            tempSchemaBody['fields'] = [{ isRequired: true }];
            return hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: All fields must contains property 'name'");
            });
        });
        it('should be able to generate new schema', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSchemaBody = Object.assign({}, schemaBody);
                tempSchemaBody.author = didDocId;
                schemaObject = yield hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody);
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
                (0, chai_1.expect)(schemaObject['schema'].required).to.be.a('array');
            });
        });
        it('should be able to create a schema with differnt field value', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSchemaBody = Object.assign({}, schemaBody);
                tempSchemaBody.fields.push({ name: 'address', type: 'string', isRequired: false });
                tempSchemaBody.author = didDocId;
                schemaObject2 = yield hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody);
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
            });
        });
    });
    describe('#sign() method to sign a schema', function () {
        it('should not be able to sign a new schema as privateKeyMultibase is not passed', function () {
            return hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase: "",
                schema: schemaObject,
                verificationMethodId: didDocument['assertionMethod'][0]
            }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase must be passed');
            });
        });
        it('should not be able to sign a new schema as verificationMethodId is not passed', function () {
            return hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase,
                schema: schemaObject,
                verificationMethodId: ""
            }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId must be passed');
            });
        });
        it('should not be able to sign a new schema as schema is not passed', function () {
            return hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase,
                verificationMethodId: didDocument['assertionMethod'][0]
            }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: Schema must be passed');
            });
        });
        it('should be able to sign newly created schema', () => __awaiter(this, void 0, void 0, function* () {
            signedSchema = yield hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase,
                schema: schemaObject,
                verificationMethodId: didDocument['assertionMethod'][0]
            });
            (0, chai_1.expect)(signedSchema).to.be.a('object');
            (0, chai_1.should)().exist(signedSchema.type);
            (0, chai_1.should)().exist(signedSchema.modelVersion);
            (0, chai_1.should)().exist(signedSchema['id']);
            (0, chai_1.should)().exist(signedSchema['name']);
            (0, chai_1.should)().exist(signedSchema['author']);
            (0, chai_1.should)().exist(signedSchema['authored']);
            (0, chai_1.should)().exist(signedSchema['schema']);
            (0, chai_1.should)().exist(signedSchema.schema.schema);
            (0, chai_1.should)().exist(signedSchema.schema.description);
            (0, chai_1.should)().exist(signedSchema.schema.type);
            (0, chai_1.should)().exist(signedSchema.schema.properties);
            (0, chai_1.should)().exist(signedSchema.schema.required);
            (0, chai_1.should)().exist(signedSchema.proof);
            (0, chai_1.should)().exist(signedSchema.proof.type);
            (0, chai_1.expect)(signedSchema.proof.type).to.be.equal('BJJSignature2021');
            (0, chai_1.should)().exist(signedSchema.proof.created);
            (0, chai_1.should)().exist(signedSchema.proof.verificationMethod);
            (0, chai_1.should)().exist(signedSchema.proof.proofPurpose);
            (0, chai_1.expect)(signedSchema.proof.proofPurpose).to.be.equal('assertionMethod');
            (0, chai_1.should)().exist(signedSchema.proof.proofValue);
        }));
        it('should be able to sign newly created schema with schema name is in camelCase', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject2));
                tempSchemaBody['name'] = "testSchema";
                invalidSchemaNamedSignedSchema1 = yield hsSdk.schema.hypersignBjjschema.sign({
                    privateKeyMultibase: privateKeyMultibase,
                    schema: tempSchemaBody,
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
        it('should be able to sign newly created schema with schema name is in snakeCase', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject2));
                tempSchemaBody['name'] = "test_schema";
                invalidSchemaNamedSignedSchema2 = yield hsSdk.schema.hypersignBjjschema.sign({
                    privateKeyMultibase: privateKeyMultibase,
                    schema: tempSchemaBody,
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
        it('should be able to sign newly created schema with schema name is in sentanceCase', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject2));
                tempSchemaBody['name'] = "Test Schema";
                invalidSchemaNamedSignedSchema3 = yield hsSdk.schema.hypersignBjjschema.sign({
                    privateKeyMultibase: privateKeyMultibase,
                    schema: tempSchemaBody,
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
        it('should be able to sign newly created schema with invalid sub-property of propert field', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject2));
                const prop = JSON.parse(tempSchemaBody.schema.properties);
                randomProperty = "randomProperty";
                prop[`${schemaBody.fields[0].name}`]['randomProperty'] = "xyz";
                tempSchemaBody['schema'].properties = JSON.stringify(prop);
                signedSchema2 = yield hsSdk.schema.hypersignBjjschema.sign({
                    privateKeyMultibase: privateKeyMultibase,
                    schema: tempSchemaBody,
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
    describe('#register() method to register a schema', function () {
        it('Should not be able to register schema as schema is not passed in params', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                schemas: signedSchema
            };
            return hsSdk.schema.hypersignBjjschema.register(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema must be passed');
            });
        }));
        it('Should not be able to register schema as schema object does not have proof field', () => __awaiter(this, void 0, void 0, function* () {
            const tempSchemaDetail = Object.assign({}, signedSchema);
            delete tempSchemaDetail.proof;
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must be passed');
            });
        }));
        it('Should not be able to register schema as schema proof does not have "created" field or it is empty ', () => __awaiter(this, void 0, void 0, function* () {
            const tempSchemaDetail = JSON.parse(JSON.stringify(Object.assign({}, signedSchema)));
            tempSchemaDetail.proof.created = "";
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain created');
            });
        }));
        it('Should not be able to register schema as schema proof does not have "proofPurpose" field or it is empty ', () => __awaiter(this, void 0, void 0, function* () {
            const tempSchemaDetail = JSON.parse(JSON.stringify(Object.assign({}, signedSchema)));
            tempSchemaDetail.proof.proofPurpose = "";
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain proofPurpose');
            });
        }));
        it('Should not be able to register schema as schema proof does not have "proofValue" field or it is empty ', () => __awaiter(this, void 0, void 0, function* () {
            const tempSchemaDetail = JSON.parse(JSON.stringify(Object.assign({}, signedSchema)));
            tempSchemaDetail.proof.proofValue = "";
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain proofValue');
            });
        }));
        it('Should not be able to register schema as schema proof does not have "type" field or it is empty ', () => __awaiter(this, void 0, void 0, function* () {
            const tempSchemaDetail = JSON.parse(JSON.stringify(Object.assign({}, signedSchema)));
            tempSchemaDetail.proof.type = "";
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain type');
            });
        }));
        it('Should not be able to register schema as schema proof does not have "verificationMethod" field or it is empty ', () => __awaiter(this, void 0, void 0, function* () {
            const tempSchemaDetail = JSON.parse(JSON.stringify(Object.assign({}, signedSchema)));
            tempSchemaDetail.proof.verificationMethod = "";
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain verificationMethod');
            });
        }));
        it('should be able to register newly created schema', () => __awaiter(this, void 0, void 0, function* () {
            const registerdSchema = yield hsSdk.schema.hypersignBjjschema.register({ schema: signedSchema });
            (0, chai_1.should)().exist(registerdSchema.transactionHash);
        }));
        it('should not be able to register schema on blockchain as its already registered', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.schema.hypersignBjjschema.register({
                    schema: signedSchema,
                }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `failed to execute message; message index: 0: Schema ID:  ${schemaId}: schema already exists`);
                });
            });
        });
        it('should not be able to register schema as schema name is in camel case which is not valid', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.schema.hypersignBjjschema.register({
                    schema: invalidSchemaNamedSignedSchema1,
                }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `failed to execute message; message index: 0: name must always be in PascalCase: ${invalidSchemaNamedSignedSchema1.name}: invalid credential schema`);
                });
            });
        });
        it('should not be able to register schema as schema name is in snake case which is not valid', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.schema.hypersignBjjschema.register({
                    schema: invalidSchemaNamedSignedSchema2,
                }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `failed to execute message; message index: 0: name must always be in PascalCase: ${invalidSchemaNamedSignedSchema2.name}: invalid credential schema`);
                });
            });
        });
        it('should not be able to register schema as schema name is in sentance case which is not valid', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.schema.hypersignBjjschema.register({
                    schema: invalidSchemaNamedSignedSchema3,
                }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `failed to execute message; message index: 0: name must always be in PascalCase: ${invalidSchemaNamedSignedSchema3.name}: invalid credential schema`);
                });
            });
        });
        it('should not be able to register schema as there is a invalid sub-property in side property field', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.schema.hypersignBjjschema.register({
                    schema: signedSchema2,
                }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `failed to execute message; message index: 0: invalid \`property\` provided: invalid sub-attribute ${randomProperty} of attribute name. Only \`type\` and \`format\` sub-attributes are permitted: invalid credential schema`);
                });
            });
        });
    });
    describe('#resolve() method to resolve a schema', function () {
        it('Should be able to resolve schema from blockchain', () => __awaiter(this, void 0, void 0, function* () {
            const resolvedSchema = yield hsSdk.schema.hypersignBjjschema.resolve({ schemaId });
            (0, chai_1.should)().exist(resolvedSchema.context);
            (0, chai_1.should)().exist(resolvedSchema.type);
            (0, chai_1.should)().exist(resolvedSchema.modelVersion);
            (0, chai_1.should)().exist(resolvedSchema.id);
            (0, chai_1.should)().exist(resolvedSchema.name);
            (0, chai_1.should)().exist(resolvedSchema.author);
            (0, chai_1.should)().exist(resolvedSchema.authored);
            (0, chai_1.should)().exist(resolvedSchema.schema);
            (0, chai_1.should)().exist(resolvedSchema.schema.schema);
            (0, chai_1.should)().exist(resolvedSchema.schema.description);
            (0, chai_1.should)().exist(resolvedSchema.schema.type);
            (0, chai_1.should)().exist(resolvedSchema.schema.properties);
            (0, chai_1.should)().exist(resolvedSchema.schema.required);
            (0, chai_1.should)().exist(resolvedSchema.schema.additionalProperties);
            (0, chai_1.should)().exist(resolvedSchema.proof);
            (0, chai_1.expect)(resolvedSchema.proof.type).to.be.equal('BJJSignature2021');
            (0, chai_1.should)().exist(resolvedSchema.proof.created);
            (0, chai_1.should)().exist(resolvedSchema.proof.verificationMethod);
            (0, chai_1.should)().exist(resolvedSchema.proof.proofPurpose);
            (0, chai_1.should)().exist(resolvedSchema.proof.proofValue);
            (0, chai_1.should)().exist(resolvedSchema.proof.clientSpecType);
            (0, chai_1.expect)(resolvedSchema.proof.clientSpecType).to.be.equal('CLIENT_SPEC_TYPE_NONE');
        }));
    });
});
