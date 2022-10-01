const { createWallet, writeDataInFile, mnemonic, hidNodeEp } = require('../config')
const HypersignSsiSDK = require('../../build/src')
const {Bip39}=require('@cosmjs/crypto')
let hsSdk = null;
let didDocString;
let versionId;
let verificationMethodId;
let didDoc;
let privateKeyMultibase;
let offlineSigner
createWallet(mnemonic)
    .then(async(offlineSigner11) => {
       offlineSigner=offlineSigner11
        console.log("offlineSigner", offlineSigner);
        const accounts = await offlineSigner.getAccounts();
        console.log(accounts)
        hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
        return hsSdk.init();
    })
    .then(async() => {
        console.log("===============GENERATE DID-KEYS=======================")
            // const param = "blade sting surge cube valid scr"; // 32 bytes
        const seed=Bip39.decode(mnemonic)
        const kp = await hsSdk.did.generateKeys({seed});
        console.log("kp", kp);
        writeDataInFile('../mock/keys.json', JSON.stringify(kp))
        privateKeyMultibase = kp.privateKeyMultibase
        const publicKeyMultibase = kp.publicKeyMultibase
        console.log(kp)
        console.log("===============GENERATE DID&DIDDoc=======================")
        didDocString = await hsSdk.did.generate({ publicKeyMultibase });
        console.log(didDocString)
        writeDataInFile('../mock/did.json', didDocString)
        didDoc = JSON.parse(didDocString);
        verificationMethodId = didDoc['verificationMethod'][0].id
        console.log("===============REGISTER DID=======================")
        return hsSdk.did.register({ didDocString, privateKeyMultibase, verificationMethodId })
    })
    .then((resTx) => {
        console.log(resTx)
        console.log("===============RESOLVE DID=======================")
        return hsSdk.did.resolve({ did: didDoc["id"] })
    })
    .then(res => {
        console.log(res)
        const { didDocumentMetadata } = res;
        versionId = didDocumentMetadata.versionId;

        /// updating some data
        didDoc.service.push({
            "id": didDoc.id + "#vcs",
            "type": "LinkedDomains",
            "serviceEndpoint": "https://example.com/vc"
        })
        const didDocString = JSON.stringify(didDoc);
        console.log("===============DID Update=======================")
        return hsSdk.did.update({ didDocString, privateKeyMultibase, verificationMethodId, versionId })
    })
    .then((resTx) => {
        console.log(resTx)
        console.log("===============RESOLVE DID=======================")
        return hsSdk.did.resolve({ did: didDoc["id"] })
    })
    .then(res => {
        console.log(res)
        console.log("===============DID Deactivate=======================")
        const { didDocumentMetadata, didDocument } = res;
        didDocString = JSON.stringify(didDocument)
        writeDataInFile('../mock/did.json', didDocString)
        versionId = didDocumentMetadata.versionId;
        return ""//hsSdk.did.deactivate({ didDocString, privateKeyMultibase, verificationMethodId, versionId })
    })
    .then((resTx) => {
        console.log(resTx)
        console.log("===============RESOLVE DID=======================")
        return hsSdk.did.resolve({ did: didDoc["id"] })
    })
    .then(res => {
        console.log(res)
    })
    .catch((e) => {
        console.error(e)
    })