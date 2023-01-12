# Hypersign Self Soverign Identity (SSI) SDK

This SDK is an implementation of proposed [DID](https://www.w3.org/TR/did-core/) framework by the [W3C Credential Community Group](https://w3c-ccg.github.io/).  

## Building

```sh
npm i
npm run build
```

## Testing

```bash
## Run this to test all features 
npm run test

## OR Run individual test cases 
npm run test-did
npm run test-schema
npm run test-credential
npm run test-presentation
```


## Install

```js
npm i hs-ssi-sdk --save
```

## Usage

```javascript
// Import SSI SDK
import { HypersignSsiSDK } from "hs-ssi-sdk";

// Instantiate SSI SDK
const hsSdk = new HypersignSsiSDK(
  offlineSigner,
  namespace: 'testnet'
  nodeRpcEndpoint: "http://localhost:26657",  // RPC
  nodeRestEndpoint: "http://localhost:1317"   // REST Endpoint
);
// Mandatory method call to initialize offlineSigner
await hsSdk.init();

// Exposes these 4 instance of objects
const hypersignDID: HypersignDID = hsSdk.did;
const hypersignVC: HypersignVerifiableCredential = hsSdk.vc;
const hypersignVP: HypersignVerifiablePresentation = hsSdk.vp;
const hypersignSchema: HypersignSchema = hsSdk.schema;
```

## APIs

### Hypersign DID SDK

Read [documentation](/docs/did.md) 

### Hypersign Schema SDK
 
Read [documentation](/docs/schema.md)

### Hypersign Verifiable Credential SDK

Read [documentation](/docs/vc.md) 

### Hypersign Verifiable Presentation SDK

Read [documentation](/docs/vp.md) 

## Issue

This sdk is in highly under development. In case you find any bug, kindly report it ASAP. Thank You!
