import TextMessage  from '../messages/TextMessage';
import DidDocumentMessage from '../messages/DidDocumentMessage';
import Ed25519KeyManager from './Ed25519KeyManager';
import { BaseSigner, Purpose, BaseMessage } from '../types';
import * as constant from '../../../constants';
import jsonSigs from 'jsonld-signatures';
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
import {Ed25519Signature2020, suiteContext} from '@digitalbazaar/ed25519-signature-2020';
import Utils from '../../../utils';
import customLoader from '../../../../libs/w3cache/v1';
import  { ISignedDIDDocument } from '../../../v2.0/did/types'



export default class Ed25519Signer extends Ed25519KeyManager implements BaseSigner{
    constructor(params : {seed?: string | Uint8Array; controller?: string} ){
        super(params);
    }
    async sign<T extends TextMessage | DidDocumentMessage>(message: T): Promise<string> {
        const messageBytes = await message.encode()
        const signatureBytes = await this.signer.sign({data: messageBytes})
        return Buffer.from(signatureBytes).toString('base64');
    }   

    async ldSign<T extends BaseMessage<any>>(message: T, purposeType: Purpose, challenge?: string, domain?: string): Promise<ISignedDIDDocument> {
        const suite = new Ed25519Signature2020({
            signer: this.signer
        })
        suite.date = '2010-01-01T19:23:24Z';
        const jsonDIDDoc = message.message;
        const didDocumentLd = Utils.jsonToLdConvertor(jsonDIDDoc);
        didDocumentLd['@context'].push(constant.VC.CREDENTAIL_SECURITY_SUITE);

        let purpose;
        if(purposeType === 'AssertionProofPurpose'){
            purpose = new AssertionProofPurpose() 
        }

        if(purposeType === 'AuthenticationProofPurpose'){

            if(!challenge){
                throw new Error('Challenge is mandatory for Authentication purpose')
            }

            if(!domain){
                throw new Error('Domain is mandatory for Authentication purpose')
            }

            purpose = new AuthenticationProofPurpose({
                challenge,
                domain,
            })
        }

        const signedDidDocument: ISignedDIDDocument = await jsonSigs.sign(didDocumentLd, {
            suite,
            purpose,
            documentLoader: customLoader,
            compactProof: constant.compactProof,
        })
        return signedDidDocument
    }

}

