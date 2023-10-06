import { IDidDocument, DIDEncoder } from '../../did/types' 
import BaseMessage from './IBaseMessage'
export default class DidDocumentMessage implements BaseMessage<IDidDocument>{
    message: IDidDocument;
    constructor(message: IDidDocument){
        this.message = message; 
    }

    async encode(): Promise<Uint8Array> {
        return (await DIDEncoder.encode(this.message)).finish();
    }
}