import { expect, should } from 'chai';
import HypersignSSISdk from '../index';
import { createWallet, mnemonic, hidNodeEp } from './config';
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
let hsSdk;
let credentialId;
let credentialDetail;
let verifiablePresentation;
let signedPresentation;
let verifiableCredentialPresentationId;
let credentialStatusId;
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
  privateKey: privateKeyMultibase,
};
beforeEach(async function () {
  offlineSigner = await createWallet(mnemonic);
  hsSdk = new HypersignSSISdk(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
  await hsSdk.init();
});
// Generate public and private key pair
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
//Generate did
describe('#generate() to generate did', function () {
  it('should be able to generate didDocument', async function () {
    didDocument = await hsSdk.did.generate({ publicKeyMultibase });
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
  const publicKey = {
    '@context': '',
    id: '',
    type: '',
    publicKeyBase58: '',
  };
  const controller = {
    '@context': '',
    id: '',
    authentication: [],
  };
  it('should able to sign did document', async function () {
    const params = {
      privateKey: privateKeyMultibase as string,
      challenge: challenge as string,
      domain: domain as string,
      did: '',
      doc: didDocument as object,
      verificationMethodId: verificationMethodId as string,
      publicKey,
      controller,
    };
    signedDocument = await hsSdk.did.signDid(params);
    expect(signedDocument).to.be.a('object');
    signedDocument = signedDocument.signedDidDocument;
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
    const result = await hsSdk.did.register({ didDocument, privateKeyMultibase, verificationMethodId });
    should().exist(result.code);
    should().exist(result.height);
    should().exist(result.rawLog);
    should().exist(result.transactionHash);
    should().exist(result.gasUsed);
    should().exist(result.gasWanted);
  });
});
// Generate schema
describe('#getSchema() method to create schema', function () {
  it('should able to create a new schema', async function () {
    schemaBody.author = didDocId;
    schemaObject = await hsSdk.schema.getSchema(schemaBody);
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
    const signedSchema = await hsSdk.schema.signSchema({ privateKey: privateKeyMultibase, schema: schemaObject });
    schemaSignature = signedSchema;
    expect(signedSchema).to.be.a('string');
  });
});
describe('#registerSchema() function to register schema on blockchain', function () {
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
//  Test case related to credential

describe('#getCredential() method to generate a credential', function () {
  it('should not be able to generate new credential for a schema as both subjectDid and subjectDidDocSigned is passed', async function () {
    const tempCredentialBody = { ...credentialBody };
    tempCredentialBody.issuerDid = didDocId;
    tempCredentialBody.subjectDid = didDocId;
    tempCredentialBody['subjectDidDocSigned'] = signedDocument;
    return hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Both subjectDid and subjectDidDoc cannot be passed');
    });
  });
  it('should not be able to generate new credential for a schema as not able to resolve subjectDid or subjectDidDoc as  neither subjectDid nor subjectDidDocSigned is passed', async function () {
    const tempCredentialBody = { ...credentialBody };
    tempCredentialBody.issuerDid = didDocId;
    return hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: Could not resolve the subjectDid or subjectDidDoc');
    });
  });
  it('should not be able to generate new credential for a schema as nether schemaId nor schema Context is passed', async function () {
    const tempCredentialBody = { ...credentialBody };
    tempCredentialBody.issuerDid = didDocId;
    tempCredentialBody['subjectDidDocSigned'] = signedDocument;
    return hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
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
    return hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
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
    return hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
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
    tempCredentialBody['expirationDate'] = expirationDate;
    tempCredentialBody.issuerDid = didDocId;
    return hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
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
    tempCredentialBody['expirationDate'] = expirationDate;
    tempCredentialBody.issuerDid = didDocId;
    tempCredentialBody.fields['type'] = 'string';
    tempCredentialBody.fields['value'] = 'Varsha';
    tempCredentialBody.fields['name'] = 'name';
    return hsSdk.vc.getCredential(tempCredentialBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(
        Error,
        `Only ["${schemaBody.fields[0].name}"] attributes are possible. additionalProperties is false in the schema`
      );
    });
  });
  it('should be able to generate new credential for a schema', async function () {
    const expirationDate = new Date('12/11/2027');
    const tempCredentialBody = { ...credentialBody };
    tempCredentialBody.schemaId = schemaId;
    tempCredentialBody['subjectDidDocSigned'] = signedDocument;
    tempCredentialBody['expirationDate'] = expirationDate;
    tempCredentialBody.issuerDid = didDocId;
    tempCredentialBody.fields = { name: 'varsha' };
    credentialDetail = await hsSdk.vc.getCredential(tempCredentialBody);
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
  it('should not be able to issueCredential as verificationMethodId is null or empty', async function () {
    const tempIssueCredentialBody = { ...issueCredentialBody };
    tempIssueCredentialBody.credential = credentialDetail;
    tempIssueCredentialBody.issuerDid = didDocId;
    tempIssueCredentialBody.verificationMethodId = '';
    tempIssueCredentialBody.privateKey = privateKeyMultibase;
    return hsSdk.vc.issueCredential(tempIssueCredentialBody).catch(function (err) {
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
    tempIssueCredentialBody.privateKey = privateKeyMultibase;
    return hsSdk.vc.issueCredential(tempIssueCredentialBody).catch(function (err) {
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
    tempIssueCredentialBody.privateKey = '';
    return hsSdk.vc.issueCredential(tempIssueCredentialBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKey is required to issue credential');
    });
  });
  it('should not be able to issueCredential as issuerDid is null or empty', async function () {
    const tempIssueCredentialBody = { ...issueCredentialBody };
    tempIssueCredentialBody.credential = credentialDetail;
    tempIssueCredentialBody.issuerDid = '';
    tempIssueCredentialBody.verificationMethodId = verificationMethodId;
    tempIssueCredentialBody.privateKey = publicKeyMultibase;
    return hsSdk.vc.issueCredential(tempIssueCredentialBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to issue credential');
    });
  });
  it('should be able to issue credential to particular user', async function () {
    const tempIssueCredentialBody = { ...issueCredentialBody };
    tempIssueCredentialBody.credential = credentialDetail;
    tempIssueCredentialBody.issuerDid = didDocId;
    tempIssueCredentialBody.verificationMethodId = verificationMethodId;
    tempIssueCredentialBody.privateKey = privateKeyMultibase;
    const issuedCredResult = await hsSdk.vc.issueCredential(tempIssueCredentialBody);
    credentialStatusId = issuedCredResult['credentialStatus'].id;
    expect(issuedCredResult).to.be.a('object');
    should().exist(issuedCredResult['@context']);
    should().exist(issuedCredResult['id']);
    should().exist(issuedCredResult['type']);
    should().exist(issuedCredResult['expirationDate']);
    should().exist(issuedCredResult['issuanceDate']);
    should().exist(issuedCredResult['issuer']);
    should().exist(issuedCredResult['credentialSubject']);
    should().exist(issuedCredResult['credentialSchema']);
    should().exist(issuedCredResult['credentialStatus']);
    should().exist(issuedCredResult['proof']);
    expect(issuedCredResult['id']).to.be.equal(credentialId);    
  });

  it('should be able to issue credential but will not register on chain',async ()=>{

    const expirationDate = new Date('12/11/2027');
    const tempCredentialBody = { ...credentialBody };
    tempCredentialBody.schemaId = schemaId;
    tempCredentialBody['subjectDidDocSigned'] = signedDocument;
    tempCredentialBody['expirationDate'] = expirationDate;
    tempCredentialBody.issuerDid = didDocId;
    tempCredentialBody.fields = { name: 'varshaxyz' };
    const newCredDetails=await hsSdk.vc.getCredential(tempCredentialBody)

    const tempIssueCredentialBody = { ...issueCredentialBody }; 

    
    tempIssueCredentialBody['registerCredential']=false
    tempIssueCredentialBody.credential = newCredDetails;
    tempIssueCredentialBody.issuerDid = didDocId;
    tempIssueCredentialBody.verificationMethodId = verificationMethodId;
    tempIssueCredentialBody.privateKey = privateKeyMultibase;
    const issuedCredResult = await hsSdk.vc.issueCredential(tempIssueCredentialBody);

    credentialStatusId = issuedCredResult['credentialStatus'].id;
    expect(issuedCredResult).to.be.a('object');
    should().exist(issuedCredResult['@context']);
    should().exist(issuedCredResult['id']);
    should().exist(issuedCredResult['type']);
    should().exist(issuedCredResult['expirationDate']);
    should().exist(issuedCredResult['issuanceDate']);
    should().exist(issuedCredResult['issuer']);
    should().exist(issuedCredResult['credentialSubject']);
    should().exist(issuedCredResult['credentialSchema']);
    should().exist(issuedCredResult['credentialStatus']);
    should().exist(issuedCredResult['proof']);
    expect(issuedCredResult['id']).to.be.equal(credentialId);    

  })


});

describe('#verifyCredential() method to verify a credential', function () {
  it('should not be able to verify credential as verificationMethodId is null or empty', async function () {
    const params = {
      credential: credentialDetail,
      issuerDid: didDocId,
      verificationMethodId,
    };
    params.verificationMethodId = '';
    return hsSdk.vc.verifyCredential(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to verify credential');
    });
  });
  it('should not be able to verify credential as credential is null or undefined', async function () {
    const params = {
      credential: credentialDetail,
      issuerDid: didDocId,
      verificationMethodId,
    };
    params.credential = undefined;
    return hsSdk.vc.verifyCredential(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Credential is required to verify credential');
    });
  });
  it('should not be able to verify credential as credential is null or empty', async function () {
    const params = {
      credential: credentialDetail,
      issuerDid: didDocId,
      verificationMethodId,
    };
    params.issuerDid = '';
    return hsSdk.vc.verifyCredential(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to verify credential');
    });
  });
  it('should be able to verify credential', async function () {
    const params = {
      credential: credentialDetail,
      issuerDid: didDocId,
      verificationMethodId,
    };
    const verificationResult = await hsSdk.vc.verifyCredential(params);
    expect(verificationResult).to.be.a('object');
    should().exist(verificationResult.verified);
    expect(verificationResult.verified).to.be.equal(true);
    should().exist(verificationResult.results);
    expect(verificationResult.results).to.be.a('array');
    should().exist(verificationResult.statusResult);
    expect(verificationResult.statusResult.verified).to.be.equal(true);
  });
});

describe('#checkCredentialStatus() method to check status of the credential', function () {
  it('should not be able to check credential as credentialId is null or empty', async function () {
    return hsSdk.vc.checkCredentialStatus().catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'CredentialId must be passed to check its status');
    });
  });
  it('should not be able to check credential as credentialId is invalid', async function () {
    return hsSdk.vc.checkCredentialStatus({ credentialId: credentialId + 'x' }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'No credential status found. Probably invalid credentialId');
    });
  });
  it('should be able to check credential status', async function () {
    const credentialStatus = await hsSdk.vc.checkCredentialStatus(credentialId);
    expect(credentialStatus).to.be.a('object');
    should().exist(credentialStatus.verified);
    expect(credentialStatus.verified).to.be.equal(true);
  });
});
describe('#updateCredentialStatus this method is to change credential status to revoked or suspended', function () {
  it('should be able to change credential status to suspended', async function () {
    const credentialStatus = await hsSdk.vc.resolveCredentialStatus({ credentialId });
    const params = {
      credStatus: credentialStatus,
      issuerDid: didDocId,
      verificationMethodId,
      privateKey: privateKeyMultibase,
      status: 'SUSPENDED',
      statusReason: 'Suspending this credential for some time',
    };
    const updatedCredResult = await hsSdk.vc.updateCredentialStatus(params);
    expect(updatedCredResult).to.be.a('object');
    expect(updatedCredResult.code).to.be.equal(0);
  });

  it('should be able to change credential status to Live', async function () {
    const credentialStatus = await hsSdk.vc.resolveCredentialStatus({ credentialId });
    const params = {
      credStatus: credentialStatus,
      issuerDid: didDocId,
      verificationMethodId,
      privateKey: privateKeyMultibase,
      status: 'LIVE',
      statusReason: 'Setting the status to LIVE',
    };
    const updatedCredResult = await hsSdk.vc.updateCredentialStatus(params);
    expect(updatedCredResult).to.be.a('object');
    expect(updatedCredResult.code).to.be.equal(0);
  });
});

