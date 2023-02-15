"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var did_json_1 = __importDefault(require("./did.json"));
var ed25519_signature_2020_json_1 = __importDefault(require("./ed25519-signature-2020.json"));
var security_v2_json_1 = __importDefault(require("./security-v2.json"));
var credentials_json_1 = __importDefault(require("./credentials.json"));
var jsonld_1 = __importDefault(require("jsonld"));
var vc_data_integrety_json_1 = __importDefault(require("./vc-data-integrety.json"));
// Ref: https://github.com/digitalbazaar/jsonld.js/#custom-document-loader
var nodeDocumentLoader = jsonld_1.default.documentLoaders.node();
var CONTEXTS = Object.freeze({
    "https://www.w3.org/ns/did/v1": __assign({}, did_json_1.default),
    "https://w3id.org/security/suites/ed25519-2020/v1": __assign({}, ed25519_signature_2020_json_1.default),
    "https://w3id.org/security/v2": __assign({}, security_v2_json_1.default),
    "https://www.w3.org/2018/credentials/v1": __assign({}, credentials_json_1.default),
    "https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld": __assign({}, vc_data_integrety_json_1.default)
});
exports.default = (function (url, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (url in CONTEXTS) {
            return [2 /*return*/, {
                    contextUrl: null,
                    document: CONTEXTS[url],
                    documentUrl: url // this is the actual context URL after redirects
                }];
        }
        // call the default documentLoader
        return [2 /*return*/, nodeDocumentLoader(url)];
    });
}); });
