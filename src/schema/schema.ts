import { Schema as schema, SchemaProperty } from '../generated/ssi/schema';
import { v4 as uuidv4 } from 'uuid';
import * as constant from '../constants'
import { getByteArray, getByteArraySchema } from '../utils';
import { SchemaRpc } from '../rpc/schemaRPC';
import { TextEncoder } from 'util';

const fs = require('fs')

const ed25519 = require('@stablelib/ed25519');


export default class Schema implements schema {
    type: string;
    modelVersion: string;
    id: string;
    name: string;
    author: string;
    authored: string;
    schema: SchemaProperty;

    schemaRpc: SchemaRpc;

    constructor() {
        this.schemaRpc = new SchemaRpc()

        this.type = "https://w3c-ccg.github.io/vc-json-schemas/schema/1.0/schema.json",
        this.modelVersion = "1.0",
        this.id = "",
        this.name = "",
        this.author = "",
        this.authored = ""
        this.schema = {
            schema: "",
            description: "",
            type: "",
            properties: "",
            required: [],
            additionalProperties: false
        }
    }

    public setFields(options: object) {
        this.id = this.getSchemaId()
        this.name = options["name"]
        this.author = options["author"]
        this.authored = new Date().toISOString().slice(0, -5) + 'Z'
        this.schema = options["schemaProperty"]
    }

    private randomString(len) {
        const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < len; i++) {
            let randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz,randomPoz+1);
        }
        return randomString;
    }
    
    private getSchemaId(): string {
        const a = `${constant.DID_SCHEME}:${uuidv4()}`
        const b = this.randomString(32)    
        const id = `${a};id=${b};version=1.0` // ID Structure ->  did:hs:<a>;id=<b>;version=1.0
        return id 
    }

    public getSchemaString(): string {
        return JSON.stringify(this)
    }

    public async signSchema(privateKey: string, schemaString: string): Promise<any> {
        const data: Schema = JSON.parse(schemaString)
        const dataBytes = (await getByteArraySchema(data)).finish()
        const privateKeyBytes = new Uint8Array(Buffer.from(privateKey, 'base64'))
        const signed = ed25519.sign(privateKeyBytes, dataBytes)
        return Buffer.from(signed).toString('base64')
    }

    public async registerSchema( 
        schemaString: string,
        signature: string,
        verificationMethodId: string): Promise<any> 
    {
        const schema = JSON.parse(schemaString)
        return this.schemaRpc.createSchema(schema, signature, verificationMethodId)
    }

    public async resolve(schemaId: string): Promise<any>{
        return await this.schemaRpc.resolveSchema(schemaId)
    }
}