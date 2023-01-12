"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgClientImpl = exports.MsgRegisterCredentialStatusResponse = exports.MsgRegisterCredentialStatus = exports.MsgDeactivateDIDResponse = exports.MsgDeactivateDID = exports.MsgCreateSchemaResponse = exports.MsgCreateSchema = exports.MsgUpdateDIDResponse = exports.MsgUpdateDID = exports.MsgCreateDIDResponse = exports.MsgCreateDID = exports.protobufPackage = void 0;
/* eslint-disable */
var minimal_1 = require("protobufjs/minimal");
var did_1 = require("./did");
var schema_1 = require("./schema");
var credential_1 = require("./credential");
exports.protobufPackage = "hypersignprotocol.hidnode.ssi";
var baseMsgCreateDID = { creator: "", clientSpec: "" };
exports.MsgCreateDID = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.didDocString !== undefined) {
            did_1.Did.encode(message.didDocString, writer.uint32(10).fork()).ldelim();
        }
        for (var _i = 0, _a = message.signatures; _i < _a.length; _i++) {
            var v = _a[_i];
            did_1.SignInfo.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.creator !== "") {
            writer.uint32(26).string(message.creator);
        }
        if (message.clientSpec !== "") {
            writer.uint32(34).string(message.clientSpec);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgCreateDID);
        message.signatures = [];
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.didDocString = did_1.Did.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.signatures.push(did_1.SignInfo.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.creator = reader.string();
                    break;
                case 4:
                    message.clientSpec = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMsgCreateDID);
        message.signatures = [];
        if (object.didDocString !== undefined && object.didDocString !== null) {
            message.didDocString = did_1.Did.fromJSON(object.didDocString);
        }
        else {
            message.didDocString = undefined;
        }
        if (object.signatures !== undefined && object.signatures !== null) {
            for (var _i = 0, _a = object.signatures; _i < _a.length; _i++) {
                var e = _a[_i];
                message.signatures.push(did_1.SignInfo.fromJSON(e));
            }
        }
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = "";
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = String(object.clientSpec);
        }
        else {
            message.clientSpec = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.didDocString !== undefined &&
            (obj.didDocString = message.didDocString
                ? did_1.Did.toJSON(message.didDocString)
                : undefined);
        if (message.signatures) {
            obj.signatures = message.signatures.map(function (e) {
                return e ? did_1.SignInfo.toJSON(e) : undefined;
            });
        }
        else {
            obj.signatures = [];
        }
        message.creator !== undefined && (obj.creator = message.creator);
        message.clientSpec !== undefined && (obj.clientSpec = message.clientSpec);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgCreateDID);
        message.signatures = [];
        if (object.didDocString !== undefined && object.didDocString !== null) {
            message.didDocString = did_1.Did.fromPartial(object.didDocString);
        }
        else {
            message.didDocString = undefined;
        }
        if (object.signatures !== undefined && object.signatures !== null) {
            for (var _i = 0, _a = object.signatures; _i < _a.length; _i++) {
                var e = _a[_i];
                message.signatures.push(did_1.SignInfo.fromPartial(e));
            }
        }
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = "";
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = object.clientSpec;
        }
        else {
            message.clientSpec = "";
        }
        return message;
    },
};
var baseMsgCreateDIDResponse = { id: 0 };
exports.MsgCreateDIDResponse = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.id !== 0) {
            writer.uint32(8).uint64(message.id);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgCreateDIDResponse);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMsgCreateDIDResponse);
        if (object.id !== undefined && object.id !== null) {
            message.id = Number(object.id);
        }
        else {
            message.id = 0;
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgCreateDIDResponse);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = 0;
        }
        return message;
    },
};
var baseMsgUpdateDID = {
    version_id: "",
    creator: "",
    clientSpec: "",
};
exports.MsgUpdateDID = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.didDocString !== undefined) {
            did_1.Did.encode(message.didDocString, writer.uint32(10).fork()).ldelim();
        }
        if (message.version_id !== "") {
            writer.uint32(18).string(message.version_id);
        }
        for (var _i = 0, _a = message.signatures; _i < _a.length; _i++) {
            var v = _a[_i];
            did_1.SignInfo.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.creator !== "") {
            writer.uint32(34).string(message.creator);
        }
        if (message.clientSpec !== "") {
            writer.uint32(42).string(message.clientSpec);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgUpdateDID);
        message.signatures = [];
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.didDocString = did_1.Did.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.version_id = reader.string();
                    break;
                case 3:
                    message.signatures.push(did_1.SignInfo.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.creator = reader.string();
                    break;
                case 5:
                    message.clientSpec = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMsgUpdateDID);
        message.signatures = [];
        if (object.didDocString !== undefined && object.didDocString !== null) {
            message.didDocString = did_1.Did.fromJSON(object.didDocString);
        }
        else {
            message.didDocString = undefined;
        }
        if (object.version_id !== undefined && object.version_id !== null) {
            message.version_id = String(object.version_id);
        }
        else {
            message.version_id = "";
        }
        if (object.signatures !== undefined && object.signatures !== null) {
            for (var _i = 0, _a = object.signatures; _i < _a.length; _i++) {
                var e = _a[_i];
                message.signatures.push(did_1.SignInfo.fromJSON(e));
            }
        }
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = "";
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = String(object.clientSpec);
        }
        else {
            message.clientSpec = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.didDocString !== undefined &&
            (obj.didDocString = message.didDocString
                ? did_1.Did.toJSON(message.didDocString)
                : undefined);
        message.version_id !== undefined && (obj.version_id = message.version_id);
        if (message.signatures) {
            obj.signatures = message.signatures.map(function (e) {
                return e ? did_1.SignInfo.toJSON(e) : undefined;
            });
        }
        else {
            obj.signatures = [];
        }
        message.creator !== undefined && (obj.creator = message.creator);
        message.clientSpec !== undefined && (obj.clientSpec = message.clientSpec);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgUpdateDID);
        message.signatures = [];
        if (object.didDocString !== undefined && object.didDocString !== null) {
            message.didDocString = did_1.Did.fromPartial(object.didDocString);
        }
        else {
            message.didDocString = undefined;
        }
        if (object.version_id !== undefined && object.version_id !== null) {
            message.version_id = object.version_id;
        }
        else {
            message.version_id = "";
        }
        if (object.signatures !== undefined && object.signatures !== null) {
            for (var _i = 0, _a = object.signatures; _i < _a.length; _i++) {
                var e = _a[_i];
                message.signatures.push(did_1.SignInfo.fromPartial(e));
            }
        }
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = "";
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = object.clientSpec;
        }
        else {
            message.clientSpec = "";
        }
        return message;
    },
};
var baseMsgUpdateDIDResponse = { updateId: "" };
exports.MsgUpdateDIDResponse = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.updateId !== "") {
            writer.uint32(10).string(message.updateId);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgUpdateDIDResponse);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.updateId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMsgUpdateDIDResponse);
        if (object.updateId !== undefined && object.updateId !== null) {
            message.updateId = String(object.updateId);
        }
        else {
            message.updateId = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.updateId !== undefined && (obj.updateId = message.updateId);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgUpdateDIDResponse);
        if (object.updateId !== undefined && object.updateId !== null) {
            message.updateId = object.updateId;
        }
        else {
            message.updateId = "";
        }
        return message;
    },
};
var baseMsgCreateSchema = { creator: "", clientSpec: "" };
exports.MsgCreateSchema = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.creator !== "") {
            writer.uint32(10).string(message.creator);
        }
        if (message.schemaDoc !== undefined) {
            schema_1.SchemaDocument.encode(message.schemaDoc, writer.uint32(18).fork()).ldelim();
        }
        if (message.schemaProof !== undefined) {
            schema_1.SchemaProof.encode(message.schemaProof, writer.uint32(26).fork()).ldelim();
        }
        if (message.clientSpec !== "") {
            writer.uint32(34).string(message.clientSpec);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgCreateSchema);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.schemaDoc = schema_1.SchemaDocument.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.schemaProof = schema_1.SchemaProof.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.clientSpec = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMsgCreateSchema);
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = "";
        }
        if (object.schemaDoc !== undefined && object.schemaDoc !== null) {
            message.schemaDoc = schema_1.SchemaDocument.fromJSON(object.schemaDoc);
        }
        else {
            message.schemaDoc = undefined;
        }
        if (object.schemaProof !== undefined && object.schemaProof !== null) {
            message.schemaProof = schema_1.SchemaProof.fromJSON(object.schemaProof);
        }
        else {
            message.schemaProof = undefined;
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = String(object.clientSpec);
        }
        else {
            message.clientSpec = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.schemaDoc !== undefined &&
            (obj.schemaDoc = message.schemaDoc
                ? schema_1.SchemaDocument.toJSON(message.schemaDoc)
                : undefined);
        message.schemaProof !== undefined &&
            (obj.schemaProof = message.schemaProof
                ? schema_1.SchemaProof.toJSON(message.schemaProof)
                : undefined);
        message.clientSpec !== undefined && (obj.clientSpec = message.clientSpec);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgCreateSchema);
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = "";
        }
        if (object.schemaDoc !== undefined && object.schemaDoc !== null) {
            message.schemaDoc = schema_1.SchemaDocument.fromPartial(object.schemaDoc);
        }
        else {
            message.schemaDoc = undefined;
        }
        if (object.schemaProof !== undefined && object.schemaProof !== null) {
            message.schemaProof = schema_1.SchemaProof.fromPartial(object.schemaProof);
        }
        else {
            message.schemaProof = undefined;
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = object.clientSpec;
        }
        else {
            message.clientSpec = "";
        }
        return message;
    },
};
var baseMsgCreateSchemaResponse = { id: 0 };
exports.MsgCreateSchemaResponse = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.id !== 0) {
            writer.uint32(8).uint64(message.id);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgCreateSchemaResponse);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMsgCreateSchemaResponse);
        if (object.id !== undefined && object.id !== null) {
            message.id = Number(object.id);
        }
        else {
            message.id = 0;
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgCreateSchemaResponse);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = 0;
        }
        return message;
    },
};
var baseMsgDeactivateDID = {
    creator: "",
    didId: "",
    version_id: "",
    clientSpec: "",
};
exports.MsgDeactivateDID = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.creator !== "") {
            writer.uint32(10).string(message.creator);
        }
        if (message.didId !== "") {
            writer.uint32(18).string(message.didId);
        }
        if (message.version_id !== "") {
            writer.uint32(26).string(message.version_id);
        }
        for (var _i = 0, _a = message.signatures; _i < _a.length; _i++) {
            var v = _a[_i];
            did_1.SignInfo.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.clientSpec !== "") {
            writer.uint32(42).string(message.clientSpec);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgDeactivateDID);
        message.signatures = [];
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.didId = reader.string();
                    break;
                case 3:
                    message.version_id = reader.string();
                    break;
                case 4:
                    message.signatures.push(did_1.SignInfo.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.clientSpec = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMsgDeactivateDID);
        message.signatures = [];
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = "";
        }
        if (object.didId !== undefined && object.didId !== null) {
            message.didId = String(object.didId);
        }
        else {
            message.didId = "";
        }
        if (object.version_id !== undefined && object.version_id !== null) {
            message.version_id = String(object.version_id);
        }
        else {
            message.version_id = "";
        }
        if (object.signatures !== undefined && object.signatures !== null) {
            for (var _i = 0, _a = object.signatures; _i < _a.length; _i++) {
                var e = _a[_i];
                message.signatures.push(did_1.SignInfo.fromJSON(e));
            }
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = String(object.clientSpec);
        }
        else {
            message.clientSpec = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.didId !== undefined && (obj.didId = message.didId);
        message.version_id !== undefined && (obj.version_id = message.version_id);
        if (message.signatures) {
            obj.signatures = message.signatures.map(function (e) {
                return e ? did_1.SignInfo.toJSON(e) : undefined;
            });
        }
        else {
            obj.signatures = [];
        }
        message.clientSpec !== undefined && (obj.clientSpec = message.clientSpec);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgDeactivateDID);
        message.signatures = [];
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = "";
        }
        if (object.didId !== undefined && object.didId !== null) {
            message.didId = object.didId;
        }
        else {
            message.didId = "";
        }
        if (object.version_id !== undefined && object.version_id !== null) {
            message.version_id = object.version_id;
        }
        else {
            message.version_id = "";
        }
        if (object.signatures !== undefined && object.signatures !== null) {
            for (var _i = 0, _a = object.signatures; _i < _a.length; _i++) {
                var e = _a[_i];
                message.signatures.push(did_1.SignInfo.fromPartial(e));
            }
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = object.clientSpec;
        }
        else {
            message.clientSpec = "";
        }
        return message;
    },
};
var baseMsgDeactivateDIDResponse = { id: 0 };
exports.MsgDeactivateDIDResponse = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.id !== 0) {
            writer.uint32(8).uint64(message.id);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgDeactivateDIDResponse);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMsgDeactivateDIDResponse);
        if (object.id !== undefined && object.id !== null) {
            message.id = Number(object.id);
        }
        else {
            message.id = 0;
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgDeactivateDIDResponse);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = 0;
        }
        return message;
    },
};
var baseMsgRegisterCredentialStatus = { creator: "", clientSpec: "" };
exports.MsgRegisterCredentialStatus = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.creator !== "") {
            writer.uint32(10).string(message.creator);
        }
        if (message.credentialStatus !== undefined) {
            credential_1.CredentialStatus.encode(message.credentialStatus, writer.uint32(18).fork()).ldelim();
        }
        if (message.proof !== undefined) {
            credential_1.CredentialProof.encode(message.proof, writer.uint32(26).fork()).ldelim();
        }
        if (message.clientSpec !== "") {
            writer.uint32(34).string(message.clientSpec);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgRegisterCredentialStatus);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.credentialStatus = credential_1.CredentialStatus.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.proof = credential_1.CredentialProof.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.clientSpec = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMsgRegisterCredentialStatus);
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = "";
        }
        if (object.credentialStatus !== undefined &&
            object.credentialStatus !== null) {
            message.credentialStatus = credential_1.CredentialStatus.fromJSON(object.credentialStatus);
        }
        else {
            message.credentialStatus = undefined;
        }
        if (object.proof !== undefined && object.proof !== null) {
            message.proof = credential_1.CredentialProof.fromJSON(object.proof);
        }
        else {
            message.proof = undefined;
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = String(object.clientSpec);
        }
        else {
            message.clientSpec = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.credentialStatus !== undefined &&
            (obj.credentialStatus = message.credentialStatus
                ? credential_1.CredentialStatus.toJSON(message.credentialStatus)
                : undefined);
        message.proof !== undefined &&
            (obj.proof = message.proof
                ? credential_1.CredentialProof.toJSON(message.proof)
                : undefined);
        message.clientSpec !== undefined && (obj.clientSpec = message.clientSpec);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgRegisterCredentialStatus);
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = "";
        }
        if (object.credentialStatus !== undefined &&
            object.credentialStatus !== null) {
            message.credentialStatus = credential_1.CredentialStatus.fromPartial(object.credentialStatus);
        }
        else {
            message.credentialStatus = undefined;
        }
        if (object.proof !== undefined && object.proof !== null) {
            message.proof = credential_1.CredentialProof.fromPartial(object.proof);
        }
        else {
            message.proof = undefined;
        }
        if (object.clientSpec !== undefined && object.clientSpec !== null) {
            message.clientSpec = object.clientSpec;
        }
        else {
            message.clientSpec = "";
        }
        return message;
    },
};
var baseMsgRegisterCredentialStatusResponse = { id: 0 };
exports.MsgRegisterCredentialStatusResponse = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.id !== 0) {
            writer.uint32(8).uint64(message.id);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgRegisterCredentialStatusResponse);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseMsgRegisterCredentialStatusResponse);
        if (object.id !== undefined && object.id !== null) {
            message.id = Number(object.id);
        }
        else {
            message.id = 0;
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgRegisterCredentialStatusResponse);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = 0;
        }
        return message;
    },
};
var MsgClientImpl = /** @class */ (function () {
    function MsgClientImpl(rpc) {
        this.rpc = rpc;
    }
    MsgClientImpl.prototype.CreateDID = function (request) {
        var data = exports.MsgCreateDID.encode(request).finish();
        var promise = this.rpc.request("hypersignprotocol.hidnode.ssi.Msg", "CreateDID", data);
        return promise.then(function (data) {
            return exports.MsgCreateDIDResponse.decode(new minimal_1.Reader(data));
        });
    };
    MsgClientImpl.prototype.UpdateDID = function (request) {
        var data = exports.MsgUpdateDID.encode(request).finish();
        var promise = this.rpc.request("hypersignprotocol.hidnode.ssi.Msg", "UpdateDID", data);
        return promise.then(function (data) {
            return exports.MsgUpdateDIDResponse.decode(new minimal_1.Reader(data));
        });
    };
    MsgClientImpl.prototype.CreateSchema = function (request) {
        var data = exports.MsgCreateSchema.encode(request).finish();
        var promise = this.rpc.request("hypersignprotocol.hidnode.ssi.Msg", "CreateSchema", data);
        return promise.then(function (data) {
            return exports.MsgCreateSchemaResponse.decode(new minimal_1.Reader(data));
        });
    };
    MsgClientImpl.prototype.DeactivateDID = function (request) {
        var data = exports.MsgDeactivateDID.encode(request).finish();
        var promise = this.rpc.request("hypersignprotocol.hidnode.ssi.Msg", "DeactivateDID", data);
        return promise.then(function (data) {
            return exports.MsgDeactivateDIDResponse.decode(new minimal_1.Reader(data));
        });
    };
    MsgClientImpl.prototype.RegisterCredentialStatus = function (request) {
        var data = exports.MsgRegisterCredentialStatus.encode(request).finish();
        var promise = this.rpc.request("hypersignprotocol.hidnode.ssi.Msg", "RegisterCredentialStatus", data);
        return promise.then(function (data) {
            return exports.MsgRegisterCredentialStatusResponse.decode(new minimal_1.Reader(data));
        });
    };
    return MsgClientImpl;
}());
exports.MsgClientImpl = MsgClientImpl;
var globalThis = (function () {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
// if (util.Long !== Long) {
//   util.Long = Long as any;
//   configure();
// }
