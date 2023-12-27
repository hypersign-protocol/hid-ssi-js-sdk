import { HypersignSSISdk } from '../../../index';
import { expect, should } from 'chai';
import { createWallet, mnemonic, hidNodeEp } from '../../config';
let issuerPrivateKeyMultibase;
let issuerPublicKeyMultibase;
let holderPrivateKeyMultibase;
let holderPublicKeyMultibase;
let offlineSigner;
let hsSdk;
let credentialDetail3;
let issuedCredResult2;
let issuedCredResult;
let credentialStatusId;
const credentialTransMessage = [] as any
let credentialDetail2
let credenStatus;
let verificationMethod;
let schemaObject;
let signedSchema;
let schemaId;
let subjectDid;
let issuerDid;
let issuerDidDoc;
let subjectDidDoc;
let credentialDetail;
let credentialId;
let signedVC;
let selectiveDisclosure;
let credentialStatus2;
let credentialStatusProof2;
let signedVC1;
const issueCredentialBody = {
  credential: credentialDetail,
  issuerDid,
  verificationMethodId: '',
  privateKeyMultibase: issuerPrivateKeyMultibase,
  registerCredential: true,
};
const schemaBody = {
  name: 'TestSchema',
  description: 'This is a test schema generation',
  author: '',
  fields: [
    { name: 'name', type: 'string', isRequired: false },
    { name: 'address', type: 'string', isRequired: true },
  ],
  additionalProperties: false,
};
const credentialBody = {
  schemaId: '',
  subjectDid: '',
  type: [],
  issuerDid: '',
  fields: { name: 'Varsha', address: 'Random address' },
  expirationDate: '',
};
beforeEach(async function () {
  offlineSigner = await createWallet(mnemonic);
  const params = {
    offlineSigner,
    nodeRestEndpoint: hidNodeEp.rest,
    nodeRpcEndpoint: hidNodeEp.rpc,
    namespace: hidNodeEp.namespace,
  };
  hsSdk = new HypersignSSISdk(params);
  await hsSdk.init();
});

describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
  it('should return publickeyMultibase and privateKeyMultibase', async function () {
    const kp = await hsSdk.did.bjjDID.generateKeys();
    issuerPrivateKeyMultibase = kp.privateKeyMultibase;
    issuerPublicKeyMultibase = kp.publicKeyMultibase;
    expect(kp).to.be.a('object');
    should().exist(kp.privateKeyMultibase);
    should().exist(kp.publicKeyMultibase);
    should().not.exist(kp.id);
  });
});
describe('DID Operation', () => {
  describe('#generate() method to generate new did', function () {
    it('should be able to generate a issuer did using babyJubJub', async () => {
      issuerDidDoc = await hsSdk.did.bjjDID.generate({
        publicKeyMultibase: issuerPublicKeyMultibase,
      });
      issuerDid = issuerDidDoc.id;
      verificationMethod = issuerDidDoc.verificationMethod;
      expect(issuerDidDoc).to.be.a('object');
      should().exist(issuerDidDoc['@context']);
      should().exist(issuerDidDoc['id']);
      should().exist(issuerDidDoc['controller']);
      should().exist(issuerDidDoc['verificationMethod']);
      expect(
        issuerDidDoc['verificationMethod'] &&
          issuerDidDoc['authentication'] &&
          issuerDidDoc['assertionMethod'] &&
          issuerDidDoc['keyAgreement'] &&
          issuerDidDoc['capabilityInvocation'] &&
          issuerDidDoc['capabilityDelegation'] &&
          issuerDidDoc['service']
      ).to.be.a('array');
      expect(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
      should().exist(issuerDidDoc['authentication']);
      should().exist(issuerDidDoc['assertionMethod']);
      should().exist(issuerDidDoc['keyAgreement']);
      should().exist(issuerDidDoc['capabilityInvocation']);
      should().exist(issuerDidDoc['capabilityDelegation']);
      should().exist(issuerDidDoc['service']);
      expect(issuerDidDoc['authentication'].length).to.be.greaterThan(0);
      expect(issuerDidDoc['assertionMethod'].length).to.be.greaterThan(0);
      expect(issuerDidDoc['capabilityInvocation'].length).to.be.equal(0);
      expect(issuerDidDoc['capabilityDelegation'].length).to.be.equal(0);
      expect(issuerDidDoc['keyAgreement'].length).to.be.equal(0);
      expect(issuerDidDoc['service'].length).to.be.equal(0);
    });
    it('should be able to genrate a did for holder', async () => {
      const kp = await hsSdk.did.bjjDID.generateKeys();
      holderPrivateKeyMultibase = kp.privateKeyMultibase;
      holderPublicKeyMultibase = kp.publicKeyMultibase;
      subjectDidDoc = await hsSdk.did.bjjDID.generate({
        publicKeyMultibase: holderPublicKeyMultibase,
      });
      subjectDid = subjectDidDoc.id;
    });
  });
  describe('#register() method to register did', function () {
    it('should be able to register did generated using BabyJubJubKey', async () => {
      const registerDid = await hsSdk.did.bjjDID.register({
        didDocument: issuerDidDoc,
        privateKeyMultibase: issuerPrivateKeyMultibase,
        verificationMethodId: verificationMethod[0].id,
      });
      issuerDidDoc = registerDid.didDocument;
      expect(issuerDidDoc).to.be.a('object');
      should().exist(issuerDidDoc['@context']);
      should().exist(issuerDidDoc['id']);
      should().exist(issuerDidDoc['controller']);
      should().exist(issuerDidDoc['verificationMethod']);
      expect(
        issuerDidDoc['verificationMethod'] &&
          issuerDidDoc['authentication'] &&
          issuerDidDoc['assertionMethod'] &&
          issuerDidDoc['keyAgreement'] &&
          issuerDidDoc['capabilityInvocation'] &&
          issuerDidDoc['capabilityDelegation'] &&
          issuerDidDoc['service']
      ).to.be.a('array');
      expect(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
      should().exist(issuerDidDoc['authentication']);
      should().exist(issuerDidDoc['assertionMethod']);
      should().exist(issuerDidDoc['keyAgreement']);
      should().exist(issuerDidDoc['capabilityInvocation']);
      should().exist(issuerDidDoc['capabilityDelegation']);
      should().exist(issuerDidDoc['service']);
      expect(issuerDidDoc['authentication'].length).to.be.greaterThan(0);
      expect(issuerDidDoc['assertionMethod'].length).to.be.greaterThan(0);
      expect(issuerDidDoc['capabilityInvocation'].length).to.be.equal(0);
      expect(issuerDidDoc['capabilityDelegation'].length).to.be.equal(0);
      expect(issuerDidDoc['keyAgreement'].length).to.be.equal(0);
      expect(issuerDidDoc['service'].length).to.be.equal(0);
      should().exist(registerDid.transactionHash);
    });
    it('should be able to register did for holder', async () => {
      const registerDid = await hsSdk.did.bjjDID.register({
        didDocument: subjectDidDoc,
        privateKeyMultibase: holderPrivateKeyMultibase,
        verificationMethodId: subjectDidDoc.verificationMethod[0].id,
      });
      subjectDidDoc = registerDid.didDocument;
    });
  });
});

describe('Schema Operations', () => {
  describe('#generate() method to create schema', function () {
    it('should be able to generate new schema', async function () {
      const tempSchemaBody = { ...schemaBody };
      tempSchemaBody.author = issuerDid;
      schemaObject = await hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody);
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
      expect(schemaObject['schema'].required).to.be.a('array');
    });
  });

  describe('#sign() method to sign a schema', function () {
    it('should be able to sign newly created schema', async () => {
      signedSchema = await await hsSdk.schema.hypersignBjjschema.sign({
        privateKeyMultibase: issuerPrivateKeyMultibase,
        schema: schemaObject,
        verificationMethodId: issuerDidDoc['assertionMethod'][0],
      });
      expect(signedSchema).to.be.a('object');
      should().exist(signedSchema.type);
      should().exist(signedSchema.modelVersion);
      should().exist(signedSchema['id']);
      should().exist(signedSchema['name']);
      should().exist(signedSchema['author']);
      should().exist(signedSchema['authored']);
      should().exist(signedSchema['schema']);
      should().exist(signedSchema.schema.schema);
      should().exist(signedSchema.schema.description);
      should().exist(signedSchema.schema.type);
      should().exist(signedSchema.schema.properties);
      should().exist(signedSchema.schema.required);
      should().exist(signedSchema.proof);
      should().exist(signedSchema.proof.type);
      expect(signedSchema.proof.type).to.be.equal('BJJSignature2021');
      should().exist(signedSchema.proof.created);
      should().exist(signedSchema.proof.verificationMethod);
      should().exist(signedSchema.proof.proofPurpose);
      expect(signedSchema.proof.proofPurpose).to.be.equal('assertionMethod');
      should().exist(signedSchema.proof.proofValue);
    });
  });

  describe('#register() method to register a schema', function () {
    it('should be able to register newly created schema', async () => {
      const registerdSchema = await hsSdk.schema.hypersignBjjschema.register({ schema: signedSchema });
      should().exist(registerdSchema.transactionHash);
    });
  });

  describe('#resolve() method to resolve a schema', function () {
    it('Should be able to resolve schema from blockchain', async () => {
      const resolvedSchema = await hsSdk.schema.hypersignBjjschema.resolve({ schemaId });
      should().exist(resolvedSchema.context);
      should().exist(resolvedSchema.type);
      should().exist(resolvedSchema.modelVersion);
      should().exist(resolvedSchema.id);
      should().exist(resolvedSchema.name);
      should().exist(resolvedSchema.author);
      should().exist(resolvedSchema.authored);
      should().exist(resolvedSchema.schema);
      should().exist(resolvedSchema.schema.schema);
      should().exist(resolvedSchema.schema.description);
      should().exist(resolvedSchema.schema.type);
      should().exist(resolvedSchema.schema.properties);
      should().exist(resolvedSchema.schema.required);
      should().exist(resolvedSchema.schema.additionalProperties);
      should().exist(resolvedSchema.proof);
      should().exist(resolvedSchema.proof.type);
      should().exist(resolvedSchema.proof.created);
      should().exist(resolvedSchema.proof.verificationMethod);
      should().exist(resolvedSchema.proof.proofPurpose);
      should().exist(resolvedSchema.proof.proofValue);
      should().exist(resolvedSchema.proof.clientSpecType);
      expect(resolvedSchema.proof.clientSpecType).to.be.equal('CLIENT_SPEC_TYPE_NONE');
    });
  });
});

describe('Credential Operation', () => {
  describe('#generate() method to generate a credential', function () {
    it('should not be able to generate new credential for a schema as both subjectDid and subjectDidDocSigned is passed', async function () {
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.issuerDid = issuerDid;
      tempCredentialBody.subjectDid = subjectDid;
      tempCredentialBody['subjectDidDocSigned'] = subjectDidDoc;
      return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: Both subjectDid and subjectDidDoc cannot be passed');
      });
    });
    it('should not be able to generate new credential for a schema as not able to resolve subjectDid or subjectDidDoc as  neither subjectDid nor subjectDidDocSigned is passed', async function () {
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.issuerDid = issuerDid;
      return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: Could not resolve the subjectDid or subjectDidDoc');
      });
    });
    it('should not be able to generate new credential for a schema as nether schemaId nor schema Context is passed', async function () {
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.issuerDid = issuerDid;
      tempCredentialBody['subjectDidDocSigned'] = subjectDidDoc;
      return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'schemaId is required when schemaContext and type not passed');
      });
    });
    it('should not be able to generate new credential for a schema as wrong issuer did is passed', async function () {
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.issuerDid = issuerDid + 'xyz';
      tempCredentialBody['subjectDidDocSigned'] = subjectDidDoc;
      return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          `HID-SSI-SDK:: Error: Could not fetch issuer did doc, issuer did = ${tempCredentialBody.issuerDid}`
        );
      });
    });
    it('should not be able to generate new credential for a schema as not able to get subject did doc based on subjectDid passed', async function () {
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.issuerDid = issuerDid;
      tempCredentialBody['subjectDid'] = subjectDid;
      return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          `HID-SSI-SDK:: Error: Could not fetch subject did doc, subject did ${tempCredentialBody.subjectDid}`
        );
      });
    });
    it('should not be able to generate new credential for a schema as expiration date is passed in wrong format', async function () {
      const todaysDate = new Date();
      const tempExpirationDate = todaysDate.setDate(todaysDate.getDate() + 2);
      const expirationDate = tempExpirationDate.toString();
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody['subjectDidDocSigned'] = subjectDidDoc;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = issuerDid;
      return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'Invalid time value');
      });
    });
    it('should not be able to generate new credential for a schema as additional properties in schema is set to false but sending additional properties in field value at the time of generating credential', async function () {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody['subjectDidDocSigned'] = subjectDidDoc;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = issuerDid;
      tempCredentialBody.fields['type'] = 'string';
      tempCredentialBody.fields['value'] = 'Varsha';
      tempCredentialBody.fields['name'] = 'name';
      return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          `Only ["${schemaBody.fields[0].name}"] attributes are possible. additionalProperties is false in the schema`
        );
      });
    });
    it('should be able to generate a credential', async () => {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.subjectDid = subjectDid;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = issuerDid;
      tempCredentialBody.fields = { name: 'varsha', address: 'random address' };
      credentialDetail = await hsSdk.vc.bjjVC.generate(tempCredentialBody);
      expect(credentialDetail).to.be.a('object');
      should().exist(credentialDetail['@context']);
      should().exist(credentialDetail['id']);
      credentialId = credentialDetail.id;
      should().exist(credentialDetail['type']);
      should().exist(credentialDetail['issuanceDate']);
      should().exist(credentialDetail['issuer']);
      should().exist(credentialDetail['credentialSubject']);
      should().exist(credentialDetail['credentialStatus']);
      expect(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
    });
    it('should be able to generate new credential for testing bulk registration', async function () {
      const expirationDate = new Date('11/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.subjectDid = subjectDid;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = issuerDid;
      tempCredentialBody['fields'] = { name: 'varsha', address: "random address" };
      credentialDetail2 = await hsSdk.vc.bjjVC.generate(tempCredentialBody);
      expect(credentialDetail).to.be.a('object');
      should().exist(credentialDetail['@context']);
      should().exist(credentialDetail['id']);
      should().exist(credentialDetail['type']);
      should().exist(credentialDetail['issuanceDate']);
      should().exist(credentialDetail['issuer']);
      should().exist(credentialDetail['credentialSubject']);
      should().exist(credentialDetail['credentialSchema']);
      should().exist(credentialDetail['credentialStatus']);
      expect(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
    });
    it('should be able to generate new credential even without offlinesigner passed to constructor to test bulkRegistration', async function () {
      const expirationDate = new Date('11/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.subjectDid = subjectDid;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = issuerDid;
      tempCredentialBody.fields = { name: 'varsha', address: 'random address' };
      credentialDetail3 = await await hsSdk.vc.bjjVC.generate(tempCredentialBody);
      expect(credentialDetail).to.be.a('object');
      should().exist(credentialDetail['@context']);
      should().exist(credentialDetail['id']);
      should().exist(credentialDetail['type']);
      should().exist(credentialDetail['issuanceDate']);
      should().exist(credentialDetail['issuer']);
      should().exist(credentialDetail['credentialSubject']);
      should().exist(credentialDetail['credentialSchema']);
      should().exist(credentialDetail['credentialStatus']);
      expect(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
    });
  });
  describe('#issueCredential() method for issuing credential', function () {
    it('should not be able to issueCredential as verificationMethodId is null or empty', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = issuerDid;
      tempIssueCredentialBody.verificationMethodId = '';
      tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
      return await hsSdk.vc.bjjVC.issue(tempIssueCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to issue credential');
      });
    });
    it('should not be able to issueCredential as credentialObject is null or undefined', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = undefined;
      tempIssueCredentialBody.issuerDid = issuerDid;
      tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
      tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
      return await hsSdk.vc.bjjVC.issue(tempIssueCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credential is required to issue credential');
      });
    });
    it('should not be able to issueCredential as privateKey is null or empty', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = issuerDid;
      tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
      tempIssueCredentialBody.privateKeyMultibase = '';
      return await hsSdk.vc.bjjVC.issue(tempIssueCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to issue credential');
      });
    });
    it('should not be able to issueCredential as issuerDid is null or empty', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = '';
      tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
      tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
      return await hsSdk.vc.bjjVC.issue(tempIssueCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to issue credential');
      });
    });
    it('should be able to issue credential with credential status registered on chain', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = issuerDid;
      tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
      tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
      const issuedCredResult = await hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
      const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } =
        issuedCredResult;
        signedVC={}
      Object.assign(signedVC, signedCredential);
      signedVC1 = signedCredential;
      credenStatus = credentialStatus;
      credentialId = signedVC.id;
      credentialStatusId = signedCredential['credentialStatus'].id;
      expect(signedCredential).to.be.a('object');
      should().exist(signedCredential['@context']);
      should().exist(signedCredential['id']);
      should().exist(signedCredential['type']);
      should().exist(signedCredential['issuanceDate']);
      should().exist(signedCredential['issuer']);
      should().exist(signedCredential['credentialSubject']);
      should().exist(signedCredential['credentialSchema']);
      should().exist(signedCredential['credentialStatus']);
      should().exist(signedCredential['proof']);
      expect(signedCredential['id']).to.be.equal(tempIssueCredentialBody.credential.id);
      expect(credentialStatus).to.be.a('object');
      should().exist(credentialStatus['@context']);
      should().exist(credentialStatus['id']);
      should().exist(credentialStatus['issuer']);
      should().exist(credentialStatus['issuanceDate']);
      should().exist(credentialStatus['credentialMerkleRootHash']);
      should().exist(credentialStatus['proof']);
      should().exist(credentialStatus['proof'].type);
      expect(credentialStatus['proof'].type).to.be.equal('BJJSignature2021');
      expect(credentialStatusProof).to.be.a('object');
      should().exist(credentialStatusProof['type']);
      expect(credentialStatusProof['type']).to.be.equal('BJJSignature2021');
      should().exist(credentialStatusProof['created']);
      should().exist(credentialStatusProof['verificationMethod']);
      should().exist(credentialStatusProof['proofPurpose']);
      should().exist(credentialStatusProof['proofValue']);
      expect(credentialStatusRegistrationResult).to.be.a('object');
      should().exist(credentialStatusRegistrationResult['height']);
      should().exist(credentialStatusRegistrationResult['transactionHash']);
      should().exist(credentialStatusRegistrationResult['gasUsed']);
      should().exist(credentialStatusRegistrationResult['gasWanted']);
    });

    it('should be able to issue credential without having the credential status registered on chain', async function () {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      // tempCredentialBody['subjectDidDocSigned'] = holderSignedDidDoc;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = issuerDid;
      tempCredentialBody.subjectDid = subjectDid;
      tempCredentialBody.fields = { name: 'varsha', address: 'random address' };
      const credentialDetail = await hsSdk.vc.bjjVC.generate(tempCredentialBody);
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = issuerDid;
      tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
      tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
      tempIssueCredentialBody.registerCredential = false;
      const issuedCredResult = await hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
      const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } =
        issuedCredResult;
      credentialStatus2 = credentialStatus;
      credentialStatusProof2 = credentialStatusProof;
      expect(signedCredential).to.be.a('object');
      expect(credentialStatus).to.be.a('object');
      expect(credentialStatusProof).to.be.a('object');
      should().not.exist(credentialStatusRegistrationResult);
    });

    it('should be able to issue credential without having the credential status registered on chain to test bulkRegistration', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail2;
      tempIssueCredentialBody.issuerDid = issuerDid;
      tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
      tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
      tempIssueCredentialBody.registerCredential = false;
      issuedCredResult = await hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
      const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } =
        issuedCredResult;
      expect(signedCredential).to.be.a('object');
      expect(credentialStatus).to.be.a('object');
      expect(credentialStatusProof).to.be.a('object');
      should().not.exist(credentialStatusRegistrationResult);
    });
    it('should be able to issue credential without having the credential status registered on chain to test bulkRegistration', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail3;
      tempIssueCredentialBody.issuerDid = issuerDid;
      tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
      tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
      tempIssueCredentialBody.registerCredential = false;
      issuedCredResult2 = await hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
      const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } =
        issuedCredResult;
      expect(signedCredential).to.be.a('object');
      expect(credentialStatus).to.be.a('object');
      expect(credentialStatusProof).to.be.a('object');
      should().not.exist(credentialStatusRegistrationResult);
    });
  });
  describe('#generateSeletiveDisclosure() method for genertaaing sd', function () {
    const presentationBody = {
      verifiableCredential: signedVC1,
      verificationMethodId: '',
      issuerDid,
    };
    it('should not be able to generate a sd presentation document as verfiableCredential is not passed or null', async function () {
      const tempPresentationBody = { ...presentationBody };
      tempPresentationBody.verifiableCredential = null;
      return hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: verifiableCredential is required');
      });
    });

    it('should not be able to generate a sd presentation document as frame is not passed or null', async function () {
      const tempPresentationBody = { ...presentationBody };
      tempPresentationBody.verifiableCredential = signedVC;
      tempPresentationBody['frame'] = null;

      return hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: frame is required');
      });
    });
    it('should not be able to generate a sd presentation document as verificationMethodId is not passed', async function () {
      const tempPresentationBody = { ...presentationBody };
      tempPresentationBody.verifiableCredential = signedVC;
      const revelDocument = {
        type: ['VerifiableCredential', 'TestSchema'],
        expirationDate: {},
        issuanceDate: {},
        issuer: {},
        credentialSubject: {
          '@explicit': true,
          id: {},
        },
      };
      tempPresentationBody['frame'] = revelDocument;
      return hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: verificationMethodId is required');
      });
    });
    it('should not be able to generate a sd presentation document as issuerDid is not passed', async function () {
      const tempPresentationBody = { ...presentationBody };
      tempPresentationBody.verifiableCredential = signedVC;
      const revelDocument = {
        type: ['VerifiableCredential', 'TestSchema'],
        expirationDate: {},
        issuanceDate: {},
        issuer: {},
        credentialSubject: {
          '@explicit': true,
          id: {},
        },
      };
      tempPresentationBody['frame'] = revelDocument;
      tempPresentationBody.verificationMethodId = verificationMethod[0].id;
      tempPresentationBody.issuerDid = '';

      return hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: issuerDid is required');
      });
    });
    it('should be able to generate a sd document', async () => {
      const presentationBody = {
        verifiableCredential: {},
        frame: {},
        verificationMethodId: verificationMethod[0].id,
        issuerDid,
      };
      const revelDocument = {
        type: ['VerifiableCredential', 'TestSchema'],
        expirationDate: {},
        issuanceDate: {},
        issuer: {},
        credentialSubject: {
          '@explicit': true,
          id: {},
        },
      };
      const tempPresentationBody = { ...presentationBody };
      tempPresentationBody.verifiableCredential = signedVC1;
      tempPresentationBody.frame = revelDocument;
      tempPresentationBody.issuerDid = issuerDid;
      tempPresentationBody.verificationMethodId = verificationMethod[0].id;
      selectiveDisclosure = await hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody);
      should().exist(selectiveDisclosure['@context']);
      should().exist(selectiveDisclosure['id']);
      expect(selectiveDisclosure['id']).to.be.equal(credentialId);
      should().exist(selectiveDisclosure['type']);
      should().exist(selectiveDisclosure['credentialSchema']);
      should().exist(selectiveDisclosure['credentialStatus']);
      should().exist(selectiveDisclosure['credentialSubject']);
      expect(selectiveDisclosure['credentialSubject']).to.be.equal(subjectDid);
      should().exist(selectiveDisclosure['expirationDate']);
      should().exist(selectiveDisclosure['issuanceDate']);
      should().exist(selectiveDisclosure['issuer']);
      expect(selectiveDisclosure['issuer']).to.be.equal(issuerDid);
      should().exist(selectiveDisclosure['proof']);
      should().exist(selectiveDisclosure['proof'].type);
      expect(selectiveDisclosure['proof'].type).to.be.equal('BabyJubJubSignatureProof2021');
      should().exist(selectiveDisclosure['proof'].created);
      should().exist(selectiveDisclosure['proof'].verificationMethod);
      should().exist(selectiveDisclosure['proof'].proofPurpose);
      should().exist(selectiveDisclosure['proof'].credentialRoot);
      should().exist(selectiveDisclosure['proof'].proofValue);
    });
  });
  describe('#verify() method for verifying credential', function () {
    it('should be able to verify credential', async function () {
      const params = {
        credential: signedVC,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
      };

      const verificationResult = await hsSdk.vc.bjjVC.verify(params);
      expect(verificationResult).to.be.a('object');
      should().exist(verificationResult.verified);
      expect(verificationResult.verified).to.be.equal(true);
      should().exist(verificationResult.results);
      expect(verificationResult.results).to.be.a('array');
      should().exist(verificationResult.statusResult);
      expect(verificationResult.statusResult.verified).to.be.equal(true);
    });

    it('should not be able to verify credential as verificationMethodId is null or empty', async function () {
      const params = {
        credential: signedVC,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
      };
      params.verificationMethodId = '';
      return hsSdk.vc.bjjVC.verify(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to verify credential');
      });
    });

    it('should not be able to verify credential as issuerDid is null or empty', async function () {
      const params = {
        credential: signedVC,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
      };
      params.issuerDid = '';
      return hsSdk.vc.bjjVC.verify(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid or params.issuerDidDocument is required to verify credential');
      });
    });

    it('should not be able to verify credential as proof is null or undefined', async function () {
      const params = {
        credential: signedVC,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
      };

      if (params.credential) {
        params.credential.proof = undefined;
      }

      return hsSdk.vc.bjjVC.verify(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.credential.proof is required to verify credential');
      });
    });

    it('should not be able to verify credential as credential is null or undefined', async function () {
      const params = {
        credential: signedVC,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
      };
      params.credential = null;
      return hsSdk.vc.bjjVC.verify(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.credential is required to verify credential');
      });
    });
  });
});

