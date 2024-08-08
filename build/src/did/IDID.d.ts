/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { DidDocument as IDidProto, DidDocumentMetadata as Metadata, VerificationMethod, Service, DidDocument } from '../../libs/generated/ssi/did';
import { DocumentProof as SignInfo } from '../../libs/generated/ssi/proof';
import Web3 from 'web3';
import { VerificationMethodRelationships, VerificationMethodTypes } from '../../libs/generated/ssi/client/enums';
export interface IPublicKey {
    '@context': string;
    id: string;
    type: string;
    publicKeyBase58: string;
}
export declare enum IClientSpec {
    'eth-personalSign' = "eth-personalSign",
    'cosmos-ADR036' = "cosmos-ADR036"
}
export declare enum SupportedPurpose {
    'assertion' = "assertion",
    'authentication' = "authentication"
}
export interface ExtendedClientSpec {
    type: IClientSpec;
    adr036SignerAddress?: string;
}
export interface ISignInfo {
    verification_method_id: string;
    signature: string;
    clientSpec?: ExtendedClientSpec | undefined;
    created: string;
}
export interface IController {
    '@context': string;
    id: string;
    authentication?: Array<string>;
    assertionMethod?: Array<string>;
}
export interface IParams {
    doc: object;
    privateKey?: string;
    publicKey: IPublicKey;
    challenge: string;
    domain: string;
    controller: IController;
    did: string;
    verificationMethodId: string;
}
export interface IDid extends IDidProto {
    '@context': Array<any>;
}
interface IProof {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    challenge: string;
    domain: string;
    proofValue: string;
}
export interface ISignedDIDDocument extends IDidProto {
    proof: IProof;
}
export interface IDID {
    generateKeys(params: {
        seed?: string;
        controller?: string;
    }): Promise<{
        privateKeyMultibase: string;
        publicKeyMultibase: string;
    }>;
    generate(params: {
        methodSpecificId?: string;
        publicKeyMultibase: string;
        verificationRelationships: VerificationMethodRelationships[];
    }): Promise<DidDocument>;
    register(params: {
        didDocument: DidDocument;
        privateKeyMultibase?: string;
        verificationMethodId?: string;
        signData?: ISignData[];
    }): Promise<{
        didDocument: DidDocument;
        transactionHash: string;
    }>;
    resolve(params: {
        did: string;
    }): Promise<IDIDResolve>;
    update(params: {
        didDocument: DidDocument;
        privateKeyMultibase: string;
        verificationMethodId: string;
        versionId: string;
    }): Promise<{
        transactionHash: string;
    } | {
        didDocument: any;
        signInfos: any;
        versionId: any;
    }>;
    deactivate(params: {
        didDocument: object;
        privateKeyMultibase: string;
        verificationMethodId: string;
        versionId: string;
    }): Promise<{
        transactionHash: string;
    }>;
    sign(params: {
        didDocument: DidDocument;
        privateKeyMultibase: string;
        challenge: string;
        domain: string;
        did: string;
        verificationMethodId: string;
    }): Promise<ISignedDIDDocument>;
    verify(params: {
        didDocument: DidDocument;
        verificationMethodId: string;
        challenge: string;
        domain?: string;
    }): Promise<object>;
    addVerificationMethod(params: {
        did?: string;
        didDocument?: DidDocument;
        type: VerificationMethodTypes;
        id?: string;
        controller?: string;
        publicKeyMultibase?: string;
        blockchainAccountId?: string;
    }): Promise<DidDocument>;
    createByClientSpec(params: {
        methodSpecificId: string;
        publicKey?: string;
        address: string;
        chainId: string;
        clientSpec: IClientSpec;
        verificationRelationships?: VerificationMethodRelationships[];
    }): Promise<DidDocument>;
    registerByClientSpec(params: {
        didDocument: DidDocument;
        signInfos: SignInfo[];
    }): Promise<{
        didDocument: DidDocument;
        transactionHash: string;
    }>;
    updateByClientSpec(params: {
        didDocument: DidDocument;
        versionId: string;
        signInfos: SignInfo[];
    }): Promise<{
        transactionHash: string;
    }>;
    deactivateByClientSpec(params: {
        didDocument: DidDocument;
        signInfos: SignInfo[];
        versionId: string;
    }): Promise<{
        transactionHash: string;
    }>;
    signAndRegisterByClientSpec(params: {
        didDocument: DidDocument;
        address: string;
        verificationMethodId: string;
        web3: Web3 | any;
        clientSpec: IClientSpec;
        chainId?: string;
    }): Promise<{
        didDocument: DidDocument;
        transactionHash: string;
    }>;
    signByClientSpec(params: {
        didDocument: DidDocument;
        clientSpec: IClientSpec;
        address: string;
        web3: Web3 | any;
        chainId?: string;
        verificationMethodId: any;
    }): Promise<ISignedDIDDocument>;
    createSignInfos(params: {
        didDocument: DidDocument;
        privateKeyMultibase: string;
        verificationMethodId: string;
    }): Promise<Array<ISignInfo>>;
}
export interface IDIDResolve {
    didDocument: IDidDocument;
    didDocumentMetadata: Metadata;
}
export interface MsgData {
    msgType: string;
    data: Uint8Array;
}
export interface DeliverTxResponse {
    readonly height: number;
    /** Error code. The transaction suceeded iff code is 0. */
    readonly code: number;
    readonly transactionHash: string;
    readonly rawLog?: string;
    readonly data?: readonly MsgData[];
    readonly gasUsed: number;
    readonly gasWanted: number;
}
export interface IDIDRpc {
    registerDID(didDoc: IDidProto, signInfos: SignInfo[]): Promise<DeliverTxResponse>;
    updateDID(didDoc: IDidProto | any, signInfos: SignInfo[], versionId: string): Promise<DeliverTxResponse>;
    deactivateDID(did: string, signInfos: SignInfo[], versionId: string): Promise<DeliverTxResponse>;
    resolveDID(did: string): Promise<IDIDResolve>;
    init(): Promise<void>;
}
export interface IDidDocument {
    context: string[];
    id: string;
    controller: string[];
    alsoKnownAs: string[];
    verificationMethod: Array<VerificationMethod>;
    authentication: string[];
    assertionMethod: string[];
    keyAgreement: string[];
    capabilityInvocation: string[];
    capabilityDelegation: string[];
    service: Service[];
}
export interface ISignData {
    verificationMethodId: string;
    privateKeyMultibase: string;
    type: VerificationMethodTypes;
}
export {};
//# sourceMappingURL=IDID.d.ts.map