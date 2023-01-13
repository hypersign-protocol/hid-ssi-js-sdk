/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import { Schema, SchemaDocument, SchemaProof, SchemaProperty } from '../../libs/generated/ssi/schema';
import { SchemaRpc } from './schemaRPC';
import * as constants from '../constants';
import { ISchemaFields, ISchemaMethods } from './ISchema';
import Utils from '../utils';
import { OfflineSigner } from '@cosmjs/proto-signing';
const ed25519 = require('@stablelib/ed25519');

export default class HyperSignSchema implements ISchemaMethods {
  type: string;
  modelVersion: string;
  id: string;
  name: string;
  author: string;
  authored: string;
  schema: SchemaProperty;
  schemaRpc: SchemaRpc | null;
  namespace: string;

  constructor(
    params: {
      namespace?: string;
      offlineSigner?: OfflineSigner;
      nodeRpcEndpoint?: string;
      nodeRestEndpoint?: string;
    } = {}
  ) {
    const { namespace, offlineSigner, nodeRpcEndpoint, nodeRestEndpoint } = params;
    const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
    const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
    this.schemaRpc = new SchemaRpc({ offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp });

    this.namespace = namespace && namespace != '' ? namespace : '';
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
  private async _getSchemaId(): Promise<string> {
    const b = await Utils.getUUID();
    // ID Structure ->  sch:<method>:<namespace>:<method-specific-id>:<version>
    let id;
    if (this.namespace && this.namespace != '') {
      id = `${constants.SCHEMA.SCHEME}:${constants.SCHEMA.METHOD}:${this.namespace}:${b}:${this.modelVersion}`;
    } else {
      id = `${constants.SCHEMA.SCHEME}:${constants.SCHEMA.METHOD}:${b}:${this.modelVersion}`;
    }
    return id;
  }

  private _getDateTime(): string {
    return new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
  }

  /**
   * Initialise the offlinesigner to interact with Hypersign blockchain
   */
  public async init() {
    if (!this.schemaRpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignSchema class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    await this.schemaRpc.init();
  }

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
  public async generate(params: {
    name: string;
    description?: string;
    author: string;
    fields?: Array<ISchemaFields>;
    additionalProperties: boolean;
  }): Promise<SchemaDocument> {
    if (!params.author) throw new Error('HID-SSI-SDK:: Error: Author must be passed');

    this.id = await this._getSchemaId();
    this.name = params.name;
    this.author = params.author;
    this.authored = this._getDateTime();
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

  /**
   * Signs a schema document and attaches proof
   * @params
   *  - params.schema               : The schema document without proof
   *  - params.privateKeyMultibase  : Private Key to sign the doc
   *  - params.verificationMethodId : VerificationMethodId of the document
   * @returns {Promise<Schema>} Schema with proof
   */
  public async sign(params: {
    privateKeyMultibase: string;
    schema: SchemaDocument;
    verificationMethodId: string;
  }): Promise<Schema> {
    if (!params.privateKeyMultibase) throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase must be passed');
    if (!params.verificationMethodId)
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId must be passed');
    if (!params.schema) throw new Error('HID-SSI-SDK:: Error: Schema must be passed');

    const { privateKeyMultibase: privateKeyMultibaseConverted } =
      Utils.convertEd25519verificationkey2020toStableLibKeysInto({
        privKey: params.privateKeyMultibase,
      });

    const schemaDoc = params.schema as Schema;
    const dataBytes = (await Schema.encode(schemaDoc)).finish();
    const signed = ed25519.sign(privateKeyMultibaseConverted, dataBytes);

    const proof: SchemaProof = {
      type: constants.SCHEMA.SIGNATURE_TYPE,
      created: this._getDateTime(),
      verificationMethod: params.verificationMethodId,
      proofPurpose: constants.SCHEMA.PROOF_PURPOSE,
      proofValue: Buffer.from(signed).toString('base64'),
    };
    schemaDoc.proof = {} as SchemaProof;
    Object.assign(schemaDoc.proof, { ...proof });
    return schemaDoc;
  }

  /**
   * Register a schema Document in Hypersign blockchain - an onchain activity
   * @params
   *  - params.schema               : The schema document with schemaProof
   * @returns {Promise<object>} Result of the registration
   */
  public async register(params: { schema: Schema }): Promise<object> {
    if (!params.schema) throw new Error('HID-SSI-SDK:: Error: schema must be passed');
    if (!params.schema.proof) throw new Error('HID-SSI-SDK:: Error: schema.proof must be passed');
    if (!params.schema.proof.created) throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain created');
    if (!params.schema.proof.proofPurpose)
      throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain proofPurpose');
    if (!params.schema.proof.proofValue) throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain proofValue');
    if (!params.schema.proof.type) throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain type');
    if (!params.schema.proof.verificationMethod)
      throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain verificationMethod');

    if (!this.schemaRpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignSchema class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    return this.schemaRpc.createSchema(params.schema, params.schema.proof);
  }

  /**
   * Resolves a schema document with schemId from Hypersign blockchain - an onchain activity
   * @params
   *  - params.schemaId             : Id of the schema document
   * @returns {Promise<Schema>} Returns schema document
   */
  public async resolve(params: { schemaId: string }): Promise<Schema> {
    if (!params.schemaId) throw new Error('HID-SSI-SDK:: Error: SchemaId must be passed');

    if (!this.schemaRpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignSchema class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    const schemaArr: Array<object> = await this.schemaRpc.resolveSchema(params.schemaId);
    if (!schemaArr || schemaArr.length < 0) {
      throw new Error('HID-SSI-SDK:: Error: No schema found, id = ' + params.schemaId);
    }
    const schema = schemaArr[0] as Schema;
    return schema;
  }
}
