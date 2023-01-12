import { expect, should } from 'chai';
import { HypersignSSISdk, HypersignDID, HypersignSchema } from '../index';
import { createWallet, mnemonic, hidNodeEp } from './config';
import { Schema, SchemaProof, SchemaDocument } from '../../libs/generated/ssi/schema';
import { cosmjsSalt } from '@cosmjs/amino/build/wallet';

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
const signSchema = {} as Schema;
signSchema.proof = {} as SchemaProof;
const schemaBody = {
  name: 'testSchema',
  description: 'This is a test schema generation',
  author: '',
  fields: [{ name: 'name', type: 'integer', isRequired: false }],
  additionalProperties: false,
};

//add mnemonic of wallet that have balance

beforeEach(async function () {
  offlineSigner = await createWallet(mnemonic);
  // hsSdk = new HypersignSSISdk(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
  // await hsSdk.init();

  hypersignSchema = new HypersignSchema({
    offlineSigner,
    nodeRestEndpoint: hidNodeEp.rest,
    nodeRpcEndpoint: hidNodeEp.rpc,
    namespace: hidNodeEp.namespace,
  });
  await hypersignSchema.init();

  hypersignDID = new HypersignDID({
    offlineSigner,
    nodeRestEndpoint: hidNodeEp.rest,
    nodeRpcEndpoint: hidNodeEp.rpc,
    namespace: hidNodeEp.namespace,
  });
  await hypersignDID.init();
});

describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
  it('should return publickeyMultibase and privateKeyMultibase', async function () {
    const kp = await hypersignDID.generateKeys();
    privateKeyMultibase = kp.privateKeyMultibase;
    publicKeyMultibase = kp.publicKeyMultibase;
    expect(kp).to.be.a('object');
    should().exist(kp.privateKeyMultibase);
    should().exist(kp.publicKeyMultibase);
  });
});
describe('#generate() to generate did', function () {
  it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
    return hypersignDID.generate({ publicKeyMultibase: '' }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
    });
  });
  it('should be able to generate didDocument', async function () {
    didDocument = await hypersignDID.generate({ publicKeyMultibase });
    didDocId = didDocument['id'];
    verificationMethod = didDocument['assertionMethod'][0];
    verificationMethodId = didDocument['verificationMethod'][0].id;
    expect(didDocument).to.be.a('object');
    should().exist(didDocument['@context']);
    should().exist(didDocument['id']);
    should().exist(didDocument['controller']);
    should().exist(didDocument['alsoKnownAs']);

    should().exist(didDocument['verificationMethod']);
    expect(
      didDocument['verificationMethod'] &&
        didDocument['authentication'] &&
        didDocument['assertionMethod'] &&
        didDocument['keyAgreement'] &&
        didDocument['capabilityInvocation'] &&
        didDocument['capabilityDelegation'] &&
        didDocument['service']
    ).to.be.a('array');
    should().exist(didDocument['authentication']);
    should().exist(didDocument['assertionMethod']);
    should().exist(didDocument['keyAgreement']);
    should().exist(didDocument['capabilityInvocation']);
    should().exist(didDocument['capabilityDelegation']);
    should().exist(didDocument['service']);
  });
});

describe('#register() this is to register did on the blockchain', function () {
  it('should be able to register didDocument in the blockchain', async function () {
    const result = await hypersignDID.register({ didDocument, privateKeyMultibase, verificationMethodId });
    should().exist(result.code);
    should().exist(result.height);
    should().exist(result.rawLog);
    should().exist(result.transactionHash);
    should().exist(result.gasUsed);
    should().exist(result.gasWanted);
  });
});

describe('#generate() method to create schema', function () {
  it('should not be able to create a new schema as author is not passed', function () {
    const tempSchemaBody = { ...schemaBody };
    return hypersignSchema.generate(tempSchemaBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Author must be passed');
    });
  });

  it('should able to create a new schema', async function () {
    const tempSchemaBody = { ...schemaBody };
    tempSchemaBody.author = didDocId;
    schemaObject = await hypersignSchema.generate(tempSchemaBody);
    schemaId = schemaObject['id'];
    //console.log(JSON.stringify(schemaObject, null, 2));
    expect(schemaObject).to.be.a('object');
    should().exist(schemaObject['type']);
    should().exist(schemaObject['modelVersion']);
    should().exist(schemaObject['id']);
    should().exist(schemaObject['name']);
    should().exist(schemaObject['author']);
    should().exist(schemaObject['authored']);
    should().exist(schemaObject['schema']);
    expect(schemaObject.schema).to.be.a('object');
    expect(schemaObject['name']).to.be.equal(tempSchemaBody.name);
    expect(schemaObject['author']).to.be.equal(tempSchemaBody.author);
  });
});

describe('#sign() function to sign schema', function () {
  it('should be able to sign newly created schema', async function () {
    signedSchema = await hypersignSchema.sign({
      privateKeyMultibase: privateKeyMultibase,
      schema: schemaObject,
      verificationMethodId: didDocument['assertionMethod'][0],
    });
    //onsole.log(JSON.stringify(signedSchema, null, 2))
    expect(signedSchema).to.be.a('object');
    should().exist(signedSchema.proof);
    should().exist(signedSchema.proof.type);
    should().exist(signedSchema.proof.verificationMethod);
    should().exist(signedSchema.proof.proofPurpose);
    should().exist(signedSchema.proof.proofValue);
    should().exist(signedSchema.proof.created);
    should().exist(signedSchema.type);
    should().exist(signedSchema.modelVersion);
    should().exist(signedSchema.author);
    should().exist(signedSchema['id']);
    should().exist(signedSchema['name']);
    should().exist(signedSchema['author']);
    should().exist(signedSchema['authored']);
    should().exist(signedSchema['schema']);
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

  it('should be able to register schema on blockchain', async function () {
    const registeredSchema = await hypersignSchema.register({
      schema: signedSchema,
    });
    //console.log(JSON.stringify(registeredSchema, null, 2))
    expect(registeredSchema).to.be.a('object');
    should().exist(registeredSchema.code);
    should().exist(registeredSchema.height);
    should().exist(registeredSchema.rawLog);
    should().exist(registeredSchema.transactionHash);
    should().exist(registeredSchema.gasUsed);
    should().exist(registeredSchema.gasWanted);
    expect(registeredSchema.rawLog).to.be.a('string');
  });
});

describe('#resolve() this is to resolve schema', function () {
  it('should not able to resolve schema and throw error didDocId is not passed', function () {
    return hypersignSchema.resolve({ params: { schemaId: '' } }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: SchemaId must be passed');
    });
  });
  it('should be able to resolve schema', async function () {
    const params = {
      schemaId,
    };
    const result = await hypersignSchema.resolve(params);
    //console.log(JSON.stringify(result, null, 2))

    expect(result).to.be.a('object');
    expect(result.id).to.be.equal(schemaId);
    expect(result.proof.verificationMethod).to.be.equal(verificationMethod);
    expect(result.proof).to.be.a('object');
  });
});
