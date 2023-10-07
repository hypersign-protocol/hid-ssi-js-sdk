import Ed25519Signer from '../../v2.0/signers/ed25519/Ed25519Signer'
import { expect, should } from 'chai';
import TextMessage from '../../v2.0/signers/messages/TextMessage';
import DidDocumentMessage  from '../../v2.0/signers/messages/DidDocumentMessage';
import { IDidDocument } from '../../v2.0/did/types';


import HypersignDIDDocument from '../../v2.0/did/didDocument';
import Ed25519VerificationMethod from '../../v2.0/did/Ed25519VerificationMethod';
import HypersignDIDManager from '../../v2.0/did/didManager'


  //remove seed while creating did so that wallet can generate different did every time
  describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', async function () {
      const ed25519Signer = new Ed25519Signer({ controller: 'did:hid:123123123'})
      const kp = await ed25519Signer.initiate();
      console.log(kp)

      // const message = new TextMessage('Hello')
      // const signature = await ed25519Signer.sign(message)
      // console.log(signature)


      const ed25519VerMetho = new Ed25519VerificationMethod(ed25519Signer)
      const hsDIDDoc = new HypersignDIDDocument(
         [ed25519VerMetho],
         ['authentication', 'assertionMethod'],
         ed25519Signer.id,
         [ed25519Signer.controller]
      )
      console.log(hsDIDDoc.toString())

      

      const didDocMsgObj = new DidDocumentMessage(hsDIDDoc.getDIDDocument());
      const didManager = new HypersignDIDManager()
      const proof = await didManager.sign({  didDocument: didDocMsgObj, signer: ed25519Signer})
      console.log(proof)

      expect(kp).to.be.a('object');
    })
  })