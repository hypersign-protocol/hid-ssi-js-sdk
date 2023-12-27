/* eslint-disable */

export const protobufPackage = "hypersign.ssi.client";

/** The messages defined here are meant only meant for TS client. */

export enum VerificationMethodRelationships {
    authentication = "authentication",
    assertionMethod = "assertionMethod",
    keyAgreement = "keyAgreement",
    capabilityInvocation = "capabilityInvocation",
    capabilityDelegation = "capabilityDelegation",
}

export function verificationMethodRelationshipsFromJSON(object: any): VerificationMethodRelationships {
    switch (object) {
        case 0:
        case "authentication":
            return VerificationMethodRelationships.authentication;
        case 1:
        case "assertionMethod":
            return VerificationMethodRelationships.assertionMethod;
        case 2:
        case "keyAgreement":
            return VerificationMethodRelationships.keyAgreement;
        case 3:
        case "capabilityInvocation":
            return VerificationMethodRelationships.capabilityInvocation;
        case 4:
        case "capabilityDelegation":
            return VerificationMethodRelationships.capabilityDelegation;
        default:
            throw new globalThis.Error("Unrecognized enum value " + object + " for enum VerificationMethodRelationships");
    }
}

export function verificationMethodRelationshipsToJSON(object: VerificationMethodRelationships): string {
    switch (object) {
        case VerificationMethodRelationships.authentication:
            return "authentication";
        case VerificationMethodRelationships.assertionMethod:
            return "assertionMethod";
        case VerificationMethodRelationships.keyAgreement:
            return "keyAgreement";
        case VerificationMethodRelationships.capabilityInvocation:
            return "capabilityInvocation";
        case VerificationMethodRelationships.capabilityDelegation:
            return "capabilityDelegation";
        default:
            throw new globalThis.Error("Unrecognized enum value " + object + " for enum VerificationMethodRelationships");
    }
}

export function verificationMethodRelationshipsToNumber(object: VerificationMethodRelationships): number {
    switch (object) {
        case VerificationMethodRelationships.authentication:
            return 0;
        case VerificationMethodRelationships.assertionMethod:
            return 1;
        case VerificationMethodRelationships.keyAgreement:
            return 2;
        case VerificationMethodRelationships.capabilityInvocation:
            return 3;
        case VerificationMethodRelationships.capabilityDelegation:
            return 4;
        default:
            throw new globalThis.Error("Unrecognized enum value " + object + " for enum VerificationMethodRelationships");
    }
}

export enum VerificationMethodTypes {
    Ed25519VerificationKey2020 = "Ed25519VerificationKey2020",
    EcdsaSecp256k1VerificationKey2019 = "EcdsaSecp256k1VerificationKey2019",
    EcdsaSecp256k1RecoveryMethod2020 = "EcdsaSecp256k1RecoveryMethod2020",
    X25519KeyAgreementKey2020 = "X25519KeyAgreementKey2020",
    X25519KeyAgreementKeyEIP5630 = "X25519KeyAgreementKeyEIP5630",
    Bls12381G2Key2020 = "Bls12381G2Key2020",
    BabyJubJubKey2021 = "BabyJubJubKey2021",
}

export function verificationMethodTypesFromJSON(object: any): VerificationMethodTypes {
    switch (object) {
        case 0:
        case "Ed25519VerificationKey2020":
            return VerificationMethodTypes.Ed25519VerificationKey2020;
        case 1:
        case "EcdsaSecp256k1VerificationKey2019":
            return VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019;
        case 2:
        case "EcdsaSecp256k1RecoveryMethod2020":
            return VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020;
        case 3:
        case "X25519KeyAgreementKey2020":
            return VerificationMethodTypes.X25519KeyAgreementKey2020;
        case 4:
        case "X25519KeyAgreementKeyEIP5630":
            return VerificationMethodTypes.X25519KeyAgreementKeyEIP5630;
        case 5:
        case "Bls12381G2Key2020":
            return VerificationMethodTypes.Bls12381G2Key2020;
        case 6:
        case "BabyJubJubKey2021":
            return VerificationMethodTypes.BabyJubJubKey2021;
        default:
            throw new globalThis.Error("Unrecognized enum value " + object + " for enum VerificationMethodTypes");
    }
}

