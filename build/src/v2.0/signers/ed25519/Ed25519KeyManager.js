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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Ed25519KeyManager_signer, _Ed25519KeyManager_keypair, _Ed25519KeyManager_controller, _Ed25519KeyManager_seed;
Object.defineProperty(exports, "__esModule", { value: true });
const ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
class Ed25519KeyManager {
    constructor(params) {
        _Ed25519KeyManager_signer.set(this, null);
        _Ed25519KeyManager_keypair.set(this, void 0);
        _Ed25519KeyManager_controller.set(this, void 0);
        _Ed25519KeyManager_seed.set(this, void 0);
        __classPrivateFieldSet(this, _Ed25519KeyManager_seed, params.seed || undefined, "f");
        __classPrivateFieldSet(this, _Ed25519KeyManager_controller, params.controller || undefined, "f");
        __classPrivateFieldSet(this, _Ed25519KeyManager_keypair, undefined, "f");
    }
    initiate() {
        return __awaiter(this, void 0, void 0, function* () {
            let edKeyPair;
            if (__classPrivateFieldGet(this, _Ed25519KeyManager_seed, "f") && __classPrivateFieldGet(this, _Ed25519KeyManager_controller, "f")) {
                const seedBytes = __classPrivateFieldGet(this, _Ed25519KeyManager_seed, "f") instanceof Uint8Array ? __classPrivateFieldGet(this, _Ed25519KeyManager_seed, "f") : new Uint8Array(Buffer.from(__classPrivateFieldGet(this, _Ed25519KeyManager_seed, "f")));
                edKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate({ seed: seedBytes, id: __classPrivateFieldGet(this, _Ed25519KeyManager_controller, "f") });
            }
            else if (__classPrivateFieldGet(this, _Ed25519KeyManager_controller, "f")) {
                edKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate({ id: __classPrivateFieldGet(this, _Ed25519KeyManager_controller, "f") });
            }
            else if (__classPrivateFieldGet(this, _Ed25519KeyManager_seed, "f")) {
                const seedBytes = __classPrivateFieldGet(this, _Ed25519KeyManager_seed, "f") instanceof Uint8Array ? __classPrivateFieldGet(this, _Ed25519KeyManager_seed, "f") : new Uint8Array(Buffer.from(__classPrivateFieldGet(this, _Ed25519KeyManager_seed, "f")));
                edKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate({ seed: seedBytes });
            }
            else {
                edKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate();
            }
            __classPrivateFieldSet(this, _Ed25519KeyManager_keypair, edKeyPair, "f");
            __classPrivateFieldSet(this, _Ed25519KeyManager_signer, yield edKeyPair.signer(), "f");
            const exportedKp = yield edKeyPair.export({ publicKey: true, privateKey: true });
            delete exportedKp.privateKeyMultibase;
            return Object.assign({}, exportedKp);
        });
    }
    get signer() {
        return __classPrivateFieldGet(this, _Ed25519KeyManager_signer, "f");
    }
    get publicKeyMultibase() {
        var _a;
        return (_a = __classPrivateFieldGet(this, _Ed25519KeyManager_keypair, "f")) === null || _a === void 0 ? void 0 : _a.publicKeyMultibase;
    }
    get id() {
        var _a;
        return (_a = __classPrivateFieldGet(this, _Ed25519KeyManager_keypair, "f")) === null || _a === void 0 ? void 0 : _a.id;
    }
    get type() {
        var _a;
        return (_a = __classPrivateFieldGet(this, _Ed25519KeyManager_keypair, "f")) === null || _a === void 0 ? void 0 : _a.type;
    }
}
exports.default = Ed25519KeyManager;
_Ed25519KeyManager_signer = new WeakMap(), _Ed25519KeyManager_keypair = new WeakMap(), _Ed25519KeyManager_controller = new WeakMap(), _Ed25519KeyManager_seed = new WeakMap();
