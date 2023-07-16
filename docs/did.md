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

  - [For KeyType Ed25519VerificationKey2020](#for-keytype-ed25519verificationkey2020)
    - [Initialize Instance of HypersignDID](#initialize-instance-of-hypersigndid)
    - [generateKeys()](#generatekeys)
    - [generate()](#generate)
    - [sign()](#sign)
    - [verify()](#verify)
    - [resolve()](#resolve)
  - [For KeyType EcdsaSecp256k1RecoveryMethod2020 and EcdsaSecp256k1VerificationKey2019](#for-keytype-ecdsasecp256k1recoverymethod2020-and-ecdsasecp256k1verificationkey2019)
    - [Initialize Instance of HypersignDID](#initialize-instance-of-hypersigndid-1)
    - [createByClientSpec()](#createbyclientspec)
    - [signByClientSpec()](#signbyclientspec)

- [OnChain APIs](#onchain-apis)
  - [For KeyType Ed25519VerificationKey2020](#for-keytype-ed25519verificationkey2020)
    - [Initialize Instance of HypersignDID with offlineSigner](#initialize-with-offlinesigner)
    - [register()](#register)
    - [update()](#update)
    - [deactivate()](#deactivate)
  - [For KeyType EcdsaSecp256k1RecoveryMethod2020 and EcdsaSecp256k1VerificationKey2019](#for-keytype-ecdsasecp256k1recoverymethod2020-and-ecdsasecp256k1verificationkey2019-1)
    - [Initialize Instance of HypersignDID with offlineSigner](#initialize-with-offlinesigner-1)
    - [registerByClientSpec()](#registerbyclientspec)
    - [signAndRegisterByClientSpec()](#signandregisterbyclientspec)
    - [updateByClientSpec()](#updatebyclientspec)
    - [deactivateByClientSpec()](#deactivatebyclientspec)
- [Security Concerns](#security)

## Install The Package

```js
npm i https://github.com/hypersign-protocol/hid-ssi-js-sdk  --save
```

**Supported node version: ^v16**

## Import The Package

```js
import { HypersignDID } from 'hs-ssi-sdk';
```

## Offchain APIs

### For KeyType Ed25519VerificationKey2020

#### Initialize Instance of HypersignDID

```js
const hypersignDID = new HypersignDID();

// OR initialize by passing a namepace. Default ''
// More complex way to initialize this class can be found in this documentation later
const namespace = 'testnet';
const hypersignDID = new HypersignDID({ namespace });
```

#### `generateKeys()`

Generate a new key pair of type `Ed25519VerificationKey2020`

**API Definition**

```js
generateKeys(params: { seed?: string, controller?: string }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }>;
```

**Usage**

```js
const kp = await hypersignDID.generateKeys();

// OR pass a seed / mnemonic to generated deterministic key pair
const seed = Bip39.decode(
  'three image merge verb tenant tree modify million hotel decade hurt alien loop illegal day judge beyond anxiety term there improve mad gossip car'
);
const kp = await hypersignDID.generateKeys({ seed, controller: 'did:hid:testnet:controller' });
```

**Outputs**

```js
{
  id: 'did:hid:testnet:controller',
  type: 'Ed25519VerificationKey2020',
  privateKeyMultibase: 'zrv5GBX5VGiyxUS6iWyRHDWVYSkKEGk8Qsmuj9GBJQK8KMFPVrReX1rBKHoFqgf2HGwYqVzH92pwnqbxhDAJNqsa668',
  publicKeyMultibase: 'z6MkhHLrnL288X2dXRBVQ9KUDRi8LLUb6sb7zo1oUUjEqTVN'
}
```

#### `generate()`

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
const methodSpecificId = 'e157620d69d003e12d935c37b8c21baa78d24898398829b39d943d253c006332'; // 32 bit alphanumeric
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

#### `sign()`

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
  privateKeyMultibase: privateKey,
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
  "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/ed25519-2020/v1"],
  "id": "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55",
  "controller": ["did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55"],
  "alsoKnownAs": ["did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55"],
  "verificationMethod": [
    {
      "id": "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55",
      "publicKeyMultibase": "z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55"
    }
  ],
  "authentication": ["did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1"],
  "assertionMethod": ["did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1"],
  "keyAgreement": ["did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1"],
  "capabilityInvocation": ["did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1"],
  "capabilityDelegation": ["did:hid:testnet:z2rkgwQaXwDAXtKFkbNE74fanZGVsDTCcNzWFjwPidB55#key-1"],
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

#### `verify()`

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
        "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/ed25519-2020/v1"],
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
      "error": "undefined",
      "purposeResult": {
        "valid": true,
        "controller": {
          "@context": "https://w3id.org/security/v2",
          "id": "did:hid:testnet:zFDepBTjyjKFVmDnSxfLvfnJ97PpjdpDW2yXA8sPzuoTr#key-1",
          "authentication": ["did:hid:testnet:zFDepBTjyjKFVmDnSxfLvfnJ97PpjdpDW2yXA8sPzuoTr#key-1"]
        }
      }
    }
  ]
}
```

#### `resolve()`

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

### For KeyType EcdsaSecp256k1RecoveryMethod2020 and EcdsaSecp256k1VerificationKey2019

#### Initialize Instance of HypersignDID

```js
const hypersignDID = new HypersignDID();
// OR initialize by passing a namepace. Default ''
const namespace = 'testnet';
const hypersignDID = new HypersignDID({ namespace });
```

#### `createByClientSpec()`

Generates a new DID Document using clientSpec

**API Definition**

```js
createByClientSpec(params: {
    methodSpecificId: string;
    publicKey?: string;  // only for [cosmos-ADR036]
    address: string;
    chainId: string;
    clientSpec: IClientSpec;
    verificationRelationships?: IVerificationRelationships[];// Verification Attributes to be added in did document
  }): Promise<object>
```

**Usage**

```js
const params = {
  methodSpecificId: '0xe8E06659F296D7c0561f41250A8a2674E83e8B98',
  address: '0xe8E06659F296D7c0561f41250A8a2674E83e8B98',
  clientSpec: 'eth-personalSign',
  chainId: '0x1',
  verificationRelationships: ['authentication', 'assertionMethod', 'capabilityDelegation'],
};
const didDocument = await hypersignDID.createByClientSpec(params);
```

**Outputs**

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98",
  "controller": ["did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98"],
  "alsoKnownAs": ["did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98"],
  "verificationMethod": [
    {
      "id": "did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98#key-1",
      "type": "EcdsaSecp256k1RecoveryMethod2020",
      "controller": "did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98",
      "blockchainAccountId": "eip155:1:0xe8E06659F296D7c0561f41250A8a2674E83e8B98"
    }
  ],
  "authentication": ["did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98#key-1"],
  "assertionMethod": ["did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98#key-1"],
  "keyAgreement": [],
  "capabilityInvocation": [],
  "capabilityDelegation": ["did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98#key-1"]
}
```

#### `signByClientSpec()`

Sign a DID Document and generate proof using clientSpec

**API Definition**

```js
signByClientSpec(params: {
    didDocument: object;   // DID Document to sign
    clientSpec: IClientSpec;
    address: string;     // Address of the wallet
    web3: Web3 | any;    // web3 object
    chainId?: string;   // only for [cosmos-ADR036]
  }): Promise<{ didDocument: Did; signature: string }>
```

**Usage**

```js
const params = {
  didDocument: didDocument,
  clientSpec: 'eth-personalSign',
  address: '0xe8E06659F296D7c0561f41250A8a2674E83e8B98',
  web3: web3Obj,
};

const signedDidDocument = await hypersignDID.signByClientSpec(params);
```

##### Generating web3 object

```js
import Web3 from 'web3';
const web3Obj = new Web3(window.ethereum);
```

**Outputs**

```json
{
  "didDocument": {
    "context": ["https://www.w3.org/ns/did/v1"],
    "id": "did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98",
    "controller": ["did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98"],
    "alsoKnownAs": ["did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98"],
    "verificationMethod": [
      {
        "id": "did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98#key-1",
        "type": "EcdsaSecp256k1RecoveryMethod2020",
        "controller": "did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98",
        "blockchainAccountId": "eip155:1:0xe8E06659F296D7c0561f41250A8a2674E83e8B98"
      }
    ],
    "authentication": ["did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98#key-1"],
    "assertionMethod": ["did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98#key-1"],
    "keyAgreement": [],
    "capabilityInvocation": [],
    "capabilityDelegation": ["did:hid:testnet:0xe8E06659F296D7c0561f41250A8a2674E83e8B98#key-1"]
  },
  "signature": "0xbbea62b2e8fd81cdf5a1792d24f9cf4165d21ecf7f96999fa949c3fe2b0b2c427976cce375a3bc54986e9f32966aebc4882fc2445296337e5850e2bf7411ac0441c"
}
```

## Onchain APIs

### For KeyType Ed25519VerificationKey2020

#### Initialize with offlineSigner

**Create Instance of the class**

```js
const hypersignDid = new HypersignDID({
  offlineSigner,
  nodeRestEndpoint: 'https://api.jagrat.hypersign.id', // OPTIONAL RPC endpoint of the Hypersign blockchain, Default 'TEST'
  nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id', // OPTIONAL REST endpoint of the Hypersign blockchain
  namespace: 'testnet',
});
```

##### OfflineSigner

You may follow this [this code snippet](https://github.com/hypersign-protocol/hid-ssi-js-sdk/blob/develop/src/tests/config.ts) for creating OfflineSigner

```js
offlineSigner = await createWallet(mnemonic);
```

**Call `init()` to initalize the offlineSigner**

```js
await hypersignDid.init();
```

#### `register()`

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
  verificationMethodId,
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

#### `update()`

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

#### `deactivate()`

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
  versionId, // VersionId when DID is registered on chain. See the didDocumentMetadata when DID resolves
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

### For KeyType EcdsaSecp256k1RecoveryMethod2020 and EcdsaSecp256k1VerificationKey2019

#### Initialize with offlineSigner

**Create Instance of the class**

```js
const hypersignDid = new HypersignDID({
  offlineSigner,
  nodeRestEndpoint: 'https://api.jagrat.hypersign.id',
  nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id',
  namespace: 'testnet',
});
```

##### OfflineSigner

You may follow this [this code snippet](https://github.com/hypersign-protocol/hid-ssi-js-sdk/blob/develop/src/tests/config.ts) for creating OfflineSigner

```js
offlineSigner = await createWallet(mnemonic);
```

**Call `init()` to initalize the offlineSigner**

```js
await hypersignDid.init();
```

#### `registerByClientSpec()`

Registers a DID and DIDDocument on blockchain

**API Definition**

```js
registerByClientSpec(params: {
    didDocument: object; // Ld document
    signInfos: SignInfo[];
  })
```

**Usage**

```js
const signInfo = [
  {
    verification_method_id: verificationMethodId,
    signature:
      '0x8c72a538df4268d5b732989d2bf2b82dd8c1c68b09f717a7fa4b1544d838310fa09394b410c355743da7afee96ce213370dbf484d21782ec1c',
    clientSpec: { type: 'eth-personalSign' },
  },
];
const params = {
  didDocument: didDocument,
  signInfos: signInfo,
};
const registerdDidDoc = await hypersignDid.registerByClientSpec(params);
```

**Outputs**

```js
{
  "code": 0,
  "height": 4285631,
  "rawLog": "[{\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/hypersignprotocol.hidnode.ssi.MsgCreateDID\"}]}]}]",
  "transactionHash": "55F833B0CA934221989C529EDB1FF67FB2223543FB6C08E4D38A6E2B92FD0B36",
  "gasUsed": 100732,
  "gasWanted": 117088
}
```

#### `signAndRegisterByClientSpec()`

Sign and Register a DID and DIDDocument using single method

**API Definition**

```js
signAndRegisterByClientSpec(params: {
    didDocument: any;
    address: string;
    verificationMethodId: string;
    web3: Web3 | any;
    clientSpec: IClientSpec;
    chainId?: string; // only for [cosmos-ADR036]
  })
```

**Usage**

```js
const params={
   didDocument: didDocument,
    address: account,
    verificationMethodId:,
    web3: web3Obj,
    clientSpec: "eth-personalSign",
}
const registeredDidDocuemnt= await hypersignDid.signAndRegisterByClientSpec(params)
```

##### Generating web3 object

```js
import Web3 from 'web3';
const web3Obj = new Web3(window.ethereum);
```

**Outputs**

```js
{
  "code": 0,
  "height": 4286095,
  "rawLog": "[{\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/hypersignprotocol.hidnode.ssi.MsgCreateDID\"}]}]}]",
  "transactionHash": "3D21C4A674573170DF42614BBEFD2D5657A86B3C412511EDD5A663B8AAFA1BCB2B",
  "gasUsed": 100732,
  "gasWanted": 117088
}
```

#### `updateByClientSpec()`

Update the DID document on blockchain

**API Definition**

```js
updateByClientSpec(params: {
    didDocument: object;
    versionId: string;
    signInfos: SignInfo[];
  }): Promise<object>
```

**Usage**

```js
const signInfo = [
  {
    verification_method_id: verificationMethodId
    signature:
      '0x8c72a538df4268d5b732989d2bf2b82dd8c1c68b09f717a7fa4b1544d838310fa09394b410c355743da7afee96ce213370dbf484d21782ec1c', // signature when DID is signed. See signature field
    clientSpec: { type: 'eth-personalSign' },
  },
];
const params = {
  didDocument, // Did to be updated
  versionId, // VersionId when DID is registered on chain. See the didDocumentMetadata when DID resolves
  signInfos,
};

const result = await hypersignDid.updateByClientSpec(params);
```

**Outputs**

```js
{
  "code": 0,
  "height": 4286665,
  "rawLog": "[{\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/hypersignprotocol.hidnode.ssi.MsgUpdateDID\"}]}]}]",
  "transactionHash": "7AD6428274A2F11025CF9432BCA55F2C1CF300CCA1C2AD5AE0E94E60B35CB29A",
  "gasUsed": 114482,
  "gasWanted": 134963
}
```

#### `deactivateByClientSpec()`

Deactivates the DID document on blockchain

**API Definition**

```js
deactivateByClientSpec(params: {
    didDocument: object;
    signInfos: SignInfo[];
    versionId: string;
  }): Promise<object>
```

**Usage**

```js
const signInfo = [
  {
    verification_method_id:verificationMethodId
    signature:
      '0x8c72a538df4268d5b732989d2bf2b82dd8c1c68b09f717a7fa4b1544d838310fa09394b410c355743da7afee96ce213370dbf484d21782ec1c', // signature when DID is signed. See signature field
    clientSpec: { type: 'eth-personalSign' },
  },
];
const params = {
  didDocument, // Did to be updated
  versionId, // VersionId when DID is registered on chain. See the didDocumentMetadata when DID resolves
  signInfos,
};

const result= await hypersignDid.deactivateByClientSpec(params)
```

**Outputs**

```js
{
  "code": 0,
  "height": 4286824,
  "rawLog": "[{\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/hypersignprotocol.hidnode.ssi.MsgDeactivateDID\"}]}]}]",
  "transactionHash": "62A7CEFCB553D08C2B7E9D4B93D2185873BD8A7140825CC8D26B8F84DBD0A6DC",
  "gasUsed": 100644,
  "gasWanted": 116974
}
```

## Security Concerns

// TODO
