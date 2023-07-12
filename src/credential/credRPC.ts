/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import { HIDRpcEnums, HID_COSMOS_MODULE, HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH } from '../constants';
import * as generatedProto from '../../libs/generated/ssi/tx';
import { SigningStargateClient, DeliverTxResponse } from '@cosmjs/stargate';
import axios from 'axios';
import { HIDClient } from '../hid/client';
import { ICredentialRPC } from './ICredential';
import { CredentialStatus, CredentialProof, Credential } from '../../libs/generated/ssi/credential';
import { OfflineSigner } from '@cosmjs/proto-signing';

export class CredentialRPC implements ICredentialRPC {
  public credentialRestEP: string;
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
    this.credentialRestEP =
      (HIDClient.hidNodeRestEndpoint ? HIDClient.hidNodeRestEndpoint : nodeRestEndpoint) +
      HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH;
  }

  async init() {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
    }
    await this.hidClient.init();
  }

  async registerCredentialStatus(
    credentialStatus: CredentialStatus,
    proof: CredentialProof
  ): Promise<DeliverTxResponse> {
    if (!credentialStatus) {
      throw new Error('CredentialStatus must be passed as a param while registerting credential status');
    }

    if (!proof) {
      throw new Error('Proof must be passed as a param while registering crdential status');
    }

    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
    }

    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgRegisterCredentialStatus}`;

    const txMessage = {
      typeUrl, // Same as above
      value: generatedProto[HIDRpcEnums.MsgRegisterCredentialStatus].fromPartial({
        credentialStatus,
        proof,
        creator: HIDClient.getHidWalletAddress(),
      }),
    };

    const fee = 'auto';
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult: DeliverTxResponse = await hidClient.signAndBroadcast(
      HIDClient.getHidWalletAddress(),
      [txMessage],
      fee
    );
    return txResult;
  }

  async generateCredentialStatusTxnMessage(credentialStatus: CredentialStatus, proof: CredentialProof) {
    if (!credentialStatus) {
      throw new Error('CredentialStatus must be passed as a param while registerting credential status');
    }

    if (!proof) {
      throw new Error('Proof must be passed as a param while registering crdential status');
    }

    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgRegisterCredentialStatus}`;

    const txMessage = {
      typeUrl, // Same as above
      value: generatedProto[HIDRpcEnums.MsgRegisterCredentialStatus].fromPartial({
        credentialStatus,
        proof,
        creator: HIDClient.getHidWalletAddress(),
      }),
    };

    return txMessage;
  }

  async registerCredentialStatusBulk(txMessages: []) {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
    }

    const fee = 'auto';
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult: DeliverTxResponse = await hidClient.signAndBroadcast(
      HIDClient.getHidWalletAddress(),
      txMessages,
      fee
    );
    return txResult;
  }

  async resolveCredentialStatus(credentialId: string): Promise<Credential> {
    credentialId = credentialId + ':'; // TODO:  we need to sort this out ... need to remove later
    const get_didUrl = `${this.credentialRestEP}/${credentialId}`;
    let response;
    try {
      response = await axios.get(get_didUrl);
      if (!response.data) {
        throw new Error('Could not resolve credential status of credentialId ' + credentialId);
      }
      const credStatus: Credential = response.data.credStatus;
      if (!credStatus || !credStatus.claim || !credStatus.proof) {
        throw new Error('No credential status found. Probably invalid credentialId');
      }
      return credStatus;
    } catch (err) {
      const credStatus: Credential = {
        claim: null,
        issuer: '',
        issuanceDate: '',
        expirationDate: '',
        credentialHash: '',
        proof: null,
      } as any as Credential;
      if (!credStatus || !credStatus.claim || !credStatus.proof) {
        throw new Error('No credential status found. Probably invalid credentialId');
      }
      return credStatus;
    }
  }
}
