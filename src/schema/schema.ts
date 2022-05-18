import { Schema as ISchema, SchemaProperty } from "../generated/ssi/schema";
import { v4 as uuidv4 } from "uuid";
import * as constant from "../constants";
import { SchemaRpc } from "../rpc/schemaRPC";

const ed25519 = require("@stablelib/ed25519");

interface ISchemaFields {
  type: string;
  format?: string;
  name: string;
  isRequired: boolean;
}

export default class Schema implements ISchema {
  type: string;
  modelVersion: string;
  id: string;
  name: string;
  author: string;
  authored: string;
  schema: SchemaProperty;

  schemaRpc: SchemaRpc;

  constructor() {
    this.schemaRpc = new SchemaRpc();
    (this.type =
      "https://w3c-ccg.github.io/vc-json-schemas/schema/1.0/schema.json"),
      (this.modelVersion = "1.0"),
      (this.id = ""),
      (this.name = ""),
      (this.author = ""),
      (this.authored = "");
    this.schema = {
      schema: "",
      description: "",
      type: "",
      properties: "",
      required: [],
      additionalProperties: false,
    };
  }

  // Ref:
  private getSchemaId(author: string): string {
    const a = author;
    const b = uuidv4();
    const id = `${a};id=${b};version=${this.modelVersion}`; // ID Structure ->  did:hs:<a>;id=<b>;version=1.0
    return id;
  }

  public getSchema(params: {
    name: string;
    description?: string;
    author: string;
    fields?: Array<ISchemaFields>;
    additionalProperties: boolean;
  }): ISchema {
    if (!params.author) throw new Error("Author must be passed");

    this.id = this.getSchemaId(params.author);
    this.name = params.name;
    this.author = params.author;
    this.authored = new Date().toISOString().slice(0, -5) + "Z";
    this.schema = {
      schema: "http://json-schema.org/draft-07/schema",
      description: params.description ? params.description : "",
      type: "object",
      properties: "",
      required: [],
      additionalProperties: params.additionalProperties,
    };

    // { type: string; format?: string }

    let t = {};
    if (params.fields && params.fields.length > 0) {
      params.fields.forEach((prop) => {
        const schemaPropsObj: {
          propName: string;
          val: { type: string; format?: string };
        } = {} as { propName: string; val: { type: string; format?: string } };
        schemaPropsObj.propName = prop.name;
        schemaPropsObj.val = {} as { type: string; format?: string };
        schemaPropsObj.val.type = prop.type;

        if (prop.format) schemaPropsObj.val.format = prop.format;

        t[schemaPropsObj.propName] = schemaPropsObj.val;

        if (prop.isRequired) {
          this.schema.required.push(prop.name);
        }
      });

      this.schema.properties = JSON.stringify(t);
    }

    return this;
  }

  public async signSchema(params: {
    privateKey: string;
    schema: ISchema;
  }): Promise<any> {
    if (!params.privateKey) throw new Error("PrivateKey must be passed");
    if (!params.schema) throw new Error("Schema must be passed");

    const dataBytes = (await ISchema.encode(params.schema)).finish();
    const privateKeyBytes = new Uint8Array(
      Buffer.from(params.privateKey, "base64")
    );
    const signed = ed25519.sign(privateKeyBytes, dataBytes);
    return Buffer.from(signed).toString("base64");
  }

  public async registerSchema(params: {
    schema: ISchema;
    signature: string;
    verificationMethodId: string;
  }): Promise<any> {
    if (!params.schema) throw new Error("Schema must be passed");
    if (!params.signature) throw new Error("Signature must be passed");
    if (!params.verificationMethodId)
      throw new Error("VerificationMethodId must be passed");
    return this.schemaRpc.createSchema(
      params.schema,
      params.signature,
      params.verificationMethodId
    );
  }

  public async resolve(params: { schemaId: string }): Promise<any> {
    if (!params.schemaId) throw new Error("SchemaId must be passed");
    return await this.schemaRpc.resolveSchema(params.schemaId);
  }
}
