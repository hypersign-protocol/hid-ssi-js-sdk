# Introduction

The Hypersign Schema comply [Verifiable Credentials JSON Schema 2022 data model](https://w3c-ccg.github.io/vc-json-schemas/#data_model) specification and is stored on [Hypersign Identity Blockchain Network](https://explorer.hypersign.id/hypersign-testnet) as it is [adviced to store](https://w3c-ccg.github.io/vc-json-schemas/#storage) schema documents  and made available as immutable objects. 

## What is Verifiable Credential Schema or Data Models? 


## HypersignVerifiableCredentail SDK

Is a javascript library to interact with Hypersign Blockchain and to perform onchain and offchain schema operations.

## **NOTES**


1. Let us assume that we have created a DID - acting as an issuer and subject both - and have also registered a schema on the Hypersign blockchain. See documentation for [HypersignDID]() and [HypersignSchema]() before proceeding.
    - [Sample Schema](https://explorer.hypersign.id/hypersign-testnet/schemas/sch:hid:testnet:zBYQgcT4gUaFZ9CDb8W3hitfZTpZ1XkXuUyyFwAJne5HQ:1.0) has only one property called `name`. 
    - [Sample issuer/subject DID](https://explorer.hypersign.id/hypersign-testnet/identity/did:hid:testnet:zHsDWbJFbg96KvTsiyPkQGAx2ANs6bFn1SPnwCmHTxrAi)
2. Although Subject DID may or may not be a [private DID]()


## Table of Contents
- [Install The Package](#install-the-package)
- [Import The Package](#import-the-package)
- [OffChain APIs](#offchain-apis)
    - [Initialize Instance of HypersignSchema](#initialize-instance-of-hypersignschema)
    - [generate()](#generate)
    - [sign()](#sign)
- [OnChain APIs](#onchain-apis)
    - [Initialize Instance of HypersignSchema with offlineSigner](#initialize-with-offlinesigner)
    - [register()](#register)
    - [resolve()](#resolve)
- [Security Concerns](#security)


## Install The Package

```bash
npm i hid-ssi-sdk --save
```

## Import The Package

```js
import { HypersignVerifiableCredential } from 'hid-ssi-sdk';
```

## Offchain APIs


### Initialize Instance of HypersignVerifiableCredential

```js
const hypersignVC = new HypersignVerifiableCredential();

// OR initialize by passing a namepace. Default ''
// More complex way to initialize this class can be found in this documentation later
const namespace = 'testnet';
const hypersignVC = new HypersignVerifiableCredential({ namespace });
```

### Initialize with offlineSigner 

**Create Instance of the class**
```js
const hypersignSchema = new HypersignSchema({
    offlineSigner,                    // OPTIONAL signer of type OfflineSigner
    nodeRestEndpoint: hidNodeEp.rest, // OPTIONAL RPC endpoint of the Hypersign blockchain, Default 'TEST'
    nodeRpcEndpoint: hidNodeEp.rpc,   // OPTIONAL REST endpoint of the Hypersign blockchain
    namespace: hidNodeEp.namespace,   // OPTIONAL namespace of did id, Default 'did:hid'
  });

// OR Just initalize with offlineSigner
const hypersignSchema = new HypersignSchema({
    offlineSigner
})
```
**Call `init()` to initalize the offlineSigner**

```js
await hypersignSchema.init();
```

### `generate()`

Generates a new credential document

**API Definition**

```js
generate(params: {
    schemaId: string;
    subjectDid?: string;
    subjectDidDocSigned?: JSON;
    schemaContext?: Array<string>;
    type?: Array<string>;
    issuerDid: string;
    expirationDate: string;
    fields: object;
  }): Promise<IVerifiableCredential> 
```

**Usage**

```js
const credentialBody = {
  schemaId: 'sch:hid:testnet:zBYQgcT4gUaFZ9CDb8W3hitfZTpZ1XkXuUyyFwAJne5HQ:1.0',
  subjectDid: 'did:hid:testnet:zHsDWbJFbg96KvTsiyPkQGAx2ANs6bFn1SPnwCmHTxrAi',
  issuerDid: 'did:hid:testnet:zHsDWbJFbg96KvTsiyPkQGAx2ANs6bFn1SPnwCmHTxrAi',
  fields: { name: 'varsha' },
  expirationDate: '2027-12-10T18:30:00.000Z'
}
const credential = await hypersignVC.generate(credentialBody)
```

**Output**

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    {
      "hs": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zBYQgcT4gUaFZ9CDb8W3hitfZTpZ1XkXuUyyFwAJne5HQ:1.0:"
    },
    {
      "name": "hs:name"
    }
  ],
  "id": "vc:hid:testnet:zDjEwyQyZ8RC2ijs6DoqrVJRwUffBdP3n4fY2NYrzzw86",
  "type": [
    "VerifiableCredential",
    "testSchema"
  ],
  "expirationDate": "2027-12-10T18:30:00Z",
  "issuanceDate": "2023-01-09T07:41:31Z",
  "issuer": "did:hid:testnet:zHsDWbJFbg96KvTsiyPkQGAx2ANs6bFn1SPnwCmHTxrAi",
  "credentialSubject": {
    "name": "varsha",
    "id": "did:hid:testnet:zHsDWbJFbg96KvTsiyPkQGAx2ANs6bFn1SPnwCmHTxrAi"
  },
  "credentialSchema": {
    "id": "sch:hid:testnet:zBYQgcT4gUaFZ9CDb8W3hitfZTpZ1XkXuUyyFwAJne5HQ:1.0",
    "type": "JsonSchemaValidator2018"
  },
  "credentialStatus": {
    "id": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zDjEwyQyZ8RC2ijs6DoqrVJRwUffBdP3n4fY2NYrzzw86",
    "type": "CredentialStatusList2017"
  }
}
```

### `sign()`

Signs a schema document and attaches proof

**API Definition**

```js
sign(params: { privateKeyMultibase: string; schema: SchemaDocument, verificationMethodId: string }): Promise<Schema>;
```

Note: The difference between `SchemaDocument` and `Schema` types is, `Schema` type is `SchemaDocument` with `proof` attached to it. see the example below.

**Usage**

```js

const signedSchema = await hypersignSchema.sign({ privateKeyMultibase: privateKeyMultibase, schema: schema, verificationMethodId: 'did:hid:testnet:zAtZ8oBrVPvaKKou21KRnmzRtZaJpWxsgWuB9GNRLTQ6R#key-1' });
```

**Output**

```json
{
  "type": "https://w3c-ccg.github.io/vc-json-schemas/v1/schema/1.0/schema.json",
  "modelVersion": "1.0",
  "id": "sch:hid:testnet:z57BBNTNqkFXpsFfSMLvfvBhhiSEicGK3nVvJMXRKcE3S:1.0",
  "name": "testSchema",
  "author": "did:hid:testnet:zAtZ8oBrVPvaKKou21KRnmzRtZaJpWxsgWuB9GNRLTQ6R",
  "authored": "2023-01-07T07:24:06Z",
  "schema": {
    "schema": "http://json-schema.org/draft-07/schema",
    "description": "This is a test schema generation",
    "type": "object",
    "properties": "{\"name\":{\"type\":\"integer\"}}",
    "required": [],
    "additionalProperties": false
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2023-01-07T07:24:07Z",
    "verificationMethod": "did:hid:testnet:zAtZ8oBrVPvaKKou21KRnmzRtZaJpWxsgWuB9GNRLTQ6R#key-1",
    "proofPurpose": "assertion",
    "proofValue": "aozlK3ZSAHuP2x7is60jYXdhS8zc68bO2y9CVShgLNaXxTHdeLIIgqY5Ci6ji0nrC5Q4e+YiGtV/SNIFkvO4CQ=="
  }
}
```


## Security Concerns

// TODO


