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
exports.HIDWallet = void 0;
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_1 = require("@cosmjs/stargate");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
class HIDWallet {
    constructor({ mnemonic, rpc }) {
        if (!rpc) {
            throw new Error('rpc is required');
        }
        this.rpc = rpc;
        this.mnemonic = mnemonic;
        this.account = '';
    }
    createWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Createing wallet with mnemonic ', this.mnemonic);
            if (!this.mnemonic) {
                this.wallet = yield proto_signing_1.DirectSecp256k1HdWallet.generate();
                this.mnemonic = this.wallet.mnemonic;
            }
            else {
                this.wallet = yield proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(this.mnemonic);
            }
        });
    }
    encryptWalletWithPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wallet.serialize(password);
        });
    }
    recoverWalletFromPassword(encryptedWalletStr, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.wallet = yield proto_signing_1.DirectSecp256k1HdWallet.deserialize(encryptedWalletStr, password);
            yield this.setAccounts();
        });
    }
    setAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.wallet.getAccounts();
            this.mnemonic = this.wallet.mnemonic;
            this.account = accounts[0].address;
        });
    }
    /**
     * step 1: Initiates the wallet
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createWallet();
            yield this.setAccounts();
        });
    }
    // step2:
    connectSigner(registry) {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = yield stargate_1.SigningStargateClient.connectWithSigner(this.rpc, this.wallet, { registry });
            if (!this.client)
                throw new Error('Client could not inistliaed');
        });
    }
    getFee() {
        return {
            amount: [
                {
                    denom: 'uatom',
                    amount: '10',
                },
            ],
            gas: '6200000',
        };
    }
    signAndBroadcastMessages(message, fee, memo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.account || !this.client) {
                throw new Error('Wallet is not initialize');
            }
            return yield this.client.signAndBroadcast(this.account, [message], fee ? fee : this.getFee(), memo);
        });
    }
    transferTokens(recipientAddress, amount, fee, memo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.account || !this.client) {
                throw new Error('Wallet is not initialize');
            }
            return yield this.client.sendTokens(this.account, recipientAddress, amount, fee ? fee : this.getFee(), memo);
        });
    }
    fundWalletViaFaucet(recipientAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const faucetUrl = 'http://localhost:4500/';
            const req_body = {
                address: recipientAddress,
                coins: ['20uatom'],
            };
            const response = yield axios_1.default.post(faucetUrl, req_body);
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            return 'success';
        });
    }
    balance() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${constants_1.HYPERSIGN_TESTNET_REST}${constants_1.HYPERSIGN_NETWORK_BANK_BALANCE_PATH}${this.account}`;
            const response = yield axios_1.default.get(url);
            return response.data;
        });
    }
}
exports.HIDWallet = HIDWallet;
