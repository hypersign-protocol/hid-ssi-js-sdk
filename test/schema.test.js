const { props, writeDataInFile, createWallet } = require('./config')
const HypersignSsiSDK = require('../dist')

const author = "did:hs:72ed2dbc-4970-4bdd-8dd0-41cc7c9377d1";
let schemaId = ""

// hsSdk.init()
// .then(() => {
//     console.log("===============GENERATE SCHEMA=======================")
//     return hsSdk.schema.generateSchema({
//         author,
//         name: "Hypersign App Credential",
//         description: "Credential for application to access Hypersign APIs",
//         properties: props
//     })
// })
// .then(schema => {
//     writeDataInFile('schema.json', JSON.stringify(schema))
//     schemaId = schema["id"];
//     console.log({schemaId, schema});
//     console.log("===============CREATE SCHEMA=======================")
//     return hsSdk.schema.registerSchema(schema);
// })
// .then(resp => {
//     console.log(resp);
//     console.log("===============FETCH SCHEMA=======================")
//     return hsSdk.schema.getSchema(schemaId)
// })
// .then(res => { //1,0
//     console.log(res);
// })
// .catch(e => {
//     console.log(e)
// })

let hsSdk;
let schemaString;

const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
createWallet(mnemonic)
.then((offlineSigner) => {
    hsSdk = new HypersignSsiSDK(offlineSigner, "http://localhost:26657", "http://localhost:1317");
    return hsSdk.init();
})
.then(() => {
    console.log("======Generate Schema=====")
    const schemaOptions = {
        name: "Email Schema",
        author: "did:hs:deb2310d-05ae-44cf-9048-b314616cf673",
        schemaProperty: {
            schema: "http://json-schema.org/draft-07/schema",
            description: "email",
            type: "object",
            properties: "{emailAddress}",
            required: ["emailAddress"],
            additionalProperties: false
        }
    }
    hsSdk.schema.setFields(schemaOptions)
    schemaString = hsSdk.schema.getSchemaString()
})
.then(() => {
    console.log(schemaString)
    console.log("========Sign Schema=======")
    const privKey = "f/vYFEtmAQ1rD+SrhALTV/XcG2ElRVIZxOyM7HVS6ihyZ9mAT3uTwwK1sEV5T2gVyyIY7Pqm4hBejFsPz0pptA=="
    
    return hsSdk.schema.signSchema(privKey, schemaString)
})
.then(signature => {
    console.log("Signature: ", signature)
    console.log("=========Register Schema========")
    const verificationMethodId = "did:hs:deb2310d-05ae-44cf-9048-b314616cf673#z8hbKiTnGpwgk4xjAjdGGtdZPueiTm5DW8oFhH4Rg1QdZ"
    
    return hsSdk.schema.registerSchema(schemaString, signature, verificationMethodId)
}).then(res => {
    console.log(res)
    console.log("=========Resolve Schema========")
    return hsSdk.schema.resolve(JSON.parse(schemaString)["id"])
}).then(res => {
    console.log(res)
})
