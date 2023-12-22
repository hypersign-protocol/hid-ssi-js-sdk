export declare const protobufPackage = "hypersign.ssi.client";
/** The messages defined here are meant only meant for TS client. */
export declare enum VerificationMethodRelationships {
    authentication = "authentication",
    assertionMethod = "assertionMethod",
    keyAgreement = "keyAgreement",
    capabilityInvocation = "capabilityInvocation",
    capabilityDelegation = "capabilityDelegation"
}
export declare function verificationMethodRelationshipsFromJSON(object: any): VerificationMethodRelationships;
export declare function verificationMethodRelationshipsToJSON(object: VerificationMethodRelationships): string;
export declare function verificationMethodRelationshipsToNumber(object: VerificationMethodRelationships): number;
export declare enum VerificationMethodTypes {
    Ed25519VerificationKey2020 = "Ed25519VerificationKey2020",
    EcdsaSecp256k1VerificationKey2019 = "EcdsaSecp256k1VerificationKey2019",
    EcdsaSecp256k1RecoveryMethod2020 = "EcdsaSecp256k1RecoveryMethod2020",
    X25519KeyAgreementKey2020 = "X25519KeyAgreementKey2020",
    X25519KeyAgreementKeyEIP5630 = "X25519KeyAgreementKeyEIP5630",
    Bls12381G2Key2020 = "Bls12381G2Key2020",
    BabyJubJubKey2021 = "BabyJubJubKey2021"
}
export declare function verificationMethodTypesFromJSON(object: any): VerificationMethodTypes;
export declare function verificationMethodTypesToJSON(object: VerificationMethodTypes): string;
export declare function verificationMethodTypesToNumber(object: VerificationMethodTypes): number;
export declare enum ProofTypes {
    Ed25519Signature2020 = "Ed25519Signature2020",
    EcdsaSecp256k1Signature2019 = "EcdsaSecp256k1Signature2019",
    EcdsaSecp256k1RecoverySignature2020 = "EcdsaSecp256k1RecoverySignature2020",
    BJJSignature2021 = "BJJSignature2021",
    BbsBlsSignature2020 = "BbsBlsSignature2020"
}
export declare function proofTypesFromJSON(object: any): ProofTypes;
export declare function proofTypesToJSON(object: ProofTypes): string;
export declare function proofTypesToNumber(object: ProofTypes): number;
//# sourceMappingURL=enums.d.ts.map