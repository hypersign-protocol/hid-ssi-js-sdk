import { expect, should } from 'chai';
import {
  HypersignDID,
  HypersignSchema,
  HypersignVerifiableCredential,
  HypersignVerifiablePresentation,
  HypersignSSISdk,
} from '../index';
import { createWallet, mnemonic, hidNodeEp } from './config';
import { IVerifiablePresentation } from '../presentation/IPresentation';
import { ICredentialStatus, IVerifiableCredential } from '../credential/ICredential';

let hypersignSSISDK;
let privateKeyMultibase;
let publicKeyMultibase;
let didDocId;
let schemaId;
let signedDocument;
let verificationMethodId;
let didDocument;
let schemaObject;
let schemaSignature;
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
  name: 'testSchema',
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
  });

  describe('#sign() this is to sign didDoc', function () {
    const controller = {
      '@context': '',
      id: '',
      authentication: [],
    };
    it('should able to sign did document', async function () {
      const params = {
        privateKeyMultibase: privateKeyMultibase as string,
        challenge: challenge as string,
        domain: domain as string,
        did: '',
        didDocument: didDocument as object,
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
      should().exist(result.code);
      should().exist(result.height);
      should().exist(result.rawLog);
      should().exist(result.transactionHash);
      should().exist(result.gasUsed);
      should().exist(result.gasWanted);
    });
  });
});
/**
 * Schema Creation and Registration
 */
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
      should().exist(registeredSchema.code);
      should().exist(registeredSchema.height);
      should().exist(registeredSchema.rawLog);
      should().exist(registeredSchema.transactionHash);
      should().exist(registeredSchema.gasUsed);
      should().exist(registeredSchema.gasWanted);
      expect(registeredSchema.rawLog).to.be.a('string');
    });
  });
});

/**
 * Test cases related to credential
 */
describe('Verifiable Credential Opearations', () => {
  describe('#getCredential() method to generate a credential', function () {
    it('should be able to generate new credential for a schema with subject DID', async function () {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.subjectDid = didDocId;
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
      expect(credentialDetail['credentialStatus'].type).to.be.equal('CredentialStatusList2017');
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

      // console.log('Signed Credential --------------------------------');
      // console.log(JSON.stringify(signedVC, null, 2));

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
      // console.log({
      //   signedCredentialId: signedVC ? signedVC['id'] : '',
      //   credentialId,
      //   id: tempIssueCredentialBody.credential.id,
      // });
      expect(signedCredential['id']).to.be.equal(tempIssueCredentialBody.credential.id);

      expect(credentialStatus).to.be.a('object');
      should().exist(credentialStatus['claim']);
      should().exist(credentialStatus['issuer']);
      should().exist(credentialStatus['issuanceDate']);
      should().exist(credentialStatus['expirationDate']);
      should().exist(credentialStatus['credentialHash']);

      expect(credentialStatusProof).to.be.a('object');
      should().exist(credentialStatusProof['type']);
      should().exist(credentialStatusProof['created']);
      should().exist(credentialStatusProof['updated']);
      should().exist(credentialStatusProof['verificationMethod']);
      should().exist(credentialStatusProof['proofPurpose']);
      should().exist(credentialStatusProof['proofValue']);

      expect(credentialStatusRegistrationResult).to.be.a('object');
      should().exist(credentialStatusRegistrationResult['height']);
      should().exist(credentialStatusRegistrationResult['transactionHash']);
      should().exist(credentialStatusRegistrationResult['gasUsed']);
      should().exist(credentialStatusRegistrationResult['gasWanted']);
    });
  });
});

/**
 * Test cases related to verifiable presentation
 */