//Test case for verifying presentation

describe('#getPresentation() method to generate presentation', function () {
  const presentationBody = {
    verifiableCredentials: [credentialDetail],
    holderDid: didDocId,
  };
  it('should be able to generate presentation', async function () {
    const tempPresentationBody = { ...presentationBody };
    tempPresentationBody.verifiableCredentials[0] = credentialDetail;
    tempPresentationBody.holderDid = didDocId;
    verifiablePresentation = await hsSdk.vp.getPresentation(tempPresentationBody);
    should().exist(verifiablePresentation['@context']);
    should().exist(verifiablePresentation['type']);
    expect(verifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
    should().exist(verifiablePresentation['verifiableCredential']);
    expect(verifiablePresentation.verifiableCredential).to.be.a('array');
    should().exist(verifiablePresentation['id']);
    should().exist(verifiablePresentation['holder']);
    verifiableCredentialPresentationId = verifiablePresentation.id;
    expect(verifiablePresentation['verifiableCredential'][0].id).to.be.equal(credentialId);
  });
});

describe('#signPresentation() method to sign presentation', function () {
  const signPresentationBody = {
    presentation: verifiablePresentation,
    holderDid: didDocId,
    verificationMethodId,
    privateKey: privateKeyMultibase,
    challenge,
  };
  it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
    const tempSignPresentationBody = { ...signPresentationBody };
    tempSignPresentationBody.presentation = verifiablePresentation;
    tempSignPresentationBody.holderDid = didDocId;
    tempSignPresentationBody.verificationMethodId = verificationMethodId;
    tempSignPresentationBody.privateKey = privateKeyMultibase;
    tempSignPresentationBody['holderDidDocSigned'] = signedDocument;
    return hsSdk.vp.signPresentation(tempSignPresentationBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
    });
  });
  it('should not be able to sign presentation as privateKey in null or empty', async function () {
    const tempSignPresentationBody = { ...signPresentationBody };
    tempSignPresentationBody.privateKey = '';
    return hsSdk.vp.signPresentation(tempSignPresentationBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: params.privateKey is required for signinng a presentation');
    });
  });
  it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
    const tempSignPresentationBody = { ...signPresentationBody };
    tempSignPresentationBody.privateKey = privateKeyMultibase;
    tempSignPresentationBody.presentation = undefined;

    return hsSdk.vp.signPresentation(tempSignPresentationBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: params.presentation is required for signinng a presentation');
    });
  });
  it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
    const tempSignPresentationBody = { ...signPresentationBody };
    tempSignPresentationBody.privateKey = privateKeyMultibase;
    tempSignPresentationBody.presentation = verifiablePresentation;
    tempSignPresentationBody.challenge = '';
    return hsSdk.vp.signPresentation(tempSignPresentationBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for signinng a presentation');
    });
  });
  it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
    const tempSignPresentationBody = { ...signPresentationBody };
    tempSignPresentationBody.privateKey = privateKeyMultibase;
    tempSignPresentationBody.presentation = verifiablePresentation;
    tempSignPresentationBody.challenge = challenge;
    tempSignPresentationBody.verificationMethodId = '';
    return hsSdk.vp.signPresentation(tempSignPresentationBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: params.verificationMethodId is required for signinng a presentation');
    });
  });
  it('should be able to sign presentation', async function () {
    const tempSignPresentationBody = { ...signPresentationBody };
    tempSignPresentationBody.presentation = verifiablePresentation;
    tempSignPresentationBody.holderDid = didDocId;
    tempSignPresentationBody.verificationMethodId = verificationMethodId;
    tempSignPresentationBody.privateKey = privateKeyMultibase;
    signedPresentation = await hsSdk.vp.signPresentation(tempSignPresentationBody);
    should().exist(signedPresentation['@context']);
    should().exist(signedPresentation['type']);
    expect(signedPresentation.type[0]).to.be.equal('VerifiablePresentation');
    should().exist(signedPresentation['verifiableCredential']);
    expect(signedPresentation.id).to.be.equal(verifiableCredentialPresentationId);
  });
});

