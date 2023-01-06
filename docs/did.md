# Introduction 

## Table of Contents
- [Install The Package](#install-the-package)
- [Import The Package](#import-the-package)
- [Initialize Instance of HypersignDID](#initialize-instance-of-hypersigndid)
- [OffChain APIs](#offchain-apis)
    - [generateKeys()](#generatekeys)
    - [generate()](#generate)
    - [sign()](#sign)
    - [verify()](#verify)
- [OnChain APIs](#onchain-apis)
    - [Initialize with offlineSigner](#initialize-with-offlinesigner)
    - [register()](#register)
    - [resolve()](#resolve)
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

## Initialize Instance of HypersignDID



```js
const hypersignDID = new HypersignDID();

// OR initialize by passing a namepace. Default 'did:hid'
// More complex way to initialize this class can be found in this documentation later

const namespace = 'did:hid';
const hypersignDID = new HypersignDID({ namespace });
```


## Offchain APIs

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

### `generate()` 

Generates a new DID Document

```js
generate(params: { publicKeyMultibase: string }): Promise<object>;
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

```js
sign(params: {
    doc: object;
    privateKey?: string;
    challenge: string;
    domain: string;
    did: string;
    verificationMethodId: string;
  }): Promise<object>;
```
**Outputs**
```json
{
  "signedDidDocument": {
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
      "domain": "www.adbv.com",
      "proofValue": "z5aX3uHmzhX2kvx5kiSgs8d2RHfEh7akMUvU35wVKqpm9vqsbptSCL7Ak6rLE9DX3DC98buzruvQ6RJgmeC73gHxP"
    }
  }
}
```

### `verify()`

```js
verify(params: { doc: object; verificationMethodId: string; challenge: string; domain?: string }): Promise<object>;
```
**Outputs**
```json
{
  "verificationResult": {
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
    offlineSiner
})
```
**Call `init()` to initalize the offlineSigner**

```js
await hypersignDid.init();
```


### `register()`

```js
register(params: { didDocument: object; privateKeyMultibase: string; verificationMethodId: string }): Promise<object>;

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

### `resolve()`

```js
resolve(params: { did: string; ed25519verificationkey2020?: boolean }): Promise<object>;

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

### `update()`

```js
update(params: {
    didDocument: object;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object>;
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

```js
deactivate(params: {
    didDocument: object;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object>;
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


