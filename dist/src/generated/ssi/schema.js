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
exports.SchemaProperty = exports.Schema = exports.protobufPackage = void 0;
/* eslint-disable */
var minimal_1 = require("protobufjs/minimal");
exports.protobufPackage = "hypersignprotocol.hidnode.ssi";
var baseSchema = {
    type: "",
    modelVersion: "",
    id: "",
    name: "",
    author: "",
    authored: "",
};
exports.Schema = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
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
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseSchema);
        while (reader.pos < end) {
            var tag = reader.uint32();
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
    fromJSON: function (object) {
        var message = __assign({}, baseSchema);
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
    toJSON: function (message) {
        var obj = {};
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
    fromPartial: function (object) {
        var message = __assign({}, baseSchema);
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
var baseSchemaProperty = {
    schema: "",
    description: "",
    type: "",
    properties: "",
    required: "",
    additionalProperties: false,
};
exports.SchemaProperty = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
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
        for (var _i = 0, _a = message.required; _i < _a.length; _i++) {
            var v = _a[_i];
            writer.uint32(42).string(v);
        }
        if (message.additionalProperties === true) {
            writer.uint32(48).bool(message.additionalProperties);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseSchemaProperty);
        message.required = [];
        while (reader.pos < end) {
            var tag = reader.uint32();
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
    fromJSON: function (object) {
        var message = __assign({}, baseSchemaProperty);
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
            for (var _i = 0, _a = object.required; _i < _a.length; _i++) {
                var e = _a[_i];
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
    toJSON: function (message) {
        var obj = {};
        message.schema !== undefined && (obj.schema = message.schema);
        message.description !== undefined &&
            (obj.description = message.description);
        message.type !== undefined && (obj.type = message.type);
        message.properties !== undefined && (obj.properties = message.properties);
        if (message.required) {
            obj.required = message.required.map(function (e) { return e; });
        }
        else {
            obj.required = [];
        }
        message.additionalProperties !== undefined &&
            (obj.additionalProperties = message.additionalProperties);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseSchemaProperty);
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
            for (var _i = 0, _a = object.required; _i < _a.length; _i++) {
                var e = _a[_i];
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
