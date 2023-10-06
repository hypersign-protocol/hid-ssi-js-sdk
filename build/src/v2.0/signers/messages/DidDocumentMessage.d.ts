import { IDidDocument } from '../../did/types';
import BaseMessage from './IBaseMessage';
export default class DidDocumentMessage implements BaseMessage<IDidDocument> {
    message: IDidDocument;
    constructor(message: IDidDocument);
    encode(): Promise<Uint8Array>;
}
//# sourceMappingURL=DidDocumentMessage.d.ts.map