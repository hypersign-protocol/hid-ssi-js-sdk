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
    console.log("======Sign Schema=====")
    const privKeyBytes = new Uint8Array([
        179,  50,  21, 242,   5,  62,   4, 198, 159,  61,  41,
        138, 132,  93, 112, 224,   6, 234,  32,  81, 195, 160,
        101, 121, 231, 204, 145, 188, 118, 104, 175, 223,  64,
        154, 202, 244, 242, 232,  80,  66, 141, 114, 147, 204,
         86,  46,  21, 178, 243,  58,  35,  53,  71,  71, 108,
        157,  45, 187,  75,  55, 203,  49, 159, 103
      ])
    
    return hsSdk.schema.signSchema(privKeyBytes, schemaString)
})
.then(signature => {
    console.log("Signature: ", signature)
    console.log("=========Register Schema========")
    const verificationMethodId = "did:hs:b0c9f766-c155-43ec-be2b-1a0c651501e9#z5MBzYjvm1cGSmX2B27x5BqY835KbC9vghmkcka7hJPCi"
    
    return hsSdk.schema.registerSchema(schemaString, signature, verificationMethodId)
}).then(res => {
    console.log(res)
    console.log("=========Resolve Schema========")
    return hsSdk.schema.resolve(JSON.parse(schemaString)["id"])
}).then(res => {
    console.log(res)
})
