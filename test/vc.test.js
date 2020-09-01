const lib = require('../dist/vc')
const { generateCredential, signCredential, verifyCredential, generatePresentation, signPresentation, verifyPresentation} = lib

const challenge = "ch_adbshd131323"
let sCredential = {}
const schemaUrl = "http://localhost:5000/api/schema/get/sch_fd98d73c-00ef-41"
const attributesMap = {
 name: "Vishwas Anand",
 email: "yahiwa5710@99mimpi.com",
 phoneNumber: "+91-1111-0000-2222",
 addresss: "4th cross, LA",
}

const issuerKeys = {"publicKey":{"@context":"https://w3id.org/security/v2","id":"did:hs:45366005-5fe7-4efe-8581-ef73201a3bc4#z6Mkn8haqXgd9jotYHVsiKvtLR6MVrD9zkngdSMrDLG7rvqg","type":"Ed25519VerificationKey2018","publicKeyBase58":"8gSYFHSBpCKRRnfB2ky3VKYMgGwJasYKwRSvP4J6wi4J"},"privateKeyBase58":"6UtVLp9duZhkuEfks8kMZDpqrGDjGL5ztURxMfxxY9yXQGYs7dxR1dSMPXHjWaLaeMcKzkGqS6U3tTRWGBZWSmY"}
const holderKeys = {"publicKey":{"@context":"https://w3id.org/security/v2","id":"did:hs:56c5952c-bf3a-490c-b601-69ba8c5633bb#z6MknGwtercwdjHSzoZRVgqksER7R5YV5Jp6BEZHpRtJ1Q6m","type":"Ed25519VerificationKey2018","publicKeyBase58":"8pgr4cNWJBnytJiip7sv28s7bWGdfRZjVDeMz9vH6BKP"},"privateKeyBase58":"k21g6A34T2knufDA2ahqd4tphWTzPpz7HJhiEHnde9oNGiWSnTdourPj7AjbgLN7AWgEhtaogYzhfqkh2rbC8rm"}

generateCredential(schemaUrl, {
    subjectDid: holderKeys.publicKey.id,
    issuerDid: issuerKeys.publicKey.id,
    expirationDate: new Date().toISOString(),
    attributesMap
}).then(credential => {
    console.log(credential)
    console.log("Credentials end=======================================")
    console.log("SignedCredential start=======================================")
    return signCredential(credential, issuerKeys.publicKey.id, issuerKeys.privateKeyBase58)
}).then(signedCredential => {
    console.log(signedCredential)
    sCredential = signedCredential;
    console.log("SignedCredential end=======================================")
    console.log("VerifyCredential start=======================================")
    return verifyCredential(signedCredential, issuerKeys.publicKey.id)
}).then(result => {
    console.log(result)
    console.log("VerifyCredential end=======================================")
    console.log("Presentation start=======================================")
    return generatePresentation(sCredential, holderKeys.publicKey.id)
})
.then(presentation => {
    console.log(presentation)
    console.log("Presentation end=======================================")
    console.log("SignedPresentation start=======================================")
    return signPresentation(presentation, holderKeys.publicKey.id, holderKeys.privateKeyBase58, challenge)
})
.then(signedPresentation => {
    console.log(JSON.stringify(signedPresentation, null, 2))
    console.log("SignedPresentation end=======================================")
    console.log("VerifyPresentation start=======================================")
    return verifyPresentation({presentation: signedPresentation, challenge, issuerDid: issuerKeys.publicKey.id, holderDid: holderKeys.publicKey.id})
})
.then(result => {
    console.log(JSON.stringify(result, null, 2))
    console.log("VerifyPresentation end=======================================")
})
.catch(e => {
    console.log(e)
})
