export default interface BaseMessage <T> {
    message: T;
    encode(): Promise<Uint8Array>;
}
