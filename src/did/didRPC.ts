/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import { HIDRpcEnums, HID_COSMOS_MODULE, HYPERSIGN_NETWORK_DID_PATH } from '../constants';
import * as generatedProto from '../../libs/generated/ssi/tx';
import { Did as IDidProto, SignInfo } from '../../libs/generated/ssi/did';
import { SigningStargateClient } from '@cosmjs/stargate';

import axios from 'axios';
import { HIDClient } from '../hid/client';
import { IClientSpec, IDIDResolve, IDIDRpc, IKeyType } from './IDID';
import { OfflineSigner } from '@cosmjs/proto-signing';

export class DIDRpc implements IDIDRpc {
  private didRestEp: string;
  private hidClient: HIDClient | null;
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
    this.didRestEp =
      (HIDClient.hidNodeRestEndpoint ? HIDClient.hidNodeRestEndpoint : nodeRestEndpoint) + HYPERSIGN_NETWORK_DID_PATH;
  }

  async init() {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
    }
    await this.hidClient.init();
  }

  async registerDID(didDoc: IDidProto, signInfos: SignInfo[]): Promise<object> {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
    }

    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgCreateDID}`;

    const txMessage = {
      typeUrl, // Same as above
      value: generatedProto[HIDRpcEnums.MsgCreateDID].fromPartial({
        didDocString: didDoc,
        signatures: signInfos,
        creator: HIDClient.getHidWalletAddress(),
      }),
    };
    const fee = 'auto';
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult = await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
    return txResult;
  }

  async updateDID(didDoc: IDidProto, signInfos: SignInfo[], versionId: string): Promise<object> {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
    }

    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgUpdateDID}`;

    const txMessage = {
      typeUrl, // Same as above
      value: generatedProto[HIDRpcEnums.MsgUpdateDID].fromPartial({
        didDocString: didDoc,
        signatures: signInfos,
        creator: HIDClient.getHidWalletAddress(),
        version_id: versionId,
      }),
    };

    // TODO: need to find a way to make it dynamic
    const fee = 'auto';

    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult = await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
    return txResult;
  }

  async deactivateDID(did: string, signInfos: SignInfo[], versionId: string): Promise<object> {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
    }

    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgDeactivateDID}`;

    const txMessage = {
      typeUrl, // Same as above
      value: generatedProto[HIDRpcEnums.MsgDeactivateDID].fromPartial({
        didId: did,
        signatures: signInfos,
        creator: HIDClient.getHidWalletAddress(),
        version_id: versionId,
      }),
    };

    // TODO: need to find a way to make it dynamic
    const fee = 'auto';
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult = await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
    return txResult;
  }

  async resolveDID(did: string): Promise<IDIDResolve> {
    did = did + ':'; // TODO:  we need to sort this out ... need to remove later
    const get_didUrl = `${this.didRestEp}/${did}`;
    let response;
    try {
      response = await axios.get(get_didUrl);
      const didDoc = response.data;
      return didDoc;
    } catch (err) {
      return { didDocument: null, didDocumentMetadata: null } as any as IDIDResolve;
    }
  }
}
