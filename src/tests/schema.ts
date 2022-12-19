import HyperSignSchema from '../schema/schema';
import HypersignDID from '../did/did';
import { should, expect } from 'chai';
const hypersignDid = new HypersignDID();
const hypersignSchema = new HyperSignSchema();
const seed = '';
let schemaSignature;
let privateKeyMultibase;
let publicKeyMultibase;
let didDocId;
let schemaId;
let schemaObject;
let didDocument;
let verificationMethod;
const schemaBody = {
  name: 'testSchema',
  description: 'This is a test schema generation',
  author: '',
  fields: [{ name: 'name', type: 'integer', isRequired: false }],
  additionalProperties: false,
};
describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
  it('should return publickeyMultibase and privateKeyMultibase', async function () {
    const result = await hypersignDid.generateKeys({ seed });
    privateKeyMultibase = result.privateKeyMultibase;
    publicKeyMultibase = result.publicKeyMultibase;
    expect(result).to.be.a('object');
    should().exist(result.privateKeyMultibase);
    should().exist(result.publicKeyMultibase);
  });
});
describe('#generate() method to generate did document', function () {
  it('should return didDocument', async function () {
    didDocument = await hypersignDid.generate({ publicKeyMultibase });
    didDocId = didDocument['id'];
    expect(didDocument).to.be.a('object');
    should().exist(didDocument['@context']);
    should().exist(didDocument['id']);
    should().exist(didDocument['controller']);
    should().exist(didDocument['alsoKnownAs']);
    verificationMethod = didDocument['verificationMethod'];
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
describe('#getSchema() method to create schema', function () {
  it('should not be able to create a new schema as author is not passed', function () {
    const tempSchemaBody = { ...schemaBody };
    return hypersignSchema.getSchema(tempSchemaBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Author must be passed');
    });
  });
  it('should able to create a new schema', async function () {
    const tempSchemaBody = { ...schemaBody };
    tempSchemaBody.author = didDocId;
    schemaObject = await hypersignSchema.getSchema(tempSchemaBody);
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

describe('#signSchema() method to sign schema', function () {
  it('should not be able to sign newly created schema as privateKey is not passed or empty', function () {
    return hypersignSchema.signSchema({ privateKey: '', schema: schemaObject }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: PrivateKey must be passed');
    });
  });
  it('should be able to sign newly created schema', async function () {
    const signedSchema = await hypersignSchema.signSchema({ privateKey: privateKeyMultibase, schema: schemaObject });
    schemaSignature = signedSchema;
    expect(signedSchema).to.be.a('string');
  });
});

describe('#registerSchema() method to register schema on blockchain', function () {
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
    return hypersignSchema.registerSchema(tempParam).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Schema must be passed');
    });
  });
  it('should not be able to register  newly created schema on blockchain as proof.created is null or empty', function () {
    const tempParam = { ...params };
    tempParam.schema = schemaObject;
    tempParam.proof.created = '';
    return hypersignSchema.registerSchema(tempParam).catch(function (err) {
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
    return hypersignSchema.registerSchema(tempParam).catch(function (err) {
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

    return hypersignSchema.registerSchema(tempParam).catch(function (err) {
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
    return hypersignSchema.registerSchema(tempParam).catch(function (err) {
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
    tempParam.proof.type = 'Ed25519Signature2020';
    return hypersignSchema.registerSchema(tempParam).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Proof must Contain verificationMethod');
    });
  });
  it('should not be able to register newly created schema on blockchain as wallet do not have balance', async function () {
    proof['created'] = schemaObject.authored;
    proof['proofValue'] = schemaSignature;
    proof['type'] = 'Ed25519Signature2020';
    proof['proofPurpose'] = 'assertion';
    proof['verificationMethod'] = verificationMethod;
    const schema = schemaObject;
    const params = { schema, proof };
    return hypersignSchema.registerSchema(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(TypeError, "Cannot read property 'signAndBroadcast' of undefined");
    });
  });
});
describe('#resolve() method to resolve schema', function () {
  it('should not be able to resolve schema as schemaId is not passed or it is null', async function () {
    const params = { schemaId: '' };
    return hypersignSchema.resolve(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: SchemaId must be passed');
    });
  });
  it("should not be able to resolve schema as hidClient can't be initialized", async function () {
    const params = { schemaId };
    return hypersignSchema.resolve(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'connect ECONNREFUSED 127.0.0.1:80');
    });
  });
});
