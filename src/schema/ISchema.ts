import { Schema as ISchemaProto, Schema } from '../generated/ssi/schema';
export interface ISchemaFields {
  type: string;
  format?: string;
  name: string;
  isRequired: boolean;
}

export interface ISchemaMethods {
  getSchema(params: {
    name: string;
    description?: string;
    author: string;
    fields?: Array<ISchemaFields>;
    additionalProperties: boolean;
  }): Schema;

  signSchema(params: { privateKey: string; schema: ISchemaProto }): Promise<string>;

  registerSchema(params: { schema: Schema; signature: string; verificationMethodId: string }): Promise<any>;

  resolve(params: { schemaId: string }): Promise<Schema>;
}
