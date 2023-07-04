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
const chai_1 = require("chai");
const index_1 = require("../index");
const config_1 = require("./config");
let hsSdk;
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let schemaSignature;
let hypersignSchema;
let schemaObject;
let schemaId;
let verificationMethod;
let hypersignDID;
let signedSchema;
const signSchema = {};
signSchema.proof = {};
const schemaBody = {
    name: 'testSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [{ name: 'name', type: 'integer', isRequired: false }],
    additionalProperties: false,
};
//add mnemonic of wallet that have balance
beforeEach(function () {
    return __awaiter(this, void 0, void 0, function* () {
        offlineSigner = yield (0, config_1.createWallet)(config_1.mnemonic);
        // hsSdk = new HypersignSSISdk(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
        // await hsSdk.init();
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
    it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
        return hypersignDID.generate({ publicKeyMultibase: '' }).catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
        });
    });
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
            (0, chai_1.should)().exist(result.code);
            (0, chai_1.should)().exist(result.height);
            (0, chai_1.should)().exist(result.rawLog);
            (0, chai_1.should)().exist(result.transactionHash);
            (0, chai_1.should)().exist(result.gasUsed);
            (0, chai_1.should)().exist(result.gasWanted);
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
            schemaObject = yield hypersignSchema.generate(tempSchemaBody);
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
        });
    });
});
describe('#sign() function to sign schema', function () {
    it('should be able to sign newly created schema', function () {
        return __awaiter(this, void 0, void 0, function* () {
            signedSchema = yield hypersignSchema.sign({
                privateKeyMultibase: privateKeyMultibase,
                schema: schemaObject,
                verificationMethodId: didDocument['assertionMethod'][0],
            });
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
        return __awaiter(this, void 0, void 0, function* () {
            const registeredSchema = yield hypersignSchema.register({
                schema: signedSchema,
            });
            //console.log(JSON.stringify(registeredSchema, null, 2))
            (0, chai_1.expect)(registeredSchema).to.be.a('object');
            (0, chai_1.should)().exist(registeredSchema.code);
            (0, chai_1.should)().exist(registeredSchema.height);
            (0, chai_1.should)().exist(registeredSchema.rawLog);
            (0, chai_1.should)().exist(registeredSchema.transactionHash);
            (0, chai_1.should)().exist(registeredSchema.gasUsed);
            (0, chai_1.should)().exist(registeredSchema.gasWanted);
            (0, chai_1.expect)(registeredSchema.rawLog).to.be.a('string');
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
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                schemaId,
            };
            const result = yield hypersignSchema.resolve(params);
            //console.log(JSON.stringify(result, null, 2))
            (0, chai_1.expect)(result).to.be.a('object');
            (0, chai_1.expect)(result.id).to.be.equal(schemaId);
            (0, chai_1.expect)(result.proof.verificationMethod).to.be.equal(verificationMethod);
            (0, chai_1.expect)(result.proof).to.be.a('object');
        });
    });
    it('should be able to resolve schema  even without offline signer passed to the constructor; making resolve RPC offchain activity', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const hypersignSchema = new index_1.HypersignSchema();
            const params = {
                schemaId,
            };
            const result = yield hypersignSchema.resolve(params);
            (0, chai_1.expect)(result).to.be.a('object');
            (0, chai_1.expect)(result.id).to.be.equal(schemaId);
            (0, chai_1.expect)(result.proof).to.be.a('object');
            if (result.proof) {
                (0, chai_1.expect)(result.proof.verificationMethod).to.be.equal(verificationMethod);
            }
        });
    });
});
