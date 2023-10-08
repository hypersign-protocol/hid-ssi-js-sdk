import Ed25519Signer from '../../v2.0/signers/ed25519/Ed25519Signer'
import { expect, should } from 'chai';
import TextMessage from '../../v2.0/signers/messages/TextMessage';
import DidDocumentMessage  from '../../v2.0/signers/messages/DidDocumentMessage';
import { IDidDocument } from '../../v2.0/did/types';
import DIDManager from '../../v2.0/did/DIDManager'

import DIDDocument from '../../v2.0/did/DIDDocument';
import Ed25519VerificationMethod from '../../v2.0/did/Ed25519VerificationMethod';

import { createWallet, mnemonic, hidNodeEp } from '../config';


  //remove seed while creating did so that wallet can generate different did every time
  describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', async function () {
      const ed25519Signer = new Ed25519Signer({ controller: 'did:hid:testnet:123123123'})
      const kp = await ed25519Signer.initiate();
      console.log(kp)

      // const message = new TextMessage('Hello')
      // const signature = await ed25519Signer.sign(message)
      // console.log(signature)


      const ed25519VerMetho = new Ed25519VerificationMethod(ed25519Signer)
      const hsDIDDoc = new DIDDocument(
         [ed25519VerMetho.getVerificationMethod()],
         ['authentication', 'assertionMethod'],
         ed25519Signer.controller,
         [ed25519Signer.controller]
      )
      console.log(hsDIDDoc.getDIDDocument())

      
      const offlineSigner = await createWallet(mnemonic);
      const params = {
        offlineSigner,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
      };

  
      const didManager = new DIDManager(params)
      await didManager.init();


      const proof = await didManager.sign({  didDocument: hsDIDDoc.getDIDDocument(), signer: ed25519Signer})
      console.log(proof)

      const response = await didManager.register({ signedDidDocument:  proof })
      console.log(response)

      expect(kp).to.be.a('object');
    })
  })