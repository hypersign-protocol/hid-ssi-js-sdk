import vc from 'vc-js';
import Utils from '../utils';
import { documentLoader } from 'jsonld';
import { v4 as uuidv4 } from 'uuid';
import HypersignSchema from '../schema/schema';
import { Schema, SchemaProperty } from '../generated/ssi/schema';
import HypersignDID from '../did/did';
import { Did, VerificationMethod } from '../generated/ssi/did';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import { VC, DID } from '../constants';

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
  credentialSubject: object;
  credentialSchema: ISchema;

  // Ref: https://www.w3.org/TR/vc-data-model/#status
  credentialStatus: ICredentialStatus;

  proof: object;
}

export interface ICredentialMethods {
  getCredential(params: {
    schemaId: string;
    subjectDid: string;
    issuerDid: string;
    expirationDate: string;
    fields: object;
  }): Promise<IVerifiableCredential>;
  signCredential(params: { credential: IVerifiableCredential; issuerDid: string; privateKey: string }): Promise<object>;
  verifyCredential(params: { credential: IVerifiableCredential; issuerDid: string }): Promise<object>;
}

export default class HypersignVerifiableCredential implements ICredentialMethods, IVerifiableCredential {
  public context: Array<string>;
  public id: string;
  public type: Array<string>;
  public issuer: string;
  public issuanceDate: string;
  public expirationDate: string;
  public credentialSubject: object;
  public credentialSchema: ISchema;
  public proof: object;
  public credentialStatus: ICredentialStatus;

  private hsSchema: HypersignSchema;
  private hsDid: HypersignDID;
  constructor() {
    this.hsSchema = new HypersignSchema();
    this.hsDid = new HypersignDID();

    this.context = [];
    this.id = '';
    this.type = [];
    this.issuer = '';
    this.issuanceDate = '';
    this.expirationDate = '';
    this.credentialSubject = {};
    this.credentialSchema = {
      id: '',
      type: VC.CREDENTAIL_SCHEMA_VALIDATOR_TYPE,
    };
    this.credentialStatus = {
      id: '',
      type: VC.CREDENTAIL_STATUS_TYPE,
    };
    this.proof = {};
  }

  private getId = () => {
    return VC.PREFIX + uuidv4();
  };

  private checkIfAllRequiredPropsAreSent = (sentAttributes: Array<string>, requiredProps: Array<string>) => {
    return !requiredProps.some((x) => sentAttributes.indexOf(x) === -1);
  };

  private getCredentialSubject = (schemaProperty: SchemaProperty, attributesMap: object): object => {
    const cs: object = {};

    const sentPropes: Array<string> = Object.keys(attributesMap);
    if (schemaProperty.properties) {
      schemaProperty['propertiesParsed'] = JSON.parse(schemaProperty.properties);
    }
    const SchemaProps: Array<string> = Object.keys(schemaProperty['propertiesParsed']);
    let props: Array<string> = [];

    console.log({
      sentPropes,
      SchemaProps,
    });

    // Check for "additionalProperties" in schemaProperty
    if (!schemaProperty.additionalProperties) {
      if (sentPropes.length > SchemaProps.length || !this.checkIfAllRequiredPropsAreSent(SchemaProps, sentPropes))
        throw new Error(
          `Only ${JSON.stringify(SchemaProps)} attributes are possible. additionalProperties is false in the schema`
        );
      props = SchemaProps;
    } else {
      props = sentPropes;
    }

    // Check all required propes
    const requiredPros: Array<string> = Object.values(schemaProperty.required);
    if (!this.checkIfAllRequiredPropsAreSent(sentPropes, requiredPros))
      throw new Error(`${JSON.stringify(requiredPros)} are required properties`);

    // Attach the values of props
    props.forEach((p) => {
      cs[p] = attributesMap[p];
    });

    return cs;
  };

