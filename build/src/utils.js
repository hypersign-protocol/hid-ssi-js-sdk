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
const { encode, decode } = require("base58-universal");
const ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
class Utils {
    static getUUID() {
        return __awaiter(this, void 0, void 0, function* () {
            const edKeyPair = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate();
            const exportedKp = yield edKeyPair.export({ publicKey: true });
            const { publicKeyMultibase: publicKeyMultibase1 } = this.convertEd25519verificationkey2020toStableLibKeysInto({
                publicKey: exportedKp.publicKeyMultibase,
            });
            return publicKeyMultibase1;
        });
    }
    static checkUrl(url) {
        // TODO: check if the url is a valid url
        if (url.charAt(url.length - 1) === "/") {
            return url;
        }
        else {
            return (url = url + "/");
        }
    }
    static _encodeMbKey(header, key) {
        const mbKey = new Uint8Array(header.length + key.length);
        mbKey.set(header);
        mbKey.set(key, header.length);
        return "z" + encode(mbKey);
    }
    static _decodeMbKey(header, key) {
        let mbKey = new Uint8Array(key); //header + orginaley
        mbKey = mbKey.slice(header.length);
        return mbKey; //Buffer.from(mbKey).toString('base64');
    }
    static _decodeMbPubKey(header, key) {
        let mbKey = new Uint8Array(key); //header + orginaley
        mbKey = mbKey.slice(header.length);
        return "z" + encode(mbKey); //Buffer.from(mbKey).toString('base64');
    }
    static _bufToMultibase(pubKeyBuf) {
        return "z" + encode(pubKeyBuf);
    }
    // Converting 45byte public key to 48 by padding header 
    // Converting 88byte private key to 91 by padding header
    static convertedStableLibKeysIntoEd25519verificationkey2020(stableLibKp) {
        const result = {};
        if (stableLibKp.publicKey) {
            const stableLibPubKeyWithoutZ = stableLibKp.publicKey.substr(1);
            const stableLibPubKeyWithoutZDecode = decode(stableLibPubKeyWithoutZ);
            result['publicKeyMultibase'] = Utils._encodeMbKey(constants.KEY_HEADERS.MULTICODEC_ED25519_PUB_HEADER, stableLibPubKeyWithoutZDecode);
        }
        if (stableLibKp.privKey) {
            result['privateKeyMultibase'] = Utils._encodeMbKey(constants.KEY_HEADERS.MULTICODEC_ED25519_PRIV_HEADER, stableLibKp.privKey);
        }
        return result;
    }
    static convertEd25519verificationkey2020toStableLibKeysInto(ed255192020VerKeys) {
        const result = {};
        if (ed255192020VerKeys.publicKey) {
            const stableLibPubKeyWithoutZ = ed255192020VerKeys.publicKey.substr(1);
            const stableLibPubKeyWithoutZDecode = decode(stableLibPubKeyWithoutZ);
            result['publicKeyMultibase'] = Utils._decodeMbPubKey(constants.KEY_HEADERS.MULTICODEC_ED25519_PUB_HEADER, stableLibPubKeyWithoutZDecode);
        }
        // privateKeyMultibase = z + encode(header+original)
        if (ed255192020VerKeys.privKey) {
            const stableLibPrivKeyWithoutZ = ed255192020VerKeys.privKey.substr(1);
            const stableLibPrivKeyWithoutZDecode = decode(stableLibPrivKeyWithoutZ);
            result['privateKeyMultibase'] = Utils._decodeMbKey(constants.KEY_HEADERS.MULTICODEC_ED25519_PRIV_HEADER, stableLibPrivKeyWithoutZDecode);
        }
        return result;
    }
    static jsonToLdConvertor(json) {
        const ld = {};
        for (const key in json) {
            if (key === "context") {
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
            if (key === "@context") {
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
        return "auto";
    }
}
exports.default = Utils;
