
const hsdk =  require('../dist')

const options = { nodeUrl: "http://localhost:5000",  didScheme:  "did:v2:hs"}

const sdkVc = hsdk.credential(options)


const challenge = "ch_adbshd131323"
let sCredential = {}
const schemaUrl = "http://localhost:5000/api/schema/get/sch_5fb9162c-d760-40"

   let attributesMap = {}
   
   attributesMap['Name'] = "Vishwas Anand";
   attributesMap[' Email'] = "vishuanand1@hotmail.com"
   const issuerKeys = {"publicKey":{"@context":"https://w3id.org/security/v2","id":"did:hs:d449482d-2d31-4848-9006-71c7f078f5ab#z6Mkt2VLyXdWJ36RkwqNLRj6BNQ2BCfDysLHWJJWHX2oyS3t","type":"Ed25519VerificationKey2018","publicKeyBase58":"EaEJPHP4xVbxeSzfermFLGr2MdPNZz5vpHPaTF4o4DGW"},"privateKeyBase58":"qcn2oTREBWnEFLvWDJYbk7Xa8XhwpX9sxpziEsCRZ6MMScZiBZY3Cxfxaz2kpzVqxtAU1ZynemDGSCBdt5f9bFQ"}
   const holderKeys = {"publicKey":{"@context":"https://w3id.org/security/v2","id":"did:hs:d449482d-2d31-4848-9006-71c7f078f5ab#z6Mkt2VLyXdWJ36RkwqNLRj6BNQ2BCfDysLHWJJWHX2oyS3t","type":"Ed25519VerificationKey2018","publicKeyBase58":"EaEJPHP4xVbxeSzfermFLGr2MdPNZz5vpHPaTF4o4DGW"},"privateKeyBase58":"qcn2oTREBWnEFLvWDJYbk7Xa8XhwpX9sxpziEsCRZ6MMScZiBZY3Cxfxaz2kpzVqxtAU1ZynemDGSCBdt5f9bFQ"}
   
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
   