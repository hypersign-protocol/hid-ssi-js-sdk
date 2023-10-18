/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { Did as IDidProto, Metadata, VerificationMethod, Service, Did, SignInfo } from '../../libs/generated/ssi/did';
import { ClientSpec } from '../../libs/generated/ssi/clientSpec';
import Web3 from 'web3';
export interface IPublicKey {
    '@context': string;
    id: string;
    type: string;
    publicKeyBase58: string;
}
export declare enum IVerificationRelationships {
    authentication = "authentication",
    assertionMethod = "assertionMethod",
    keyAgreement = "keyAgreement",
    capabilityInvocation = "capabilityInvocation",
    capabilityDelegation = "capabilityDelegation"
}
export declare enum IKeyType {
    Ed25519VerificationKey2020 = "Ed25519VerificationKey2020",
    EcdsaSecp256k1VerificationKey2019 = "EcdsaSecp256k1VerificationKey2019",
    EcdsaSecp256k1RecoveryMethod2020 = "EcdsaSecp256k1RecoveryMethod2020",
    X25519KeyAgreementKey2020 = "X25519KeyAgreementKey2020",
    X25519KeyAgreementKeyEIP5630 = "X25519KeyAgreementKeyEIP5630"
}
export declare enum IClientSpec {
    'eth-personalSign' = "eth-personalSign",
    'cosmos-ADR036' = "cosmos-ADR036"
}
export interface ExtendedClientSpec extends ClientSpec {
    type: IClientSpec;
    adr036SignerAddress: string;
}
export interface ISignInfo {
    verification_method_id: string;
    signature: string;
    clientSpec?: ExtendedClientSpec | undefined;
}
export interface IController {
    '@context': string;
    id: string;
    authentication: Array<string>;
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
        verificationRelationships: IVerificationRelationships[];
    }): Promise<Did>;
    register(params: {
        didDocument: Did;
        privateKeyMultibase?: string;
        verificationMethodId?: string;
        signData?: ISignData[];
    }): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    resolve(params: {
        did: string;
        ed25519verificationkey2020?: boolean;
    }): Promise<IDIDResolve>;
    update(params: {
        didDocument: Did;
        privateKeyMultibase: string;
        verificationMethodId: string;
        versionId: string;
    }): Promise<{
        transactionHash: string;
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
        didDocument: Did;
        privateKeyMultibase: string;
        challenge: string;
        domain: string;
        did: string;
        verificationMethodId: string;
    }): Promise<ISignedDIDDocument>;
    verify(params: {
        didDocument: Did;
        verificationMethodId: string;
        challenge: string;
        domain?: string;
    }): Promise<object>;
    addVerificationMethod(params: {
        did?: string;
        didDocument?: Did;
        type: IKeyType;
        id?: string;
        controller?: string;
        publicKeyMultibase?: string;
        blockchainAccountId?: string;
    }): Promise<Did>;
    createByClientSpec(params: {
        methodSpecificId: string;
        publicKey?: string;
        address: string;
        chainId: string;
        clientSpec: IClientSpec;
        verificationRelationships?: IVerificationRelationships[];
    }): Promise<Did>;
    registerByClientSpec(params: {
        didDocument: Did;
        signInfos: SignInfo[];
    }): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    updateByClientSpec(params: {
        didDocument: Did;
        versionId: string;
        signInfos: SignInfo[];
    }): Promise<{
        transactionHash: string;
    }>;
    deactivateByClientSpec(params: {
        didDocument: Did;
        signInfos: SignInfo[];
        versionId: string;
    }): Promise<{
        transactionHash: string;
    }>;
    signAndRegisterByClientSpec(params: {
        didDocument: Did;
        address: string;
        verificationMethodId: string;
        web3: Web3 | any;
        clientSpec: IClientSpec;
        chainId?: string;
    }): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    signByClientSpec(params: {
        didDocument: Did;
        clientSpec: IClientSpec;
        address: string;
        web3: Web3 | any;
        chainId?: string;
    }): Promise<{
        didDocument: Did;
        signature: string;
    }>;
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
    type: IKeyType;
}
export {};
//# sourceMappingURL=IDID.d.ts.map