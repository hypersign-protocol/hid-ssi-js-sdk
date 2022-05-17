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
        const didId = "did:hs:710a9a69-83fb-493a-9340-3ac768edb15d"
        return hsSdk.did.resolve(didId)
    })
    .then((didDoc) => {
        console.log(didDoc)
        // Change DID Params
        didDocString = JSON.stringify(didDoc["didDocument"])
        versionId = didDoc["didDocumentMetadata"]["versionId"]
        console.log("===============GENERATE DID SIGNATURE =======================")
        const privateKeyMultibase = new Uint8Array(Buffer.from("qh5dGvL8qlu0xpZf+MY72aXbOwXuifH2M2B37UoAo/ofEtbKI+DqL9fyniq1OSmgNEYMfawd4IyAkb2bH00wPA==", "base64"))
        return hsSdk.did.sign({ didDocString, privateKeyMultibase })
    })
    .then(signature => {
        console.log(signature)

        console.log("===============DEACTIVATE DID=======================")
        const vermthId = JSON.parse(didDocString)['verificationMethod'][0].id
        console.log(vermthId)
        return hsSdk.did.deactivate(didDocString, signature, vermthId, versionId)
    })
    .then((res) => {
        console.log(res)
        console.log("Done")
        const didId = JSON.parse(didDocString)["id"]
        return hsSdk.did.resolve(didId)
    })
    .then(res => {
        console.log("===============RESOLVE DID AFTER DEACTIVATE=======================")
        console.log(res)
    })
    .catch((e) => {
        console.error(e)
    })