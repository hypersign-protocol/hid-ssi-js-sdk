"use strict"
export const compactProof = false;

export const HYPERSIGN_NETWORK_DID_REST_PATH="api/v1/did/"
export const HYPERSIGN_NETWORK_SCHEMA_EP="api/v1/schema/"

export const HYPERSIGN_TESTNET_RPC ="http://localhost:26657"
export const HYPERSIGN_TESTNET_REST="http://localhost:1317"

export const HYPERSIGN_MAINNET_RPC ="http://localhost:26657"
export const HYPERSIGN_MAINNET_REST="http://localhost:1317"

export const HID_COSMOS_MODULE='/hypersignprotocol.hidnode.ssi'
export const HYPERSIGN_NETWORK_DID_PATH="hypersign-protocol/hidnode/ssi/did"
export const HYPERSIGN_NETWORK_SCHEMA_PATH="hypersign-protocol/hidnode/ssi/schema"
export const HYPERSIGN_NETWORK_BANK_BALANCE_PATH="/bank/balances/"
export enum HIDRpcEnums {
    MsgCreateDID = "MsgCreateDID",
    MsgUpdateDID = "MsgUpdateDID",
    MsgDeactivateDID = "MsgDeactivateDID",
    MsgCreateSchema = "MsgCreateSchema",
}
Object.freeze(HIDRpcEnums)

export const VC = {
    PREFIX: "vc_",
    CREDENTAIL_SCHEMA_VALIDATOR_TYPE: "JsonSchemaValidator2018",
    CREDENTAIL_STATUS_TYPE: "CredentialStatusList2017",
    CREDENTAIL_BASE_CONTEXT: "https://www.w3.org/2018/credentials/v1",
    CREDENTAIL_SECURITY_SUITE: "https://w3id.org/security/suites/ed25519-2020/v1"
}
Object.freeze(VC)

export const VP = {
    PREFIX: "vp_"
}
Object.freeze(VP)

export const DID = {
    CONTROLLER_CONTEXT: "https://w3id.org/security/v2",
    SCHEME: "did:hs"
}
Object.freeze(DID)

export const KEY_HEADERS = {
    MULTICODEC_ED25519_PUB_HEADER : new Uint8Array([0xed, 0x01]),
    MULTICODEC_ED25519_PRIV_HEADER : new Uint8Array([0x80, 0x26])
}
Object.freeze(KEY_HEADERS)
