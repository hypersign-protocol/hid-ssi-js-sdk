/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { Did as IDidProto, Metadata, VerificationMethod, Service, SignInfo } from '../../libs/generated/ssi/did';
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
    EcdsaSecp256k1RecoveryMethod2020 = "EcdsaSecp256k1RecoveryMethod2020"
}
export declare enum IClientSpec {
    'eth-personalSign' = "eth-personalSign",
    'cosmos-ADR036' = "cosmos-ADR036"
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
    }): Promise<object>;
    register(params: {
        didDocument: object;
        privateKeyMultibase: string;
        verificationMethodId: string;
    }): Promise<object>;
    resolve(params: {
        did: string;
        ed25519verificationkey2020?: boolean;
    }): Promise<object>;
    update(params: {
        didDocument: object;
        privateKeyMultibase: string;
        verificationMethodId: string;
        versionId: string;
    }): Promise<object>;
    deactivate(params: {
        didDocument: object;
        privateKeyMultibase: string;
        verificationMethodId: string;
        versionId: string;
    }): Promise<object>;
    sign(params: {
        didDocument: object;
        privateKeyMultibase: string;
        challenge: string;
        domain: string;
        did: string;
        verificationMethodId: string;
    }): Promise<object>;
    verify(params: {
        didDocument: object;
        verificationMethodId: string;
        challenge: string;
        domain?: string;
    }): Promise<object>;
}
export interface IDIDResolve {
    didDocument: IDidDocument;
    didDocumentMetadata: Metadata;
}
export interface IDIDRpc {
    registerDID(didDoc: IDidProto, signInfos: SignInfo[]): Promise<object>;
    updateDID(didDoc: IDidProto | any, signInfos: SignInfo[], versionId: string): Promise<object>;
    deactivateDID(did: string, signInfos: SignInfo[], versionId: string): Promise<object>;
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
export {};
//# sourceMappingURL=IDID.d.ts.map