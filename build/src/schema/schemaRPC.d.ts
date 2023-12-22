/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { OfflineSigner } from '@cosmjs/proto-signing';
import { CredentialSchemaDocument } from '../../libs/generated/ssi/credential_schema';
import { DocumentProof as SchemaProof } from '../../libs/generated/ssi/proof';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { CredentialSchemaDocument as SchemaDocument } from '../../libs/generated/ssi/credential_schema';
export interface ISchemaRPC {
    registerSchema(schema: SchemaDocument, proof: SchemaProof): Promise<object>;
    resolveSchema(schemaId: string): Promise<object>;
}
export declare class SchemaRpc implements ISchemaRPC {
    schemaRestEp: string;
    private hidClient;
    private nodeRestEp;
    constructor({ offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, }: {
        offlineSigner?: OfflineSigner;
        nodeRpcEndpoint: string;
        nodeRestEndpoint: string;
    });
    init(): Promise<void>;
    registerSchema(schema: CredentialSchemaDocument, proof: SchemaProof): Promise<DeliverTxResponse>;
    resolveSchema(schemaId: string): Promise<Array<object>>;
}
//# sourceMappingURL=schemaRPC.d.ts.map