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
const ed25519 = require('@stablelib/ed25519');
import { CredentialRPC } from './credRPC';
import { ICredentialRPC, ICredentialMethods, IVerifiableCredential, ICredentialStatus, ISchema } from './ICredential';
import { VC, DID } from '../constants';
import { CredentialStatus, CredentialProof, Credential, Claim } from '../generated/ssi/credential';
import { DeliverTxResponse } from '@cosmjs/stargate';

import crypto from 'crypto';
import { constants } from 'buffer';

const sha256 = crypto.createHash('sha256');

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
  private credStatusRPC: ICredentialRPC;

  private hsSchema: HypersignSchema;
  private hsDid: HypersignDID;
  constructor() {
    this.hsSchema = new HypersignSchema();
    this.hsDid = new HypersignDID();
    this.credStatusRPC = new CredentialRPC();

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

  private async sign(params: { message: string; privateKeyMultibase: string }): Promise<string> {
    const { privateKeyMultibase: privateKeyMultibaseConverted } =
      Utils.convertEd25519verificationkey2020toStableLibKeysInto({
        privKey: params.privateKeyMultibase,
      });

    // TODO:  do proper checck of paramaters
    const credentialStatus: CredentialStatus = JSON.parse(params.message);
    const credentialBytes = (await CredentialStatus.encode(credentialStatus)).finish();
    // const messageBytes = Buffer.from(params.message);
    const signed = ed25519.sign(privateKeyMultibaseConverted, credentialBytes);
    return Buffer.from(signed).toString('base64');
  }

  private dateNow(date?: string): string {
    if (date) {
      return new Date(date).toISOString().slice(0, -5) + 'Z';
    } else {
      return new Date().toISOString().slice(0, -5) + 'Z';
    }
  }

  private sha256Hash(message: string): string {
    return sha256.update(message).digest('hex');
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

  public async checkCredentialStatus(credentialId: string): Promise<{ verified: boolean }> {
    if (!credentialId) {
      throw new Error('CredentialId must be passed to check its status');
    }
    const credentialStatus: Credential = await this.credStatusRPC.resolveCredentialStatus(credentialId);

    if (!credentialStatus) {
      throw new Error('Error while checking credential status of credentialID ' + credentialId);
    }
    const claim: Claim = credentialStatus.claim as Claim;
    const { currentStatus, statusReason } = claim;

    /// TODO:  probably we should also verify the credential HASH by recalculating the hash of the crdential and
    // matching with credentialHash property.
    // const { credentialHash } = credentialStatus;
    if (currentStatus != VC.CRED_STATUS_TYPES.LIVE) {
      console.log('WARN: Credential status is  not LIVE, currentStatus ' + currentStatus)
      console.log('WARN: Status reason is ' + statusReason)
      return { verified: false };
    }

    return { verified: true };
  }

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
      throw new Error('HID-SSI-SDK:: Error: Could not resolve the schema from schemaId = ' + params.schemaId);
    }

    const issuerDid = params.issuerDid;
    const subjectDid = params.subjectDid;

    const { didDocument: issuerDidDoc } = await this.hsDid.resolve({ did: issuerDid });

    const { didDocument: subjectDidDoc } = await this.hsDid.resolve({ did: subjectDid });

    if (!issuerDidDoc) {
      throw new Error('HID-SSI-SDK:: Error: Could not fetch issuer did doc, issuer did = ' + issuerDid);
    }

    if (!subjectDidDoc) {
      throw new Error('HID-SSI-SDK:: Error: Could not fetch subject did doc, subject did = ' + subjectDid);
    }

    // TODO: do proper check for date and time
    //if(params.expirationDate < new Date()) throw  new Error("Expiration date can not be lesser than current date")

    const vc: IVerifiableCredential = {} as IVerifiableCredential;

    const schemaInternal = schemaDoc.schema as SchemaProperty;
    const schemaProperties = JSON.parse(schemaInternal.properties);
    // context
    vc['@context'] = this.getCredentialContext(params.schemaId, schemaProperties);

    /// TODO:  need to implement this properly
    vc.id = this.getId();

    // Type
    vc.type = [];
    vc.type.push('VerifiableCredential');
    vc.type.push(schemaDoc.name);

    vc.expirationDate = this.dateNow(params.expirationDate);
    vc.issuanceDate = this.dateNow('12/11/2021'); // TODO: need to remove this.

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
    vc.credentialStatus = {
      id: this.credStatusRPC.credentialRestEP + '/' + vc.id, // TODO: Will add credentialStatus path when issueing this crdential
      type: this.credentialStatus.type,
    } as ICredentialStatus;

    return vc;
  }

  public async issueCredential(params: {
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

    /// Before we issue the credential the credential status has to be added
    /// for that we will call RegisterCredentialStatus RPC
    //  Let us generate credentialHash first
    const credentialHash = this.sha256Hash(JSON.stringify(params.credential));

    const credentialStatus: CredentialStatus = {
      claim: {
        id: params.credential.id,
        currentStatus: VC.CRED_STATUS_TYPES.LIVE,
        statusReason: 'Credential is active',
      },
      issuer: params.credential.issuer,
      issuanceDate: params.credential.issuanceDate,
      expirationDate: params.credential.expirationDate,
      credentialHash,
    };

    const proofValue = await this.sign({
      message: JSON.stringify(credentialStatus),
      privateKeyMultibase: params.privateKey,
    });

    const { didDocument: issuerDID } = await this.hsDid.resolve({ did: params.credential.issuer });
    const issuerDidDoc: Did = issuerDID as Did;
    const issuerPublicKeyId = issuerDidDoc.authentication[0];
    const issuerPublicKeyVerMethod: VerificationMethod = issuerDidDoc.verificationMethod.find(
      (x) => x.id == issuerPublicKeyId
    ) as VerificationMethod;

    const proof: CredentialProof = {
      type: VC.VERIFICATION_METHOD_TYPE,
      created: this.dateNow(),
      updated: this.dateNow(),
      verificationMethod: issuerPublicKeyVerMethod.id,
      proofValue,
      proofPurpose: VC.PROOF_PURPOSE,
    };

    /// RegisterCRedeRPC
    const resp: DeliverTxResponse = await this.credStatusRPC.registerCredentialStatus(credentialStatus, proof);

    if (!resp || resp.code != 0) {
      throw new Error('Error while issuing the credential error = ' + resp.rawLog);
    }

    const signedVC = await vc.issue({
      credential: params.credential,
      suite,
      documentLoader,
    });
    return signedVC;
  }


  // TODO:  Implement a method to update credential status of a doc.

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

    /* eslint-disable */
    const that = this;
    /* eslint-enable */
    const result = await vc.verifyCredential({
      credential: params.credential,
      controller: assertionController,
      suite,
      documentLoader,
      checkStatus: async function (options) {
        return await that.checkCredentialStatus(options.credential.id);
      },
    });

    return result;
  }
}
