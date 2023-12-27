"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.proofTypesToNumber = exports.proofTypesToJSON = exports.proofTypesFromJSON = exports.ProofTypes = exports.verificationMethodTypesToNumber = exports.verificationMethodTypesToJSON = exports.verificationMethodTypesFromJSON = exports.VerificationMethodTypes = exports.verificationMethodRelationshipsToNumber = exports.verificationMethodRelationshipsToJSON = exports.verificationMethodRelationshipsFromJSON = exports.VerificationMethodRelationships = exports.protobufPackage = void 0;
exports.protobufPackage = "hypersign.ssi.client";
/** The messages defined here are meant only meant for TS client. */
var VerificationMethodRelationships;
(function (VerificationMethodRelationships) {
    VerificationMethodRelationships["authentication"] = "authentication";
    VerificationMethodRelationships["assertionMethod"] = "assertionMethod";
    VerificationMethodRelationships["keyAgreement"] = "keyAgreement";
    VerificationMethodRelationships["capabilityInvocation"] = "capabilityInvocation";
    VerificationMethodRelationships["capabilityDelegation"] = "capabilityDelegation";
})(VerificationMethodRelationships = exports.VerificationMethodRelationships || (exports.VerificationMethodRelationships = {}));
function verificationMethodRelationshipsFromJSON(object) {
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
exports.verificationMethodRelationshipsFromJSON = verificationMethodRelationshipsFromJSON;
function verificationMethodRelationshipsToJSON(object) {
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
exports.verificationMethodRelationshipsToJSON = verificationMethodRelationshipsToJSON;
function verificationMethodRelationshipsToNumber(object) {
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
exports.verificationMethodRelationshipsToNumber = verificationMethodRelationshipsToNumber;
var VerificationMethodTypes;
(function (VerificationMethodTypes) {
    VerificationMethodTypes["Ed25519VerificationKey2020"] = "Ed25519VerificationKey2020";
    VerificationMethodTypes["EcdsaSecp256k1VerificationKey2019"] = "EcdsaSecp256k1VerificationKey2019";
    VerificationMethodTypes["EcdsaSecp256k1RecoveryMethod2020"] = "EcdsaSecp256k1RecoveryMethod2020";
    VerificationMethodTypes["X25519KeyAgreementKey2020"] = "X25519KeyAgreementKey2020";
    VerificationMethodTypes["X25519KeyAgreementKeyEIP5630"] = "X25519KeyAgreementKeyEIP5630";
    VerificationMethodTypes["Bls12381G2Key2020"] = "Bls12381G2Key2020";
    VerificationMethodTypes["BabyJubJubKey2021"] = "BabyJubJubKey2021";
})(VerificationMethodTypes = exports.VerificationMethodTypes || (exports.VerificationMethodTypes = {}));
function verificationMethodTypesFromJSON(object) {
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
exports.verificationMethodTypesFromJSON = verificationMethodTypesFromJSON;
function verificationMethodTypesToJSON(object) {
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
exports.verificationMethodTypesToJSON = verificationMethodTypesToJSON;
function verificationMethodTypesToNumber(object) {
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
exports.verificationMethodTypesToNumber = verificationMethodTypesToNumber;
var ProofTypes;
(function (ProofTypes) {
    ProofTypes["Ed25519Signature2020"] = "Ed25519Signature2020";
    ProofTypes["EcdsaSecp256k1Signature2019"] = "EcdsaSecp256k1Signature2019";
    ProofTypes["EcdsaSecp256k1RecoverySignature2020"] = "EcdsaSecp256k1RecoverySignature2020";
    ProofTypes["BJJSignature2021"] = "BJJSignature2021";
    ProofTypes["BbsBlsSignature2020"] = "BbsBlsSignature2020";
})(ProofTypes = exports.ProofTypes || (exports.ProofTypes = {}));
function proofTypesFromJSON(object) {
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
exports.proofTypesFromJSON = proofTypesFromJSON;
function proofTypesToJSON(object) {
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
exports.proofTypesToJSON = proofTypesToJSON;
function proofTypesToNumber(object) {
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
exports.proofTypesToNumber = proofTypesToNumber;
