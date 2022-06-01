import { Schema as ISchemaProto, Schema, SchemaProperty } from '../generated/ssi/schema';
import { v4 as uuidv4 } from 'uuid';
import { SchemaRpc } from './schemaRPC';
import * as constants from '../constants';
import { ISchemaFields, ISchemaMethods } from './ISchema';
import Utils from '../utils';
const ed25519 = require('@stablelib/ed25519');

export default class HyperSignSchema implements ISchemaMethods, Schema {
  type: string;
  modelVersion: string;
  id: string;
  name: string;
  author: string;
  authored: string;
  schema: SchemaProperty;
  schemaRpc: SchemaRpc;

  constructor() {
    this.schemaRpc = new SchemaRpc();
    (this.type = constants.SCHEMA.SCHEMA_TYPE),
      (this.modelVersion = '1.0'),
      (this.id = ''),
      (this.name = ''),
      (this.author = ''),
      (this.authored = '');
    this.schema = {
      schema: '',
      description: '',
      type: '',
      properties: '',
      required: [],
      additionalProperties: false,
    };
  }

  // Ref:
  private getSchemaId(author: string): string {
    const a = author;
    const b = uuidv4();
    const id = `${a};id=${b};version=${this.modelVersion}`; // ID Structure ->  did:hs:<a>;id=<b>;version=1.0
    return id;
  }

  public getSchema(params: {
    name: string;
    description?: string;
    author: string;
    fields?: Array<ISchemaFields>;
    additionalProperties: boolean;
  }): Schema {
    if (!params.author) throw new Error('HID-SSI-SDK:: Error: Author must be passed');

    this.id = this.getSchemaId(params.author);
    this.name = params.name;
    this.author = params.author;
    this.authored = new Date().toISOString().slice(0, -5) + 'Z';
    this.schema = {
      schema: constants.SCHEMA.SCHEMA_JSON,
      description: params.description ? params.description : '',
      type: 'object',
      properties: '',
      required: [],
      additionalProperties: params.additionalProperties,
    };

    const t = {};
    if (params.fields && params.fields.length > 0) {
      params.fields.forEach((prop) => {
        const schemaPropsObj: {
          propName: string;
          val: { type: string; format?: string };
        } = {} as { propName: string; val: { type: string; format?: string } };
        schemaPropsObj.propName = prop.name;
        schemaPropsObj.val = {} as { type: string; format?: string };
        schemaPropsObj.val.type = prop.type;

        if (prop.format) schemaPropsObj.val.format = prop.format;

        t[schemaPropsObj.propName] = schemaPropsObj.val;

        if (prop.isRequired) {
          this.schema.required.push(prop.name);
        }
      });

      this.schema.properties = JSON.stringify(t);
    }

    return {
      type: this.type,
      modelVersion: this.modelVersion,
      id: this.id,
      name: this.name,
      author: this.author,
      authored: this.authored,
      schema: this.schema,
    };
  }

  public async signSchema(params: { privateKey: string; schema: Schema }): Promise<string> {
    if (!params.privateKey) throw new Error('HID-SSI-SDK:: Error: PrivateKey must be passed');
    if (!params.schema) throw new Error('HID-SSI-SDK:: Error: Schema must be passed');

    const { privateKeyMultibase: privateKeyMultibaseConverted } =
      Utils.convertEd25519verificationkey2020toStableLibKeysInto({
        privKey: params.privateKey,
      });

    const dataBytes = (await ISchemaProto.encode(params.schema)).finish();
    const signed = ed25519.sign(privateKeyMultibaseConverted, dataBytes);
    return Buffer.from(signed).toString('base64');
  }

  public async registerSchema(params: {
    schema: Schema;
    signature: string;
    verificationMethodId: string;
  }): Promise<object> {
    if (!params.schema) throw new Error('HID-SSI-SDK:: Error: Schema must be passed');
    if (!params.signature) throw new Error('HID-SSI-SDK:: Error: Signature must be passed');
    if (!params.verificationMethodId) throw new Error('HID-SSI-SDK:: Error: VerificationMethodId must be passed');

    return this.schemaRpc.createSchema(params.schema, params.signature, params.verificationMethodId);
  }

  public async resolve(params: { schemaId: string }): Promise<Schema> {
    if (!params.schemaId) throw new Error('HID-SSI-SDK:: Error: SchemaId must be passed');
    const schemaArr: Array<object> = await this.schemaRpc.resolveSchema(params.schemaId);
    if (!schemaArr || schemaArr.length < 0) {
      throw new Error('HID-SSI-SDK:: Error: No schema found, id = ' + params.schemaId);
    }
    const schema = schemaArr[0] as Schema;
    return schema;
  }
}
