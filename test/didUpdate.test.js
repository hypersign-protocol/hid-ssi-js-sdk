const { createWallet } = require('./config')
const HypersignSsiSDK = require('../dist')

let hsSdk = null;
let didDocString;
let versionId;

const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
createWallet(mnemonic)
    .then((offlineSigner) => {
        hsSdk = new HypersignSsiSDK(offlineSigner, "http://localhost:26657", "http://localhost:1317");
        return hsSdk.init();
    })
    .then(() => {
        console.log("==========Retrieve DID==============")
        const didId = "did:hs:ff9cab2a-0fff-4df4-bc39-c1bfcfe173e0"
        return hsSdk.did.resolve(didId)
    })
    .then((didDoc) => {
        // Change DID Params
        console.log(didDoc)
        versionId = didDoc["didDocumentMetadata"]["versionId"]
        didDoc["didDocument"]["context"] = ["https://example.com"]
        didDocString = JSON.stringify(didDoc["didDocument"])

        console.log("===============GENERATE DID SIGNATURE =======================")
        const privateKeyMultibase = new Uint8Array(Buffer.from("mK8uv4KdzCVjYgd+wlr05FGo8buhMY8ixVTba7pR/Up/wtIBXNjniYsconY8FtYkx+Kcx73ezfAD9TKQUCQw5g==", "base64"))
        return hsSdk.did.sign({ didDocString, privateKeyMultibase })
    })
    .then(signature => {
        console.log(signature)

        console.log("===============UPDATE DID=======================")
        const vermthId = JSON.parse(didDocString)['verificationMethod'][0].id
        console.log(vermthId)
        return hsSdk.did.update(didDocString, signature, vermthId, versionId)
    })
    .then((res) => {
        console.log(res)
        console.log("Done")
        const didId = JSON.parse(didDocString)["id"]
        return hsSdk.did.resolve(didId)
    })
    .then(res => {
        console.log("===============RESOLVE DID AFTER UPDATE=======================")
        console.log(res)
    })
    .catch((e) => {
        console.error(e)
    })