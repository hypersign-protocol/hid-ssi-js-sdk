import { expect, should } from 'chai';
import { HypersignDID, HypersignSchema, HypersignVerifiableCredential } from '../index';
import { createWallet, mnemonic, hidNodeEp } from './config';
import { ICredentialStatus, IVerifiableCredential } from '../credential/ICredential';

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
let credentialStatusProof2 = {};
let credentialStatus2 = {};
let credentialStatus;
const credentialBody = {
  schemaId: '',
  subjectDid: '',
  type: [],
  issuerDid: '',
  fields: { name: 'Varsha' },
  expirationDate: '',
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

  hypersignDID = new HypersignDID(constructorParams);
  await hypersignDID.init();

  hypersignSchema = new HypersignSchema(constructorParams);
  await hypersignSchema.init();

  hypersignVC = new HypersignVerifiableCredential(constructorParams);
  await hypersignVC.init();
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
    it('should not be able to generate new credential for a schema as both subjectDid and subjectDidDocSigned is passed', async function () {
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.issuerDid = didDocId;
      tempCredentialBody.subjectDid = didDocId;
      tempCredentialBody['subjectDidDocSigned'] = signedDocument;
      return hypersignVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: Both subjectDid and subjectDidDoc cannot be passed');
      });
    });
    it('should not be able to generate new credential for a schema as not able to resolve subjectDid or subjectDidDoc as  neither subjectDid nor subjectDidDocSigned is passed', async function () {
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.issuerDid = didDocId;
      return hypersignVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: Could not resolve the subjectDid or subjectDidDoc');
      });
    });
    it('should not be able to generate new credential for a schema as nether schemaId nor schema Context is passed', async function () {
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.issuerDid = didDocId;
      tempCredentialBody['subjectDidDocSigned'] = signedDocument;
      return hypersignVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'schemaId is required when schemaContext and type not passed');
      });
    });
    it('should not be able to generate new credential for a schema as wrong issuer did is passed', async function () {
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.issuerDid = didDocId + 'xyz';
      tempCredentialBody['subjectDidDocSigned'] = signedDocument;
      return hypersignVC.generate(tempCredentialBody).catch(function (err) {
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
      tempCredentialBody.issuerDid = didDocId;
      tempCredentialBody['subjectDid'] = didDocId;
      return hypersignVC.generate(tempCredentialBody).catch(function (err) {
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
      tempCredentialBody['subjectDidDocSigned'] = signedDocument;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = didDocId;
      return hypersignVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'Invalid time value');
      });
    });
    it('should not be able to generate new credential for a schema as additional properties in schema is set to false but sending additional properties in field value at the time of generating credential', async function () {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody['subjectDidDocSigned'] = signedDocument;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = didDocId;
      tempCredentialBody.fields['type'] = 'string';
      tempCredentialBody.fields['value'] = 'Varsha';
      tempCredentialBody.fields['name'] = 'name';
      return hypersignVC.generate(tempCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          `Only ["${schemaBody.fields[0].name}"] attributes are possible. additionalProperties is false in the schema`
        );
      });
    });

    it('should be able to generate new credential for a schema with subject DID', async function () {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.subjectDid = didDocId;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
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

    it('should be able to generate new credential even without offlinesigner passed to constructor', async function () {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.subjectDid = didDocId;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = didDocId;
      tempCredentialBody.fields = { name: 'varsha' };

      const hypersignVC1 = new HypersignVerifiableCredential();
      const credentialDetail = await hypersignVC1.generate(tempCredentialBody);

      expect(credentialDetail).to.be.a('object');
      should().exist(credentialDetail['@context']);
      should().exist(credentialDetail['id']);
      should().exist(credentialDetail['type']);
      should().exist(credentialDetail['expirationDate']);
      should().exist(credentialDetail['issuanceDate']);
      should().exist(credentialDetail['issuer']);
      should().exist(credentialDetail['credentialSubject']);
      should().exist(credentialDetail['credentialSchema']);
      should().exist(credentialDetail['credentialStatus']);
      expect(credentialDetail['credentialStatus'].type).to.be.equal('CredentialStatusList2017');
    });

    it('should be able to generate new credential for a schema with signed subject DID doc', async function () {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody['subjectDidDocSigned'] = signedDocument;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = didDocId;
      tempCredentialBody.fields = { name: 'varsha' };

      // console.log(tempCredentialBody)
      const credentialDetail = await hypersignVC.generate(tempCredentialBody);
      // console.log(JSON.stringify(credentialDetail));
      expect(credentialDetail).to.be.a('object');
      should().exist(credentialDetail['@context']);
      should().exist(credentialDetail['id']);
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
    it('should not be able to issueCredential as verificationMethodId is null or empty', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = didDocId;
      tempIssueCredentialBody.verificationMethodId = '';
      tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
      return await hypersignVC.issue(tempIssueCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to issue credential');
      });
    });
    it('should not be able to issueCredential as credentialObject is null or undefined', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = undefined;
      tempIssueCredentialBody.issuerDid = didDocId;
      tempIssueCredentialBody.verificationMethodId = verificationMethodId;
      tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
      return await hypersignVC.issue(tempIssueCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credential is required to issue credential');
      });
    });
    it('should not be able to issueCredential as privateKey is null or empty', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = didDocId;
      tempIssueCredentialBody.verificationMethodId = verificationMethodId;
      tempIssueCredentialBody.privateKeyMultibase = '';
      return await hypersignVC.issue(tempIssueCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to issue credential');
      });
    });
    it('should not be able to issueCredential as issuerDid is null or empty', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = '';
      tempIssueCredentialBody.verificationMethodId = verificationMethodId;
      tempIssueCredentialBody.privateKeyMultibase = publicKeyMultibase;
      return await hypersignVC.issue(tempIssueCredentialBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to issue credential');
      });
    });

    it('should be able to issue credential with credential status registered on chain', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = didDocId;
      tempIssueCredentialBody.verificationMethodId = verificationMethodId;
      tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
      // console.log(JSON.stringify(tempIssueCredentialBody, null, 2));
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
      console.log({
        signedCredentialId: signedVC ? signedVC['id'] : '',
        credentialId,
        id: tempIssueCredentialBody.credential.id,
      });
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

    it('should be able to issue credential without having the credential status registered on chain', async function () {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody['subjectDidDocSigned'] = signedDocument;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = didDocId;
      tempCredentialBody.fields = { name: 'varsha' };
      const credentialDetail = await hypersignVC.generate(tempCredentialBody);

      const tempIssueCredentialBody = { ...issueCredentialBody };

      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = didDocId;
      tempIssueCredentialBody.verificationMethodId = verificationMethodId;
      tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
      tempIssueCredentialBody.registerCredential = false;

      const issuedCredResult = await hypersignVC.issue(tempIssueCredentialBody);

      const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } =
        issuedCredResult;

      credentialStatus2 = credentialStatus;
      credentialStatusProof2 = credentialStatusProof;

      // console.log({
      //   signedCredential,
      //   credentialStatusRegistrationResult,
      //   credentialStatus2,
      //   credentialStatusProof2,
      // });

      expect(signedCredential).to.be.a('object');
      expect(credentialStatus).to.be.a('object');
      expect(credentialStatusProof).to.be.a('object');
      should().not.exist(credentialStatusRegistrationResult);
    });
  });

  describe('#verifyCredential() method to verify a credential', function () {
    it('should be able to verify credential', async function () {
      const params = {
        credential: signedVC,
        issuerDid: didDocId,
        verificationMethodId,
      };

      // console.log('Signed vc --------------------------------');
      // console.log(JSON.stringify(params.credential, null, 2));
      const verificationResult = await hypersignVC.verify(params);
      // console.log('Credential Verifification result --------------------------------');
      // console.log(JSON.stringify(verificationResult, null, 2));
      expect(verificationResult).to.be.a('object');
      should().exist(verificationResult.verified);
      expect(verificationResult.verified).to.be.equal(true);
      should().exist(verificationResult.results);
      expect(verificationResult.results).to.be.a('array');
      should().exist(verificationResult.statusResult);
      expect(verificationResult.statusResult.verified).to.be.equal(true);
    });

    it('should be able to verify even without offlinesigner passed to constructor', async function () {
      const params = {
        credential: signedVC,
        issuerDid: didDocId,
        verificationMethodId,
      };

      const hypersignVC1 = new HypersignVerifiableCredential();
      const verificationResult = await hypersignVC1.verify(params);

      expect(verificationResult).to.be.a('object');
      should().exist(verificationResult['verified']);
      expect(verificationResult['verified']).to.be.equal(true);
      should().exist(verificationResult['results']);
      expect(verificationResult['results']).to.be.a('array');
      should().exist(verificationResult['statusResult']);
      expect(verificationResult['statusResult'].verified).to.be.equal(true);
    });

    it('should not be able to verify credential as verificationMethodId is null or empty', async function () {
      const params = {
        credential: signedVC,
        issuerDid: didDocId,
        verificationMethodId,
      };
      params.verificationMethodId = '';
      return hypersignVC.verify(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to verify credential');
      });
    });

    it('should not be able to verify credential as issuerDid is null or empty', async function () {
      const params = {
        credential: signedVC,
        issuerDid: didDocId,
        verificationMethodId,
      };
      params.issuerDid = '';
      return hypersignVC.verify(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to verify credential');
      });
    });

    it('should not be able to verify credential as proof is null or undefined', async function () {
      const params = {
        credential: signedVC,
        issuerDid: didDocId,
        verificationMethodId,
      };

      if (params.credential) {
        params.credential.proof = undefined;
      }

      return hypersignVC.verify(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: params.credential.proof is required to verify credential');
      });
    });

    // it('should not be able to verify credential as credential is null or undefined', async function () {
    //   const params = {
    //     credential: signedVC,
    //     issuerDid: didDocId,
    //     verificationMethodId,
    //   };
    //   params.credential = {} as IVerifiableCredential;
    //   return hypersignVC.verify(params).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: params.credential is required to verify credential');
    //   });
    // });
  });
});

