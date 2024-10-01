import { HypersignSSISdk } from '../../index';
import { expect, should } from 'chai';
import { createWallet, mnemonic, hidNodeEp } from '../config';
import { VerificationMethodTypes } from '../../../libs/generated/ssi/client/enums';
let offlineSigner;
let hsSdk;
let privateKeyMultibase;
let publicKeyMultibase;
let didDocument;
let didDocId;
let subjectDid
let verificationMethodId;
let bjjPubKey;
let bjjPrivKey;
let schemaObject;
let signedSchema
let schemaId;
let credentialDetail;
let signedVC;
let unsignedverifiablePresentation;
let issuerDidDoc
let issuerDid
let holderDidDoc
let holderDid
let signedVerifiablePresentation;
let challenge;
let credenStatus;
let credentialStatusId
let credentialId;
let verifiableCredentialPresentationId;
let IssuerKp
let holderKp
const schemaBody = {
  name: 'TestSchema',
  description: 'This is a test schema generation',
  author: '',
  fields: [{ name: 'name', type: 'string', isRequired: true }] as any,
  additionalProperties: false,
}
const credentialBody = {
  schemaId: '',
  subjectDid: '',
  type: [],
  issuerDid: '',
  fields: { name: 'Varsha' },
  expirationDate: '',
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
  const params = {
    offlineSigner,
    nodeRestEndpoint: hidNodeEp.rest,
    nodeRpcEndpoint: hidNodeEp.rpc,
    namespace: hidNodeEp.namespace,
  };
  hsSdk = new HypersignSSISdk(params);
  await hsSdk.init();
});
describe('DID Test scenarios', () => {
  describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', async function () {
      const kp = await hsSdk.did.generateKeys();
      privateKeyMultibase = kp.privateKeyMultibase;
      publicKeyMultibase = kp.publicKeyMultibase;
      const bjjKp = await hsSdk.did.bjjDID.generateKeys();
      bjjPubKey = bjjKp.publicKeyMultibase;
      bjjPrivKey = bjjKp.privateKeyMultibase;
    });
  });
  describe('Bjj test scenario', function () {
    it('Should be able to generate and register a DID using the Ed25519 key type, and update it by adding a Baby JubJub (BJJ) verification method (VM)', async function () {
      didDocument = await hsSdk.did.generate({ publicKeyMultibase });
      didDocId = didDocument['id'];
      verificationMethodId = didDocument['verificationMethod'][0].id;
      await hsSdk.did.register({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
      });
      const didDocWithBjjVM = await hsSdk.did.addVerificationMethod({
        didDocument,
        type: VerificationMethodTypes.BabyJubJubKey2021,
        publicKeyMultibase: bjjPubKey,
      });
      const resolvedDid = await hsSdk.did.resolve({ did: didDocId });
      delete didDocWithBjjVM.alsoKnownAs;
      const bjjSign = await hsSdk.did.bjjDID.update({
        didDocument: didDocWithBjjVM,
        privateKeyMultibase: bjjPrivKey,
        verificationMethodId: didDocWithBjjVM.verificationMethod[1].id,
        versionId: resolvedDid.didDocumentMetadata.versionId,
        readonly: true,
      });
      await hsSdk.did.update({
        didDocument: didDocWithBjjVM,
        privateKeyMultibase,
        verificationMethodId: verificationMethodId,// need to check this
        versionId: resolvedDid.didDocumentMetadata.versionId,
        otherSignInfo: bjjSign.signInfos,
      });
      const resolvedBjjDid = await hsSdk.did.resolve({ did: didDocId })
      // console.log(resolvedBjjDid)
    });

    it('Should be able to generate and register a DID using the Bjj key type, and update it by adding a Ed255 verification method (VM)', async function () {
      const holderDidDocument = await hsSdk.did.bjjDID.generate({ publicKeyMultibase: bjjPubKey });
      subjectDid = holderDidDocument['id'];
      const verificationMethodId = holderDidDocument['verificationMethod'][0].id;
      await hsSdk.did.bjjDID.register({
        didDocument: holderDidDocument,
        privateKeyMultibase: bjjPrivKey,
        verificationMethodId,
      });
      const didDocWithEdd255VM = await hsSdk.did.addVerificationMethod({
        didDocument: holderDidDocument,
        type: VerificationMethodTypes.Ed25519VerificationKey2020,
        publicKeyMultibase,
      });
      const resolvedDid = await hsSdk.did.resolve({ did: subjectDid });
      delete didDocWithEdd255VM.alsoKnownAs;
      const ed255Sign = await hsSdk.did.update({
        didDocument: didDocWithEdd255VM,
        privateKeyMultibase: privateKeyMultibase,
        verificationMethodId: didDocWithEdd255VM.verificationMethod[1].id,
        versionId: resolvedDid.didDocumentMetadata.versionId,
        readonly: true,
      });
      delete didDocWithEdd255VM.proof
      await hsSdk.did.bjjDID.update({
        didDocument: didDocWithEdd255VM,
        privateKeyMultibase: bjjPrivKey,
        verificationMethodId: verificationMethodId,
        versionId: resolvedDid.didDocumentMetadata.versionId,
        otherSignInfo: ed255Sign.signInfos,
      });
      const resolvedBjjDid = await hsSdk.did.resolve({ did: subjectDid })
      // console.log(resolvedBjjDid.didDocument.verificationMethod, 'resolvedBjjDid');
    });

  });

  describe('Register did with two vm together', function () {
    it('Should be able to generate a DID BJJ and register it by adding Ed255 VM', async function () {
      const ed25519Kp = await hsSdk.did.generateKeys();
      IssuerKp = await hsSdk.did.bjjDID.generateKeys();
      issuerDidDoc = await hsSdk.did.bjjDID.generate({ publicKeyMultibase: IssuerKp.publicKeyMultibase });
      issuerDid = issuerDidDoc['id']
      const verificationMethodId = issuerDidDoc['verificationMethod'][0].id;
      const didDocWithEdd255VM = await hsSdk.did.addVerificationMethod({
        didDocument: issuerDidDoc,
        type: VerificationMethodTypes.Ed25519VerificationKey2020,
        publicKeyMultibase: ed25519Kp.publicKeyMultibase,
      });
      delete didDocWithEdd255VM.alsoKnownAs;
      let ed255Sign = await hsSdk.did.createSignInfos({
        didDocument: didDocWithEdd255VM,
        privateKeyMultibase: ed25519Kp.privateKeyMultibase,
        verificationMethodId: didDocWithEdd255VM.verificationMethod[1].id,
      });
      ed255Sign = ed255Sign[0]
      delete didDocWithEdd255VM.proof
      let bjjSign = await hsSdk.did.bjjDID.createSignInfos({
        didDocument: didDocWithEdd255VM,
        privateKeyMultibase: IssuerKp.privateKeyMultibase,
        verificationMethodId: verificationMethodId,
      });
      bjjSign = bjjSign[0]

      const registeredDid = await hsSdk.did.registerByClientSpec({
        didDocument: didDocWithEdd255VM,
        signInfos: [

          {
            type: bjjSign.type,
            verification_method_id: bjjSign.verification_method_id,
            privateKeyMultibase: IssuerKp.privateKeyMultibase,
            signature: bjjSign.signature,
            created: bjjSign.created
          },
          {
            type: ed255Sign.type,
            verification_method_id: ed255Sign.verification_method_id,
            privateKeyMultibase: ed25519Kp.privateKeyMultibase,
            signature: ed255Sign.signature,
            created: ed255Sign.created
          },
        ]
      })
      //console.log(registeredDid)
    });

    it('Should be able to generate a Ed255 Did and register it by adding Bjj VM', async function () {
      const ed25519Kp = await hsSdk.did.generateKeys();
      holderKp = await hsSdk.did.bjjDID.generateKeys();
      holderDidDoc = await hsSdk.did.generate({ publicKeyMultibase: ed25519Kp.publicKeyMultibase });
      holderDid = holderDidDoc['id']
      const verificationMethodId = holderDidDoc['verificationMethod'][0].id;
      const didDocWithBJJVM = await hsSdk.did.addVerificationMethod({
        didDocument: holderDidDoc,
        type: VerificationMethodTypes.BabyJubJubKey2021,
        publicKeyMultibase: holderKp.publicKeyMultibase,
      });
      delete didDocWithBJJVM.alsoKnownAs;
      let bjjSign = await hsSdk.did.bjjDID.createSignInfos({
        didDocument: didDocWithBJJVM,
        privateKeyMultibase: holderKp.privateKeyMultibase,
        verificationMethodId: didDocWithBJJVM.verificationMethod[1].id,
      });
      bjjSign = bjjSign[0]
      let ed255Sign = await hsSdk.did.createSignInfos({
        didDocument: didDocWithBJJVM,
        privateKeyMultibase: ed25519Kp.privateKeyMultibase,
        verificationMethodId,
      });
      ed255Sign = ed255Sign[0]
      const registeredDid = await hsSdk.did.registerByClientSpec({
        didDocument: didDocWithBJJVM,
        signInfos: [
          {
            type: 'Ed25519Signature2020',
            verification_method_id: verificationMethodId,
            privateKeyMultibase: ed25519Kp.privateKeyMultibase,
            signature: ed255Sign.signature,
            created: ed255Sign.created
          },
          {
            type: 'BJJSignature2021',
            verification_method_id: bjjSign.verification_method_id,
            privateKeyMultibase: holderKp.privateKeyMultibase,
            signature: bjjSign.signature,
            created: bjjSign.created
          },
        ]
      })
      // console.log(registeredDid)
    });
  });

});

