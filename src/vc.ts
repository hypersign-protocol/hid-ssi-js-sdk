// Signing (issuing) a Verifiable Credential (VC).
// Verifying a standalone VC

// Creating a Verifiable Presentation (VP), signed or unsigned
// Verifying a VP

const vc = require('vc-js');
const { Ed25519KeyPair } = require('crypto-ld');
const jsonSigs = require('jsonld-signatures')
const {extendContextLoader} =require('jsonld-signatures')
const { Ed25519Signature2018 } = jsonSigs.suites;
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;

const { documentLoader } = require('jsonld');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const VC_PREFIX = "vc_";
const VP_PREFIX = "vp_";

const getId = (type) => {
    const id = uuidv4();
    return type ? (type === 'VC'? VC_PREFIX+id: (type === 'VP' ? VP_PREFIX + id: id)): id;
}

interface ISchemaTemplate_Schema{
    $schema: string;
    description: string;
    type: string;
    properties: {};
    required: Array<string>;
    additionalProperties: boolean
}

interface ISchemaTemplate {
    type: string;
    modelVersion: string;
    id: string;
    name: string;
    author: string;
    authored: string;
    schema: ISchemaTemplate_Schema        
}

// https://www.w3.org/TR/vc-data-model/#basic-concepts
interface IVerifiableCredential{
    id: string;
    type: Array<string>;
    issuer: string;
    issuanceDate: string;
    expirationDate: string;
    credentialSubject: Object;
    proof: Object
}

// https://www.w3.org/TR/vc-data-model/#presentations-0
interface IVerifiablePresentation{
    id: string;
    type: Array<string>;
    verifiableCredential: Array<IVerifiableCredential>;
    holder: string;
    proof: Object
}

const checkIfAllRequiredPropsAreSent = (sentAttributes: Array<string>, requiredProps: Array<string>) => {
    return !requiredProps.some(x => sentAttributes.indexOf(x) === -1)
}

const getCredentialSubject = (schema: ISchemaTemplate_Schema, attributesMap: Object):Object => {
    const cs: Object = {};
    
    const sentPropes:Array<string>  = Object.keys(attributesMap)
    const SchemaProps:Array<string> = Object.keys(schema.properties)
    let props:Array<string> = []
    // Check for "additionalProperties" in schema
    if(!schema.additionalProperties){
        if(sentPropes.length > SchemaProps.length || !checkIfAllRequiredPropsAreSent(sentPropes, SchemaProps)) throw new Error(`Only ${JSON.stringify(SchemaProps)} attributes are possible. additionalProperties is false in the schema`)
        props = SchemaProps
    }else{
        props = sentPropes
    }

    // Check all required propes
    const requiredPros:Array<string>  = Object.values(schema.required)
    if(!checkIfAllRequiredPropsAreSent(sentPropes, requiredPros)) throw new Error(`${JSON.stringify(requiredPros)} are required properties`)

    // Attach the values of props
    props.forEach(p => {
        cs[p] = attributesMap[p]
    })

    return cs
}

// TODO: https://www.w3.org/TR/vc-data-model/#data-schemas 
const getCredentialContext = (schemaUrl, schema: ISchemaTemplate_Schema) => {
    const context: any = []
    context.push("https://www.w3.org/2018/credentials/v1")
    context.push({
        'hsscheme': schemaUrl
    })
    
    const props:Array<string> = Object.keys(schema.properties)
    props.forEach(x => {
        const obj = {}
        obj[x] = `hsscheme:${x}`
        context.push(obj)
    })

    return context
}

const getSchemaDoc = async (url) => (await (await fetch(url)).json())

export async function generateCredential (schemaUrl, params: {subjectDid, issuerDid, expirationDate, attributesMap: Object}){
    let schemaDoc:ISchemaTemplate = {} as ISchemaTemplate
    try{
        schemaDoc = await getSchemaDoc(schemaUrl);
    }catch(e){
        throw new Error('Could not resolve the schema from url = ' + schemaUrl)
    }

    // TODO: do proper check for date and time
    // if(params.expirationDate < new Date()) throw  new Error("Expiration date can not be lesser than current date")

    let vc: IVerifiableCredential = {} as IVerifiableCredential
    // vc['@context'] = [
    //     "https://www.w3.org/2018/credentials/v1",
    //     schemaUrl
    //   ];
    vc['@context'] = await getCredentialContext(schemaUrl, schemaDoc.schema)

    vc.id = getId('VC');

    vc.type = []
    vc.type.push("VerifiableCredential")
    vc.type.push(schemaDoc.name)

    vc.expirationDate = params.expirationDate;
    
    vc.issuanceDate = new Date().toISOString()
    
    vc.issuer = params.issuerDid;
    
    vc.credentialSubject = getCredentialSubject(schemaDoc.schema, params.attributesMap)
    vc.credentialSubject['id'] = params.subjectDid;

    return vc;
}

export async function signCredential (credential, keys){
    const { publicKey, privateKeyBase58} = keys
    const suite  = new Ed25519Signature2018({
        verificationMethod: publicKey.id,
        key: new Ed25519KeyPair({ privateKeyBase58, ...publicKey })
    })
    const signedVC = await vc.issue({ credential, suite, documentLoader });
    return signedVC
}

// https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L251
export async function verifyCredential (credential, publicKey){
    if(!credential) throw new Error("Credential can not be undefined")
    // TODO: this is not the correct way to fetch controller. it should comes from url present in the controller property of publickey
    // TODO work on controller object 

    const purpose = new AssertionProofPurpose({
        controller: publicKey.controller
      })

    const suite = new Ed25519Signature2018({
        key: new Ed25519KeyPair(publicKey)
      })

    const result = await vc.verifyCredential({credential, purpose, suite, documentLoader});
    return result
}

export async function generatePresentation(verifiableCredential, holder){
    const id = getId('VP');
    const presentation = vc.createPresentation({ verifiableCredential, id, holder});
    return presentation;
}

export async function signPresentation (presentation, keys, challenge = undefined){
    const { publicKey, privateKeyBase58} = keys
    const suite  = new Ed25519Signature2018({
        verificationMethod: publicKey.id,
        key: new Ed25519KeyPair({ privateKeyBase58, ...publicKey })
    })
    if(!challenge || challenge == "") challenge = getId(undefined);
    const signedVP = await vc.signPresentation({ presentation, suite, challenge ,documentLoader });
    return signedVP
}

// https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L392
export async function verifyPresentation ({presentation, challenge, domain = undefined, vcPublicKey, vpPublicKey}){
    if(!presentation) throw new Error("Credential can not be undefined")
    // TODO: this is not the correct way to fetch controller. it should comes from url present in the controller property of publickey
    // TODO work on controller 
    const presentationPurpose = new AuthenticationProofPurpose({
        controller: vpPublicKey.controller,
        domain,
        challenge
    })
  
    const purpose = new AssertionProofPurpose({
        controller: vcPublicKey.controller
      })

    const vpSuite = new Ed25519Signature2018({
        key: new Ed25519KeyPair(vpPublicKey)
      })

    const vcSuite = new Ed25519Signature2018({
        key: new Ed25519KeyPair(vcPublicKey)
      })

    const result = await vc.verify({presentation, presentationPurpose, purpose, suite: [vpSuite, vcSuite], documentLoader});
    return result
}





