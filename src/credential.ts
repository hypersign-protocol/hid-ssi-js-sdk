import * as constant from './constants'
import Utils from './utils'
import vc from 'vc-js'
import { Ed25519KeyPair } from 'crypto-ld'
import jsonSigs from 'jsonld-signatures'
import { documentLoader } from 'jsonld'
import { v4 as uuidv4 } from 'uuid';
import IOptions from './IOptions';

const VC_PREFIX = "vc_";
const VP_PREFIX = "vp_";
const { Ed25519Signature2018 } = jsonSigs.suites;
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;

interface ISchemaTemplate_Schema {
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
interface IVerifiableCredential {
    id: string;
    type: Array<string>;
    issuer: string;
    issuanceDate: string;
    expirationDate: string;
    credentialSubject: Object;
    proof: Object
}

// https://www.w3.org/TR/vc-data-model/#presentations-0
interface IVerifiablePresentation {
    id: string;
    type: Array<string>;
    verifiableCredential: Array<IVerifiableCredential>;
    holder: string;
    proof: Object
}

export interface ICredential{

    generateCredential(schemaUrl, params: { subjectDid, issuerDid, expirationDate, attributesMap: Object }): Promise<any>;
    signCredential(credential, issuerDid, privateKey): Promise<any>;
    verifyCredential(credential: object, issuerDid: string): Promise<any>;
    generatePresentation(verifiableCredential, holderDid): Promise<any> ;
    signPresentation(presentation, holderDid, privateKey, challenge): Promise<any> 
    verifyPresentation({ presentation, challenge, domain, issuerDid, holderDid }) : Promise<any>


}
export default class credential implements ICredential{
    private utils: any;
    constructor(options: IOptions, wallet) {
        this.utils = new Utils(options, wallet);
    }

    private getId = (type) => {
        const id = uuidv4();
        return type ? (type === 'VC' ? VC_PREFIX + id : (type === 'VP' ? VP_PREFIX + id : id)) : id;
    }

    private checkIfAllRequiredPropsAreSent = (sentAttributes: Array<string>, requiredProps: Array<string>) => {
        return !requiredProps.some(x => sentAttributes.indexOf(x) === -1)
    }

    private getCredentialSubject = (schema: ISchemaTemplate_Schema, attributesMap: Object): Object => {
        const cs: Object = {};

        const sentPropes: Array<string> = Object.keys(attributesMap)
        const SchemaProps: Array<string> = Object.keys(schema.properties)
        let props: Array<string> = []
        // Check for "additionalProperties" in schema
        if (!schema.additionalProperties) {
            if (sentPropes.length > SchemaProps.length || !this.checkIfAllRequiredPropsAreSent(sentPropes, SchemaProps)) throw new Error(`Only ${JSON.stringify(SchemaProps)} attributes are possible. additionalProperties is false in the schema`)
            props = SchemaProps
        } else {
            props = sentPropes
        }

        // Check all required propes
        const requiredPros: Array<string> = Object.values(schema.required)
        if (!this.checkIfAllRequiredPropsAreSent(sentPropes, requiredPros)) throw new Error(`${JSON.stringify(requiredPros)} are required properties`)

        // Attach the values of props
        props.forEach(p => {
            cs[p] = attributesMap[p]
        })

        return cs
    }

    // TODO: https://www.w3.org/TR/vc-data-model/#data-schemas 
    // TODO: handle schemaUrl variable properly later.
    private getCredentialContext = (schemaUrl, schema: ISchemaTemplate_Schema) => {
        const context: any = []
        context.push("https://www.w3.org/2018/credentials/v1")
        context.push({
            'hsscheme': schemaUrl
        });

        const props: Array<string> = Object.keys(schema.properties)
        props.forEach(x => {
            const obj = {}
            obj[x] = `hsscheme:${x}`
            context.push(obj)
        });

        return context;
    }

