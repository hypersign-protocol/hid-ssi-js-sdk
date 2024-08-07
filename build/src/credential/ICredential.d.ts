/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { TypedDataField } from '@ethersproject/abstract-signer';
import { CredentialStatusDocument as CredentialStatus, CredentialStatusState as Credential } from '../../libs/generated/ssi/credential_status';
import { DocumentProof as CredentialProof } from '../../libs/generated/ssi/proof';
import { DeliverTxResponse } from '@cosmjs/stargate';
export interface ISchema {
    id: string;
    type: string;
}
export interface ICredentialStatus {
    id: string;
    type: string;
}
export interface ICredentialProof {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    jws?: string;
    proofValue: string;
    canonicalizationHash: string;
    eip712: {
        domain: object;
        types: Record<string, TypedDataField[]> | string;
    };
}
export interface IVerifiableCredential {
    '@context': Array<string>;
    id: string;
    type: Array<string>;
    issuer: string;
    issuanceDate: string;
    expirationDate: string;
    credentialSubject: object;
    credentialSchema: ISchema;
    credentialStatus: ICredentialStatus;
    proof?: ICredentialProof;
}
export interface ICredentialMethods {
    generate(params: {
        schemaId: string;
        subjectDid?: string;
        subjectDidDocSigned?: JSON;
        schemaContext?: Array<string>;
        type?: Array<string>;
        issuerDid: string;
        expirationDate: string;
        fields: object;
    }): Promise<IVerifiableCredential>;
    issue(params: {
        credential: IVerifiableCredential;
        issuerDid: string;
        privateKeyMultibase: string;
        registerCredential?: boolean;
    }): Promise<{
        signedCredential: IVerifiableCredential;
        credentialStatus: CredentialStatus;
        credentialStatusProof: CredentialProof;
        credentialStatusRegistrationResult?: DeliverTxResponse;
    }>;
    verify(params: {
        credential: IVerifiableCredential;
        issuerDid: string;
        verificationMethodId: string;
    }): Promise<object>;
    updateCredentialStatus(params: {
        credentialStatus: CredentialStatus;
        issuerDid: string;
        verificationMethodId: string;
        privateKeyMultibase: string;
        status: string;
        statusReason?: string;
    }): Promise<DeliverTxResponse | {
        credentialStatus: CredentialStatus;
        proofValue: any;
    }>;
    resolveCredentialStatus(params: {
        credentialId: string;
    }): Promise<IResolveCredential>;
    checkCredentialStatus(params: {
        credentialId: string;
    }): Promise<{
        verified: boolean;
    }>;
}
export interface IResolveCredential extends CredentialStatus {
    proof: CredentialProof;
}
export interface ICredentialRPC {
    credentialRestEP: string;
    registerCredentialStatus(credentialStatus: CredentialStatus, proof: CredentialProof): Promise<DeliverTxResponse>;
    resolveCredentialStatus(credentialId: string): Promise<Credential>;
    generateCredentialStatusTxnMessage(credentialStatus: CredentialStatus, proof: CredentialProof): Promise<object>;
    registerCredentialStatusBulk(txMessages: Array<any>[]): Promise<DeliverTxResponse>;
}
//# sourceMappingURL=ICredential.d.ts.map