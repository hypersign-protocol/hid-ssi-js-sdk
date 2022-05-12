const { writeDataInFile, readDateFromFile, createWallet } = require('./config')
const HypersignSsiSDK = require('../dist')

const userData = {
    name: "asdadasd222"
}
let newDID = "";
``
let challenge = "";
let privateKeyBase58 = "";
const domain = "www.hypersign.id"

let hsSdk = null;
let didDocString;

const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
createWallet(mnemonic)
    .then((offlineSigner) => {
        hsSdk = new HypersignSsiSDK(offlineSigner, "http://localhost:26657", "http://localhost:1317");
        return hsSdk.init();
    })
    .then(() => {
        console.log("===============GENERATE DID-KEYS=======================")
        const { publicKeyMultibase, privateKeyMultibase } = hsSdk.did.generateKeys();

        console.log({
            publicKeyMultibase,
            privateKeyMultibase
        })
        console.log("===============GENERATE DID-DIDDOC-KEYS=======================")
        didDocString = hsSdk.did.generateDID(publicKeyMultibase);
        console.log(JSON.parse(didDocString))
        
        console.log("===============GENERATE DID SIGNATURE =======================")
        return hsSdk.did.sign({ didDocString, privateKeyMultibase })
        

        // console.log(hsSdk.did)
        // const res = hsSdk.did.getDid()
        // console.log(JSON.stringify(res, null, 2))
        // const { didDoc, did, keys } = res;
        // writeDataInFile('keys.json', JSON.stringify(keys));
        // console.log("===============Sign DID=======================")
        //     //return hsSdk.did.register(didDoc);
        // const signature = hsSdk.did.sign({
        //     doc: didDoc,
        //     privateKey: keys["privateKeyMultibase"]
        // })
        // console.log("Signature", Buffer.from(signature).toString('base64'))
        // console.log("===============Register DID=======================")
        // const signatures = [{ signature, verificationMethodId: didDoc['authentication'][0] }]
        // return hsSdk.did.register(
        //     didDoc,
        //     signatures
        // )
    })
    .then(signature => {
        console.log(signature)

        console.log("===============REGISTER DID=======================")
        const vermthId = JSON.parse(didDocString)['verificationMethod'][0].id
        console.log(vermthId)
        return hsSdk.did.register(didDocString, signature, vermthId)
    })
    .then((res) => {
        console.log(res)
        console.log("Done")
    })
    .catch((e) => {
        console.error(e)
    })
    // .then(res => {
    //     console.log(res)
    //     // const {did: dcentId} = res;
    //     console.log("===============RESOLVE DID=======================")
    //     return hsSdk.did.resolve(newDID);
    // })
    // .then(res => {
    //     console.log(res)
    //     challenge = "123123123chs"
    //     console.log("===============SIGN DIDDOC=======================")
    //     return  hsSdk.did.sign({
    //         did: newDID,
    //         privateKeyBase58,
    //         challenge,
    //         domain
    //     })
    // })
    // .then((signedDoc) => {
    //     console.log("signedDoc =", signedDoc)
    //     console.log("===============VERIFY DOC=======================")
    //     return  hsSdk.did.verify({
    //         doc: signedDoc,
    //         challenge,
    //         domain
    //     })
    // })
    // .then((verified) => {
    //     console.log("verified =", verified)
    //     console.log("Finised.")
    // })
    // .catch(e => {
    //     console.error(e);
    // })


// const sdkDid = {};
// let challenge = ""

// const domain = "www.abc.com"


// const didDoc = { "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/v1", "https://schema.org", "http://localhost:5000/api/did/resolve"], "@type": "https://schema.org/Person", "id": "did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1", "name": "hypersign", "publicKey": [{ "@context": "https://w3id.org/security/v2", "id": "did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp", "type": "Ed25519VerificationKey2018", "publicKeyBase58": "5tW1ZDEwEKZC1aszbqL19sut8e4MJDYXBgkRqLy8mBcS" }], "authentication": ["did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp"], "assertionMethod": ["did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp"], "keyAgreement": ["did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp"], "capabilityInvocation": ["did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp"], "created": "2020-09-22T13:36:39.355Z", "updated": "2020-09-22T13:36:39.355Z" }
// const keys = { "publicKey": { "@context": "https://w3id.org/security/v2", "id": "did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp", "type": "Ed25519VerificationKey2018", "publicKeyBase58": "5tW1ZDEwEKZC1aszbqL19sut8e4MJDYXBgkRqLy8mBcS" }, "privateKeyBase58": "397CeRf2c2CrLYStdSZyUsAZWpQ7D5TNja7wf2HDrfsEyJVnG2bd58zSbt12LXwQrhnZbxK7EBXVteqpDdZPGqPC" }

// // sdkDid.getDid({
// //     user: userData,
// //     publicKey: "5tW1ZDEwEKZC1aszbqL19sut8e4MJDYXBgkRqLy8mBcS"
// // }).then(res => {
// //     console.log(JSON.stringify(res, null, 2))
// // })


// sdkDid.getDidDocAndKeys(userData)
//     .then(res => {
//         console.log("=============GENERATE CREDENTIALS=========================")
//             // const { keys, didDoc } = res
//         const { privateKeyBase58, publicKey } = keys
//         console.log("cred =", keys)

//         console.log("=============GENERATE USER DOC=========================")
//         console.log("UserDoc =", didDoc)

//         challenge = sdkDid.getChallange()
//         console.log("==============GENERATE NEW CHALLENGE STRING=======================")
//         console.log("challenge =", challenge)
//         return sdkDid.sign({
//             did: didDoc['id'],
//             privateKeyBase58,
//             challenge,
//             domain
//         })
//     })
//     .then((signedDoc) => {
//         console.log("===============SIGNED DOC=======================")
//         console.log("signedDoc =", signedDoc)
//         return sdkDid.verify({
//             doc: signedDoc,
//             challenge,
//             domain
//         })
//     })
//     .then((verified) => {
//         console.log("===============VERIFED DOC=======================")
//         console.log("verified =", verified)
//         console.log("Finised.")
//     })
//     .catch(e => console.log(e))