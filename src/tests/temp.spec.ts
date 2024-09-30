import { expect, should } from 'chai';
import { HypersignDID, HypersignSSISdk } from '../index';
import { IPublicKey, IController } from '../did/IDID';

import { createWallet, mnemonic, hidNodeEp } from './config';
import { VerificationMethodTypes } from '../../libs/generated/ssi/client/enums';
let offlineSigner;
// let hypersignDID;
let hypersignBjjDID;
let hsSdk;
let privateKeyMultibase;
let publicKeyMultibase;
let didDocument;
let didDocId;
let verificationMethodId;
let didDocWithBjjVM;
let bjjPubKey;
let bjjPrivKey;
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
      // const kp = await hsSdk.did.bjjDID.generateKeys();
      privateKeyMultibase = kp.privateKeyMultibase;
      publicKeyMultibase = kp.publicKeyMultibase;
      const bjjKp = await hsSdk.did.bjjDID.generateKeys();
      bjjPubKey = bjjKp.publicKeyMultibase;
      bjjPrivKey = bjjKp.privateKeyMultibase;
    });
  });
  describe('#generate() to generate did', function () {
    it('should not be able to generate and add bjj vm to did document', async function () {
      didDocument = await hsSdk.did.generate({ publicKeyMultibase });
      // didDocument = await hsSdk.did.bjjDID.generate({ publicKeyMultibase });

      didDocId = didDocument['id'];
      verificationMethodId = didDocument['verificationMethod'][0].id;
      await hsSdk.did.register({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
      });
      didDocWithBjjVM = await hsSdk.did.addVerificationMethod({
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
      delete didDocWithBjjVM.verificationMethod[1].blockChainAccountId;
      const registerDid = await hsSdk.did.update({
        didDocument: didDocWithBjjVM,
        privateKeyMultibase,
        verificationMethodId,
        versionId: resolvedDid.didDocumentMetadata.versionId,
        otherSignInfo: bjjSign.signInfos,
      });
      console.log(registerDid, 'registeredDid');
    });
  });
});
