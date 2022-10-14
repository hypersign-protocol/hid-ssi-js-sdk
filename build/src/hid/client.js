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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIDClient = void 0;
var stargate_1 = require("@cosmjs/stargate");
var math_1 = require("@cosmjs/math");
var rpcFactory_1 = require("../rpcFactory");
var constants_1 = require("../constants");
var utils_1 = __importDefault(require("../utils"));
var _a = require('../constants'), HYPERSIGN_TESTNET_RPC = _a.HYPERSIGN_TESTNET_RPC, HYPERSIGN_TESTNET_REST = _a.HYPERSIGN_TESTNET_REST, HYPERSIGN_MAINNET_RPC = _a.HYPERSIGN_MAINNET_RPC, HYPERSIGN_MAINNET_REST = _a.HYPERSIGN_MAINNET_REST, HIDRpcEnums = _a.HIDRpcEnums;
var HIDClient = /** @class */ (function () {
    function HIDClient(signer, hidNodeEndpoint, // 'TEST' | 'MAIN' | <custom node url>
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
    HIDClient.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gasPrice, _a, accounts;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Object.keys(HIDRpcEnums).forEach(function (rpc) {
                            _this.registry.registerRpc(HIDRpcEnums[rpc]);
                        });
                        gasPrice = new stargate_1.GasPrice(math_1.Decimal.fromUserInput(constants_1.GAS_PRICE, constants_1.HID_DECIMAL), constants_1.HID_DNOMINATION);
                        _a = HIDClient;
                        return [4 /*yield*/, stargate_1.SigningStargateClient.connectWithSigner(HIDClient.hidNodeEndpoint, this.signer, {
                                gasPrice: gasPrice,
                                registry: this.registry.hidRPCRegistery,
                            })];
                    case 1:
                        _a.hidNodeClient = _b.sent();
                        return [4 /*yield*/, this.signer.getAccounts()];
                    case 2:
                        accounts = _b.sent();
                        HIDClient.hidWalletAddress = accounts[0].address;
                        return [2 /*return*/];
                }
            });
        });
    };
    HIDClient.getHidClient = function () {
        return HIDClient.hidNodeClient;
    };
    HIDClient.getHidWalletAddress = function () {
        return HIDClient.hidWalletAddress;
    };
    return HIDClient;
}());
exports.HIDClient = HIDClient;
