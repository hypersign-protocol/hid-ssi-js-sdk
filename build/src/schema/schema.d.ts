/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { CredentialSchemaDocument as SchemaDocument, CredentialSchemaProperty as SchemaProperty } from '../../libs/generated/ssi/credential_schema';
import { SchemaRpc } from './schemaRPC';
import { ISchemaFields, ISchemaMethods, IResolveSchema } from './ISchema';
import { OfflineSigner } from '@cosmjs/proto-signing';
import HypersignBJJSchema from './bjjSchema';
export default class HyperSignSchema implements ISchemaMethods {
    '@context': Array<string>;
    type: string;
    modelVersion: string;
    id: string;
    name: string;
    author: string;
    authored: string;
    schema: SchemaProperty;
    schemaRpc: SchemaRpc | null;
    namespace: string;
    private schemaApiService;
    private hsDid;
    hypersignBjjschema: HypersignBJJSchema;
    constructor(params?: {
        namespace?: string;
        offlineSigner?: OfflineSigner;
        nodeRpcEndpoint?: string;
        nodeRestEndpoint?: string;
        entityApiSecretKey?: string;
    });
    private _getSchemaId;
    private _getDateTime;
    private isPascalCase;
    private _jsonLdSign;
    /**
     * Initialise the offlinesigner to interact with Hypersign blockchain
     */
    init(): Promise<void>;
    /**
     * Generates a new schema doc without proof
     * @params
     *  - params.name                 : Name of the schema
     *  - params.description          : Optional - Description of the schema
     *  - params.author               : DID of the author
     *  - params.fields               : Schema fields of type ISchemaFields
     *  - params.additionalProperties : If additionalProperties can be added, boolean
     * @returns {Promise<SchemaDocument>} SchemaDocument object
     */
    generate(params: {
        name: string;
        description?: string;
        author: string;
        fields?: Array<ISchemaFields>;
        additionalProperties: boolean;
    }): Promise<SchemaDocument>;
    /**
     * Signs a schema document and attaches proof
     * @params
     *  - params.schema               : The schema document without proof
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     * @returns {Promise<IResolveSchema>} Schema with proof
     */
    sign(params: {
        privateKeyMultibase: string;
        schema: SchemaDocument;
        verificationMethodId: string;
    }): Promise<IResolveSchema>;
    /**
     * Register a schema Document in Hypersign blockchain - an onchain activity
     * @params
     *  - params.schema               : The schema document with schemaProof
     * @returns {Promise<object>} Result of the registration
     */
    register(params: {
        schema: IResolveSchema;
    }): Promise<{
        transactionHash: string;
    }>;
    /**
     * Resolves a schema document with schemId from Hypersign blockchain - an onchain activity
     * @params
     *  - params.schemaId             : Id of the schema document
     * @returns {Promise<IResolveSchema>} Returns schema document
     */
    resolve(params: {
        schemaId: string;
    }): Promise<IResolveSchema>;
    vcJsonSchema(schemaResolved: IResolveSchema): {
        $schema: string;
        description: string | undefined;
        properties: {
            credentialSubject: {
                description: string;
                title: string;
                properties: {
                    id: {
                        description: string;
                        title: string;
                        format: string;
                        type: string;
                    };
                };
                required: string[] | undefined;
                type: string;
            };
        };
        type: string;
        required: string[];
    };
}
//# sourceMappingURL=schema.d.ts.map