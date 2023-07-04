export declare const compactProof = false;
export declare const HYPERSIGN_TESTNET_RPC = "https://rpc.jagrat.hypersign.id";
export declare const HYPERSIGN_TESTNET_REST = "https://api.jagrat.hypersign.id";
export declare const HYPERSIGN_MAINNET_RPC = "http://localhost:26657";
export declare const HYPERSIGN_MAINNET_REST = "http://localhost:1317";
export declare const HID_COSMOS_MODULE = "/hypersignprotocol.hidnode.ssi";
export declare const HYPERSIGN_NETWORK_DID_PATH = "hypersign-protocol/hidnode/ssi/did";
export declare const HYPERSIGN_NETWORK_SCHEMA_PATH = "hypersign-protocol/hidnode/ssi/schema";
export declare const HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH = "hypersign-protocol/hidnode/ssi/credential";
export declare const HYPERSIGN_NETWORK_BANK_BALANCE_PATH = "/bank/balances/";
export declare enum HIDRpcEnums {
    MsgCreateDID = "MsgCreateDID",
    MsgUpdateDID = "MsgUpdateDID",
    MsgDeactivateDID = "MsgDeactivateDID",
    MsgCreateSchema = "MsgCreateSchema",
    MsgRegisterCredentialStatus = "MsgRegisterCredentialStatus"
}
export declare enum CredentialStatusEnums {
    LIVE = "Live",
    REVOKED = "Revoked",
    SUSPENDED = "Suspended"
}
export declare enum CredentialStatusReasonEnums {
    LIVE = "Credential is live",
    REVOKED = "Credential is revoked",
    SUSPENDED = "Credential is suspended"
}
export declare const DID_Ed25519VerificationKey2020: {
    CONTROLLER_CONTEXT: string;
    SCHEME: string;
    METHOD: string;
    NAMESPACE: string;
    DID_BASE_CONTEXT: string;
    VERIFICATION_METHOD_TYPE: string;
    BLOCKCHAINACCOUNTID_CONTEXT: string;
};
export declare const DID_EcdsaSecp256k1RecoveryMethod2020: {
    CONTROLLER_CONTEXT: string;
    SCHEME: string;
    METHOD: string;
    NAMESPACE: string;
    DID_BASE_CONTEXT: string;
    BLOCKCHAINACCOUNTID_CONTEXT: string;
    VERIFICATION_METHOD_TYPE: string;
};
export declare const DID_EcdsaSecp256k1VerificationKey2019: {
    CONTROLLER_CONTEXT: string;
    SCHEME: string;
    METHOD: string;
    NAMESPACE: string;
    DID_BASE_CONTEXT: string;
    BLOCKCHAINACCOUNTID_CONTEXT: string;
    VERIFICATION_METHOD_TYPE: string;
};
export declare enum CAIP_10_PREFIX {
    "eip155" = "eip155"
}
export declare const DID: {
    CONTROLLER_CONTEXT: string;
    SCHEME: string;
    METHOD: string;
    NAMESPACE: string;
    DID_BASE_CONTEXT: string;
    VERIFICATION_METHOD_TYPE: string;
    BLOCKCHAINACCOUNTID_CONTEXT: string;
};
export declare const VC: {
    SCHEME: string;
    METHOD: string;
    NAMESPACE: string;
    PREFIX: string;
    CREDENTAIL_SCHEMA_VALIDATOR_TYPE: string;
    CREDENTAIL_STATUS_TYPE: string;
    CREDENTAIL_BASE_CONTEXT: string;
    CREDENTAIL_SECURITY_CONTEXT_V2: string;
    CREDENTAIL_SECURITY_SUITE: string;
    CREDENTAIL_ECDSA_SECURITY_SUITE: string;
    PROOF_PURPOSE: string;
    VERIFICATION_METHOD_TYPE: string;
    CRED_STATUS_TYPES: typeof CredentialStatusEnums;
    CRED_STATUS_REASON_TYPES: typeof CredentialStatusReasonEnums;
};
export declare const VP: {
    PREFIX: string;
    SCHEME: string;
    METHOD: string;
    NAMESPACE: string;
};
export declare const SCHEMA: {
    SCHEME: string;
    METHOD: string;
    NAMESPACE: string;
    SCHEMA_JSON: string;
    SCHEMA_TYPE: string;
    SIGNATURE_TYPE: string;
    PROOF_PURPOSE: string;
};
export declare const KEY_HEADERS: {
    MULTICODEC_ED25519_PUB_HEADER: Uint8Array;
    MULTICODEC_ED25519_PRIV_HEADER: Uint8Array;
};
export declare const GAS_PRICE = "0.1";
export declare const HID_DECIMAL = 6;
export declare const HID_DNOMINATION = "uhid";
export declare const HID_MIN_GAS = "200000";
export declare const HID_MIN_FEE = "5000";
//# sourceMappingURL=constants.d.ts.map