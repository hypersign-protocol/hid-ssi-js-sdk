import { IDidDocument, ISignedDIDDocument, IDidManager } from './types';
import { BaseSigner } from '../signers/types';
import DidDocumentMessage from '../signers/messages/DidDocumentMessage';

export default class DIDManager implements IDidManager {
    async sign(params: {
        didDocument: IDidDocument;
        signer: BaseSigner
    }): Promise<ISignedDIDDocument>{
        const { signer , didDocument}    = params;
        const didDocMessage  = new DidDocumentMessage(didDocument)
        const proof = await signer.ldSign(didDocMessage, 'AssertionProofPurpose')
        return proof;
    }


    // register(params: {
    //     signedDidDocument: ISignedDIDDocument; 
    // }): Promise<{ didDocument: IDidDocument; transactionHash: string }> {} 


    

}

