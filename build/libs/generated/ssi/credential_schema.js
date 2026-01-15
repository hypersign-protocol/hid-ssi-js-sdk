"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialSchemaState = exports.CredentialSchemaProperty = exports.CredentialSchemaDocument = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const proof_1 = require("./proof");
exports.protobufPackage = "hypersign.ssi.v1";
function createBaseCredentialSchemaDocument() {
    return {};
}
exports.CredentialSchemaDocument = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message["@context"] !== undefined && message["@context"].length !== 0) {
            for (const v of message["@context"]) {
                writer.uint32(10).string(v);
            }
        }
        if (message.type !== undefined && message.type !== "") {
            writer.uint32(18).string(message.type);
        }
        if (message.modelVersion !== undefined && message.modelVersion !== "") {
            writer.uint32(26).string(message.modelVersion);
        }
        if (message.id !== undefined && message.id !== "") {
            writer.uint32(34).string(message.id);
        }
        if (message.name !== undefined && message.name !== "") {
            writer.uint32(42).string(message.name);
        }
        if (message.author !== undefined && message.author !== "") {
            writer.uint32(50).string(message.author);
        }
        if (message.authored !== undefined && message.authored !== "") {
            writer.uint32(58).string(message.authored);
        }
        if (message.schema !== undefined) {
            exports.CredentialSchemaProperty.encode(message.schema, writer.uint32(66).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCredentialSchemaDocument();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    if (message["@context"] === undefined) {
                        message["@context"] = [];
                    }
                    message["@context"].push(reader.string());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.type = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.modelVersion = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.id = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.name = reader.string();
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.author = reader.string();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.authored = reader.string();
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.schema = exports.CredentialSchemaProperty.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            "@context": globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object["@context"])
                ? object["@context"].map((e) => globalThis.String(e))
                : undefined,
            type: isSet(object.type) ? globalThis.String(object.type) : undefined,
            modelVersion: isSet(object.modelVersion) ? globalThis.String(object.modelVersion) : undefined,
            id: isSet(object.id) ? globalThis.String(object.id) : undefined,
            name: isSet(object.name) ? globalThis.String(object.name) : undefined,
            author: isSet(object.author) ? globalThis.String(object.author) : undefined,
            authored: isSet(object.authored) ? globalThis.String(object.authored) : undefined,
            schema: isSet(object.schema) ? exports.CredentialSchemaProperty.fromJSON(object.schema) : undefined,
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if ((_a = message["@context"]) === null || _a === void 0 ? void 0 : _a.length) {
            obj["@context"] = message["@context"];
        }
        if (message.type !== undefined && message.type !== "") {
            obj.type = message.type;
        }
        if (message.modelVersion !== undefined && message.modelVersion !== "") {
            obj.modelVersion = message.modelVersion;
        }
        if (message.id !== undefined && message.id !== "") {
            obj.id = message.id;
        }
        if (message.name !== undefined && message.name !== "") {
            obj.name = message.name;
        }
        if (message.author !== undefined && message.author !== "") {
            obj.author = message.author;
        }
        if (message.authored !== undefined && message.authored !== "") {
            obj.authored = message.authored;
        }
        if (message.schema !== undefined) {
            obj.schema = exports.CredentialSchemaProperty.toJSON(message.schema);
        }
        return obj;
    },
    create(base) {
        return exports.CredentialSchemaDocument.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseCredentialSchemaDocument();
        message["@context"] = ((_a = object["@context"]) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || undefined;
        message.type = (_b = object.type) !== null && _b !== void 0 ? _b : undefined;
        message.modelVersion = (_c = object.modelVersion) !== null && _c !== void 0 ? _c : undefined;
        message.id = (_d = object.id) !== null && _d !== void 0 ? _d : undefined;
        message.name = (_e = object.name) !== null && _e !== void 0 ? _e : undefined;
        message.author = (_f = object.author) !== null && _f !== void 0 ? _f : undefined;
        message.authored = (_g = object.authored) !== null && _g !== void 0 ? _g : undefined;
        message.schema = (object.schema !== undefined && object.schema !== null)
            ? exports.CredentialSchemaProperty.fromPartial(object.schema)
            : undefined;
        return message;
    },
};
function createBaseCredentialSchemaProperty() {
    return {};
}
exports.CredentialSchemaProperty = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.schema !== undefined && message.schema !== "") {
            writer.uint32(10).string(message.schema);
        }
        if (message.description !== undefined && message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.type !== undefined && message.type !== "") {
            writer.uint32(26).string(message.type);
        }
        if (message.properties !== undefined && message.properties !== "") {
            writer.uint32(34).string(message.properties);
        }
        if (message.required !== undefined && message.required.length !== 0) {
            for (const v of message.required) {
                writer.uint32(42).string(v);
            }
        }
        if (message.additionalProperties === true) {
            writer.uint32(48).bool(message.additionalProperties);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCredentialSchemaProperty();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.schema = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.description = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.type = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.properties = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    if (message.required === undefined) {
                        message.required = [];
                    }
                    message.required.push(reader.string());
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.additionalProperties = reader.bool();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            schema: isSet(object.schema) ? globalThis.String(object.schema) : undefined,
            description: isSet(object.description) ? globalThis.String(object.description) : undefined,
            type: isSet(object.type) ? globalThis.String(object.type) : undefined,
            properties: isSet(object.properties) ? globalThis.String(object.properties) : undefined,
            required: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.required)
                ? object.required.map((e) => globalThis.String(e))
                : undefined,
            additionalProperties: isSet(object.additionalProperties)
                ? globalThis.Boolean(object.additionalProperties)
                : undefined,
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.schema !== undefined && message.schema !== "") {
            obj.schema = message.schema;
        }
        if (message.description !== undefined && message.description !== "") {
            obj.description = message.description;
        }
        if (message.type !== undefined && message.type !== "") {
            obj.type = message.type;
        }
        if (message.properties !== undefined && message.properties !== "") {
            obj.properties = message.properties;
        }
        if ((_a = message.required) === null || _a === void 0 ? void 0 : _a.length) {
            obj.required = message.required;
        }
        if (message.additionalProperties === true) {
            obj.additionalProperties = message.additionalProperties;
        }
        return obj;
    },
    create(base) {
        return exports.CredentialSchemaProperty.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseCredentialSchemaProperty();
        message.schema = (_a = object.schema) !== null && _a !== void 0 ? _a : undefined;
        message.description = (_b = object.description) !== null && _b !== void 0 ? _b : undefined;
        message.type = (_c = object.type) !== null && _c !== void 0 ? _c : undefined;
        message.properties = (_d = object.properties) !== null && _d !== void 0 ? _d : undefined;
        message.required = ((_e = object.required) === null || _e === void 0 ? void 0 : _e.map((e) => e)) || undefined;
        message.additionalProperties = (_f = object.additionalProperties) !== null && _f !== void 0 ? _f : undefined;
        return message;
    },
};
function createBaseCredentialSchemaState() {
    return {};
}
exports.CredentialSchemaState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.credentialSchemaDocument !== undefined) {
            exports.CredentialSchemaDocument.encode(message.credentialSchemaDocument, writer.uint32(10).fork()).ldelim();
        }
        if (message.credentialSchemaProof !== undefined) {
            proof_1.DocumentProof.encode(message.credentialSchemaProof, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCredentialSchemaState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.credentialSchemaDocument = exports.CredentialSchemaDocument.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.credentialSchemaProof = proof_1.DocumentProof.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            credentialSchemaDocument: isSet(object.credentialSchemaDocument)
                ? exports.CredentialSchemaDocument.fromJSON(object.credentialSchemaDocument)
                : undefined,
            credentialSchemaProof: isSet(object.credentialSchemaProof)
                ? proof_1.DocumentProof.fromJSON(object.credentialSchemaProof)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.credentialSchemaDocument !== undefined) {
            obj.credentialSchemaDocument = exports.CredentialSchemaDocument.toJSON(message.credentialSchemaDocument);
        }
        if (message.credentialSchemaProof !== undefined) {
            obj.credentialSchemaProof = proof_1.DocumentProof.toJSON(message.credentialSchemaProof);
        }
        return obj;
    },
    create(base) {
        return exports.CredentialSchemaState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseCredentialSchemaState();
        message.credentialSchemaDocument =
            (object.credentialSchemaDocument !== undefined && object.credentialSchemaDocument !== null)
                ? exports.CredentialSchemaDocument.fromPartial(object.credentialSchemaDocument)
                : undefined;
        message.credentialSchemaProof =
            (object.credentialSchemaProof !== undefined && object.credentialSchemaProof !== null)
                ? proof_1.DocumentProof.fromPartial(object.credentialSchemaProof)
                : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
