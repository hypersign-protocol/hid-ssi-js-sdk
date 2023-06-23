# Introduction

The Hypersign Schema comply [Verifiable Credentials JSON Schema 2022 data model](https://w3c-ccg.github.io/vc-json-schemas/#data_model) specification and is stored on [Hypersign Identity Blockchain Network](https://explorer.hypersign.id/hypersign-testnet) as it is [adviced to store](https://w3c-ccg.github.io/vc-json-schemas/#storage) schema documents  and made available as immutable objects. 

## What is Verifiable Credential Schema or Data Models? 

As per the [Verifiable Credentials JSON Schema 2022](https://w3c-ccg.github.io/vc-json-schemas/#verifiable_credentials_data_model) specification:

> The Credential Schema is a document that is used to guarantee the structure, and by extension the semantics, of the set of claims comprising a [Verifiable Credential](). A shared Credential Schema allows all parties to reference data in a *"known way"*.

A schema can be viewed from four perspectives: the author, issuer, verifier and holder.

- **Author**: An author creates a schema and registers it in Hypersign blockchain as to provide a blueprint for a *Verifiable Credential*, specifying the shape and format of the data in such a credential.
- **Issuer**: Issuers utilize schemas to provide structure and meaning to the data they issue as *Verifiable Credentials*. By using schemas, issuers contribute to a credentialing ecosystem that promotes the usage and adoption of data standards.
- **Verifier**: Verifiers processes a *Verifiable Credentials* and need to do so with knowledge of the terms and data the compromise the credentials. Credential Schemas aid a verifier in both requesting and processing credenetials that have been produced in a well-known format.
- **Holder**: Holders, or those who are the subject of credential issuance, can make sense of the data they control by evaluating it against a data schema. When data is requested from a holder which references a Credential Schema the holder has the capability to to present the data specifically requested by the verifier.

Note: Often, Issuer and Autor of schema may be same.


## HypersignSchema SDK


Is a javascript library for Schema related operation (generate, sign, register etc). It also provides APIs to store/update/retrive Schema to/from the [Hypersign Schema Registry](https://docs.hypersign.id/self-sovereign-identity-ssi/schema/schema-registry) on the Hypersign Blockchain network easily.


## **NOTES**

- A DID registred on Hypersign blockchain in order to register a schema on  Hypersign blockchain network.
- Schema can not be registred using private DIDs. 


## Table of Contents
- [Install The Package](#install-the-package)
- [Import The Package](#import-the-package)
- [OffChain APIs](#offchain-apis)
    - [Initialize Instance of HypersignSchema](#initialize-instance-of-hypersignschema)
    - [generate()](#generate)
    - [sign()](#sign)
    - [resolve()](#resolve)
- [OnChain APIs](#onchain-apis)
    - [Initialize Instance of HypersignSchema with offlineSigner](#initialize-with-offlinesigner)
    - [register()](#register)
- [Security Concerns](#security)


## Install The Package

```bash
npm i https://github.com/hypersign-protocol/hid-ssi-js-sdk  --save
```

## Import The Package

```js
import { HypersignSchema } from 'hid-ssi-sdk';
```

## Offchain APIs

### Initialize Instance of HypersignSchema

```js
const hypersignSchema = new HypersignSchema();

// OR initialize by passing a namepace. Default ''
// More complex way to initialize this class can be found in this documentation later
const namespace = 'testnet';
const hypersignSchema = new HypersignSchema({ namespace });
```


### `generate()`

Generates a new schema doc without proof

**API Definition**

```js
generate(params: {
    name: string;
    description?: string;
    author: string;
    fields?: Array<ISchemaFields>;
    additionalProperties: boolean;
  }): Promise<SchemaDocument>;
```

`ISchemaFields`

```js
interface ISchemaFields {
  type: string;
  format?: string;
  name: string;
  isRequired: boolean;
}
```

**Usage**

```js

const schemaBody = {
  name: 'testSchema',
  description: 'This is a test schema generation',
  author: 'did:hid:testnet:zAtZ8oBrVPvaKKou21KRnmzRtZaJpWxsgWuB9GNRLTQ6R',
  fields: [{ name: 'name', type: 'integer', isRequired: false }],
  additionalProperties: false,
}
const schema = await hypersignSchema.generate(schemaBody);
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


### `resolve()`

Resolves a schema document with schemId from Hypersign blockchain 

**API Definition**

```js
resolve(params: { schemaId: string }): Promise<Schema>;

```

**Usage**

```js
const result = await hypersignSchema.resolve({ schemaId: schema['id']});

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


## OnChain APIs

### Initialize with offlineSigner 

**Create Instance of the class**
```js
const hypersignSchema = new HypersignSchema({
    offlineSigner,                    // OPTIONAL signer of type OfflineSigner
    nodeRestEndpoint: 'https://api.jagrat.hypersign.id', // OPTIONAL RPC endpoint of the Hypersign blockchain, Default 'TEST'
    nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id',   // OPTIONAL REST endpoint of the Hypersign blockchain
    namespace: 'testnet',   // OPTIONAL namespace of did, Default ''
  });

// OR Just initalize with offlineSigner
const hypersignSchema = new HypersignSchema({
    offlineSigner
})
```

#### OfflineSigner 

You may follow this [this code snnipet](https://github.com/hypersign-protocol/hid-ssi-js-sdk/blob/develop/src/tests/config.ts) for creating OfflineSigner 

```js
offlineSigner = await createWallet(mnemonic);
```


**Call `init()` to initalize the offlineSigner**

```js
await hypersignSchema.init();
```

### `register()`

Register a schema Document in Hypersign blockchain

**API Definition**

```js
register(params: { schema: Schema }): Promise<object>;
```

**Usage**

```js
const registeredSchema = await hypersignSchema.register({
      schema: signedSchema
});
```

**Output**

```json
{
  "code": 0,
  "height": 1449829,
  "rawLog": "[{\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/hypersignprotocol.hidnode.ssi.MsgCreateSchema\"}]}]}]",
  "transactionHash": "A4909951861464DA4FF0E8CB101E128895E166891AF68909B7622B212CCEEDE2",
  "gasUsed": 90160,
  "gasWanted": 103216
}
```


## Security Concerns

// TODO


