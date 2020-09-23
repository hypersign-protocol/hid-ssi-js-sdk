# Installation and usage

## Installation

```sh
git submodule update --init --recursive
cd libs/vc-js && npm i && cd -
npm i
npm run build
npm run test
```

## Usage

```js
const lib = require('../dist/vc')
const { generateCredential, signCredential, verifyCredential, generatePresentation, signPresentation, verifyPresentation} = lib

const challenge = "ch_adbshd131323"
let sCredential = {}
const schemaUrl = "http://localhost:5000/api/schema/get/sch_fd98d73c-00ef-41"
const attributesMap = {
 name: "Vishwas Anand",
 email: "yahiwa5710@99mimpi.com",
 phoneNumber: "+91-1111-0000-2222",
 addresss: "4th cross, LA",
}

const issuerKeys = {"publicKey":{"@context":"https://w3id.org/security/v2","id":"did:hs:45366005-5fe7-4efe-8581-ef73201a3bc4#z6Mkn8haqXgd9jotYHVsiKvtLR6MVrD9zkngdSMrDLG7rvqg","type":"Ed25519VerificationKey2018","publicKeyBase58":"8gSYFHSBpCKRRnfB2ky3VKYMgGwJasYKwRSvP4J6wi4J"},"privateKeyBase58":"6UtVLp9duZhkuEfks8kMZDpqrGDjGL5ztURxMfxxY9yXQGYs7dxR1dSMPXHjWaLaeMcKzkGqS6U3tTRWGBZWSmY"}
const holderKeys = {"publicKey":{"@context":"https://w3id.org/security/v2","id":"did:hs:56c5952c-bf3a-490c-b601-69ba8c5633bb#z6MknGwtercwdjHSzoZRVgqksER7R5YV5Jp6BEZHpRtJ1Q6m","type":"Ed25519VerificationKey2018","publicKeyBase58":"8pgr4cNWJBnytJiip7sv28s7bWGdfRZjVDeMz9vH6BKP"},"privateKeyBase58":"k21g6A34T2knufDA2ahqd4tphWTzPpz7HJhiEHnde9oNGiWSnTdourPj7AjbgLN7AWgEhtaogYzhfqkh2rbC8rm"}

generateCredential(schemaUrl, {
    subjectDid: holderKeys.publicKey.id,
    issuerDid: issuerKeys.publicKey.id,
    expirationDate: new Date().toISOString(),
    attributesMap
}).then(credential => {
    console.log(credential)
    console.log("Credentials end=======================================")
    console.log("SignedCredential start=======================================")
    return signCredential(credential, issuerKeys.publicKey.id, issuerKeys.privateKeyBase58)
}).then(signedCredential => {
    console.log(signedCredential)
    sCredential = signedCredential;
    console.log("SignedCredential end=======================================")
    console.log("VerifyCredential start=======================================")
    return verifyCredential(signedCredential, issuerKeys.publicKey.id)
}).then(result => {
    console.log(result)
    console.log("VerifyCredential end=======================================")
    console.log("Presentation start=======================================")
    return generatePresentation(sCredential, holderKeys.publicKey.id)
})
.then(presentation => {
    console.log(presentation)
    console.log("Presentation end=======================================")
    console.log("SignedPresentation start=======================================")
    return signPresentation(presentation, holderKeys.publicKey.id, holderKeys.privateKeyBase58, challenge)
})
.then(signedPresentation => {
    console.log(JSON.stringify(signedPresentation, null, 2))
    console.log("SignedPresentation end=======================================")
    console.log("VerifyPresentation start=======================================")
    return verifyPresentation({presentation: signedPresentation, challenge, issuerDid: issuerKeys.publicKey.id, holderDid: holderKeys.publicKey.id})
})
.then(result => {
    console.log(JSON.stringify(result, null, 2))
    console.log("VerifyPresentation end=======================================")
})
.catch(e => {
    console.log(e)
})
```


# Linked Data Signature

Simple Demo of linked data signature

## Linked Data 

The term Linked Data is used to describe a recommended best practice for exposing, sharing, and connecting information on the Web using standards, such as URLs, to identify things and their properties. When information is presented as Linked Data, other related information can be easily discovered and new information can be easily linked to it. Linked Data is extensible in a decentralized way, greatly reducing barriers to large scale integration. 

## Linked Data Signature 

