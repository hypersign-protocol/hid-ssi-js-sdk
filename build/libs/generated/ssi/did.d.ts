import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "hypersign.ssi.v1";
export interface DidDocument {
    "@context"?: string[] | undefined;
    id?: string | undefined;
    controller?: string[] | undefined;
    alsoKnownAs?: string[] | undefined;
    verificationMethod?: VerificationMethod[] | undefined;
    authentication?: string[] | undefined;
    assertionMethod?: string[] | undefined;
    keyAgreement?: string[] | undefined;
    capabilityInvocation?: string[] | undefined;
    capabilityDelegation?: string[] | undefined;
    service?: Service[] | undefined;
}
export interface DidDocumentMetadata {
    created?: string | undefined;
    updated?: string | undefined;
    deactivated?: boolean | undefined;
    versionId?: string | undefined;
}
export interface VerificationMethod {
    id?: string | undefined;
    type?: string | undefined;
    controller?: string | undefined;
    /** If value is provided, `blockchainAccountId` must be empty */
    publicKeyMultibase?: string | undefined;
    /** If value is provided, `publicKeyMultibase` must be empty */
    blockchainAccountId?: string | undefined;
}
export interface Service {
    id?: string | undefined;
    type?: string | undefined;
    serviceEndpoint?: string | undefined;
}
export interface DidDocumentState {
    didDocument?: DidDocument | undefined;
    didDocumentMetadata?: DidDocumentMetadata | undefined;
}
export declare const DidDocument: {
    encode(message: DidDocument, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): DidDocument;
    fromJSON(object: any): DidDocument;
    toJSON(message: DidDocument): unknown;
    create<I extends {
        "@context"?: string[] | undefined;
        id?: string | undefined;
        controller?: string[] | undefined;
        alsoKnownAs?: string[] | undefined;
        verificationMethod?: {
            id?: string | undefined;
            type?: string | undefined;
            controller?: string | undefined;
            publicKeyMultibase?: string | undefined;
            blockchainAccountId?: string | undefined;
        }[] | undefined;
        authentication?: string[] | undefined;
        assertionMethod?: string[] | undefined;
        keyAgreement?: string[] | undefined;
        capabilityInvocation?: string[] | undefined;
        capabilityDelegation?: string[] | undefined;
        service?: {
            id?: string | undefined;
            type?: string | undefined;
            serviceEndpoint?: string | undefined;
        }[] | undefined;
    } & {
        "@context"?: (string[] & string[] & { [K in Exclude<keyof I["@context"], keyof string[]>]: never; }) | undefined;
        id?: string | undefined;
        controller?: (string[] & string[] & { [K_1 in Exclude<keyof I["controller"], keyof string[]>]: never; }) | undefined;
        alsoKnownAs?: (string[] & string[] & { [K_2 in Exclude<keyof I["alsoKnownAs"], keyof string[]>]: never; }) | undefined;
        verificationMethod?: ({
            id?: string | undefined;
            type?: string | undefined;
            controller?: string | undefined;
            publicKeyMultibase?: string | undefined;
            blockchainAccountId?: string | undefined;
        }[] & ({
            id?: string | undefined;
            type?: string | undefined;
            controller?: string | undefined;
            publicKeyMultibase?: string | undefined;
            blockchainAccountId?: string | undefined;
        } & {
            id?: string | undefined;
            type?: string | undefined;
            controller?: string | undefined;
            publicKeyMultibase?: string | undefined;
            blockchainAccountId?: string | undefined;
        } & { [K_3 in Exclude<keyof I["verificationMethod"][number], keyof VerificationMethod>]: never; })[] & { [K_4 in Exclude<keyof I["verificationMethod"], keyof {
            id?: string | undefined;
            type?: string | undefined;
            controller?: string | undefined;
            publicKeyMultibase?: string | undefined;
            blockchainAccountId?: string | undefined;
        }[]>]: never; }) | undefined;
        authentication?: (string[] & string[] & { [K_5 in Exclude<keyof I["authentication"], keyof string[]>]: never; }) | undefined;
        assertionMethod?: (string[] & string[] & { [K_6 in Exclude<keyof I["assertionMethod"], keyof string[]>]: never; }) | undefined;
        keyAgreement?: (string[] & string[] & { [K_7 in Exclude<keyof I["keyAgreement"], keyof string[]>]: never; }) | undefined;
        capabilityInvocation?: (string[] & string[] & { [K_8 in Exclude<keyof I["capabilityInvocation"], keyof string[]>]: never; }) | undefined;
        capabilityDelegation?: (string[] & string[] & { [K_9 in Exclude<keyof I["capabilityDelegation"], keyof string[]>]: never; }) | undefined;
        service?: ({
            id?: string | undefined;
            type?: string | undefined;
            serviceEndpoint?: string | undefined;
        }[] & ({
            id?: string | undefined;
            type?: string | undefined;
            serviceEndpoint?: string | undefined;
        } & {
            id?: string | undefined;
            type?: string | undefined;
            serviceEndpoint?: string | undefined;
        } & { [K_10 in Exclude<keyof I["service"][number], keyof Service>]: never; })[] & { [K_11 in Exclude<keyof I["service"], keyof {
            id?: string | undefined;
            type?: string | undefined;
            serviceEndpoint?: string | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_12 in Exclude<keyof I, keyof DidDocument>]: never; }>(base?: I | undefined): DidDocument;
    fromPartial<I_1 extends {
        "@context"?: string[] | undefined;
        id?: string | undefined;
        controller?: string[] | undefined;
        alsoKnownAs?: string[] | undefined;
        verificationMethod?: {
            id?: string | undefined;
            type?: string | undefined;
            controller?: string | undefined;
            publicKeyMultibase?: string | undefined;
            blockchainAccountId?: string | undefined;
        }[] | undefined;
        authentication?: string[] | undefined;
        assertionMethod?: string[] | undefined;
        keyAgreement?: string[] | undefined;
        capabilityInvocation?: string[] | undefined;
        capabilityDelegation?: string[] | undefined;
        service?: {
            id?: string | undefined;
            type?: string | undefined;
            serviceEndpoint?: string | undefined;
        }[] | undefined;
    } & {
        "@context"?: (string[] & string[] & { [K_13 in Exclude<keyof I_1["@context"], keyof string[]>]: never; }) | undefined;
        id?: string | undefined;
        controller?: (string[] & string[] & { [K_14 in Exclude<keyof I_1["controller"], keyof string[]>]: never; }) | undefined;
        alsoKnownAs?: (string[] & string[] & { [K_15 in Exclude<keyof I_1["alsoKnownAs"], keyof string[]>]: never; }) | undefined;
        verificationMethod?: ({
            id?: string | undefined;
            type?: string | undefined;
            controller?: string | undefined;
            publicKeyMultibase?: string | undefined;
            blockchainAccountId?: string | undefined;
        }[] & ({
            id?: string | undefined;
            type?: string | undefined;
            controller?: string | undefined;
            publicKeyMultibase?: string | undefined;
            blockchainAccountId?: string | undefined;
        } & {
            id?: string | undefined;
            type?: string | undefined;
            controller?: string | undefined;
            publicKeyMultibase?: string | undefined;
            blockchainAccountId?: string | undefined;
        } & { [K_16 in Exclude<keyof I_1["verificationMethod"][number], keyof VerificationMethod>]: never; })[] & { [K_17 in Exclude<keyof I_1["verificationMethod"], keyof {
            id?: string | undefined;
            type?: string | undefined;
            controller?: string | undefined;
            publicKeyMultibase?: string | undefined;
            blockchainAccountId?: string | undefined;
        }[]>]: never; }) | undefined;
        authentication?: (string[] & string[] & { [K_18 in Exclude<keyof I_1["authentication"], keyof string[]>]: never; }) | undefined;
        assertionMethod?: (string[] & string[] & { [K_19 in Exclude<keyof I_1["assertionMethod"], keyof string[]>]: never; }) | undefined;
        keyAgreement?: (string[] & string[] & { [K_20 in Exclude<keyof I_1["keyAgreement"], keyof string[]>]: never; }) | undefined;
        capabilityInvocation?: (string[] & string[] & { [K_21 in Exclude<keyof I_1["capabilityInvocation"], keyof string[]>]: never; }) | undefined;
        capabilityDelegation?: (string[] & string[] & { [K_22 in Exclude<keyof I_1["capabilityDelegation"], keyof string[]>]: never; }) | undefined;
        service?: ({
            id?: string | undefined;
            type?: string | undefined;
            serviceEndpoint?: string | undefined;
        }[] & ({
            id?: string | undefined;
            type?: string | undefined;
            serviceEndpoint?: string | undefined;
        } & {
            id?: string | undefined;
            type?: string | undefined;
            serviceEndpoint?: string | undefined;
        } & { [K_23 in Exclude<keyof I_1["service"][number], keyof Service>]: never; })[] & { [K_24 in Exclude<keyof I_1["service"], keyof {
            id?: string | undefined;
            type?: string | undefined;
            serviceEndpoint?: string | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_25 in Exclude<keyof I_1, keyof DidDocument>]: never; }>(object: I_1): DidDocument;
};
export declare const DidDocumentMetadata: {
    encode(message: DidDocumentMetadata, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): DidDocumentMetadata;
    fromJSON(object: any): DidDocumentMetadata;
    toJSON(message: DidDocumentMetadata): unknown;
    create<I extends {
        created?: string | undefined;
        updated?: string | undefined;
        deactivated?: boolean | undefined;
        versionId?: string | undefined;
    } & {
        created?: string | undefined;
        updated?: string | undefined;
        deactivated?: boolean | undefined;
        versionId?: string | undefined;
    } & { [K in Exclude<keyof I, keyof DidDocumentMetadata>]: never; }>(base?: I | undefined): DidDocumentMetadata;
    fromPartial<I_1 extends {
        created?: string | undefined;
        updated?: string | undefined;
        deactivated?: boolean | undefined;
        versionId?: string | undefined;
    } & {
        created?: string | undefined;
        updated?: string | undefined;
        deactivated?: boolean | undefined;
        versionId?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof DidDocumentMetadata>]: never; }>(object: I_1): DidDocumentMetadata;
};
export declare const VerificationMethod: {
    encode(message: VerificationMethod, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VerificationMethod;
    fromJSON(object: any): VerificationMethod;
    toJSON(message: VerificationMethod): unknown;
    create<I extends {
        id?: string | undefined;
        type?: string | undefined;
        controller?: string | undefined;
        publicKeyMultibase?: string | undefined;
        blockchainAccountId?: string | undefined;
    } & {
        id?: string | undefined;
        type?: string | undefined;
        controller?: string | undefined;
        publicKeyMultibase?: string | undefined;
        blockchainAccountId?: string | undefined;
    } & { [K in Exclude<keyof I, keyof VerificationMethod>]: never; }>(base?: I | undefined): VerificationMethod;
    fromPartial<I_1 extends {
        id?: string | undefined;
        type?: string | undefined;
        controller?: string | undefined;
        publicKeyMultibase?: string | undefined;
        blockchainAccountId?: string | undefined;
    } & {
        id?: string | undefined;
        type?: string | undefined;
        controller?: string | undefined;
        publicKeyMultibase?: string | undefined;
        blockchainAccountId?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof VerificationMethod>]: never; }>(object: I_1): VerificationMethod;
};
export declare const Service: {
    encode(message: Service, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Service;
    fromJSON(object: any): Service;
    toJSON(message: Service): unknown;
    create<I extends {
        id?: string | undefined;
        type?: string | undefined;
        serviceEndpoint?: string | undefined;
    } & {
        id?: string | undefined;
        type?: string | undefined;
        serviceEndpoint?: string | undefined;
    } & { [K in Exclude<keyof I, keyof Service>]: never; }>(base?: I | undefined): Service;
    fromPartial<I_1 extends {
        id?: string | undefined;
        type?: string | undefined;
        serviceEndpoint?: string | undefined;
    } & {
        id?: string | undefined;
        type?: string | undefined;
        serviceEndpoint?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof Service>]: never; }>(object: I_1): Service;
};
export declare const DidDocumentState: {
    encode(message: DidDocumentState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): DidDocumentState;
    fromJSON(object: any): DidDocumentState;
    toJSON(message: DidDocumentState): unknown;
    create<I extends {
        didDocument?: {
            "@context"?: string[] | undefined;
            id?: string | undefined;
            controller?: string[] | undefined;
            alsoKnownAs?: string[] | undefined;
            verificationMethod?: {
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            }[] | undefined;
            authentication?: string[] | undefined;
            assertionMethod?: string[] | undefined;
            keyAgreement?: string[] | undefined;
            capabilityInvocation?: string[] | undefined;
            capabilityDelegation?: string[] | undefined;
            service?: {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[] | undefined;
        } | undefined;
        didDocumentMetadata?: {
            created?: string | undefined;
            updated?: string | undefined;
            deactivated?: boolean | undefined;
            versionId?: string | undefined;
        } | undefined;
    } & {
        didDocument?: ({
            "@context"?: string[] | undefined;
            id?: string | undefined;
            controller?: string[] | undefined;
            alsoKnownAs?: string[] | undefined;
            verificationMethod?: {
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            }[] | undefined;
            authentication?: string[] | undefined;
            assertionMethod?: string[] | undefined;
            keyAgreement?: string[] | undefined;
            capabilityInvocation?: string[] | undefined;
            capabilityDelegation?: string[] | undefined;
            service?: {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[] | undefined;
        } & {
            "@context"?: (string[] & string[] & { [K in Exclude<keyof I["didDocument"]["@context"], keyof string[]>]: never; }) | undefined;
            id?: string | undefined;
            controller?: (string[] & string[] & { [K_1 in Exclude<keyof I["didDocument"]["controller"], keyof string[]>]: never; }) | undefined;
            alsoKnownAs?: (string[] & string[] & { [K_2 in Exclude<keyof I["didDocument"]["alsoKnownAs"], keyof string[]>]: never; }) | undefined;
            verificationMethod?: ({
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            }[] & ({
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            } & {
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            } & { [K_3 in Exclude<keyof I["didDocument"]["verificationMethod"][number], keyof VerificationMethod>]: never; })[] & { [K_4 in Exclude<keyof I["didDocument"]["verificationMethod"], keyof {
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            }[]>]: never; }) | undefined;
            authentication?: (string[] & string[] & { [K_5 in Exclude<keyof I["didDocument"]["authentication"], keyof string[]>]: never; }) | undefined;
            assertionMethod?: (string[] & string[] & { [K_6 in Exclude<keyof I["didDocument"]["assertionMethod"], keyof string[]>]: never; }) | undefined;
            keyAgreement?: (string[] & string[] & { [K_7 in Exclude<keyof I["didDocument"]["keyAgreement"], keyof string[]>]: never; }) | undefined;
            capabilityInvocation?: (string[] & string[] & { [K_8 in Exclude<keyof I["didDocument"]["capabilityInvocation"], keyof string[]>]: never; }) | undefined;
            capabilityDelegation?: (string[] & string[] & { [K_9 in Exclude<keyof I["didDocument"]["capabilityDelegation"], keyof string[]>]: never; }) | undefined;
            service?: ({
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[] & ({
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            } & {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            } & { [K_10 in Exclude<keyof I["didDocument"]["service"][number], keyof Service>]: never; })[] & { [K_11 in Exclude<keyof I["didDocument"]["service"], keyof {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_12 in Exclude<keyof I["didDocument"], keyof DidDocument>]: never; }) | undefined;
        didDocumentMetadata?: ({
            created?: string | undefined;
            updated?: string | undefined;
            deactivated?: boolean | undefined;
            versionId?: string | undefined;
        } & {
            created?: string | undefined;
            updated?: string | undefined;
            deactivated?: boolean | undefined;
            versionId?: string | undefined;
        } & { [K_13 in Exclude<keyof I["didDocumentMetadata"], keyof DidDocumentMetadata>]: never; }) | undefined;
    } & { [K_14 in Exclude<keyof I, keyof DidDocumentState>]: never; }>(base?: I | undefined): DidDocumentState;
    fromPartial<I_1 extends {
        didDocument?: {
            "@context"?: string[] | undefined;
            id?: string | undefined;
            controller?: string[] | undefined;
            alsoKnownAs?: string[] | undefined;
            verificationMethod?: {
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            }[] | undefined;
            authentication?: string[] | undefined;
            assertionMethod?: string[] | undefined;
            keyAgreement?: string[] | undefined;
            capabilityInvocation?: string[] | undefined;
            capabilityDelegation?: string[] | undefined;
            service?: {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[] | undefined;
        } | undefined;
        didDocumentMetadata?: {
            created?: string | undefined;
            updated?: string | undefined;
            deactivated?: boolean | undefined;
            versionId?: string | undefined;
        } | undefined;
    } & {
        didDocument?: ({
            "@context"?: string[] | undefined;
            id?: string | undefined;
            controller?: string[] | undefined;
            alsoKnownAs?: string[] | undefined;
            verificationMethod?: {
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            }[] | undefined;
            authentication?: string[] | undefined;
            assertionMethod?: string[] | undefined;
            keyAgreement?: string[] | undefined;
            capabilityInvocation?: string[] | undefined;
            capabilityDelegation?: string[] | undefined;
            service?: {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[] | undefined;
        } & {
            "@context"?: (string[] & string[] & { [K_15 in Exclude<keyof I_1["didDocument"]["@context"], keyof string[]>]: never; }) | undefined;
            id?: string | undefined;
            controller?: (string[] & string[] & { [K_16 in Exclude<keyof I_1["didDocument"]["controller"], keyof string[]>]: never; }) | undefined;
            alsoKnownAs?: (string[] & string[] & { [K_17 in Exclude<keyof I_1["didDocument"]["alsoKnownAs"], keyof string[]>]: never; }) | undefined;
            verificationMethod?: ({
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            }[] & ({
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            } & {
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            } & { [K_18 in Exclude<keyof I_1["didDocument"]["verificationMethod"][number], keyof VerificationMethod>]: never; })[] & { [K_19 in Exclude<keyof I_1["didDocument"]["verificationMethod"], keyof {
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            }[]>]: never; }) | undefined;
            authentication?: (string[] & string[] & { [K_20 in Exclude<keyof I_1["didDocument"]["authentication"], keyof string[]>]: never; }) | undefined;
            assertionMethod?: (string[] & string[] & { [K_21 in Exclude<keyof I_1["didDocument"]["assertionMethod"], keyof string[]>]: never; }) | undefined;
            keyAgreement?: (string[] & string[] & { [K_22 in Exclude<keyof I_1["didDocument"]["keyAgreement"], keyof string[]>]: never; }) | undefined;
            capabilityInvocation?: (string[] & string[] & { [K_23 in Exclude<keyof I_1["didDocument"]["capabilityInvocation"], keyof string[]>]: never; }) | undefined;
            capabilityDelegation?: (string[] & string[] & { [K_24 in Exclude<keyof I_1["didDocument"]["capabilityDelegation"], keyof string[]>]: never; }) | undefined;
            service?: ({
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[] & ({
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            } & {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            } & { [K_25 in Exclude<keyof I_1["didDocument"]["service"][number], keyof Service>]: never; })[] & { [K_26 in Exclude<keyof I_1["didDocument"]["service"], keyof {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_27 in Exclude<keyof I_1["didDocument"], keyof DidDocument>]: never; }) | undefined;
        didDocumentMetadata?: ({
            created?: string | undefined;
            updated?: string | undefined;
            deactivated?: boolean | undefined;
            versionId?: string | undefined;
        } & {
            created?: string | undefined;
            updated?: string | undefined;
            deactivated?: boolean | undefined;
            versionId?: string | undefined;
        } & { [K_28 in Exclude<keyof I_1["didDocumentMetadata"], keyof DidDocumentMetadata>]: never; }) | undefined;
    } & { [K_29 in Exclude<keyof I_1, keyof DidDocumentState>]: never; }>(object: I_1): DidDocumentState;
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
//# sourceMappingURL=did.d.ts.map