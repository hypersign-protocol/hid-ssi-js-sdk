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
exports.MsgClientImpl = exports.MsgDeactivateDIDResponse = exports.MsgDeactivateDID = exports.MsgCreateSchemaResponse = exports.MsgCreateSchema = exports.MsgUpdateDIDResponse = exports.MsgUpdateDID = exports.MsgCreateDIDResponse = exports.MsgCreateDID = exports.protobufPackage = void 0;
/* eslint-disable */
var minimal_1 = require("protobufjs/minimal");
var did_1 = require("./did");
var schema_1 = require("./schema");
exports.protobufPackage = "hypersignprotocol.hidnode.ssi";
var baseMsgCreateDID = { creator: "" };
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
var baseMsgUpdateDID = { versionId: "", creator: "" };
exports.MsgUpdateDID = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.didDocString !== undefined) {
            did_1.Did.encode(message.didDocString, writer.uint32(10).fork()).ldelim();
        }
        if (message.versionId !== "") {
            writer.uint32(18).string(message.versionId);
        }
        for (var _i = 0, _a = message.signatures; _i < _a.length; _i++) {
            var v = _a[_i];
            did_1.SignInfo.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.creator !== "") {
            writer.uint32(34).string(message.creator);
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
                    message.versionId = reader.string();
                    break;
                case 3:
                    message.signatures.push(did_1.SignInfo.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.creator = reader.string();
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
        if (object.versionId !== undefined && object.versionId !== null) {
            message.versionId = String(object.versionId);
        }
        else {
            message.versionId = "";
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
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.didDocString !== undefined &&
            (obj.didDocString = message.didDocString
                ? did_1.Did.toJSON(message.didDocString)
                : undefined);
        message.versionId !== undefined && (obj.versionId = message.versionId);
        if (message.signatures) {
            obj.signatures = message.signatures.map(function (e) {
                return e ? did_1.SignInfo.toJSON(e) : undefined;
            });
        }
        else {
            obj.signatures = [];
        }
        message.creator !== undefined && (obj.creator = message.creator);
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
        if (object.versionId !== undefined && object.versionId !== null) {
            message.versionId = object.versionId;
        }
        else {
            message.versionId = "";
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
var baseMsgCreateSchema = { creator: "" };
exports.MsgCreateSchema = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.creator !== "") {
            writer.uint32(10).string(message.creator);
        }
        if (message.schema !== undefined) {
            schema_1.Schema.encode(message.schema, writer.uint32(18).fork()).ldelim();
        }
        for (var _i = 0, _a = message.signatures; _i < _a.length; _i++) {
            var v = _a[_i];
            did_1.SignInfo.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMsgCreateSchema);
        message.signatures = [];
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.schema = schema_1.Schema.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.signatures.push(did_1.SignInfo.decode(reader, reader.uint32()));
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
        message.signatures = [];
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = "";
        }
        if (object.schema !== undefined && object.schema !== null) {
            message.schema = schema_1.Schema.fromJSON(object.schema);
        }
        else {
            message.schema = undefined;
        }
        if (object.signatures !== undefined && object.signatures !== null) {
            for (var _i = 0, _a = object.signatures; _i < _a.length; _i++) {
                var e = _a[_i];
                message.signatures.push(did_1.SignInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.schema !== undefined &&
            (obj.schema = message.schema ? schema_1.Schema.toJSON(message.schema) : undefined);
        if (message.signatures) {
            obj.signatures = message.signatures.map(function (e) {
                return e ? did_1.SignInfo.toJSON(e) : undefined;
            });
        }
        else {
            obj.signatures = [];
        }
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMsgCreateSchema);
        message.signatures = [];
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = "";
        }
        if (object.schema !== undefined && object.schema !== null) {
            message.schema = schema_1.Schema.fromPartial(object.schema);
        }
        else {
            message.schema = undefined;
        }
        if (object.signatures !== undefined && object.signatures !== null) {
            for (var _i = 0, _a = object.signatures; _i < _a.length; _i++) {
                var e = _a[_i];
                message.signatures.push(did_1.SignInfo.fromPartial(e));
            }
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
var baseMsgDeactivateDID = { creator: "", versionId: "" };
exports.MsgDeactivateDID = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.creator !== "") {
            writer.uint32(10).string(message.creator);
        }
        if (message.didDocString !== undefined) {
            did_1.Did.encode(message.didDocString, writer.uint32(18).fork()).ldelim();
        }
        if (message.versionId !== "") {
            writer.uint32(26).string(message.versionId);
        }
        for (var _i = 0, _a = message.signatures; _i < _a.length; _i++) {
            var v = _a[_i];
            did_1.SignInfo.encode(v, writer.uint32(34).fork()).ldelim();
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
                    message.didDocString = did_1.Did.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.versionId = reader.string();
                    break;
                case 4:
                    message.signatures.push(did_1.SignInfo.decode(reader, reader.uint32()));
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
        if (object.didDocString !== undefined && object.didDocString !== null) {
            message.didDocString = did_1.Did.fromJSON(object.didDocString);
        }
        else {
            message.didDocString = undefined;
        }
        if (object.versionId !== undefined && object.versionId !== null) {
            message.versionId = String(object.versionId);
        }
        else {
            message.versionId = "";
        }
        if (object.signatures !== undefined && object.signatures !== null) {
            for (var _i = 0, _a = object.signatures; _i < _a.length; _i++) {
                var e = _a[_i];
                message.signatures.push(did_1.SignInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.didDocString !== undefined &&
            (obj.didDocString = message.didDocString
                ? did_1.Did.toJSON(message.didDocString)
                : undefined);
        message.versionId !== undefined && (obj.versionId = message.versionId);
        if (message.signatures) {
            obj.signatures = message.signatures.map(function (e) {
                return e ? did_1.SignInfo.toJSON(e) : undefined;
            });
        }
        else {
            obj.signatures = [];
        }
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
        if (object.didDocString !== undefined && object.didDocString !== null) {
            message.didDocString = did_1.Did.fromPartial(object.didDocString);
        }
        else {
            message.didDocString = undefined;
        }
        if (object.versionId !== undefined && object.versionId !== null) {
            message.versionId = object.versionId;
        }
        else {
            message.versionId = "";
        }
        if (object.signatures !== undefined && object.signatures !== null) {
            for (var _i = 0, _a = object.signatures; _i < _a.length; _i++) {
                var e = _a[_i];
                message.signatures.push(did_1.SignInfo.fromPartial(e));
            }
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
// if (true) {
//   util.Long = Long as any;
//   configure();
// }
