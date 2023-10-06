import BaseMessage from './IBaseMessage';
export default class TextMessage implements BaseMessage<string> {
    message: string;
    constructor(message: string);
    encode(): Promise<Uint8Array>;
}
//# sourceMappingURL=TextMessage.d.ts.map