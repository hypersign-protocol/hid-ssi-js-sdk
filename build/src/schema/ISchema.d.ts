/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { CredentialSchemaDocument as SchemaDocument } from '../../libs/generated/ssi/credential_schema';
import { DocumentProof } from '../../libs/generated/ssi/proof';
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
    }): Promise<IResolveSchema>;
    register(params: {
        schema: IResolveSchema;
    }): Promise<{
        transactionHash: string;
    }>;
    resolve(params: {
        schemaId: string;
    }): Promise<IResolveSchema>;
}
export interface IResolveSchema extends SchemaDocument {
    proof?: DocumentProof;
}
//# sourceMappingURL=ISchema.d.ts.map