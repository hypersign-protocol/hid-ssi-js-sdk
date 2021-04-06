const HypersignSsiSDK = require('../dist')

const options = { nodeUrl: "http://localhost:5000" }
const hsSdk = new HypersignSsiSDK(options); 

const {did} = hsSdk;

const userData = {
    name: "Vishwas"
}

did.getDid({
    user: userData,
}).then(res => {
    console.log(JSON.stringify(res, null, 2))
    const { didDoc } = res;
    // delete didDoc["id"];
    return did.register(didDoc);
}).then(res => {
    console.log(JSON.stringify(res, null, 2))
    const {did: dcentId} = res;
    return did.resolve(dcentId);
}).then(res => {
    console.log(JSON.stringify(res, null, 2))
}).catch(e => {
    console.error(e);
})


return;
const sdkDid = {};
let challenge = ""

const domain = "www.abc.com"


const didDoc = { "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/v1", "https://schema.org", "http://localhost:5000/api/did/resolve"], "@type": "https://schema.org/Person", "id": "did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1", "name": "hypersign", "publicKey": [{ "@context": "https://w3id.org/security/v2", "id": "did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp", "type": "Ed25519VerificationKey2018", "publicKeyBase58": "5tW1ZDEwEKZC1aszbqL19sut8e4MJDYXBgkRqLy8mBcS" }], "authentication": ["did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp"], "assertionMethod": ["did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp"], "keyAgreement": ["did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp"], "capabilityInvocation": ["did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp"], "created": "2020-09-22T13:36:39.355Z", "updated": "2020-09-22T13:36:39.355Z" }
const keys = { "publicKey": { "@context": "https://w3id.org/security/v2", "id": "did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp", "type": "Ed25519VerificationKey2018", "publicKeyBase58": "5tW1ZDEwEKZC1aszbqL19sut8e4MJDYXBgkRqLy8mBcS" }, "privateKeyBase58": "397CeRf2c2CrLYStdSZyUsAZWpQ7D5TNja7wf2HDrfsEyJVnG2bd58zSbt12LXwQrhnZbxK7EBXVteqpDdZPGqPC" }

// sdkDid.getDid({
//     user: userData,
//     publicKey: "5tW1ZDEwEKZC1aszbqL19sut8e4MJDYXBgkRqLy8mBcS"
// }).then(res => {
//     console.log(JSON.stringify(res, null, 2))
// })


sdkDid.getDidDocAndKeys(userData)
    .then(res => {
        console.log("=============GENERATE CREDENTIALS=========================")
            // const { keys, didDoc } = res
        const { privateKeyBase58, publicKey } = keys
        console.log("cred =", keys)

        console.log("=============GENERATE USER DOC=========================")
        console.log("UserDoc =", didDoc)

        challenge = sdkDid.getChallange()
        console.log("==============GENERATE NEW CHALLENGE STRING=======================")
        console.log("challenge =", challenge)
        return sdkDid.sign({
            did: didDoc['id'],
            privateKeyBase58,
            challenge,
            domain
        })
    })
    .then((signedDoc) => {
        console.log("===============SIGNED DOC=======================")
        console.log("signedDoc =", signedDoc)
        return sdkDid.verify({
            doc: signedDoc,
            challenge,
            domain
        })
    })
    .then((verified) => {
        console.log("===============VERIFED DOC=======================")
        console.log("verified =", verified)
        console.log("Finised.")
    })
    .catch(e => console.log(e))