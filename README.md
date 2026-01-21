# Hypersign Self Soverign Identity (SSI) SDK  ![Build](https://github.com/hypersign-protocol/hid-ssi-js-sdk/workflows/Build/badge.svg)

This SDK is an implementation of proposed [DID](https://www.w3.org/TR/did-core/) framework by the [W3C Credential Community Group](https://w3c-ccg.github.io/).  

## Building

```sh
npm i
npm run build
```

## Testing

### Run Tests (with required configuration)

Tests require blockchain configuration values. Pass them as environment variables:

```bash
## Run all tests with custom configuration
RPC_ENDPOINT=https://rpc.prajna-1.hypersign.id \
REST_ENDPOINT=https://api.prajna-1.hypersign.id \
NAMESPACE=testnet \
MNEMONIC="your-wallet-mnemonic" \
npm run test

## OR Run individual test cases with configuration
RPC_ENDPOINT=https://rpc.prajna-1.hypersign.id \
REST_ENDPOINT=https://api.prajna-1.hypersign.id \
NAMESPACE=testnet \
MNEMONIC="your-wallet-mnemonic" \
npm run test-did

RPC_ENDPOINT=https://rpc.prajna-1.hypersign.id \
REST_ENDPOINT=https://api.prajna-1.hypersign.id \
NAMESPACE=testnet \
MNEMONIC="your-wallet-mnemonic" \
npm run test-schema

RPC_ENDPOINT=https://rpc.prajna-1.hypersign.id \
REST_ENDPOINT=https://api.prajna-1.hypersign.id \
NAMESPACE=testnet \
MNEMONIC="your-wallet-mnemonic" \
npm run test-credential

RPC_ENDPOINT=https://rpc.prajna-1.hypersign.id \
REST_ENDPOINT=https://api.prajna-1.hypersign.id \
NAMESPACE=testnet \
MNEMONIC="your-wallet-mnemonic" \
npm run test-presentation
```

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `RPC_ENDPOINT` | Blockchain RPC endpoint | `https://rpc.prajna-1.hypersign.id` |
| `REST_ENDPOINT` | Blockchain REST endpoint | `https://api.prajna-1.hypersign.id` |
| `NAMESPACE` | Blockchain namespace | `testnet` |
| `MNEMONIC` | Wallet mnemonic (must have balance for transactions) | `verify sustain lumber boat...` |

## Install

```js
npm i https://github.com/hypersign-protocol/hid-ssi-js-sdk  --save
```
**Supported node version: ^v16**

## Usage

```javascript
// Import SSI SDK
import { HypersignSSISdk } from "hs-ssi-sdk";

// Instantiate SSI SDK
const hsSdk = new HypersignSSISdk(
  offlineSigner,
  namespace: 'testnet'
  nodeRpcEndpoint: "https://rpc.jagrat.hypersign.id",  // RPC
  nodeRestEndpoint: "https://api.jagrat.hypersign.id"   // REST Endpoint
);
// Mandatory method call to initialize offlineSigner
await hsSdk.init();

// Exposes these 4 instance of objects
const hypersignDID: HypersignDID = hsSdk.did;
const hypersignVC: HypersignVerifiableCredential = hsSdk.vc;
const hypersignVP: HypersignVerifiablePresentation = hsSdk.vp;
const hypersignSchema: HypersignSchema = hsSdk.schema;
```

### OfflineSigner 

You may follow this [this code snnipet](https://github.com/hypersign-protocol/hid-ssi-js-sdk/blob/develop/src/tests/config.ts) for creating OfflineSigner 

```js
offlineSigner = await createWallet(mnemonic);
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
