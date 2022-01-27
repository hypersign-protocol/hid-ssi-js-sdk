const { hsSdk, props, writeDataInFile } = require('./config')

const author = "did:hs:72ed2dbc-4970-4bdd-8dd0-41cc7c9377d1";
let schemaId = ""

hsSdk.init()
.then(() => {
    console.log("===============GENERATE SCHEMA=======================")
    return hsSdk.schema.generateSchema({
        author,
        name: "Hypersign App Credential",
        description: "Credential for application to access Hypersign APIs",
        properties: props
    })
})
.then(schema => {
    writeDataInFile('schema.json', JSON.stringify(schema))
    schemaId = schema["id"];
    console.log({schemaId, schema});
    console.log("===============CREATE SCHEMA=======================")
    return hsSdk.schema.registerSchema(schema);
})
.then(resp => {
    console.log(resp);
    console.log("===============FETCH SCHEMA=======================")
    return hsSdk.schema.getSchema(schemaId)
})
.then(res => { //1,0
    console.log(res);
})
.catch(e => {
    console.log(e)
})

