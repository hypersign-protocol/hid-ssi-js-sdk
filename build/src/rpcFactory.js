"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIDRpcFactory = void 0;
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_1 = require("@cosmjs/stargate");
const generatedProto = __importStar(require("../libs/generated/ssi/tx"));
const constants_1 = require("./constants");
class HIDRpcFactory {
    constructor() {
        this.hidRPCRegistery = new proto_signing_1.Registry(stargate_1.defaultRegistryTypes);
    }
    registerRpc(rpcName) {
        if (!rpcName || !generatedProto[rpcName]) {
            throw new Error("Invalid rpcName");
        }
        const typeUrl = `${constants_1.HID_COSMOS_MODULE}.${constants_1.HIDRpcEnums[rpcName]}`;
        this.hidRPCRegistery.register(typeUrl, generatedProto[rpcName]);
    }
}
exports.HIDRpcFactory = HIDRpcFactory;
