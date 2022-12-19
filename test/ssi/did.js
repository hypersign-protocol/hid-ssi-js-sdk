const { createWallet, writeDataInFile, mnemonic, hidNodeEp } = require('../config')
const HypersignSsiSDK = require('../../build/src')
const {Bip39}=require('@cosmjs/crypto')
let hsSdk = null;
let didDocString;
let versionId;
let verificationMethodId;
let didDoc;
let privateKeyMultibase;
let offlineSigner;
const challenge = "1231231231";
const domain = "www.adbv.com";
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
        const kp = await hsSdk.did.generateKeys();
        console.log("kp", kp);
        writeDataInFile('../mock/public/keys.json', JSON.stringify(kp))
        privateKeyMultibase = kp.privateKeyMultibase
        const publicKeyMultibase = kp.publicKeyMultibase
        console.log(kp)
        console.log("===============GENERATE DID&DIDDoc=======================")
        return hsSdk.did.generate({ publicKeyMultibase});
        
    })
    .then((res) => {
        console.log(res)
        didDocString =  JSON.stringify(res);
        writeDataInFile('../mock/public/did.json',didDocString)
        didDoc = res;
        verificationMethodId = didDoc['verificationMethod'][0].id
        console.log("===============SIGN DID=======================")
        return hsSdk.did.signDid({ privateKey: privateKeyMultibase, challenge, domain, doc: didDoc,  verificationMethodId });
    })    
    .then((signedDidDoc) => {
        const { signedDidDocument } =  signedDidDoc;
        console.log(signedDidDocument)
        writeDataInFile('../mock/public/signed-did.json',JSON.stringify(signedDidDocument))
        console.log("===============VERIFY DID=======================")
        return hsSdk.did.verify({ doc : signedDidDocument, verificationMethodId, challenge,  domain })
    })
    .then((result) => {
        console.log(result.verificationResult)
    })
    .then(() => {
        verificationMethodId = didDoc['verificationMethod'][0].id
        console.log("===============REGISTER DID=======================")
        return hsSdk.did.register({ didDocument: didDoc , privateKeyMultibase, verificationMethodId })
    })
    .then((resTx) => {
        console.log(resTx)
        console.log("===============RESOLVE DID=======================")
        return hsSdk.did.resolve({ did: didDoc["id"],ed25519verificationkey2020:true })
    })
    .then(res => {
        console.log(JSON.stringify(res, null, 2))
        const { didDocumentMetadata } = res;
        versionId = didDocumentMetadata.versionId;

        /// updating some data
        didDoc.service.push({
            "id": didDoc.id + "#vcs",
            "type": "LinkedDomains",
            "serviceEndpoint": "https://example.com/vc"
        })

        console.log("===============DID Update=======================")
        return hsSdk.did.update({  didDocument: didDoc, privateKeyMultibase, verificationMethodId, versionId })
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
        writeDataInFile('../mock/public/did.json', didDocString)
        versionId = didDocumentMetadata.versionId;
        return ""// hsSdk.did.deactivate({  didDocument: didDoc, privateKeyMultibase, verificationMethodId, versionId })
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