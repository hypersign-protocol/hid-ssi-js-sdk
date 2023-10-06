export default interface BaseMessage<T> {
    message: T;
    encode(): Promise<Uint8Array>;
}
//# sourceMappingURL=IBaseMessage.d.ts.map