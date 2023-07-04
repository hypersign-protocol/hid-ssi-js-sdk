/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { OfflineSigner } from '@cosmjs/proto-signing';
import { Schema, SchemaProof } from '../../libs/generated/ssi/schema';
export interface ISchemaRPC {
    createSchema(schema: Schema, proof: SchemaProof): Promise<object>;
    resolveSchema(schemaId: string): Promise<object>;
}
export declare class SchemaRpc implements ISchemaRPC {
    schemaRestEp: string;
    private hidClient;
    constructor({ offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, }: {
        offlineSigner?: OfflineSigner;
        nodeRpcEndpoint: string;
        nodeRestEndpoint: string;
    });
    init(): Promise<void>;
    createSchema(schema: Schema, proof: SchemaProof): Promise<object>;
    resolveSchema(schemaId: string): Promise<Array<object>>;
}
//# sourceMappingURL=schemaRPC.d.ts.map