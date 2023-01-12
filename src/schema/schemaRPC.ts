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
import { Schema, SchemaProof } from '../../libs/generated/ssi/schema';
import { SignInfo } from '../../libs/generated/ssi/did';
import { SigningStargateClient } from '@cosmjs/stargate';

export interface ISchemaRPC {
  createSchema(schema: Schema, proof: SchemaProof): Promise<object>;
  resolveSchema(schemaId: string): Promise<object>;
}

export class SchemaRpc implements ISchemaRPC {
  public schemaRestEp: string;
  private hidClient: any;

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
    this.schemaRestEp = HIDClient.hidNodeRestEndpoint + HYPERSIGN_NETWORK_SCHEMA_PATH;
  }

  async init() {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: SchemaRpc class is not initialise with offlinesigner');
    }
    await this.hidClient.init();
  }

  async createSchema(schema: Schema, proof: SchemaProof): Promise<object> {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: SchemaRpc class is not initialise with offlinesigner');
    }

    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgCreateSchema}`;

    const txMessage = {
      typeUrl, // Same as above
      value: generatedProto[HIDRpcEnums.MsgCreateSchema].fromJSON({
        schemaDoc: schema,
        schemaProof: proof,
        creator: HIDClient.getHidWalletAddress(),
      }),
    };

    // TODO: need to find a way to make it dynamic
    const fee = 'auto';
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult = await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
    return txResult;
  }

  async resolveSchema(schemaId: string): Promise<Array<object>> {
    const getSchemaUrl = `${this.schemaRestEp}/${schemaId}:`;
    const response = await axios.get(getSchemaUrl);
    const { schema } = response.data;
    return schema;
  }
}
