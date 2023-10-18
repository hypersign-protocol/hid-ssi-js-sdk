"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidDocumentState = exports.SignInfo = exports.Service = exports.VerificationMethod = exports.Metadata = exports.Did = exports.protobufPackage = void 0;
/* eslint-disable */
const clientSpec_1 = require("./clientSpec");
const minimal_1 = require("protobufjs/minimal");
exports.protobufPackage = "hypersignprotocol.hidnode.ssi";
const baseDid = {
    context: "",
    id: "",
    controller: "",
    alsoKnownAs: "",
    authentication: "",
    assertionMethod: "",
    keyAgreement: "",
    capabilityInvocation: "",
    capabilityDelegation: "",
};
exports.Did = {
    encode(message, writer = minimal_1.Writer.create()) {
        for (const v of message.context) {
            writer.uint32(10).string(v);
        }
        if (message.id !== "") {
            writer.uint32(18).string(message.id);
        }
        for (const v of message.controller) {
            writer.uint32(26).string(v);
        }
        for (const v of message.alsoKnownAs) {
            writer.uint32(34).string(v);
        }
        for (const v of message.verificationMethod) {
            exports.VerificationMethod.encode(v, writer.uint32(42).fork()).ldelim();
        }
        for (const v of message.authentication) {
            writer.uint32(50).string(v);
        }
        for (const v of message.assertionMethod) {
            writer.uint32(58).string(v);
        }
        for (const v of message.keyAgreement) {
            writer.uint32(66).string(v);
        }
        for (const v of message.capabilityInvocation) {
            writer.uint32(74).string(v);
        }
        for (const v of message.capabilityDelegation) {
            writer.uint32(82).string(v);
        }
        for (const v of message.service) {
            exports.Service.encode(v, writer.uint32(90).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseDid);
        message.context = [];
        message.controller = [];
        message.alsoKnownAs = [];
        message.verificationMethod = [];
        message.authentication = [];
        message.assertionMethod = [];
        message.keyAgreement = [];
        message.capabilityInvocation = [];
        message.capabilityDelegation = [];
        message.service = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.context.push(reader.string());
                    break;
                case 2:
                    message.id = reader.string();
                    break;
                case 3:
                    message.controller.push(reader.string());
                    break;
                case 4:
                    message.alsoKnownAs.push(reader.string());
                    break;
                case 5:
                    message.verificationMethod.push(exports.VerificationMethod.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.authentication.push(reader.string());
                    break;
                case 7:
                    message.assertionMethod.push(reader.string());
                    break;
                case 8:
                    message.keyAgreement.push(reader.string());
                    break;
                case 9:
                    message.capabilityInvocation.push(reader.string());
                    break;
                case 10:
                    message.capabilityDelegation.push(reader.string());
                    break;
                case 11:
                    message.service.push(exports.Service.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseDid);
        message.context = [];
        message.controller = [];
        message.alsoKnownAs = [];
        message.verificationMethod = [];
        message.authentication = [];
        message.assertionMethod = [];
        message.keyAgreement = [];
        message.capabilityInvocation = [];
        message.capabilityDelegation = [];
        message.service = [];
        if (object.context !== undefined && object.context !== null) {
            for (const e of object.context) {
                message.context.push(String(e));
            }
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.controller !== undefined && object.controller !== null) {
            for (const e of object.controller) {
                message.controller.push(String(e));
            }
        }
        if (object.alsoKnownAs !== undefined && object.alsoKnownAs !== null) {
            for (const e of object.alsoKnownAs) {
                message.alsoKnownAs.push(String(e));
            }
        }
        if (object.verificationMethod !== undefined &&
            object.verificationMethod !== null) {
            for (const e of object.verificationMethod) {
                message.verificationMethod.push(exports.VerificationMethod.fromJSON(e));
            }
        }
        if (object.authentication !== undefined && object.authentication !== null) {
            for (const e of object.authentication) {
                message.authentication.push(String(e));
            }
        }
        if (object.assertionMethod !== undefined &&
            object.assertionMethod !== null) {
            for (const e of object.assertionMethod) {
                message.assertionMethod.push(String(e));
            }
        }
        if (object.keyAgreement !== undefined && object.keyAgreement !== null) {
            for (const e of object.keyAgreement) {
                message.keyAgreement.push(String(e));
            }
        }
        if (object.capabilityInvocation !== undefined &&
            object.capabilityInvocation !== null) {
            for (const e of object.capabilityInvocation) {
                message.capabilityInvocation.push(String(e));
            }
        }
        if (object.capabilityDelegation !== undefined &&
            object.capabilityDelegation !== null) {
            for (const e of object.capabilityDelegation) {
                message.capabilityDelegation.push(String(e));
            }
        }
        if (object.service !== undefined && object.service !== null) {
            for (const e of object.service) {
                message.service.push(exports.Service.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.context) {
            obj.context = message.context.map((e) => e);
        }
        else {
            obj.context = [];
        }
        message.id !== undefined && (obj.id = message.id);
        if (message.controller) {
            obj.controller = message.controller.map((e) => e);
        }
        else {
            obj.controller = [];
        }
        if (message.alsoKnownAs) {
            obj.alsoKnownAs = message.alsoKnownAs.map((e) => e);
        }
        else {
            obj.alsoKnownAs = [];
        }
        if (message.verificationMethod) {
            obj.verificationMethod = message.verificationMethod.map((e) => e ? exports.VerificationMethod.toJSON(e) : undefined);
        }
        else {
            obj.verificationMethod = [];
        }
        if (message.authentication) {
            obj.authentication = message.authentication.map((e) => e);
        }
        else {
            obj.authentication = [];
        }
        if (message.assertionMethod) {
            obj.assertionMethod = message.assertionMethod.map((e) => e);
        }
        else {
            obj.assertionMethod = [];
        }
        if (message.keyAgreement) {
            obj.keyAgreement = message.keyAgreement.map((e) => e);
        }
        else {
            obj.keyAgreement = [];
        }
        if (message.capabilityInvocation) {
            obj.capabilityInvocation = message.capabilityInvocation.map((e) => e);
        }
        else {
            obj.capabilityInvocation = [];
        }
        if (message.capabilityDelegation) {
            obj.capabilityDelegation = message.capabilityDelegation.map((e) => e);
        }
        else {
            obj.capabilityDelegation = [];
        }
        if (message.service) {
            obj.service = message.service.map((e) => e ? exports.Service.toJSON(e) : undefined);
        }
        else {
            obj.service = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseDid);
        message.context = [];
        message.controller = [];
        message.alsoKnownAs = [];
        message.verificationMethod = [];
        message.authentication = [];
        message.assertionMethod = [];
        message.keyAgreement = [];
        message.capabilityInvocation = [];
        message.capabilityDelegation = [];
        message.service = [];
        if (object.context !== undefined && object.context !== null) {
            for (const e of object.context) {
                message.context.push(e);
            }
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.controller !== undefined && object.controller !== null) {
            for (const e of object.controller) {
                message.controller.push(e);
            }
        }
        if (object.alsoKnownAs !== undefined && object.alsoKnownAs !== null) {
            for (const e of object.alsoKnownAs) {
                message.alsoKnownAs.push(e);
            }
        }
        if (object.verificationMethod !== undefined &&
            object.verificationMethod !== null) {
            for (const e of object.verificationMethod) {
                message.verificationMethod.push(exports.VerificationMethod.fromPartial(e));
            }
        }
        if (object.authentication !== undefined && object.authentication !== null) {
            for (const e of object.authentication) {
                message.authentication.push(e);
            }
        }
        if (object.assertionMethod !== undefined &&
            object.assertionMethod !== null) {
            for (const e of object.assertionMethod) {
                message.assertionMethod.push(e);
            }
        }
        if (object.keyAgreement !== undefined && object.keyAgreement !== null) {
            for (const e of object.keyAgreement) {
                message.keyAgreement.push(e);
            }
        }
        if (object.capabilityInvocation !== undefined &&
            object.capabilityInvocation !== null) {
            for (const e of object.capabilityInvocation) {
                message.capabilityInvocation.push(e);
            }
        }
        if (object.capabilityDelegation !== undefined &&
            object.capabilityDelegation !== null) {
            for (const e of object.capabilityDelegation) {
                message.capabilityDelegation.push(e);
            }
        }
        if (object.service !== undefined && object.service !== null) {
            for (const e of object.service) {
                message.service.push(exports.Service.fromPartial(e));
            }
        }
        return message;
    },
};
const baseMetadata = {
    created: "",
    updated: "",
    deactivated: false,
    versionId: "",
};
exports.Metadata = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.created !== "") {
            writer.uint32(10).string(message.created);
        }
        if (message.updated !== "") {
            writer.uint32(18).string(message.updated);
        }
        if (message.deactivated === true) {
            writer.uint32(24).bool(message.deactivated);
        }
        if (message.versionId !== "") {
            writer.uint32(34).string(message.versionId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMetadata);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.created = reader.string();
                    break;
                case 2:
                    message.updated = reader.string();
                    break;
                case 3:
                    message.deactivated = reader.bool();
                    break;
                case 4:
                    message.versionId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMetadata);
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
        if (object.deactivated !== undefined && object.deactivated !== null) {
            message.deactivated = Boolean(object.deactivated);
        }
        else {
            message.deactivated = false;
        }
        if (object.versionId !== undefined && object.versionId !== null) {
            message.versionId = String(object.versionId);
        }
        else {
            message.versionId = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.created !== undefined && (obj.created = message.created);
        message.updated !== undefined && (obj.updated = message.updated);
        message.deactivated !== undefined &&
            (obj.deactivated = message.deactivated);
        message.versionId !== undefined && (obj.versionId = message.versionId);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMetadata);
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
        if (object.deactivated !== undefined && object.deactivated !== null) {
            message.deactivated = object.deactivated;
        }
        else {
            message.deactivated = false;
        }
        if (object.versionId !== undefined && object.versionId !== null) {
            message.versionId = object.versionId;
        }
        else {
            message.versionId = "";
        }
        return message;
    },
};
const baseVerificationMethod = {
    id: "",
    type: "",
    controller: "",
    publicKeyMultibase: "",
    blockchainAccountId: "",
};
exports.VerificationMethod = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.type !== "") {
            writer.uint32(18).string(message.type);
        }
        if (message.controller !== "") {
            writer.uint32(26).string(message.controller);
        }
        if (message.publicKeyMultibase !== "") {
            writer.uint32(34).string(message.publicKeyMultibase);
        }
        if (message.blockchainAccountId !== "") {
            writer.uint32(42).string(message.blockchainAccountId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseVerificationMethod);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.type = reader.string();
                    break;
                case 3:
                    message.controller = reader.string();
                    break;
                case 4:
                    message.publicKeyMultibase = reader.string();
                    break;
                case 5:
                    message.blockchainAccountId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseVerificationMethod);
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.controller !== undefined && object.controller !== null) {
            message.controller = String(object.controller);
        }
        else {
            message.controller = "";
        }
        if (object.publicKeyMultibase !== undefined &&
            object.publicKeyMultibase !== null) {
            message.publicKeyMultibase = String(object.publicKeyMultibase);
        }
        else {
            message.publicKeyMultibase = "";
        }
        if (object.blockchainAccountId !== undefined &&
            object.blockchainAccountId !== null) {
            message.blockchainAccountId = String(object.blockchainAccountId);
        }
        else {
            message.blockchainAccountId = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.type !== undefined && (obj.type = message.type);
        message.controller !== undefined && (obj.controller = message.controller);
        message.publicKeyMultibase !== undefined &&
            (obj.publicKeyMultibase = message.publicKeyMultibase);
        message.blockchainAccountId !== undefined &&
            (obj.blockchainAccountId = message.blockchainAccountId);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseVerificationMethod);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = "";
        }
        if (object.controller !== undefined && object.controller !== null) {
            message.controller = object.controller;
        }
        else {
            message.controller = "";
        }
        if (object.publicKeyMultibase !== undefined &&
            object.publicKeyMultibase !== null) {
            message.publicKeyMultibase = object.publicKeyMultibase;
        }
        else {
            message.publicKeyMultibase = "";
        }
        if (object.blockchainAccountId !== undefined &&
            object.blockchainAccountId !== null) {
            message.blockchainAccountId = object.blockchainAccountId;
        }
        else {
            message.blockchainAccountId = "";
        }
        return message;
    },
};
const baseService = { id: "", type: "", serviceEndpoint: "" };
exports.Service = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.type !== "") {
            writer.uint32(18).string(message.type);
        }
        if (message.serviceEndpoint !== "") {
            writer.uint32(26).string(message.serviceEndpoint);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseService);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.type = reader.string();
                    break;
                case 3:
                    message.serviceEndpoint = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseService);
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.serviceEndpoint !== undefined &&
            object.serviceEndpoint !== null) {
            message.serviceEndpoint = String(object.serviceEndpoint);
        }
        else {
            message.serviceEndpoint = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.type !== undefined && (obj.type = message.type);
        message.serviceEndpoint !== undefined &&
            (obj.serviceEndpoint = message.serviceEndpoint);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseService);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = "";
        }
        if (object.serviceEndpoint !== undefined &&
            object.serviceEndpoint !== null) {
            message.serviceEndpoint = object.serviceEndpoint;
        }
        else {
            message.serviceEndpoint = "";
        }
        return message;
    },
};
const baseSignInfo = { verification_method_id: "", signature: "" };
exports.SignInfo = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.verification_method_id !== "") {
            writer.uint32(10).string(message.verification_method_id);
        }
        if (message.signature !== "") {
            writer.uint32(18).string(message.signature);
        }
        if (message.clientSpec !== undefined) {
            clientSpec_1.ClientSpec.encode(message.clientSpec, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSignInfo);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.verification_method_id = reader.string();
                    break;
                case 2:
                    message.signature = reader.string();
                    break;
                case 3:
                    message.clientSpec = clientSpec_1.ClientSpec.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSignInfo);
        if (object.verification_method_id !== undefined &&
            object.verification_method_id !== null) {
            message.verification_method_id = String(object.verification_method_id);
        }
        else {
            message.verification_method_id = "";
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = String(object.signature);
        }
        else {
            message.signature = "";
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = clientSpec_1.ClientSpec.fromJSON(object.clientSpec);
        }
        else {
            message.clientSpec = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.verification_method_id !== undefined &&
            (obj.verification_method_id = message.verification_method_id);
        message.signature !== undefined && (obj.signature = message.signature);
        message.clientSpec !== undefined &&
            (obj.clientSpec = message.clientSpec
                ? clientSpec_1.ClientSpec.toJSON(message.clientSpec)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSignInfo);
        if (object.verification_method_id !== undefined &&
            object.verification_method_id !== null) {
            message.verification_method_id = object.verification_method_id;
        }
        else {
            message.verification_method_id = "";
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = object.signature;
        }
        else {
            message.signature = "";
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = clientSpec_1.ClientSpec.fromPartial(object.clientSpec);
        }
        else {
            message.clientSpec = undefined;
        }
        return message;
    },
};
const baseDidDocumentState = {};
exports.DidDocumentState = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.didDocument !== undefined) {
            exports.Did.encode(message.didDocument, writer.uint32(10).fork()).ldelim();
        }
        if (message.didDocumentMetadata !== undefined) {
            exports.Metadata.encode(message.didDocumentMetadata, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseDidDocumentState);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.didDocument = exports.Did.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.didDocumentMetadata = exports.Metadata.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseDidDocumentState);
        if (object.didDocument !== undefined && object.didDocument !== null) {
            message.didDocument = exports.Did.fromJSON(object.didDocument);
        }
        else {
            message.didDocument = undefined;
        }
        if (object.didDocumentMetadata !== undefined &&
            object.didDocumentMetadata !== null) {
            message.didDocumentMetadata = exports.Metadata.fromJSON(object.didDocumentMetadata);
        }
        else {
            message.didDocumentMetadata = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.didDocument !== undefined &&
            (obj.didDocument = message.didDocument
                ? exports.Did.toJSON(message.didDocument)
                : undefined);
        message.didDocumentMetadata !== undefined &&
            (obj.didDocumentMetadata = message.didDocumentMetadata
                ? exports.Metadata.toJSON(message.didDocumentMetadata)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseDidDocumentState);
        if (object.didDocument !== undefined && object.didDocument !== null) {
            message.didDocument = exports.Did.fromPartial(object.didDocument);
        }
        else {
            message.didDocument = undefined;
        }
        if (object.didDocumentMetadata !== undefined &&
            object.didDocumentMetadata !== null) {
            message.didDocumentMetadata = exports.Metadata.fromPartial(object.didDocumentMetadata);
        }
        else {
            message.didDocumentMetadata = undefined;
        }
        return message;
    },
};
