import HypersignDID from './did/did';
import HyperSignBJJDID from './did/bjjdid';
import HypersignVerifiableCredential from './credential/vc';
import HypersignVerifiablePresentation from './presentation/vp';
import HypersignSchema from './schema/schema';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { IClientSpec, ISignInfo, SupportedPurpose } from './did/IDID';
import { VerificationMethodTypes as IKeyType } from '../libs/generated/ssi/client/enums';
import { VerificationMethodRelationships as IVerificationRelationships } from '../libs/generated/ssi/client/enums';
import { DidDocument as Did } from '../libs/generated/ssi/did';
import { IVerifiableCredential } from './credential/ICredential';
import { CredentialSchemaDocument as Schema } from '../libs/generated/ssi/credential_schema';
import { IVerifiablePresentation } from './presentation/IPresentation';
import HypersignBJJVerifiableCredential from './credential/bjjvc';

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
    this.did.bjjDID = new HyperSignBJJDID(constructorParams);
    this.schema = new HypersignSchema(constructorParams);
    this.vc = new HypersignVerifiableCredential(constructorParams);
    this.vc.bjjVC = new HypersignBJJVerifiableCredential(constructorParams);
    this.vp = new HypersignVerifiablePresentation(constructorParams);
  }

  async init() {
    await this.did.init();
    await this.did.bjjDID.init();
    await this.schema.init();
    await this.schema.hypersignBjjschema.init();
    await this.vc.init();
    await this.vc.bjjVC.init();
  }
}

export {
  HypersignSSISdk,
  HypersignDID,
  HypersignSchema,
  HypersignVerifiableCredential,
  HypersignVerifiablePresentation,
  IVerificationRelationships,
  HypersignBJJVerifiableCredential,
  IKeyType,
  ISignInfo,
  IClientSpec,
  Did,
  IVerifiableCredential,
  IVerifiablePresentation,
  Schema,
  SupportedPurpose,
};
