'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAS_FEE_METHODS = exports.GAS_FEE_API_URL = exports.HID_MIN_FEE = exports.HID_MIN_GAS = exports.HID_DNOMINATION = exports.HID_DECIMAL = exports.GAS_PRICE = exports.KEY_HEADERS = exports.SCHEMA = exports.VP = exports.VC = exports.DID = exports.CAIP_10_PREFIX = exports.DID_BabyJubJubKey2021 = exports.DID_EcdsaSecp256k1VerificationKey2019 = exports.DID_EcdsaSecp256k1RecoveryMethod2020 = exports.DID_Ed25519VerificationKey2020 = exports.CredentialStatusReasonEnums = exports.CredentialStatusEnums = exports.HIDRpcEnums = exports.HYPERSIGN_NETWORK_BANK_BALANCE_PATH = exports.HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH = exports.HYPERSIGN_NETWORK_SCHEMA_PATH = exports.HYPERSIGN_NETWORK_DID_PATH = exports.HID_COSMOS_MODULE = exports.HYPERSIGN_MAINNET_REST = exports.HYPERSIGN_MAINNET_RPC = exports.HYPERSIGN_TESTNET_REST = exports.HYPERSIGN_TESTNET_RPC = exports.compactProof = void 0;
const enums_1 = require("../libs/generated/ssi/client/enums");
exports.compactProof = false;
exports.HYPERSIGN_TESTNET_RPC = 'https://rpc.jagrat.hypersign.id';
exports.HYPERSIGN_TESTNET_REST = 'https://api.jagrat.hypersign.id';
exports.HYPERSIGN_MAINNET_RPC = 'http://localhost:26657';
exports.HYPERSIGN_MAINNET_REST = 'http://localhost:1317';
exports.HID_COSMOS_MODULE = '/hypersign.ssi.v1';
exports.HYPERSIGN_NETWORK_DID_PATH = 'hypersign-protocol/hidnode/ssi/did';
exports.HYPERSIGN_NETWORK_SCHEMA_PATH = 'hypersign-protocol/hidnode/ssi/schema';
exports.HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH = 'hypersign-protocol/hidnode/ssi/credential';
exports.HYPERSIGN_NETWORK_BANK_BALANCE_PATH = '/bank/balances/';
var HIDRpcEnums;
(function (HIDRpcEnums) {
    HIDRpcEnums["MsgRegisterDID"] = "MsgRegisterDID";
    HIDRpcEnums["MsgUpdateDID"] = "MsgUpdateDID";
    HIDRpcEnums["MsgDeactivateDID"] = "MsgDeactivateDID";
    HIDRpcEnums["MsgRegisterCredentialSchema"] = "MsgRegisterCredentialSchema";
    HIDRpcEnums["MsgRegisterCredentialStatus"] = "MsgRegisterCredentialStatus";
    HIDRpcEnums["MsgUpdateCredentialStatus"] = "MsgUpdateCredentialStatus";
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
exports.DID_Ed25519VerificationKey2020 = {
    CONTROLLER_CONTEXT: 'https://w3id.org/security/v2',
    SCHEME: 'did',
    METHOD: 'hid',
    NAMESPACE: 'testnet',
    DID_BASE_CONTEXT: 'https://www.w3.org/ns/did/v1',
    DID_KEYAGREEMENT_CONTEXT: 'https://ns.did.ai/suites/x25519-2020/v1',
    DID_Ed25519_CONTEXT_2020: 'https://w3id.org/security/suites/ed25519-2020/v1',
    VERIFICATION_METHOD_TYPE: 'Ed25519VerificationKey2020',
    BLOCKCHAINACCOUNTID_CONTEXT: 'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld',
    SIGNATURE_TYPE: enums_1.ProofTypes.Ed25519Signature2020,
};
exports.DID_EcdsaSecp256k1RecoveryMethod2020 = {
    CONTROLLER_CONTEXT: 'https://w3id.org/security/v2',
    SCHEME: 'did',
    METHOD: 'hid',
    NAMESPACE: 'testnet',
    DID_BASE_CONTEXT: 'https://www.w3.org/ns/did/v1',
    DID_KEYAGREEMENT_CONTEXT: 'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/X25519KeyAgreementKeyEIP5630.jsonld',
    BLOCKCHAINACCOUNTID_CONTEXT: 'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld',
    SECP256K12020_RECOVERY_CONTEXT: 'https://ns.did.ai/suites/secp256k1-2020/v1',
    VERIFICATION_METHOD_TYPE: enums_1.VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020,
    SIGNATURE_TYPE: enums_1.ProofTypes.EcdsaSecp256k1RecoverySignature2020,
};
exports.DID_EcdsaSecp256k1VerificationKey2019 = {
    CONTROLLER_CONTEXT: 'https://w3id.org/security/v2',
    SCHEME: 'did',
    METHOD: 'hid',
    NAMESPACE: 'testnet',
    DID_BASE_CONTEXT: 'https://www.w3.org/ns/did/v1',
    BLOCKCHAINACCOUNTID_CONTEXT: 'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld',
    SECP256K12020_VERIFICATION_CONTEXT: 'https://ns.did.ai/suites/secp256k1-2019/v1',
    VERIFICATION_METHOD_TYPE: enums_1.VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019,
    SIGNATURE_TYPE: enums_1.ProofTypes.EcdsaSecp256k1Signature2019,
};
exports.DID_BabyJubJubKey2021 = {
    CONTROLLER_CONTEXT: 'https://w3id.org/security/v2',
    SCHEME: 'did',
    METHOD: 'hid',
    NAMESPACE: 'testnet',
    DID_BASE_CONTEXT: 'https://www.w3.org/ns/did/v1',
    DID_KEYAGREEMENT_CONTEXT: 'https://ns.did.ai/suites/x25519-2020/v1',
    DID_BABYJUBJUBKEY2021: 'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BabyJubJubKey2021.jsonld',
    BABYJUBJUBSIGNATURE: 'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BJJSignature2021.jsonld',
    VERIFICATION_METHOD_TYPE: 'BabyJubJubKey2021',
    BLOCKCHAINACCOUNTID_CONTEXT: 'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld',
    SIGNATURE_TYPE: enums_1.ProofTypes.BJJSignature2021,
};
var CAIP_10_PREFIX;
(function (CAIP_10_PREFIX) {
    CAIP_10_PREFIX["eip155"] = "eip155";
})(CAIP_10_PREFIX = exports.CAIP_10_PREFIX || (exports.CAIP_10_PREFIX = {}));
exports.DID = {
    CONTROLLER_CONTEXT: 'https://w3id.org/security/v2',
    SCHEME: 'did',
    METHOD: 'hid',
    NAMESPACE: 'testnet',
    DID_BASE_CONTEXT: 'https://www.w3.org/ns/did/v1',
    VERIFICATION_METHOD_TYPE: enums_1.VerificationMethodTypes.Ed25519VerificationKey2020,
    BLOCKCHAINACCOUNTID_CONTEXT: 'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld',
};
Object.freeze(exports.DID);
exports.VC = {
    SCHEME: 'vc',
    METHOD: 'hid',
    NAMESPACE: 'testnet',
    PREFIX: 'vc:' + exports.DID.METHOD + ':' + exports.DID.NAMESPACE + ':',
    CREDENTAIL_SCHEMA_VALIDATOR_TYPE: 'JsonSchemaValidator2018',
    CREDENTAIL_STATUS_TYPE: 'HypersignCredentialStatus2023',
    CREDENTIAL_STATUS_CONTEXT: 'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialStatus.jsonld',
    CONTEXT_HypersignCredentialStatus2023: 'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld',
    CREDENTAIL_BASE_CONTEXT: 'https://www.w3.org/2018/credentials/v1',
    CREDENTAIL_SECURITY_CONTEXT_V2: 'https://w3id.org/security/v2',
    CREDENTIAIL_SECURITY_SUITE: 'https://w3id.org/security/suites/ed25519-2020/v1',
    CREDENTAIL_ECDSA_SECURITY_SUITE: 'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
    PROOF_PURPOSE: enums_1.VerificationMethodRelationships.assertionMethod,
    VERIFICATION_METHOD_TYPE: enums_1.ProofTypes.Ed25519Signature2020,
    CRED_STATUS_TYPES: CredentialStatusEnums,
    CRED_STATUS_REASON_TYPES: CredentialStatusReasonEnums,
};
Object.freeze(exports.VC);
exports.VP = {
    PREFIX: 'vp:',
    SCHEME: 'vp',
    METHOD: 'hid',
    NAMESPACE: 'testnet',
};
Object.freeze(exports.VP);
exports.SCHEMA = {
    SCHEME: 'sch',
    METHOD: 'hid',
    NAMESPACE: 'testnet',
    SCHEMA_JSON: 'http://json-schema.org/draft-07/schema',
    SCHEMA_TYPE: 'https://w3c-ccg.github.io/vc-json-schemas/v1/schema/1.0/schema.json',
    SIGNATURE_TYPE: enums_1.ProofTypes.Ed25519Signature2020,
    PROOF_PURPOSE: enums_1.VerificationMethodRelationships.assertionMethod,
    SCHEMA_CONTEXT: 'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialSchema.jsonld',
};
Object.freeze(exports.SCHEMA);
exports.KEY_HEADERS = {
    MULTICODEC_ED25519_PUB_HEADER: new Uint8Array([0xed, 0x01]),
    MULTICODEC_ED25519_PRIV_HEADER: new Uint8Array([0x80, 0x26]),
};
Object.freeze(exports.KEY_HEADERS);
exports.GAS_PRICE = '0.1';
exports.HID_DECIMAL = 6;
exports.HID_DNOMINATION = 'uhid';
exports.HID_MIN_GAS = '200000';
exports.HID_MIN_FEE = '5000';
const GAS_FEE_API_URL = (baseUrl) => { return `${baseUrl}/hypersign-protocol/hidnode/ssi/fixedfee`; };
exports.GAS_FEE_API_URL = GAS_FEE_API_URL;
exports.GAS_FEE_METHODS = {
    Register_Did: "register_did_fee",
    Update_Did: "update_did_fee",
    Deactivate_Did: "deactivate_did_fee",
    Register_Cred_Schema: "register_credential_schema_fee",
    Update_Cred_Schema: "update_credential_schema_fee",
    Register_Cred_Status: "register_credential_status_fee",
    Update_Cred_Status: "update_credential_status_fee"
};
