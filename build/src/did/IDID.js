"use strict";
/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IClientSpec = exports.IKeyType = exports.IVerificationRelationships = void 0;
var IVerificationRelationships;
(function (IVerificationRelationships) {
    IVerificationRelationships["authentication"] = "authentication";
    IVerificationRelationships["assertionMethod"] = "assertionMethod";
    IVerificationRelationships["keyAgreement"] = "keyAgreement";
    IVerificationRelationships["capabilityInvocation"] = "capabilityInvocation";
    IVerificationRelationships["capabilityDelegation"] = "capabilityDelegation";
})(IVerificationRelationships = exports.IVerificationRelationships || (exports.IVerificationRelationships = {}));
var IKeyType;
(function (IKeyType) {
    IKeyType["Ed25519VerificationKey2020"] = "Ed25519VerificationKey2020";
    IKeyType["EcdsaSecp256k1VerificationKey2019"] = "EcdsaSecp256k1VerificationKey2019";
    IKeyType["EcdsaSecp256k1RecoveryMethod2020"] = "EcdsaSecp256k1RecoveryMethod2020";
})(IKeyType = exports.IKeyType || (exports.IKeyType = {}));
var IClientSpec;
(function (IClientSpec) {
    IClientSpec["eth-personalSign"] = "eth-personalSign";
    IClientSpec["cosmos-ADR036"] = "cosmos-ADR036";
})(IClientSpec = exports.IClientSpec || (exports.IClientSpec = {}));
