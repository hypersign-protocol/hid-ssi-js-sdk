import { Writer, Reader } from "protobufjs/minimal";
export declare const protobufPackage = "hypersignprotocol.hidnode.ssi";
export interface ClientSpec {
    type: string;
    adr036SignerAddress: string;
}
export declare const ClientSpec: {
    encode(message: ClientSpec, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): ClientSpec;
    fromJSON(object: any): ClientSpec;
    toJSON(message: ClientSpec): unknown;
    fromPartial(object: DeepPartial<ClientSpec>): ClientSpec;
};
type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
//# sourceMappingURL=clientSpec.d.ts.map