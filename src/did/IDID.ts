/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import { Did as IDidProto, Metadata, VerificationMethod, Service } from '../generated/ssi/did';
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
  generateKeys(params: { seed?: string }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }>;

  generate(params: { publicKeyMultibase: string }): Promise<object>;

  register(params: { didDocument: object; privateKeyMultibase: string; verificationMethodId: string }): Promise<object>;

  resolve(params: { did: string; ed25519verificationkey2020?: boolean }): Promise<object>;

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
  sign(params: {
    doc: object;
    privateKey?: string;
    challenge: string;
    domain: string;
    did: string;
    verificationMethodId: string;
  }): Promise<object>;

  verify(params: { doc: object; verificationMethodId: string; challenge: string; domain?: string }): Promise<object>;
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
  init(): Promise<void>;
}

export interface IDidDocument {
  context: string[];
  id: string;
  controller: string[];
  alsoKnownAs: string[];
  verificationMethod: Array<VerificationMethod>;
  authentication: string[];
  assertionMethod: string[];
  keyAgreement: string[];
  capabilityInvocation: string[];
  capabilityDelegation: string[];
  service: Service[];
}
