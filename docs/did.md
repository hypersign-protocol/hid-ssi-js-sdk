# Introduction 

Hypersign Decentralized Identifiers (Hypersign DID) comply [W3C DID specification](https://www.w3.org/TR/did-core/) and is built on top of [Hypersign Identity Blockchain Network](https://explorer.hypersign.id/hypersign-testnet). It implements [Hypersign DID scheme (`did:hid`)](https://docs.hypersign.id/self-sovereign-identity-ssi/decentralized-identifier-did).

Note: `did:hid` DID scheme is yet to be offcially registered on [W3C DID registry](https://www.w3.org/TR/did-spec-registries/).

## What is a DID?

As per [W3C DID v1.0 specification document](https://www.w3.org/TR/did-core/): 

> Decentralized identifiers (DIDs) are a new type of identifier that enables verifiable, decentralized digital identity. A DID refers to any subject (e.g., a person, organization, thing, data model, abstract entity, etc.) as determined by the controller of the DID.

In simple words, decentralised identifiers are cryptographically-verifiable identifiers which are stored on a decentralised ledger, which enables users to own and manage their digital identity.

## Hypersign DID SDK

Is a javascript library for DID related operation (generate, sign, verify etc). It also provides APIs to store/update/retrive DID and DID Documents to/from the [Hypersign DID Registry](https://docs.hypersign.id/self-sovereign-identity-ssi/decentralized-identifier-did/did-registry) on the Hypersign Blockchain network easily.


## Table of Contents
- [Install The Package](#install-the-package)
- [Import The Package](#import-the-package)
- [OffChain APIs](#offchain-apis)
    - [Initialize Instance of HypersignDID](#initialize-instance-of-hypersigndid)
    - [generateKeys()](#generatekeys)
    - [generate()](#generate)
    - [sign()](#sign)
    - [verify()](#verify)
    - [resolve()](#resolve)
- [OnChain APIs](#onchain-apis)
    - [Initialize Instance of HypersignDID with offlineSigner](#initialize-with-offlinesigner)
    - [register()](#register)
    - [update()](#update)
    - [deactivate()](#deactivate)
- [Security Concerns](#security)


## Install The Package

```bash
npm i hid-ssi-sdk --save
```

## Import The Package

```js
import { HypersignDID } from 'hid-ssi-sdk';
```

## Offchain APIs

### Initialize Instance of HypersignDID

```js
const hypersignDID = new HypersignDID();

// OR initialize by passing a namepace. Default ''
// More complex way to initialize this class can be found in this documentation later
const namespace = 'testnet';
const hypersignDID = new HypersignDID({ namespace });
```

### `generateKeys()`

Generate a new key pair of type `Ed25519VerificationKey2020`

**API Definition**

```js
generateKeys(params: { seed?: string }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }>;
```

**Usage**

```js
const kp = await hypersignDID.generateKeys();

// OR pass a seed / mnemonic to generated deterministic key pair
const seed = Bip39.decode("three image merge verb tenant tree modify million hotel decade hurt alien loop illegal day judge beyond anxiety term there improve mad gossip car")
const kp = await hypersignDID.generateKeys({seed});
```
**Outputs**

```js
{
  privateKeyMultibase: 'zrv5GBX5VGiyxUS6iWyRHDWVYSkKEGk8Qsmuj9GBJQK8KMFPVrReX1rBKHoFqgf2HGwYqVzH92pwnqbxhDAJNqsa668',
  publicKeyMultibase: 'z6MkhHLrnL288X2dXRBVQ9KUDRi8LLUb6sb7zo1oUUjEqTVN'
}
```
// TODO: It should also outputs algorithm

### `generate()` 

Generates a new DID Document

**API Definition**

```js
generate(params: { 
  methodSpecificId?: string, // min 32 bit alphanumeric
  publicKeyMultibase: string 
}): Promise<object>;
```
**Usage**

```js
const didDocument = await hypersignDID.generate({ publicKeyMultibase });

// OR using custom methodSpecificId
const methodSpecificId = 'e157620d69d003e12d935c37b8c21baa78d24898398829b39d943d253c006332' // 32 bit alphanumeric 
const didDocument = await hypersignDID.generate({ methodSpecificId, publicKeyMultibase });

```
**Outputs**

```js
{
  '@context': [ 'https://www.w3.org/ns/did/v1' ],
  id: 'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz',
  controller: [ 'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz' ],
  alsoKnownAs: [ 'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz' ],
  verificationMethod: [
    {
      id: 'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1',
      type: 'Ed25519VerificationKey2020',
      controller: 'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz',
      publicKeyMultibase: 'z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz'
    }
  ],
  authentication: [
    'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1'
  ],
  assertionMethod: [
    'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1'
  ],
  keyAgreement: [
    'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1'
  ],
  capabilityInvocation: [
    'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1'
  ],
  capabilityDelegation: [
    'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1'
  ],
  service: []
}
```

### `sign()`

Sign a DID Document and generated proof 

**API Definition**

```js
sign(params: {
    didDocument: object;            // A DID Document to signed
    privateKeyMultibase: string;    // private key mulibase of type ED25519
    challenge: string;              // Random challenge
    domain: string;                 // Domain name
    did: string;                    // DID, if passed then DID will be resolved and `didDocument` parameter will not be used
    verificationMethodId: string    // Verification method identifier
  }): Promise<ISignedDIDDocument>;
```

**Usage**

```js
const params = {
      privateKey: privateKeyMultibase, 
      challenge: '1231231231', 
      domain: 'www.hypersign.id', 
      did: '', 
      didDocument: didDocument, 
      verificationMethodId: verificationMethodId, 
    };

const signedDocument = await hypersignDID.sign(params);
```

**Outputs**
```json
{
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55",
    "controller": [
      "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55"
    ],
    "alsoKnownAs": [
      "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55"
    ],
    "verificationMethod": [
      {
        "id": "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1",
        "type": "Ed25519VerificationKey2020",
        "controller": "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55",
        "publicKeyMultibase": "z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55"
      }
    ],
    "authentication": [
      "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1"
    ],
    "assertionMethod": [
      "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1"
    ],
    "keyAgreement": [
      "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1"
    ],
    "capabilityInvocation": [
      "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1"
    ],
    "capabilityDelegation": [
      "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1"
    ],
    "service": [],
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2023-01-06T03:47:00Z",
      "verificationMethod": "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1",
      "proofPurpose": "authentication",
      "challenge": "1231231231",
      "domain": "www.hypersign.id",
      "proofValue": "z5aX3uHmzhX2kvx5kiSgs8d2RHfEh7akMUvU35wVKqpm9vqsbptSCL7Ak6rLE9DX3DC98buzruvQ6RJgmeC73gHxP"
    }
}
```

### `verify()`

Verifies a signed DID Document.

**API Definition**

```js
verify(params: { 
  didDocument: object;            // Signed did documen
  verificationMethodId: string;   // The verification method
  challenge: string;              // Random challenge
  domain?: string                 // The domain name
}): Promise<object>;
```
**Usage**

```js
const result = await hypersignDID.verify({
      didDocument: signedDocument, 
      verificationMethodId, 
      challenge: '1231231231', 
      domain: 'www.hypersign.id',   
});
```

**Outputs**

```json
{
    "verified": true,
    "results": [
      {
        "proof": {
          "@context": [
            "https://www.w3.org/ns/did/v1",
            "https://w3id.org/security/suites/ed25519-2020/v1"
          ],
          "type": "Ed25519Signature2020",
          "created": "2023-01-06T03:43:39Z",
          "verificationMethod": "did:hid:testnet:zFDepBTjyjKFVmDnSxfLvfnJ97PpjdpDW2yXA8sPzuoTr#key-1",
          "proofPurpose": "authentication",
          "challenge": "1231231231",
          "domain": "www.adbv.com",
          "proofValue": "z5vqfue3RppWtSrPibxM2VUbeocUxHCqeENFx8QteyGhN1j7xXm6WuxutTeuQUgZByZbMkveVQCFjeE9Yxoo4S1d8"
        },
        "verified": true,
        "verificationMethod": {
          "id": "did:hid:testnet:zFDepBTjyjKFVmDnSxfLvfnJ97PpjdpDW2yXA8sPzuoTr#key-1",
          "type": "Ed25519VerificationKey2020",
          "publicKeyMultibase": "z6MktfurmhzR4rjxsid9eEJmWsr8vy6b3hTrizS5y9N1q2FE"
        },
        "purposeResult": {
          "valid": true,
          "controller": {
            "@context": "https://w3id.org/security/v2",
            "id": "did:hid:testnet:zFDepBTjyjKFVmDnSxfLvfnJ97PpjdpDW2yXA8sPzuoTr#key-1",
            "authentication": [
              "did:hid:testnet:zFDepBTjyjKFVmDnSxfLvfnJ97PpjdpDW2yXA8sPzuoTr#key-1"
            ]
          }
        }
      }
    ]
  }
```


### `resolve()`

Resolves a DID document from blockchain provided the DID.

**API Definition**

```js
resolve(params: { 
  did: string; 
  ed25519verificationkey2020?: boolean 
}): Promise<object>;
```
**Usage**

```js
const result = await hypersignDID.resolve({
      did,
});
```

**Outputs**

```js
{
  didDocument: {
    '@context': [ 'https://www.w3.org/ns/did/v1' ],
    id: 'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz',
    controller: [ 'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz' ],
    alsoKnownAs: [ 'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz' ],
    verificationMethod: [ {
        id: "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1",
        type: "Ed25519VerificationKey2020",
        controller: "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55",
        publicKeyMultibase: "z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55"
      } ],
    authentication: [
      'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1'
    ],
    assertionMethod: [
      'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1'
    ],
    keyAgreement: [
      'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1'
    ],
    capabilityInvocation: [
      'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1'
    ],
    capabilityDelegation: [
      'did:hid:testnet:z3q5pC5mgnyYAQvLniaMdNLA8WmCjgzLmJn6seCmDvEhz#key-1'
    ],
    service: []
  },
  didDocumentMetadata: {
    created: '2023-01-06T03:27:13Z',
    updated: '2023-01-06T03:27:13Z',
    deactivated: false,
    versionId: 'E4B985104BC233E4EC4A7F9A6B501812B92D059677D6543C024E6B7936BC5BC3'
  }
}
```


## Onchain APIs

### Initialize with offlineSigner 

**Create Instance of the class**
```js
const hypersignDid = new HypersignDID({
    offlineSigner,                    // OPTIONAL signer of type OfflineSigner
    nodeRestEndpoint: hidNodeEp.rest, // OPTIONAL RPC endpoint of the Hypersign blockchain, Default 'TEST'
    nodeRpcEndpoint: hidNodeEp.rpc,   // OPTIONAL REST endpoint of the Hypersign blockchain
    namespace: hidNodeEp.namespace,   // OPTIONAL namespace of did id, Default 'did:hid'
  });

// OR Just initalize with offlineSigner
const hypersignDid = new HypersignDID({
    offlineSigner
})
```

Read about `OfflineSigner` [here](https://docs.hypersign.id/developers/hid-ssi-sdk/offlinesigner)

**Call `init()` to initalize the offlineSigner**

```js
await hypersignDid.init();
```

### `register()`

Registers a DID and DIDDocument on blockchain

**API Definition**

```js
register(params: { 
  didDocument: object; 
  privateKeyMultibase: string; 
  verificationMethodId: string
}): Promise<object>;
```
**Usage**

```js
const result = await hypersignDID.register({ 
  didDocument, 
  privateKeyMultibase, 
  verificationMethodId
});
```

**Outputs**
```js
{
  code: 0,
  height: 1432291,
  rawLog: '[{"events":[{"type":"message","attributes":[{"key":"action","value":"/hypersignprotocol.hidnode.ssi.MsgCreateDID"}]}]}]',
  transactionHash: 'E4B985104BC233E4EC4A7F9A6B501812B92D059677D6543C024E6B7936BC5BC3',
  gasUsed: 99152,
  gasWanted: 114906
}
```

### `update()`

Updates the DID document on blockchain

**API Definition**

```js
update(params: {
    didDocument: object;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object>;
```

**Usage**

```js
const result = await hypersignDID.update({
  didDocument,
  privateKeyMultibase,
  verificationMethodId,
  versionId, // VersionId when DID is registered on chain. See the didDocumentMetadata when DID resolves
});
```

**Outputs**

```js
{
  code: 0,
  height: 1432293,
  rawLog: '[{"events":[{"type":"message","attributes":[{"key":"action","value":"/hypersignprotocol.hidnode.ssi.MsgUpdateDID"}]}]}]',
  transactionHash: 'A2E2E8104EBECD36BBBD9D41823AB2EEBDEA463D83CEB9FA54AA4D4017012B2D',
  gasUsed: 103684,
  gasWanted: 120751
}
```

### `deactivate()`

Deactivates the DID document on blockchain

**API Definition**

```js
deactivate(params: {
    didDocument: object;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object>;
```
**Usage**

```js
const result = await hypersignDID.deactivate({
      didDocument,
      privateKeyMultibase,
      verificationMethodId,
      versionId,  // VersionId when DID is registered on chain. See the didDocumentMetadata when DID resolves
});
```

**Outputs**
```js
{
  code: 0,
  height: 1432295,
  rawLog: '[{"events":[{"type":"message","attributes":[{"key":"action","value":"/hypersignprotocol.hidnode.ssi.MsgDeactivateDID"}]}]}]',
  transactionHash: 'E648A4E85B943C668E2BA24530B3C9D3364BBEA05E49F6F75A57CAC2EE72264C',
  gasUsed: 92728,
  gasWanted: 106555
}
```

## Security Concerns

// TODO