With the increase in usage of Linked Data for a variety of applications, there is a need to be able to verify the authenticity and integrity of Linked Data documents. That authenticity and integrity can be maintained by appending a *proof*, by specifying a [signature suite](#signature-suites) and a [proof purpose](#proof-purpose), with the linked data which can further be verified by verifer using signature suites.

### Signature Suites

The signature suite performs the cryptographic operation required to sign (or verify) a digital signature and includes information in a proof such as the `verificationMethod` identifier (aka creator) and the date the proof was created (aka created).

Its essentially a set of cryptographic primitives typically consisting of a [canonicalization algorithm](https://w3c-ccg.github.io/lds-ed25519-2018/#dfn-canonicalization-algorithm), a [message digest algorithm](https://w3c-ccg.github.io/lds-ed25519-2018/#dfn-message-digest-algorithm), and a [signature algorithm](https://w3c-ccg.github.io/lds-ed25519-2018/#dfn-signature-algorithm) that are bundled together by cryptographers for developers for the purposes of safety and convenience. 
   - Example: 

      - `[Ed25519Signature2018](https://w3c-ccg.github.io/lds-ed25519-2018/)` : Uses SHA-512 as mseesage digest algo and ED25519 as signature algorithm
      - `RsaSignature2018`
      - `EcdsaSecp256k1Signature2019`
      - `JwsLinkedDataSignature`
      - etc

   - [Here](https://w3c-ccg.github.io/ld-cryptosuite-registry/#introduction) is list of cryptographic suites

### Proof Purpose

The specific intent for the proof, the reason why an entity created it. Acts as a safeguard to prevent the proof from being misused for a purpose other than the one it was intended for. For example, a proof can be used for purposes of `authentication` , for asserting control of a Verifiable Credential ( `assertionMethod` ), and several others.

  + `authentication` : Indicates that a given proof is only to be used for the purposes of an authentication protocol.
  + `assertionMethod` : Indicates that a proof can only be used for making assertions, for example signing a Verifiable Credential. 
  + `keyAgreement` : Indicates that a proof is used for for key agreement protocols, such as Elliptic Curve Diffie Hellman key agreement used by popular encryption libraries.
  + `contractAgreement` : Indicates that a proof is used for proofs that an entity agrees to a contract. 

We can read more [here](https://w3c-ccg.github.io/ld-proofs/#proof-purpose)

## Demo

Now that we know the basic concept of Linked Data Signature, lets see how it can be implemented. For the purpose of demonstration we will use `Ed25519Signature2018` crypto suite and the purpose for the signature would be `autentication` . We need to do the following:

1. [Generating cryptographic materials](#generating-cryptographic-materials)
2. [Signing the sample doc](#signing-the-sample-doc)
3. [Verifying the signed doc](#verifying-the-signed-doc)

We will use the [`jsonld-signature`](https://github.com/digitalbazaar/jsonld-signatures) and [`crypto-ld`](https://github.com/digitalbazaar/crypto-ld) libraries for our demonstration.

### Sample Doc

``` js
const doc = {
    "@context": ["https://schema.org"],
    "@type": "https://schema.org/Person",
    "name": "Vishwas Anand",
    "url": "https://vishwas.netlify.app/",
    "image": "https://vishwas.netlify.app/author/admin/avatar_hu885ecffc73ca9d603f6cfbf02ec70754_85745_250x250_fill_q90_lanczos_center.jpg",
    "description": "Vishwas Anand is a developer turned researcher at Imaginea Labs. His research works include in the field of Blockchain, Cryptography and Security",
    "birthdate": "1993-11-16",
    "jobTitle": "Software Engineer"
}
```

### Generating cryptographic materials

``` js
const { Ed25519KeyPair } = require('crypto-ld');
const kp = await Ed25519KeyPair.generate();
```

Result:

``` js
{
    id: 'did:hsauth:id#z6Mkm1QRKxggW66ZWW5mYbmpedBRAPv1W59S2yvYTadRuRuP',
    type: 'Ed25519VerificationKey2018',
    publicKeyBase58: '7Z9NjiSFAYc6Q1F4s2oyoXdRLpeA6Bu5Ly1cdJfQzD81',
    privateKeyBase58: '4DbGx1U39DWThdqywGjP6zUGcTRyAEdKa3drBV48E7bVxC2W3KeuAQySuTae4EohyPEwHzq4uT9ExXWBasw4vPBB'
}
```

#### Controller (The user)

Using the above crypto material we can define controller. A controller is an object that contains authorization relations that explicitly permit the use of certain verification methods (identifier for publickey) for specific purposes. For example, a controller object could contain statements that restrict a public key to being used *only for signing Verifiable Credentials* and no other kinds of documents. Or it could contain statement that restrict publick key to used for *only for authentication* -  see the example below.

``` js
const controller = {
    '@context': 'https://w3id.org/security/v2',
    id: 'did:hsauth:vishwas',
    // A user can have multiple publicKeys for different purposes
    publicKey: [{
        '@context': 'https://w3id.org/security/v2',
        id: 'did:hsauth:vishwas#z6MknpatYMfHz3di8zdbHcWZfBHz4VDNfvmDD27Uf5eqZ6Aq',
        type: 'Ed25519VerificationKey2018',
        publicKeyBase58: '9NKqx7QreW9F2Vntc3Yip5jzEuwXG3WrX1CYpogpdsPT'
    }],
    // Specifies that these keys can only be used for authentication purpose.
    authentication: [
        'did:hsauth:vishwas#z6MknpatYMfHz3di8zdbHcWZfBHz4VDNfvmDD27Uf5eqZ6Aq'
    ]
}
```

### Signing the sample doc

1. Import the `jsonld-signature` library.

```js
const jsonSigs =  require('jsonld-signatures')
const { AuthenticationProofPurpose } = jsonSigs.purposes;
const { Ed25519Signature2018 } = jsonSigs.suites;
```

2. Get the cryptoSuite and purpose. Let's choose `Ed25519Signature2018` for suite and `authentication` as proof purpose.

``` js
const cryptoSuite = new Ed25519Signature2018({
    verificationMethod: id,
    key: new Ed25519KeyPair({
        privateKeyBase58,
        controller.publicKey[0]
    })
});

const purpose = new AuthenticationProofPurpose({
    challenge: 'ABC',
    domain: 'example.com'
})
```

3. Now that we have cryptosuite and purpose ready, lets go and sign our doument.

``` js
const signed_doc = await jsonSigs.sign(doc, {
    cryptoSuite,
    purpose
})
```

Result:

``` json
{
   "@context":[
      "https://schema.org",
      "https://w3id.org/security/v1"
   ],
   "@type":"https://schema.org/Person",
   "name":"Vishwas Anand",
   "url":"https://vishwas.netlify.app/",
   "image":"https://vishwas.netlify.app/author/admin/avatar_hu885ecffc73ca9d603f6cfbf02ec70754_85745_250x250_fill_q90_lanczos_center.jpg",
   "description":"Vishwas Anand is a developer turned researcher at Imaginea Labs. His research works include in the field of Blockchain, Cryptography and Security",
   "birthdate":"1993-11-16",
   "jobTitle":"Software Engineer",
   "proof":{
      "type":"Ed25519Signature2018",
      "created":"2020-08-02T19:39:37Z",
      "verificationMethod":"did:hsauth:id#z6MksKyyRftdAMhP6kniriC84DCZPXw5c8q2RkckipjmAakR",
      "proofPurpose":"authentication",
      "challenge":"ABC",
      "domain":"example.com",
      "jws":"eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..XjNAx0kIov_oUdXqX_6D6mkshP8oa6227v0SArfLHq2I5IkKDU26713g2onTPBqALDmlskAIuEKQRLXmfpJaDQ"
   }
}

```

### Verifying the signed doc

``` js
// this time only publickey is required
const cryptoSuite = new Ed25519Signature2018({
    verificationMethod: id,
    key: new Ed25519KeyPair(publicKey)
})

// here we also need to add the controller of this crypt
const purpose = new AuthenticationProofPurpose({
    controller,
    challenge: 'ABC',
    domain: 'example.com'
})
```

Finally verify

``` js
await jsonSigs.verify(signed_doc, {
    cryptoSuite,
    purpose
})
```

Result

``` json
// verify
{
   "verified":true,
   "results":[
      {
         "proof":{
            "@context":"https://w3id.org/security/v2",
            "type":"Ed25519Signature2018",
            "created":"2020-08-02T19:39:37Z",
            "verificationMethod":"did:hsauth:id#z6MksKyyRftdAMhP6kniriC84DCZPXw5c8q2RkckipjmAakR",
            "proofPurpose":"authentication",
            "challenge":"ABC",
            "domain":"example.com",
            "jws":"eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..XjNAx0kIov_oUdXqX_6D6mkshP8oa6227v0SArfLHq2I5IkKDU26713g2onTPBqALDmlskAIuEKQRLXmfpJaDQ"
         },
         "verified":true,
         "purposeResult":{
            "valid":true,
            "controller":{
               "@context":"https://w3id.org/security/v2",
               "id":"did:hsauth:vishwas",
               "publicKey":[
                  {
                     "@context":"https://w3id.org/security/v2",
                     "id":"did:hsauth:id#z6MksKyyRftdAMhP6kniriC84DCZPXw5c8q2RkckipjmAakR",
                     "type":"Ed25519VerificationKey2018",
                     "publicKeyBase58":"DsivqReBppCuzFx2B9EHD7eZZxfECFafjjhptYmkFMy3"
                  }
               ],
               "authentication":[
                  "did:hsauth:id#z6MksKyyRftdAMhP6kniriC84DCZPXw5c8q2RkckipjmAakR"
               ]
            }
         }
      }
   ]
}
```

---

Checkout the full demo [here](https://github.com/hypersign-protocol/core/blob/master/examples/linked-data-signature/index.js)

## Resources

* https://schema.org/
* https://search.google.com/structured-data/testing-tool/u/0/
* https://json-ld.org/playground/
* https://json-ld.org/learn.html
* https://github.com/digitalbazaar/jsonld.js
* https://github.com/digitalbazaar/crypto-ld
* https://w3c-ccg.github.io/ld-cryptosuite-registry/
* https://w3c-ccg.github.io/ld-proofs/
* https://w3c-ccg.github.io/security-vocab/
* https://github.com/digitalbazaar/jsonld-signatures
* https://decentralized-id.com/rwot-dir/rwot2-id2020/draft-documents/blockchain-extensions-for-linked-data-signatures/ 
* https://decentralized-id.com/
* https://w3c-ccg.github.io/ld-cryptosuite-registry/
