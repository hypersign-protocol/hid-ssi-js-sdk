const { hsSdk, props, readDateFromFile, ifFileExists } = require('./config')

const challenge = "ch_adbshd131323"
let sCredential = {}
let schemaId =  ""; //"sch_b82217b5-3869-440d-8017-74d599f53bce";

let attributesMap = {
    "name": "Anand Vishwas",
    "email": "av@gmakl.com",
    "phoneNumber": "+91-123123123"
}

let holderKeys = {};
let issuerKeys = {};

function start() {
    if(!ifFileExists('keys.json')){
        throw new Error('File keys.json not found. Run the did.test.js to generate keys.json')
    }

    if(!ifFileExists('schema.json')){
        throw new Error('File schema.json not found. Run the did.schema.js to generate schema.json')
    }

    readDateFromFile('keys.json')
    .then(data => {
        console.log("Featched issuer/holder wallets =======================================")
        issuerKeys = data;
        holderKeys = issuerKeys;
        console.log(issuerKeys)
        return readDateFromFile('schema.json')
    })
    .then((schema) => {
        console.log("Featched schema id =======================================")
        schemaId = schema["id"];
        console.log(schemaId)
        return hsSdk.init();
    })
    .then(() => {
        return hsSdk.credential.generateCredential(schemaId, {
            subjectDid: holderKeys.publicKey.id,
            issuerDid: issuerKeys.publicKey.id,
            expirationDate: new Date().toISOString(),
            attributesMap
        })
    })
    .then(credential => {
        console.log(credential)
        console.log("Credentials end=======================================")
        console.log("SignedCredential start=======================================")
        return hsSdk.credential.signCredential(credential, issuerKeys.publicKey.id, issuerKeys.privateKeyBase58)
    })
    .then(signedCredential => {
        sCredential = signedCredential;
        console.log("SignedCredential end=======================================")
        console.log("VerifyCredential start=======================================")
        console.log(sCredential)
        return hsSdk.credential.verifyCredential(signedCredential, issuerKeys.publicKey.id)
    })
    .then(result => {
        console.log(result)
        console.log("VerifyCredential end=======================================")
        console.log("Presentation start=======================================")
        return hsSdk.credential.generatePresentation(sCredential, holderKeys.publicKey.id)
    })
    .then(presentation => {
        console.log(presentation)
        console.log("Presentation end=======================================")
        console.log("SignedPresentation start=======================================")
        return hsSdk.credential.signPresentation(presentation, holderKeys.publicKey.id, holderKeys.privateKeyBase58, challenge)
    })
    .then(signedPresentation => {
        console.log(JSON.stringify(signedPresentation, null, 2))
        console.log("SignedPresentation end=======================================")
        console.log("VerifyPresentation start=======================================")
        return hsSdk.credential.verifyPresentation({presentation: signedPresentation, challenge, issuerDid: issuerKeys.publicKey.id, holderDid: holderKeys.publicKey.id})
    })
    .then(result => {
        console.log(result)
        console.log("VerifyPresentation end=======================================")
    })
    .catch(e => {
        console.log(e)
    })
    
}

start();
