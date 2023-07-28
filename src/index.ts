import HypersignDID from './did/did';
import HypersignVerifiableCredential from './credential/vc';
import HypersignVerifiablePresentation from './presentation/vp';
import HypersignSchema from './schema/schema';
import { OfflineSigner } from '@cosmjs/proto-signing';
import  DidApi  from './ssiApi/services/did/did.service';

class HypersignSSISdk {
  did: HypersignDID;
  vc: HypersignVerifiableCredential;
  vp: HypersignVerifiablePresentation;
  schema: HypersignSchema;
  didApi: DidApi;
  private namespace: string;
  private signer: OfflineSigner;
  private nodeRpcEndpoint: string; // http://localhost:26657 | 'TEST' | 'MAIN'
  private nodeRestEndpoint: string; // "" | http://localhost:1317
  private apiKey: string;
  constructor(params: {
    offlineSigner: OfflineSigner;
    nodeRpcEndpoint?: string;
    nodeRestEndpoint?: string;
    namespace?: string;
    apiKey?: string;
  }) {
    const { offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, namespace, apiKey } = params;
    this.signer = offlineSigner;
    this.nodeRpcEndpoint = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
    this.nodeRestEndpoint = nodeRestEndpoint ? nodeRestEndpoint : '';
    this.namespace = namespace ? namespace : '';
    this.apiKey = apiKey ? apiKey : '';
    const constructorParams = {
      offlineSigner: this.signer,
      nodeRpcEndpoint: this.nodeRpcEndpoint,
      nodeRestEndpoint: this.nodeRestEndpoint,
      namespace: this.namespace,
    };

    this.did = new HypersignDID(constructorParams);
    this.schema = new HypersignSchema(constructorParams);
    this.vc = new HypersignVerifiableCredential(constructorParams);
    this.vp = new HypersignVerifiablePresentation(constructorParams);
    this.didApi = new DidApi(this.apiKey);
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
  DidApi,
  HypersignSchema,
  HypersignVerifiableCredential,
  HypersignVerifiablePresentation,
};
