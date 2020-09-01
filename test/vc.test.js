const lib = require('../dist/vc')
const { sign } = require('jsonld-signatures')
const { Ed25519KeyPair } = require('crypto-ld');
const { generateCredential, signCredential, verifyCredential, generatePresentation, signPresentation, verifyPresentation} = lib

// const { birth_certificate_credential, example_credential, vc_keys, signed_credential} = require('./sampleCredentials');
// Authorization Publick Key
const keys = {
    "publicKey": {
        "@context": "https://w3id.org/security/v2",
        "id": "did:hs:newDid123:nym:z6MknshWwzBaWsZ7jph8pUeJWg8rhoub7dK6upUK3WMJqd6m#z6MkjJsP7dF4ErZyvDXMTqCUquWftT3zFgu5hg5Wg6Ep1THa",
        "type": "Ed25519VerificationKey2018",
        "publicKeyBase58": "5rcLXNzcuK5WoigenGEdzoxg4sn8qoej1fAaqpGo6EWC",
        "controller": {
            '@context' : "https://w3id.org/security/v2",
            'id': 'did:hs:newDid123:nym:z6MknshWwzBaWsZ7jph8pUeJWg8rhoub7dK6upUK3WMJqd6m',
            "assertionMethod": ["did:hs:newDid123:nym:z6MknshWwzBaWsZ7jph8pUeJWg8rhoub7dK6upUK3WMJqd6m#z6MkjJsP7dF4ErZyvDXMTqCUquWftT3zFgu5hg5Wg6Ep1THa"]
        }
    },
    "privateKeyBase58": "3m3tZVtynLqce67XxLLNg3ApSbeeSpsHHdTXsRFP8jH1JWbcbhh2igJeC6CgXD8srLTx2rggxG4YkekSBb1HiNwa"
 }

// Authentication publickey
const vpKeys = {
    "publicKey": {
        "@context": "https://w3id.org/security/v2",
        "id": "did:v1:test:nym:z6MknshWwzBaWsZ7jph8pUeJWg8rhoub7dK6upUK3WMJqd6m#z6MksL9CNsMS5W9pSv1jYeGkTkdjzDKdnmP293AW38BK4Qet",
        "type": "Ed25519VerificationKey2018",
        "publicKeyBase58": "9RSUMjw9BL4edKrS8ugTfaartEdjhk4kDoZPDEPHvQKP",
        "controller": {
            '@context' : "https://w3id.org/security/v2",
            'id': 'did:v1:test:nym:z6MknshWwzBaWsZ7jph8pUeJWg8rhoub7dK6upUK3WMJqd6m',
            "authentication": ["did:v1:test:nym:z6MknshWwzBaWsZ7jph8pUeJWg8rhoub7dK6upUK3WMJqd6m#z6MksL9CNsMS5W9pSv1jYeGkTkdjzDKdnmP293AW38BK4Qet"]
        }
    },
    "privateKeyBase58": "ZxCUJSxY8xKPwGoXDm2VHGQfvHdzwYySgXFuMgvhfFKBRs1pG39uwWgaymnwG7rFDDg23dXmyKKxGUa3bNeG8wo"
}


const challenge = "ch_adbshd131323"
let sCredential = {}
const schemaUrl = "http://localhost:5000/api/schema/get/sch_fd98d73c-00ef-41"
const attributesMap = {
 name: "Vishwas Anand",
 email: "yahiwa5710@99mimpi.com",
 phoneNumber: "+91-1111-0000-2222",
 addresss: "4th cross, LA",
}

console.log("Credentials start=======================================")
generateCredential(schemaUrl, {
    subjectDid: vpKeys.publicKey.controller.id,
    issuerDid: keys.publicKey.controller.id,
    expirationDate: new Date().toISOString(),
    attributesMap
}).then(credential => {
    //console.log(credential)
    console.log("Credentials end=======================================")
    console.log("SignedCredential start=======================================")
    return signCredential(credential, keys)
}).then(signedCredential => {
    console.log(signedCredential)
    sCredential = signedCredential;
    console.log("SignedCredential end=======================================")
    console.log("VerifyCredential start=======================================")
    return verifyCredential(signedCredential, keys.publicKey)
}).then(result => {
    console.log(result)
    console.log("VerifyCredential end=======================================")
    console.log("Presentation start=======================================")
    return generatePresentation(sCredential,vpKeys.publicKey.controller.id)
})
.then(presentation => {
    console.log(presentation)
    console.log("Presentation end=======================================")
    console.log("SignedPresentation start=======================================")
    return signPresentation(presentation,vpKeys, challenge)
})
.then(signedPresentation => {
    console.log(JSON.stringify(signedPresentation, null, 2))
    console.log("SignedPresentation end=======================================")
    console.log("VerifyPresentation start=======================================")
    return verifyPresentation({presentation: signedPresentation, challenge, vcPublicKey: keys.publicKey, vpPublicKey: vpKeys.publicKey})
})
.then(result => {
    console.log(JSON.stringify(result, null, 2))
    console.log("VerifyPresentation end=======================================")
})
.catch(e => {
    console.log(e)
})