describe('#generate() method to create schema', function () {
  it('should be able to create a new schema', async function () {
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
  });

});

describe('#sign() function to sign schema', function () {
  it('should be able to sign newly created schema', async function () {
    const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject))
    signedSchema = await hsSdk.schema.hypersignBjjschema.sign({
      privateKeyMultibase: IssuerKp.privateKeyMultibase,
      schema: tempSchemaBody,
      verificationMethodId: issuerDidDoc.verificationMethod[0].id,
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
  it('should be able to register schema on blockchain', async function () {
    const registeredSchema = await hsSdk.schema.hypersignBjjschema.register({
      schema: signedSchema,
    });
    should().exist(registeredSchema.transactionHash);
  });
});

describe('Verifiable Credential Opearations', () => {
  describe('#generate() method to generate a credential', function () {
    it('should be able to generate new credential for a schema with subject DID', async function () {
      const expirationDate = new Date('12/11/2027');
      const tempCredentialBody = { ...credentialBody };
      tempCredentialBody.schemaId = schemaId;
      tempCredentialBody.subjectDid = holderDid;
      tempCredentialBody['expirationDate'] = expirationDate.toString();
      tempCredentialBody.issuerDid = issuerDid;
      tempCredentialBody.fields = { name: 'varsha' };
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

  });

  describe('#issueCredential() method for issuing credential', function () {

    it('should be able to issue credential with credential status registered on chain', async function () {
      const tempIssueCredentialBody = { ...issueCredentialBody };
      tempIssueCredentialBody.credential = credentialDetail;
      tempIssueCredentialBody.issuerDid = issuerDid;
      tempIssueCredentialBody.verificationMethodId = issuerDidDoc.verificationMethod[0].id;
      tempIssueCredentialBody.privateKeyMultibase = IssuerKp.privateKeyMultibase;
      const issuedCredResult = await hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
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
      expect(credentialStatusProof).to.be.a('object');
      should().exist(credentialStatusProof['type']);
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

  });
  describe('#verifyCredential() method to verify a credential', function () {
    it('should be able to verify credential', async function () {
      const params = {
        credential: signedVC,
        issuerDid: issuerDid,
        verificationMethodId: issuerDidDoc.verificationMethod[0].id,
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
  });
});
describe('Verifiable Presentation Operataions', () => {
  describe('#generate() method to generate new presentation document', () => {
    it('should be able to generate a new presentation document', async () => {
      const presentationBody = {
        verifiableCredentials: [credentialDetail],
        holderDid: holderDid,
      };
      const tempPresentationBody = { ...presentationBody };
      tempPresentationBody.verifiableCredentials[0] = credentialDetail;
      tempPresentationBody.holderDid = holderDid;
      unsignedverifiablePresentation = await hsSdk.vp.bjjVp.generate(tempPresentationBody);
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

    it('should be able a sign presentation document', async () => {
      const tempSignPresentationBody = { ...signPresentationBody };
      tempSignPresentationBody.presentation = unsignedverifiablePresentation;
      tempSignPresentationBody.holderDid = holderDid;
      tempSignPresentationBody.verificationMethodId = holderDidDoc.verificationMethod[1].id;
      tempSignPresentationBody.privateKeyMultibase = holderKp.privateKeyMultibase;
      tempSignPresentationBody.challenge = "abc";
      tempSignPresentationBody['domain'] = "http://xyz.com";
      signedVerifiablePresentation = await hsSdk.vp.bjjVp.sign(tempSignPresentationBody);
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

    it('should be able to verify signed presentation document', async () => {
      const tempverifyPresentationBody = { ...verifyPresentationBody };
      tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
      tempverifyPresentationBody.issuerDid = issuerDid;
      tempverifyPresentationBody.holderDid = holderDid;
      tempverifyPresentationBody.holderVerificationMethodId = holderDidDoc.verificationMethod[1].id;
      tempverifyPresentationBody.issuerVerificationMethodId = issuerDidDoc.verificationMethod[0].id;
      tempverifyPresentationBody.challenge = "abc";
      tempverifyPresentationBody['domain'] = "http://xyz.com"
      const verifiedPresentationDetail = await hsSdk.vp.bjjVp.verify(tempverifyPresentationBody);
      should().exist(verifiedPresentationDetail['verified']);
      expect(verifiedPresentationDetail.verified).to.be.equal(true);
      should().exist(verifiedPresentationDetail['results']);
      expect(verifiedPresentationDetail.results).to.be.a('array');
      expect(verifiedPresentationDetail.results[1].credentialResult).to.be.a('array');
      expect(verifiedPresentationDetail.results[1].credentialResult.length).to.be.greaterThan(0);
      expect(verifiedPresentationDetail.results[1].credentialResult[0].verified).to.be.equal(true);
    });

  });

})
