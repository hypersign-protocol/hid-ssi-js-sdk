# Introduction


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
import { HypersignSchema } from 'hid-ssi-sdk';
```

## Offchain APIs

### Initialize Instance of HypersignSchema

```js
const hypersignSchema = new HypersignSchema();

// OR initialize by passing a namepace. Default 'did:hid'
// More complex way to initialize this class can be found in this documentation later
const namespace = 'testnet';
const hypersignSchema = new HypersignSchema({ namespace });
```


### `generate()`

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
  author: '',
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
## OnChain APIs

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

### `register()`

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

### `resolve()`

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


## Security Concerns

// TODO


