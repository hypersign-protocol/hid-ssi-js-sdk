# Introduction

The Hypersign Verifiable Credential comply [W3C Verifiable Credentials Data Model v1.1](https://www.w3.org/TR/vc-data-model/) specification whoes status can be stored in [Hypersign Credential Revocation Registry](https://docs.hypersign.id/self-sovereign-identity-ssi/verifiable-credential-vc/credential-revocation-registry) on [Hypersign Identity Blockchain Network](https://explorer.hypersign.id/hypersign-testnet).

## What is Verifiable Credential ?

As per [W3C Credentials Data Model specfiation v1.1](https://www.w3.org/TR/vc-data-model/):

**What is credential?\***

> Credentials are a part of our daily lives; driver's licenses are used to assert that we are capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries

**What is verifiable credential**

> A digital credential document which is represented in a way that is cryptographically secure, privacy respecting, and machine-verifiable.

Read more about verifiable credential [here](https://docs.hypersign.id/self-sovereign-identity-ssi/verifiable-credential-vc).

## HypersignVerifiableCredentail SDK

Is a javascript library for verifiable credentials operation (generate, issue etc). It also provides APIs to store/update/retrive credential status to/from the [Hypersign Credential Revocation Registry](https://docs.hypersign.id/self-sovereign-identity-ssi/verifiable-credential-vc/credential-revocation-registry) on the Hypersign Blockchain network easily.

### **NOTES**

1. Let us assume that we have created a DID - acting as an issuer and subject both (for demonstration purpose) - and have also registered a schema on the Hypersign blockchain. See documentation for [HypersignDID]() and [HypersignSchema]() before proceeding.
   - [Sample Schema](https://explorer.hypersign.id/hypersign-testnet/schemas/sch:hid:testnet:zBYQgcT4gUaFZ9CDb8W3hitfZTpZ1XkXuUyyFwAJne5HQ:1.0) has only one property called `name`.
   - [Sample issuer/subject DID](https://explorer.hypersign.id/hypersign-testnet/identity/did:hid:testnet:zHsDWbJFbg96KvTsiyPkQGAx2ANs6bFn1SPnwCmHTxrAi)
2. The subject DID may or may not be a private DID. Read concept of private and public DIDs [here]().

## Table of Contents

- [Install The Package](#install-the-package)
- [Import The Package](#import-the-package)
- [APIs](#apis)
  - [Initialize Instance of HypersignVerifiableCredential with offlineSigner](#initialize-instance-of-hypersignverifiablecredential-with-offlinesigner)
  - [generate()](#generate)
  - [issue()](#issue)
  - [Credential Status Operations](#credential-status-operations)
    - [resolveCredentialStatus()](#resolveCredentialStatus)
    - [updateCredentialStatus()](#updateCredentialStatus)
- [Security Concerns](#security)

## Install The Package

```bash
npm i https://github.com/hypersign-protocol/hid-ssi-js-sdk  --save
```

## Import The Package

```js
import { HypersignVerifiableCredential } from 'hs-ssi-sdk';
```

## APIs

### Initialize instance of HypersignVerifiableCredential with offlineSigner

**Create Instance of the class**

```js
const hypersignVC = new HypersignVerifiableCredential({
  offlineSigner, // OPTIONAL signer of type OfflineSigner
  nodeRestEndpoint: 'https://api.jagrat.hypersign.id', // OPTIONAL RPC endpoint of the Hypersign blockchain, Default 'TEST'
  nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id', // OPTIONAL REST endpoint of the Hypersign blockchain
  namespace: 'testnet', // OPTIONAL namespace of did, Default ''
});

// OR Just initalize with offlineSigner
const hypersignVC = new HypersignVerifiableCredential({
  offlineSigner,
});

// OR Depending on offchain-onchain activities
const hypersignVC = new HypersignVerifiableCredential();
```

#### OfflineSigner

You may follow this [this code snnipet](https://github.com/hypersign-protocol/hid-ssi-js-sdk/blob/develop/src/tests/config.ts) for creating OfflineSigner

```js
offlineSigner = await createWallet(mnemonic);
```

**Call `init()` to initalize the offlineSigner**

```js
await hypersignVC.init();
```

### `generate()`

Generates a new credential document of type [IVerifiableCredential]().

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
  expirationDate: '2027-12-10T18:30:00.000Z',
};
const credential = await hypersignVC.generate(credentialBody);
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
  "type": ["VerifiableCredential", "testSchema"],
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

Signs a credential document and registers [credential status](https://docs.hypersign.id/self-sovereign-identity-ssi/verifiable-credential-vc/credential-revocation-registry) on the Hypersign blockchain.

**API Definition**

```js
issue(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    privateKeyMultibase: string;
  }): Promise<{
    signedCredential: IVerifiableCredential,
    credentialStatus: CredentialStatus,
    credentialStatusProof: CredentialProof
    credentialStatusRegistrationResult?: DeliverTxResponse }>;
```

**Usage**

```js
const tempIssueCredentialBody = {
  credential, // unsigned credential generated using `generated()` method
  issuerDid: 'did:hid:testnet:zJ4aCsFKNtk2Ph4GzCiiqDDs2aAbDLbnRcRCrvjJWMq3X',
  verificationMethodId: 'did:hid:testnet:zJ4aCsFKNtk2Ph4GzCiiqDDs2aAbDLbnRcRCrvjJWMq3X#key-1',
  privateKeyMultibase: 'zrv4EUum4pk24tpCmWewukQeJXYKy47kiEt7Xqd9mofaXfYk6yF4XwEgynHxzNFhaMV4PVhm6g66ahpGrpT8eD8cVbP',
};

const issuedCredResult = await hypersignVC.issue(tempIssueCredentialBody);
const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } =
  issuedCredResult;
```

**Output**

```json
{
  "signedCredential": {
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
    "type": ["VerifiableCredential", "testSchema"],
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
  "credentialStatus": {
    "claim": {
      "id": "vc:hid:testnet:z2g2Ty13EYau1tLUJgJtZ5xcvLLcywwzX3H2785ro5HJW",
      "currentStatus": "Live",
      "statusReason": "Credential is active"
    },
    "issuer": "did:hid:testnet:z5DErRspu8PTZf8W8WNy35mKBpL9bryp1i58hGz1kBtLL",
    "issuanceDate": "2023-01-09T11:17:15Z",
    "expirationDate": "2027-12-10T18:30:00Z",
    "credentialHash": "2f8722f72bd9dc5d2ebe51104bdc5983a80c4e1f5a20e6ba4758162b2d910cac"
  },
  "credentialStatusProof": {
    "type": "Ed25519Signature2020",
    "created": "2023-01-09T11:17:16Z",
    "updated": "2023-01-09T11:17:16Z",
    "verificationMethod": "did:hid:testnet:z5DErRspu8PTZf8W8WNy35mKBpL9bryp1i58hGz1kBtLL#key-1",
    "proofValue": "F+PETguuXqJyfbWSimVEPlQ4pon815ovGVU9++aA2JhD8Yz/A2C02WQDqe1uztFDiQTZMtWqm5mNHrxCHHrrBw==",
    "proofPurpose": "assertion"
  },
  "credentialStatusRegistrationResult": {
    "code": 0,
    "height": 1482453,
    "rawLog": "[{\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/hypersignprotocol.hidnode.ssi.MsgRegisterCredentialStatus\"}]}]}]",
    "transactionHash": "59A3F0566C05853085EB3C4239857E77B6C658B0D929D11FA18AAA7B03AE6A50",
    "gasUsed": 92561,
    "gasWanted": 106334
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

#### `resolveCredentialStatus()`

Resolves credential status from Hypersign Blokchain and returns status of the credential of type [`CredentialStatus`]()

**API Definition**

```js
resolveCredentialStatus(params: { credentialId }): Promise<CredentialStatus>;

```

**Usage**

```js
const result = await hypersignVC.resolveCredentialStatus({ credentialId });
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

Supported status: `LIVE`, `SUSPENDED`, `REVOKED` and `EXPIRED`. Please read the [doc](https://docs.hypersign.id/self-sovereign-identity-ssi/verifiable-credential-vc/credential-revocation-registry#supported-vc-statuses) for more details about status.

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

## Security Concerns

// TODO
