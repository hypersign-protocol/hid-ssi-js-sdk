const { createWallet, writeDataInFile, mnemonic, hidNodeEp } = require('../config')
const HypersignSsiSDK = require('../../dist/src')

let hsSdk = null;
let didDocString;
let versionId;
let verificationMethodId;
let didDoc;
let privateKeyMultibase;
createWallet(mnemonic)
    .then((offlineSigner) => {
        hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest);
        return hsSdk.init();
    })
    .then(async() => {
        console.log("===============GENERATE DID-KEYS=======================")
        const seedParam = "blade sting surge cube valid scr"; // 32 bytes
        const kp = await hsSdk.did.generateKeys({ seed: seedParam });
        writeDataInFile('../mock/keys.json', JSON.stringify(kp))
        privateKeyMultibase = kp.privateKeyMultibase
        const publicKeyMultibase = kp.publicKeyMultibase
        console.log(kp)
        console.log("===============GENERATE DID&DIDDoc=======================")
        didDocString = hsSdk.did.generate({ publicKeyMultibase });
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
        didDoc['authentication'].push('did:hs:9cb2686d-32e5-42d0-a1bf-6a5289346901#zBz7vTui6K5q4DarumG8cMEC1TZ19MvyPcMqSRjMfJVWc')
        const didDocString = JSON.stringify(didDoc);
        console.log("===============DID Update=======================")
        return hsSdk.did.update({ didDocString, privateKeyMultibase, verificationMethodId, versionId })
    })
    .then((resTx) => {
        console.log(resTx)
        console.log("===============RESOLVE DID=======================")
        return hsSdk.did.resolve({ did: didDoc["id"] })
    })
    // .then(res => {
    //     console.log(res)
    //     console.log("===============DID Deactivate=======================")
    //     const { didDocumentMetadata } = res;
    //     versionId = didDocumentMetadata.versionId;
    //     return hsSdk.did.deactivate({ didDocString, privateKeyMultibase, verificationMethodId, versionId })
    // })
    // .then((resTx) => {
    //     console.log(resTx)
    //     console.log("===============RESOLVE DID=======================")
    //     return hsSdk.did.resolve({ did: didDoc["id"] })
    // })
    .then(res => {
        console.log(res)
    })
    .catch((e) => {
        console.error(e)
    })