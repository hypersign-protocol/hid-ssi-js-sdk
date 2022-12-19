import { expect, should } from 'chai';
import HypersignSSISdk from '../index';

import { createWallet, mnemonic, hidNodeEp } from './config';
let hsSdk;
const seed = '';
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let transactionHash;
let versionId;

//add mnemonic of wallet that have balance

beforeEach(async function () {
  offlineSigner = await createWallet(mnemonic);
  hsSdk = new HypersignSSISdk(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
  await hsSdk.init();
});

//remove seed while creating did so that wallet can generate different
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
  it('should not able to register did document and throw error as didDocument is not passed or it is empty', function () {
    return hsSdk.did.register({ didDocument: {}, privateKeyMultibase, verificationMethodId }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, "Cannot read property 'length' of undefined");
    });
  });
  it('should not be able to register did document as privateKeyMultibase is null or empty', function () {
    return hsSdk.did.register({ didDocument, privateKeyMultibase: '', verificationMethodId }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
    });
  });
  it('should not be able to register did document as verificationMethodId is null or empty', function () {
    return hsSdk.did.register({ didDocument, privateKeyMultibase, verificationMethodId: '' }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
    });
  });
  it('should be able to register didDocument in the blockchain', async function () {
    const result = await hsSdk.did.register({ didDocument, privateKeyMultibase, verificationMethodId });
    transactionHash = result.transactionHash;
    should().exist(result.code);
    should().exist(result.height);
    should().exist(result.rawLog);
    should().exist(result.transactionHash);
    should().exist(result.gasUsed);
    should().exist(result.gasWanted);
  });
});

describe('#resolve() this is to resolve didDocument based on didDocId', function () {
  it('should not able to resolve did document and throw error didDocId is not passed', function () {
    return hsSdk.did.resolve({ params: { did: '' } }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a did');
    });
  });
  it('should be able to resolve did', async function () {
    const params = {
      did: didDocId,
    };
    const result = await hsSdk.did.resolve(params);
    expect(result).to.be.a('object');
    expect(result.didDocument.id).to.be.equal(didDocId);
    expect(result.didDocumentMetadata).to.be.a('object');
    versionId = result.didDocumentMetadata.versionId;
  });
});

describe('#update() this is to update didDocument based on didDocId', function () {
  it('should not be able to update did document as privateKeyMultibase is null or empty', function () {
    return hsSdk.did
      .update({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
      });
  });
  it('should not be able to update did document as verificationMethodId is null or empty', function () {
    return hsSdk.did
      .update({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
      });
  });
  it('should not be able to update did document as versionId is null or empty', function () {
    return hsSdk.did
      .update({ didDocument, privateKeyMultibase, verificationMethodId, versionId: '' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
      });
  });
  it('should not be able to update did document as versionId pased is incorrect', function () {
    const updateBody = { didDocument, privateKeyMultibase, verificationMethodId, versionId: '1.0.1' };
    return hsSdk.did.update(updateBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(
        Error,
        `Query failed with (18): failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${updateBody.versionId}: Unexpected DID version: invalid request`
      );
    });
  });
  it('should be able to update did document', async function () {
    const result = await hsSdk.did.update({
      didDocument,
      privateKeyMultibase,
      verificationMethodId,
      versionId,
    });
    should().exist(result.code);
    should().exist(result.height);
    should().exist(result.rawLog);
    should().exist(result.transactionHash);
    should().exist(result.gasUsed);
    should().exist(result.gasWanted);
  });
});
describe('#resolve() did after updating did document', function () {
  it('should be able to resolve did', async function () {
    const params = {
      did: didDocId,
    };
    const result = await hsSdk.did.resolve(params);
    expect(result).to.be.a('object');
    expect(result.didDocument.id).to.be.equal(didDocId);
    expect(result.didDocumentMetadata).to.be.a('object');
    versionId = result.didDocumentMetadata.versionId;
  });
});
describe('#deactivate() this is to deactivate didDocument based on didDocId', function () {
  it('should not be able to deactivate did document as privateKeyMultibase is null or empty', function () {
    return hsSdk.did
      .deactivate({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
      });
  });
  it('should not be able to deactivate did document as verificationMethodId is null or empty', function () {
    return hsSdk.did
      .deactivate({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
      });
  });
  it('should not be able to deactivate did document as versionId is null or empty', function () {
    return hsSdk.did
      .deactivate({ didDocument, privateKeyMultibase, verificationMethodId, versionId: '' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
      });
  });
  it('should not be able to deactivate did document as versionId pased is incorrect', function () {
    const deactivateBody = { didDocument, privateKeyMultibase, verificationMethodId, versionId: '1.0.1' };
    return hsSdk.did.deactivate(deactivateBody).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(
        Error,
        `Query failed with (18): failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${deactivateBody.versionId}: Unexpected DID version: invalid request`
      );
    });
  });
  it('should be able to deactivate did document', async function () {
    const result = await hsSdk.did.deactivate({
      didDocument,
      privateKeyMultibase,
      verificationMethodId,
      versionId,
    });
    should().exist(result.code);
    should().exist(result.height);
    should().exist(result.rawLog);
    should().exist(result.transactionHash);
    should().exist(result.gasUsed);
    should().exist(result.gasWanted);
  });
});
