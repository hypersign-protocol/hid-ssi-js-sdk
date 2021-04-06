
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
## Usage

Install


```js
npm i hs-ssi-sdk --save
```


Use

```js
// import
import HypersignSsiSDK from 'hs-ssi-sdk';

// initialise
const hsSdk = new HypersignSsiSDK(
    { nodeUrl: "http://localhost:5000" } // Hypersign node url
); 

const { did, schema, credential } = hsSdk;
```


## APIs

### hsSdk.did

```js
    didUrl: string;
    generateKeys(): object;
    getDidDocAndKeys(user: object): Promise<any>;
    getDid(options: IDIDOptions): Promise<any>;
    register(didDoc: object): Promise<any>;
    resolve(did: string): Promise<any>;
    verify(params: IParams): Promise<any>;
    sign(params: IParams): Promise<any>;
```

### hsSdk.schema

```js
    schemaUrl: string;
    generateSchema({ name, author, description, properties }: ISchema): Promise<ISchemaTemplate>;
    registerSchema(schema: ISchemaTemplate): Promise<any>;
    getSchema(schemaId: string): Promise<any>;

```

### hsSdk.credential

```js
    generateCredential(schemaUrl, params: { subjectDid, issuerDid, expirationDate, attributesMap: Object }): Promise<any>;
    signCredential(credential, issuerDid, privateKey): Promise<any>;
    verifyCredential(credential: object, issuerDid: string): Promise<any>;
    generatePresentation(verifiableCredential, holderDid): Promise<any> ;
    signPresentation(presentation, holderDid, privateKey, challenge): Promise<any> 
    verifyPresentation({ presentation, challenge, domain, issuerDid, holderDid }) : Promise<any>
```

## Issue

This sdk is in highly under development. In case you find any bug, kindly report it ASAP. Thank You!



