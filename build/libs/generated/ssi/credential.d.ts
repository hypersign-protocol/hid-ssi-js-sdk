import { Writer, Reader } from "protobufjs/minimal";
export declare const protobufPackage = "hypersignprotocol.hidnode.ssi";
export interface Claim {
    id: string;
    currentStatus: string;
    statusReason: string;
}
export interface CredentialStatus {
    claim: Claim | undefined;
    issuer: string;
    issuanceDate: string;
    expirationDate: string;
    credentialHash: string;
}
export interface CredentialProof {
    type: string;
    created: string;
    updated: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
}
export interface Credential {
    claim: Claim | undefined;
    issuer: string;
    issuanceDate: string;
    expirationDate: string;
    credentialHash: string;
    proof: CredentialProof | undefined;
}
export declare const Claim: {
    encode(message: Claim, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Claim;
    fromJSON(object: any): Claim;
    toJSON(message: Claim): unknown;
    fromPartial(object: DeepPartial<Claim>): Claim;
};
export declare const CredentialStatus: {
    encode(message: CredentialStatus, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): CredentialStatus;
    fromJSON(object: any): CredentialStatus;
    toJSON(message: CredentialStatus): unknown;
    fromPartial(object: DeepPartial<CredentialStatus>): CredentialStatus;
};
export declare const CredentialProof: {
    encode(message: CredentialProof, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): CredentialProof;
    fromJSON(object: any): CredentialProof;
    toJSON(message: CredentialProof): unknown;
    fromPartial(object: DeepPartial<CredentialProof>): CredentialProof;
};
export declare const Credential: {
    encode(message: Credential, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Credential;
    fromJSON(object: any): Credential;
    toJSON(message: Credential): unknown;
    fromPartial(object: DeepPartial<Credential>): Credential;
};
type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
//# sourceMappingURL=credential.d.ts.map