describe('Verifiable Credential Status Opearations', () => {
  describe('#checkCredentialStatus() method to check status of the credential', function () {
    it('should not be able to check credential as credentialId is null or empty', async function () {
      return hsSdk.vc.bjjVC.checkCredentialStatus().catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
      });
    });

    it('should not be able to check credential as credentialId is invalid', async function () {
      return hsSdk.vc.bjjVC.checkCredentialStatus({ credentialId: credentialId + 'x' }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'No credential status found. Probably invalid credentialId');
      });
    });
    it('should be able to check credential status', async function () {
      const credentialStatus = await hsSdk.vc.bjjVC.checkCredentialStatus({ credentialId: credentialId });
      expect(credentialStatus).to.be.a('object');
      should().exist(credentialStatus.verified);
      expect(credentialStatus.verified).to.be.equal(true);
    });
  });
  describe('#resolveCredentialStatus() method to resolve status of the credential from blockchain', function () {
    it('should not be able to resolve credential as credentialId is not passed', async function () {
      return hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId: '' }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
      });
    });
    it('should be able to check credential status', async function () {
      const credentialStatus = await hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId: credentialId });
      expect(credentialStatus).to.be.a('object');
      should().exist(credentialStatus.revoked);
      should().exist(credentialStatus.suspended);
      should().exist(credentialStatus.remarks);
      should().exist(credentialStatus.issuer);
      should().exist(credentialStatus.issuanceDate);
      should().exist(credentialStatus.credentialMerkleRootHash);
      should().exist(credentialStatus.proof);
    });
  });
  describe('#updateCredentialStatus this method is to change credential status to revoked or suspended', function () {
    it('should not be able to update credential as verificationMethodId is not passed', async function () {
      const tempParams = {
        credentialStatus: credenStatus,
        issuerDid,
        verificationMethodId: '',
        privateKeyMultibase: issuerPrivateKeyMultibase,
        status: 'SUSPENDED',
        statusReason: 'Suspending this credential for some time',
      };
      tempParams.verificationMethodId = '';
      return hsSdk.vc.bjjVC.updateCredentialStatus(tempParams).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update credential status');
      });
    });
    it('should not be able to update credential as privateKey is not passed', async function () {
      const tempParams = {
        credentialStatus: credenStatus,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
        privateKeyMultibase: '',
        status: 'SUSPENDED',
        statusReason: 'Suspending this credential for some time',
      };
      tempParams.verificationMethodId = verificationMethod[0].id;
      tempParams.credentialStatus = credenStatus;
      tempParams.privateKeyMultibase = '';

      return hsSdk.vc.bjjVC.updateCredentialStatus(tempParams).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update credential status');
      });
    });
    it('should not be able to update credential as issuerDid is not passed', async function () {
      const tempParams = {
        credentialStatus: credenStatus,
        issuerDid: '',
        verificationMethodId: verificationMethod[0].id,
        privateKeyMultibase: issuerPrivateKeyMultibase,
        status: 'SUSPENDED',
        statusReason: 'Suspending this credential for some time',
      };
      tempParams.verificationMethodId = verificationMethod[0].id;
      tempParams.credentialStatus = credenStatus;
      tempParams.privateKeyMultibase = issuerPrivateKeyMultibase;
      tempParams.issuerDid = '';
      return hsSdk.vc.bjjVC.updateCredentialStatus(tempParams).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to update credential status');
      });
    });
    it('should not be able to update credential as status is not passed', async function () {
      const tempParams = {
        credentialStatus: credenStatus,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
        privateKeyMultibase: issuerPrivateKeyMultibase,
        status: '',
        statusReason: 'Suspending this credential for some time',
      };
      tempParams.verificationMethodId = verificationMethod[0].id;
      tempParams.credentialStatus = credenStatus;
      tempParams.privateKeyMultibase = issuerPrivateKeyMultibase;
      tempParams.issuerDid = issuerDid;
      tempParams.status = '';
      return hsSdk.vc.bjjVC.updateCredentialStatus(tempParams).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.status is required to update credential status');
      });
    });
    it('should not be able to update credential as status passed is invalid', async function () {
      const tempParams = {
        credentialStatus: credenStatus,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
        privateKeyMultibase: issuerPrivateKeyMultibase,
        status: 'svgsdvjif',
        statusReason: 'Suspending this credential for some time',
      };
      tempParams.verificationMethodId = verificationMethod[0].id;
      tempParams.credentialStatus = credenStatus;
      tempParams.privateKeyMultibase = issuerPrivateKeyMultibase;
      tempParams.issuerDid = issuerDid;
      tempParams.status = 'svgsdvjif';
      return hsSdk.vc.bjjVC.updateCredentialStatus(tempParams).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, `HID-SSI-SDK:: Error: params.status is invalid`);
      });
    });
    it('should be able to change credential status to suspended', async function () {
      const credentialStatus = await hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
      const params = {
        credentialStatus,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
        privateKeyMultibase: issuerPrivateKeyMultibase,
        status: 'SUSPENDED',
        statusReason: 'Suspending this credential for some time',
      };
      const updatedCredResult = await hsSdk.vc.bjjVC.updateCredentialStatus(params);
      expect(updatedCredResult).to.be.a('object');
      expect(updatedCredResult.code).to.be.equal(0);
      expect(updatedCredResult.transactionHash).to.be.a('string');
    });
      it('should not be able to suspend a suspended  credential status', async function () {
          const credentialStatus = await hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
          const params = {
              credentialStatus: credentialStatus,
              issuerDid,
              verificationMethodId: verificationMethod[0].id,
              privateKeyMultibase: issuerPrivateKeyMultibase,
              status: 'SUSPENDED',
              statusReason: 'Suspending this credential for some time',
          };
          return hsSdk.vc.bjjVC.updateCredentialStatus(params).catch(function (err) {
              expect(function () {
                  throw err
              }).to.throw(Error, "failed to execute message; message index: 0: incoming Credential Status Document does not have any changes: invalid Credential Status")
          });

    });
    it('should be able to change credential status to Live', async function () {
      const credentialStatus = await hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
      const params = {
        credentialStatus,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
        privateKeyMultibase: issuerPrivateKeyMultibase,
        status: 'LIVE',
        statusReason: 'Setting the status to LIVE',
      };
      const updatedCredResult = await hsSdk.vc.bjjVC.updateCredentialStatus(params);
      expect(updatedCredResult).to.be.a('object');
      expect(updatedCredResult.code).to.be.equal(0);
      expect(updatedCredResult.transactionHash).to.be.a('string');
    });
    it('should be able to change credential status to Revoke', async function () {
      const credentialStatus = await hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
      const params = {
        credentialStatus,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
        privateKeyMultibase: issuerPrivateKeyMultibase,
        status: 'REVOKED',
        statusReason: 'Revoking the credential',
      };
      const updatedCredResult = await hsSdk.vc.bjjVC.updateCredentialStatus(params);
      expect(updatedCredResult).to.be.a('object');
      expect(updatedCredResult.code).to.be.equal(0);
      expect(updatedCredResult.transactionHash).to.be.a('string');
    });
      it('should not be able to revoke a revoked credential status', async function () {
          const credentialStatus = await hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
          const params = {
              credentialStatus,
              issuerDid,
              verificationMethodId: verificationMethod[0].id,
              privateKeyMultibase: issuerPrivateKeyMultibase,
              status: 'REVOKED',
              statusReason: 'Revoking the credential',
          };
          return hsSdk.vc.bjjVC.updateCredentialStatus(params).catch(function (err) {
              expect(function () {
                  throw err
              }).to.throw(Error, 'failed to execute message; message index: 0: incoming Credential Status Document does not have any changes: invalid Credential Status')
          })

      })
    it('should not be able to change the status of credential as it is revoked', async function () {
      const credentialStatus = await hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
      const params = {
        credentialStatus,
        issuerDid,
        verificationMethodId: verificationMethod[0].id,
        privateKeyMultibase: issuerPrivateKeyMultibase,
        status: 'SUSPENDED',
        statusReason: 'Suspending this credential for some time',
      };

      return hsSdk.vc.bjjVC.updateCredentialStatus(params).catch(function (err) {
        expect(err.message).to.include(
          `failed to execute message; message index: 0: credential status ${credentialId} could not be updated since it is revoked: invalid Credential Status`
        );
      });
    });
  });
  describe('#registerCredentialStatus() method to register credential on blockchain', function () {
    it('should not be able to register credential as credentialStatusProof is not passed', async function () {
      return hsSdk.vc.bjjVC.registerCredentialStatus({ credentialStatus: credentialStatus2 }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          'HID-SSI-SDK:: Error: credentialStatus and credentialStatusProof are required to register credential status'
        );
      });
    });
    it('should not be able to register credential as credentialStatus is not passed', async function () {
      return hsSdk.vc.bjjVC
        .registerCredentialStatus({ credentialStatusProof: credentialStatusProof2 })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(
            Error,
            'HID-SSI-SDK:: Error: credentialStatus and credentialStatusProof are required to register credential status'
          );
        });
    });
    it('should be able to register credential on blockchain', async function () {
      const registerCredDetail = await hsSdk.vc.bjjVC.registerCredentialStatus({
        credentialStatus: credentialStatus2,
        credentialStatusProof: credentialStatusProof2,
      });
      expect(registerCredDetail).to.be.a('object');
      should().exist(registerCredDetail.transactionHash);
    });
      it('should not be able to register credential on blockchain as stutus already registerd on chain', async function () {
          return hsSdk.vc.bjjVC.registerCredentialStatus({
              credentialStatus: credentialStatus2,
              credentialStatusProof: credentialStatusProof2,
          }).catch(function (err) {
              expect(function () {
                  throw err

              }).to.throw('failed to execute message; message index: 0: credential status document already exists')
          })
      });
  });

  describe('#generateRegisterCredentialStatusTxnMessage() method to generate transaction message for credential2', function () {
    it('should not be able to generatecredential status TxnMessage as credentialStatus is not passed', async function () {
      const credentialStatus = null
      const credentialStatusProof = issuedCredResult.credentialStatusProof
      return hsSdk.vc.bjjVC.generateRegisterCredentialStatusTxnMessage(credentialStatus, credentialStatusProof).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          'HID-SSI-SDK:: Error: credentialStatus and proof are required to register credential status'
        );
      });
    });
    it('should not be able to generatecredential status TxnMessage as credentialStatusProof is not passed', async function () {
      const credentialStatus = issuedCredResult.credentialStatus
      const credentialStatusProof = null
      return hsSdk.vc.bjjVC.generateRegisterCredentialStatusTxnMessage(credentialStatus, credentialStatusProof).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          'HID-SSI-SDK:: Error: credentialStatus and proof are required to register credential status'
        );
      });
    });
    it('should be able to generate credential status TxnMessage', async function () {
      const credentialStatus = issuedCredResult.credentialStatus
      const credentialStatusProof = issuedCredResult.credentialStatusProof
      const credentialStatus2 = issuedCredResult2.credentialStatus
      const credentialStatusProof2 = issuedCredResult2.credentialStatusProof
      const txnMessage1 = await hsSdk.vc.bjjVC.generateRegisterCredentialStatusTxnMessage(credentialStatus, credentialStatusProof)
      credentialTransMessage.push(txnMessage1)
      const txnMessage2 = await hsSdk.vc.bjjVC.generateRegisterCredentialStatusTxnMessage(credentialStatus2, credentialStatusProof2)
      credentialTransMessage.push(txnMessage2)
      expect(txnMessage1).to.be.a('object')
      should().exist(txnMessage1.typeUrl)
      should().exist(txnMessage1.value)
      should().exist(txnMessage1.value.credentialStatusDocument)
      should().exist(txnMessage1.value.credentialStatusProof)
      should().exist(txnMessage1.value.txAuthor)
    });
  })


  describe('#registerCredentialStatusTxnBulk() method to register credential on blockchain', function () {
    it('should not be able to register multiple credential as txnMessage is not passed', async function () {
      const txnMessage = []
      return hsSdk.vc.bjjVC.registerCredentialStatusTxnBulk(txnMessage).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          'HID-SSI-SDK:: Error: txnMessage is required to register credential status'
        );
      });
    });
    it('should be able to register credential on blockchain in a bulk', async function () {
      const registerCredDetail = await hsSdk.vc.bjjVC.registerCredentialStatusTxnBulk(credentialTransMessage);
      expect(registerCredDetail).to.be.a('object');
      should().exist(registerCredDetail.transactionHash);
    });
  });
});

// add testcase for sd
