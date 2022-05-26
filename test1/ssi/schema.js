const { props, writeDataInFile, createWallet } = require('../config')
const HypersignSsiSDK = require('../../dist/src')

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
            author: "did:hs:a58d3f48-7f29-47a9-ae73-a0800b409be7",
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
        const privKey = "zrv2c2grj4PBRgc9j6WMHpDnWWChdXfQuMoLc6FJXFFh8CucEJvReQf93HnyPLCh7PynmogPjSqjXHbJ4tX5UN5KzWg"

        return hsSdk.schema.signSchema({ privateKey: privKey, schema })
    })
    .then(signature => {
        console.log("Signature: ", signature)
        console.log("=========Register Schema========")
        const verificationMethodId = "did:hs:a58d3f48-7f29-47a9-ae73-a0800b409be7#zBz7vTui6K5q4DarumG8cMEC1TZ19MvyPcMqSRjMfJVWc"

        return hsSdk.schema.registerSchema({ schema, signature, verificationMethodId })
    }).then(res => {
        console.log(res)
        console.log("=========Resolve Schema========")
        return hsSdk.schema.resolve({ schemaId: schema.id })
    }).then(res => {
        console.log(JSON.stringify(res, null, 2))
    })