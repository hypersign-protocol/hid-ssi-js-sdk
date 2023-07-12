import did from './did.json'
import ed25519signature2020 from './ed25519-signature-2020.json'
import securityv2 from './security-v2.json'
import credentials from './credentials.json'
import jsonld from 'jsonld';
import dataintegrety from './vc-data-integrety.json'
import ecdsasecp2020 from './lds-ecdsa-secp256k1-recovery2020.json'
import schema_org from './schema_org.json'
// Ref: https://github.com/digitalbazaar/jsonld.js/#custom-document-loader
const nodeDocumentLoader = jsonld.documentLoaders.node();
const CONTEXTS = Object.freeze({
    "https://www.w3.org/ns/did/v1": {
        ...did
    },
    "https://w3id.org/security/suites/ed25519-2020/v1": {
        ...ed25519signature2020
    },
    "https://w3id.org/security/v2": {
        ...securityv2
    },
    "https://www.w3.org/2018/credentials/v1": {
        ...credentials
    },
    "https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld": {
        ...dataintegrety
    },
    "https://w3id.org/security/suites/secp256k1recovery-2020/v2": {
        ...ecdsasecp2020
    },
    "https://schema.org": {
        ...schema_org
    }
 
})

export default async (url, options) => {
    if (url in CONTEXTS) {
        return {
            contextUrl: null, // this is for a context via a link header
            document: CONTEXTS[url], // this is the actual document that was loaded
            documentUrl: url // this is the actual context URL after redirects
        };
    }
    // call the default documentLoader    
    return nodeDocumentLoader(url);
};



