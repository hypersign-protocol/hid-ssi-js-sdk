import { expect, should } from 'chai';
import { HypersignDID, HypersignSchema } from '../../index';
import { createWallet, mnemonic, hidNodeEp } from '../config';
import { CredentialSchemaState as Schema } from '../../../libs/generated/ssi/credential_schema';
import { DocumentProof as SchemaProof } from '../../../libs/generated/ssi/proof';


let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let hypersignSchema;
let schemaObject;
let schemaId;
let verificationMethod;
let hypersignDID;
let signedSchema;
const signSchema = {} as Schema;
signSchema['proof'] = {} as SchemaProof;
const schemaBody = {
  name: 'TestSchema',
  description: 'This is a test schema generation',
  author: '',
  fields: [{ name: 'name', type: 'string', isRequired: false }],
  additionalProperties: false,
};

//add mnemonic of wallet that have balance

beforeEach(async function () {
  offlineSigner = await createWallet(mnemonic);

  hypersignSchema = new HypersignSchema({
    // entityApiSecretKey,
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
    should().exist(result.transactionHash);
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

  it('should able to create a new schema without offlinesigner', async function () {
    const tempSchemaBody = { ...schemaBody };
    tempSchemaBody.author = didDocId;
    const hypersignSchema = new HypersignSchema()
    const schemaDoc = await hypersignSchema.generate(tempSchemaBody);
    expect(schemaDoc).to.be.a('object');
    should().exist(schemaDoc['type']);
    should().exist(schemaDoc['modelVersion']);
    should().exist(schemaDoc['id']);
    should().exist(schemaDoc['name']);
    should().exist(schemaDoc['author']);
    should().exist(schemaDoc['authored']);
    should().exist(schemaDoc['schema']);
    expect(schemaDoc.schema).to.be.a('object');
    expect(schemaDoc['name']).to.be.equal(tempSchemaBody.name);
    expect(schemaDoc['author']).to.be.equal(tempSchemaBody.author);
  });
  it('should able to create a new schema', async function () {
    const tempSchemaBody = { ...schemaBody };
    tempSchemaBody.author = didDocId;
    schemaObject = await hypersignSchema.generate(tempSchemaBody);
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
    signedSchema = await hypersignSchema.sign({
      privateKeyMultibase: privateKeyMultibase,
      schema: schemaObject,
      verificationMethodId: didDocument['assertionMethod'][0],
    });
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
  it('Should not be able to register schema as schema is not passed in params', async () => {
    const params = {
      schemas: signedSchema
    }
    return hypersignSchema.register(params).catch(function (err) {
      expect(function () {
        throw err
      }).to.throw(Error, 'HID-SSI-SDK:: Error: schema must be passed')
    })
  })
  it('Should not be able to register schema as schema object does not have proof field', async () => {
    const tempSchemaDetail = { ...signedSchema }
    delete tempSchemaDetail.proof
    return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
      expect(function () {
        throw err
      }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must be passed')
    })
  })
  it('Should not be able to register schema as schema proof does not have "created" field or it is empty ', async () => {
    const tempSchemaDetail = JSON.parse(JSON.stringify({ ...signedSchema }))
    tempSchemaDetail.proof.created = ""
    return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
      expect(function () {
        throw err
      }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain created')
    })
  })
  it('Should not be able to register schema as schema proof does not have "proofPurpose" field or it is empty ', async () => {
    const tempSchemaDetail = JSON.parse(JSON.stringify({ ...signedSchema }))
    tempSchemaDetail.proof.proofPurpose = ""
    return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
      expect(function () {
        throw err
      }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain proofPurpose')
    })
  })
  it('Should not be able to register schema as schema proof does not have "proofValue" field or it is empty ', async () => {
    const tempSchemaDetail = JSON.parse(JSON.stringify({ ...signedSchema }))
    tempSchemaDetail.proof.proofValue = ""
    return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
      expect(function () {
        throw err
      }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain proofValue')
    })
  })
  it('Should not be able to register schema as schema proof does not have "type" field or it is empty ', async () => {
    const tempSchemaDetail = JSON.parse(JSON.stringify({ ...signedSchema }))
    tempSchemaDetail.proof.type = ""
    return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
      expect(function () {
        throw err
      }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain type')
    })
  })
  it('Should not be able to register schema as schema proof does not have "verificationMethod" field or it is empty ', async () => {
    const tempSchemaDetail = JSON.parse(JSON.stringify({ ...signedSchema }))
    tempSchemaDetail.proof.verificationMethod = ""
    return hypersignSchema.register({ schema: tempSchemaDetail }).catch(function (err) {
      expect(function () {
        throw err
      }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain verificationMethod')
    })
  })
  it('should be able to register schema on blockchain', async function () {
    const registeredSchema = await hypersignSchema.register({
      schema: signedSchema,
    });
    should().exist(registeredSchema.transactionHash);
  });
  it('should not be able to register schema on blockchain as its already registered', async function () {
    return hypersignSchema.register({
      schema: signedSchema,
    }).catch(function (err) {
      expect(function () {
        throw err
      }).to.throw(Error, `failed to execute message; message index: 0: Schema ID:  ${schemaId}: schema already exists`)
    })
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
    expect(result).to.be.a('object');
    should().exist(result.type)
    expect(result.type).to.be.a('string')
    should().exist(result.modelVersion)
    expect(result.modelVersion).to.be.a('string')
    should().exist(result.id)
    expect(result.id).to.be.a('string')
    expect(result.id).to.be.equal(schemaId);
    expect(result.name).to.be.a('string')
    should().exist(result.name)
    should().exist(result.author)
    expect(result.author).to.be.a('string')
    should().exist(result.authored)
    expect(result.authored).to.be.a('string')
    should().exist(result.schema)
    expect(result.schema).to.be.a('object')
    should().exist(result.proof)
    expect(result.proof).to.be.a('object')
    expect(result.proof.verificationMethod).to.be.equal(verificationMethod);
    expect(result.proof).to.be.a('object');
  });

  it('should be able to resolve schema  even without offline signer passed to the constructor; making resolve RPC offchain activity', async function () {
    const hypersignSchema = new HypersignSchema();
    const params = {
      schemaId,
    };
    const result = await hypersignSchema.resolve(params);
    expect(result).to.be.a('object');
    expect(result.id).to.be.equal(schemaId);
    expect(result.proof).to.be.a('object');
    if (result.proof) {
      expect(result.proof.verificationMethod).to.be.equal(verificationMethod);
    }
  });
});
