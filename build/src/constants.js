"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HID_MIN_FEE = exports.HID_MIN_GAS = exports.HID_DNOMINATION = exports.HID_DECIMAL = exports.GAS_PRICE = exports.KEY_HEADERS = exports.SCHEMA = exports.VP = exports.VC = exports.DID = exports.CredentialStatusReasonEnums = exports.CredentialStatusEnums = exports.HIDRpcEnums = exports.HYPERSIGN_NETWORK_BANK_BALANCE_PATH = exports.HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH = exports.HYPERSIGN_NETWORK_SCHEMA_PATH = exports.HYPERSIGN_NETWORK_DID_PATH = exports.HID_COSMOS_MODULE = exports.HYPERSIGN_MAINNET_REST = exports.HYPERSIGN_MAINNET_RPC = exports.HYPERSIGN_TESTNET_REST = exports.HYPERSIGN_TESTNET_RPC = exports.compactProof = void 0;
exports.compactProof = false;
exports.HYPERSIGN_TESTNET_RPC = "http://localhost:26657";
exports.HYPERSIGN_TESTNET_REST = "http://localhost:1317";
exports.HYPERSIGN_MAINNET_RPC = "http://localhost:26657";
exports.HYPERSIGN_MAINNET_REST = "http://localhost:1317";
exports.HID_COSMOS_MODULE = '/hypersignprotocol.hidnode.ssi';
exports.HYPERSIGN_NETWORK_DID_PATH = "hypersign-protocol/hidnode/ssi/did";
exports.HYPERSIGN_NETWORK_SCHEMA_PATH = "hypersign-protocol/hidnode/ssi/schema";
exports.HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH = "hypersign-protocol/hidnode/ssi/credential";
exports.HYPERSIGN_NETWORK_BANK_BALANCE_PATH = "/bank/balances/";
var HIDRpcEnums;
(function (HIDRpcEnums) {
    HIDRpcEnums["MsgCreateDID"] = "MsgCreateDID";
    HIDRpcEnums["MsgUpdateDID"] = "MsgUpdateDID";
    HIDRpcEnums["MsgDeactivateDID"] = "MsgDeactivateDID";
    HIDRpcEnums["MsgCreateSchema"] = "MsgCreateSchema";
    HIDRpcEnums["MsgRegisterCredentialStatus"] = "MsgRegisterCredentialStatus";
})(HIDRpcEnums = exports.HIDRpcEnums || (exports.HIDRpcEnums = {}));
Object.freeze(HIDRpcEnums);
var CredentialStatusEnums;
(function (CredentialStatusEnums) {
    CredentialStatusEnums["LIVE"] = "Live";
    CredentialStatusEnums["REVOKED"] = "Revoked";
    CredentialStatusEnums["SUSPENDED"] = "Suspended";
})(CredentialStatusEnums = exports.CredentialStatusEnums || (exports.CredentialStatusEnums = {}));
var CredentialStatusReasonEnums;
(function (CredentialStatusReasonEnums) {
    CredentialStatusReasonEnums["LIVE"] = "Credential is live";
    CredentialStatusReasonEnums["REVOKED"] = "Credential is revoked";
    CredentialStatusReasonEnums["SUSPENDED"] = "Credential is suspended";
})(CredentialStatusReasonEnums = exports.CredentialStatusReasonEnums || (exports.CredentialStatusReasonEnums = {}));
exports.DID = {
    CONTROLLER_CONTEXT: "https://w3id.org/security/v2",
    SCHEME: "did",
    METHOD: "hid",
    NAMESPACE: "devnet",
    DID_BASE_CONTEXT: "https://www.w3.org/ns/did/v1",
    VERIFICATION_METHOD_TYPE: "Ed25519VerificationKey2020"
};
Object.freeze(exports.DID);
exports.VC = {
    SCHEME: "vc",
    METHOD: "hid",
    NAMESPACE: "devnet",
    PREFIX: "vc:" + exports.DID.METHOD + ":" + exports.DID.NAMESPACE + ":",
    CREDENTAIL_SCHEMA_VALIDATOR_TYPE: "JsonSchemaValidator2018",
    CREDENTAIL_STATUS_TYPE: "CredentialStatusList2017",
    CREDENTAIL_BASE_CONTEXT: "https://www.w3.org/2018/credentials/v1",
    CREDENTAIL_SECURITY_CONTEXT_V2: "https://w3id.org/security/v2",
    CREDENTAIL_SECURITY_SUITE: "https://w3id.org/security/suites/ed25519-2020/v1",
    PROOF_PURPOSE: "assertion",
    VERIFICATION_METHOD_TYPE: "Ed25519VerificationKey2020",
    CRED_STATUS_TYPES: CredentialStatusEnums,
    CRED_STATUS_REASON_TYPES: CredentialStatusReasonEnums
};
Object.freeze(exports.VC);
exports.VP = {
    PREFIX: "vp:",
    SCHEME: "vp",
    METHOD: "hid",
    NAMESPACE: "devnet",
};
Object.freeze(exports.VP);
exports.SCHEMA = {
    SCHEME: "sch",
    METHOD: "hid",
    NAMESPACE: "devnet",
    SCHEMA_JSON: 'http://json-schema.org/draft-07/schema',
    SCHEMA_TYPE: 'https://w3c-ccg.github.io/vc-json-schemas/v1/schema/1.0/schema.json'
};
Object.freeze(exports.SCHEMA);
exports.KEY_HEADERS = {
    MULTICODEC_ED25519_PUB_HEADER: new Uint8Array([0xed, 0x01]),
    MULTICODEC_ED25519_PRIV_HEADER: new Uint8Array([0x80, 0x26])
};
Object.freeze(exports.KEY_HEADERS);
exports.GAS_PRICE = '0.1';
exports.HID_DECIMAL = 6;
exports.HID_DNOMINATION = 'uhid';
exports.HID_MIN_GAS = '200000';
exports.HID_MIN_FEE = '5000';
