const HypersignSsiSDK = require('../dist')

const { props, writeDataInFile, createWallet } = require('./config')





let hsSdk;


const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
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
        const subjectDid = issuerDid = "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83";
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
        const privateKey = "axnVlW2g5pnNe2lWCkPGQZ02GII4qUEYmokXmVHIvmogu6/FjZdh9HPqPz4kPLe4eMrKFCUaO2jI5h0eeAoDcA==";
        const issuerDid = "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83";
        console.log('================Sign Verifiable Credential================')

        // const vc1 = {
        //     "@context": [
        //         "https://www.w3.org/2018/credentials/v1",
        //         "https://www.w3.org/2018/credentials/examples/v1"
        //     ],
        //     "id": "https://example.com/credentials/1872",
        //     "type": ["VerifiableCredential", "AlumniCredential"],
        //     "issuer": "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83",
        //     "issuanceDate": "2010-01-01T19:23:24Z",
        //     "credentialSubject": {
        //         "id": "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83",
        //         "alumniOf": "Example University"
        //     }
        // }
        return hsSdk.vc.signCredential({
            credential: vc,
            issuerDid,
            privateKey
        })
    })
    .then((signedVC) => {
        console.log(JSON.stringify(signedVC, null, 2))
        const issuerDid = "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83";
        console.log('================Verify Verifiable Credential================')
        return hsSdk.vc.verifyCredential({ credential: signedVC, issuerDid })
    })
    .then((result) => {
        console.log(result)
    })
    .catch((e) => {
        console.error(e)
    })