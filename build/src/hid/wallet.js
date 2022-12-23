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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.HIDWallet = void 0;
var proto_signing_1 = require("@cosmjs/proto-signing");
var stargate_1 = require("@cosmjs/stargate");
var axios_1 = __importDefault(require("axios"));
var constants_1 = require("../constants");
var HIDWallet = /** @class */ (function () {
    function HIDWallet(_a) {
        var mnemonic = _a.mnemonic, rpc = _a.rpc;
        if (!rpc) {
            throw new Error('rpc is required');
        }
        this.rpc = rpc;
        this.mnemonic = mnemonic;
        this.account = '';
    }
    HIDWallet.prototype.createWallet = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('Createing wallet with mnemonic ', this.mnemonic);
                        if (!!this.mnemonic) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.generate()];
                    case 1:
                        _a.wallet = _c.sent();
                        this.mnemonic = this.wallet.mnemonic;
                        return [3 /*break*/, 4];
                    case 2:
                        _b = this;
                        return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(this.mnemonic)];
                    case 3:
                        _b.wallet = _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HIDWallet.prototype.encryptWalletWithPassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wallet.serialize(password)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HIDWallet.prototype.recoverWalletFromPassword = function (encryptedWalletStr, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.deserialize(encryptedWalletStr, password)];
                    case 1:
                        _a.wallet = _b.sent();
                        return [4 /*yield*/, this.setAccounts()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HIDWallet.prototype.setAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var accounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wallet.getAccounts()];
                    case 1:
                        accounts = _a.sent();
                        this.mnemonic = this.wallet.mnemonic;
                        this.account = accounts[0].address;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * step 1: Initiates the wallet
     */
    HIDWallet.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createWallet()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setAccounts()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // step2:
    HIDWallet.prototype.connectSigner = function (registry) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, stargate_1.SigningStargateClient.connectWithSigner(this.rpc, this.wallet, { registry: registry })];
                    case 1:
                        _a.client = _b.sent();
                        if (!this.client)
                            throw new Error('Client could not inistliaed');
                        return [2 /*return*/];
                }
            });
        });
    };
    HIDWallet.prototype.getFee = function () {
        return {
            amount: [
                {
                    denom: 'uatom',
                    amount: '10',
                },
            ],
            gas: '6200000',
        };
    };
    HIDWallet.prototype.signAndBroadcastMessages = function (message, fee, memo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.account || !this.client) {
                            throw new Error('Wallet is not initialize');
                        }
                        return [4 /*yield*/, this.client.signAndBroadcast(this.account, [message], fee ? fee : this.getFee(), memo)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HIDWallet.prototype.transferTokens = function (recipientAddress, amount, fee, memo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.account || !this.client) {
                            throw new Error('Wallet is not initialize');
                        }
                        return [4 /*yield*/, this.client.sendTokens(this.account, recipientAddress, amount, fee ? fee : this.getFee(), memo)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HIDWallet.prototype.fundWalletViaFaucet = function (recipientAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var faucetUrl, req_body, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        faucetUrl = 'http://localhost:4500/';
                        req_body = {
                            address: recipientAddress,
                            coins: ['20uatom'],
                        };
                        return [4 /*yield*/, axios_1.default.post(faucetUrl, req_body)];
                    case 1:
                        response = _a.sent();
                        if (response.data.error) {
                            throw new Error(response.data.error);
                        }
                        return [2 /*return*/, 'success'];
                }
            });
        });
    };
    HIDWallet.prototype.balance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(constants_1.HYPERSIGN_TESTNET_REST).concat(constants_1.HYPERSIGN_NETWORK_BANK_BALANCE_PATH).concat(this.account);
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return HIDWallet;
}());
exports.HIDWallet = HIDWallet;
