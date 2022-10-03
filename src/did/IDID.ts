import { Did as IDidProto, Metadata } from '../generated/ssi/did';
export interface IPublicKey {
  '@context': string;
  id: string;
  type: string;
  publicKeyBase58: string;
}

export interface IController {
  '@context': string;
  id: string;
  authentication: Array<string>;
}

export interface IParams {
  doc: object;
  privateKey?: string;
  publicKey: IPublicKey;
  challenge: string;
  domain: string;
  controller: IController;
  did: string;
  verificationMethodId: string;
}

export interface IDid extends IDidProto {
  '@context': Array<any>;
}

export interface IDID {
  generateKeys(params: { seed: string }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }>;
  generate(params: { publicKeyMultibase: string }): Promise<object>;
  register(params: { didDocument: object; privateKeyMultibase: string; verificationMethodId: string }): Promise<object>;
  resolve(params: { did: string }): Promise<object>;
  update(params: {
    didDocument: object;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object>;
  deactivate(params: {
    didDocument: object;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object>;

  // didAuth
  signDid(params: IParams): Promise<object>;
  verify(params: IParams): Promise<object>;
}

export interface IDIDResolve {
  didDocument: object;
  didDocumentMetadata: Metadata;
}

export interface IDIDRpc {
  registerDID(didDoc: IDidProto, signature: string, verificationMethodId: string): Promise<object>;
  updateDID(didDoc: IDidProto, signature: string, verificationMethodId: string, versionId: string): Promise<object>;
  deactivateDID(did: string, signature: string, verificationMethodId: string, versionId: string): Promise<object>;
  resolveDID(did: string): Promise<IDIDResolve>;
}
