# Introduction

// TODO
## What is Verifiable Credential Schema or Data Models? 
// TODO

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
- [APIs](#apis)
    - [Initialize Instance of HypersignVerifiableCredential with offlineSigner](#initialize-with-offlinesigner)
    - [generate()](#generate)
    - [issue()](#issue)   
    - [Credential Status Operations](#credential-status-operations) 
      - [checkCredentialStatus()](#checkcredentialstatus)
      - [resolveCredentialStatus()](#resolveCredentialStatus)
      - [updateCredentialStatus()](#updateCredentialStatus)
      - [registerCredentialStatus()](#registerCredentialStatus)
- [Security Concerns](#security)

## Install The Package

```bash
npm i hid-ssi-sdk --save
```

## Import The Package

```js
import { HypersignVerifiableCredential } from 'hid-ssi-sdk';
```

## APIs

### Initialize instance of HypersignVerifiableCredential with offlineSigner 

**Create Instance of the class**
```js
const hypersignVC = new HypersignVerifiableCredential({
    offlineSigner,                    // OPTIONAL signer of type OfflineSigner
    nodeRestEndpoint: hidNodeEp.rest, // OPTIONAL RPC endpoint of the Hypersign blockchain, Default 'TEST'
    nodeRpcEndpoint: hidNodeEp.rpc,   // OPTIONAL REST endpoint of the Hypersign blockchain
    namespace: hidNodeEp.namespace,   // OPTIONAL namespace of did id, Default 'did:hid'
  });

// OR Just initalize with offlineSigner
const hypersignVC = new HypersignVerifiableCredential({
    offlineSigner
})
```
**Call `init()` to initalize the offlineSigner**

```js
await hypersignVC.init();
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

```js
interface IVerifiableCredential {
  context: Array<string>;
  id: string;
  type: Array<string>;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: object;
  credentialSchema: ISchema;
  credentialStatus: ICredentialStatus;
  proof?: object;
}
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
      "hs": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zDKTDL2V3BYdmxzXZuE6oQhbGQG9Gp9QVFKtTWoSHhjt6:1.0:"
    },
    {
      "name": "hs:name"
    }
  ],
  "id": "vc:hid:testnet:zCgvWJQqiwbB3MPhhtaWpoyroYVgyVwSKaLPyYXXQmtmM",
  "type": [
    "VerifiableCredential",
    "testSchema"
  ],
  "expirationDate": "2027-12-10T18:30:00Z",
  "issuanceDate": "2023-01-10T06:20:18Z",
  "issuer": "did:hid:testnet:zE1tjuapkmcpE32HDYH6dPDaMmVuRzLLQVuMBPHBZr7gG",
  "credentialSubject": {
    "name": "varsha",
    "id": "did:hid:testnet:zE1tjuapkmcpE32HDYH6dPDaMmVuRzLLQVuMBPHBZr7gG"
  },
  "credentialSchema": {
    "id": "sch:hid:testnet:zDKTDL2V3BYdmxzXZuE6oQhbGQG9Gp9QVFKtTWoSHhjt6:1.0",
    "type": "JsonSchemaValidator2018"
  },
  "credentialStatus": {
    "id": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zCgvWJQqiwbB3MPhhtaWpoyroYVgyVwSKaLPyYXXQmtmM",
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
      "@context": [
         "https://www.w3.org/2018/credentials/v1",
         {
            "hs": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zDKTDL2V3BYdmxzXZuE6oQhbGQG9Gp9QVFKtTWoSHhjt6:1.0:"
         },
         {
            "name": "hs:name"
         },
         "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "id": "vc:hid:testnet:zCgvWJQqiwbB3MPhhtaWpoyroYVgyVwSKaLPyYXXQmtmM",
      "type": [
         "VerifiableCredential",
         "testSchema"
      ],
      "expirationDate": "2027-12-10T18:30:00Z",
      "issuanceDate": "2023-01-10T06:20:18Z",
      "issuer": "did:hid:testnet:zE1tjuapkmcpE32HDYH6dPDaMmVuRzLLQVuMBPHBZr7gG",
      "credentialSubject": {
         "name": "varsha",
         "id": "did:hid:testnet:zE1tjuapkmcpE32HDYH6dPDaMmVuRzLLQVuMBPHBZr7gG"
      },
      "credentialSchema": {
         "id": "sch:hid:testnet:zDKTDL2V3BYdmxzXZuE6oQhbGQG9Gp9QVFKtTWoSHhjt6:1.0",
         "type": "JsonSchemaValidator2018"
      },
      "credentialStatus": {
         "id": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zCgvWJQqiwbB3MPhhtaWpoyroYVgyVwSKaLPyYXXQmtmM",
         "type": "CredentialStatusList2017"
      },
      "proof": {
         "type": "Ed25519Signature2020",
         "created": "2023-01-10T06:22:02Z",
         "verificationMethod": "did:hid:testnet:zE1tjuapkmcpE32HDYH6dPDaMmVuRzLLQVuMBPHBZr7gG#key-1",
         "proofPurpose": "assertionMethod",
         "proofValue": "z5xGFtmPHzdizcRrYAGJqZZ5Ut9EijBwyLLW14mY7dPAUYuNkBYEvXM5xdcz9gqtcW2sCCZQXGFNoqfoPCBQeDR1L"
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

Note: When we issue credential, only cryptographic hash of the credential document get stored on the blockchain for privacy purpose and security purpose. The `credentialHash` in `credentialStatus` is a digest of the verifiable credential, generated using `sha256` hashing algorithm which is of length `256 bits` and is represented into `64 HEX` characters. 


### `verify()`

Verfies signed/issued credential

**API Definition**

```js
verify(params: {
    credential: IVerifiableCredential; // Signed/issued Hypersign credentail document
    issuerDid: string;
    verificationMethodId: string;
  }): Promise<object>
```

**Usage**

```js
const params = {
      credential: signedCredential,
      issuerDid: didDocId,
      verificationMethodId,
    };
const verificationResult = await hypersignVC.verify(params);
```
**Output**

```json
{
  "verified": true,
  "results": [
    {
      "proof": {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          {
            "hs": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zDKTDL2V3BYdmxzXZuE6oQhbGQG9Gp9QVFKtTWoSHhjt6:1.0:"
          },
          {
            "name": "hs:name"
          },
          "https://w3id.org/security/suites/ed25519-2020/v1"
        ],
        "type": "Ed25519Signature2020",
        "created": "2023-01-10T06:22:02Z",
        "verificationMethod": "did:hid:testnet:zE1tjuapkmcpE32HDYH6dPDaMmVuRzLLQVuMBPHBZr7gG#key-1",
        "proofPurpose": "assertionMethod",
        "proofValue": "z5xGFtmPHzdizcRrYAGJqZZ5Ut9EijBwyLLW14mY7dPAUYuNkBYEvXM5xdcz9gqtcW2sCCZQXGFNoqfoPCBQeDR1L"
      },
      "verified": true,
      "verificationMethod": {
        "id": "did:hid:testnet:zE1tjuapkmcpE32HDYH6dPDaMmVuRzLLQVuMBPHBZr7gG#key-1",
        "type": "Ed25519VerificationKey2020",
        "controller": "did:hid:testnet:zE1tjuapkmcpE32HDYH6dPDaMmVuRzLLQVuMBPHBZr7gG",
        "publicKeyMultibase": "z6MksU9nVq5C7AJh9X7vDr4UEK8Mb5BHQDamBvG7DZ9amLTe"
      },
      "purposeResult": {
        "valid": true
      }
    }
  ],
  "statusResult": {
    "verified": true
  }
}
```

### Credential Status Operations

#### `checkCredentialStatus()`

Checks status of the credential from Hypersign Blokchain

**API Definition**

```js
checkCredentialStatus(params: { credentialId }): Promise<{verified: boolean}>;

```

**Usage**

```js
const verificationResult = await hypersignVC.verify({credentialId});
```
**Output**


```js
{
  "verified": true
}
```

#### `resolveCredentialStatus()`

Resolves credential status from Hypersign Blokchain

**API Definition**

```js
resolveCredentialStatus(params: { credentialId }): Promise<CredentialStatus>;

```

**Usage**

```js
const verificationResult = await hypersignVC.verify({ credentialId });
```
**Output**


```js
{
  "claim": {
    "id": "vc:hid:testnet:zAkr6Ct7WKv2gtnJnNSbfRGAURXPVtepQpC8L6zDYbswb",
    "currentStatus": "Live",
    "statusReason": "Credential is active"
  },
  "issuer": "did:hid:testnet:z6ghGJCnWz4VRK6DgPQYWkcMiaGeEDoxF2EQCjSvQbejG",
  "issuanceDate": "2023-01-10T16:28:01Z",
  "expirationDate": "2027-12-10T18:30:00Z",
  "credentialHash": "82b797d50e3593c167e46ef2081b36648706c23ddcfe534eb28c0a7120f2d692",
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2023-01-10T16:28:05Z",
    "updated": "2023-01-10T16:28:05Z",
    "verificationMethod": "did:hid:testnet:z6ghGJCnWz4VRK6DgPQYWkcMiaGeEDoxF2EQCjSvQbejG#key-1",
    "proofPurpose": "assertion",
    "proofValue": "XOxpztZxRSzWdyQVF8G3wEK3JKENkDPLV8Rsbv1IYvCfDmI7Icjq0yRAakcxBPGNKmjdCoR0uAKCc2f7eRxeAA=="
  }
}
```



#### `updateCredentialStatus()`

Updates credential status into Hypersign Blokchain

**API Definition**

```js
updateCredentialStatus(params: {
    credentialStatus: CredentialStatus;
    issuerDid: string;
    verificationMethodId: string; // vermethod of issuer for assestion
    privateKeyMultibase: string;
    status: string;
    statusReason?: string;
  }): Promise<DeliverTxResponse>
```

**Usage**

```js

const params = {
      credentialStatus,
      issuerDid: didDocId,
      verificationMethodId,
      privateKeyMultibase,
      status: 'SUSPENDED', 
      statusReason: 'Suspending this credential for some time',
};
const updatedCredResult = await hypersignVC.updateCredentialStatus(params);
```
Supported status: `LIVE`, `SUSPENDED`, `REVOKED`. Please read the [doc]() for more details about status.

**Output**


```js
{
  code: 0,
  height: 1501029,
  rawLog: '[{"events":[{"type":"message","attributes":[{"key":"action","value":"/hypersignprotocol.hidnode.ssi.MsgRegisterCredentialStatus"}]}]}]',
  transactionHash: '462CAC8DBA88276975B67D1A7DC1AD9895290FB8D307E5371DAE1F02F8F75676',
  gasUsed: 96250,
  gasWanted: 111176
}
```

#### `registerCredentialStatus()`

Registers credential status in blockchain Hypersign Blokchain

**API Definition**

```js
registerCredentialStatus(params: {
    credentialStatus: CredentialStatus;
    credentialStatusProof: CredentialProof;
  }): Promise<DeliverTxResponse>
```

**Usage**


```js
const registerCredDetail = await hypersignVC.registerCredentialStatus({
        credentialStatus,
        credentialStatusProof
      });
```

**Output**

```js
{
  "code": 0,
  "height": 1508092,
  "rawLog": "[{\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/hypersignprotocol.hidnode.ssi.MsgRegisterCredentialStatus\"}]}]}]",
  "transactionHash": "5CE9A48DCCE6326839E588E1F1DE8CC9D41C52A76B65944F3C677D2CBD4DEAA5",
  "gasUsed": 92525,
  "gasWanted": 106334
}
```


## Security Concerns

// TODO


