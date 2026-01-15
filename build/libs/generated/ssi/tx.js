"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgClientImpl = exports.MsgServiceName = exports.MsgUpdateCredentialStatusResponse = exports.MsgUpdateCredentialStatus = exports.MsgRegisterCredentialStatusResponse = exports.MsgRegisterCredentialStatus = exports.MsgUpdateCredentialSchemaResponse = exports.MsgUpdateCredentialSchema = exports.MsgRegisterCredentialSchemaResponse = exports.MsgRegisterCredentialSchema = exports.MsgDeactivateDIDResponse = exports.MsgDeactivateDID = exports.MsgUpdateDIDResponse = exports.MsgUpdateDID = exports.MsgRegisterDIDResponse = exports.MsgRegisterDID = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const credential_schema_1 = require("./credential_schema");
const credential_status_1 = require("./credential_status");
const did_1 = require("./did");
const proof_1 = require("./proof");
exports.protobufPackage = "hypersign.ssi.v1";
function createBaseMsgRegisterDID() {
    return {};
}
exports.MsgRegisterDID = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.didDocument !== undefined) {
            did_1.DidDocument.encode(message.didDocument, writer.uint32(10).fork()).ldelim();
        }
        if (message.didDocumentProofs !== undefined && message.didDocumentProofs.length !== 0) {
            for (const v of message.didDocumentProofs) {
                proof_1.DocumentProof.encode(v, writer.uint32(18).fork()).ldelim();
            }
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            writer.uint32(26).string(message.txAuthor);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgRegisterDID();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.didDocument = did_1.DidDocument.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    if (message.didDocumentProofs === undefined) {
                        message.didDocumentProofs = [];
                    }
                    message.didDocumentProofs.push(proof_1.DocumentProof.decode(reader, reader.uint32()));
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.txAuthor = reader.string();
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
            didDocument: isSet(object.didDocument) ? did_1.DidDocument.fromJSON(object.didDocument) : undefined,
            didDocumentProofs: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.didDocumentProofs)
                ? object.didDocumentProofs.map((e) => proof_1.DocumentProof.fromJSON(e))
                : undefined,
            txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.didDocument !== undefined) {
            obj.didDocument = did_1.DidDocument.toJSON(message.didDocument);
        }
        if ((_a = message.didDocumentProofs) === null || _a === void 0 ? void 0 : _a.length) {
            obj.didDocumentProofs = message.didDocumentProofs.map((e) => proof_1.DocumentProof.toJSON(e));
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            obj.txAuthor = message.txAuthor;
        }
        return obj;
    },
    create(base) {
        return exports.MsgRegisterDID.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgRegisterDID();
        message.didDocument = (object.didDocument !== undefined && object.didDocument !== null)
            ? did_1.DidDocument.fromPartial(object.didDocument)
            : undefined;
        message.didDocumentProofs = ((_a = object.didDocumentProofs) === null || _a === void 0 ? void 0 : _a.map((e) => proof_1.DocumentProof.fromPartial(e))) || undefined;
        message.txAuthor = (_b = object.txAuthor) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
function createBaseMsgRegisterDIDResponse() {
    return {};
}
exports.MsgRegisterDIDResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgRegisterDIDResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.MsgRegisterDIDResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseMsgRegisterDIDResponse();
        return message;
    },
};
function createBaseMsgUpdateDID() {
    return {};
}
exports.MsgUpdateDID = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.didDocument !== undefined) {
            did_1.DidDocument.encode(message.didDocument, writer.uint32(10).fork()).ldelim();
        }
        if (message.didDocumentProofs !== undefined && message.didDocumentProofs.length !== 0) {
            for (const v of message.didDocumentProofs) {
                proof_1.DocumentProof.encode(v, writer.uint32(18).fork()).ldelim();
            }
        }
        if (message.versionId !== undefined && message.versionId !== "") {
            writer.uint32(26).string(message.versionId);
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            writer.uint32(34).string(message.txAuthor);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateDID();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.didDocument = did_1.DidDocument.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    if (message.didDocumentProofs === undefined) {
                        message.didDocumentProofs = [];
                    }
                    message.didDocumentProofs.push(proof_1.DocumentProof.decode(reader, reader.uint32()));
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.versionId = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.txAuthor = reader.string();
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
            didDocument: isSet(object.didDocument) ? did_1.DidDocument.fromJSON(object.didDocument) : undefined,
            didDocumentProofs: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.didDocumentProofs)
                ? object.didDocumentProofs.map((e) => proof_1.DocumentProof.fromJSON(e))
                : undefined,
            versionId: isSet(object.versionId) ? globalThis.String(object.versionId) : undefined,
            txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.didDocument !== undefined) {
            obj.didDocument = did_1.DidDocument.toJSON(message.didDocument);
        }
        if ((_a = message.didDocumentProofs) === null || _a === void 0 ? void 0 : _a.length) {
            obj.didDocumentProofs = message.didDocumentProofs.map((e) => proof_1.DocumentProof.toJSON(e));
        }
        if (message.versionId !== undefined && message.versionId !== "") {
            obj.versionId = message.versionId;
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            obj.txAuthor = message.txAuthor;
        }
        return obj;
    },
    create(base) {
        return exports.MsgUpdateDID.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgUpdateDID();
        message.didDocument = (object.didDocument !== undefined && object.didDocument !== null)
            ? did_1.DidDocument.fromPartial(object.didDocument)
            : undefined;
        message.didDocumentProofs = ((_a = object.didDocumentProofs) === null || _a === void 0 ? void 0 : _a.map((e) => proof_1.DocumentProof.fromPartial(e))) || undefined;
        message.versionId = (_b = object.versionId) !== null && _b !== void 0 ? _b : undefined;
        message.txAuthor = (_c = object.txAuthor) !== null && _c !== void 0 ? _c : undefined;
        return message;
    },
};
function createBaseMsgUpdateDIDResponse() {
    return {};
}
exports.MsgUpdateDIDResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateDIDResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.MsgUpdateDIDResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseMsgUpdateDIDResponse();
        return message;
    },
};
function createBaseMsgDeactivateDID() {
    return {};
}
exports.MsgDeactivateDID = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.didDocumentId !== undefined && message.didDocumentId !== "") {
            writer.uint32(10).string(message.didDocumentId);
        }
        if (message.didDocumentProofs !== undefined && message.didDocumentProofs.length !== 0) {
            for (const v of message.didDocumentProofs) {
                proof_1.DocumentProof.encode(v, writer.uint32(18).fork()).ldelim();
            }
        }
        if (message.versionId !== undefined && message.versionId !== "") {
            writer.uint32(26).string(message.versionId);
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            writer.uint32(34).string(message.txAuthor);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgDeactivateDID();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.didDocumentId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    if (message.didDocumentProofs === undefined) {
                        message.didDocumentProofs = [];
                    }
                    message.didDocumentProofs.push(proof_1.DocumentProof.decode(reader, reader.uint32()));
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.versionId = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.txAuthor = reader.string();
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
            didDocumentId: isSet(object.didDocumentId) ? globalThis.String(object.didDocumentId) : undefined,
            didDocumentProofs: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.didDocumentProofs)
                ? object.didDocumentProofs.map((e) => proof_1.DocumentProof.fromJSON(e))
                : undefined,
            versionId: isSet(object.versionId) ? globalThis.String(object.versionId) : undefined,
            txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.didDocumentId !== undefined && message.didDocumentId !== "") {
            obj.didDocumentId = message.didDocumentId;
        }
        if ((_a = message.didDocumentProofs) === null || _a === void 0 ? void 0 : _a.length) {
            obj.didDocumentProofs = message.didDocumentProofs.map((e) => proof_1.DocumentProof.toJSON(e));
        }
        if (message.versionId !== undefined && message.versionId !== "") {
            obj.versionId = message.versionId;
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            obj.txAuthor = message.txAuthor;
        }
        return obj;
    },
    create(base) {
        return exports.MsgDeactivateDID.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseMsgDeactivateDID();
        message.didDocumentId = (_a = object.didDocumentId) !== null && _a !== void 0 ? _a : undefined;
        message.didDocumentProofs = ((_b = object.didDocumentProofs) === null || _b === void 0 ? void 0 : _b.map((e) => proof_1.DocumentProof.fromPartial(e))) || undefined;
        message.versionId = (_c = object.versionId) !== null && _c !== void 0 ? _c : undefined;
        message.txAuthor = (_d = object.txAuthor) !== null && _d !== void 0 ? _d : undefined;
        return message;
    },
};
function createBaseMsgDeactivateDIDResponse() {
    return {};
}
exports.MsgDeactivateDIDResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgDeactivateDIDResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.MsgDeactivateDIDResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseMsgDeactivateDIDResponse();
        return message;
    },
};
function createBaseMsgRegisterCredentialSchema() {
    return {};
}
exports.MsgRegisterCredentialSchema = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.credentialSchemaDocument !== undefined) {
            credential_schema_1.CredentialSchemaDocument.encode(message.credentialSchemaDocument, writer.uint32(10).fork()).ldelim();
        }
        if (message.credentialSchemaProof !== undefined) {
            proof_1.DocumentProof.encode(message.credentialSchemaProof, writer.uint32(18).fork()).ldelim();
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            writer.uint32(26).string(message.txAuthor);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgRegisterCredentialSchema();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.credentialSchemaDocument = credential_schema_1.CredentialSchemaDocument.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.credentialSchemaProof = proof_1.DocumentProof.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.txAuthor = reader.string();
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
                ? credential_schema_1.CredentialSchemaDocument.fromJSON(object.credentialSchemaDocument)
                : undefined,
            credentialSchemaProof: isSet(object.credentialSchemaProof)
                ? proof_1.DocumentProof.fromJSON(object.credentialSchemaProof)
                : undefined,
            txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.credentialSchemaDocument !== undefined) {
            obj.credentialSchemaDocument = credential_schema_1.CredentialSchemaDocument.toJSON(message.credentialSchemaDocument);
        }
        if (message.credentialSchemaProof !== undefined) {
            obj.credentialSchemaProof = proof_1.DocumentProof.toJSON(message.credentialSchemaProof);
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            obj.txAuthor = message.txAuthor;
        }
        return obj;
    },
    create(base) {
        return exports.MsgRegisterCredentialSchema.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgRegisterCredentialSchema();
        message.credentialSchemaDocument =
            (object.credentialSchemaDocument !== undefined && object.credentialSchemaDocument !== null)
                ? credential_schema_1.CredentialSchemaDocument.fromPartial(object.credentialSchemaDocument)
                : undefined;
        message.credentialSchemaProof =
            (object.credentialSchemaProof !== undefined && object.credentialSchemaProof !== null)
                ? proof_1.DocumentProof.fromPartial(object.credentialSchemaProof)
                : undefined;
        message.txAuthor = (_a = object.txAuthor) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseMsgRegisterCredentialSchemaResponse() {
    return {};
}
exports.MsgRegisterCredentialSchemaResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgRegisterCredentialSchemaResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.MsgRegisterCredentialSchemaResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseMsgRegisterCredentialSchemaResponse();
        return message;
    },
};
function createBaseMsgUpdateCredentialSchema() {
    return {};
}
exports.MsgUpdateCredentialSchema = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.credentialSchemaDocument !== undefined) {
            credential_schema_1.CredentialSchemaDocument.encode(message.credentialSchemaDocument, writer.uint32(10).fork()).ldelim();
        }
        if (message.credentialSchemaProof !== undefined) {
            proof_1.DocumentProof.encode(message.credentialSchemaProof, writer.uint32(18).fork()).ldelim();
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            writer.uint32(26).string(message.txAuthor);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateCredentialSchema();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.credentialSchemaDocument = credential_schema_1.CredentialSchemaDocument.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.credentialSchemaProof = proof_1.DocumentProof.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.txAuthor = reader.string();
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
                ? credential_schema_1.CredentialSchemaDocument.fromJSON(object.credentialSchemaDocument)
                : undefined,
            credentialSchemaProof: isSet(object.credentialSchemaProof)
                ? proof_1.DocumentProof.fromJSON(object.credentialSchemaProof)
                : undefined,
            txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.credentialSchemaDocument !== undefined) {
            obj.credentialSchemaDocument = credential_schema_1.CredentialSchemaDocument.toJSON(message.credentialSchemaDocument);
        }
        if (message.credentialSchemaProof !== undefined) {
            obj.credentialSchemaProof = proof_1.DocumentProof.toJSON(message.credentialSchemaProof);
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            obj.txAuthor = message.txAuthor;
        }
        return obj;
    },
    create(base) {
        return exports.MsgUpdateCredentialSchema.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgUpdateCredentialSchema();
        message.credentialSchemaDocument =
            (object.credentialSchemaDocument !== undefined && object.credentialSchemaDocument !== null)
                ? credential_schema_1.CredentialSchemaDocument.fromPartial(object.credentialSchemaDocument)
                : undefined;
        message.credentialSchemaProof =
            (object.credentialSchemaProof !== undefined && object.credentialSchemaProof !== null)
                ? proof_1.DocumentProof.fromPartial(object.credentialSchemaProof)
                : undefined;
        message.txAuthor = (_a = object.txAuthor) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseMsgUpdateCredentialSchemaResponse() {
    return {};
}
exports.MsgUpdateCredentialSchemaResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateCredentialSchemaResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.MsgUpdateCredentialSchemaResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseMsgUpdateCredentialSchemaResponse();
        return message;
    },
};
function createBaseMsgRegisterCredentialStatus() {
    return {};
}
exports.MsgRegisterCredentialStatus = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.credentialStatusDocument !== undefined) {
            credential_status_1.CredentialStatusDocument.encode(message.credentialStatusDocument, writer.uint32(10).fork()).ldelim();
        }
        if (message.credentialStatusProof !== undefined) {
            proof_1.DocumentProof.encode(message.credentialStatusProof, writer.uint32(18).fork()).ldelim();
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            writer.uint32(26).string(message.txAuthor);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgRegisterCredentialStatus();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.credentialStatusDocument = credential_status_1.CredentialStatusDocument.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.credentialStatusProof = proof_1.DocumentProof.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.txAuthor = reader.string();
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
            credentialStatusDocument: isSet(object.credentialStatusDocument)
                ? credential_status_1.CredentialStatusDocument.fromJSON(object.credentialStatusDocument)
                : undefined,
            credentialStatusProof: isSet(object.credentialStatusProof)
                ? proof_1.DocumentProof.fromJSON(object.credentialStatusProof)
                : undefined,
            txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.credentialStatusDocument !== undefined) {
            obj.credentialStatusDocument = credential_status_1.CredentialStatusDocument.toJSON(message.credentialStatusDocument);
        }
        if (message.credentialStatusProof !== undefined) {
            obj.credentialStatusProof = proof_1.DocumentProof.toJSON(message.credentialStatusProof);
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            obj.txAuthor = message.txAuthor;
        }
        return obj;
    },
    create(base) {
        return exports.MsgRegisterCredentialStatus.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgRegisterCredentialStatus();
        message.credentialStatusDocument =
            (object.credentialStatusDocument !== undefined && object.credentialStatusDocument !== null)
                ? credential_status_1.CredentialStatusDocument.fromPartial(object.credentialStatusDocument)
                : undefined;
        message.credentialStatusProof =
            (object.credentialStatusProof !== undefined && object.credentialStatusProof !== null)
                ? proof_1.DocumentProof.fromPartial(object.credentialStatusProof)
                : undefined;
        message.txAuthor = (_a = object.txAuthor) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseMsgRegisterCredentialStatusResponse() {
    return {};
}
exports.MsgRegisterCredentialStatusResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgRegisterCredentialStatusResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.MsgRegisterCredentialStatusResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseMsgRegisterCredentialStatusResponse();
        return message;
    },
};
function createBaseMsgUpdateCredentialStatus() {
    return {};
}
exports.MsgUpdateCredentialStatus = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.credentialStatusDocument !== undefined) {
            credential_status_1.CredentialStatusDocument.encode(message.credentialStatusDocument, writer.uint32(10).fork()).ldelim();
        }
        if (message.credentialStatusProof !== undefined) {
            proof_1.DocumentProof.encode(message.credentialStatusProof, writer.uint32(18).fork()).ldelim();
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            writer.uint32(26).string(message.txAuthor);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateCredentialStatus();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.credentialStatusDocument = credential_status_1.CredentialStatusDocument.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.credentialStatusProof = proof_1.DocumentProof.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.txAuthor = reader.string();
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
            credentialStatusDocument: isSet(object.credentialStatusDocument)
                ? credential_status_1.CredentialStatusDocument.fromJSON(object.credentialStatusDocument)
                : undefined,
            credentialStatusProof: isSet(object.credentialStatusProof)
                ? proof_1.DocumentProof.fromJSON(object.credentialStatusProof)
                : undefined,
            txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.credentialStatusDocument !== undefined) {
            obj.credentialStatusDocument = credential_status_1.CredentialStatusDocument.toJSON(message.credentialStatusDocument);
        }
        if (message.credentialStatusProof !== undefined) {
            obj.credentialStatusProof = proof_1.DocumentProof.toJSON(message.credentialStatusProof);
        }
        if (message.txAuthor !== undefined && message.txAuthor !== "") {
            obj.txAuthor = message.txAuthor;
        }
        return obj;
    },
    create(base) {
        return exports.MsgUpdateCredentialStatus.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgUpdateCredentialStatus();
        message.credentialStatusDocument =
            (object.credentialStatusDocument !== undefined && object.credentialStatusDocument !== null)
                ? credential_status_1.CredentialStatusDocument.fromPartial(object.credentialStatusDocument)
                : undefined;
        message.credentialStatusProof =
            (object.credentialStatusProof !== undefined && object.credentialStatusProof !== null)
                ? proof_1.DocumentProof.fromPartial(object.credentialStatusProof)
                : undefined;
        message.txAuthor = (_a = object.txAuthor) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseMsgUpdateCredentialStatusResponse() {
    return {};
}
exports.MsgUpdateCredentialStatusResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateCredentialStatusResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.MsgUpdateCredentialStatusResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseMsgUpdateCredentialStatusResponse();
        return message;
    },
};
exports.MsgServiceName = "hypersign.ssi.v1.Msg";
class MsgClientImpl {
    constructor(rpc, opts) {
        this.service = (opts === null || opts === void 0 ? void 0 : opts.service) || exports.MsgServiceName;
        this.rpc = rpc;
        this.RegisterDID = this.RegisterDID.bind(this);
        this.UpdateDID = this.UpdateDID.bind(this);
        this.DeactivateDID = this.DeactivateDID.bind(this);
        this.RegisterCredentialSchema = this.RegisterCredentialSchema.bind(this);
        this.UpdateCredentialSchema = this.UpdateCredentialSchema.bind(this);
        this.RegisterCredentialStatus = this.RegisterCredentialStatus.bind(this);
        this.UpdateCredentialStatus = this.UpdateCredentialStatus.bind(this);
    }
    RegisterDID(request) {
        const data = exports.MsgRegisterDID.encode(request).finish();
        const promise = this.rpc.request(this.service, "RegisterDID", data);
        return promise.then((data) => exports.MsgRegisterDIDResponse.decode(minimal_1.default.Reader.create(data)));
    }
    UpdateDID(request) {
        const data = exports.MsgUpdateDID.encode(request).finish();
        const promise = this.rpc.request(this.service, "UpdateDID", data);
        return promise.then((data) => exports.MsgUpdateDIDResponse.decode(minimal_1.default.Reader.create(data)));
    }
    DeactivateDID(request) {
        const data = exports.MsgDeactivateDID.encode(request).finish();
        const promise = this.rpc.request(this.service, "DeactivateDID", data);
        return promise.then((data) => exports.MsgDeactivateDIDResponse.decode(minimal_1.default.Reader.create(data)));
    }
    RegisterCredentialSchema(request) {
        const data = exports.MsgRegisterCredentialSchema.encode(request).finish();
        const promise = this.rpc.request(this.service, "RegisterCredentialSchema", data);
        return promise.then((data) => exports.MsgRegisterCredentialSchemaResponse.decode(minimal_1.default.Reader.create(data)));
    }
    UpdateCredentialSchema(request) {
        const data = exports.MsgUpdateCredentialSchema.encode(request).finish();
        const promise = this.rpc.request(this.service, "UpdateCredentialSchema", data);
        return promise.then((data) => exports.MsgUpdateCredentialSchemaResponse.decode(minimal_1.default.Reader.create(data)));
    }
    RegisterCredentialStatus(request) {
        const data = exports.MsgRegisterCredentialStatus.encode(request).finish();
        const promise = this.rpc.request(this.service, "RegisterCredentialStatus", data);
        return promise.then((data) => exports.MsgRegisterCredentialStatusResponse.decode(minimal_1.default.Reader.create(data)));
    }
    UpdateCredentialStatus(request) {
        const data = exports.MsgUpdateCredentialStatus.encode(request).finish();
        const promise = this.rpc.request(this.service, "UpdateCredentialStatus", data);
        return promise.then((data) => exports.MsgUpdateCredentialStatusResponse.decode(minimal_1.default.Reader.create(data)));
    }
}
exports.MsgClientImpl = MsgClientImpl;
function isSet(value) {
    return value !== null && value !== undefined;
}
