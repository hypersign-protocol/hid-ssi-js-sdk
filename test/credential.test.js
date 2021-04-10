const HypersignSsiSDK = require('../dist')

const options = { nodeUrl: "http://localhost:5000" }
const hsSdk = new HypersignSsiSDK(options); 

const sdkVc = hsSdk.credential


const challenge = "ch_adbshd131323"
let sCredential = {}
const schemaUrl = "http://localhost:5000/api/v1/schema/sch_4bcf878a-4751-4401-af19-d5f620d47960"

//    let attributesMap = {
//        name: "Vishwas Anand",
//        email: "vishu.anand1@gmail.com",
//        phoneNumber: "+91-123123123213"
//    }



let attributesMap = {
    "name": "IDO App",
    "did": "did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51",
    "owner": "did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51",
    "schemaId": "sch_d0d8488d-5bad-42fd-8ac3-7066b473bbf5",
    "serviceEp": "http://192.168.43.43:4006",
    "subscriptionId": "subs_9eda0fab-82d7-4",
    "planId": "pln_1ee9aa7b-95b3-42",
    "planName": "Tier 1",
}
   const issuerKeys = {
    "publicKey": {
      "@context": "https://w3id.org/security/v2",
      "id": "did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51#z6MkjAwRoZNV1oifLPb2GzLatZ7sVxY5jZ16xYTTAgSgCqQQ",
      "type": "Ed25519VerificationKey2018",
      "publicKeyBase58": "5igPDK83gGECDtkKbRNk3TZsgPGEKfkkGXYXLQUfHcd2"
    },
    "privateKeyBase58": "34uPqEWKuz4MxaPFZtRR4zCFZKrKsn3gEQgHop4crSArPZ3LHQ2HJq8jh39d6Aa7Jnqftnv6BxqCtxyq4izU2TPz"
  }
//    const holderKeys = {
//     "publicKey": {
//       "@context": "https://w3id.org/security/v2",
//       "id": "did:hs:894865ee-4b45-40df-bda6-f8ee7750b908#z6Mkkhgzxs3zMjsPK8cBvPnvnzbzXFHMLx7TeXc3xZsfzTqS",
//       "type": "Ed25519VerificationKey2018",
//       "publicKeyBase58": "7FRxNcoZ2CNvCdmVEpq5wu3zhg1Vw4s6xWh88Huf5F44"
//     },
//     "privateKeyBase58": "4sN9b9rDWqXjVSiEcJoHdc2RyhxbtWVwowiKBDrmjisyUrJzaqhkL32DJv2Lez9mszK6KeSsTbuHdmhsDkpoVjLL"
//   }
   
const holderKeys = issuerKeys;

   sdkVc.generateCredential(schemaUrl, {
       subjectDid: holderKeys.publicKey.id,
       issuerDid: issuerKeys.publicKey.id,
       expirationDate: new Date().toISOString(),
       attributesMap
   }).then(credential => {
       console.log(credential)
       console.log("Credentials end=======================================")
       console.log("SignedCredential start=======================================")
       return sdkVc.signCredential(credential, issuerKeys.publicKey.id, issuerKeys.privateKeyBase58)
   }).then(signedCredential => {
    //    console.log(JSON.stringify(signedCredential))
       sCredential = signedCredential;
       console.log("SignedCredential end=======================================")
       console.log("VerifyCredential start=======================================")
       console.log(sCredential)
       return sdkVc.verifyCredential(signedCredential, issuerKeys.publicKey.id)
   }).then(result => {
       console.log(result)
       console.log("VerifyCredential end=======================================")
       console.log("Presentation start=======================================")
       return sdkVc.generatePresentation(sCredential, holderKeys.publicKey.id)
   })
   .then(presentation => {
       console.log(presentation)
       console.log("Presentation end=======================================")
       console.log("SignedPresentation start=======================================")
       return sdkVc.signPresentation(presentation, holderKeys.publicKey.id, holderKeys.privateKeyBase58, challenge)
   })
   .then(signedPresentation => {
       console.log(JSON.stringify(signedPresentation, null, 2))
       console.log("SignedPresentation end=======================================")
       console.log("VerifyPresentation start=======================================")
       return sdkVc.verifyPresentation({presentation: signedPresentation, challenge, issuerDid: issuerKeys.publicKey.id, holderDid: holderKeys.publicKey.id})
   })
   .then(result => {
       console.log(JSON.stringify(result, null, 2))
       console.log("VerifyPresentation end=======================================")
   })
   .catch(e => {
       console.log(e)
   })
   