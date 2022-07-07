const { props, writeDataInFile, createWallet, mnemonic, hidNodeEp } = require('../config')
const HypersignSsiSDK = require('../../build/src')
const { privateKeyMultibase } = require('../mock/keys.json')
const { verificationMethod, id } = require('../mock/did.json')

console.log({
    verificationMethod,
    id,
    privateKeyMultibase
})
if (!privateKeyMultibase || !verificationMethod || !id) {
    throw new Error('Please run did test case before proceeding')
}

const author = id;
let hsSdk;
let schema;
createWallet(mnemonic)
    .then((offlineSigner) => {
        hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest);
        return hsSdk.init();
    })
    .then(() => {
        console.log("======Generate Schema=====")
        const schemaOptions = {
            name: "Email Schema",
            author,
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
        const privKey = privateKeyMultibase
        return hsSdk.schema.signSchema({ privateKey: privKey, schema })
    })
    .then(signature => {
        console.log("Signature: ", signature)
        console.log("=========Register Schema========")
        const verificationMethodId = verificationMethod[0].id
        console.log(verificationMethodId)
        return hsSdk.schema.registerSchema({ schema, signature, verificationMethodId })
    }).then(res => {
        console.log(res)
        console.log("=========Resolve Schema========")
        return hsSdk.schema.resolve({ schemaId: schema.id })
    }).then(res => {
        writeDataInFile('../mock/schema.json', JSON.stringify(res))
        console.log(JSON.stringify(res, null, 2))
    })