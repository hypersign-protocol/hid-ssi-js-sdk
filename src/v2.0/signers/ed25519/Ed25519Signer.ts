import TextMessage  from '../messages/TextMessage';
import DidDocumentMessage from '../messages/DidDocumentMessage';
import Ed25519KeyManager from './Ed25519KeyManager';
import { HypersignBaseSigner } from '../iSigner';
 
export default class Ed25519Signer extends Ed25519KeyManager implements HypersignBaseSigner{
    constructor(params : {seed?: string | Uint8Array; controller?: string} ){
        super(params);
    }
    async sign<T extends TextMessage | DidDocumentMessage>(message: T): Promise<string> {
        const messageBytes = await message.encode()
        const signatureBytes = await this.signer.sign({data: messageBytes})
        return Buffer.from(signatureBytes).toString('base64');
    }   
}

