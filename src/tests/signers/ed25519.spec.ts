import Ed25519Signer from '../../v2.0/signers/ed25519/Ed25519Signer'
import { expect, should } from 'chai';
import TextMessage from '../../v2.0/signers/messages/TextMessage';
import DidDocumentMessage  from '../../v2.0/signers/messages/DidDocumentMessage';
import { IDidDocument } from '../../v2.0/did/types';

const ed25519Signer = new Ed25519Signer({ controller: 'did:hid:123123123'})
function t(){
    const signer = ed25519Signer.initiate();
    console.log(signer)
}


  //remove seed while creating did so that wallet can generate different did every time
  describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', async function () {
      const kp = await ed25519Signer.initiate();
      
      console.log(kp)
      const message = new TextMessage('Hello')
    //   const m2 = new DidDocumentMessage()
      const signature = await ed25519Signer.sign(message)
      console.log(signature)

      expect(kp).to.be.a('object');
    })
  })