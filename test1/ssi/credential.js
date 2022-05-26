const HypersignSsiSDK = require('../../dist/src')
const { createWallet } = require('../config')
let hsSdk;
let unsignedVc;
let signedVC;
let unsignedVp;
let signedVP;
const challenge = "12312301231231jnj12n3123123s"
const subjectDid = "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83"
const issuerDid = "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83";
const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
const privateKey = "zrv2c2grj4PBRgc9j6WMHpDnWWChdXfQuMoLc6FJXFFh8CucEJvReQf93HnyPLCh7PynmogPjSqjXHbJ4tX5UN5KzWg";
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
        const schemaId = "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83;id=7266c2c6-aacd-47d7-83b7-37783894e8e8;version=1.0";

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
            //unsignedVc

        const unsignedVP = {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                {
                    "hs": "http://localhost:1317/hypersign-protocol/hidnode/ssi/schema/did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83;id=7266c2c6-aacd-47d7-83b7-37783894e8e8;version=1.0:"
                },
                {
                    "email": "hs:email"
                },
                {
                    "name": "hs:name"
                },
                {
                    "modelname": "hs:modelname"
                },
                "https://w3id.org/security/suites/ed25519-2020/v1"
            ],
            "id": "vc_462aab27-dccc-44e3-b9e5-3c5e27dbfa3a",
            "type": [
                "VerifiableCredential",
                "Email Schema"
            ],
            "expirationDate": "2022-05-26T13:22:59Z",
            "issuanceDate": "2022-05-26T13:22:59Z",
            "issuer": "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83",
            "credentialSubject": {
                "email": "vishwas@anand.com",
                "name": "Vishwas Anand Bhushan",
                "modelname": "abcd",
                "id": "did:hs:188f8c66-f41d-4eb2-933f-45ae81e76973"
            },
            "credentialSchema": {
                "id": "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83;id=7266c2c6-aacd-47d7-83b7-37783894e8e8;version=1.0",
                "type": "JsonSchemaValidator2018"
            },
            "proof": {
                "type": "Ed25519Signature2020",
                "created": "2022-05-26T13:22:59Z",
                "verificationMethod": "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83#z3Cn3AXpHMBWBfV14KSBwGqWnBdHEAf6zP74SR4JWuANT",
                "proofPurpose": "assertionMethod",
                "proofValue": "z4HxzR3H6n3F6jzRKkC5BDBCW5bajS8WVwYVSS43p5ntgmZkeCBwje6pmft2D6j7UzkM3iSW6BLAu53vZLa3P949g"
            }
        }
        return hsSdk.vp.getPresentation({
            verifiableCredential: unsignedVP,
            holderDid: subjectDid
        })
    })
    .then(vp => {
        console.log(JSON.stringify(vp))
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
        console.log(JSON.stringify(svp))
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