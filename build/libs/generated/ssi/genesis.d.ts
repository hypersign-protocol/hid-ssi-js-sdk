import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "hypersign.ssi.v1";
/** GenesisState defines the ssi module's genesis state. */
export interface GenesisState {
    chainNamespace?: string | undefined;
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    create<I extends {
        chainNamespace?: string | undefined;
    } & {
        chainNamespace?: string | undefined;
    } & { [K in Exclude<keyof I, "chainNamespace">]: never; }>(base?: I | undefined): GenesisState;
    fromPartial<I_1 extends {
        chainNamespace?: string | undefined;
    } & {
        chainNamespace?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, "chainNamespace">]: never; }>(object: I_1): GenesisState;
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
//# sourceMappingURL=genesis.d.ts.map