"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var constants = __importStar(require("./constants"));
var _a = require("base58-universal"), encode = _a.encode, decode = _a.decode;
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.checkUrl = function (url) {
        // TODO: check if the url is a valid url
        if (url.charAt(url.length - 1) === "/") {
            return url;
        }
        else {
            return (url = url + "/");
        }
    };
    Utils._encodeMbKey = function (header, key) {
        var mbKey = new Uint8Array(header.length + key.length);
        mbKey.set(header);
        mbKey.set(key, header.length);
        return "z" + encode(mbKey);
    };
    Utils._decodeMbKey = function (header, key) {
        var mbKey = new Uint8Array(key); //header + orginaley
        mbKey = mbKey.slice(header.length);
        return mbKey; //Buffer.from(mbKey).toString('base64');
    };
    Utils._decodeMbPubKey = function (header, key) {
        var mbKey = new Uint8Array(key); //header + orginaley
        mbKey = mbKey.slice(header.length);
        return "z" + encode(mbKey); //Buffer.from(mbKey).toString('base64');
    };
    // Converting 45byte public key to 48 by padding header 
    // Converting 88byte private key to 91 by padding header
    Utils.convertedStableLibKeysIntoEd25519verificationkey2020 = function (stableLibKp) {
        var result = {};
        if (stableLibKp.publicKey) {
            var stableLibPubKeyWithoutZ = stableLibKp.publicKey.substr(1);
            var stableLibPubKeyWithoutZDecode = decode(stableLibPubKeyWithoutZ);
            result['publicKeyMultibase'] = Utils._encodeMbKey(constants.KEY_HEADERS.MULTICODEC_ED25519_PUB_HEADER, stableLibPubKeyWithoutZDecode);
        }
        if (stableLibKp.privKey) {
            result['privateKeyMultibase'] = Utils._encodeMbKey(constants.KEY_HEADERS.MULTICODEC_ED25519_PRIV_HEADER, stableLibKp.privKey);
        }
        return result;
    };
    Utils.convertEd25519verificationkey2020toStableLibKeysInto = function (ed255192020VerKeys) {
        var result = {};
        if (ed255192020VerKeys.publicKey) {
            var stableLibPubKeyWithoutZ = ed255192020VerKeys.publicKey.substr(1);
            var stableLibPubKeyWithoutZDecode = decode(stableLibPubKeyWithoutZ);
            result['publicKeyMultibase'] = Utils._decodeMbPubKey(constants.KEY_HEADERS.MULTICODEC_ED25519_PUB_HEADER, stableLibPubKeyWithoutZDecode);
        }
        // privateKeyMultibase = z + encode(header+original)
        if (ed255192020VerKeys.privKey) {
            var stableLibPrivKeyWithoutZ = ed255192020VerKeys.privKey.substr(1);
            var stableLibPrivKeyWithoutZDecode = decode(stableLibPrivKeyWithoutZ);
            result['privateKeyMultibase'] = Utils._decodeMbKey(constants.KEY_HEADERS.MULTICODEC_ED25519_PRIV_HEADER, stableLibPrivKeyWithoutZDecode);
        }
        return result;
    };
    // TODO: need to find a way to make it dynamic
    Utils.getFee = function () {
        return "auto";
    };
    return Utils;
}());
exports.default = Utils;
