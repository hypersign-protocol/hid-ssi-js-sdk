import { expect, should } from 'chai';
import { HypersignSchema, HypersignVerifiableCredential, HypersignSSISdk } from '../../index';
import { createWallet, mnemonic, hidNodeEp } from '../config';
import { IVerifiablePresentation } from '../../presentation/IPresentation';
import { ICredentialStatus, IVerifiableCredential } from '../../credential/ICredential';
let holdersPrivateKeyMultibase;
let holderDidDocument;
let hypersignSSISDK;
let privateKeyMultibase;
let publicKeyMultibase;
let didDocId;
let schemaId;
let signedDocument;
let verificationMethodId;
let didDocument;
let schemaObject;
const challenge = '1231231231';
const domain = 'www.adbv.com';
let offlineSigner;
let credentialId;
let credentialDetail;
let hypersignDID;
let hypersignSchema;
let hypersignVC;
let signedSchema;
let credentialStatusId;
let signedVC: IVerifiableCredential;
let credenStatus: ICredentialStatus;
let hypersignVP;
let unsignedverifiablePresentation: IVerifiablePresentation;
let verifiableCredentialPresentationId;
let signedVerifiablePresentation: IVerifiablePresentation;
const credentialBody = {
  schemaId: '',
  subjectDid: '',
  type: [],
  issuerDid: '',
  fields: { name: 'Varsha' },
};
const schemaBody = {
  name: 'TestSchema',
  description: 'This is a test schema generation',
  author: '',
  fields: [{ name: 'name', type: 'string', isRequired: false }],
  additionalProperties: false,
};
const issueCredentialBody = {
  credential: credentialDetail,
  issuerDid: didDocId,
  verificationMethodId,
  privateKeyMultibase: privateKeyMultibase,
  registerCredential: true,
};

beforeEach(async function () {
  offlineSigner = await createWallet(mnemonic);
  const constructorParams = {
    offlineSigner,
    nodeRestEndpoint: hidNodeEp.rest,
    nodeRpcEndpoint: hidNodeEp.rpc,
    namespace: hidNodeEp.namespace,
  };

  // hypersignDID = new HypersignDID(constructorParams);
  // await hypersignDID.init();

  hypersignSchema = new HypersignSchema(constructorParams);
  await hypersignSchema.init();

  hypersignVC = new HypersignVerifiableCredential(constructorParams);
  await hypersignVC.init();

  // hypersignVP = new HypersignVerifiablePresentation();

  hypersignSSISDK = new HypersignSSISdk(constructorParams);
  await hypersignSSISDK.init();

  const { vc, vp, did, schema } = hypersignSSISDK;

  hypersignDID = did;
  hypersignSchema = schema;
  hypersignVP = vp;
  hypersignVC = vc;
});

// Generate public and private key pair
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

/**
 * DID creation and registration
 */
