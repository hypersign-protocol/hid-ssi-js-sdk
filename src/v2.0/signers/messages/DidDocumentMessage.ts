import { IDidDocument, DIDEncoder, IDidDocumentJs } from '../../did/types' 
import {BaseMessage} from '../types'
export default class DidDocumentMessage implements BaseMessage<IDidDocumentJs>{
    message: IDidDocumentJs;
    constructor(message: IDidDocument){

        //TODO: adter asking arnab, what to do with context, fix this. 
        // force converting for now..
        const idDIDDoc: IDidDocumentJs = {
            'context': message['@context'],
            ...message
        }
        this.message = idDIDDoc; 
    }

    async encode(): Promise<Uint8Array> {
        return (await DIDEncoder.encode(this.message)).finish();
    }
}