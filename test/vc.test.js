const lib = require('../dist/vc')
const { generateCredential, signCredential, verifyCredential} = lib

// const { birth_certificate_credential, example_credential, vc_keys, signed_credential} = require('./sampleCredentials');

const keys = {
    "publicKey": {
        "@context": "https://w3id.org/security/v2",
        "id": "did:hs:newDid123#z6MkjJsP7dF4ErZyvDXMTqCUquWftT3zFgu5hg5Wg6Ep1THa",
        "type": "Ed25519VerificationKey2018",
        "publicKeyBase58": "5rcLXNzcuK5WoigenGEdzoxg4sn8qoej1fAaqpGo6EWC",
    },
    "privateKeyBase58": "3m3tZVtynLqce67XxLLNg3ApSbeeSpsHHdTXsRFP8jH1JWbcbhh2igJeC6CgXD8srLTx2rggxG4YkekSBb1HiNwa"
}



const schemaUrl = "http://localhost:5000/api/schema/get/sch_fd98d73c-00ef-41"
const attributesMap = {
 name: "Vishwas Anand",
 email: "yahiwa5710@99mimpi.com",
 phoneNumber: "+91-1111-0000-2222",
 addresss: "4th cross, LA",
}

console.log("Credentials start=======================================")
generateCredential(schemaUrl, {
    subjectDid: keys.publicKey.id,
    issuerDid: keys.publicKey.id,
    expirationDate: new Date().toISOString(),
    attributesMap
}).then(credential => {
    console.log(credential)
    console.log("Credentials end=======================================")
    console.log("SignedCredential start=======================================")
    return signCredential(credential, keys)
}).then(signedCredential => {
    console.log(signedCredential)
    console.log("SignedCredential end=======================================")
    console.log("VerifyCredential start=======================================")
    return verifyCredential(signedCredential, keys.publicKey)
})
.then(result => {
    console.log(result)
    console.log("VerifyCredential end=======================================")
})
.catch(e => {
    console.log(e)
})
