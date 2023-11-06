"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidDocumentState = exports.Service = exports.VerificationMethod = exports.DidDocumentMetadata = exports.DidDocument = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "hypersign.ssi.v1";
function createBaseDidDocument() {
    return {};
}
exports.DidDocument = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message["@context"] !== undefined && message["@context"].length !== 0) {
            for (const v of message["@context"]) {
                writer.uint32(10).string(v);
            }
        }
        if (message.id !== undefined && message.id !== "") {
            writer.uint32(18).string(message.id);
        }
        if (message.controller !== undefined && message.controller.length !== 0) {
            for (const v of message.controller) {
                writer.uint32(26).string(v);
            }
        }
        if (message.alsoKnownAs !== undefined && message.alsoKnownAs.length !== 0) {
            for (const v of message.alsoKnownAs) {
                writer.uint32(34).string(v);
            }
        }
        if (message.verificationMethod !== undefined && message.verificationMethod.length !== 0) {
            for (const v of message.verificationMethod) {
                exports.VerificationMethod.encode(v, writer.uint32(42).fork()).ldelim();
            }
        }
        if (message.authentication !== undefined && message.authentication.length !== 0) {
            for (const v of message.authentication) {
                writer.uint32(50).string(v);
            }
        }
        if (message.assertionMethod !== undefined && message.assertionMethod.length !== 0) {
            for (const v of message.assertionMethod) {
                writer.uint32(58).string(v);
            }
        }
        if (message.keyAgreement !== undefined && message.keyAgreement.length !== 0) {
            for (const v of message.keyAgreement) {
                writer.uint32(66).string(v);
            }
        }
        if (message.capabilityInvocation !== undefined && message.capabilityInvocation.length !== 0) {
            for (const v of message.capabilityInvocation) {
                writer.uint32(74).string(v);
            }
        }
        if (message.capabilityDelegation !== undefined && message.capabilityDelegation.length !== 0) {
            for (const v of message.capabilityDelegation) {
                writer.uint32(82).string(v);
            }
        }
        if (message.service !== undefined && message.service.length !== 0) {
            for (const v of message.service) {
                exports.Service.encode(v, writer.uint32(90).fork()).ldelim();
            }
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDidDocument();
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
                    message.id = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    if (message.controller === undefined) {
                        message.controller = [];
                    }
                    message.controller.push(reader.string());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    if (message.alsoKnownAs === undefined) {
                        message.alsoKnownAs = [];
                    }
                    message.alsoKnownAs.push(reader.string());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    if (message.verificationMethod === undefined) {
                        message.verificationMethod = [];
                    }
                    message.verificationMethod.push(exports.VerificationMethod.decode(reader, reader.uint32()));
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    if (message.authentication === undefined) {
                        message.authentication = [];
                    }
                    message.authentication.push(reader.string());
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    if (message.assertionMethod === undefined) {
                        message.assertionMethod = [];
                    }
                    message.assertionMethod.push(reader.string());
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    if (message.keyAgreement === undefined) {
                        message.keyAgreement = [];
                    }
                    message.keyAgreement.push(reader.string());
                    continue;
                case 9:
                    if (tag !== 74) {
                        break;
                    }
                    if (message.capabilityInvocation === undefined) {
                        message.capabilityInvocation = [];
                    }
                    message.capabilityInvocation.push(reader.string());
                    continue;
                case 10:
                    if (tag !== 82) {
                        break;
                    }
                    if (message.capabilityDelegation === undefined) {
                        message.capabilityDelegation = [];
                    }
                    message.capabilityDelegation.push(reader.string());
                    continue;
                case 11:
                    if (tag !== 90) {
                        break;
                    }
                    if (message.service === undefined) {
                        message.service = [];
                    }
                    message.service.push(exports.Service.decode(reader, reader.uint32()));
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
            id: isSet(object.id) ? globalThis.String(object.id) : undefined,
            controller: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.controller)
                ? object.controller.map((e) => globalThis.String(e))
                : undefined,
            alsoKnownAs: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.alsoKnownAs)
                ? object.alsoKnownAs.map((e) => globalThis.String(e))
                : undefined,
            verificationMethod: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.verificationMethod)
                ? object.verificationMethod.map((e) => exports.VerificationMethod.fromJSON(e))
                : undefined,
            authentication: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.authentication)
                ? object.authentication.map((e) => globalThis.String(e))
                : undefined,
            assertionMethod: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.assertionMethod)
                ? object.assertionMethod.map((e) => globalThis.String(e))
                : undefined,
            keyAgreement: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.keyAgreement)
                ? object.keyAgreement.map((e) => globalThis.String(e))
                : undefined,
            capabilityInvocation: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.capabilityInvocation)
                ? object.capabilityInvocation.map((e) => globalThis.String(e))
                : undefined,
            capabilityDelegation: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.capabilityDelegation)
                ? object.capabilityDelegation.map((e) => globalThis.String(e))
                : undefined,
            service: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.service)
                ? object.service.map((e) => exports.Service.fromJSON(e))
                : undefined,
        };
    },
    toJSON(message) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const obj = {};
        if ((_a = message["@context"]) === null || _a === void 0 ? void 0 : _a.length) {
            obj["@context"] = message["@context"];
        }
        if (message.id !== undefined && message.id !== "") {
            obj.id = message.id;
        }
        if ((_b = message.controller) === null || _b === void 0 ? void 0 : _b.length) {
            obj.controller = message.controller;
        }
        if ((_c = message.alsoKnownAs) === null || _c === void 0 ? void 0 : _c.length) {
            obj.alsoKnownAs = message.alsoKnownAs;
        }
        if ((_d = message.verificationMethod) === null || _d === void 0 ? void 0 : _d.length) {
            obj.verificationMethod = message.verificationMethod.map((e) => exports.VerificationMethod.toJSON(e));
        }
        if ((_e = message.authentication) === null || _e === void 0 ? void 0 : _e.length) {
            obj.authentication = message.authentication;
        }
        if ((_f = message.assertionMethod) === null || _f === void 0 ? void 0 : _f.length) {
            obj.assertionMethod = message.assertionMethod;
        }
        if ((_g = message.keyAgreement) === null || _g === void 0 ? void 0 : _g.length) {
            obj.keyAgreement = message.keyAgreement;
        }
        if ((_h = message.capabilityInvocation) === null || _h === void 0 ? void 0 : _h.length) {
            obj.capabilityInvocation = message.capabilityInvocation;
        }
        if ((_j = message.capabilityDelegation) === null || _j === void 0 ? void 0 : _j.length) {
            obj.capabilityDelegation = message.capabilityDelegation;
        }
        if ((_k = message.service) === null || _k === void 0 ? void 0 : _k.length) {
            obj.service = message.service.map((e) => exports.Service.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return exports.DidDocument.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const message = createBaseDidDocument();
        message["@context"] = ((_a = object["@context"]) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || undefined;
        message.id = (_b = object.id) !== null && _b !== void 0 ? _b : undefined;
        message.controller = ((_c = object.controller) === null || _c === void 0 ? void 0 : _c.map((e) => e)) || undefined;
        message.alsoKnownAs = ((_d = object.alsoKnownAs) === null || _d === void 0 ? void 0 : _d.map((e) => e)) || undefined;
        message.verificationMethod = ((_e = object.verificationMethod) === null || _e === void 0 ? void 0 : _e.map((e) => exports.VerificationMethod.fromPartial(e))) || undefined;
        message.authentication = ((_f = object.authentication) === null || _f === void 0 ? void 0 : _f.map((e) => e)) || undefined;
        message.assertionMethod = ((_g = object.assertionMethod) === null || _g === void 0 ? void 0 : _g.map((e) => e)) || undefined;
        message.keyAgreement = ((_h = object.keyAgreement) === null || _h === void 0 ? void 0 : _h.map((e) => e)) || undefined;
        message.capabilityInvocation = ((_j = object.capabilityInvocation) === null || _j === void 0 ? void 0 : _j.map((e) => e)) || undefined;
        message.capabilityDelegation = ((_k = object.capabilityDelegation) === null || _k === void 0 ? void 0 : _k.map((e) => e)) || undefined;
        message.service = ((_l = object.service) === null || _l === void 0 ? void 0 : _l.map((e) => exports.Service.fromPartial(e))) || undefined;
        return message;
    },
};
function createBaseDidDocumentMetadata() {
    return {};
}
exports.DidDocumentMetadata = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.created !== undefined && message.created !== "") {
            writer.uint32(10).string(message.created);
        }
        if (message.updated !== undefined && message.updated !== "") {
            writer.uint32(18).string(message.updated);
        }
        if (message.deactivated === true) {
            writer.uint32(24).bool(message.deactivated);
        }
        if (message.versionId !== undefined && message.versionId !== "") {
            writer.uint32(34).string(message.versionId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDidDocumentMetadata();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.created = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.updated = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.deactivated = reader.bool();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.versionId = reader.string();
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
            created: isSet(object.created) ? globalThis.String(object.created) : undefined,
            updated: isSet(object.updated) ? globalThis.String(object.updated) : undefined,
            deactivated: isSet(object.deactivated) ? globalThis.Boolean(object.deactivated) : undefined,
            versionId: isSet(object.versionId) ? globalThis.String(object.versionId) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.created !== undefined && message.created !== "") {
            obj.created = message.created;
        }
        if (message.updated !== undefined && message.updated !== "") {
            obj.updated = message.updated;
        }
        if (message.deactivated === true) {
            obj.deactivated = message.deactivated;
        }
        if (message.versionId !== undefined && message.versionId !== "") {
            obj.versionId = message.versionId;
        }
        return obj;
    },
    create(base) {
        return exports.DidDocumentMetadata.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseDidDocumentMetadata();
        message.created = (_a = object.created) !== null && _a !== void 0 ? _a : undefined;
        message.updated = (_b = object.updated) !== null && _b !== void 0 ? _b : undefined;
        message.deactivated = (_c = object.deactivated) !== null && _c !== void 0 ? _c : undefined;
        message.versionId = (_d = object.versionId) !== null && _d !== void 0 ? _d : undefined;
        return message;
    },
};
function createBaseVerificationMethod() {
    return {};
}
exports.VerificationMethod = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== undefined && message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.type !== undefined && message.type !== "") {
            writer.uint32(18).string(message.type);
        }
        if (message.controller !== undefined && message.controller !== "") {
            writer.uint32(26).string(message.controller);
        }
        if (message.publicKeyMultibase !== undefined && message.publicKeyMultibase !== "") {
            writer.uint32(34).string(message.publicKeyMultibase);
        }
        if (message.blockchainAccountId !== undefined && message.blockchainAccountId !== "") {
            writer.uint32(42).string(message.blockchainAccountId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVerificationMethod();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.id = reader.string();
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
                    message.controller = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.publicKeyMultibase = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.blockchainAccountId = reader.string();
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
            id: isSet(object.id) ? globalThis.String(object.id) : undefined,
            type: isSet(object.type) ? globalThis.String(object.type) : undefined,
            controller: isSet(object.controller) ? globalThis.String(object.controller) : undefined,
            publicKeyMultibase: isSet(object.publicKeyMultibase) ? globalThis.String(object.publicKeyMultibase) : undefined,
            blockchainAccountId: isSet(object.blockchainAccountId)
                ? globalThis.String(object.blockchainAccountId)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.id !== undefined && message.id !== "") {
            obj.id = message.id;
        }
        if (message.type !== undefined && message.type !== "") {
            obj.type = message.type;
        }
        if (message.controller !== undefined && message.controller !== "") {
            obj.controller = message.controller;
        }
        if (message.publicKeyMultibase !== undefined && message.publicKeyMultibase !== "") {
            obj.publicKeyMultibase = message.publicKeyMultibase;
        }
        if (message.blockchainAccountId !== undefined && message.blockchainAccountId !== "") {
            obj.blockchainAccountId = message.blockchainAccountId;
        }
        return obj;
    },
    create(base) {
        return exports.VerificationMethod.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseVerificationMethod();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : undefined;
        message.type = (_b = object.type) !== null && _b !== void 0 ? _b : undefined;
        message.controller = (_c = object.controller) !== null && _c !== void 0 ? _c : undefined;
        message.publicKeyMultibase = (_d = object.publicKeyMultibase) !== null && _d !== void 0 ? _d : undefined;
        message.blockchainAccountId = (_e = object.blockchainAccountId) !== null && _e !== void 0 ? _e : undefined;
        return message;
    },
};
function createBaseService() {
    return {};
}
exports.Service = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== undefined && message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.type !== undefined && message.type !== "") {
            writer.uint32(18).string(message.type);
        }
        if (message.serviceEndpoint !== undefined && message.serviceEndpoint !== "") {
            writer.uint32(26).string(message.serviceEndpoint);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseService();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.id = reader.string();
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
                    message.serviceEndpoint = reader.string();
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
            id: isSet(object.id) ? globalThis.String(object.id) : undefined,
            type: isSet(object.type) ? globalThis.String(object.type) : undefined,
            serviceEndpoint: isSet(object.serviceEndpoint) ? globalThis.String(object.serviceEndpoint) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.id !== undefined && message.id !== "") {
            obj.id = message.id;
        }
        if (message.type !== undefined && message.type !== "") {
            obj.type = message.type;
        }
        if (message.serviceEndpoint !== undefined && message.serviceEndpoint !== "") {
            obj.serviceEndpoint = message.serviceEndpoint;
        }
        return obj;
    },
    create(base) {
        return exports.Service.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseService();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : undefined;
        message.type = (_b = object.type) !== null && _b !== void 0 ? _b : undefined;
        message.serviceEndpoint = (_c = object.serviceEndpoint) !== null && _c !== void 0 ? _c : undefined;
        return message;
    },
};
function createBaseDidDocumentState() {
    return {};
}
exports.DidDocumentState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.didDocument !== undefined) {
            exports.DidDocument.encode(message.didDocument, writer.uint32(10).fork()).ldelim();
        }
        if (message.didDocumentMetadata !== undefined) {
            exports.DidDocumentMetadata.encode(message.didDocumentMetadata, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDidDocumentState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.didDocument = exports.DidDocument.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.didDocumentMetadata = exports.DidDocumentMetadata.decode(reader, reader.uint32());
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
            didDocument: isSet(object.didDocument) ? exports.DidDocument.fromJSON(object.didDocument) : undefined,
            didDocumentMetadata: isSet(object.didDocumentMetadata)
                ? exports.DidDocumentMetadata.fromJSON(object.didDocumentMetadata)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.didDocument !== undefined) {
            obj.didDocument = exports.DidDocument.toJSON(message.didDocument);
        }
        if (message.didDocumentMetadata !== undefined) {
            obj.didDocumentMetadata = exports.DidDocumentMetadata.toJSON(message.didDocumentMetadata);
        }
        return obj;
    },
    create(base) {
        return exports.DidDocumentState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseDidDocumentState();
        message.didDocument = (object.didDocument !== undefined && object.didDocument !== null)
            ? exports.DidDocument.fromPartial(object.didDocument)
            : undefined;
        message.didDocumentMetadata = (object.didDocumentMetadata !== undefined && object.didDocumentMetadata !== null)
            ? exports.DidDocumentMetadata.fromPartial(object.didDocumentMetadata)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
