const { createWallet } = require('./config')
const HypersignSsiSDK = require('../dist')

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

        console.log(publicKeyMultibase) 
        console.log("Priv Key: ", Buffer.from(privateKeyMultibase).toString('base64'))
        console.log("===============GENERATE DID-DIDDOC-KEYS=======================")
        didDocString = hsSdk.did.generateDID(publicKeyMultibase);
        console.log(JSON.parse(didDocString))
        
        console.log("===============GENERATE DID SIGNATURE =======================")
        return hsSdk.did.sign({ didDocString, privateKeyMultibase })
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
        const didId = JSON.parse(didDocString)["id"]
        return hsSdk.did.resolve(didId)
    })
    .then(res => {
        console.log("===============RESOLVE DID=======================")
        console.log(res)
    })
    .catch((e) => {
        console.error(e)
    })