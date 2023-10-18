/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import * as generatedProto from '../../libs/generated/ssi/tx';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { ICredentialRPC } from './ICredential';
import { CredentialStatus, CredentialProof, Credential } from '../../libs/generated/ssi/credential';
import { OfflineSigner } from '@cosmjs/proto-signing';
export declare class CredentialRPC implements ICredentialRPC {
    credentialRestEP: string;
    private hidClient;
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
}
//# sourceMappingURL=credRPC.d.ts.map