/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import * as generatedProto from '../../libs/generated/ssi/tx';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { ICredentialRPC } from './ICredential';
import { CredentialStatusDocument as CredentialStatus, CredentialStatusState as Credential } from '../../libs/generated/ssi/credential_status';
import { DocumentProof as CredentialProof } from '../../libs/generated/ssi/proof';
import { OfflineSigner } from '@cosmjs/proto-signing';
export declare class CredentialRPC implements ICredentialRPC {
    credentialRestEP: string;
    private hidClient;
    private nodeRestEp;
    constructor({ offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, }: {
        offlineSigner?: OfflineSigner;
        nodeRpcEndpoint: string;
        nodeRestEndpoint: string;
    });
    init(): Promise<void>;
    registerCredentialStatus(credentialStatus: CredentialStatus, proof: CredentialProof): Promise<DeliverTxResponse>;
    generateCredentialStatusTxnMessage(credentialStatus: CredentialStatus, proof: CredentialProof): Promise<{
        typeUrl: string;
        value: generatedProto.MsgRegisterCredentialStatus;
    }>;
    registerCredentialStatusBulk(txMessages: []): Promise<DeliverTxResponse>;
    resolveCredentialStatus(credentialId: string): Promise<Credential>;
    updateCredentialStatus(credentialStatus: CredentialStatus, proof: CredentialProof): Promise<DeliverTxResponse>;
}
//# sourceMappingURL=credRPC.d.ts.map