describe('Verifiable Credential Status Opearations', () => {
  describe('#checkCredentialStatus() method to check status of the credential', function () {
    it('should not be able to check credential as credentialId is null or empty', async function () {
      return hypersignVC.checkCredentialStatus().catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
      });
    });

    it('should not be able to check credential as credentialId is invalid', async function () {
      return hypersignVC.checkCredentialStatus({ credentialId: credentialId + 'x' }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'No credential status found. Probably invalid credentialId');
      });
    });

    it('should be able to check credential status', async function () {
      // console.log('Credential ID ' + credentialId);
      const credentialStatus = await hypersignVC.checkCredentialStatus({ credentialId: credentialId });
      // console.log(JSON.stringify(credentialStatus, null, 2));
      expect(credentialStatus).to.be.a('object');
      should().exist(credentialStatus.verified);
      expect(credentialStatus.verified).to.be.equal(true);
    });
  });

  describe('#resolveCredentialStatus this is to resolve credential status', function () {
    it('should not be able to resolve credential as credentialId is not passed', async function () {
      return hypersignVC.resolveCredentialStatus({ credentialId: '' }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
      });
    });
    it('should be able to resolve credential', async function () {
      credentialStatus = await hypersignVC.resolveCredentialStatus({ credentialId });
      // console.log(JSON.stringify(credentialStatus, null, 2));
      expect(credentialStatus).to.be.a('object');
      should().exist(credentialStatus.issuer);
      should().exist(credentialStatus.issuanceDate);
      should().exist(credentialStatus.expirationDate);
      should().exist(credentialStatus.credentialHash);
      should().exist(credentialStatus.proof);
    });
  });

  describe('#updateCredentialStatus this method is to change credential status to revoked or suspended', function () {
    const params = {
      credentialStatus: credenStatus,
      issuerDid: didDocId,
      verificationMethodId,
      privateKeyMultibase,
      status: 'SUSPENDED',
      statusReason: 'Suspending this credential for some time',
    };
    it('should not be able to update credential as verificationMethodId is not passed', async function () {
      const tempParams = { ...params };
      tempParams.verificationMethodId = '';
      return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update credential status');
      });
    });
    // it('should not be able to update credential as credStatus is not passed', async function () {
    //   const tempParams = { ...params };
    //   tempParams.verificationMethodId = verificationMethodId;
    //   tempParams.privateKeyMultibase = privateKeyMultibase;
    //   tempParams.issuerDid = credentialStatus;
    //   tempParams.credentialStatus = {} as ICredentialStatus;
    //   return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
    //     expect(function () {
    //       throw err;
    //     }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credentialStatus is required to update credential status');
    //   });
    // });
    it('should not be able to update credential as privateKey is not passed', async function () {
      const tempParams = { ...params };
      tempParams.verificationMethodId = verificationMethodId;
      tempParams.credentialStatus = credenStatus;
      tempParams.privateKeyMultibase = '';

      return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update credential status');
      });
    });
    it('should not be able to update credential as issuerDid is not passed', async function () {
      const tempParams = { ...params };
      tempParams.verificationMethodId = verificationMethodId;
      tempParams.credentialStatus = credenStatus;
      tempParams.privateKeyMultibase = privateKeyMultibase;
      tempParams.issuerDid = '';
      return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to update credential status');
      });
    });
    it('should not be able to update credential as status is not passed', async function () {
      const tempParams = { ...params };
      tempParams.verificationMethodId = verificationMethodId;
      tempParams.credentialStatus = credenStatus;
      tempParams.privateKeyMultibase = privateKeyMultibase;
      tempParams.issuerDid = didDocId;
      tempParams.status = '';
      return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.status is required to update credential status');
      });
    });
    it('should be able to change credential status to suspended', async function () {
      const credentialStatus = await hypersignVC.resolveCredentialStatus({ credentialId });
      const params = {
        credentialStatus,
        issuerDid: didDocId,
        verificationMethodId,
        privateKeyMultibase,
        status: 'SUSPENDED',
        statusReason: 'Suspending this credential for some time',
      };
      const updatedCredResult = await hypersignVC.updateCredentialStatus(params);
      // console.log(updatedCredResult);
      expect(updatedCredResult).to.be.a('object');
      expect(updatedCredResult.code).to.be.equal(0);
    });

    it('should be able to change credential status to Live', async function () {
      const credentialStatus = await hypersignVC.resolveCredentialStatus({ credentialId });
      const params = {
        credentialStatus,
        issuerDid: didDocId,
        verificationMethodId,
        privateKeyMultibase,
        status: 'LIVE',
        statusReason: 'Setting the status to LIVE',
      };
      const updatedCredResult = await hypersignVC.updateCredentialStatus(params);
      expect(updatedCredResult).to.be.a('object');
      expect(updatedCredResult.code).to.be.equal(0);
    });
  });

  describe('#registerCredentialStatus() method to register credential on blockchain', function () {
    it('should not be able to register credential as credentialStatusProof is not passed', async function () {
      return hypersignVC.registerCredentialStatus({ credentialStatus: credentialStatus2 }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          'HID-SSI-SDK:: Error: credentialStatus and credentialStatusProof are required to register credential status'
        );
      });
    });

    it('should not be able to register credential as credentialStatus is not passed', async function () {
      return hypersignVC
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
      // console.log({
      //   credentialStatus2,
      // });
      const registerCredDetail = await hypersignVC.registerCredentialStatus({
        credentialStatus: credentialStatus2,
        credentialStatusProof: credentialStatusProof2,
      });

      // console.log(JSON.stringify(registerCredDetail, null, 2));
      expect(registerCredDetail).to.be.a('object');
      should().exist(registerCredDetail.code);
      should().exist(registerCredDetail.transactionHash);
    });
  });
});
