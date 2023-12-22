"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenesisState = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "hypersign.ssi.v1";
function createBaseGenesisState() {
    return {};
}
exports.GenesisState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.chainNamespace !== undefined && message.chainNamespace !== "") {
            writer.uint32(10).string(message.chainNamespace);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGenesisState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.chainNamespace = reader.string();
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
        return { chainNamespace: isSet(object.chainNamespace) ? globalThis.String(object.chainNamespace) : undefined };
    },
    toJSON(message) {
        const obj = {};
        if (message.chainNamespace !== undefined && message.chainNamespace !== "") {
            obj.chainNamespace = message.chainNamespace;
        }
        return obj;
    },
    create(base) {
        return exports.GenesisState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGenesisState();
        message.chainNamespace = (_a = object.chainNamespace) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