  //
  // TODO: https://www.w3.org/TR/vc-data-model/#data-schemas
  // TODO: handle schemaUrl variable properly later.
  private getCredentialContext = (schemaId: string, schemaProperties: object) => {
    const context: any = [];

    const schemaUrl = `${this.hsSchema.schemaRpc.schemaRestEp}/${schemaId}:`;

    context.push(VC.CREDENTAIL_BASE_CONTEXT);
    //context.push(VC.CREDENTAIL_SECURITY_SUITE);

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
  // TEST
  public async getCredential(params: {
    schemaId: string;
    subjectDid: string;
    issuerDid: string;
    expirationDate: string;
    fields: object;
  }): Promise<IVerifiableCredential> {
    let schemaDoc: Schema = {} as Schema;
    // let issuerDidDoc:Did = {} as Did
    // let subjectDidDoc:Did = {} as Did
    try {
      schemaDoc = await this.hsSchema.resolve({ schemaId: params.schemaId });
    } catch (e) {
      throw new Error('Could not resolve the schema from schemaId = ' + params.schemaId);
    }

    const issuerDid = params.issuerDid;
    const subjectDid = params.subjectDid;

    const { didDocument: issuerDidDoc } = await this.hsDid.resolve({ did: issuerDid });

    const { didDocument: subjectDidDoc } = await this.hsDid.resolve({ did: subjectDid });

    // TODO: do proper check for date and time
    // if(params.expirationDate < new Date()) throw  new Error("Expiration date can not be lesser than current date")

    const vc: IVerifiableCredential = {} as IVerifiableCredential;

    const schemaInternal = schemaDoc.schema as SchemaProperty;
    const schemaProperties = JSON.parse(schemaInternal.properties);
    // context
    vc['@context'] = this.getCredentialContext(params.schemaId, schemaProperties);

    console.log('After fetchin issuerDId and subject did ' + issuerDidDoc.id + ' || ' + subjectDidDoc.id);
    /// TODO:  need to implement this properly
    vc.id = this.getId();

    // Type
    vc.type = [];
    vc.type.push('VerifiableCredential');
    vc.type.push(schemaDoc.name);

    vc.expirationDate = new Date(params.expirationDate).toISOString().slice(0, -5) + 'Z';
    vc.issuanceDate = new Date().toISOString().slice(0, -5) + 'Z';

    vc.issuer = issuerDid;
    vc.credentialSubject = {};
    vc.credentialSubject = {
      ...this.getCredentialSubject(schemaDoc.schema as SchemaProperty, params.fields),
    };
    vc.credentialSubject['id'] = subjectDid;
    vc.credentialSchema = {
      id: schemaDoc.id,
      type: this.credentialSchema.type,
    };

    // TODO: confusion here is, what would be the status of this credential at the time of its creation?
    // If this properpty is present , then checkStatus() must be passed at the time of verification of the credential
    // Ref: https://github.com/digitalbazaar/vc-js/blob/7e14ef27bc688194635077d243d9025c0020448b/test/10-verify.spec.js#L188
    // vc.credentialStatus = {
    //     id: "asasdasds", // TODO: need to implement credential status in the RPC,
    //     type: this.credentialStatus.type
    // }

    return vc;
  }

  public async signCredential(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    privateKey: string;
  }): Promise<object> {
    const { didDocument: signerDidDoc } = await this.hsDid.resolve({ did: params.issuerDid });
    if (!signerDidDoc) throw new Error('Could not resolve issuerDid = ' + params.issuerDid);

    const publicKeyId = signerDidDoc['assertionMethod'][0]; // TODO: bad idea -  should not hardcode it.
    const publicKeyVerMethod: VerificationMethod = signerDidDoc['verificationMethod'].find(
      (x) => x.id == publicKeyId
    ) as VerificationMethod;

    const convertedKeyPair = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
      publicKey: publicKeyVerMethod.publicKeyMultibase,
    });

    publicKeyVerMethod['publicKeyMultibase'] = convertedKeyPair.publicKeyMultibase;

    const keyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: params.privateKey,
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
  public async verifyCredential(params: { credential: IVerifiableCredential; issuerDid: string }): Promise<object> {
    if (!params.credential) throw new Error('Credential can not be undefined');

    const { didDocument: issuerDID } = await this.hsDid.resolve({ did: params.issuerDid });
    const issuerDidDoc: Did = issuerDID as Did;
    const publicKeyId = issuerDidDoc.assertionMethod[0];
    const publicKeyVerMethod: VerificationMethod = issuerDidDoc.verificationMethod.find(
      (x) => x.id == publicKeyId
    ) as VerificationMethod;

    // Convert 45 byte publick key into 48
    const { publicKeyMultibase } = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
      publicKey: publicKeyVerMethod.publicKeyMultibase,
    });

    publicKeyVerMethod.publicKeyMultibase = publicKeyMultibase;

    const assertionController = {
      '@context': DID.CONTROLLER_CONTEXT,
      id: issuerDidDoc.id,
      assertionMethod: issuerDidDoc.assertionMethod,
    };

    const keyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: '',
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
