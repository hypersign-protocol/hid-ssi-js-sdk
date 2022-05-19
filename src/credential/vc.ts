import vc from "vc-js";
import { Ed25519KeyPair } from "crypto-ld";
import jsonSigs from "jsonld-signatures";
import { documentLoader } from "jsonld";
import { v4 as uuidv4 } from "uuid";

import HypersignSchema from "../schema/schema";
import { Schema, SchemaProperty } from "../generated/ssi/schema";
import HypersignDID from "../did";
import { Did, VerificationMethod } from "../generated/ssi/did";
import { chownSync } from "fs";

const VC_PREFIX = "vc_";
const VP_PREFIX = "vp_";
const { Ed25519Signature2018 } = jsonSigs.suites;
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
const { encode, decode } = require("base58-universal");

const MULTICODEC_ED25519_PUB_HEADER = new Uint8Array([0xed, 0x01]);
// multicodec ed25519-priv header as varint
const MULTICODEC_ED25519_PRIV_HEADER = new Uint8Array([0x80, 0x26]);

interface ISchema {
  id: string;
  type: string;
}

interface ICredentialStatus {
  id: string; // https://example.edu/status/24
  type: string; // CredentialStatusList2017
}

// https://www.w3.org/TR/vc-data-model/#basic-concepts
interface IVerifiableCredential {
  context: Array<string>;
  id: string;
  type: Array<string>;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: Object;
  credentialSchema: ISchema;

  // Ref: https://www.w3.org/TR/vc-data-model/#status
  credentialStatus: ICredentialStatus;

  proof: Object;
}

export interface ICredentialMethods {
  getCredential(params: {
    schemaId: string;
    subjectDid: string;
    issuerDid: string;
    expirationDate: string;
    fields: Object;
  }): Promise<IVerifiableCredential>;
  signCredential(credential, issuerDid, privateKey): Promise<any>;
  verifyCredential(credential: object, issuerDid: string): Promise<any>;
}

