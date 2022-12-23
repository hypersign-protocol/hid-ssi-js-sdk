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
var proto_signing_1 = require("@cosmjs/proto-signing");
var stargate_1 = require("@cosmjs/stargate");
var generatedProto = __importStar(require("./generated/ssi/tx"));
var constants_1 = require("./constants");
var HIDRpcFactory = /** @class */ (function () {
    function HIDRpcFactory() {
        this.hidRPCRegistery = new proto_signing_1.Registry(stargate_1.defaultRegistryTypes);
    }
    HIDRpcFactory.prototype.registerRpc = function (rpcName) {
        if (!rpcName || !generatedProto[rpcName]) {
            throw new Error("Invalid rpcName");
        }
        var typeUrl = "".concat(constants_1.HID_COSMOS_MODULE, ".").concat(constants_1.HIDRpcEnums[rpcName]);
        this.hidRPCRegistery.register(typeUrl, generatedProto[rpcName]);
    };
    return HIDRpcFactory;
}());
exports.HIDRpcFactory = HIDRpcFactory;
