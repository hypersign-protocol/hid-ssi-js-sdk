import _m0 from "protobufjs/minimal";
import { ClientSpecType } from "./client_spec";
export declare const protobufPackage = "hypersign.ssi.v1";
export interface DocumentProof {
    type?: string | undefined;
    created?: string | undefined;
    verificationMethod?: string | undefined;
    proofPurpose?: string | undefined;
    proofValue?: string | undefined;
    clientSpecType?: ClientSpecType | undefined;
}
export declare const DocumentProof: {
    encode(message: DocumentProof, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): DocumentProof;
    fromJSON(object: any): DocumentProof;
    toJSON(message: DocumentProof): unknown;
    create<I extends {
        type?: string | undefined;
        created?: string | undefined;
        verificationMethod?: string | undefined;
        proofPurpose?: string | undefined;
        proofValue?: string | undefined;
        clientSpecType?: ClientSpecType | undefined;
    } & {
        type?: string | undefined;
        created?: string | undefined;
        verificationMethod?: string | undefined;
        proofPurpose?: string | undefined;
        proofValue?: string | undefined;
        clientSpecType?: ClientSpecType | undefined;
    } & { [K in Exclude<keyof I, keyof DocumentProof>]: never; }>(base?: I | undefined): DocumentProof;
    fromPartial<I_1 extends {
        type?: string | undefined;
        created?: string | undefined;
        verificationMethod?: string | undefined;
        proofPurpose?: string | undefined;
        proofValue?: string | undefined;
        clientSpecType?: ClientSpecType | undefined;
    } & {
        type?: string | undefined;
        created?: string | undefined;
        verificationMethod?: string | undefined;
        proofPurpose?: string | undefined;
        proofValue?: string | undefined;
        clientSpecType?: ClientSpecType | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof DocumentProof>]: never; }>(object: I_1): DocumentProof;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
//# sourceMappingURL=proof.d.ts.map