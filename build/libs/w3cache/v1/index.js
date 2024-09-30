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
const x25519_key_agreement_2020_v1_json_1 = __importDefault(require("./x25519-key-agreement-2020-v1.json"));
const X25519KeyAgreementKeyEIP5630_json_1 = __importDefault(require("./X25519KeyAgreementKeyEIP5630.json"));
const credentialStatus_json_1 = __importDefault(require("./credentialStatus.json"));
const credential_schema_json_1 = __importDefault(require("./credential_schema.json"));
const hypersignCredentialStatus2023_json_1 = __importDefault(require("./hypersignCredentialStatus2023.json"));
// Ref: https://github.com/digitalbazaar/jsonld.js/#custom-document-loader
let nodeDocumentLoader;
if (typeof window === 'undefined') {
    nodeDocumentLoader = jsonld_1.default.documentLoaders.node;
}
else {
    nodeDocumentLoader = jsonld_1.default.documentLoaders.xhr;
}
const did_wellknown_json_1 = __importDefault(require("./did-wellknown.json"));
const CONTEXTS = Object.freeze({
    'https://www.w3.org/ns/did/v1': Object.assign({}, did_json_1.default),
    'https://w3id.org/security/suites/ed25519-2020/v1': Object.assign({}, ed25519_signature_2020_json_1.default),
    'https://w3id.org/security/v2': Object.assign({}, security_v2_json_1.default),
    'https://www.w3.org/2018/credentials/v1': Object.assign({}, credentials_json_1.default),
    'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld': Object.assign({}, vc_data_integrety_json_1.default),
    'https://w3id.org/security/suites/secp256k1recovery-2020/v2': Object.assign({}, lds_ecdsa_secp256k1_recovery2020_json_1.default),
    'https://schema.org': Object.assign({}, schema_org_json_1.default),
    'https://ns.did.ai/suites/x25519-2020/v1': Object.assign({}, x25519_key_agreement_2020_v1_json_1.default),
    'https://identity.foundation/.well-known/did-configuration/v1': Object.assign({}, did_wellknown_json_1.default),
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BabyJubJubKey2021.jsonld': {
        '@context': {
            id: '@id',
            type: '@type',
            '@protected': true,
            'hypersign-vocab': 'urn:uuid:13fe9318-bb82-4d95-8bf5-8e7fdf8b2026#',
            BabyJubJubKey2021: {
                '@id': 'hypersign-vocab:BabyJubJubKey2021',
                '@context': {
                    id: '@id',
                    type: '@type',
                    controller: {
                        '@id': 'https://w3id.org/security#controller',
                        '@type': '@id',
                    },
                    publicKeyMultibase: {
                        '@id': 'https://w3id.org/security#publicKeyMultibase',
                        '@type': 'https://w3id.org/security#multibase',
                    },
                },
            },
        },
    },
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/X25519KeyAgreementKeyEIP5630.jsonld': Object.assign({}, X25519KeyAgreementKeyEIP5630_json_1.default),
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialStatus.jsonld': Object.assign({}, credentialStatus_json_1.default),
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialSchema.jsonld': Object.assign({}, credential_schema_json_1.default),
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld': Object.assign({}, hypersignCredentialStatus2023_json_1.default),
    'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BJJSignature2021.jsonld': {
        '@context': {
            '@version': 1.1,
            id: '@id',
            type: '@type',
            proof: {
                '@id': 'https://w3id.org/security#proof',
                '@type': '@id',
                '@container': '@graph',
            },
            BJJSignature2021: {
                '@id': 'https://w3id.org/security#BJJSignature2021',
                '@context': {
                    '@version': 1.1,
                    '@protected': true,
                    id: '@id',
                    type: '@type',
                    challenge: 'https://w3id.org/security#challenge',
                    created: {
                        '@id': 'http://purl.org/dc/terms/created',
                        '@type': 'http://www.w3.org/2001/XMLSchema#dateTime',
                    },
                    domain: 'https://w3id.org/security#domain',
                    proofValue: 'https://w3id.org/security#proofValue',
                    credentialRoot: 'https://w3id.org/security#credentialRoot',
                    nonce: 'https://w3id.org/security#nonce',
                    proofPurpose: {
                        '@id': 'https://w3id.org/security#proofPurpose',
                        '@type': '@vocab',
                        '@context': {
                            '@version': 1.1,
                            '@protected': true,
                            id: '@id',
                            type: '@type',
                            assertionMethod: {
                                '@id': 'https://w3id.org/security#assertionMethod',
                                '@type': '@id',
                                '@container': '@set',
                            },
                            authentication: {
                                '@id': 'https://w3id.org/security#authenticationMethod',
                                '@type': '@id',
                                '@container': '@set',
                            },
                        },
                    },
                    verificationMethod: {
                        '@id': 'https://w3id.org/security#verificationMethod',
                        '@type': '@id',
                    },
                },
            },
            BabyJubJubSignatureProof2021: {
                '@id': 'https://w3id.org/security#BabyJubJubSignatureProof2021',
                '@context': {
                    '@version': 1.1,
                    '@protected': true,
                    id: '@id',
                    type: '@type',
                    challenge: 'https://w3id.org/security#challenge',
                    created: {
                        '@id': 'http://purl.org/dc/terms/created',
                        '@type': 'http://www.w3.org/2001/XMLSchema#dateTime',
                    },
                    domain: 'https://w3id.org/security#domain',
                    nonce: 'https://w3id.org/security#nonce',
                    proofPurpose: {
                        '@id': 'https://w3id.org/security#proofPurpose',
                        '@type': '@vocab',
                        '@context': {
                            '@version': 1.1,
                            '@protected': true,
                            id: '@id',
                            type: '@type',
                            sec: 'https://w3id.org/security#',
                            assertionMethod: {
                                '@id': 'https://w3id.org/security#assertionMethod',
                                '@type': '@id',
                                '@container': '@set',
                            },
                            authentication: {
                                '@id': 'https://w3id.org/security#authenticationMethod',
                                '@type': '@id',
                                '@container': '@set',
                            },
                        },
                    },
                    proofValue: 'https://w3id.org/security#proofValue',
                    credentialRoot: 'https://w3id.org/security#credentialRoot',
                    verificationMethod: {
                        '@id': 'https://w3id.org/security#verificationMethod',
                        '@type': '@id',
                    },
                },
            },
        },
    },
});
exports.default = (url, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (url in CONTEXTS) {
        return {
            contextUrl: null,
            document: CONTEXTS[url],
            documentUrl: url, // this is the actual context URL after redirects
        };
    }
    // call the default documentLoader
    return nodeDocumentLoader(url);
});
