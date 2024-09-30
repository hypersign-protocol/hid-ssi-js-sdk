import did from './did.json';
import ed25519signature2020 from './ed25519-signature-2020.json';
import securityv2 from './security-v2.json';
import credentials from './credentials.json';
import jsonld from 'jsonld';
import dataintegrety from './vc-data-integrety.json';
import ecdsasecp2020 from './lds-ecdsa-secp256k1-recovery2020.json';
import schema_org from './schema_org.json';
import x25519VerificationKey2020 from './x25519-key-agreement-2020-v1.json';
import X25519KeyAgreementKeyEIP5630 from './X25519KeyAgreementKeyEIP5630.json';
import credentialStatus from './credentialStatus.json';
import credentialSchema from './credential_schema.json';
import hypersigncredentialStatus2023 from './hypersignCredentialStatus2023.json';
// Ref: https://github.com/digitalbazaar/jsonld.js/#custom-document-loader

let nodeDocumentLoader;
if (typeof window === 'undefined') {
  nodeDocumentLoader = jsonld.documentLoaders.node;
} else {
  nodeDocumentLoader = jsonld.documentLoaders.xhr;
}
import wellknown from './did-wellknown.json';
const CONTEXTS = Object.freeze({
  'https://www.w3.org/ns/did/v1': {
    ...did,
  },
  'https://w3id.org/security/suites/ed25519-2020/v1': {
    ...ed25519signature2020,
  },
  'https://w3id.org/security/v2': {
    ...securityv2,
  },
  'https://www.w3.org/2018/credentials/v1': {
    ...credentials,
  },
  'https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.jsonld': {
    ...dataintegrety,
  },
  'https://w3id.org/security/suites/secp256k1recovery-2020/v2': {
    ...ecdsasecp2020,
  },
  'https://schema.org': {
    ...schema_org,
  },
  'https://ns.did.ai/suites/x25519-2020/v1': {
    ...x25519VerificationKey2020,
  },
  'https://identity.foundation/.well-known/did-configuration/v1': {
    ...wellknown,
  },
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
  'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/X25519KeyAgreementKeyEIP5630.jsonld': {
    ...X25519KeyAgreementKeyEIP5630,
  },
  'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialStatus.jsonld': {
    ...credentialStatus,
  },
  'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialSchema.jsonld': {
    ...credentialSchema,
  },
  'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld': {
    ...hypersigncredentialStatus2023,
  },
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

export default async (url, options) => {
  if (url in CONTEXTS) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: CONTEXTS[url], // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }
  // call the default documentLoader
  return nodeDocumentLoader(url);
};
