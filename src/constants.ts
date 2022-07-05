"use strict"
export const compactProof = false;


export const HYPERSIGN_TESTNET_RPC ="http://localhost:26657"
export const HYPERSIGN_TESTNET_REST="http://localhost:1317"

export const HYPERSIGN_MAINNET_RPC ="http://localhost:26657"
export const HYPERSIGN_MAINNET_REST="http://localhost:1317"

export const HID_COSMOS_MODULE='/hypersignprotocol.hidnode.ssi'
export const HYPERSIGN_NETWORK_DID_PATH="hypersign-protocol/hidnode/ssi/did"
export const HYPERSIGN_NETWORK_SCHEMA_PATH="hypersign-protocol/hidnode/ssi/schema"
export const HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH="hypersign-protocol/hidnode/ssi/credential"
export const HYPERSIGN_NETWORK_BANK_BALANCE_PATH="/bank/balances/"

export enum HIDRpcEnums {
    MsgCreateDID = "MsgCreateDID",
    MsgUpdateDID = "MsgUpdateDID",
    MsgDeactivateDID = "MsgDeactivateDID",
    MsgCreateSchema = "MsgCreateSchema",
    MsgRegisterCredentialStatus= "MsgRegisterCredentialStatus"
}
Object.freeze(HIDRpcEnums)

export enum CredentialStatusEnums {
    LIVE = "Live"
}

export const VC = {
    PREFIX: "vc:",
    CREDENTAIL_SCHEMA_VALIDATOR_TYPE: "JsonSchemaValidator2018",
    CREDENTAIL_STATUS_TYPE: "CredentialStatusList2017",
    CREDENTAIL_BASE_CONTEXT: "https://www.w3.org/2018/credentials/v1",
    CREDENTAIL_SECURITY_SUITE: "https://w3id.org/security/suites/ed25519-2020/v1",
    PROOF_PURPOSE: "assertion",
    VERIFICATION_METHOD_TYPE: "Ed25519VerificationKey2020",
    CRED_STATUS_TYPES: CredentialStatusEnums 
}
Object.freeze(VC)

export const VP = {
    PREFIX: "vp:"
}
Object.freeze(VP)

export const DID = {
    CONTROLLER_CONTEXT: "https://w3id.org/security/v2",
    SCHEME: "did:hs",
    NAMESPACE:"devnet", // this is not used 
    DID_BASE_CONTEXT: "https://www.w3.org/ns/did/v1",
    VERIFICATION_METHOD_TYPE: "Ed25519VerificationKey2020"
}
Object.freeze(DID)

export const SCHEMA = {
    SCHEMA_JSON: 'http://json-schema.org/draft-07/schema',
    SCHEMA_TYPE: 'https://w3c-ccg.github.io/vc-json-schemas/schema/1.0/schema.json'
}
Object.freeze(SCHEMA)

export const KEY_HEADERS = {
    MULTICODEC_ED25519_PUB_HEADER : new Uint8Array([0xed, 0x01]),
    MULTICODEC_ED25519_PRIV_HEADER : new Uint8Array([0x80, 0x26])
}
Object.freeze(KEY_HEADERS)

export const GAS_PRICE='0.0001';
export const HID_DECIMAL = 18;
export const HID_DNOMINATION = 'uhid';
export const HID_MIN_GAS='200000'
export const HID_MIN_FEE='5000'


