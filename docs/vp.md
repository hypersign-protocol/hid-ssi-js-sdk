# Hypersign Verifiable Presentation

(W3C Verifiable Presentation Spec)[https://w3c-ccg.github.io/vp-request-spec/]

## Table of Contents

- [Install The Package](#install-the-package)
- [Import The Package](#import-the-package)
- [APIs](#apis)

  - [For KeyType Ed25519Signature2020](#for-keytype-ed25519signature2020)

    - [Initialize Instance of HypersignVerifiablePresentation with offlineSigner](#initialize-instance-of-hypersignverifiablepresentation)

    - [generate()](#generate)
    - [sign()](#sign)
    - [verify()](#verify)

  - [For KeyType EthereumEip712Signature2021](#for-keytype-ethereumeip712signature2021)
    - [Initialize Instance of HypersignVerifiablePresentation with offlineSigner](#initialize-instance-of-hypersignverifiablepresentation-1)
    - [signByClientSpec](#signbyclientspec)
    - [verifyByClientSpec](#verifybyclientspec)

- [Security Concerns](#security)

## Install The Package

```bash
npm i https://github.com/hypersign-protocol/hid-ssi-js-sdk  --save
```

## Import The Package

```js
import { HypersignVerifiablePresentation } from 'hs-ssi-sdk';
```

## APIs

### For Keytype Ed25519Signature2020

#### Initialize instance of HypersignVerifiablePresentation

```js
const hypersignVP = new HypersignVerifiablePresentation({
  nodeRestEndpoint: 'https://api.jagrat.hypersign.id', // OPTIONAL RPC endpoint of the Hypersign blockchain, Default 'TEST'
  nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id', // OPTIONAL REST endpoint of the Hypersign blockchain
  namespace: 'testnet', // OPTIONAL namespace of did, Default ''
});

// OR Just initalize without parameters
const hypersignVP = new HypersignVerifiablePresentation();
```

All operation in presentation are offchain. So need not to pass offlinesigner. However, we do need to pass RPC and REST endpoints to query states from blockchain

#### `generate()`

**API Definition**

```javascript
generate(params: {
      verifiableCredentials: Array<IVerifiableCredential>;
      holderDid: string }): Promise<object>;
```

**Usage**

```javascript
const params ={
  "verifiableCredentials": [
    {
      "@context": [
        ...
      ],
      "id": "vc:hid:testnet:zCx2XMG7Sk6GH8vK6jSJNpmhC4GEXxVwLGztfNNaftbd7",
      "type": [
        "VerifiableCredential",
        "testSchema"
      ],
      ...
      "proof": {
        "type": "Ed25519Signature2020",
        "created": "2023-01-12T08:03:51Z",
        "verificationMethod": "did:hid:testnet:z6XzWCZHcMaRXXPd9Qe3Dg4rNC7ARxVPKwzCfWvkTuUnE#key-1",
        "proofPurpose": "assertionMethod",
        "proofValue": "z4xbKv7BAgEhQ5vUavcmXci6fQ7ya8YcWSwPkBa6jKhzp8FV9YVsgVzPvjTYP7Pd7wJVZYAxEF5Fr9ZGppg1msbo9"
      }
    }
  ],
  "holderDid": "did:hid:testnet:z6XzWCZHcMaRXXPd9Qe3Dg4rNC7ARxVPKwzCfWvkTuUnE"
}

const unsignedverifiablePresentation = await hypersignVP.generate(params);

```

**Output**

```javascript
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": [
    "VerifiablePresentation"
  ],
  "verifiableCredential": [
    {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
          "hs": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zFcmv4HYjMLx5nMpyvK274G2RETwrfx1PoHAAct2qZ3Nz:1.0:"
        },
        {
          "name": "hs:name"
        },
        "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "id": "vc:hid:testnet:zCx2XMG7Sk6GH8vK6jSJNpmhC4GEXxVwLGztfNNaftbd7",
      "type": [
        "VerifiableCredential",
        "testSchema"
      ],
      "expirationDate": "2027-12-10T18:30:00Z",
      "issuanceDate": "2023-01-12T08:02:10Z",
      "issuer": "did:hid:testnet:z6XzWCZHcMaRXXPd9Qe3Dg4rNC7ARxVPKwzCfWvkTuUnE",
      "credentialSubject": {
        "name": "varsha",
        "id": "did:hid:testnet:z6XzWCZHcMaRXXPd9Qe3Dg4rNC7ARxVPKwzCfWvkTuUnE"
      },
      "credentialSchema": {
        "id": "sch:hid:testnet:zFcmv4HYjMLx5nMpyvK274G2RETwrfx1PoHAAct2qZ3Nz:1.0",
        "type": "JsonSchemaValidator2018"
      },
      "credentialStatus": {
        "id": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zCx2XMG7Sk6GH8vK6jSJNpmhC4GEXxVwLGztfNNaftbd7",
        "type": "CredentialStatusList2017"
      },
      "proof": {
        "type": "Ed25519Signature2020",
        "created": "2023-01-12T08:03:51Z",
        "verificationMethod": "did:hid:testnet:z6XzWCZHcMaRXXPd9Qe3Dg4rNC7ARxVPKwzCfWvkTuUnE#key-1",
        "proofPurpose": "assertionMethod",
        "proofValue": "z4xbKv7BAgEhQ5vUavcmXci6fQ7ya8YcWSwPkBa6jKhzp8FV9YVsgVzPvjTYP7Pd7wJVZYAxEF5Fr9ZGppg1msbo9"
      }
    }
  ],
  "id": "vp:hid:testnet:z2wRYtEJb99uzVPKdSLVwXfQ2Zg2henfcN2nrfKaf3KyB",
  "holder": "did:hid:testnet:z6XzWCZHcMaRXXPd9Qe3Dg4rNC7ARxVPKwzCfWvkTuUnE"
}
```

#### `sign()`

Signs a new presentation document and returns presentation document with proofs

**API Definition**

```javascript
sign(params: {
    presentation: IVerifiablePresentation;
    holderDid?: string;
    holderDidDocSigned?: JSON;
    verificationMethodId: string; // verificationMethodId of holder for assertion
    privateKeyMultibase: string;
    challenge: string;
  }): Promise<IVerifiablePresentation>
```

**Usage**

```javascript
const params = {
  presentation: unsignedverifiablePresentation,
  holderDid: didDocId,
  verificationMethodId,
  privateKeyMultibase,
  challenge,
};
const signedVerifiablePresentation = await hypersignVP.sign(params);
```

**Output**

```javascript
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "type": [
    "VerifiablePresentation"
  ],
  "verifiableCredential": [
    {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
          "hs": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:z91DkbUANCigwNn3mgSn9Gz8T7bXCzueMTBTXjGbYbhN9:1.0:"
        },
        {
          "name": "hs:name"
        },
        "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "id": "vc:hid:testnet:zxGTmp3HLcvyCLniu9wkf56VxXx7uKZYqJzre2Mmff3T",
      "type": [
        "VerifiableCredential",
        "testSchema"
      ],
      "expirationDate": "2027-12-10T18:30:00Z",
      "issuanceDate": "2023-01-12T08:14:09Z",
      "issuer": "did:hid:testnet:z48m2h2LpGVHJyaMUYXSX977feK8Ls7HKsW6H9bM4eX5t",
      "credentialSubject": {
        "name": "varsha",
        "id": "did:hid:testnet:z48m2h2LpGVHJyaMUYXSX977feK8Ls7HKsW6H9bM4eX5t"
      },
      "credentialSchema": {
        "id": "sch:hid:testnet:z91DkbUANCigwNn3mgSn9Gz8T7bXCzueMTBTXjGbYbhN9:1.0",
        "type": "JsonSchemaValidator2018"
      },
      "credentialStatus": {
        "id": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zxGTmp3HLcvyCLniu9wkf56VxXx7uKZYqJzre2Mmff3T",
        "type": "CredentialStatusList2017"
      },
      "proof": {
        "type": "Ed25519Signature2020",
        "created": "2023-01-12T08:15:51Z",
        "verificationMethod": "did:hid:testnet:z48m2h2LpGVHJyaMUYXSX977feK8Ls7HKsW6H9bM4eX5t#key-1",
        "proofPurpose": "assertionMethod",
        "proofValue": "z4RcWnkVqovuGRj3YvQgmEkhWaFJuPM766uxyFyj8vfVAJPysSvrvjVbXrThF1vZQLoDbtGod8w88aQvyiQ2yBsPD"
      }
    }
  ],
  "id": "vp:hid:testnet:zA7mMdtDWRs5Ewe7w6gwZtfcjtzYykqSudTEbWN2n1JXJ",
  "holder": "did:hid:testnet:z48m2h2LpGVHJyaMUYXSX977feK8Ls7HKsW6H9bM4eX5t",
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2023-01-12T08:16:01Z",
    "verificationMethod": "did:hid:testnet:z48m2h2LpGVHJyaMUYXSX977feK8Ls7HKsW6H9bM4eX5t#key-1",
    "proofPurpose": "authentication",
    "challenge": "1231231231",
    "proofValue": "z28YqAHgnq23aCDCDJ3Fetgj3feuY1HZyZApUhtfCRssYPjQRcEQNZ1RE56FaSUvpSkVGzw8NhkYXv8snQoS4QWaL"
  }
}
```

#### `verify()`

**API Definition**

```javascript
 verify(params: {
      signedPresentation: IVerifiablePresentation;
      challenge: string;
      domain?: string;
      issuerDid: string;
      holderDid: string;
      holderVerificationMethodId: string;
      issuerVerificationMethodId: string;
    }): Promise<object>;
```

**Usage**

```javascript
const params = {
  signedPresentation: signedVerifiablePresentation,
  issuerDid: didDocId,
  holderDid: didDocId,
  holderVerificationMethodId: verificationMethodId,
  issuerVerificationMethodId: verificationMethodId,
  challenge: '123-123-12-22',
};
const verifiedPresentationDetail = await hypersignVP.verify(params);
```

**Output**

```javascript
{
  "verified": true,
  "results": [
    {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "type": [
        "VerifiablePresentation"
      ],
      "verifiableCredential": [
        {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            {
              "hs": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zFwTgDsWwbtLR7meLvrat6KedPjtG9NJ5qKLjXZeY1XAS:1.0:"
            },
            {
              "name": "hs:name"
            },
            "https://w3id.org/security/suites/ed25519-2020/v1"
          ],
          "id": "vc:hid:testnet:z2uQipZuiLB6VHu6gc2Rf8QnJy6hSfEsZpTVLCXN988s4",
          "type": [
            "VerifiableCredential",
            "testSchema"
          ],
          "expirationDate": "2027-12-10T18:30:00Z",
          "issuanceDate": "2023-01-12T08:56:32Z",
          "issuer": "did:hid:testnet:zCPnBAhLCLGRoSzG49GSGoUJbuiNAm4JfRbweanxkeewN",
          "credentialSubject": {
            "name": "varsha",
            "id": "did:hid:testnet:zCPnBAhLCLGRoSzG49GSGoUJbuiNAm4JfRbweanxkeewN"
          },
          "credentialSchema": {
            "id": "sch:hid:testnet:zFwTgDsWwbtLR7meLvrat6KedPjtG9NJ5qKLjXZeY1XAS:1.0",
            "type": "JsonSchemaValidator2018"
          },
          "credentialStatus": {
            "id": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z2uQipZuiLB6VHu6gc2Rf8QnJy6hSfEsZpTVLCXN988s4",
            "type": "CredentialStatusList2017"
          },
          "proof": {
            "type": "Ed25519Signature2020",
            "created": "2023-01-12T08:58:14Z",
            "verificationMethod": "did:hid:testnet:zCPnBAhLCLGRoSzG49GSGoUJbuiNAm4JfRbweanxkeewN#key-1",
            "proofPurpose": "assertionMethod",
            "proofValue": "z4Xv5NCG9bSEXJSY4Uvye3Y8scSZbjPqbTWawN9p2nNC7VjTSvhG6czmNEDDgzLKpSspxywz7PrrR8ee3UZ7p9jjp"
          }
        }
      ],
      "id": "vp:hid:testnet:zJ62Ss8roaTCAVjniUJz7L586KYqPo4cUh1xE16daTG3N",
      "holder": "did:hid:testnet:zCPnBAhLCLGRoSzG49GSGoUJbuiNAm4JfRbweanxkeewN",
      "proof": {
        "type": "Ed25519Signature2020",
        "created": "2023-01-12T08:58:25Z",
        "verificationMethod": "did:hid:testnet:zCPnBAhLCLGRoSzG49GSGoUJbuiNAm4JfRbweanxkeewN#key-1",
        "proofPurpose": "authentication",
        "challenge": "1231231231",
        "proofValue": "z4EBoSuytpj2DgNSsPcWKH9Q143w4fQPaeyuhEgj85kpUB6TCWzSWNubLVr8HeNGThS2A312DDcF9mRZ5awezo2Xy"
      }
    }
  ],
  "credentialResults": [
    {
      "verified": true,
      "results": [
        {
          "proof": {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              {
                "hs": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zFwTgDsWwbtLR7meLvrat6KedPjtG9NJ5qKLjXZeY1XAS:1.0:"
              },
              {
                "name": "hs:name"
              },
              "https://w3id.org/security/suites/ed25519-2020/v1"
            ],
            "type": "Ed25519Signature2020",
            "created": "2023-01-12T08:58:14Z",
            "verificationMethod": "did:hid:testnet:zCPnBAhLCLGRoSzG49GSGoUJbuiNAm4JfRbweanxkeewN#key-1",
            "proofPurpose": "assertionMethod",
            "proofValue": "z4Xv5NCG9bSEXJSY4Uvye3Y8scSZbjPqbTWawN9p2nNC7VjTSvhG6czmNEDDgzLKpSspxywz7PrrR8ee3UZ7p9jjp"
          },
          "verified": true,
          "verificationMethod": {
            "id": "did:hid:testnet:zCPnBAhLCLGRoSzG49GSGoUJbuiNAm4JfRbweanxkeewN#key-1",
            "type": "Ed25519VerificationKey2020",
            "controller": "did:hid:testnet:zCPnBAhLCLGRoSzG49GSGoUJbuiNAm4JfRbweanxkeewN",
            "publicKeyMultibase": "z6Mkqr3DkwadfovGZV6kpqQ7eZrbjHe2AwZ27craR4vmZsik"
          },
          "purposeResult": {
            "valid": true,
            "controller": {
              "@context": "https://w3id.org/security/v2",
              "id": "did:hid:testnet:zCPnBAhLCLGRoSzG49GSGoUJbuiNAm4JfRbweanxkeewN",
              "assertionMethod": [
                "did:hid:testnet:zCPnBAhLCLGRoSzG49GSGoUJbuiNAm4JfRbweanxkeewN#key-1"
              ]
            }
          }
        }
      ],
      "statusResult": {
        "verified": true
      },
      "credentialId": "vc:hid:testnet:z2uQipZuiLB6VHu6gc2Rf8QnJy6hSfEsZpTVLCXN988s4"
    }
  ]
}

```

### For KeyType EthereumEip712Signature2021

#### Initialize instance of HypersignVerifiablePresentation

```js
const hypersignVP = new HypersignVerifiablePresentation({
  nodeRestEndpoint: 'https://api.jagrat.hypersign.id', // OPTIONAL RPC endpoint of the Hypersign blockchain, Default 'TEST'
  nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id', // OPTIONAL REST endpoint of the Hypersign blockchain
  namespace: 'testnet', // OPTIONAL namespace of did, Default ''
});

// OR Just initalize without parameters
const hypersignVP = new HypersignVerifiablePresentation();
```

#### `signByClientSpec()`

**API Definition**

```js
signByClientSpec(params: {
    presentation: IVerifiablePresentation;
    holderDid?: string;
    verificationMethodId: string;
    web3Obj;
    domain?: string;
    challenge?: string;
  }): Promise<IVerifiablePresentation>
```

**Usage**

```js
const params = {
  presentation,
  holderDid, // did of the holder
  verificationMethodId,
  web3Obj, // web3 object
  domain,
  challenge,
};

const signedPresentation = await hypersignVP.signByClientSpec(params);
```

##### Generating web3 object

```js
import Web3 from 'web3';
const web3Obj = new Web3(window.ethereum);
```

**Output**

```js
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": [
    "VerifiablePresentation"
  ],
  "verifiableCredential": [
    "{\"@context\":[\"https://www.w3.org/2018/credentials/v1\",\"https://schema.org\"],\"credentialStatus\":{\"id\":\"https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zDsY1X5Egzg17TDBVHLw61QMx2BRMRbkz2fEG9gYrTxeW\",\"type\":\"CredentialStatusList2017\"},\"credentialSubject\":{\"id\":\"did:hid:testnet:0xF4E742C2247744E3B6Bb08D27Fdfbb7C3B135C2C\",\"name\":\"varsha\"},\"expirationDate\":\"2027-12-10T18:30:00Z\",\"id\":\"vc:hid:testnet:zDsY1X5Egzg17TDBVHLw61QMx2BRMRbkz2fEG9gYrTxeW\",\"issuanceDate\":\"2023-07-14T09:40:30Z\",\"issuer\":\"did:hid:testnet:0xF4E742C2247744E3B6Bb08D27Fdfbb7C3B135C2C\",\"proof\":{\"canonicalizationHash\":\"14173e47163468b030416d0b2f940ae3ba30545207fa7712590d2ac4830bb33d\",\"created\":\"2023-07-14T09:42:20Z\",\"eip712\":{\"domain\":{},\"primaryType\":\"Document\",\"types\":{\"CredentialStatus\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"type\",\"type\":\"string\"}],\"CredentialSubject\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"name\",\"type\":\"string\"}],\"Document\":[{\"name\":\"@context\",\"type\":\"string[]\"},{\"name\":\"credentialStatus\",\"type\":\"CredentialStatus\"},{\"name\":\"credentialSubject\",\"type\":\"CredentialSubject\"},{\"name\":\"expirationDate\",\"type\":\"string\"},{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"issuanceDate\",\"type\":\"string\"},{\"name\":\"issuer\",\"type\":\"string\"},{\"name\":\"type\",\"type\":\"string[]\"}]}},\"proofPurpose\":\"assertionMethod\",\"proofValue\":\"0x940f17b44cb863b618f4c7f348df071d3f29f2c4375f5a84e00e092b583f433e1d35cee0f5a0eb8a951cb03abd0bd426d9b86527bac3d805992f1a3e23a69c1d1c\",\"type\":\"EthereumEip712Signature2021\",\"verificationMethod\":\"did:hid:testnet:0xF4E742C2247744E3B6Bb08D27Fdfbb7C3B135C2C#key-1\"},\"type\":[\"VerifiableCredential\",\"Person\"]}"
  ],
  "id": "vp:hid:testnet:z9bVxWZWmE55zGkPjWGusFbGAYF2vVb8jHepaxCgPAH7g",
  "holder": "did:hid:testnet:0xF4E742C2247744E3B6Bb08D27Fdfbb7C3B135C2C",
  "proof": {
    "canonicalizationHash": "d8fee6e2fddc8d1da1aaa7bc97d7bbd0e84f516824307cfc46d4add1a9b13e26",
    "challenge": "dhejglgk",
    "created": "2023-07-14T09:43:12Z",
    "proofPurpose": "authentication",
    "type": "EthereumEip712Signature2021",
    "verificationMethod": "did:hid:testnet:0xF4E742C2247744E3B6Bb08D27Fdfbb7C3B135C2C#key-1",
    "proofValue": "0xc22db7a9cd6f906f31c18156daf99869484ff48fe5c781e9ae2603e6489a098c0d31ff83589773e3ffe2fcefc69dbd39e56791ada2372a93face7c4f1ac370e51c",
    "eip712": {
      "domain": {},
      "types": {
        "Document": [
          {
            "name": "@context",
            "type": "string[]"
          },
          {
            "name": "holder",
            "type": "string"
          },
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "type",
            "type": "string[]"
          },
          {
            "name": "verifiableCredential",
            "type": "string[]"
          }
        ]
      },
      "primaryType": "Document"
    }
  }
}
```

#### `verifyByClientSpec()`

**API Definition**

```js
verifyByClientSpec({
    signedPresentation: IVerifiablePresentation;
    challenge?: string;
    domain?: string;
    issuerDid: string;
    holderDid?: string;
    holderDidDocSigned?: JSON;
    holderVerificationMethodId: string; // verificationMethodId of holder for authentication
    issuerVerificationMethodId: string;
    web3Obj;
      })

```

**Usage**

```js
const params = {
  signedPresentation: verifyResult,
  challenge,
  domain,
  issuerDid, // did of the issuer
  holderDid, // did of the holder
  holderVerificationMethodId,
  issuerVerificationMethodId,
  web3Obj, // web3 object
};

const result = await hypersignVP.verifyByClientSpec(params);
```

##### Generating web3 object

```js
import Web3 from 'web3';
const web3Obj = new Web3(window.ethereum);
```

**Output**

```js
{
  "verified": true,
  "credentialResults": [
    {
      "verified": false,
      "results": [
        {
          "proof": {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              {
                "hs": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zufjU7LuQuJNFiUpuhCwYkTrakUu1VmtxE9SPi5TwfUB:1.0:"
              },
              {
                "name": "hs:name"
              },
              {
                "email": "hs:email"
              },
              "https://w3id.org/security/suites/ed25519-2020/v1"
            ],
            "created": "2023-07-14T11:46:49Z",
            "proofPurpose": "assertionMethod",
            "proofValue": "z3UAYVfE5WjbF8p3ReSgg88zDxJzVWgPgJZAQCmpQHSjYuGCM1giia5RqRRhJi3d6DeTbz7X3Lvm4MCH3r9mLowqj",
            "type": "Ed25519Signature2020",
            "verificationMethod": "did:hid:testnet:z49oshjFRVej8tWzfShGSnB3w1DN3gjUaXuUFR2BVJJeC#key-1"
          },
          "verified": true,
          "verificationMethod": {
            "id": "did:hid:testnet:z49oshjFRVej8tWzfShGSnB3w1DN3gjUaXuUFR2BVJJeC#key-1",
            "type": "Ed25519VerificationKey2020",
            "controller": "did:hid:testnet:z49oshjFRVej8tWzfShGSnB3w1DN3gjUaXuUFR2BVJJeC",
            "publicKeyMultibase": "z6Mkhc4vHyVrqCDc11qN8GEHdGbvpndu6ciwDvPBFJ9WDXRa"
          },
          "purposeResult": {
            "valid": true
          }
        }
      ],
      "statusResult": {
        "verified": false
      }
    }
  ],
  "presentationResult": {
    "verified": true,
    "results": [
      {
        "proof": {
          "canonicalizationHash": "108c0a4f7fd07a951eb1774af0b9c2dbffdaf9c15d2cffa33ed8447fc69ddafc",
          "challenge": "1223121",
          "created": "2023-07-14T13:04:34Z",
          "domain": "www.hypersign.id",
          "proofPurpose": "authentication",
          "type": "EthereumEip712Signature2021",
          "verificationMethod": "did:hid:testnet:0xbc1334d4aeC6F0c5D7F438080F8d82C85F4D8af7#key-1",
          "proofValue": "0x96b1113905dbfd61fb54ec18d112e395fdd66eb4266fdd3d1cacbec3b7cff65a7851e41b3d2912a5e89b2089ea0ce8a8d87d42f2ae34d3016e8308e169396b821b",
          "eip712": {
            "domain": {
              "name": "www.hypersign.id"
            },
            "types": {
              "Document": [
                {
                  "name": "@context",
                  "type": "string[]"
                },
                {
                  "name": "holder",
                  "type": "string"
                },
                {
                  "name": "id",
                  "type": "string"
                },
                {
                  "name": "type",
                  "type": "string[]"
                },
                {
                  "name": "verifiableCredential",
                  "type": "string[]"
                }
              ]
            },
            "primaryType": "Document"
          }
        },
        "verified": true,
        "verficationMethod": "did:hid:testnet:0xbc1334d4aeC6F0c5D7F438080F8d82C85F4D8af7#key-1",
        "purposeResult": {
          "valid": true
        }
      }
    ],
    "statusResult": {
      "canonicalizationHashVerified": true,
      "signatureVerified": true
    }
  },
  "error": null
}
```
