const { props, writeDataInFile, createWallet, mnemonic, hidNodeEp } = require('../config')
const HypersignSsiSDK = require('../../build/src')
const { privateKeyMultibase } = require('../mock/public/keys.json')
const { verificationMethod, id, assertionMethod } = require('../mock/public/did.json')


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
let proof = {
    "type": "Ed25519Signature2020",
    "created": "",
    "verificationMethod": assertionMethod[0],
    "proofValue": "",
    "proofPurpose": "assertion"
}
createWallet(mnemonic)
    .then((offlineSigner) => {
        hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
        return hsSdk.init();
    })
    .then(() => {
        console.log("======Generate Schema=====")
        const schemaOptions = {
            name: "Email Schema Test",
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
            },

        }
        return hsSdk.schema.getSchema({
            name: schemaOptions.name,
            description: "This is email credential test",
            author: schemaOptions.author,
            additionalProperties: false,
            fields: schemaOptions.schemaProperty.properties,
        })
    })
    .then((schemaLocal) => {
        schema = schemaLocal
        console.log(schema)
        console.log("========Sign Schema=======")
        const privKey = privateKeyMultibase
        return hsSdk.schema.signSchema({ privateKey: privKey, schema })
    })
    .then(signature => {
        console.log("Signature: ", signature)
        console.log("=========Register Schema========")
        proof.proofValue = signature
        proof.created = schema.authored
        console.log(schema, proof);
        return hsSdk.schema.registerSchema({ schema, proof })
    }).then(res => {
        console.log("=========Resolve Schema========")
        console.log(res)
        return hsSdk.schema.resolve({ schemaId: schema.id })
    }).then(res => {
        writeDataInFile('../mock/public/schema.json', JSON.stringify(res))
        console.log(JSON.stringify(res, null, 2))
    })

    .then(() => {
        console.log("=========Edit Schema========")
        
        const properties=JSON.parse(schema.schema.properties)
        properties.rollno={type:"string"}
        schema.schema.properties=JSON.stringify(properties)
        let schemaId=schema.id
        schemaId=schemaId.replace("1.0","1.1")
        schema.id=schemaId               

        console.log("========Sign Schema=======")
        const privKey = privateKeyMultibase
        return hsSdk.schema.signSchema({ privateKey: privKey, schema })
    })
    .then(signature => {
        console.log("Signature: ", signature)
        console.log("=========Register Schema========")
        proof.proofValue = signature
        proof.created = schema.authored
        console.log(schema, proof);
        return hsSdk.schema.registerSchema({ schema, proof })
    }).then(res => {
        console.log("=========Resolve Schema========")
        console.log(res)
        return hsSdk.schema.resolve({ schemaId: schema.id })
    }).then(res => {
        writeDataInFile('../mock/public/schema.json', JSON.stringify(res))
        console.log(JSON.stringify(res, null, 2))
    })