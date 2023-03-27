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
exports.ClientSpec = exports.protobufPackage = void 0;
/* eslint-disable */
var minimal_1 = require("protobufjs/minimal");
exports.protobufPackage = "hypersignprotocol.hidnode.ssi";
var baseClientSpec = { type: "", adr036SignerAddress: "" };
exports.ClientSpec = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.adr036SignerAddress !== "") {
            writer.uint32(18).string(message.adr036SignerAddress);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseClientSpec);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.adr036SignerAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseClientSpec);
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.adr036SignerAddress !== undefined &&
            object.adr036SignerAddress !== null) {
            message.adr036SignerAddress = String(object.adr036SignerAddress);
        }
        else {
            message.adr036SignerAddress = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.adr036SignerAddress !== undefined &&
            (obj.adr036SignerAddress = message.adr036SignerAddress);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseClientSpec);
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = "";
        }
        if (object.adr036SignerAddress !== undefined &&
            object.adr036SignerAddress !== null) {
            message.adr036SignerAddress = object.adr036SignerAddress;
        }
        else {
            message.adr036SignerAddress = "";
        }
        return message;
    },
};
