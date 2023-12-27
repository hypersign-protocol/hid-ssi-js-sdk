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
import {
  CredentialStatusDocument as CredentialStatus,
  CredentialStatusState as Credential,
} from '../../libs/generated/ssi/credential_status';
import { DocumentProof as CredentialProof } from '../../libs/generated/ssi/proof';
import { OfflineSigner } from '@cosmjs/proto-signing';
import Utils from '../utils';
import * as constants from '../constants';

export class CredentialRPC implements ICredentialRPC {
  public credentialRestEP: string;
  private hidClient: any;
  private nodeRestEp: string;

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
    this.nodeRestEp = nodeRestEndpoint;
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
        credentialStatusDocument: credentialStatus,
        credentialStatusProof: proof,
        txAuthor: HIDClient.getHidWalletAddress(),
      }),
    };
    const amount = await Utils.fetchFee(constants.GAS_FEE_METHODS.Register_Cred_Status, this.nodeRestEp);
    const fee = {
      amount: [
        {
          denom: 'uhid',
          amount: amount,
        },
      ],
      gas: '200000',
    };
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult: DeliverTxResponse = await hidClient.signAndBroadcast(
      HIDClient.getHidWalletAddress(),
      [txMessage],
      fee
    );
    if (txResult.code !== 0) {
      throw new Error(`${txResult.rawLog}`);
    }
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
        credentialStatusDocument: credentialStatus,
        credentialStatusProof: proof,
        txAuthor: HIDClient.getHidWalletAddress(),
      }),
    };
    return txMessage;
  }

  async registerCredentialStatusBulk(txMessages: []) {
    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
    }
    const txLenght = txMessages.length;
    const amount = (
      txLenght * parseInt(await Utils.fetchFee(constants.GAS_FEE_METHODS.Register_Cred_Status, this.nodeRestEp))
    ).toString();
    const fee = {
      amount: [
        {
          denom: 'uhid',
          amount: amount,
        },
      ],
      gas: '200000',
    };
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult: DeliverTxResponse = await hidClient.signAndBroadcast(
      HIDClient.getHidWalletAddress(),
      txMessages,
      fee
    );
    if (txResult.code !== 0) {
      throw new Error(`${txResult.rawLog}`);
    }
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
      const credStatus: Credential = response.data.credentialStatus;
      if (!credStatus || !credStatus.credentialStatusDocument || !credStatus.credentialStatusProof) {
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
      if (!credStatus || !credStatus.credentialStatusDocument || !credStatus.credentialStatusProof) {
        throw new Error('No credential status found. Probably invalid credentialId');
      }
      return credStatus;
    }
  }
  async updateCredentialStatus(credentialStatus: CredentialStatus, proof: CredentialProof): Promise<DeliverTxResponse> {
    if (!credentialStatus) {
      throw new Error('CredentialStatus must be passed as a param while registerting credential status');
    }

    if (!proof) {
      throw new Error('Proof must be passed as a param while registering crdential status');
    }

    if (!this.hidClient) {
      throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
    }

    const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgUpdateCredentialStatus}`;

    const txMessage = {
      typeUrl,
      value: generatedProto[HIDRpcEnums.MsgUpdateCredentialStatus].fromPartial({
        credentialStatusDocument: credentialStatus,
        credentialStatusProof: proof,
        txAuthor: HIDClient.getHidWalletAddress(),
      }),
    };
    const amount = await Utils.fetchFee(constants.GAS_FEE_METHODS.Update_Cred_Status, this.nodeRestEp);
    const fee = {
      amount: [
        {
          denom: 'uhid',
          amount: amount,
        },
      ],
      gas: '200000',
    };
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult: DeliverTxResponse = await hidClient.signAndBroadcast(
      HIDClient.getHidWalletAddress(),
      [txMessage],
      fee
    );
    if (txResult.code !== 0) {
      throw new Error(`${txResult.rawLog}`);
    }
    return txResult;
  }
}
