/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import { Schema as ISchemaProto, Schema, SchemaDocument } from '../../libs/generated/ssi/schema';
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

  sign(params: { privateKeyMultibase: string; schema: SchemaDocument; verificationMethodId: string }): Promise<Schema>;

  register(params: { schema: Schema }): Promise<object>;

  resolve(params: { schemaId: string }): Promise<Schema>;
}
