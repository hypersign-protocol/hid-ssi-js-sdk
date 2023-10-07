import { IDidDocument, IHypersignDidDocument, ISignedDIDDocument, IHypersignManager } from './types';
import { HypersignBaseSigner } from '../signers/types';
import DidDocumentMessage from '../signers/messages/DidDocumentMessage';

export default class HypersignDIDManager implements IHypersignManager {
    async sign(params: {
        didDocument: DidDocumentMessage;
        signer: HypersignBaseSigner
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