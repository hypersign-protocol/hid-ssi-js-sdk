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
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityApiSecret = exports.createWallet = exports.makeCosmoshubPath = exports.hidNodeEp = exports.mnemonic = void 0;
const proto_signing_1 = require("@cosmjs/proto-signing");
const crypto_1 = require("@cosmjs/crypto");
exports.mnemonic = 'verify sustain lumber boat demise parade special soft bargain scout spoil there addict move badge rebuild horn achieve hollow acquire glide bundle curious present';
exports.hidNodeEp = {
    rpc: 'https://rpc.jagrat.hypersign.id',
    rest: 'https://api.jagrat.hypersign.id',
    namespace: 'testnet',
};
// export const hidNodeEp = {
//   rpc: 'http://localhost:26657',
//   rest: 'http://localhost:1317',
//   namespace: 'testnet',
// };
function makeCosmoshubPath(a) {
    return [
        crypto_1.Slip10RawIndex.hardened(44),
        crypto_1.Slip10RawIndex.hardened(118),
        crypto_1.Slip10RawIndex.hardened(0),
        crypto_1.Slip10RawIndex.normal(0),
        crypto_1.Slip10RawIndex.normal(a),
    ];
}
exports.makeCosmoshubPath = makeCosmoshubPath;
const createWallet = (mnemonic) => __awaiter(void 0, void 0, void 0, function* () {
    let options;
    if (!mnemonic) {
        return yield proto_signing_1.DirectSecp256k1HdWallet.generate(24, (options = {
            prefix: 'hid',
            hdPaths: [makeCosmoshubPath(0)],
        }));
    }
    else {
        return yield proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, (options = {
            prefix: 'hid',
            hdPaths: [makeCosmoshubPath(0)],
        }));
    }
});
exports.createWallet = createWallet;
exports.entityApiSecret = '29a393a5d70094e409824359fc5d5.befc6c6f32d622e1c29ca900299a5695251b2407ca7cf6db8e6b2569dc13f937a4b83f4fa78738715d6267d3733e4f139';
// wallet address: hid1rh5h603fv9dneqm422uvl4xk3fc77a4uheleq5
