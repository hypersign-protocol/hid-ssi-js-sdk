
const hsdk =  require('../dist')

const options = { nodeUrl: "http://localhost:5000/",  didScheme:  "did:v2:hs"}

const sdkVc = hsdk.credential(options)


const challenge = "ch_adbshd131323"
let sCredential = {}
const schemaUrl = "http://localhost:5000/api/v1/schema/sch_f3ab4b78-48fa-4a4d-9fe4-8f06dc501a6b"

   let attributesMap = {}
   
   attributesMap['myString'] = "Vishwas Anand";
   attributesMap['myNumner'] = 12;
   attributesMap['myBool'] = false;
   
   const issuerKeys = {
    "publicKey": {
      "@context": "https://w3id.org/security/v2",
      "id": "did:v2:hs:3b29a5f3-8cb2-4603-8fef-b40eccbb798b#z6Mkh3BfBASqPDLrRRqSMEsDQsMantmPFq98ti7uyPz2ryTA",
      "type": "Ed25519VerificationKey2018",
      "publicKeyBase58": "3avcavCQ3frPJvzjffuNZmoayKVXqwtnChCz9821wkfn"
    },
    "privateKeyBase58": "5YUTrfquiGoMPaZnT1jeRyMQgsBy43dkwdXzywTWkhmhnyg7BW8r5f9wU71jKsuh8i49iFvBxae75DjJEkqJhQuJ"
  }
   const holderKeys = {
    "publicKey": {
      "@context": "https://w3id.org/security/v2",
      "id": "did:v2:hs:3ea9975f-4726-479c-b69e-8f5c2e8cbc23#z6Mkn79DTEh6Fo73A2LTEYumAjGkHzqVLupMxyPGtv7tmxZs",
      "type": "Ed25519VerificationKey2018",
      "publicKeyBase58": "8etArzSevFca3XVkYywvKdikURZdw2a1GxUM4e9srjnV"
    },
    "privateKeyBase58": "3ApK2iC4sJoEQK6KrNh4g2ZzjtU7inoUYHdB1QFEezNm6n73Tw5YKx5UjYjs44yeASviyDtQaXnVnH8U43zM9ee9"
  }
   
   sdkVc.generateCredential(schemaUrl, {
       subjectDid: holderKeys.publicKey.id,
       issuerDid: issuerKeys.publicKey.id,
       expirationDate: new Date().toISOString(),
       attributesMap
   }).then(credential => {
    //    console.log(credential)
       console.log("Credentials end=======================================")
       console.log("SignedCredential start=======================================")
       return sdkVc.signCredential(credential, issuerKeys.publicKey.id, issuerKeys.privateKeyBase58)
   }).then(signedCredential => {
    //    console.log(signedCredential)
       sCredential = signedCredential;
       console.log("SignedCredential end=======================================")
       console.log("VerifyCredential start=======================================")
       return sdkVc.verifyCredential(signedCredential, issuerKeys.publicKey.id)
   }).then(result => {
    //    console.log(result)
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
   