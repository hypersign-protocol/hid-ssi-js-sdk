# Hypersign Self Soverign Identity (SSI) Js SDK

This sdk is an implementation of proposed [DID](https://www.w3.org/TR/did-core/) framework by the [W3C Credential Community Group](https://w3c-ccg.github.io/)

## Building

```sh
git submodule update --init --recursive
cd libs/vc-js && npm i && cd -
npm i
npm run build
npm run test
```

## Install

```js
npm i hs-ssi-sdk --save
```

## Usage

```js
import HypersignSsiSDK from "hs-ssi-sdk";
const hsSdk = new HypersignSsiSDK(
  offlineSigner,
  "http://localhost:26657", // RPC
  "http://localhost:1317"  // REST Endpoint
);
const { did, schema, vc, vp } = hsSdk;
```

## APIs

### hsSdk.did

```js
    generateKeys(params: { seed:string }): Promise<{ privateKeyMultibase: string, publicKeyMultibase: string }>;
    generate(params: { publicKeyMultibase: string }): string;
    register(params: { 
        didDocString: string , 
        privateKeyMultibase: string, 
        verificationMethodId: string 
    }): Promise<any>;
    resolve(params: { did: string }): Promise<any>;
    update(params: { 
        didDocString: string
        privateKeyMultibase: string
        verificationMethodId: string
        versionId: string 
    }): Promise<any>;
    deactivate(params: { 
        didDocString: string
        privateKeyMultibase: string
        verificationMethodId: string
        versionId: string 
    }): Promise<any>;
```

### hsSdk.schema

```js
  getSchema(params: {
    name: string;
    description?: string;
    author: string;
    fields?: Array<ISchemaFields>;
    additionalProperties: boolean;
  }): Schema;

  signSchema(params: {
    privateKey: string;
    schema: ISchemaProto;
  }): Promise<any>;

  registerSchema(params: {
    schema: Schema;
    signature: string;
    verificationMethodId: string;
  }): Promise<any>;

```

### hsSdk.vc

```js
  getCredential(params: {
    schemaId: string;
    subjectDid: string;
    issuerDid: string;
    expirationDate: string;
    fields: Object;
  }): Promise<IVerifiableCredential>;
  signCredential(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    privateKey: string;
  }): Promise<any>;
  verifyCredential(params: { 
    credential: IVerifiableCredential,
    issuerDid: string
  }): Promise<any>;
```

### hsSdk.vp

```js
  getPresentation(params: {
    verifiableCredential: IVerifiableCredential;
    holderDid: string;
  }): Promise<any>;
  signPresentation(params: {
    presentation: IVerifiablePresentation;
    holderDid: string;
    privateKey: string;
    challenge: string;
  }): Promise<any>;
  verifyPresentation(params: {
    signedPresentation: IVerifiablePresentation ,
    challenge: string,
    domain?: string,
    issuerDid: string,
    holderDid: string,
  }): Promise<any>;

```

## Issue

This sdk is in highly under development. In case you find any bug, kindly report it ASAP. Thank You!
