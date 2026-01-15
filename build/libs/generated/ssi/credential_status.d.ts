import _m0 from "protobufjs/minimal";
import { DocumentProof } from "./proof";
export declare const protobufPackage = "hypersign.ssi.v1";
export interface CredentialStatusDocument {
    "@context"?: string[] | undefined;
    id?: string | undefined;
    revoked?: boolean | undefined;
    suspended?: boolean | undefined;
    remarks?: string | undefined;
    issuer?: string | undefined;
    issuanceDate?: string | undefined;
    credentialMerkleRootHash?: string | undefined;
}
export interface CredentialStatusState {
    credentialStatusDocument?: CredentialStatusDocument | undefined;
    credentialStatusProof?: DocumentProof | undefined;
}
export declare const CredentialStatusDocument: {
    encode(message: CredentialStatusDocument, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CredentialStatusDocument;
    fromJSON(object: any): CredentialStatusDocument;
    toJSON(message: CredentialStatusDocument): unknown;
    create<I extends {
        "@context"?: string[] | undefined;
        id?: string | undefined;
        revoked?: boolean | undefined;
        suspended?: boolean | undefined;
        remarks?: string | undefined;
        issuer?: string | undefined;
        issuanceDate?: string | undefined;
        credentialMerkleRootHash?: string | undefined;
    } & {
        "@context"?: (string[] & string[] & { [K in Exclude<keyof I["@context"], keyof string[]>]: never; }) | undefined;
        id?: string | undefined;
        revoked?: boolean | undefined;
        suspended?: boolean | undefined;
        remarks?: string | undefined;
        issuer?: string | undefined;
        issuanceDate?: string | undefined;
        credentialMerkleRootHash?: string | undefined;
    } & { [K_1 in Exclude<keyof I, keyof CredentialStatusDocument>]: never; }>(base?: I | undefined): CredentialStatusDocument;
    fromPartial<I_1 extends {
        "@context"?: string[] | undefined;
        id?: string | undefined;
        revoked?: boolean | undefined;
        suspended?: boolean | undefined;
        remarks?: string | undefined;
        issuer?: string | undefined;
        issuanceDate?: string | undefined;
        credentialMerkleRootHash?: string | undefined;
    } & {
        "@context"?: (string[] & string[] & { [K_2 in Exclude<keyof I_1["@context"], keyof string[]>]: never; }) | undefined;
        id?: string | undefined;
        revoked?: boolean | undefined;
        suspended?: boolean | undefined;
        remarks?: string | undefined;
        issuer?: string | undefined;
        issuanceDate?: string | undefined;
        credentialMerkleRootHash?: string | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof CredentialStatusDocument>]: never; }>(object: I_1): CredentialStatusDocument;
};
export declare const CredentialStatusState: {
    encode(message: CredentialStatusState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CredentialStatusState;
    fromJSON(object: any): CredentialStatusState;
    toJSON(message: CredentialStatusState): unknown;
    create<I extends {
        credentialStatusDocument?: {
            "@context"?: string[] | undefined;
            id?: string | undefined;
            revoked?: boolean | undefined;
            suspended?: boolean | undefined;
            remarks?: string | undefined;
            issuer?: string | undefined;
            issuanceDate?: string | undefined;
            credentialMerkleRootHash?: string | undefined;
        } | undefined;
        credentialStatusProof?: {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        } | undefined;
    } & {
        credentialStatusDocument?: ({
            "@context"?: string[] | undefined;
            id?: string | undefined;
            revoked?: boolean | undefined;
            suspended?: boolean | undefined;
            remarks?: string | undefined;
            issuer?: string | undefined;
            issuanceDate?: string | undefined;
            credentialMerkleRootHash?: string | undefined;
        } & {
            "@context"?: (string[] & string[] & { [K in Exclude<keyof I["credentialStatusDocument"]["@context"], keyof string[]>]: never; }) | undefined;
            id?: string | undefined;
            revoked?: boolean | undefined;
            suspended?: boolean | undefined;
            remarks?: string | undefined;
            issuer?: string | undefined;
            issuanceDate?: string | undefined;
            credentialMerkleRootHash?: string | undefined;
        } & { [K_1 in Exclude<keyof I["credentialStatusDocument"], keyof CredentialStatusDocument>]: never; }) | undefined;
        credentialStatusProof?: ({
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
        } & { [K_2 in Exclude<keyof I["credentialStatusProof"], keyof DocumentProof>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, keyof CredentialStatusState>]: never; }>(base?: I | undefined): CredentialStatusState;
    fromPartial<I_1 extends {
        credentialStatusDocument?: {
            "@context"?: string[] | undefined;
            id?: string | undefined;
            revoked?: boolean | undefined;
            suspended?: boolean | undefined;
            remarks?: string | undefined;
            issuer?: string | undefined;
            issuanceDate?: string | undefined;
            credentialMerkleRootHash?: string | undefined;
        } | undefined;
        credentialStatusProof?: {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        } | undefined;
    } & {
        credentialStatusDocument?: ({
            "@context"?: string[] | undefined;
            id?: string | undefined;
            revoked?: boolean | undefined;
            suspended?: boolean | undefined;
            remarks?: string | undefined;
            issuer?: string | undefined;
            issuanceDate?: string | undefined;
            credentialMerkleRootHash?: string | undefined;
        } & {
            "@context"?: (string[] & string[] & { [K_4 in Exclude<keyof I_1["credentialStatusDocument"]["@context"], keyof string[]>]: never; }) | undefined;
            id?: string | undefined;
            revoked?: boolean | undefined;
            suspended?: boolean | undefined;
            remarks?: string | undefined;
            issuer?: string | undefined;
            issuanceDate?: string | undefined;
            credentialMerkleRootHash?: string | undefined;
        } & { [K_5 in Exclude<keyof I_1["credentialStatusDocument"], keyof CredentialStatusDocument>]: never; }) | undefined;
        credentialStatusProof?: ({
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
        } & { [K_6 in Exclude<keyof I_1["credentialStatusProof"], keyof DocumentProof>]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof CredentialStatusState>]: never; }>(object: I_1): CredentialStatusState;
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
//# sourceMappingURL=credential_status.d.ts.map