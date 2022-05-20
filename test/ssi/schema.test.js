const { props, writeDataInFile, createWallet } = require('../config')
const HypersignSsiSDK = require('../../dist')

const author = "did:hs:72ed2dbc-4970-4bdd-8dd0-41cc7c9377d1";
let schemaId = ""

let hsSdk;
let schema;

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
            author: "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83",
            schemaProperty: {
                properties: [{
                        name: "email",
                        type: "string",
                        format: "email",
                        isRequired: true
                    },
                    {
                        name: "name",
                        type: "string",
                        isRequired: true
                    },
                    {
                        name: "modelname",
                        type: "string",
                        isRequired: false
                    }
                ],
            }
        }
        schema = hsSdk.schema.getSchema({
            name: schemaOptions.name,
            description: "This is email credential",
            author: schemaOptions.author,
            additionalProperties: false,
            fields: schemaOptions.schemaProperty.properties
        })
    })
    .then(() => {
        console.log(schema)
        console.log("========Sign Schema=======")
        const privKey = "axnVlW2g5pnNe2lWCkPGQZ02GII4qUEYmokXmVHIvmogu6/FjZdh9HPqPz4kPLe4eMrKFCUaO2jI5h0eeAoDcA=="

        return hsSdk.schema.signSchema({ privateKey: privKey, schema })
    })
    .then(signature => {
        console.log("Signature: ", signature)
        console.log("=========Register Schema========")
        const verificationMethodId = "did:hs:092fe5aa-1e27-4705-9ed2-b389b962cd83#z3Cn3AXpHMBWBfV14KSBwGqWnBdHEAf6zP74SR4JWuANT"

        return hsSdk.schema.registerSchema({ schema, signature, verificationMethodId })
    }).then(res => {
        console.log(res)
        console.log("=========Resolve Schema========")
        return hsSdk.schema.resolve({ schemaId: schema.id })
    }).then(res => {
        console.log(JSON.stringify(res, null, 2))
    })