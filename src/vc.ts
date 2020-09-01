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
const HYPERSIGN_NETWORK_DID_URL="http://localhost:5000/api/did/resolve/"
const HYPERSIGN_NETWORK_SCHEMA_URL="http://localhost:5000/api/schema/get/"

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

const fetchData = async (url) => (await (await fetch(url)).json())


const resolve = async (did) => {
    const didDoc = await fetchData(HYPERSIGN_NETWORK_DID_URL + did);
    if(didDoc['status'] === 500) throw new Error('Could not resolve signerDid ='+ did)
    return didDoc;
} 

export async function generateCredential (schemaUrl, params: {subjectDid, issuerDid, expirationDate, attributesMap: Object}){
    let schemaDoc:ISchemaTemplate = {} as ISchemaTemplate
    let issuerDidDoc = {}
    let subjectDidDoc = {}
    try{
        schemaDoc = await fetchData(schemaUrl);
    }catch(e){
        throw new Error('Could not resolve the schema from url = ' + schemaUrl)
    }

    const issuerDid = params.issuerDid.split('#')[0]
    const subjectDid = params.subjectDid.split('#')[0]
    issuerDidDoc = await resolve(issuerDid);
    subjectDidDoc = await resolve(subjectDid);
    
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
    
    vc.issuer = issuerDid;
    
    vc.credentialSubject = getCredentialSubject(schemaDoc.schema, params.attributesMap)
    vc.credentialSubject['id'] = subjectDid;

    return vc;
}



export async function signCredential (credential, issuerDid, privateKey){
    issuerDid = issuerDid.split('#')[0]
    let signerDidDoc = await resolve(issuerDid);
    let publicKeyId = signerDidDoc['assertionMethod'][0];
    let publicKey = signerDidDoc['publicKey'].find(x => x.id == publicKeyId)

    const suite  = new Ed25519Signature2018({
        verificationMethod: publicKeyId,
        key: new Ed25519KeyPair({ privateKeyBase58: privateKey, ...publicKey })
    })
    const signedVC = await vc.issue({ credential, suite, documentLoader });
    return signedVC
}

// type = assertionMethod | authentication
const getControllerAndPublicKeyFromDid = async(did, type) =>{
    let controller = {}, publicKey = {}
    did = did.split('#')[0]
    let didDoc = await resolve(did);
    
    let methodType = didDoc[type];
    publicKey = didDoc['publicKey'].find(x => x.id == methodType[0])
    if(!publicKey['controller']){
        controller = {
            '@context' : "https://w3id.org/security/v2",
            'id': did
        }
        controller[type] = methodType
    }else{
        controller = publicKey['controller']
    }

    return {
        controller, publicKey
    }
    
}

// https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L251
export async function verifyCredential (credential, issuerDid){
    if(!credential) throw new Error("Credential can not be undefined")
    // TODO: this is not the correct way to fetch controller. it should comes from url present in the controller property of publickey
    // TODO work on controller object 
    const {controller :  issuerController, publicKey} = await getControllerAndPublicKeyFromDid(issuerDid, 'assertionMethod')
    const purpose = new AssertionProofPurpose({
        controller: issuerController
    })

    const suite = new Ed25519Signature2018({
        key: new Ed25519KeyPair(publicKey)
      })

    const result = await vc.verifyCredential({credential, purpose, suite, documentLoader});
    return result
}

export async function generatePresentation(verifiableCredential, holderDid){
    const id = getId('VP');
    const presentation = vc.createPresentation({ verifiableCredential, id, holderDid});
    return presentation;
}

export async function signPresentation (presentation, holderDid, privateKey, challenge = undefined){
    holderDid = holderDid.split('#')[0]
    let signerDidDoc = await resolve(holderDid);
    let publicKeyId = signerDidDoc['assertionMethod'][0];
    let publicKey = signerDidDoc['publicKey'].find(x => x.id == publicKeyId)

    const suite  = new Ed25519Signature2018({
        verificationMethod: publicKeyId,
        key: new Ed25519KeyPair({ privateKeyBase58: privateKey, ...publicKey })
    })
    if(!challenge || challenge == "") challenge = getId(undefined);
    const signedVP = await vc.signPresentation({ presentation, suite, challenge ,documentLoader });
    return signedVP
}

// https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L392
export async function verifyPresentation ({presentation, challenge, domain = undefined, issuerDid, holderDid}){
    if(!presentation) throw new Error("Credential can not be undefined")
    // TODO: this is not the correct way to fetch controller. it should comes from url present in the controller property of publickey
    // TODO: work on controller 
    // Holder
    const {controller :  holderController, publicKey: holderPublicKey} = await getControllerAndPublicKeyFromDid(holderDid, 'authentication')
    const presentationPurpose = new AuthenticationProofPurpose({
        controller: holderController,
        domain,
        challenge
    })
    const vpSuite = new Ed25519Signature2018({
        key: new Ed25519KeyPair(holderPublicKey)
      })
  
    // Issuer
    const {controller :  issuerController, publicKey: issuerPublicKey} = await getControllerAndPublicKeyFromDid(issuerDid, 'assertionMethod')
    const purpose = new AssertionProofPurpose({
        controller: issuerController
      })
    const vcSuite = new Ed25519Signature2018({
        key: new Ed25519KeyPair(issuerPublicKey)
      })

    const result = await vc.verify({presentation, presentationPurpose, purpose, suite: [vpSuite, vcSuite], documentLoader});
    return result
}





