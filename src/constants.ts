'use strict';
import {
  ProofTypes,
  VerificationMethodRelationships,
  VerificationMethodTypes,
} from '../libs/generated/ssi/client/enums';
export const compactProof = false;

export const HYPERSIGN_TESTNET_RPC = 'https://rpc.jagrat.hypersign.id';
export const HYPERSIGN_TESTNET_REST = 'https://api.jagrat.hypersign.id';

export const HYPERSIGN_MAINNET_RPC = 'http://localhost:26657';
export const HYPERSIGN_MAINNET_REST = 'http://localhost:1317';

export const HID_COSMOS_MODULE = '/hypersign.ssi.v1';
export const HYPERSIGN_NETWORK_DID_PATH = 'hypersign-protocol/hidnode/ssi/did';
export const HYPERSIGN_NETWORK_SCHEMA_PATH = 'hypersign-protocol/hidnode/ssi/schema';
export const HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH = 'hypersign-protocol/hidnode/ssi/credential';
export const HYPERSIGN_NETWORK_BANK_BALANCE_PATH = '/bank/balances/';

export enum HIDRpcEnums {
  MsgRegisterDID = 'MsgRegisterDID',
  MsgUpdateDID = 'MsgUpdateDID',
  MsgDeactivateDID = 'MsgDeactivateDID',
  MsgRegisterCredentialSchema = 'MsgRegisterCredentialSchema',
  MsgRegisterCredentialStatus = 'MsgRegisterCredentialStatus',
  MsgUpdateCredentialStatus = 'MsgUpdateCredentialStatus',
}
Object.freeze(HIDRpcEnums);

export enum CredentialStatusEnums {
  LIVE = 'Live',
  REVOKED = 'Revoked',
  SUSPENDED = 'Suspended',
}
export enum CredentialStatusReasonEnums {
  LIVE = 'Credential is live',
  REVOKED = 'Credential is revoked',
  SUSPENDED = 'Credential is suspended',
}

export const DID_Ed25519VerificationKey2020 = {
  CONTROLLER_CONTEXT: 'https://w3id.org/security/v2',
  SCHEME: 'did',
  METHOD: 'hid',
  NAMESPACE: 'testnet', // this is not used
  DID_BASE_CONTEXT: 'https://www.w3.org/ns/did/v1',
  DID_KEYAGREEMENT_CONTEXT: 'https://ns.did.ai/suites/x25519-2020/v1',
  DID_Ed25519_CONTEXT_2020: 'https://w3id.org/security/suites/ed25519-2020/v1',
  VERIFICATION_METHOD_TYPE: 'Ed25519VerificationKey2020',
  BLOCKCHAINACCOUNTID_CONTEXT: 'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld',
  SIGNATURE_TYPE: ProofTypes.Ed25519Signature2020,
};

export const DID_EcdsaSecp256k1RecoveryMethod2020 = {
  CONTROLLER_CONTEXT: 'https://w3id.org/security/v2',
  SCHEME: 'did',
  METHOD: 'hid',
  NAMESPACE: 'testnet', // this is not used
  DID_BASE_CONTEXT: 'https://www.w3.org/ns/did/v1',
  DID_KEYAGREEMENT_CONTEXT:
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/X25519KeyAgreementKeyEIP5630.jsonld',
  BLOCKCHAINACCOUNTID_CONTEXT: 'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld',
  SECP256K12020_RECOVERY_CONTEXT: 'https://ns.did.ai/suites/secp256k1-2020/v1',
  VERIFICATION_METHOD_TYPE: VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020,
  SIGNATURE_TYPE: ProofTypes.EcdsaSecp256k1RecoverySignature2020,
};

export const DID_EcdsaSecp256k1VerificationKey2019 = {
  CONTROLLER_CONTEXT: 'https://w3id.org/security/v2',
  SCHEME: 'did',
  METHOD: 'hid',
  NAMESPACE: 'testnet', // this is not used
  DID_BASE_CONTEXT: 'https://www.w3.org/ns/did/v1',
  BLOCKCHAINACCOUNTID_CONTEXT: 'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld',
  SECP256K12020_VERIFICATION_CONTEXT: 'https://ns.did.ai/suites/secp256k1-2019/v1',
  VERIFICATION_METHOD_TYPE: VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019,
  SIGNATURE_TYPE: ProofTypes.EcdsaSecp256k1Signature2019,
};

