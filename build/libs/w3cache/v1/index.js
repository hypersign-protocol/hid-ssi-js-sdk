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
const did_json_1 = __importDefault(require("./did.json"));
const ed25519_signature_2020_json_1 = __importDefault(require("./ed25519-signature-2020.json"));
const security_v2_json_1 = __importDefault(require("./security-v2.json"));
const credentials_json_1 = __importDefault(require("./credentials.json"));
const jsonld_1 = __importDefault(require("jsonld"));
const vc_data_integrety_json_1 = __importDefault(require("./vc-data-integrety.json"));
const lds_ecdsa_secp256k1_recovery2020_json_1 = __importDefault(require("./lds-ecdsa-secp256k1-recovery2020.json"));
const schema_org_json_1 = __importDefault(require("./schema_org.json"));
// Ref: https://github.com/digitalbazaar/jsonld.js/#custom-document-loader
const nodeDocumentLoader = jsonld_1.default.documentLoaders.node();
const CONTEXTS = Object.freeze({
    "https://www.w3.org/ns/did/v1": Object.assign({}, did_json_1.default),
    "https://w3id.org/security/suites/ed25519-2020/v1": Object.assign({}, ed25519_signature_2020_json_1.default),
    "https://w3id.org/security/v2": Object.assign({}, security_v2_json_1.default),
    "https://www.w3.org/2018/credentials/v1": Object.assign({}, credentials_json_1.default),
    "https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld": Object.assign({}, vc_data_integrety_json_1.default),
    "https://w3id.org/security/suites/secp256k1recovery-2020/v2": Object.assign({}, lds_ecdsa_secp256k1_recovery2020_json_1.default),
    "https://schema.org": Object.assign({}, schema_org_json_1.default)
});
exports.default = (url, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (url in CONTEXTS) {
        return {
            contextUrl: null,
            document: CONTEXTS[url],
            documentUrl: url // this is the actual context URL after redirects
        };
    }
    // call the default documentLoader    
    return nodeDocumentLoader(url);
});