describe('#verifyPresentation() method to verify presentation', function () {
  const verifyPresentationBody = {
    signedPresentation: signedPresentation,
    holderDid: didDocId,
    holderVerificationMethodId: verificationMethodId,
    issuerVerificationMethodId: verificationMethodId,
    privateKey: privateKeyMultibase,
    challenge,
    issuerDid: didDocId,
  };
  it('should not be able to verify presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
    const tempverifyPresentationBody = { ...verifyPresentationBody };
    tempverifyPresentationBody.signedPresentation = signedPresentation;
    tempverifyPresentationBody.holderDid = didDocId;
    tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
    tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
    tempverifyPresentationBody.privateKey = privateKeyMultibase;
    tempverifyPresentationBody['holderDidDocSigned'] = signedDocument;
    return hsSdk.vp.verifyPresentation(tempverifyPresentationBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
    });
  });
  it('should not be able to verify presentation as issuerDid is null or empty', async function () {
    const tempverifyPresentationBody = { ...verifyPresentationBody };
    tempverifyPresentationBody.issuerDid = '';
    return hsSdk.vp.verifyPresentation(tempverifyPresentationBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
    });
  });
  it('should not be able to verify presentation as challenge is null or empty', async function () {
    const tempverifyPresentationBody = { ...verifyPresentationBody };
    tempverifyPresentationBody.issuerDid = didDocId;
    tempverifyPresentationBody.challenge = '';

    return hsSdk.vp.verifyPresentation(tempverifyPresentationBody).catch(function (err) {
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

    return hsSdk.vp.verifyPresentation(tempverifyPresentationBody).catch(function (err) {
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

    return hsSdk.vp.verifyPresentation(tempverifyPresentationBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
    });
  });
  it('should be able to verify presentation', async function () {
    const tempverifyPresentationBody = { ...verifyPresentationBody };
    tempverifyPresentationBody.signedPresentation = signedPresentation;
    tempverifyPresentationBody.issuerDid = didDocId;
    tempverifyPresentationBody.holderDid = didDocId;
    tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
    tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
    tempverifyPresentationBody.challenge = didDocId;
    const verifiedPresentationDetail = await hsSdk.vp.verifyPresentation(tempverifyPresentationBody);
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
