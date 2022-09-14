const { createWallet, writeDataInFile, mnemonic, hidNodeEp } = require('../config')
const HypersignSsiSDK = require('../../build/src')
const { Bip39 } = require('@cosmjs/crypto')
let hsSdk = null;
let didDocString;
let versionId;
let verificationMethodId;
let didDoc;
let privateKeyMultibase;
let offlineSigner

createWallet(mnemonic)
    .then(async (offlineSigner11) => {
        offlineSigner = offlineSigner11
        console.log("offlineSigner", offlineSigner);
        const accounts = await offlineSigner.getAccounts();
        console.log(accounts)
        hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
        return hsSdk.init();
    })
    .then(async () => {
        const seed = Bip39.decode(mnemonic)
        const kp = await hsSdk.did.generateKeys({ seed });
        console.log("kp", kp);
        privateKeyMultibase = kp.privateKeyMultibase
        const publicKeyMultibase = kp.publicKeyMultibase
        didDocString = await hsSdk.did.generate({ publicKeyMultibase });
        didDoc = JSON.parse(didDocString);

        verificationMethodId = didDoc.verificationMethod[0].id
        await hsSdk.did.register({ didDocString, privateKeyMultibase, verificationMethodId })

        didDoc = JSON.parse(didDocString);
        console.log(didDoc);
        const  {signedDidDocument,fingerprint} = await hsSdk.did.signDid({ privateKey: kp.privateKeyMultibase, challenge: "123", domain: 'abc', did: didDoc.id })
        writeDataInFile("../mock/signedError.json",JSON.stringify(signedDidDocument))
        console.log("signedDid", signedDidDocument);
        const verifiedSig = await hsSdk.did.verify({doc:signedDidDocument, challenge: "123", domain: 'abc' , did: fingerprint})
        console.log("verifiedSig", JSON.stringify(verifiedSig,null,2));
    })


