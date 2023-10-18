import HypersignDID from './did/did';
import HypersignVerifiableCredential from './credential/vc';
import HypersignVerifiablePresentation from './presentation/vp';
import HypersignSchema from './schema/schema';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { IClientSpec, IKeyType, ISignInfo, IVerificationRelationships } from './did/IDID';
import { Did } from '../libs/generated/ssi/did';
import { IVerifiableCredential } from './credential/ICredential';
import { Schema } from '../libs/generated/ssi/schema';
import { IVerifiablePresentation } from './presentation/IPresentation';

class HypersignSSISdk {
  did: HypersignDID;
  vc: HypersignVerifiableCredential;
  vp: HypersignVerifiablePresentation;
  schema: HypersignSchema;
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
    this.schema = new HypersignSchema(constructorParams);
    this.vc = new HypersignVerifiableCredential(constructorParams);
    this.vp = new HypersignVerifiablePresentation(constructorParams);
  }

  async init() {
    await this.did.init();
    await this.schema.init();
    await this.vc.init();
  }
}

export {
  HypersignSSISdk,
  HypersignDID,
  HypersignSchema,
  HypersignVerifiableCredential,
  HypersignVerifiablePresentation,
  IVerificationRelationships,
  IKeyType,
  ISignInfo,
  IClientSpec,
  Did,
  IVerifiableCredential,
  IVerifiablePresentation,
  Schema,
};
