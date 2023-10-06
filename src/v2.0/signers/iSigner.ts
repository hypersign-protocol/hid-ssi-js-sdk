
import TextMessage  from './messages/TextMessage';
import DidDocumentMessage from './messages/DidDocumentMessage';
export interface HypersignBaseSigner {
    sign<T extends TextMessage | DidDocumentMessage>(message: T): Promise<string>;
}
