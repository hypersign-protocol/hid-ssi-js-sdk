"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIDClient = void 0;
const stargate_1 = require("@cosmjs/stargate");
const math_1 = require("@cosmjs/math");
const rpcFactory_1 = require("../rpcFactory");
const constants_1 = require("../constants");
const utils_1 = __importDefault(require("../utils"));
const { HYPERSIGN_TESTNET_RPC, HYPERSIGN_TESTNET_REST, HYPERSIGN_MAINNET_RPC, HYPERSIGN_MAINNET_REST, HIDRpcEnums, } = require('../constants');
class HIDClient {
    constructor(signer, hidNodeEndpoint, // 'TEST' | 'MAIN' | <custom node url>
    hidNodeRestEndpoint) {
        this.signer = signer;
        this.registry = new rpcFactory_1.HIDRpcFactory();
        if (!hidNodeEndpoint) {
            throw new Error("HID-SSI-SDK:: Error: HID Node enpoint must be passed. Possible values:  'TEST' | 'MAIN' | <custom node url>");
        }
        if (hidNodeEndpoint === 'TEST') {
            HIDClient.hidNodeEndpoint = utils_1.default.checkUrl(HYPERSIGN_TESTNET_RPC);
            HIDClient.hidNodeRestEndpoint = utils_1.default.checkUrl(HYPERSIGN_TESTNET_REST);
        }
        else if (hidNodeEndpoint === 'MAIN') {
            HIDClient.hidNodeEndpoint = utils_1.default.checkUrl(HYPERSIGN_MAINNET_RPC);
            HIDClient.hidNodeRestEndpoint = utils_1.default.checkUrl(HYPERSIGN_MAINNET_REST);
        }
        else {
            HIDClient.hidNodeEndpoint = utils_1.default.checkUrl(hidNodeEndpoint);
            if (!hidNodeRestEndpoint) {
                throw new Error('HID-SSI-SDK:: Error: HID node REST endpoint can not be empty for custom network');
            }
            HIDClient.hidNodeRestEndpoint = utils_1.default.checkUrl(hidNodeRestEndpoint);
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            Object.keys(HIDRpcEnums).forEach((rpc) => {
                this.registry.registerRpc(HIDRpcEnums[rpc]);
            });
            const gasPrice = new stargate_1.GasPrice(math_1.Decimal.fromUserInput(constants_1.GAS_PRICE, constants_1.HID_DECIMAL), constants_1.HID_DNOMINATION);
            HIDClient.hidNodeClient = yield stargate_1.SigningStargateClient.connectWithSigner(HIDClient.hidNodeEndpoint, this.signer, {
                gasPrice,
                registry: this.registry.hidRPCRegistery,
            });
            const accounts = yield this.signer.getAccounts();
            HIDClient.hidWalletAddress = accounts[0].address;
        });
    }
    static getHidClient() {
        return HIDClient.hidNodeClient;
    }
    static getHidWalletAddress() {
        return HIDClient.hidWalletAddress;
    }
}
exports.HIDClient = HIDClient;
