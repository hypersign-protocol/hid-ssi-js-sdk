import { IDidDocument, ISignedDIDDocument, IManager } from './types';
import { BaseSigner } from '../signers/types';
import DidDocumentMessage from '../signers/messages/DidDocumentMessage';

export default class DIDManager implements IManager {
    async sign(params: {
        didDocument: DidDocumentMessage;
        signer: BaseSigner
    }): Promise<ISignedDIDDocument>{
        const { signer , didDocument}    = params;
        const proof = await signer.ldSign(didDocument, 'AssertionProofPurpose')
        return proof;
    }


    // register(params: {
    //     didDocument: DidDocumentMessage; // Ld document
    //     privateKeyMultibase?: string;
    //     verificationMethodId?: string;
    //     signData?: any[];
    // }): Promise<{ didDocument: IDidDocument; transactionHash: string }> {

    // }

}