    async generateCredential(schemaUrl, params: { subjectDid, issuerDid, expirationDate, attributesMap: Object }): Promise<any> {
        let schemaDoc: ISchemaTemplate = {} as ISchemaTemplate
        let issuerDidDoc = {}
        let subjectDidDoc = {}
        try {
            schemaDoc = await this.utils.fetchData(schemaUrl);
        } catch (e) {
            throw new Error('Could not resolve the schema from url = ' + schemaUrl)
        }

        const issuerDid = params.issuerDid.split('#')[0]
        const subjectDid = params.subjectDid.split('#')[0]
        issuerDidDoc = await this.utils.resolve(issuerDid);
        subjectDidDoc = await this.utils.resolve(subjectDid);

        // TODO: do proper check for date and time
        // if(params.expirationDate < new Date()) throw  new Error("Expiration date can not be lesser than current date")

        let vc: IVerifiableCredential = {} as IVerifiableCredential
        // vc['@context'] = [
        //     "https://www.w3.org/2018/credentials/v1",
        //     schemaUrl
        //   ];
        vc['@context'] = await this.getCredentialContext(schemaUrl, schemaDoc.schema)

        vc.id = this.getId('VC');

        vc.type = []
        vc.type.push("VerifiableCredential")
        vc.type.push(schemaDoc.name)

        vc.expirationDate = params.expirationDate;

        vc.issuanceDate = new Date().toISOString()

        vc.issuer = issuerDid;

        vc.credentialSubject = this.getCredentialSubject(schemaDoc.schema, params.attributesMap)
        vc.credentialSubject['id'] = subjectDid;

        return vc;
    }

    async signCredential(credential, issuerDid, privateKey): Promise<any> {
        issuerDid = issuerDid.split('#')[0]
        let signerDidDoc = await this.utils.resolve(issuerDid);
        if(!signerDidDoc) throw new Error("Could not resolve issuerDid = " + issuerDid);
        let publicKeyId = signerDidDoc['assertionMethod'][0];
        let publicKey = signerDidDoc['publicKey'].find(x => x.id == publicKeyId)

        const suite = new Ed25519Signature2018({
            verificationMethod: publicKeyId,
            key: new Ed25519KeyPair({ privateKeyBase58: privateKey, ...publicKey })
        })
        const signedVC = await vc.issue({ credential, suite, documentLoader });
        return signedVC
    }

    // https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L251
    async verifyCredential(credential: object, issuerDid: string): Promise<any> {
        if (!credential) throw new Error("Credential can not be undefined")
        // TODO: this is not the correct way to fetch controller. it should comes from url present in the controller property of publickey
        // TODO work on controller object 
        const { controller: issuerController, publicKey } = await this.utils.getControllerAndPublicKeyFromDid(issuerDid, 'assertionMethod')
        const purpose = new AssertionProofPurpose({
            controller: issuerController
        })

        const suite = new Ed25519Signature2018({
            key: new Ed25519KeyPair(publicKey)
        })

        const result = await vc.verifyCredential({ credential, purpose, suite, documentLoader });
        return result
    }

    async generatePresentation(verifiableCredential, holderDid): Promise<any>  {
        const id = this.getId('VP');
        const presentation = vc.createPresentation({ verifiableCredential, id, holderDid });
        return presentation;
    }

    async signPresentation(presentation, holderDid, privateKey, challenge = undefined): Promise<any>  {
        holderDid = holderDid.split('#')[0]
        let signerDidDoc = await this.utils.resolve(holderDid);
        let publicKeyId = signerDidDoc['assertionMethod'][0];
        let publicKey = signerDidDoc['publicKey'].find(x => x.id == publicKeyId)

        const suite = new Ed25519Signature2018({
            verificationMethod: publicKeyId,
            key: new Ed25519KeyPair({ privateKeyBase58: privateKey, ...publicKey })
        })
        if (!challenge || challenge == "") challenge = this.utils.getId(undefined);
        const signedVP = await vc.signPresentation({ presentation, suite, challenge, documentLoader });
        return signedVP
    }

    // https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L392
    async verifyPresentation({ presentation, challenge, domain = undefined, issuerDid, holderDid }): Promise<any> {
        if (!presentation) throw new Error("Credential can not be undefined")
        // TODO: this is not the correct way to fetch controller. it should comes from url present in the controller property of publickey
        // TODO: work on controller 
        // Holder
        const { controller: holderController, publicKey: holderPublicKey } = await this.utils.getControllerAndPublicKeyFromDid(holderDid, 'authentication')
        const presentationPurpose = new AuthenticationProofPurpose({
            controller: holderController,
            domain,
            challenge
        })
        const vpSuite = new Ed25519Signature2018({
            key: new Ed25519KeyPair(holderPublicKey)
        })

        // Issuer
        const { controller: issuerController, publicKey: issuerPublicKey } = await this.utils.getControllerAndPublicKeyFromDid(issuerDid, 'assertionMethod')
        const purpose = new AssertionProofPurpose({
            controller: issuerController
        })
        const vcSuite = new Ed25519Signature2018({
            key: new Ed25519KeyPair(issuerPublicKey)
        })

        const result = await vc.verify({ presentation, presentationPurpose, purpose, suite: [vpSuite, vcSuite], documentLoader });
        return result
    }
}   