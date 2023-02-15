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
Object.defineProperty(exports, "__esModule", { value: true });
var constants = __importStar(require("./constants"));
var _a = require("base58-universal"), encode = _a.encode, decode = _a.decode;
var ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getUUID = function () {
        return __awaiter(this, void 0, void 0, function () {
            var edKeyPair, exportedKp, publicKeyMultibase1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ed25519_verification_key_2020_1.Ed25519VerificationKey2020.generate()];
                    case 1:
                        edKeyPair = _a.sent();
                        return [4 /*yield*/, edKeyPair.export({ publicKey: true })];
                    case 2:
                        exportedKp = _a.sent();
                        publicKeyMultibase1 = this.convertEd25519verificationkey2020toStableLibKeysInto({
                            publicKey: exportedKp.publicKeyMultibase,
                        }).publicKeyMultibase;
                        return [2 /*return*/, publicKeyMultibase1];
                }
            });
        });
    };
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
    Utils._bufToMultibase = function (pubKeyBuf) {
        return Utils._encodeMbKey(constants.KEY_HEADERS.MULTICODEC_ED25519_PUB_HEADER, pubKeyBuf);
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
    Utils.jsonToLdConvertor = function (json) {
        var ld = {};
        for (var key in json) {
            if (key === "context") {
                ld['@' + key] = json[key];
            }
            else {
                ld[key] = json[key];
            }
        }
        return ld;
    };
    Utils.ldToJsonConvertor = function (ld) {
        var json = {};
        for (var key in ld) {
            if (key === "@context") {
                json['context'] = ld[key];
            }
            else {
                json[key] = ld[key];
            }
        }
        return json;
    };
    // TODO: need to find a way to make it dynamic
    Utils.getFee = function () {
        return "auto";
    };
    return Utils;
}());
exports.default = Utils;