describe('Verifiable Presentation Operataions', () => {
  describe('#generate() method to generate new presentation document', () => {
    const presentationBody = {
      verifiableCredentials: [credentialDetail],
      holderDid: didDocId,
    };

    it('should be able to gnerate a new presentation document', async () => {
      const tempPresentationBody = { ...presentationBody };
      tempPresentationBody.verifiableCredentials[0] = credentialDetail;
      tempPresentationBody.holderDid = didDocId;

      // console.log(JSON.stringify(tempPresentationBody, null, 2));

      unsignedverifiablePresentation = await hypersignVP.generate(tempPresentationBody);
      // console.log(JSON.stringify(unsignedverifiablePresentation, null, 2));
      should().exist(unsignedverifiablePresentation['@context']);
      should().exist(unsignedverifiablePresentation['type']);
      expect(unsignedverifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
      should().exist(unsignedverifiablePresentation['verifiableCredential']);
      expect(unsignedverifiablePresentation.verifiableCredential).to.be.a('array');
      should().exist(unsignedverifiablePresentation['id']);
      should().exist(unsignedverifiablePresentation['holder']);
      verifiableCredentialPresentationId = unsignedverifiablePresentation.id;
      // expect(unsignedverifiablePresentation['verifiableCredential'][0].id).to.be.equal(credentialId);
    });
  });
  describe('#sign() method to sign presentation document', () => {
    const signPresentationBody = {
      presentation: unsignedverifiablePresentation,
      holderDid: didDocId,
      verificationMethodId,
      privateKeyMultibase: privateKeyMultibase,
      challenge,
    };

    it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.presentation = unsignedverifiablePresentation;
      tempSignPresentationBody.holderDid = didDocId;
      tempSignPresentationBody.verificationMethodId = verificationMethodId;
      tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
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
    // it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
    //   const tempSignPresentationBody = { ...signPresentationBody };
    //   tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
    //   tempSignPresentationBody.presentation = {} as IVerifiablePresentation;

    //   return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: params.presentation is required for signinng a presentation');
    //   });
    // });
    it('should not be able to sign presentation as challenge is not passed', async function () {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
      tempSignPresentationBody.presentation = unsignedverifiablePresentation;
      tempSignPresentationBody.challenge = '';
      return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for signinng a presentation');
      });
    });
    it('should not be able to sign presentation as verificationMethodId is not passed', async function () {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
      tempSignPresentationBody.presentation = unsignedverifiablePresentation;
      tempSignPresentationBody.challenge = challenge;
      tempSignPresentationBody.verificationMethodId = '';
      return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.verificationMethodId is required for signinng a presentation');
      });
    });

    it('should be able a sign presentation document', async () => {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.presentation = unsignedverifiablePresentation;
      tempSignPresentationBody.holderDid = didDocId;
      tempSignPresentationBody.verificationMethodId = verificationMethodId;
      tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
      signedVerifiablePresentation = await hypersignVP.sign(tempSignPresentationBody);

      // console.log(JSON.stringify(signedVerifiablePresentation, null, 2));

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
      holderDid: didDocId,
      holderVerificationMethodId: verificationMethodId,
      issuerVerificationMethodId: verificationMethodId,
      privateKey: privateKeyMultibase,
      challenge,
      issuerDid: didDocId,
    };

    it('should not be able to verify presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
      tempverifyPresentationBody.holderDid = didDocId;
      tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
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
      tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
      tempverifyPresentationBody.issuerVerificationMethodId = '';

      return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
      });
    });

    it('should be able a verify sgned presentation document', async () => {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
      tempverifyPresentationBody.issuerDid = didDocId;
      tempverifyPresentationBody.holderDid = didDocId;
      tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
      tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
      tempverifyPresentationBody.challenge = didDocId;

      const verifiedPresentationDetail = await hypersignVP.verify(tempverifyPresentationBody);
      // console.log(JSON.stringify(verifiedPresentationDetail, null, 2));

      should().exist(verifiedPresentationDetail.verified);
      expect(verifiedPresentationDetail.verified).to.be.equal(true);
      expect(verifiedPresentationDetail).to.be.a('object');
      should().exist(verifiedPresentationDetail.results);
      expect(verifiedPresentationDetail.results).to.be.a('array');
      should().exist(verifiedPresentationDetail.credentialResults);
      expect(verifiedPresentationDetail.credentialResults).to.be.a('array');
      expect(verifiedPresentationDetail.credentialResults[0].verified).to.be.equal(true);
      expect(verifiedPresentationDetail.credentialResults[0].credentialId).to.be.equal(credentialId);
    });
  });
});