describe('DID Opearations', () => {
  describe('#generate() to generate did', function () {
    it('should be able to generate didDocument', async function () {
      didDocument = await hypersignDID.generate({ publicKeyMultibase });
      didDocId = didDocument['id'];
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

    it('should be able to generate didDocument for holder', async function () {
      const kp = await hypersignDID.generateKeys();
      holdersPrivateKeyMultibase = kp.privateKeyMultibase;
      holderDidDocument = await hypersignDID.generate({ publicKeyMultibase: kp.publicKeyMultibase });
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
  describe('#sign() this is to sign didDoc', function () {
    const controller = {
      '@context': '',
      id: '',
      authentication: [],
    };
    it('should able to sign did document', async function () {
      const didDoc = JSON.parse(JSON.stringify(didDocument));
      const params = {
        privateKeyMultibase: privateKeyMultibase as string,
        challenge: challenge as string,
        domain: domain as string,
        did: '',
        didDocument: didDoc as object,
        verificationMethodId: verificationMethodId as string,
        controller,
      };
      signedDocument = await hypersignDID.sign(params);
      expect(signedDocument).to.be.a('object');
      should().exist(signedDocument['@context']);
      should().exist(signedDocument['id']);
      expect(didDocId).to.be.equal(signedDocument['id']);
      should().exist(signedDocument['controller']);
      should().exist(signedDocument['alsoKnownAs']);
      should().exist(signedDocument['verificationMethod']);
      should().exist(signedDocument['authentication']);
      should().exist(signedDocument['assertionMethod']);
      should().exist(signedDocument['keyAgreement']);
      should().exist(signedDocument['capabilityInvocation']);
      should().exist(signedDocument['capabilityDelegation']);
      should().exist(signedDocument['service']);
      should().exist(signedDocument['proof']);
    });
  });
  describe('#register() this is to register did on the blockchain', function () {
    it('should be able to register didDocument in the blockchain', async function () {
      const result = await hypersignDID.register({ didDocument, privateKeyMultibase, verificationMethodId });
      should().exist(result.transactionHash);
      should().exist(result.didDocument);
    });
    it('should be able to register holder didDocument in the blockchain', async function () {
      const result = await hypersignDID.register({
        didDocument: holderDidDocument,
        privateKeyMultibase: holdersPrivateKeyMultibase,
        verificationMethodId: holderDidDocument.verificationMethod[0].id,
      });
      should().exist(result.transactionHash);
      should().exist(result.didDocument);
    });
  });
});
// /**
//  * Schema Creation and Registration
//  */
describe('Schema Opearations', () => {
  describe('#getSchema() method to create schema', function () {
    it('should able to create a new schema', async function () {
      schemaBody.author = didDocId;
      schemaObject = await hypersignSchema.generate(schemaBody);
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
      expect(schemaObject['name']).to.be.equal(schemaBody.name);
      expect(schemaObject['author']).to.be.equal(schemaBody.author);
    });
  });

  describe('#sign() function to sign schema', function () {
    it('should be able to sign newly created schema', async function () {
      signedSchema = await hypersignSchema.sign({ privateKeyMultibase, schema: schemaObject, verificationMethodId });
      expect(signedSchema).to.be.a('object');
    });
  });

  describe('#registerSchema() function to register schema on blockchain', function () {
    it('should be able to register schema on blockchain', async function () {
      const registeredSchema = await hypersignSchema.register({
        schema: signedSchema,
      });
      //console.log(JSON.stringify(registeredSchema, null, 2))
      expect(registeredSchema).to.be.a('object');
      should().exist(registeredSchema.transactionHash);
    });
  });
});

// /**
//  * Test cases related to credential
//  */
describe('Verifiable Credential Opearations', () => {
  describe('#generate() method to generate a credential', function () {
    it('should be able to generate new credential for a schema with subject DID', async function () {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.subjectDid = holderDidDocument.id;
      tempCredentialBody['expirationDate'] = expirationDate;
      tempCredentialBody.issuerDid = didDocId;
      tempCredentialBody.fields = { name: 'varsha' };

      credentialDetail = await hypersignVC.generate(tempCredentialBody);
      // console.log('New Credential --------------------------------');
      // console.log(JSON.stringify(credentialDetail, null, 2));

      expect(credentialDetail).to.be.a('object');
      should().exist(credentialDetail['@context']);
      should().exist(credentialDetail['id']);
      credentialId = credentialDetail.id;
      should().exist(credentialDetail['type']);
      should().exist(credentialDetail['expirationDate']);
      should().exist(credentialDetail['issuanceDate']);
      should().exist(credentialDetail['issuer']);
      should().exist(credentialDetail['credentialSubject']);
      should().exist(credentialDetail['credentialSchema']);
      should().exist(credentialDetail['credentialStatus']);
      expect(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
    });
  });
  describe('#issueCredential() method for issuing credential', function () {
    it('should be able to issue credential with credential status registered on chain', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = didDocId;
      tempIssueCredentialBody.verificationMethodId = verificationMethodId;
      tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
      //console.log(JSON.stringify(tempIssueCredentialBody, null, 2));
      const issuedCredResult = await hypersignVC.issue(tempIssueCredentialBody);
      const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } =
        issuedCredResult;

      signedVC = signedCredential;
      credenStatus = credentialStatus;
      credentialId = signedVC.id;
      credentialStatusId = signedCredential['credentialStatus'].id;

      expect(signedCredential).to.be.a('object');
      should().exist(signedCredential['@context']);
      should().exist(signedCredential['id']);
      should().exist(signedCredential['type']);
      should().exist(signedCredential['expirationDate']);
      should().exist(signedCredential['issuanceDate']);
      should().exist(signedCredential['issuer']);
      should().exist(signedCredential['credentialSubject']);
      should().exist(signedCredential['credentialSchema']);
      should().exist(signedCredential['credentialStatus']);
      should().exist(signedCredential['proof']);
      expect(signedCredential['id']).to.be.equal(tempIssueCredentialBody.credential.id);
      expect(credentialStatus).to.be.a('object');
      should().exist(credentialStatus['issuer']);
      should().exist(credentialStatus['issuanceDate']);
      should().exist(credentialStatus['remarks']);
      should().exist(credentialStatus['credentialMerkleRootHash']);
      expect(credentialStatusProof).to.be.a('object');
      should().exist(credentialStatusProof['type']);
      should().exist(credentialStatusProof['created']);
      should().exist(credentialStatusProof['verificationMethod']);
      should().exist(credentialStatusProof['proofPurpose']);
      should().exist(credentialStatusProof['proofValue']);
      expect(credentialStatusRegistrationResult).to.be.a('object');
      should().exist(credentialStatusRegistrationResult['code']);
      should().exist(credentialStatusRegistrationResult['height']);
      should().exist(credentialStatusRegistrationResult['transactionHash']);
      should().exist(credentialStatusRegistrationResult['gasUsed']);
      should().exist(credentialStatusRegistrationResult['gasWanted']);
    });
  });
});

// /**
//  * Test cases related to verifiable presentation
//  */

describe('Verifiable Presentation Operataions', () => {
  describe('#generate() method to generate new presentation document', () => {
    it('should be able to generate a new presentation document', async () => {
      const presentationBody = {
        verifiableCredentials: [credentialDetail],
        holderDid: holderDidDocument.id,
      };
      const tempPresentationBody = { ...presentationBody };
      tempPresentationBody.verifiableCredentials[0] = credentialDetail;
      tempPresentationBody.holderDid = holderDidDocument.id;
      unsignedverifiablePresentation = await hypersignVP.generate(tempPresentationBody);
      should().exist(unsignedverifiablePresentation['@context']);
      should().exist(unsignedverifiablePresentation['type']);
      expect(unsignedverifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
      should().exist(unsignedverifiablePresentation['verifiableCredential']);
      expect(unsignedverifiablePresentation.verifiableCredential).to.be.a('array');
      should().exist(unsignedverifiablePresentation['id']);
      should().exist(unsignedverifiablePresentation['holder']);
      verifiableCredentialPresentationId = unsignedverifiablePresentation.id;
    });
  });
  describe('#sign() method to sign presentation document', () => {
    const signPresentationBody = {
      presentation: unsignedverifiablePresentation,
      holderDid: '',
      verificationMethodId: '',
      privateKeyMultibase: '',
      challenge,
    };

    it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.presentation = unsignedverifiablePresentation;
      tempSignPresentationBody.holderDid = holderDidDocument.id;
      tempSignPresentationBody.verificationMethodId = holderDidDocument.verificationMethod[0].id;
      tempSignPresentationBody.privateKeyMultibase = holdersPrivateKeyMultibase;
      tempSignPresentationBody['holderDidDocSigned'] = signedDocument;
      return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
      });
    });
    it('should not be able to sign presentation as privateKeyMultibase in null or empty', async function () {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.privateKeyMultibase = '';
      return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.privateKeyMultibase is required for signing a presentation');
      });
    });
    it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
      tempSignPresentationBody.presentation = {} as IVerifiablePresentation;
      tempSignPresentationBody.verificationMethodId = holderDidDocument.verificationMethod[0].id;
      tempSignPresentationBody.holderDid = holderDidDocument.id;

      return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.presentation is required for signing a presentation');
      });
    });
    it('should not be able to sign presentation as challenge is not passed', async function () {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.privateKeyMultibase = holdersPrivateKeyMultibase;
      tempSignPresentationBody.presentation = unsignedverifiablePresentation;
      tempSignPresentationBody.challenge = '';
      return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for signing a presentation');
      });
    });
    it('should not be able to sign presentation as verificationMethodId is not passed', async function () {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.privateKeyMultibase = holdersPrivateKeyMultibase;
      tempSignPresentationBody.presentation = unsignedverifiablePresentation;
      tempSignPresentationBody.challenge = challenge;
      tempSignPresentationBody.verificationMethodId = '';
      return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.verificationMethodId is required for signing a presentation');
      });
    });

    it('should be able a sign presentation document', async () => {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.presentation = unsignedverifiablePresentation;
      tempSignPresentationBody.holderDid = holderDidDocument.id;
      tempSignPresentationBody.verificationMethodId = holderDidDocument.verificationMethod[0].id;
      tempSignPresentationBody.privateKeyMultibase = holdersPrivateKeyMultibase;
      tempSignPresentationBody.challenge = "abc";
      tempSignPresentationBody['domain'] = "http://xyz.com";
      signedVerifiablePresentation = await hypersignVP.sign(tempSignPresentationBody);
      should().exist(signedVerifiablePresentation['@context']);
      should().exist(signedVerifiablePresentation['type']);
      expect(signedVerifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
      should().exist(signedVerifiablePresentation['verifiableCredential']);
      expect(signedVerifiablePresentation.id).to.be.equal(verifiableCredentialPresentationId);
    });
  });
  describe('#verify() method to verify a signed presentation document', () => {
    const verifyPresentationBody = {
      signedPresentation: signedVerifiablePresentation,
      holderDid: '',
      holderVerificationMethodId: '',
      issuerVerificationMethodId: verificationMethodId,
      privateKey: privateKeyMultibase,
      challenge,
      issuerDid: didDocId,
    };

    it('should not be able to verify presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
      tempverifyPresentationBody.holderDid = holderDidDocument.id;
      tempverifyPresentationBody.holderVerificationMethodId = holderDidDocument.verificationMethod[0].id;
      tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
      tempverifyPresentationBody.privateKey = privateKeyMultibase;
      tempverifyPresentationBody['holderDidDocSigned'] = signedDocument;
      return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
      });
    });
    it('should not be able to verify presentation as issuerDid is null or empty', async function () {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.issuerDid = '';
      return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
      });
    });
    it('should not be able to verify presentation as challenge is null or empty', async function () {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.issuerDid = didDocId;
      tempverifyPresentationBody.challenge = '';

      return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for verifying a presentation');
      });
    });
    it('should not be able to verify presentation as holderVerificationMethodId is null or empty', async function () {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.issuerDid = didDocId;
      tempverifyPresentationBody.challenge = challenge;
      tempverifyPresentationBody.holderVerificationMethodId = '';

      return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.holderVerificationMethodId is required for verifying a presentation');
      });
    });
    it('should not be able to verify presentation as issuerVerificationMethodId is null or empty', async function () {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.issuerDid = didDocId;
      tempverifyPresentationBody.challenge = challenge;
      tempverifyPresentationBody.holderVerificationMethodId = holderDidDocument.verificationMethod[0].id;
      tempverifyPresentationBody.issuerVerificationMethodId = '';

      return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
      });
    });
    it('should not be able to verify presentation as challenge used at the time of verification is different than challenge used in vp sign and getting presentation verification result false', async function () {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
      tempverifyPresentationBody.issuerDid = didDocId;
      tempverifyPresentationBody.holderDid = holderDidDocument.id;
      tempverifyPresentationBody.challenge = "abczshdsfhgk";
      tempverifyPresentationBody['domain'] = "http://xyz.com"
      tempverifyPresentationBody.holderVerificationMethodId = holderDidDocument.verificationMethod[0].id;
      tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
      const verifiedPresentationDetail = await hypersignVP.verify(tempverifyPresentationBody);
      expect(verifiedPresentationDetail.verified).to.be.equal(false);
      expect(verifiedPresentationDetail.presentationResult.verified).to.be.equal(false);
      expect(verifiedPresentationDetail.credentialResults[0].verified).to.be.equal(true);
    });
    it('should not be able to verify presentation as domain used at the time of vp verification is differ than domain used in vp sign and getting  presentation verification result false', async function () {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
      tempverifyPresentationBody.issuerDid = didDocId;
      tempverifyPresentationBody.holderDid = holderDidDocument.id;
      tempverifyPresentationBody.challenge = "abc";
      tempverifyPresentationBody['domain'] = "http://xyz1.com";
      tempverifyPresentationBody.holderVerificationMethodId = holderDidDocument.verificationMethod[0].id;
      tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
      const verifiedPresentationDetail = await hypersignVP.verify(tempverifyPresentationBody);
      expect(verifiedPresentationDetail.verified).to.be.equal(false);
      expect(verifiedPresentationDetail.presentationResult.verified).to.be.equal(false);
      expect(verifiedPresentationDetail.credentialResults[0].verified).to.be.equal(true);
    });
    it('should be able to verify signed presentation document', async () => {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
      tempverifyPresentationBody.issuerDid = didDocId;
      tempverifyPresentationBody.holderDid = holderDidDocument.id;
      tempverifyPresentationBody.holderVerificationMethodId = holderDidDocument.verificationMethod[0].id;
      tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
      tempverifyPresentationBody.challenge = "abc";
      tempverifyPresentationBody['domain'] = "http://xyz.com"
      const verifiedPresentationDetail = await hypersignVP.verify(tempverifyPresentationBody);
      should().exist(verifiedPresentationDetail.verified);
      expect(verifiedPresentationDetail.verified).to.be.equal(true);
      expect(verifiedPresentationDetail.presentationResult.verified).to.be.equal(true);

      expect(verifiedPresentationDetail).to.be.a('object');
      should().exist(verifiedPresentationDetail.credentialResults);
      expect(verifiedPresentationDetail.credentialResults).to.be.a('array');
      should().exist(verifiedPresentationDetail.credentialResults[0].results);
      expect(verifiedPresentationDetail.credentialResults[0].results).to.be.a('array');
      expect(verifiedPresentationDetail.credentialResults[0].verified).to.be.equal(true);
      expect(verifiedPresentationDetail.credentialResults[0].credentialId).to.be.equal(credentialId);
    });
  });
});