export function verificationMethodTypesToJSON(object: VerificationMethodTypes): string {
    switch (object) {
        case VerificationMethodTypes.Ed25519VerificationKey2020:
            return "Ed25519VerificationKey2020";
        case VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019:
            return "EcdsaSecp256k1VerificationKey2019";
        case VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020:
            return "EcdsaSecp256k1RecoveryMethod2020";
        case VerificationMethodTypes.X25519KeyAgreementKey2020:
            return "X25519KeyAgreementKey2020";
        case VerificationMethodTypes.X25519KeyAgreementKeyEIP5630:
            return "X25519KeyAgreementKeyEIP5630";
        case VerificationMethodTypes.Bls12381G2Key2020:
            return "Bls12381G2Key2020";
        case VerificationMethodTypes.BabyJubJubKey2021:
            return "BabyJubJubKey2021";
        default:
            throw new globalThis.Error("Unrecognized enum value " + object + " for enum VerificationMethodTypes");
    }
}

export function verificationMethodTypesToNumber(object: VerificationMethodTypes): number {
    switch (object) {
        case VerificationMethodTypes.Ed25519VerificationKey2020:
            return 0;
        case VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019:
            return 1;
        case VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020:
            return 2;
        case VerificationMethodTypes.X25519KeyAgreementKey2020:
            return 3;
        case VerificationMethodTypes.X25519KeyAgreementKeyEIP5630:
            return 4;
        case VerificationMethodTypes.Bls12381G2Key2020:
            return 5;
        case VerificationMethodTypes.BabyJubJubKey2021:
            return 6;
        default:
            throw new globalThis.Error("Unrecognized enum value " + object + " for enum VerificationMethodTypes");
    }
}

export enum ProofTypes {
    Ed25519Signature2020 = "Ed25519Signature2020",
    EcdsaSecp256k1Signature2019 = "EcdsaSecp256k1Signature2019",
    EcdsaSecp256k1RecoverySignature2020 = "EcdsaSecp256k1RecoverySignature2020",
    BJJSignature2021 = "BJJSignature2021",
    BbsBlsSignature2020 = "BbsBlsSignature2020",
}

export function proofTypesFromJSON(object: any): ProofTypes {
    switch (object) {
        case 0:
        case "Ed25519Signature2020":
            return ProofTypes.Ed25519Signature2020;
        case 1:
        case "EcdsaSecp256k1Signature2019":
            return ProofTypes.EcdsaSecp256k1Signature2019;
        case 2:
        case "EcdsaSecp256k1RecoverySignature2020":
            return ProofTypes.EcdsaSecp256k1RecoverySignature2020;
        case 3:
      case "BJJSignature2021":
          return ProofTypes.BJJSignature2021;
      case 4:
      case "BbsBlsSignature2020":
          return ProofTypes.BbsBlsSignature2020;
      default:
          throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProofTypes");
  }
}

export function proofTypesToJSON(object: ProofTypes): string {
    switch (object) {
        case ProofTypes.Ed25519Signature2020:
            return "Ed25519Signature2020";
        case ProofTypes.EcdsaSecp256k1Signature2019:
            return "EcdsaSecp256k1Signature2019";
        case ProofTypes.EcdsaSecp256k1RecoverySignature2020:
            return "EcdsaSecp256k1RecoverySignature2020";
      case ProofTypes.BJJSignature2021:
          return "BJJSignature2021";
      case ProofTypes.BbsBlsSignature2020:
          return "BbsBlsSignature2020";
      default:
          throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProofTypes");
  }
}

export function proofTypesToNumber(object: ProofTypes): number {
    switch (object) {
        case ProofTypes.Ed25519Signature2020:
            return 0;
        case ProofTypes.EcdsaSecp256k1Signature2019:
            return 1;
        case ProofTypes.EcdsaSecp256k1RecoverySignature2020:
            return 2;
      case ProofTypes.BJJSignature2021:
          return 3;
      case ProofTypes.BbsBlsSignature2020:
          return 4;
      default:
          throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProofTypes");
  }
}
