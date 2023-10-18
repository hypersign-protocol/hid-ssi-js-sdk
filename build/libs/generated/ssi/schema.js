"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = exports.SchemaProof = exports.SchemaProperty = exports.SchemaDocument = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = require("protobufjs/minimal");
exports.protobufPackage = "hypersignprotocol.hidnode.ssi";
const baseSchemaDocument = {
    type: "",
    modelVersion: "",
    id: "",
    name: "",
    author: "",
    authored: "",
};
exports.SchemaDocument = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.modelVersion !== "") {
            writer.uint32(18).string(message.modelVersion);
        }
        if (message.id !== "") {
            writer.uint32(26).string(message.id);
        }
        if (message.name !== "") {
            writer.uint32(34).string(message.name);
        }
        if (message.author !== "") {
            writer.uint32(42).string(message.author);
        }
        if (message.authored !== "") {
            writer.uint32(50).string(message.authored);
        }
        if (message.schema !== undefined) {
            exports.SchemaProperty.encode(message.schema, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSchemaDocument);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.modelVersion = reader.string();
                    break;
                case 3:
                    message.id = reader.string();
                    break;
                case 4:
                    message.name = reader.string();
                    break;
                case 5:
                    message.author = reader.string();
                    break;
                case 6:
                    message.authored = reader.string();
                    break;
                case 7:
                    message.schema = exports.SchemaProperty.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSchemaDocument);
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.modelVersion !== undefined && object.modelVersion !== null) {
            message.modelVersion = String(object.modelVersion);
        }
        else {
            message.modelVersion = "";
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = "";
        }
        if (object.author !== undefined && object.author !== null) {
            message.author = String(object.author);
        }
        else {
            message.author = "";
        }
        if (object.authored !== undefined && object.authored !== null) {
            message.authored = String(object.authored);
        }
        else {
            message.authored = "";
        }
        if (object.schema !== undefined && object.schema !== null) {
            message.schema = exports.SchemaProperty.fromJSON(object.schema);
        }
        else {
            message.schema = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.modelVersion !== undefined &&
            (obj.modelVersion = message.modelVersion);
        message.id !== undefined && (obj.id = message.id);
        message.name !== undefined && (obj.name = message.name);
        message.author !== undefined && (obj.author = message.author);
        message.authored !== undefined && (obj.authored = message.authored);
        message.schema !== undefined &&
            (obj.schema = message.schema
                ? exports.SchemaProperty.toJSON(message.schema)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSchemaDocument);
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = "";
        }
        if (object.modelVersion !== undefined && object.modelVersion !== null) {
            message.modelVersion = object.modelVersion;
        }
        else {
            message.modelVersion = "";
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        }
        else {
            message.name = "";
        }
        if (object.author !== undefined && object.author !== null) {
            message.author = object.author;
        }
        else {
            message.author = "";
        }
        if (object.authored !== undefined && object.authored !== null) {
            message.authored = object.authored;
        }
        else {
            message.authored = "";
        }
        if (object.schema !== undefined && object.schema !== null) {
            message.schema = exports.SchemaProperty.fromPartial(object.schema);
        }
        else {
            message.schema = undefined;
        }
        return message;
    },
};
const baseSchemaProperty = {
    schema: "",
    description: "",
    type: "",
    properties: "",
    required: "",
    additionalProperties: false,
};
exports.SchemaProperty = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.schema !== "") {
            writer.uint32(10).string(message.schema);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.type !== "") {
            writer.uint32(26).string(message.type);
        }
        if (message.properties !== "") {
            writer.uint32(34).string(message.properties);
        }
        for (const v of message.required) {
            writer.uint32(42).string(v);
        }
        if (message.additionalProperties === true) {
            writer.uint32(48).bool(message.additionalProperties);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSchemaProperty);
        message.required = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.schema = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.type = reader.string();
                    break;
                case 4:
                    message.properties = reader.string();
                    break;
                case 5:
                    message.required.push(reader.string());
                    break;
                case 6:
                    message.additionalProperties = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSchemaProperty);
        message.required = [];
        if (object.schema !== undefined && object.schema !== null) {
            message.schema = String(object.schema);
        }
        else {
            message.schema = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.properties !== undefined && object.properties !== null) {
            message.properties = String(object.properties);
        }
        else {
            message.properties = "";
        }
        if (object.required !== undefined && object.required !== null) {
            for (const e of object.required) {
                message.required.push(String(e));
            }
        }
        if (object.additionalProperties !== undefined &&
            object.additionalProperties !== null) {
            message.additionalProperties = Boolean(object.additionalProperties);
        }
        else {
            message.additionalProperties = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.schema !== undefined && (obj.schema = message.schema);
        message.description !== undefined &&
            (obj.description = message.description);
        message.type !== undefined && (obj.type = message.type);
        message.properties !== undefined && (obj.properties = message.properties);
        if (message.required) {
            obj.required = message.required.map((e) => e);
        }
        else {
            obj.required = [];
        }
        message.additionalProperties !== undefined &&
            (obj.additionalProperties = message.additionalProperties);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSchemaProperty);
        message.required = [];
        if (object.schema !== undefined && object.schema !== null) {
            message.schema = object.schema;
        }
        else {
            message.schema = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = "";
        }
        if (object.properties !== undefined && object.properties !== null) {
            message.properties = object.properties;
        }
        else {
            message.properties = "";
        }
        if (object.required !== undefined && object.required !== null) {
            for (const e of object.required) {
                message.required.push(e);
            }
        }
        if (object.additionalProperties !== undefined &&
            object.additionalProperties !== null) {
            message.additionalProperties = object.additionalProperties;
        }
        else {
            message.additionalProperties = false;
        }
        return message;
    },
};
const baseSchemaProof = {
    type: "",
    created: "",
    verificationMethod: "",
    proofPurpose: "",
    proofValue: "",
};
exports.SchemaProof = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.created !== "") {
            writer.uint32(18).string(message.created);
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
        const message = Object.assign({}, baseSchemaProof);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.created = reader.string();
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
        const message = Object.assign({}, baseSchemaProof);
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
        message.verificationMethod !== undefined &&
            (obj.verificationMethod = message.verificationMethod);
        message.proofPurpose !== undefined &&
            (obj.proofPurpose = message.proofPurpose);
        message.proofValue !== undefined && (obj.proofValue = message.proofValue);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSchemaProof);
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
const baseSchema = {
    type: "",
    modelVersion: "",
    id: "",
    name: "",
    author: "",
    authored: "",
};
exports.Schema = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.modelVersion !== "") {
            writer.uint32(18).string(message.modelVersion);
        }
        if (message.id !== "") {
            writer.uint32(26).string(message.id);
        }
        if (message.name !== "") {
            writer.uint32(34).string(message.name);
        }
        if (message.author !== "") {
            writer.uint32(42).string(message.author);
        }
        if (message.authored !== "") {
            writer.uint32(50).string(message.authored);
        }
        if (message.schema !== undefined) {
            exports.SchemaProperty.encode(message.schema, writer.uint32(58).fork()).ldelim();
        }
        if (message.proof !== undefined) {
            exports.SchemaProof.encode(message.proof, writer.uint32(66).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSchema);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.modelVersion = reader.string();
                    break;
                case 3:
                    message.id = reader.string();
                    break;
                case 4:
                    message.name = reader.string();
                    break;
                case 5:
                    message.author = reader.string();
                    break;
                case 6:
                    message.authored = reader.string();
                    break;
                case 7:
                    message.schema = exports.SchemaProperty.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.proof = exports.SchemaProof.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSchema);
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.modelVersion !== undefined && object.modelVersion !== null) {
            message.modelVersion = String(object.modelVersion);
        }
        else {
            message.modelVersion = "";
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = "";
        }
        if (object.author !== undefined && object.author !== null) {
            message.author = String(object.author);
        }
        else {
            message.author = "";
        }
        if (object.authored !== undefined && object.authored !== null) {
            message.authored = String(object.authored);
        }
        else {
            message.authored = "";
        }
        if (object.schema !== undefined && object.schema !== null) {
            message.schema = exports.SchemaProperty.fromJSON(object.schema);
        }
        else {
            message.schema = undefined;
        }
        if (object.proof !== undefined && object.proof !== null) {
            message.proof = exports.SchemaProof.fromJSON(object.proof);
        }
        else {
            message.proof = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.modelVersion !== undefined &&
            (obj.modelVersion = message.modelVersion);
        message.id !== undefined && (obj.id = message.id);
        message.name !== undefined && (obj.name = message.name);
        message.author !== undefined && (obj.author = message.author);
        message.authored !== undefined && (obj.authored = message.authored);
        message.schema !== undefined &&
            (obj.schema = message.schema
                ? exports.SchemaProperty.toJSON(message.schema)
                : undefined);
        message.proof !== undefined &&
            (obj.proof = message.proof
                ? exports.SchemaProof.toJSON(message.proof)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSchema);
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = "";
        }
        if (object.modelVersion !== undefined && object.modelVersion !== null) {
            message.modelVersion = object.modelVersion;
        }
        else {
            message.modelVersion = "";
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        }
        else {
            message.name = "";
        }
        if (object.author !== undefined && object.author !== null) {
            message.author = object.author;
        }
        else {
            message.author = "";
        }
        if (object.authored !== undefined && object.authored !== null) {
            message.authored = object.authored;
        }
        else {
            message.authored = "";
        }
        if (object.schema !== undefined && object.schema !== null) {
            message.schema = exports.SchemaProperty.fromPartial(object.schema);
        }
        else {
            message.schema = undefined;
        }
        if (object.proof !== undefined && object.proof !== null) {
            message.proof = exports.SchemaProof.fromPartial(object.proof);
        }
        else {
            message.proof = undefined;
        }
        return message;
    },
};
