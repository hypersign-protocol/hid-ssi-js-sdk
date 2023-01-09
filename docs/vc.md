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

### `issue()`

Signs a schema document and attaches proof

**API Definition**

```js
issue(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    privateKeyMultibase: string;
    registerCredential?: boolean;
  }): Promise<{ 
    signedCredential: IVerifiableCredential, 
    credentialStatus: CredentialStatus, 
    credentialStatusProof: CredentialProof
    credentialStatusRegistrationResult?: DeliverTxResponse }>;
```

**Usage**

```js
const issuedCredResult = await hypersignVC.issue(tempIssueCredentialBody);    const {signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult }  = issuedCredResult;
```

**Output**

```json
{
   "signedCredential":{
      "@context":[
         "https://www.w3.org/2018/credentials/v1",
         {
            "hs":"https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zHxz3ZGTAqA2j9AoVoXEEUNmhBMW7RftmbZufQovyVjfT:1.0:"
         },
         {
            "name":"hs:name"
         },
         "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "id":"vc:hid:testnet:z2g2Ty13EYau1tLUJgJtZ5xcvLLcywwzX3H2785ro5HJW",
      "type":[
         "VerifiableCredential",
         "testSchema"
      ],
      "expirationDate":"2027-12-10T18:30:00Z",
      "issuanceDate":"2023-01-09T11:17:15Z",
      "issuer":"did:hid:testnet:z5DErRspu8PTZf8W8WNy35mKBpL9bryp1i58hGz1kBtLL",
      "credentialSubject":{
         "name":"varsha",
         "id":"did:hid:testnet:z5DErRspu8PTZf8W8WNy35mKBpL9bryp1i58hGz1kBtLL"
      },
      "credentialSchema":{
         "id":"sch:hid:testnet:zHxz3ZGTAqA2j9AoVoXEEUNmhBMW7RftmbZufQovyVjfT:1.0",
         "type":"JsonSchemaValidator2018"
      },
      "credentialStatus":{
         "id":"https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z2g2Ty13EYau1tLUJgJtZ5xcvLLcywwzX3H2785ro5HJW",
         "type":"CredentialStatusList2017"
      },
      "proof":{
         "type":"Ed25519Signature2020",
         "created":"2023-01-09T11:18:56Z",
         "verificationMethod":"did:hid:testnet:z5DErRspu8PTZf8W8WNy35mKBpL9bryp1i58hGz1kBtLL#key-1",
         "proofPurpose":"assertionMethod",
         "proofValue":"zF49uwXB4XwjPyScApUhPTrUbXPTJ3ipdHsASDngj1oKX8SXMf9zrYmUzMHNfXLNXHMPvP5g6qhLj4czjQ4AmmpX"
      }
   },
   "credentialStatus":{
      "claim":{
         "id":"vc:hid:testnet:z2g2Ty13EYau1tLUJgJtZ5xcvLLcywwzX3H2785ro5HJW",
         "currentStatus":"Live",
         "statusReason":"Credential is active"
      },
      "issuer":"did:hid:testnet:z5DErRspu8PTZf8W8WNy35mKBpL9bryp1i58hGz1kBtLL",
      "issuanceDate":"2023-01-09T11:17:15Z",
      "expirationDate":"2027-12-10T18:30:00Z",
      "credentialHash":"2f8722f72bd9dc5d2ebe51104bdc5983a80c4e1f5a20e6ba4758162b2d910cac"
   },
   "credentialStatusProof":{
      "type":"Ed25519Signature2020",
      "created":"2023-01-09T11:17:16Z",
      "updated":"2023-01-09T11:17:16Z",
      "verificationMethod":"did:hid:testnet:z5DErRspu8PTZf8W8WNy35mKBpL9bryp1i58hGz1kBtLL#key-1",
      "proofValue":"F+PETguuXqJyfbWSimVEPlQ4pon815ovGVU9++aA2JhD8Yz/A2C02WQDqe1uztFDiQTZMtWqm5mNHrxCHHrrBw==",
      "proofPurpose":"assertion"
   },
   "credentialStatusRegistrationResult":{
      "code":0,
      "height":1482453,
      "rawLog":"[{\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/hypersignprotocol.hidnode.ssi.MsgRegisterCredentialStatus\"}]}]}]",
      "transactionHash":"59A3F0566C05853085EB3C4239857E77B6C658B0D929D11FA18AAA7B03AE6A50",
      "gasUsed":92561,
      "gasWanted":106334
   }
}
```


## Security Concerns

// TODO


