const hsdk = require('../dist');

const options = { nodeUrl: "http://localhost:5000/", didScheme: "did:v2:hs" }

const sdkSchema = hsdk.schema(options);

sdkSchema.generateSchema({
    author: "did:v2:hs:c379647a-7a07-4a4c-8a47-1de96f843085",
    name: "HS credential template",
    description: "test",
    properties: {
        myString: "",
        myNumner: 0,
        myBool: false
    }
}).then(schema => {
    console.log(JSON.stringify(schema, null, 2));
    return sdkSchema.registerSchema(schema);
}).then(resp => {
    console.log(resp);
})


