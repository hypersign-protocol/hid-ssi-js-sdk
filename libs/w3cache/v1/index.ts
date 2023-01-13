import did from './did.json'
import ed25519signature2020 from './ed25519-signature-2020.json'
import securityv2  from './security-v2.json'
import credentials from './credentials.json'
import jsonld from 'jsonld';

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
    }
})

export default async (url, options) => {
    if(url in CONTEXTS) {
        console.log('CustomDocumentLoader url: '+url)
        return {
            contextUrl: null, // this is for a context via a link header
            document: CONTEXTS[url], // this is the actual document that was loaded
            documentUrl: url // this is the actual context URL after redirects
        };
    }
    // call the default documentLoader
    return nodeDocumentLoader(url);
};
  
  
  
