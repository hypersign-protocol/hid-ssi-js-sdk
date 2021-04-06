
# Hypersign Self Soverrign Js SDK

This sdk is an implementation of proposed [DID](https://www.w3.org/TR/did-core/) framework by the [W3C Credential Community Group](https://w3c-ccg.github.io/)

## Building

```sh
git submodule update --init --recursive
cd libs/vc-js && npm i && cd -
npm i 
npm run build
npm run test
```

## APIs




## Usage

> npm i --save lds-sdk


```js
const hsdk =  require('lds-sdk')
const options = { nodeUrl: "http://localhost:5000",  didScheme:  "did:v2:hs"}
const sdkVc = hsdk.credential(options) // for verifiable credential and presentaion realted
const sdkDid = hsdk.did(options) // for did related
```

## Issue

This sdk is in highly under developement. In case you find any bug, kindly report it ASAP. Thank You!



