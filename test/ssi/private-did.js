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
        const seed=Bip39.decode("three image merge verb tenant divert modify million hotel decade hurt alien loop illegal day judge beyond anxiety term there improve mad gossip shallow")
        const kp = await hsSdk.did.generateKeys({seed});
        console.log("kp", kp);
        writeDataInFile('../mock/private/keys.json', JSON.stringify(kp))
        privateKeyMultibase = kp.privateKeyMultibase
        const publicKeyMultibase = kp.publicKeyMultibase
        console.log(kp)
        console.log("===============GENERATE DID&DIDDoc=======================")
        return hsSdk.did.generate({ publicKeyMultibase });
        
    })
    .then((res) => {
        console.log(res)
        didDocString =  JSON.stringify(res);
        writeDataInFile('../mock/private/did.json',didDocString)
        didDoc = res;
        verificationMethodId = didDoc['verificationMethod'][0].id
        console.log("===============SIGN DID=======================")
        return hsSdk.did.signDid({ privateKey: privateKeyMultibase, challenge, domain, doc: didDoc,  verificationMethodId });
    })    
    .then((signedDidDoc) => {
        const { signedDidDocument } =  signedDidDoc;
        console.log(signedDidDocument)
        writeDataInFile('../mock/private/signed-did.json',JSON.stringify(signedDidDocument))
        console.log("===============VERIFY DID=======================")
        return hsSdk.did.verify({ doc : signedDidDocument, verificationMethodId, challenge,  domain })
    })
    .then((result) => {
        console.log(result.verificationResult)
    })
    .catch((e) => {
        console.error(e)
    })