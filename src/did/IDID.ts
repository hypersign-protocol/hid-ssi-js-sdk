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
  publicKey: Array<IPublicKey>;
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
}

export interface IDID {
  generateKeys(params: { seed: string }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }>;
  generate(params: { publicKeyMultibase: string }): string;
  register(params: {
    didDocString: string;
    privateKeyMultibase: string;
    verificationMethodId: string;
  }): Promise<object>;
  resolve(params: { did: string }): Promise<object>;
  update(params: {
    didDocString: string;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object>;
  deactivate(params: {
    didDocString: string;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object>;

  // didAuth
  signDid(params: IParams): Promise<object>;
  verify(params: IParams): Promise<object>;
}

export interface IDIDResolve {
  context: string;
  didDocument: IDidProto;
  didDocumentMetadata: Metadata;
}

export interface IDIDRpc {
  registerDID(didDoc: IDidProto, signature: string, verificationMethodId: string): Promise<object>;
  updateDID(didDoc: IDidProto, signature: string, verificationMethodId: string, versionId: string): Promise<object>;
  deactivateDID(did: string, signature: string, verificationMethodId: string, versionId: string): Promise<object>;
  resolveDID(did: string): Promise<IDIDResolve>;
}
