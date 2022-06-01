import { HIDRpcEnums, HID_COSMOS_MODULE, HYPERSIGN_NETWORK_DID_PATH } from '../constants';
import * as generatedProto from '../generated/ssi/tx';
import { Did as IDidProto, SignInfo } from '../generated/ssi/did';
import { SigningStargateClient } from '@cosmjs/stargate';

import axios from 'axios';
import { HIDClient } from '../hid/client';
import { IDIDResolve, IDIDRpc } from './IDID';

export class DIDRpc implements IDIDRpc {
  private didRestEp: string;
  constructor() {
    this.didRestEp = HIDClient.hidNodeRestEndpoint + HYPERSIGN_NETWORK_DID_PATH;
  }

  async registerDID(didDoc: IDidProto, signature: string, verificationMethodId: string): Promise<object> {
    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgCreateDID}`;
    const signInfo: SignInfo = {
      verificationMethodId,
      signature,
    };

    const txMessage = {
      typeUrl, // Same as above
      value: generatedProto[HIDRpcEnums.MsgCreateDID].fromPartial({
        didDocString: didDoc,
        signatures: [signInfo],
        creator: HIDClient.getHidWalletAddress(),
      }),
    };

    const fee = 'auto';
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult = await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
    return txResult;
  }

  async updateDID(
    didDoc: IDidProto,
    signature: string,
    verificationMethodId: string,
    versionId: string
  ): Promise<object> {
    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgUpdateDID}`;

    const signInfo: SignInfo = {
      verificationMethodId,
      signature,
    };

    const txMessage = {
      typeUrl, // Same as above
      value: generatedProto[HIDRpcEnums.MsgUpdateDID].fromPartial({
        didDocString: didDoc,
        signatures: [signInfo],
        creator: HIDClient.getHidWalletAddress(),
        versionId,
      }),
    };

    // TODO: need to find a way to make it dynamic
    const fee = 'auto';

    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult = await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
    return txResult;
  }

  async deactivateDID(
    didDoc: IDidProto,
    signature: string,
    verificationMethodId: string,
    versionId: string
  ): Promise<object> {
    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgDeactivateDID}`;
    const signInfo: SignInfo = {
      verificationMethodId,
      signature,
    };

    const txMessage = {
      typeUrl, // Same as above
      value: generatedProto[HIDRpcEnums.MsgDeactivateDID].fromPartial({
        didDocString: didDoc,
        signatures: [signInfo],
        creator: HIDClient.getHidWalletAddress(),
        versionId,
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
    const response = await axios.get(get_didUrl);
    const didDoc = response.data;
    return didDoc;
  }
}
