"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSpec = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = require("protobufjs/minimal");
exports.protobufPackage = "hypersignprotocol.hidnode.ssi";
const baseClientSpec = { type: "", adr036SignerAddress: "" };
exports.ClientSpec = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.adr036SignerAddress !== "") {
            writer.uint32(18).string(message.adr036SignerAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseClientSpec);
        while (reader.pos < end) {
            const tag = reader.uint32();
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
    fromJSON(object) {
        const message = Object.assign({}, baseClientSpec);
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
    toJSON(message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.adr036SignerAddress !== undefined &&
            (obj.adr036SignerAddress = message.adr036SignerAddress);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseClientSpec);
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
