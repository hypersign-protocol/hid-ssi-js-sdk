import { expect, should } from 'chai';
import { HypersignDID, HypersignSSISdk } from '../index';
import { IPublicKey, IController, IDID } from '../did/IDID';

import { createWallet, mnemonic, hidNodeEp } from './config';
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let versionId;
let hypersignDID;
let transactionHash;
let signedDocument;
const challenge = '1231231231';
const domain = 'www.adbv.com';
let hypersignSSISDK;

//add mnemonic of wallet that have balance

beforeEach(async function () {
  offlineSigner = await createWallet(mnemonic);
  const params = {
    offlineSigner,
    nodeRestEndpoint: hidNodeEp.rest,
    nodeRpcEndpoint: hidNodeEp.rpc,
    namespace: hidNodeEp.namespace,
  };
  hypersignDID = new HypersignDID(params);
  await hypersignDID.init();
});

describe('DID Test scenarios', () => {
  //remove seed while creating did so that wallet can generate different did every time
  describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', async function () {
      const kp = await hypersignDID.generateKeys();
      privateKeyMultibase = kp.privateKeyMultibase;
      publicKeyMultibase = kp.publicKeyMultibase;
      expect(kp).to.be.a('object');
      should().exist(kp.privateKeyMultibase);
      should().exist(kp.publicKeyMultibase);
      should().not.exist(kp.id);
    });

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

    it('should able to sign did document', async function () {
      const params = {
        privateKeyMultibase: privateKeyMultibase as string,
        challenge: challenge as string,
        domain: domain as string,
        did: '', // This is taken as empty as didDoc is yet not register on blockchain and won't able to resolve based on did
        didDocument: didDocument as object,
        verificationMethodId: verificationMethodId as string,
      };
      signedDocument = await hypersignDID.sign(params);
      //console.log(JSON.stringify(signedDocument))
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

    it('should return verification result', async function () {
      const result = await hypersignDID.verify({
        didDocument: signedDocument,
        verificationMethodId,
        challenge,
        domain,
      });
      console.log(JSON.stringify(result, null, 2));

      expect(result).to.be.a('object');
      should().exist(result);
      should().exist(result.verified);
      should().exist(result.results);
      expect(result.results).to.be.a('array');
      expect(result.verified).to.equal(true);
    });
  });
});
