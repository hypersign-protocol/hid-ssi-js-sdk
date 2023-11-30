/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import {
  CredentialSchemaDocument,
  CredentialSchemaState as Schema,
  CredentialSchemaDocument as SchemaDocument,
  CredentialSchemaProperty as SchemaProperty,
} from '../../libs/generated/ssi/credential_schema';
import { DocumentProof, DocumentProof as SchemaProof } from '../../libs/generated/ssi/proof';
import { SchemaRpc } from './schemaRPC';
import * as constants from '../constants';
import jsonSigs from 'jsonld-signatures';
const { AssertionProofPurpose } = jsonSigs.purposes;
import { ISchemaFields, ISchemaMethods, IResolveSchema } from './ISchema';
import Utils from '../utils';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { extendContextLoader } from 'jsonld-signatures';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import SchemaApiService from '../ssiApi/services/schema/schema.service';
import customLoader from '../../libs/w3cache/v1';
const documentLoader = extendContextLoader(customLoader);
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import HypersignDID from '../did/did';
import { VerificationMethod } from '../../libs/generated/ssi/did';

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
  private schemaApiService: SchemaApiService | null;
  private hsDid: HypersignDID;
  public hypersignBjjschema: HypersignBJJSchema;
  constructor(
    params: {
      namespace?: string;
      offlineSigner?: OfflineSigner;
      nodeRpcEndpoint?: string;
      nodeRestEndpoint?: string;
      entityApiSecretKey?: string;
    } = {}
  ) {
    const { namespace, offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, entityApiSecretKey } = params;
    const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
    const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
    this.schemaRpc = new SchemaRpc({ offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp });
    this.hsDid = new HypersignDID({ offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp });
    if (entityApiSecretKey && entityApiSecretKey != '') {
      this.schemaApiService = new SchemaApiService(entityApiSecretKey);
      this.schemaRpc = null;
    } else {
      this.schemaApiService = null;
    }
    this['@context'] = [constants.SCHEMA.SCHEMA_CONTEXT];
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
    this.hypersignBjjschema = new HypersignBJJSchema(params);
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

  private isPascalCase(inputString: string): boolean {
    const pattern = /^[A-Z][a-zA-Z0-9]*$/;
    return pattern.test(inputString);
  }
  private async _jsonLdSign(params: {
    schema: CredentialSchemaDocument;
    privateKeyMultibase: string;
    verificationMethodId: string;
    publicKeyMultibase: string;
  }) {
    const { schema, privateKeyMultibase, verificationMethodId } = params;
    const keyPair = await Ed25519VerificationKey2020.from({
      id: verificationMethodId,
      privateKeyMultibase: privateKeyMultibase,
      publicKeyMultibase: params.publicKeyMultibase,
    });
    const suite = new Ed25519Signature2020({ key: keyPair });
    const signedSchema = await jsonSigs.sign(schema, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader,
    });
    return signedSchema.proof;
  }

  /**
   * Initialise the offlinesigner to interact with Hypersign blockchain
   */
  public async init() {
    if (!this.schemaRpc && !this.schemaApiService) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized with entityApiSecretKey'
      );
    }
    if (this.schemaRpc) {
      await this.schemaRpc.init();
    }
    if (this.schemaApiService) {
      await this.schemaApiService.auth();
    }
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
    if (!this.isPascalCase(params.name))
      throw new Error('HID-SSI-SDK:: Error: schema name should always be in PascalCase');
    this['@context'] = [constants.SCHEMA.SCHEMA_CONTEXT];
    this.id = await this._getSchemaId();
    this.name = params.name;
    this.author = params.author;
    this.authored = this._getDateTime();
    this.schema = {
      schema: constants.SCHEMA.SCHEMA_JSON,
      description: params.description ? params.description : '',
      type: 'https://schema.org/object',
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
          (this.schema.required as string[]).push(prop.name);
        }
      });

      this.schema.properties = JSON.stringify(t);
    }
    if (!this.schema.additionalProperties) {
      delete this.schema.additionalProperties;
    }
    if (this.schema.required?.length == 0) {
      delete this.schema.required;
    }
    return {
      '@context': this['@context'],
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
   * @returns {Promise<IResolveSchema>} Schema with proof
   */
  public async sign(params: {
    privateKeyMultibase: string;
    schema: SchemaDocument;
    verificationMethodId: string;
  }): Promise<IResolveSchema> {
    if (!params.privateKeyMultibase) throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase must be passed');
    if (!params.verificationMethodId)
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId must be passed');
    if (!params.schema) throw new Error('HID-SSI-SDK:: Error: Schema must be passed');
    const { schema, privateKeyMultibase, verificationMethodId } = params;
    const schemaDoc: SchemaDocument = params.schema;
    const { didDocument } = await this.hsDid.resolve({ did: schema.author as string });
    if (!didDocument) {
      throw new Error('HID-SSI-SDK:: Error: can not resolve the author');
    }
    const verificationMethod: VerificationMethod = didDocument['verificationMethod'].find(
      (x) => x.id == verificationMethodId
    ) as VerificationMethod;
    if (!verificationMethod) {
      throw new Error('HID-SSI-SDK:: Error: verificationMethod not matched');
    }
    const proof = await this._jsonLdSign({
      schema,
      privateKeyMultibase,
      verificationMethodId,
      publicKeyMultibase: verificationMethod.publicKeyMultibase as string,
    });

    schemaDoc['proof'] = {} as SchemaProof;
    const schemaToReturn: IResolveSchema = schemaDoc as IResolveSchema;
    if (proof) {
      schemaToReturn['proof'] = { ...schemaToReturn['proof'], ...proof };
    }

    return schemaToReturn;
  }

  /**
   * Register a schema Document in Hypersign blockchain - an onchain activity
   * @params
   *  - params.schema               : The schema document with schemaProof
   * @returns {Promise<object>} Result of the registration
   */
  public async register(params: { schema: IResolveSchema }): Promise<{ transactionHash: string }> {
    if (!params.schema) throw new Error('HID-SSI-SDK:: Error: schema must be passed');
    if (!params.schema['proof']) throw new Error('HID-SSI-SDK:: Error: schema.proof must be passed');
    if (!params.schema['proof'].created) throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain created');
    if (!params.schema['proof'].proofPurpose)
      throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain proofPurpose');
    if (!params.schema['proof'].proofValue)
      throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain proofValue');
    if (!params.schema['proof'].type) throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain type');
    if (!params.schema['proof'].verificationMethod)
      throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain verificationMethod');

    if (!this.schemaRpc && !this.schemaApiService) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignSchema class is not instantiated with Offlinesigner or have not been initilized with entityApiSecret'
      );
    }
    const response = {} as { transactionHash: string };
    const schemaDoc = params.schema;
    const proof = schemaDoc['proof'] as DocumentProof;
    if (this.schemaRpc) {
      const result: DeliverTxResponse = await this.schemaRpc.registerSchema(schemaDoc as SchemaDocument, proof);
      response.transactionHash = result.transactionHash;
    } else if (this.schemaApiService) {
      const result: { transactionHash: string } = await this.schemaApiService.registerSchema({
        schemaDocument: params.schema,
        schemaProof: params.schema['proof'],
      });
      response.transactionHash = result.transactionHash;
    }
    return response;
  }

  /**
   * Resolves a schema document with schemId from Hypersign blockchain - an onchain activity
   * @params
   *  - params.schemaId             : Id of the schema document
   * @returns {Promise<IResolveSchema>} Returns schema document
   */
  public async resolve(params: { schemaId: string }): Promise<IResolveSchema> {
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
    const schemaT = schemaArr[0] as Schema;

    const schema = {
      credentialSchemaDocument: (schemaArr[0] as any).schema ? schemaArr[0] : schemaT.credentialSchemaDocument,
      credentialSchemaProof: (schemaArr[0] as any).proof ? (schemaArr[0] as any).proof : schemaT.credentialSchemaProof,
    } as Schema;

    const response: IResolveSchema = {
      ...schema.credentialSchemaDocument,
      proof: schema.credentialSchemaProof as SchemaProof,
    };

    // Competable Schema  with https://www.w3.org/TR/vc-json-schema/#jsonschema    currently not used

    return response;
  }

  public vcJsonSchema(schemaResolved: IResolveSchema) {
    const schemaWrapper = schemaResolved;
    const properties = JSON.parse(schemaResolved.schema?.properties as string);
    const ld = {};
    const schemaProp = {};
    Object.entries(properties).forEach((elm) => {
      ld[elm[0]] = {
        '@id': 'https://hypersign-schema.org/' + elm[0],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        '@type': 'xsd:' + elm[1].type,
      };

      schemaProp[elm[0]] = {
        description: `Enter value for ${elm[0]}`,
        title: `${elm[0]}`,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        type: elm[1].type,
      };
    });

    const jsonLdcontext = {
      '@protected': true,
      '@version': 1.1,
      id: '@id',
      type: '@type',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [schemaWrapper.name]: {
        '@context': {
          '@propagate': true,
          '@protected': true,
          xsd: 'http://www.w3.org/2001/XMLSchema#',
          ...ld,
        },
        '@id': 'https://hypersign-schema.org',
      },
    };

    const schemaDoc = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      description: schemaWrapper.schema?.description,
      properties: {
        credentialSubject: {
          description: 'Stores the data of the credential',
          title: 'Credential subject',
          properties: {
            id: {
              description: 'Stores the DID of the subject that owns the credential',
              title: 'Credential subject ID',
              format: 'uri',
              type: 'string',
            },
            ...schemaProp,
          },
          required: schemaWrapper.schema?.required,
          type: 'object',
        },
      },
      type: 'object',
      required: ['credentialSubject'],
    };
    schemaDoc['$metadata'] = {
      type: schemaWrapper.name,
      version: 1.0,
      jsonLdContext: { '@context': { ...jsonLdcontext } },
    };
    return schemaDoc;
  }
}
