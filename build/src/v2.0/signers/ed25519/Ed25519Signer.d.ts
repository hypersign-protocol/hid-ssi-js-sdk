import TextMessage from '../messages/TextMessage';
import DidDocumentMessage from '../messages/DidDocumentMessage';
import Ed25519KeyManager from './Ed25519KeyManager';
import { HypersignBaseSigner } from '../iSigner';
export default class Ed25519Signer extends Ed25519KeyManager implements HypersignBaseSigner {
    constructor(params: {
        seed?: string | Uint8Array;
        controller?: string;
    });
    sign<T extends TextMessage | DidDocumentMessage>(message: T): Promise<string>;
}
//# sourceMappingURL=Ed25519Signer.d.ts.map