const HypersignSsiSDK = require('../dist')
const { createWallet } = require('./config')
let hsSdk;
let unsignedVc;
let signedVC;
let unsignedVp;
let signedVP;
const challenge = "12312301231231jnj12n3123123s"
const subjectDid = issuerDid = "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83";
const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
const privateKey = "axnVlW2g5pnNe2lWCkPGQZ02GII4qUEYmokXmVHIvmogu6/FjZdh9HPqPz4kPLe4eMrKFCUaO2jI5h0eeAoDcA==";
createWallet(mnemonic)
    .then((offlineSigner) => {
        hsSdk = new HypersignSsiSDK(offlineSigner, "http://localhost:26657", "http://localhost:1317");
        return hsSdk.init();
    })
    .then(() => {
        const fields = {
            email: "vishwas@anand.com",
            name: "Vishwas Anand Bhushan",
            modelname: "abcd"
        };
        const schemaId = "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83;id=5f0dbbb3-9845-4843-9491-727f7e394763;version=1.0";

        const expirationDate = new Date();
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
        return hsSdk.vc.signCredential({
            credential: vc,
            issuerDid,
            privateKey
        })
    })
    .then((svc) => {
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
        unsignedVc
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