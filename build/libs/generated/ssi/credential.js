"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Credential = exports.CredentialProof = exports.CredentialStatus = exports.Claim = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = require("protobufjs/minimal");
exports.protobufPackage = "hypersignprotocol.hidnode.ssi";
const baseClaim = { id: "", currentStatus: "", statusReason: "" };
exports.Claim = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.currentStatus !== "") {
            writer.uint32(18).string(message.currentStatus);
        }
        if (message.statusReason !== "") {
            writer.uint32(26).string(message.statusReason);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseClaim);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.currentStatus = reader.string();
                    break;
                case 3:
                    message.statusReason = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseClaim);
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.currentStatus !== undefined && object.currentStatus !== null) {
            message.currentStatus = String(object.currentStatus);
        }
        else {
            message.currentStatus = "";
        }
        if (object.statusReason !== undefined && object.statusReason !== null) {
            message.statusReason = String(object.statusReason);
        }
        else {
            message.statusReason = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.currentStatus !== undefined &&
            (obj.currentStatus = message.currentStatus);
        message.statusReason !== undefined &&
            (obj.statusReason = message.statusReason);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseClaim);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.currentStatus !== undefined && object.currentStatus !== null) {
            message.currentStatus = object.currentStatus;
        }
        else {
            message.currentStatus = "";
        }
        if (object.statusReason !== undefined && object.statusReason !== null) {
            message.statusReason = object.statusReason;
        }
        else {
            message.statusReason = "";
        }
        return message;
    },
};
const baseCredentialStatus = {
    issuer: "",
    issuanceDate: "",
    expirationDate: "",
    credentialHash: "",
};
exports.CredentialStatus = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.claim !== undefined) {
            exports.Claim.encode(message.claim, writer.uint32(10).fork()).ldelim();
        }
        if (message.issuer !== "") {
            writer.uint32(18).string(message.issuer);
        }
        if (message.issuanceDate !== "") {
            writer.uint32(26).string(message.issuanceDate);
        }
        if (message.expirationDate !== "") {
            writer.uint32(34).string(message.expirationDate);
        }
        if (message.credentialHash !== "") {
            writer.uint32(42).string(message.credentialHash);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseCredentialStatus);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.claim = exports.Claim.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.issuer = reader.string();
                    break;
                case 3:
                    message.issuanceDate = reader.string();
                    break;
                case 4:
                    message.expirationDate = reader.string();
                    break;
                case 5:
                    message.credentialHash = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseCredentialStatus);
        if (object.claim !== undefined && object.claim !== null) {
            message.claim = exports.Claim.fromJSON(object.claim);
        }
        else {
            message.claim = undefined;
        }
        if (object.issuer !== undefined && object.issuer !== null) {
            message.issuer = String(object.issuer);
        }
        else {
            message.issuer = "";
        }
        if (object.issuanceDate !== undefined && object.issuanceDate !== null) {
            message.issuanceDate = String(object.issuanceDate);
        }
        else {
            message.issuanceDate = "";
        }
        if (object.expirationDate !== undefined && object.expirationDate !== null) {
            message.expirationDate = String(object.expirationDate);
        }
        else {
            message.expirationDate = "";
        }
        if (object.credentialHash !== undefined && object.credentialHash !== null) {
            message.credentialHash = String(object.credentialHash);
        }
        else {
            message.credentialHash = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.claim !== undefined &&
            (obj.claim = message.claim ? exports.Claim.toJSON(message.claim) : undefined);
        message.issuer !== undefined && (obj.issuer = message.issuer);
        message.issuanceDate !== undefined &&
            (obj.issuanceDate = message.issuanceDate);
        message.expirationDate !== undefined &&
            (obj.expirationDate = message.expirationDate);
        message.credentialHash !== undefined &&
            (obj.credentialHash = message.credentialHash);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseCredentialStatus);
        if (object.claim !== undefined && object.claim !== null) {
            message.claim = exports.Claim.fromPartial(object.claim);
        }
        else {
            message.claim = undefined;
        }
        if (object.issuer !== undefined && object.issuer !== null) {
            message.issuer = object.issuer;
        }
        else {
            message.issuer = "";
        }
        if (object.issuanceDate !== undefined && object.issuanceDate !== null) {
            message.issuanceDate = object.issuanceDate;
        }
        else {
            message.issuanceDate = "";
        }
        if (object.expirationDate !== undefined && object.expirationDate !== null) {
            message.expirationDate = object.expirationDate;
        }
        else {
            message.expirationDate = "";
        }
        if (object.credentialHash !== undefined && object.credentialHash !== null) {
            message.credentialHash = object.credentialHash;
        }
        else {
            message.credentialHash = "";
        }
        return message;
    },
};
const baseCredentialProof = {
    type: "",
    created: "",
    updated: "",
    verificationMethod: "",
    proofPurpose: "",
    proofValue: "",
};
exports.CredentialProof = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.created !== "") {
            writer.uint32(18).string(message.created);
        }
        if (message.updated !== "") {
            writer.uint32(26).string(message.updated);
        }
        if (message.verificationMethod !== "") {
            writer.uint32(34).string(message.verificationMethod);
        }
        if (message.proofPurpose !== "") {
            writer.uint32(42).string(message.proofPurpose);
        }
        if (message.proofValue !== "") {
            writer.uint32(50).string(message.proofValue);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseCredentialProof);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.created = reader.string();
                    break;
                case 3:
                    message.updated = reader.string();
                    break;
                case 4:
                    message.verificationMethod = reader.string();
                    break;
                case 5:
                    message.proofPurpose = reader.string();
                    break;
                case 6:
                    message.proofValue = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseCredentialProof);
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.created !== undefined && object.created !== null) {
            message.created = String(object.created);
        }
        else {
            message.created = "";
        }
        if (object.updated !== undefined && object.updated !== null) {
            message.updated = String(object.updated);
        }
        else {
            message.updated = "";
        }
        if (object.verificationMethod !== undefined &&
            object.verificationMethod !== null) {
            message.verificationMethod = String(object.verificationMethod);
        }
        else {
            message.verificationMethod = "";
        }
        if (object.proofPurpose !== undefined && object.proofPurpose !== null) {
            message.proofPurpose = String(object.proofPurpose);
        }
        else {
            message.proofPurpose = "";
        }
        if (object.proofValue !== undefined && object.proofValue !== null) {
            message.proofValue = String(object.proofValue);
        }
        else {
            message.proofValue = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.created !== undefined && (obj.created = message.created);
        message.updated !== undefined && (obj.updated = message.updated);
        message.verificationMethod !== undefined &&
            (obj.verificationMethod = message.verificationMethod);
        message.proofPurpose !== undefined &&
            (obj.proofPurpose = message.proofPurpose);
        message.proofValue !== undefined && (obj.proofValue = message.proofValue);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseCredentialProof);
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = "";
        }
        if (object.created !== undefined && object.created !== null) {
            message.created = object.created;
        }
        else {
            message.created = "";
        }
        if (object.updated !== undefined && object.updated !== null) {
            message.updated = object.updated;
        }
        else {
            message.updated = "";
        }
        if (object.verificationMethod !== undefined &&
            object.verificationMethod !== null) {
            message.verificationMethod = object.verificationMethod;
        }
        else {
            message.verificationMethod = "";
        }
        if (object.proofPurpose !== undefined && object.proofPurpose !== null) {
            message.proofPurpose = object.proofPurpose;
        }
        else {
            message.proofPurpose = "";
        }
        if (object.proofValue !== undefined && object.proofValue !== null) {
            message.proofValue = object.proofValue;
        }
        else {
            message.proofValue = "";
        }
        return message;
    },
};
const baseCredential = {
    issuer: "",
    issuanceDate: "",
    expirationDate: "",
    credentialHash: "",
};
exports.Credential = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.claim !== undefined) {
            exports.Claim.encode(message.claim, writer.uint32(10).fork()).ldelim();
        }
        if (message.issuer !== "") {
            writer.uint32(18).string(message.issuer);
        }
        if (message.issuanceDate !== "") {
            writer.uint32(26).string(message.issuanceDate);
        }
        if (message.expirationDate !== "") {
            writer.uint32(34).string(message.expirationDate);
        }
        if (message.credentialHash !== "") {
            writer.uint32(42).string(message.credentialHash);
        }
        if (message.proof !== undefined) {
            exports.CredentialProof.encode(message.proof, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseCredential);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.claim = exports.Claim.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.issuer = reader.string();
                    break;
                case 3:
                    message.issuanceDate = reader.string();
                    break;
                case 4:
                    message.expirationDate = reader.string();
                    break;
                case 5:
                    message.credentialHash = reader.string();
                    break;
                case 6:
                    message.proof = exports.CredentialProof.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseCredential);
        if (object.claim !== undefined && object.claim !== null) {
            message.claim = exports.Claim.fromJSON(object.claim);
        }
        else {
            message.claim = undefined;
        }
        if (object.issuer !== undefined && object.issuer !== null) {
            message.issuer = String(object.issuer);
        }
        else {
            message.issuer = "";
        }
        if (object.issuanceDate !== undefined && object.issuanceDate !== null) {
            message.issuanceDate = String(object.issuanceDate);
        }
        else {
            message.issuanceDate = "";
        }
        if (object.expirationDate !== undefined && object.expirationDate !== null) {
            message.expirationDate = String(object.expirationDate);
        }
        else {
            message.expirationDate = "";
        }
        if (object.credentialHash !== undefined && object.credentialHash !== null) {
            message.credentialHash = String(object.credentialHash);
        }
        else {
            message.credentialHash = "";
        }
        if (object.proof !== undefined && object.proof !== null) {
            message.proof = exports.CredentialProof.fromJSON(object.proof);
        }
        else {
            message.proof = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.claim !== undefined &&
            (obj.claim = message.claim ? exports.Claim.toJSON(message.claim) : undefined);
        message.issuer !== undefined && (obj.issuer = message.issuer);
        message.issuanceDate !== undefined &&
            (obj.issuanceDate = message.issuanceDate);
        message.expirationDate !== undefined &&
            (obj.expirationDate = message.expirationDate);
        message.credentialHash !== undefined &&
            (obj.credentialHash = message.credentialHash);
        message.proof !== undefined &&
            (obj.proof = message.proof
                ? exports.CredentialProof.toJSON(message.proof)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseCredential);
        if (object.claim !== undefined && object.claim !== null) {
            message.claim = exports.Claim.fromPartial(object.claim);
        }
        else {
            message.claim = undefined;
        }
        if (object.issuer !== undefined && object.issuer !== null) {
            message.issuer = object.issuer;
        }
        else {
            message.issuer = "";
        }
        if (object.issuanceDate !== undefined && object.issuanceDate !== null) {
            message.issuanceDate = object.issuanceDate;
        }
        else {
            message.issuanceDate = "";
        }
        if (object.expirationDate !== undefined && object.expirationDate !== null) {
            message.expirationDate = object.expirationDate;
        }
        else {
            message.expirationDate = "";
        }
        if (object.credentialHash !== undefined && object.credentialHash !== null) {
            message.credentialHash = object.credentialHash;
        }
        else {
            message.credentialHash = "";
        }
        if (object.proof !== undefined && object.proof !== null) {
            message.proof = exports.CredentialProof.fromPartial(object.proof);
        }
        else {
            message.proof = undefined;
        }
        return message;
    },
};
