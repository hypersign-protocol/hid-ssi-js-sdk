import { expect, should } from 'chai';
import { HypersignDID, HypersignSchema } from '../../index';
import { createWallet, mnemonic, hidNodeEp } from '../config';
import { CredentialSchemaState as Schema } from '../../../libs/generated/ssi/credential_schema';
import { DocumentProof as SchemaProof } from '../../../libs/generated/ssi/proof';

let signedSchema2;
let invalidSchemaNamedSignedSchema1
let invalidSchemaNamedSignedSchema2
let invalidSchemaNamedSignedSchema3

let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let hypersignSchema;
let schemaObject;
let schemaObject2
let schemaId;
let verificationMethod;
let randomProperty
let hypersignDID;
let signedSchema;
const signSchema = {} as Schema;
signSchema['proof'] = {} as SchemaProof;
const schemaBody = {
  name: 'TestSchema',
  description: 'This is a test schema generation',
  author: '',
  fields: [{ name: 'name', type: 'string', isRequired: true }] as any,
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

  it('should not be able to create a new schema as schema name is in camelCase and only pascalCase is allowed', function () {
    const tempSchemaBody = { ...schemaBody };
    tempSchemaBody.author = didDocId;
    tempSchemaBody['name'] = 'testSchema'
    return hypersignSchema.generate(tempSchemaBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: schema name should always be in PascalCase');
    });
  });

  it('should not be able to create a schema as schema name is in snakeCase and only pascalCase is allowed', function () {
    const tempSchemaBody = { ...schemaBody };
    tempSchemaBody.author = didDocId;
    tempSchemaBody['name'] = 'testing_schema'
    return hypersignSchema.generate(tempSchemaBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: schema name should always be in PascalCase');
    });
  });
  it('should not be able to create a schema as schema name is not in  pascalCase', function () {
    const tempSchemaBody = { ...schemaBody };
    tempSchemaBody.author = didDocId;
    tempSchemaBody['name'] = 'Test credential Schema'
    return hypersignSchema.generate(tempSchemaBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: schema name should always be in PascalCase');
    });
  });
  it("should not be able to create a schema as sub-property 'name' is not present in field property", function () {
    const tempSchemaBody = { ...schemaBody };
    tempSchemaBody.author = didDocId;
    tempSchemaBody['fields'] = [{ isRequired: true }]
    return hypersignSchema.generate(tempSchemaBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, "HID-SSI-SDK:: Error: All fields must contains property 'name'");
    });
  });

  it('should be able to create a new schema without offlinesigner', async function () {
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
  it('should be able to create a new schema', async function () {
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
  it('should be able to create a schema with differnt field value', async function () {
    const tempSchemaBody = { ...schemaBody };
    tempSchemaBody.fields.push({ name: 'address', type: 'string', isRequired: false })
    tempSchemaBody.author = didDocId;
    schemaObject2 = await hypersignSchema.generate(tempSchemaBody);
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
// dont allow fields other than { name: 'name', type: 'string', isRequired: false }
describe('#sign() function to sign schema', function () {
  it('should not be able to sign a new schema as privateKeyMultibase is not passed', function () {
    return hypersignSchema.sign({
      privateKeyMultibase: "",
      schema: schemaObject,
      verificationMethodId: didDocument['assertionMethod'][0]
    }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase must be passed');
    });
  });
  it('should not be able to sign a new schema as verificationMethodId is not passed', function () {
    return hypersignSchema.sign({
      privateKeyMultibase,
      schema: schemaObject,
      verificationMethodId: ""
    }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId must be passed');
    });
  });
  it('should not be able to sign a new schema as schema is not passed', function () {
    return hypersignSchema.sign({
      privateKeyMultibase,
      verificationMethodId: didDocument['assertionMethod'][0]
    }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Schema must be passed');
    });
  });
  it('should be able to sign newly created schema', async function () {
    const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject))
    signedSchema = await hypersignSchema.sign({
      privateKeyMultibase: privateKeyMultibase,
      schema: tempSchemaBody,
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
  it('should be able to sign newly created schema with schema name is in camelCase', async function () {
    const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject2))
    tempSchemaBody['name'] = "testSchema"
    invalidSchemaNamedSignedSchema1 = await hypersignSchema.sign({
      privateKeyMultibase: privateKeyMultibase,
      schema: tempSchemaBody,
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
  it('should be able to sign newly created schema with schema name is in snakeCase', async function () {
    const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject2))
    tempSchemaBody['name'] = "test_schema"
    invalidSchemaNamedSignedSchema2 = await hypersignSchema.sign({
      privateKeyMultibase: privateKeyMultibase,
      schema: tempSchemaBody,
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
  it('should be able to sign newly created schema with schema name is in sentanceCase', async function () {
    const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject2))
    tempSchemaBody['name'] = "Test Schema"
    invalidSchemaNamedSignedSchema3 = await hypersignSchema.sign({
      privateKeyMultibase: privateKeyMultibase,
      schema: tempSchemaBody,
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
  it('should be able to sign newly created schema with invalid sub-property of propert field', async function () {
    const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject2))
    const prop = JSON.parse(tempSchemaBody.schema.properties)
    randomProperty = "randomProperty"
    prop[`${schemaBody.fields[0].name}`]['randomProperty'] = "xyz"
    tempSchemaBody['schema'].properties = JSON.stringify(prop)
    signedSchema2 = await hypersignSchema.sign({
      privateKeyMultibase: privateKeyMultibase,
      schema: tempSchemaBody,
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
  it('should not be able to register schema as schema name is in camel case which is not valid', async function () {
    return hypersignSchema.register({
      schema: invalidSchemaNamedSignedSchema1,
    }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, `failed to execute message; message index: 0: name must always be in PascalCase: ${invalidSchemaNamedSignedSchema1.name}: invalid credential schema`)
    })
  });

  it('should not be able to register schema as schema name is in snake case which is not valid', async function () {
    return hypersignSchema.register({
      schema: invalidSchemaNamedSignedSchema2,
    }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, `failed to execute message; message index: 0: name must always be in PascalCase: ${invalidSchemaNamedSignedSchema2.name}: invalid credential schema`)
    })
  });
  it('should not be able to register schema as schema name is in sentance case which is not valid', async function () {
    return hypersignSchema.register({
      schema: invalidSchemaNamedSignedSchema3,
    }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, `failed to execute message; message index: 0: name must always be in PascalCase: ${invalidSchemaNamedSignedSchema3.name}: invalid credential schema`)
    })
  });
  it('should not be able to register schema as there is a invalid sub-property in side property field', async function () {
    return hypersignSchema.register({
      schema: signedSchema2,
    }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, `failed to execute message; message index: 0: invalid \`property\` provided: invalid sub-attribute ${randomProperty} of attribute name. Only \`type\` and \`format\` sub-attributes are permitted: invalid credential schema`)
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
