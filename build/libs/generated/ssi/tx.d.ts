import _m0 from "protobufjs/minimal";
import { CredentialSchemaDocument } from "./credential_schema";
import { CredentialStatusDocument } from "./credential_status";
import { DidDocument } from "./did";
import { DocumentProof } from "./proof";
export declare const protobufPackage = "hypersign.ssi.v1";
export interface MsgRegisterDID {
    didDocument?: DidDocument | undefined;
    didDocumentProofs?: DocumentProof[] | undefined;
    txAuthor?: string | undefined;
}
export interface MsgRegisterDIDResponse {
}
export interface MsgUpdateDID {
    didDocument?: DidDocument | undefined;
    didDocumentProofs?: DocumentProof[] | undefined;
    versionId?: string | undefined;
    txAuthor?: string | undefined;
}
export interface MsgUpdateDIDResponse {
}
export interface MsgDeactivateDID {
    didDocumentId?: string | undefined;
    didDocumentProofs?: DocumentProof[] | undefined;
    versionId?: string | undefined;
    txAuthor?: string | undefined;
}
export interface MsgDeactivateDIDResponse {
}
export interface MsgRegisterCredentialSchema {
    credentialSchemaDocument?: CredentialSchemaDocument | undefined;
    credentialSchemaProof?: DocumentProof | undefined;
    txAuthor?: string | undefined;
}
export interface MsgRegisterCredentialSchemaResponse {
}
export interface MsgUpdateCredentialSchema {
    credentialSchemaDocument?: CredentialSchemaDocument | undefined;
    credentialSchemaProof?: DocumentProof | undefined;
    txAuthor?: string | undefined;
}
export interface MsgUpdateCredentialSchemaResponse {
}
export interface MsgRegisterCredentialStatus {
    credentialStatusDocument?: CredentialStatusDocument | undefined;
    credentialStatusProof?: DocumentProof | undefined;
    txAuthor?: string | undefined;
}
export interface MsgRegisterCredentialStatusResponse {
}
export interface MsgUpdateCredentialStatus {
    credentialStatusDocument?: CredentialStatusDocument | undefined;
    credentialStatusProof?: DocumentProof | undefined;
    txAuthor?: string | undefined;
}
export interface MsgUpdateCredentialStatusResponse {
}
export declare const MsgRegisterDID: {
    encode(message: MsgRegisterDID, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterDID;
    fromJSON(object: any): MsgRegisterDID;
    toJSON(message: MsgRegisterDID): unknown;
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
        didDocumentProofs?: {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] | undefined;
        txAuthor?: string | undefined;
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
            } & { [K_3 in Exclude<keyof I["didDocument"]["verificationMethod"][number], keyof import("./did").VerificationMethod>]: never; })[] & { [K_4 in Exclude<keyof I["didDocument"]["verificationMethod"], keyof {
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
            } & { [K_10 in Exclude<keyof I["didDocument"]["service"][number], keyof import("./did").Service>]: never; })[] & { [K_11 in Exclude<keyof I["didDocument"]["service"], keyof {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_12 in Exclude<keyof I["didDocument"], keyof DidDocument>]: never; }) | undefined;
        didDocumentProofs?: ({
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] & ({
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
        } & { [K_13 in Exclude<keyof I["didDocumentProofs"][number], keyof DocumentProof>]: never; })[] & { [K_14 in Exclude<keyof I["didDocumentProofs"], keyof {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[]>]: never; }) | undefined;
        txAuthor?: string | undefined;
    } & { [K_15 in Exclude<keyof I, keyof MsgRegisterDID>]: never; }>(base?: I | undefined): MsgRegisterDID;
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
        didDocumentProofs?: {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] | undefined;
        txAuthor?: string | undefined;
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
            "@context"?: (string[] & string[] & { [K_16 in Exclude<keyof I_1["didDocument"]["@context"], keyof string[]>]: never; }) | undefined;
            id?: string | undefined;
            controller?: (string[] & string[] & { [K_17 in Exclude<keyof I_1["didDocument"]["controller"], keyof string[]>]: never; }) | undefined;
            alsoKnownAs?: (string[] & string[] & { [K_18 in Exclude<keyof I_1["didDocument"]["alsoKnownAs"], keyof string[]>]: never; }) | undefined;
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
            } & { [K_19 in Exclude<keyof I_1["didDocument"]["verificationMethod"][number], keyof import("./did").VerificationMethod>]: never; })[] & { [K_20 in Exclude<keyof I_1["didDocument"]["verificationMethod"], keyof {
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            }[]>]: never; }) | undefined;
            authentication?: (string[] & string[] & { [K_21 in Exclude<keyof I_1["didDocument"]["authentication"], keyof string[]>]: never; }) | undefined;
            assertionMethod?: (string[] & string[] & { [K_22 in Exclude<keyof I_1["didDocument"]["assertionMethod"], keyof string[]>]: never; }) | undefined;
            keyAgreement?: (string[] & string[] & { [K_23 in Exclude<keyof I_1["didDocument"]["keyAgreement"], keyof string[]>]: never; }) | undefined;
            capabilityInvocation?: (string[] & string[] & { [K_24 in Exclude<keyof I_1["didDocument"]["capabilityInvocation"], keyof string[]>]: never; }) | undefined;
            capabilityDelegation?: (string[] & string[] & { [K_25 in Exclude<keyof I_1["didDocument"]["capabilityDelegation"], keyof string[]>]: never; }) | undefined;
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
            } & { [K_26 in Exclude<keyof I_1["didDocument"]["service"][number], keyof import("./did").Service>]: never; })[] & { [K_27 in Exclude<keyof I_1["didDocument"]["service"], keyof {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_28 in Exclude<keyof I_1["didDocument"], keyof DidDocument>]: never; }) | undefined;
        didDocumentProofs?: ({
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] & ({
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
        } & { [K_29 in Exclude<keyof I_1["didDocumentProofs"][number], keyof DocumentProof>]: never; })[] & { [K_30 in Exclude<keyof I_1["didDocumentProofs"], keyof {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[]>]: never; }) | undefined;
        txAuthor?: string | undefined;
    } & { [K_31 in Exclude<keyof I_1, keyof MsgRegisterDID>]: never; }>(object: I_1): MsgRegisterDID;
};
export declare const MsgRegisterDIDResponse: {
    encode(_: MsgRegisterDIDResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterDIDResponse;
    fromJSON(_: any): MsgRegisterDIDResponse;
    toJSON(_: MsgRegisterDIDResponse): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): MsgRegisterDIDResponse;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): MsgRegisterDIDResponse;
};
export declare const MsgUpdateDID: {
    encode(message: MsgUpdateDID, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateDID;
    fromJSON(object: any): MsgUpdateDID;
    toJSON(message: MsgUpdateDID): unknown;
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
        didDocumentProofs?: {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] | undefined;
        versionId?: string | undefined;
        txAuthor?: string | undefined;
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
            } & { [K_3 in Exclude<keyof I["didDocument"]["verificationMethod"][number], keyof import("./did").VerificationMethod>]: never; })[] & { [K_4 in Exclude<keyof I["didDocument"]["verificationMethod"], keyof {
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
            } & { [K_10 in Exclude<keyof I["didDocument"]["service"][number], keyof import("./did").Service>]: never; })[] & { [K_11 in Exclude<keyof I["didDocument"]["service"], keyof {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_12 in Exclude<keyof I["didDocument"], keyof DidDocument>]: never; }) | undefined;
        didDocumentProofs?: ({
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] & ({
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
        } & { [K_13 in Exclude<keyof I["didDocumentProofs"][number], keyof DocumentProof>]: never; })[] & { [K_14 in Exclude<keyof I["didDocumentProofs"], keyof {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[]>]: never; }) | undefined;
        versionId?: string | undefined;
        txAuthor?: string | undefined;
    } & { [K_15 in Exclude<keyof I, keyof MsgUpdateDID>]: never; }>(base?: I | undefined): MsgUpdateDID;
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
        didDocumentProofs?: {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] | undefined;
        versionId?: string | undefined;
        txAuthor?: string | undefined;
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
            "@context"?: (string[] & string[] & { [K_16 in Exclude<keyof I_1["didDocument"]["@context"], keyof string[]>]: never; }) | undefined;
            id?: string | undefined;
            controller?: (string[] & string[] & { [K_17 in Exclude<keyof I_1["didDocument"]["controller"], keyof string[]>]: never; }) | undefined;
            alsoKnownAs?: (string[] & string[] & { [K_18 in Exclude<keyof I_1["didDocument"]["alsoKnownAs"], keyof string[]>]: never; }) | undefined;
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
            } & { [K_19 in Exclude<keyof I_1["didDocument"]["verificationMethod"][number], keyof import("./did").VerificationMethod>]: never; })[] & { [K_20 in Exclude<keyof I_1["didDocument"]["verificationMethod"], keyof {
                id?: string | undefined;
                type?: string | undefined;
                controller?: string | undefined;
                publicKeyMultibase?: string | undefined;
                blockchainAccountId?: string | undefined;
            }[]>]: never; }) | undefined;
            authentication?: (string[] & string[] & { [K_21 in Exclude<keyof I_1["didDocument"]["authentication"], keyof string[]>]: never; }) | undefined;
            assertionMethod?: (string[] & string[] & { [K_22 in Exclude<keyof I_1["didDocument"]["assertionMethod"], keyof string[]>]: never; }) | undefined;
            keyAgreement?: (string[] & string[] & { [K_23 in Exclude<keyof I_1["didDocument"]["keyAgreement"], keyof string[]>]: never; }) | undefined;
            capabilityInvocation?: (string[] & string[] & { [K_24 in Exclude<keyof I_1["didDocument"]["capabilityInvocation"], keyof string[]>]: never; }) | undefined;
            capabilityDelegation?: (string[] & string[] & { [K_25 in Exclude<keyof I_1["didDocument"]["capabilityDelegation"], keyof string[]>]: never; }) | undefined;
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
            } & { [K_26 in Exclude<keyof I_1["didDocument"]["service"][number], keyof import("./did").Service>]: never; })[] & { [K_27 in Exclude<keyof I_1["didDocument"]["service"], keyof {
                id?: string | undefined;
                type?: string | undefined;
                serviceEndpoint?: string | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_28 in Exclude<keyof I_1["didDocument"], keyof DidDocument>]: never; }) | undefined;
        didDocumentProofs?: ({
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] & ({
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
        } & { [K_29 in Exclude<keyof I_1["didDocumentProofs"][number], keyof DocumentProof>]: never; })[] & { [K_30 in Exclude<keyof I_1["didDocumentProofs"], keyof {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[]>]: never; }) | undefined;
        versionId?: string | undefined;
        txAuthor?: string | undefined;
    } & { [K_31 in Exclude<keyof I_1, keyof MsgUpdateDID>]: never; }>(object: I_1): MsgUpdateDID;
};
export declare const MsgUpdateDIDResponse: {
    encode(_: MsgUpdateDIDResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateDIDResponse;
    fromJSON(_: any): MsgUpdateDIDResponse;
    toJSON(_: MsgUpdateDIDResponse): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): MsgUpdateDIDResponse;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): MsgUpdateDIDResponse;
};
export declare const MsgDeactivateDID: {
    encode(message: MsgDeactivateDID, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeactivateDID;
    fromJSON(object: any): MsgDeactivateDID;
    toJSON(message: MsgDeactivateDID): unknown;
    create<I extends {
        didDocumentId?: string | undefined;
        didDocumentProofs?: {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] | undefined;
        versionId?: string | undefined;
        txAuthor?: string | undefined;
    } & {
        didDocumentId?: string | undefined;
        didDocumentProofs?: ({
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] & ({
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
        } & { [K in Exclude<keyof I["didDocumentProofs"][number], keyof DocumentProof>]: never; })[] & { [K_1 in Exclude<keyof I["didDocumentProofs"], keyof {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[]>]: never; }) | undefined;
        versionId?: string | undefined;
        txAuthor?: string | undefined;
    } & { [K_2 in Exclude<keyof I, keyof MsgDeactivateDID>]: never; }>(base?: I | undefined): MsgDeactivateDID;
    fromPartial<I_1 extends {
        didDocumentId?: string | undefined;
        didDocumentProofs?: {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] | undefined;
        versionId?: string | undefined;
        txAuthor?: string | undefined;
    } & {
        didDocumentId?: string | undefined;
        didDocumentProofs?: ({
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[] & ({
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
        } & { [K_3 in Exclude<keyof I_1["didDocumentProofs"][number], keyof DocumentProof>]: never; })[] & { [K_4 in Exclude<keyof I_1["didDocumentProofs"], keyof {
            type?: string | undefined;
            created?: string | undefined;
            verificationMethod?: string | undefined;
            proofPurpose?: string | undefined;
            proofValue?: string | undefined;
            clientSpecType?: import("./client_spec").ClientSpecType | undefined;
        }[]>]: never; }) | undefined;
        versionId?: string | undefined;
        txAuthor?: string | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof MsgDeactivateDID>]: never; }>(object: I_1): MsgDeactivateDID;
};
export declare const MsgDeactivateDIDResponse: {
    encode(_: MsgDeactivateDIDResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeactivateDIDResponse;
    fromJSON(_: any): MsgDeactivateDIDResponse;
    toJSON(_: MsgDeactivateDIDResponse): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): MsgDeactivateDIDResponse;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): MsgDeactivateDIDResponse;
};
export declare const MsgRegisterCredentialSchema: {
    encode(message: MsgRegisterCredentialSchema, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterCredentialSchema;
    fromJSON(object: any): MsgRegisterCredentialSchema;
    toJSON(message: MsgRegisterCredentialSchema): unknown;
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
        txAuthor?: string | undefined;
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
            } & { [K_2 in Exclude<keyof I["credentialSchemaDocument"]["schema"], keyof import("./credential_schema").CredentialSchemaProperty>]: never; }) | undefined;
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
        txAuthor?: string | undefined;
    } & { [K_5 in Exclude<keyof I, keyof MsgRegisterCredentialSchema>]: never; }>(base?: I | undefined): MsgRegisterCredentialSchema;
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
        txAuthor?: string | undefined;
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
            } & { [K_8 in Exclude<keyof I_1["credentialSchemaDocument"]["schema"], keyof import("./credential_schema").CredentialSchemaProperty>]: never; }) | undefined;
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
        txAuthor?: string | undefined;
    } & { [K_11 in Exclude<keyof I_1, keyof MsgRegisterCredentialSchema>]: never; }>(object: I_1): MsgRegisterCredentialSchema;
};
export declare const MsgRegisterCredentialSchemaResponse: {
    encode(_: MsgRegisterCredentialSchemaResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterCredentialSchemaResponse;
    fromJSON(_: any): MsgRegisterCredentialSchemaResponse;
    toJSON(_: MsgRegisterCredentialSchemaResponse): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): MsgRegisterCredentialSchemaResponse;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): MsgRegisterCredentialSchemaResponse;
};
export declare const MsgUpdateCredentialSchema: {
    encode(message: MsgUpdateCredentialSchema, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateCredentialSchema;
    fromJSON(object: any): MsgUpdateCredentialSchema;
    toJSON(message: MsgUpdateCredentialSchema): unknown;
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
        txAuthor?: string | undefined;
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
            } & { [K_2 in Exclude<keyof I["credentialSchemaDocument"]["schema"], keyof import("./credential_schema").CredentialSchemaProperty>]: never; }) | undefined;
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
        txAuthor?: string | undefined;
    } & { [K_5 in Exclude<keyof I, keyof MsgUpdateCredentialSchema>]: never; }>(base?: I | undefined): MsgUpdateCredentialSchema;
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
        txAuthor?: string | undefined;
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
            } & { [K_8 in Exclude<keyof I_1["credentialSchemaDocument"]["schema"], keyof import("./credential_schema").CredentialSchemaProperty>]: never; }) | undefined;
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
        txAuthor?: string | undefined;
    } & { [K_11 in Exclude<keyof I_1, keyof MsgUpdateCredentialSchema>]: never; }>(object: I_1): MsgUpdateCredentialSchema;
};
export declare const MsgUpdateCredentialSchemaResponse: {
    encode(_: MsgUpdateCredentialSchemaResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateCredentialSchemaResponse;
    fromJSON(_: any): MsgUpdateCredentialSchemaResponse;
    toJSON(_: MsgUpdateCredentialSchemaResponse): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): MsgUpdateCredentialSchemaResponse;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): MsgUpdateCredentialSchemaResponse;
};
export declare const MsgRegisterCredentialStatus: {
    encode(message: MsgRegisterCredentialStatus, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterCredentialStatus;
    fromJSON(object: any): MsgRegisterCredentialStatus;
    toJSON(message: MsgRegisterCredentialStatus): unknown;
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
        txAuthor?: string | undefined;
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
        txAuthor?: string | undefined;
    } & { [K_3 in Exclude<keyof I, keyof MsgRegisterCredentialStatus>]: never; }>(base?: I | undefined): MsgRegisterCredentialStatus;
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
        txAuthor?: string | undefined;
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
        txAuthor?: string | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof MsgRegisterCredentialStatus>]: never; }>(object: I_1): MsgRegisterCredentialStatus;
};
export declare const MsgRegisterCredentialStatusResponse: {
    encode(_: MsgRegisterCredentialStatusResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterCredentialStatusResponse;
    fromJSON(_: any): MsgRegisterCredentialStatusResponse;
    toJSON(_: MsgRegisterCredentialStatusResponse): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): MsgRegisterCredentialStatusResponse;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): MsgRegisterCredentialStatusResponse;
};
export declare const MsgUpdateCredentialStatus: {
    encode(message: MsgUpdateCredentialStatus, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateCredentialStatus;
    fromJSON(object: any): MsgUpdateCredentialStatus;
    toJSON(message: MsgUpdateCredentialStatus): unknown;
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
        txAuthor?: string | undefined;
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
        txAuthor?: string | undefined;
    } & { [K_3 in Exclude<keyof I, keyof MsgUpdateCredentialStatus>]: never; }>(base?: I | undefined): MsgUpdateCredentialStatus;
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
        txAuthor?: string | undefined;
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
        txAuthor?: string | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof MsgUpdateCredentialStatus>]: never; }>(object: I_1): MsgUpdateCredentialStatus;
};
export declare const MsgUpdateCredentialStatusResponse: {
    encode(_: MsgUpdateCredentialStatusResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateCredentialStatusResponse;
    fromJSON(_: any): MsgUpdateCredentialStatusResponse;
    toJSON(_: MsgUpdateCredentialStatusResponse): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): MsgUpdateCredentialStatusResponse;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): MsgUpdateCredentialStatusResponse;
};
export interface Msg {
    RegisterDID(request: MsgRegisterDID): Promise<MsgRegisterDIDResponse>;
    UpdateDID(request: MsgUpdateDID): Promise<MsgUpdateDIDResponse>;
    DeactivateDID(request: MsgDeactivateDID): Promise<MsgDeactivateDIDResponse>;
    RegisterCredentialSchema(request: MsgRegisterCredentialSchema): Promise<MsgRegisterCredentialSchemaResponse>;
    UpdateCredentialSchema(request: MsgUpdateCredentialSchema): Promise<MsgUpdateCredentialSchemaResponse>;
    RegisterCredentialStatus(request: MsgRegisterCredentialStatus): Promise<MsgRegisterCredentialStatusResponse>;
    UpdateCredentialStatus(request: MsgUpdateCredentialStatus): Promise<MsgUpdateCredentialStatusResponse>;
}
export declare const MsgServiceName = "hypersign.ssi.v1.Msg";
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    RegisterDID(request: MsgRegisterDID): Promise<MsgRegisterDIDResponse>;
    UpdateDID(request: MsgUpdateDID): Promise<MsgUpdateDIDResponse>;
    DeactivateDID(request: MsgDeactivateDID): Promise<MsgDeactivateDIDResponse>;
    RegisterCredentialSchema(request: MsgRegisterCredentialSchema): Promise<MsgRegisterCredentialSchemaResponse>;
    UpdateCredentialSchema(request: MsgUpdateCredentialSchema): Promise<MsgUpdateCredentialSchemaResponse>;
    RegisterCredentialStatus(request: MsgRegisterCredentialStatus): Promise<MsgRegisterCredentialStatusResponse>;
    UpdateCredentialStatus(request: MsgUpdateCredentialStatus): Promise<MsgUpdateCredentialStatusResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
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
//# sourceMappingURL=tx.d.ts.map