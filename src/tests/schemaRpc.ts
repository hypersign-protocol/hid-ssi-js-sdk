import { expect, should } from 'chai';
import { HypersignSSISdk } from '../index';
import { createWallet, mnemonic, hidNodeEp } from './config';
let hsSdk;
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let schemaSignature;
let schemaObject;
let schemaId;
let verificationMethod;
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
  hsSdk = new HypersignSSISdk(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
  await hsSdk.init();
});

describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
  it('should return publickeyMultibase and privateKeyMultibase', async function () {
    const kp = await hsSdk.did.generateKeys();
    privateKeyMultibase = kp.privateKeyMultibase;
    publicKeyMultibase = kp.publicKeyMultibase;
    expect(kp).to.be.a('object');
    should().exist(kp.privateKeyMultibase);
    should().exist(kp.publicKeyMultibase);
  });
});
describe('#generate() to generate did', function () {
  it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
    return hsSdk.did.generate({ publicKeyMultibase: '' }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
    });
  });
  it('should be able to generate didDocument', async function () {
    didDocument = await hsSdk.did.generate({ publicKeyMultibase });
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
    const result = await hsSdk.did.register({ didDocument, privateKeyMultibase, verificationMethodId });
    should().exist(result.code);
    should().exist(result.height);
    should().exist(result.rawLog);
    should().exist(result.transactionHash);
    should().exist(result.gasUsed);
    should().exist(result.gasWanted);
  });
});

describe('#getSchema() method to create schema', function () {
  it('should able to create a new schema', async function () {
    const tempSchemaBody = { ...schemaBody };
    tempSchemaBody.author = didDocId;
    schemaObject = await hsSdk.schema.getSchema(tempSchemaBody);
    schemaId = schemaObject['id'];
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
    const signedSchema = await hsSdk.schema.signSchema({ privateKey: privateKeyMultibase, schema: schemaObject });
    schemaSignature = signedSchema;
    expect(signedSchema).to.be.a('string');
  });
});
describe('#registerSchema() function to register schema on blockchain', function () {
  const schema = schemaObject;
  const proof = {
    type: 'Ed25519Signature2020',
    created: '',
    verificationMethod: '',
    proofValue: '',
    proofPurpose: 'assertion',
  };
  const params = { schema, proof };
  it('should not be able to register  newly created schema on blockchain as schema is not passed', function () {
    const tempParam = { ...params };
    tempParam.schema = undefined;
    tempParam.proof.created = '';
    return hsSdk.schema.registerSchema(tempParam).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Schema must be passed');
    });
  });
  it('should not be able to register  newly created schema on blockchain as proof.created is null or empty', function () {
    const tempParam = { ...params };
    tempParam.schema = schemaObject;
    tempParam.proof.created = '';
    return hsSdk.schema.registerSchema(tempParam).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain created');
    });
  });
  it('should not be able to register  newly created schema on blockchain as proof.proofPurpose is null or empty', async function () {
    const tempParam = { ...params };
    tempParam.schema = schemaObject;
    tempParam.proof.created = schemaObject.authored;
    tempParam.proof.proofPurpose = '';
    return hsSdk.schema.registerSchema(tempParam).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain proofPurpose');
    });
  });
  it('should not be able to register  newly created schema on blockchain as proof.proofValue is null or empty', async function () {
    const tempParam = { ...params };
    tempParam.schema = schemaObject;
    tempParam.proof.proofPurpose = 'assertion';
    tempParam.proof.created = schemaObject.authored;

    return hsSdk.schema.registerSchema(tempParam).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain proofValue');
    });
  });
  it('should not be able to register  newly created schema on blockchain as proof.type is null or empty', async function () {
    const tempParam = { ...params };
    tempParam.schema = schemaObject;
    tempParam.proof.created = schemaObject.authored;
    tempParam.proof.proofValue = schemaSignature;
    tempParam.proof.proofPurpose = 'assertion';
    tempParam.proof.type = '';
    return hsSdk.schema.registerSchema(tempParam).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain type');
    });
  });
  it('should not be able to register  newly created schema on blockchain as proof.verificationMethod is null or empty', async function () {
    const tempParam = { ...params };
    tempParam.schema = schemaObject;
    tempParam.proof.proofPurpose = 'assertion';
    tempParam.proof.created = schemaObject.authored;
    tempParam.proof.proofValue = schemaSignature;
    tempParam.proof.type = 'Ed25519VerificationKey2020';
    return hsSdk.schema.registerSchema(tempParam).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain verificationMethod');
    });
  });

  it('should be able to register schema on blockchain', async function () {
    const proof = {};
    proof['type'] = 'Ed25519Signature2020';
    proof['created'] = schemaObject.authored;
    proof['verificationMethod'] = didDocument['assertionMethod'][0];
    proof['proofValue'] = schemaSignature;
    proof['proofPurpose'] = 'assertion';
    const schema = schemaObject;
    const params = { schema, proof };
    const registeredSchema = await hsSdk.schema.registerSchema(params);
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
    return hsSdk.schema.resolve({ params: { schemaId: '' } }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: SchemaId must be passed');
    });
  });
  it('should be able to resolve schema', async function () {
    const params = {
      schemaId,
    };
    const result = await hsSdk.schema.resolve(params);
    expect(result).to.be.a('object');
    expect(result.id).to.be.equal(schemaId);
    expect(result.proof.verificationMethod).to.be.equal(verificationMethod);
    expect(result.proof).to.be.a('object');
  });
});
