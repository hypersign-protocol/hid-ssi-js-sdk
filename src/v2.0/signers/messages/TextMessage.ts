import {BaseMessage} from '../types'
export default class TextMessage implements BaseMessage<string>{
    message: string;
    constructor(message: string){
        this.message = message; 
    }

    async encode(): Promise<Uint8Array> {
        const encodedMessage = (new TextEncoder()).encode(this.message);
        return encodedMessage;        
    }
}
