/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import { HIDRpcEnums, HID_COSMOS_MODULE, HYPERSIGN_NETWORK_SCHEMA_PATH } from '../constants';
import * as generatedProto from '../../libs/generated/ssi/tx';
import { OfflineSigner } from '@cosmjs/proto-signing';
import axios from 'axios';
import { HIDClient } from '../hid/client';
import { CredentialSchemaDocument, CredentialSchemaState as Schema } from '../../libs/generated/ssi/credential_schema';
import { DocumentProof as SchemaProof } from '../../libs/generated/ssi/proof';
import { DeliverTxResponse, SigningStargateClient } from '@cosmjs/stargate';
import { CredentialSchemaDocument as SchemaDocument } from '../../libs/generated/ssi/credential_schema';
import Utils from '../utils';
import * as constants from '../constants';

export interface ISchemaRPC {
  createSchema(schema: SchemaDocument, proof: SchemaProof): Promise<object>;
  resolveSchema(schemaId: string): Promise<object>;
}

export class SchemaRpc implements ISchemaRPC {
  public schemaRestEp: string;
  private hidClient: any;
 private nodeRestEp:string

  constructor({
    offlineSigner,
    nodeRpcEndpoint,
    nodeRestEndpoint,
  }: {
    offlineSigner?: OfflineSigner;
    nodeRpcEndpoint: string;
    nodeRestEndpoint: string;
  }) {
    if (offlineSigner) {
      this.hidClient = new HIDClient(offlineSigner, nodeRpcEndpoint, nodeRestEndpoint);
    } else {
      this.hidClient = null;
    }

    this.nodeRestEp=nodeRestEndpoint
    this.schemaRestEp = HIDClient.hidNodeRestEndpoint + HYPERSIGN_NETWORK_SCHEMA_PATH;
  }

  async init() {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: SchemaRpc class is not initialise with offlinesigner');
    }
    await this.hidClient.init();
  }

  async createSchema(schema: CredentialSchemaDocument, proof: SchemaProof): Promise<DeliverTxResponse> {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: SchemaRpc class is not initialise with offlinesigner');
    }
    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgRegisterCredentialSchema}`;
    const txMessage = {
      typeUrl, // Same as above
      value: generatedProto[HIDRpcEnums.MsgRegisterCredentialSchema].fromPartial({
        credentialSchemaDocument: schema,
        credentialSchemaProof: proof,
        txAuthor: HIDClient.getHidWalletAddress(),
      }),
    };
    const amount = await Utils.fetchFee(constants.GAS_FEE_METHODS.Register_Cred_Schema,this.nodeRestEp);
    const fee = {
      amount: [
        {
          denom: 'uhid',
          amount,
        },
      ],
      gas: '200000',
    };
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult = await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
    return txResult;
  }

  async resolveSchema(schemaId: string): Promise<Array<object>> {
    const getSchemaUrl = `${this.schemaRestEp}/${schemaId}:`;
    const response = await axios.get(getSchemaUrl);

    const { credentialSchemas } = response.data;

    if (credentialSchemas === undefined) {
      const { schema } = response.data;

      return schema;
    }
    return credentialSchemas;
  }
}