export default class HypersignVerifiableCredential
  implements ICredentialMethods, IVerifiableCredential
{
  public context: Array<string>;
  public id: string;
  public type: Array<string>;
  public issuer: string;
  public issuanceDate: string;
  public expirationDate: string;
  public credentialSubject: Object;
  public credentialSchema: ISchema;
  public proof: Object;
  public credentialStatus: ICredentialStatus;

  private hsSchema: HypersignSchema;
  private hsDid: HypersignDID;
  constructor() {
    this.hsSchema = new HypersignSchema();
    this.hsDid = new HypersignDID();

    this.context = [];
    this.id = "";
    this.type = [];
    this.issuer = "";
    this.issuanceDate = "";
    this.expirationDate = "";
    this.credentialSubject = "";
    this.credentialSchema = {
      id: "",
      type: "JsonSchemaValidator2018",
    };
    this.credentialStatus = {
      id: "",
      type: "CredentialStatusList2017",
    };
    this.proof = "";
  }

  private getId = (type) => {
    const id = uuidv4();
    return type
      ? type === "VC"
        ? VC_PREFIX + id
        : type === "VP"
        ? VP_PREFIX + id
        : id
      : id;
  };

  private checkIfAllRequiredPropsAreSent = (
    sentAttributes: Array<string>,
    requiredProps: Array<string>
  ) => {
    return !requiredProps.some((x) => sentAttributes.indexOf(x) === -1);
  };

  private getCredentialSubject = (
    schemaProperty: SchemaProperty,
    attributesMap: Object
  ): Object => {
    const cs: Object = {};

    const sentPropes: Array<string> = Object.keys(attributesMap);
    if (schemaProperty.properties) {
      schemaProperty["propertiesParsed"] = JSON.parse(
        schemaProperty.properties
      );
    }
    const SchemaProps: Array<string> = Object.keys(
      schemaProperty["propertiesParsed"]
    );
    let props: Array<string> = [];

    console.log({
      sentPropes,
      SchemaProps,
    });

    // Check for "additionalProperties" in schemaProperty
    if (!schemaProperty.additionalProperties) {
      if (
        sentPropes.length > SchemaProps.length ||
        !this.checkIfAllRequiredPropsAreSent(SchemaProps, sentPropes)
      )
        throw new Error(
          `Only ${JSON.stringify(
            SchemaProps
          )} attributes are possible. additionalProperties is false in the schema`
        );
      props = SchemaProps;
    } else {
      props = sentPropes;
    }

    // Check all required propes
    const requiredPros: Array<string> = Object.values(schemaProperty.required);
    if (!this.checkIfAllRequiredPropsAreSent(sentPropes, requiredPros))
      throw new Error(
        `${JSON.stringify(requiredPros)} are required properties`
      );

    // Attach the values of props
    props.forEach((p) => {
      cs[p] = attributesMap[p];
    });

    return cs;
  };

  // TODO: https://www.w3.org/TR/vc-data-model/#data-schemas
  // TODO: handle schemaUrl variable properly later.
  private getCredentialContext = (
    schemaId: string,
    schemaProperties: Object
  ) => {
    const context: any = [];

    const schemaUrl = `${this.hsSchema.schemaRpc.schemaRestEp}/${schemaId}:`;

    context.push("https://www.w3.org/2018/credentials/v1");
    //context.push("https://w3id.org/security/suites/ed25519-2020/v1");
    //context.push('https://www.w3.org/2018/credentials/examples/v1')
    context.push({
      hs: schemaUrl,
    });

    const props: Array<string> = Object.keys(schemaProperties);
    props.forEach((x) => {
      const obj = {};
      obj[x] = `hs:${x}`;
      context.push(obj);
    });

    return context;
  };

  // encode a multibase base58-btc multicodec key

  public async getCredential(params: {
    schemaId: string;
    subjectDid: string;
    issuerDid: string;
    expirationDate: string;
    fields: Object;
  }): Promise<IVerifiableCredential> {
    let schemaDoc: Schema = {} as Schema;
    // let issuerDidDoc:Did = {} as Did
    // let subjectDidDoc:Did = {} as Did
    try {
      schemaDoc = await this.hsSchema.resolve({ schemaId: params.schemaId });
    } catch (e) {
      throw new Error(
        "Could not resolve the schema from schemaId = " + params.schemaId
      );
    }

    const issuerDid = params.issuerDid;
    const subjectDid = params.subjectDid;

    const { didDocument: issuerDidDoc } = await this.hsDid.resolve(issuerDid);

    const { didDocument: subjectDidDoc } = await this.hsDid.resolve(subjectDid);

    // TODO: do proper check for date and time
    // if(params.expirationDate < new Date()) throw  new Error("Expiration date can not be lesser than current date")

    let vc: IVerifiableCredential = {} as IVerifiableCredential;

    const schemaInternal = schemaDoc.schema as SchemaProperty;
    const schemaProperties = JSON.parse(schemaInternal.properties);
    // context
    vc["@context"] = this.getCredentialContext(
      params.schemaId,
      schemaProperties
    );

    console.log(
      "After fetchin issuerDId and subject did " +
        issuerDidDoc.id +
        " || " +
        subjectDidDoc.id
    );
    /// TODO:  need to implement this properly
    vc.id = this.getId("VC");

    // Type
    vc.type = [];
    vc.type.push("VerifiableCredential");
    vc.type.push(schemaDoc.name);

    vc.expirationDate =
      new Date(params.expirationDate).toISOString().slice(0, -5) + "Z";
    vc.issuanceDate = new Date().toISOString().slice(0, -5) + "Z";

    vc.issuer = issuerDid;
    vc.credentialSubject = {};
    vc.credentialSubject = {
      ...this.getCredentialSubject(
        schemaDoc.schema as SchemaProperty,
        params.fields
      ),
    };
    vc.credentialSubject["id"] = subjectDid;
    vc.credentialSchema = {
      id: schemaDoc.id,
      type: this.credentialSchema.type,
    };

    // TODO: confusion here is, what would be the status of this credential at the time of its creation?
    // If this properpty is present , then checkStatus() must be passed at the time of verification of the credential
    // vc.credentialStatus = {
    //     id: "asasdasds", // TODO: need to implement credential status in the RPC,
    //     type: this.credentialStatus.type
    // }

    return vc;
  }

  private _encodeMbKey(header, key) {
    const mbKey = new Uint8Array(header.length + key.length);

    mbKey.set(header);
    mbKey.set(key, header.length);

    return "z" + encode(mbKey);
  }
  
  private convertedStableLibKeysIntoEd25519verificationkey2020(stableLibKp: {
    privKey: Uint8Array;
    publicKeyMultibase: string;
  }) {
    // const stableLibKp = generateStableLibKeys();
    // console.log(stableLibKp)

    const stableLibPubKeyWithoutZ = stableLibKp.publicKeyMultibase.substr(1);
    const stableLibPubKeyWithoutZDecode = decode(stableLibPubKeyWithoutZ);
    const publicKeyMultibase = this._encodeMbKey(
      MULTICODEC_ED25519_PUB_HEADER,
      stableLibPubKeyWithoutZDecode
    );

    const privateKeyMultibase = this._encodeMbKey(
      MULTICODEC_ED25519_PRIV_HEADER,
      stableLibKp.privKey
    );

    return {
      publicKeyMultibase,
      privateKeyMultibase,
    };
  }

  public async signCredential(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    privateKey: string;
  }): Promise<any> {
    const { didDocument: signerDidDoc } = await this.hsDid.resolve(
      params.issuerDid
    );
    if (!signerDidDoc)
      throw new Error("Could not resolve issuerDid = " + params.issuerDid);

    let publicKeyId = signerDidDoc["assertionMethod"][0]; // TODO: bad idea -  should not hardcode it.
    let publicKeyVerMethod = signerDidDoc["verificationMethod"].find(
      (x) => x.id == publicKeyId
    );

    const Uint8ArrayPrivKey = new Uint8Array(
      Buffer.from(params.privateKey, "base64")
    );

    const convertedKeyPair =
      this.convertedStableLibKeysIntoEd25519verificationkey2020({
        privKey: Uint8ArrayPrivKey,
        publicKeyMultibase: publicKeyVerMethod.publicKeyMultibase,
      });

    publicKeyVerMethod["publicKeyMultibase"] =
      convertedKeyPair.publicKeyMultibase;

    const keyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: convertedKeyPair.privateKeyMultibase,
      ...publicKeyVerMethod,
    });

    const suite = new Ed25519Signature2020({
      verificationMethod: publicKeyId,
      key: keyPair,
    });

    const signedVC = await vc.issue({
      credential: params.credential,
      suite,
      documentLoader,
    });
    return signedVC;
  }

  //https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L251
  public async verifyCredential(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
  }): Promise<any> {
    if (!params.credential) throw new Error("Credential can not be undefined");

    const { didDocument: issuerDID } = await this.hsDid.resolve(
      params.issuerDid
    );
    const issuerDidDoc: Did = issuerDID as Did;
    const publicKeyId = issuerDidDoc.assertionMethod[0];
    let publicKeyVerMethod: VerificationMethod =
      issuerDidDoc.verificationMethod.find(
        (x) => x.id == publicKeyId
      ) as VerificationMethod;

    const stableLibPubKeyWithoutZ =
      publicKeyVerMethod.publicKeyMultibase.substr(1);
    const stableLibPubKeyWithoutZDecode = decode(stableLibPubKeyWithoutZ);
    const publicKeyMultibase = this._encodeMbKey(
      MULTICODEC_ED25519_PUB_HEADER,
      stableLibPubKeyWithoutZDecode
    );

    publicKeyVerMethod.publicKeyMultibase = publicKeyMultibase;

    const assertionController = {
      "@context": "https://w3id.org/security/v2",
      id: issuerDidDoc.id,
      assertionMethod: issuerDidDoc.assertionMethod,
    };

    const keyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: "",
      ...publicKeyVerMethod,
    });

    const suite = new Ed25519Signature2020({
      verificationMethod: publicKeyId,
      key: keyPair,
    });

    const result = await vc.verifyCredential({
      credential: params.credential,
      controller: assertionController,
      suite,
      documentLoader,
    });

    return result;
  }
}
