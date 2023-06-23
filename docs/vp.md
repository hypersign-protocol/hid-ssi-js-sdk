# Hypersign Verifiable Presentation
(W3C Verifiable Presentation Spec)[https://w3c-ccg.github.io/vp-request-spec/]


## Table of Contents
- [Install The Package](#install-the-package)
- [Import The Package](#import-the-package)
- [APIs](#apis)
    - [Initialize Instance of HypersignVerifiablePresentation with offlineSigner](#initialize-instance-of-hypersignverifiablepresentation-with-offlinesigner)
    - [generate()](#generate)
    - [sign()](#sign)   
    - [verify()](#sign)   
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

### Initialize instance of HypersignVerifiablePresentation 

```js
const hypersignVP = new HypersignVerifiablePresentation({
    nodeRestEndpoint: 'https://api.jagrat.hypersign.id', // OPTIONAL RPC endpoint of the Hypersign blockchain, Default 'TEST'
    nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id',   // OPTIONAL REST endpoint of the Hypersign blockchain
    namespace: 'testnet',   // OPTIONAL namespace of did, Default ''
  });

// OR Just initalize without parameters
const hypersignVP = new HypersignVerifiablePresentation()
```

All operation in presentation are offchain. So need not to pass offlinesigner. However, we do need to pass RPC and REST endpoints to query states from blockchain

### `generate()` 

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

### `sign()` 

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
    }
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

### `verify()` 


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
    signedPresentation : signedVerifiablePresentation,
    issuerDid : didDocId,
    holderDid : didDocId,
    holderVerificationMethodId: verificationMethodId,
    issuerVerificationMethodId: verificationMethodId,
    challenge: '123-123-12-22'
}
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


