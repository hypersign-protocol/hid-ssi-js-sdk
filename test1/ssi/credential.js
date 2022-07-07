const HypersignSsiSDK = require('../../build/src')
const { createWallet, mnemonic, hidNodeEp, writeDataInFile } = require('../config')
const { id } = require('../mock/did.json')
const { id: schemaId } = require('../mock/schema.json')
const { privateKeyMultibase } = require('../mock/keys.json')


let hsSdk;
let unsignedVc;
let signedVC;
let unsignedVp;
let signedVP;
const challenge = "12312301231231jnj12n3123123s"
const subjectDid = id
const issuerDid = id;
const privateKey = privateKeyMultibase;

createWallet(mnemonic)
    .then((offlineSigner) => {
        hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest);
        return hsSdk.init();
    })
    .then(() => {
        const fields = {
            email: "vishwas@anand.com",
            name: "Vishwas Anand Bhushan",
            modelname: "abcd"
        };
        const expirationDate = new Date('12/11/2027');
        console.log('================Genenrate Verifiable Credential================')
        return hsSdk.vc.getCredential({
            schemaId,
            subjectDid,
            issuerDid,
            expirationDate,
            fields
        })
    })
    .then((vc) => {
        console.log(JSON.stringify(vc, null, 2))
        unsignedVc = vc;
        console.log('================Sign Verifiable Credential================')
        return hsSdk.vc.issueCredential({
            credential: vc,
            issuerDid,
            privateKey
        })
    })
    .then((svc) => {
        writeDataInFile('../mock/vc.json', JSON.stringify(svc))
        console.log(JSON.stringify(svc, null, 2))
        signedVC = svc;
        console.log('================Verify Verifiable Credential================')
        return hsSdk.vc.verifyCredential({ credential: svc, issuerDid })
    })
    .then((result) => {
        console.log(result)
    })


.then(() => {
        console.log('================Generate Verifiable Presenatation================')
        return hsSdk.vp.getPresentation({
            verifiableCredential: unsignedVc,
            holderDid: subjectDid
        })
    })
    .then(vp => {
        console.log(JSON.stringify(vp, null, 2))
        unsignedVp = vp;
        console.log('================Sign Verifiable Presenatation================')
        return hsSdk.vp.signPresentation({
            presentation: unsignedVp,
            holderDid: subjectDid,
            privateKey,
            challenge
        })
    })
    .then(svp => {
        console.log(JSON.stringify(svp, null, 2))
        writeDataInFile('../mock/vp.json', JSON.stringify(svp))
        signedVP = svp;
        console.log('================Verify Verifiable Presenatation================')
        return hsSdk.vp.verifyPresentation({
            signedPresentation: signedVP,
            challenge,
            domain: "https://localhos:20202",
            issuerDid,
            holderDid: subjectDid,
        })
    })
    .then(result => {
        console.log(result)
    })
    .catch((e) => {
        console.error(e)
    })