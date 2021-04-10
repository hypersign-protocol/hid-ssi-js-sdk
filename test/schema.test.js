const HypersignSsiSDK = require('../dist')

const options = { nodeUrl: "http://localhost:5000" }
const hsSdk = new HypersignSsiSDK(options); 

const sdkSchema = hsSdk.schema;

// const props = {
//     "name": "IDO App",
//     "did": "did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51",
//     "owner": "did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51",
//     "schemaId": "sch_a18f90f4-36a9-41",
//     "serviceEp": "http://192.168.43.43:4006",
//     "subscriptionId": "subs_9eda0fab-82d7-4",
//     "planId": "pln_1ee9aa7b-95b3-42",
//     "planName": "Tier 1",
// }

const props = {
    "name": "",
    "email": ""
}
const author1 = "did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51";
const author2 = "did:hs:894865ee-4b45-40df-bda6-f8ee7750b908";

async function createSchema() {

sdkSchema.generateSchema({
    author: author2,
    name: "Hypersign App Credential",
    description: "Credential for application to access Hypersign APIs",
    properties: props
}).then(schema => {
    console.log(JSON.stringify(schema, null, 2));
    return sdkSchema.registerSchema(schema);
}).then(resp => {
    console.log(resp);
})

}

async function getSchemaTest () {
   
const schemaId = 'sch_9702b363-b7bc-4efa-9800-3ab5460d62de';
sdkSchema.getSchema({}).then(res => { // 0,0
    console.log("======= No, No ===========")
    console.log(`All schema available: ${res.length}`);
})

sdkSchema.getSchema({ author: author1}).then(res => { //0,1
    console.log("======= No, Yes ===========")
    console.log(`All schemas authored by ${author1} are ${res.length}`);
})

sdkSchema.getSchema({ author: author2}).then(res => { //0,1
    console.log("======= No, Yes ===========")
    console.log(`All schemas authored by ${author2} are ${res.length}`);
})


sdkSchema.getSchema({schemaId, author: author2}).then(res => { //1,1
    console.log("======= Yes, Yes ===========")
    console.log(`Schema ${schemaId} authored by ${author2}:${JSON.stringify(res)}`);
})


sdkSchema.getSchema({schemaId}).then(res => { //1,0
    console.log("======= Yes, No ===========")
    console.log(`Schema ${schemaId} :${JSON.stringify(res)}`);
})

// In case of invalid schema
sdkSchema.getSchema({schemaId: schemaId + "----"}).then(res => { //1,0
    console.log("======= Error ===========")
    console.log(`Schema ${schemaId + "----"} :${JSON.stringify(res)}`);
})
}

getSchemaTest();

