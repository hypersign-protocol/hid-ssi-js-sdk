import { Writer, Reader } from "protobufjs/minimal";
export declare const protobufPackage = "hypersignprotocol.hidnode.ssi";
export interface SchemaDocument {
    type: string;
    modelVersion: string;
    id: string;
    name: string;
    author: string;
    authored: string;
    schema: SchemaProperty | undefined;
}
export interface SchemaProperty {
    schema: string;
    description: string;
    type: string;
    properties: string;
    required: string[];
    additionalProperties: boolean;
}
export interface SchemaProof {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
}
export interface Schema {
    type: string;
    modelVersion: string;
    id: string;
    name: string;
    author: string;
    authored: string;
    schema: SchemaProperty | undefined;
    proof: SchemaProof | undefined;
}
export declare const SchemaDocument: {
    encode(message: SchemaDocument, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): SchemaDocument;
    fromJSON(object: any): SchemaDocument;
    toJSON(message: SchemaDocument): unknown;
    fromPartial(object: DeepPartial<SchemaDocument>): SchemaDocument;
};
export declare const SchemaProperty: {
    encode(message: SchemaProperty, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): SchemaProperty;
    fromJSON(object: any): SchemaProperty;
    toJSON(message: SchemaProperty): unknown;
    fromPartial(object: DeepPartial<SchemaProperty>): SchemaProperty;
};
export declare const SchemaProof: {
    encode(message: SchemaProof, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): SchemaProof;
    fromJSON(object: any): SchemaProof;
    toJSON(message: SchemaProof): unknown;
    fromPartial(object: DeepPartial<SchemaProof>): SchemaProof;
};
export declare const Schema: {
    encode(message: Schema, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Schema;
    fromJSON(object: any): Schema;
    toJSON(message: Schema): unknown;
    fromPartial(object: DeepPartial<Schema>): Schema;
};
type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
//# sourceMappingURL=schema.d.ts.map