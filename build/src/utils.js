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
const constants = __importStar(require("./constants"));
const { encode, decode } = require('base58-universal');
const ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
class Utils {
    static getUUID() {
        return __awaiter(this, void 0, void 0, function* () {
            const edKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate();
            const exportedKp = yield edKeyPair.export({ publicKey: true });
            return exportedKp.publicKeyMultibase;
        });
    }
    static checkUrl(url) {
        // TODO: check if the url is a valid url
        if (url.charAt(url.length - 1) === '/') {
            return url;
        }
        else {
            return (url = url + '/');
        }
    }
    static _encodeMbKey(header, key) {
        const mbKey = new Uint8Array(header.length + key.length);
        mbKey.set(header);
        mbKey.set(key, header.length);
        return 'z' + encode(mbKey);
    }
    static _decodeMbKey(header, key) {
        let mbKey = new Uint8Array(key); //header + orginaley
        mbKey = mbKey.slice(header.length);
        return mbKey; //Buffer.from(mbKey).toString('base64');
    }
    static _decodeMbPubKey(header, key) {
        let mbKey = new Uint8Array(key); //header + orginaley
        mbKey = mbKey.slice(header.length);
        return 'z' + encode(mbKey); //Buffer.from(mbKey).toString('base64');
    }
    static _bufToMultibase(pubKeyBuf) {
        return 'z' + encode(pubKeyBuf);
    }
    static jsonToLdConvertor(json) {
        const ld = {};
        for (const key in json) {
            if (key === 'context') {
                ld['@' + key] = json[key];
            }
            else {
                ld[key] = json[key];
            }
        }
        return ld;
    }
    static ldToJsonConvertor(ld) {
        const json = {};
        for (const key in ld) {
            if (key === '@context') {
                json['context'] = ld[key];
            }
            else {
                json[key] = ld[key];
            }
        }
        return json;
    }
    // TODO: need to find a way to make it dynamic
    static getFee() {
        return 'auto';
    }
    static removeEmptyString(obj) {
        if (Array.isArray(obj)) {
            for (let i = obj.length - 1; i >= 0; i--) {
                if (obj[i] === '' || (typeof obj[i] === 'object' && Object.keys(obj[i]).length === 0)) {
                    obj.splice(i, 1);
                }
                else if (typeof obj[i] === 'object') {
                    this.removeEmptyString(obj[i]);
                }
            }
        }
        else if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (obj[key] === '') {
                        delete obj[key];
                    }
                    else if (Array.isArray(obj[key])) {
                        this.removeEmptyString(obj[key]);
                    }
                    else if (typeof obj[key] === 'object') {
                        this.removeEmptyString(obj[key]);
                    }
                }
            }
        }
        return obj;
    }
    static fetchFee(methodName, baseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = constants.GAS_FEE_API_URL(baseUrl);
            const feeStructure = yield fetch(url);
            const fee = yield feeStructure.json();
            if (fee && fee[methodName]) {
                const amount = fee[methodName].amount;
                return amount;
            }
            else {
                throw new Error(`Fee not found for method: ${methodName}`);
            }
        });
    }
}
exports.default = Utils;
