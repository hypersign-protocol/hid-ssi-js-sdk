
const hsdk =  require('../dist')

const options = { nodeUrl: "http://localhost:5000",  didScheme:  "did:v2:hs"}

const sdkVc = hsdk.credential(options)


const challenge = "ch_adbshd131323"
let sCredential = {}
const schemaUrl = "http://localhost:5000/api/schema/get/sch_08ec2409-16f4-41"

   let attributesMap = {}
   
   attributesMap['Name'] = "Vishwas Anand";
   attributesMap[' Email'] = "vishuanand1@hotmail.com"
   const issuerKeys = {"publicKey":{"@context":"https://w3id.org/security/v2","id":"did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp","type":"Ed25519VerificationKey2018","publicKeyBase58":"5tW1ZDEwEKZC1aszbqL19sut8e4MJDYXBgkRqLy8mBcS"},"privateKeyBase58":"397CeRf2c2CrLYStdSZyUsAZWpQ7D5TNja7wf2HDrfsEyJVnG2bd58zSbt12LXwQrhnZbxK7EBXVteqpDdZPGqPC"}
   const holderKeys = {"publicKey":{"@context":"https://w3id.org/security/v2","id":"did:hs:93f07c84-6d92-4087-b6fb-9f66073b21d1#z6MkjLm49TVNZs3f85ihHQHqzyTsxDLCi6nsshfMfcw9gQPp","type":"Ed25519VerificationKey2018","publicKeyBase58":"5tW1ZDEwEKZC1aszbqL19sut8e4MJDYXBgkRqLy8mBcS"},"privateKeyBase58":"397CeRf2c2CrLYStdSZyUsAZWpQ7D5TNja7wf2HDrfsEyJVnG2bd58zSbt12LXwQrhnZbxK7EBXVteqpDdZPGqPC"}
   
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
       console.log(signedCredential)
       sCredential = signedCredential;
       console.log("SignedCredential end=======================================")
       console.log("VerifyCredential start=======================================")
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
   