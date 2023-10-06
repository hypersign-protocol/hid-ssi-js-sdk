import HypersignDID from './did/did';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { IClientSpec, IKeyType, ISignInfo, IVerificationRelationships } from './did/IDID';
import { Did } from '../libs/generated/ssi/did';
import { Schema } from '../libs/generated/ssi/schema';

class HypersignSSISdk {
  did: HypersignDID;
  private namespace: string;
  private signer: OfflineSigner;
  private nodeRpcEndpoint: string; // http://localhost:26657 | 'TEST' | 'MAIN'
  private nodeRestEndpoint: string; // "" | http://localhost:1317
  private entityApiSecretKey: string;
  constructor(params: {
    offlineSigner: OfflineSigner;
    nodeRpcEndpoint?: string;
    nodeRestEndpoint?: string;
    namespace?: string;
    entityApiSecretKey?: string;
  }) {
    const { offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, namespace, entityApiSecretKey } = params;
    this.signer = offlineSigner;
    this.nodeRpcEndpoint = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
    this.nodeRestEndpoint = nodeRestEndpoint ? nodeRestEndpoint : '';
    this.namespace = namespace ? namespace : '';
    this.entityApiSecretKey = entityApiSecretKey ? entityApiSecretKey : '';
    const constructorParams = {
      offlineSigner: this.signer,
      nodeRpcEndpoint: this.nodeRpcEndpoint,
      nodeRestEndpoint: this.nodeRestEndpoint,
      namespace: this.namespace,
      entityApiSecretKey: this.entityApiSecretKey,
    };

    this.did = new HypersignDID(constructorParams);
  }

  async init() {
    await this.did.init();
  }
}

export {
  HypersignSSISdk,
  HypersignDID,
  IVerificationRelationships,
  IKeyType,
  ISignInfo,
  IClientSpec,
  Did,
  Schema,
};
