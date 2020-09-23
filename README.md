> This is test library. Please do not use it for production!

# Hs-Lds-SDK

## Building

```sh
git submodule update --init --recursive
cd libs/vc-js && npm i && cd -
npm i 
npm run build
npm run test
```

## Usage

> npm i --save lds-sdk


```js
const hsdk =  require('lds-sdk')
const options = { nodeUrl: "http://localhost:5000",  didScheme:  "did:v2:hs"}
const sdkVc = hsdk.credential(options) // for verifiable credential and presentaion realted
const sdkDid = hsdk.did(options) // for did related
```
