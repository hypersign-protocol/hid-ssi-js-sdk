/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import { Did as IDidProto, Metadata, VerificationMethod, Service } from '../../libs/generated/ssi/did';
export interface IPublicKey {
  '@context': string;
  id: string;
  type: string;
  publicKeyBase58: string;
}

export enum IKeyType {
  Ed25519VerificationKey2020 = 'Ed25519VerificationKey2020',
  EcdsaSecp256k1VerificationKey2019 = 'EcdsaSecp256k1VerificationKey2019',
  EcdsaSecp256k1RecoveryMethod2020 = 'EcdsaSecp256k1RecoveryMethod2020',
}

export enum IClientSpec {
  'eth_personalSign' = 'eth-personalSign',
  'cosmos_ADR036' = 'cosmos-ADR036',
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

interface IProof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  challenge: string;
  domain: string;
  proofValue: string;
}

export interface ISignedDIDDocument extends IDidProto {
  proof: IProof;
}

export interface IDID {
  generateKeys(params: { seed?: string }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }>;

  generate(params: { methodSpecificId?: string; publicKeyMultibase: string }): Promise<object>;

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
    didDocument: object;
    privateKeyMultibase: string;
    challenge: string;
    domain: string;
    did: string;
    verificationMethodId: string;
  }): Promise<object>;

  verify(params: {
    didDocument: object;
    verificationMethodId: string;
    challenge: string;
    domain?: string;
  }): Promise<object>;
}

export interface IDIDResolve {
  didDocument: IDidDocument;
  didDocumentMetadata: Metadata;
}

export interface IDIDRpc {
  registerDID(
    didDoc: IDidProto,
    signature: string,
    verificationMethodId: string,
    clientSpec?: IClientSpec
  ): Promise<object>;
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
