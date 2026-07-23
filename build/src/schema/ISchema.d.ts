/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { CredentialSchemaDocument as SchemaDocument, CredentialSchemaProperty as SchemaProperty } from '../../libs/generated/ssi/credential_schema';
import { DocumentProof } from '../../libs/generated/ssi/proof';
/**
 * Schemas are serialized before they are stored on-chain. A resolved schema
 * exposes its properties in their usable object form instead.
 */
export type IResolvedSchemaProperty = Omit<SchemaProperty, 'properties'> & {
    properties?: Record<string, unknown>;
};
export interface ISchemaFields {
    type: string;
    format?: string;
    name: string;
    isRequired: boolean;
}
export interface ISchemaMethods {
    generate(params: {
        name: string;
        description?: string;
        author: string;
        fields?: Array<ISchemaFields>;
        additionalProperties: boolean;
    }): Promise<SchemaDocument>;
    sign(params: {
        privateKeyMultibase: string;
        schema: SchemaDocument;
        verificationMethodId: string;
    }): Promise<ISignedSchema>;
    register(params: {
        schema: ISignedSchema;
    }): Promise<{
        transactionHash: string;
    }>;
    resolve(params: {
        schemaId: string;
    }): Promise<IResolveSchema>;
}
export interface ISignedSchema extends SchemaDocument {
    proof?: DocumentProof;
}
export interface IResolveSchema extends Omit<SchemaDocument, 'schema'> {
    schema?: IResolvedSchemaProperty;
    proof?: DocumentProof;
}
//# sourceMappingURL=ISchema.d.ts.map