export const DID_BabyJubJubKey2021 = {
  CONTROLLER_CONTEXT: 'https://w3id.org/security/v2',
  SCHEME: 'did',
  METHOD: 'hid',
  NAMESPACE: 'testnet', // this is not used
  DID_BASE_CONTEXT: 'https://www.w3.org/ns/did/v1',
  DID_KEYAGREEMENT_CONTEXT: 'https://ns.did.ai/suites/x25519-2020/v1',
  DID_BABYJUBJUBKEY2021:
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BabyJubJubKey2021.jsonld',
  BABYJUBJUBSIGNATURE:
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BJJSignature2021.jsonld',
  VERIFICATION_METHOD_TYPE: 'BabyJubJubKey2021',
  BLOCKCHAINACCOUNTID_CONTEXT: 'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld',
  SIGNATURE_TYPE: ProofTypes.BabyJubJubSignature2021,
};

export enum CAIP_10_PREFIX {
  'eip155' = 'eip155',
}

export const DID = {
  CONTROLLER_CONTEXT: 'https://w3id.org/security/v2',
  SCHEME: 'did',
  METHOD: 'hid',
  NAMESPACE: 'testnet', // this is not used
  DID_BASE_CONTEXT: 'https://www.w3.org/ns/did/v1',
  VERIFICATION_METHOD_TYPE: VerificationMethodTypes.Ed25519VerificationKey2020,
  BLOCKCHAINACCOUNTID_CONTEXT: 'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld',
};

Object.freeze(DID);

export const VC = {
  SCHEME: 'vc',
  METHOD: 'hid',
  NAMESPACE: 'testnet',
  PREFIX: 'vc:' + DID.METHOD + ':' + DID.NAMESPACE + ':',
  CREDENTAIL_SCHEMA_VALIDATOR_TYPE: 'JsonSchemaValidator2018',
  CREDENTAIL_STATUS_TYPE: 'HypersignCredentialStatus2023',
  CREDENTIAL_STATUS_CONTEXT:
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialStatus.jsonld',
  CONTEXT_HypersignCredentialStatus2023:
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld',
  CREDENTAIL_BASE_CONTEXT: 'https://www.w3.org/2018/credentials/v1',
  CREDENTAIL_SECURITY_CONTEXT_V2: 'https://w3id.org/security/v2',
  CREDENTIAIL_SECURITY_SUITE: 'https://w3id.org/security/suites/ed25519-2020/v1',
  CREDENTAIL_ECDSA_SECURITY_SUITE: 'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
  PROOF_PURPOSE: VerificationMethodRelationships.assertionMethod,
  VERIFICATION_METHOD_TYPE: ProofTypes.Ed25519Signature2020,
  CRED_STATUS_TYPES: CredentialStatusEnums,
  CRED_STATUS_REASON_TYPES: CredentialStatusReasonEnums,
};
Object.freeze(VC);

export const VP = {
  PREFIX: 'vp:',
  SCHEME: 'vp',
  METHOD: 'hid',
  NAMESPACE: 'testnet',
};
Object.freeze(VP);

export const SCHEMA = {
  SCHEME: 'sch',
  METHOD: 'hid',
  NAMESPACE: 'testnet',
  SCHEMA_JSON: 'http://json-schema.org/draft-07/schema',
  SCHEMA_TYPE: 'https://w3c-ccg.github.io/vc-json-schemas/v1/schema/1.0/schema.json',
  SIGNATURE_TYPE: ProofTypes.Ed25519Signature2020,
  PROOF_PURPOSE: VerificationMethodRelationships.assertionMethod,
  SCHEMA_CONTEXT:
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialSchema.jsonld',
};
Object.freeze(SCHEMA);

export const KEY_HEADERS = {
  MULTICODEC_ED25519_PUB_HEADER: new Uint8Array([0xed, 0x01]),
  MULTICODEC_ED25519_PRIV_HEADER: new Uint8Array([0x80, 0x26]),
};
Object.freeze(KEY_HEADERS);

export const GAS_PRICE = '0.1';
export const HID_DECIMAL = 6;
export const HID_DNOMINATION = 'uhid';
export const HID_MIN_GAS = '200000';
export const HID_MIN_FEE = '5000';
