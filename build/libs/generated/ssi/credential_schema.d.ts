import _m0 from "protobufjs/minimal";
import { DocumentProof } from "./proof";
export declare const protobufPackage = "hypersign.ssi.v1";
export interface CredentialSchemaDocument {
    "@context"?: string[] | undefined;
    type?: string | undefined;
    modelVersion?: string | undefined;
    id?: string | undefined;
    name?: string | undefined;
    author?: string | undefined;
    authored?: string | undefined;
    schema?: CredentialSchemaProperty | undefined;
}
export interface CredentialSchemaProperty {
    schema?: string | undefined;
    description?: string | undefined;
    type?: string | undefined;
    properties?: string | undefined;
    required?: string[] | undefined;
    additionalProperties?: boolean | undefined;
}
export interface CredentialSchemaState {
    credentialSchemaDocument?: CredentialSchemaDocument | undefined;
    credentialSchemaProof?: DocumentProof | undefined;
}
export declare const CredentialSchemaDocument: {
    encode(message: CredentialSchemaDocument, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CredentialSchemaDocument;
    fromJSON(object: any): CredentialSchemaDocument;
    toJSON(message: CredentialSchemaDocument): unknown;
    create<I extends {
        "@context"?: string[] | undefined;
        type?: string | undefined;
        modelVersion?: string | undefined;
        id?: string | undefined;
        name?: string | undefined;
        author?: string | undefined;
        authored?: string | undefined;
        schema?: {
            schema?: string | undefined;
            description?: string | undefined;
            type?: string | undefined;
            properties?: string | undefined;
            required?: string[] | undefined;
            additionalProperties?: boolean | undefined;
        } | undefined;
    } & {
        "@context"?: (string[] & string[] & { [K in Exclude<keyof I["@context"], keyof string[]>]: never; }) | undefined;
        type?: string | undefined;
        modelVersion?: string | undefined;
        id?: string | undefined;
        name?: string | undefined;
        author?: string | undefined;
        authored?: string | undefined;
        schema?: ({
            schema?: string | undefined;
            description?: string | undefined;
            type?: string | undefined;
            properties?: string | undefined;
            required?: string[] | undefined;
            additionalProperties?: boolean | undefined;
        } & {
            schema?: string | undefined;
            description?: string | undefined;
            type?: string | undefined;
            properties?: string | undefined;
            required?: (string[] & string[] & { [K_1 in Exclude<keyof I["schema"]["required"], keyof string[]>]: never; }) | undefined;
            additionalProperties?: boolean | undefined;
        } & { [K_2 in Exclude<keyof I["schema"], keyof CredentialSchemaProperty>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, keyof CredentialSchemaDocument>]: never; }>(base?: I | undefined): CredentialSchemaDocument;
    fromPartial<I_1 extends {
        "@context"?: string[] | undefined;
        type?: string | undefined;
        modelVersion?: string | undefined;
        id?: string | undefined;
        name?: string | undefined;
        author?: string | undefined;
        authored?: string | undefined;
        schema?: {
            schema?: string | undefined;
            description?: string | undefined;
            type?: string | undefined;
            properties?: string | undefined;
            required?: string[] | undefined;
            additionalProperties?: boolean | undefined;
        } | undefined;
    } & {
        "@context"?: (string[] & string[] & { [K_4 in Exclude<keyof I_1["@context"], keyof string[]>]: never; }) | undefined;
        type?: string | undefined;
        modelVersion?: string | undefined;
        id?: string | undefined;
        name?: string | undefined;
        author?: string | undefined;
        authored?: string | undefined;
        schema?: ({
            schema?: string | undefined;
            description?: string | undefined;
            type?: string | undefined;
            properties?: string | undefined;
            required?: string[] | undefined;
            additionalProperties?: boolean | undefined;
        } & {
            schema?: string | undefined;
            description?: string | undefined;
            type?: string | undefined;
            properties?: string | undefined;
            required?: (string[] & string[] & { [K_5 in Exclude<keyof I_1["schema"]["required"], keyof string[]>]: never; }) | undefined;
            additionalProperties?: boolean | undefined;
        } & { [K_6 in Exclude<keyof I_1["schema"], keyof CredentialSchemaProperty>]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof CredentialSchemaDocument>]: never; }>(object: I_1): CredentialSchemaDocument;
};
export declare const CredentialSchemaProperty: {
    encode(message: CredentialSchemaProperty, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CredentialSchemaProperty;
    fromJSON(object: any): CredentialSchemaProperty;
    toJSON(message: CredentialSchemaProperty): unknown;
    create<I extends {
        schema?: string | undefined;
        description?: string | undefined;
        type?: string | undefined;
        properties?: string | undefined;
        required?: string[] | undefined;
        additionalProperties?: boolean | undefined;
    } & {
        schema?: string | undefined;
        description?: string | undefined;
        type?: string | undefined;
        properties?: string | undefined;
        required?: (string[] & string[] & { [K in Exclude<keyof I["required"], keyof string[]>]: never; }) | undefined;
        additionalProperties?: boolean | undefined;
    } & { [K_1 in Exclude<keyof I, keyof CredentialSchemaProperty>]: never; }>(base?: I | undefined): CredentialSchemaProperty;
    fromPartial<I_1 extends {
        schema?: string | undefined;
        description?: string | undefined;
        type?: string | undefined;
        properties?: string | undefined;
        required?: string[] | undefined;
        additionalProperties?: boolean | undefined;
    } & {
        schema?: string | undefined;
        description?: string | undefined;
        type?: string | undefined;
        properties?: string | undefined;
        required?: (string[] & string[] & { [K_2 in Exclude<keyof I_1["required"], keyof string[]>]: never; }) | undefined;
        additionalProperties?: boolean | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof CredentialSchemaProperty>]: never; }>(object: I_1): CredentialSchemaProperty;
};
export declare const CredentialSchemaState: {
    encode(message: CredentialSchemaState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CredentialSchemaState;
    fromJSON(object: any): CredentialSchemaState;
    toJSON(message: CredentialSchemaState): unknown;
    create<I extends {
        credentialSchemaDocument?: {
            "@context"?: string[] | undefined;
            type?: string | undefined;
            modelVersion?: string | undefined;
            id?: string | undefined;
            name?: string | undefined;
            author?: string | undefined;
            authored?: string | undefined;
            schema?: {
                schema?: string | undefined;
                description?: string | undefined;
                type?: string | undefined;
                properties?: string | undefined;
                required?: string[] | undefined;
                additionalProperties?: boolean | undefined;
            } | undefined;
        } | undefined;
        credentialSchemaProof?: {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        } | undefined;
    } & {
        credentialSchemaDocument?: ({
            "@context"?: string[] | undefined;
            type?: string | undefined;
            modelVersion?: string | undefined;
            id?: string | undefined;
            name?: string | undefined;
            author?: string | undefined;
            authored?: string | undefined;
            schema?: {
                schema?: string | undefined;
                description?: string | undefined;
                type?: string | undefined;
                properties?: string | undefined;
                required?: string[] | undefined;
                additionalProperties?: boolean | undefined;
            } | undefined;
        } & {
            "@context"?: (string[] & string[] & { [K in Exclude<keyof I["credentialSchemaDocument"]["@context"], keyof string[]>]: never; }) | undefined;
            type?: string | undefined;
            modelVersion?: string | undefined;
            id?: string | undefined;
            name?: string | undefined;
            author?: string | undefined;
            authored?: string | undefined;
            schema?: ({
                schema?: string | undefined;
                description?: string | undefined;
                type?: string | undefined;
                properties?: string | undefined;
                required?: string[] | undefined;
                additionalProperties?: boolean | undefined;
            } & {
                schema?: string | undefined;
                description?: string | undefined;
                type?: string | undefined;
                properties?: string | undefined;
                required?: (string[] & string[] & { [K_1 in Exclude<keyof I["credentialSchemaDocument"]["schema"]["required"], keyof string[]>]: never; }) | undefined;
                additionalProperties?: boolean | undefined;
            } & { [K_2 in Exclude<keyof I["credentialSchemaDocument"]["schema"], keyof CredentialSchemaProperty>]: never; }) | undefined;
        } & { [K_3 in Exclude<keyof I["credentialSchemaDocument"], keyof CredentialSchemaDocument>]: never; }) | undefined;
        credentialSchemaProof?: ({
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        } & {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        } & { [K_4 in Exclude<keyof I["credentialSchemaProof"], keyof DocumentProof>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I, keyof CredentialSchemaState>]: never; }>(base?: I | undefined): CredentialSchemaState;
    fromPartial<I_1 extends {
        credentialSchemaDocument?: {
            "@context"?: string[] | undefined;
            type?: string | undefined;
            modelVersion?: string | undefined;
            id?: string | undefined;
            name?: string | undefined;
            author?: string | undefined;
            authored?: string | undefined;
            schema?: {
                schema?: string | undefined;
                description?: string | undefined;
                type?: string | undefined;
                properties?: string | undefined;
                required?: string[] | undefined;
                additionalProperties?: boolean | undefined;
            } | undefined;
        } | undefined;
        credentialSchemaProof?: {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        } | undefined;
    } & {
        credentialSchemaDocument?: ({
            "@context"?: string[] | undefined;
            type?: string | undefined;
            modelVersion?: string | undefined;
            id?: string | undefined;
            name?: string | undefined;
            author?: string | undefined;
            authored?: string | undefined;
            schema?: {
                schema?: string | undefined;
                description?: string | undefined;
                type?: string | undefined;
                properties?: string | undefined;
                required?: string[] | undefined;
                additionalProperties?: boolean | undefined;
            } | undefined;
        } & {
            "@context"?: (string[] & string[] & { [K_6 in Exclude<keyof I_1["credentialSchemaDocument"]["@context"], keyof string[]>]: never; }) | undefined;
            type?: string | undefined;
            modelVersion?: string | undefined;
            id?: string | undefined;
            name?: string | undefined;
            author?: string | undefined;
            authored?: string | undefined;
            schema?: ({
                schema?: string | undefined;
                description?: string | undefined;
                type?: string | undefined;
                properties?: string | undefined;
                required?: string[] | undefined;
                additionalProperties?: boolean | undefined;
            } & {
                schema?: string | undefined;
                description?: string | undefined;
                type?: string | undefined;
                properties?: string | undefined;
                required?: (string[] & string[] & { [K_7 in Exclude<keyof I_1["credentialSchemaDocument"]["schema"]["required"], keyof string[]>]: never; }) | undefined;
                additionalProperties?: boolean | undefined;
            } & { [K_8 in Exclude<keyof I_1["credentialSchemaDocument"]["schema"], keyof CredentialSchemaProperty>]: never; }) | undefined;
        } & { [K_9 in Exclude<keyof I_1["credentialSchemaDocument"], keyof CredentialSchemaDocument>]: never; }) | undefined;
        credentialSchemaProof?: ({
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        } & {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        } & { [K_10 in Exclude<keyof I_1["credentialSchemaProof"], keyof DocumentProof>]: never; }) | undefined;
    } & { [K_11 in Exclude<keyof I_1, keyof CredentialSchemaState>]: never; }>(object: I_1): CredentialSchemaState;
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
//# sourceMappingURL=credential_schema.d.ts.map