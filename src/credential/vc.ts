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
import { OfflineSigner } from '@cosmjs/proto-signing';

import crypto from 'crypto';

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
  private credStatusRPC: CredentialRPC | null;
  private namespace: string;
  private hsSchema: HypersignSchema | null;
  private hsDid: HypersignDID | null;

  constructor(
    params: {
      namespace?: string;
      offlineSigner?: OfflineSigner;
      nodeRpcEndpoint?: string;
      nodeRestEndpoint?: string;
    } = {}
  ) {
    const { namespace, offlineSigner, nodeRpcEndpoint, nodeRestEndpoint } = params;

    this.namespace = namespace && namespace != '' ? namespace : '';

    const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'TEST';
    const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
    if (offlineSigner) {
      const offlineConstuctorParams = { offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp };
      this.credStatusRPC = new CredentialRPC(offlineConstuctorParams);
      this.hsDid = new HypersignDID(offlineConstuctorParams);
      this.hsSchema = new HypersignSchema(offlineConstuctorParams);
    } else {
      this.credStatusRPC = null;
      this.hsDid = null;
      this.hsSchema = null;
    }

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

  private async _sign(params: { message: string; privateKeyMultibase: string }): Promise<string> {
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

  private _dateNow(date?: string): string {
    if (date) {
      return new Date(date).toISOString().slice(0, -5) + 'Z';
    } else {
      return new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
    }
  }

  private _sha256Hash(message: string): string {
    const sha256 = crypto.createHash('sha256');
    return sha256.update(message).digest('hex');
  }

  private async _getId(): Promise<string> {
    const uuid = await Utils.getUUID();
    let id;
    if (this.namespace && this.namespace != '') {
      id = `${VC.SCHEME}:${VC.METHOD}:${this.namespace}:${uuid}`;
    } else {
      id = `${VC.SCHEME}:${VC.METHOD}:${uuid}`;
    }
    return id;
  }

  private _checkIfAllRequiredPropsAreSent = (sentAttributes: Array<string>, requiredProps: Array<string>) => {
    return !requiredProps.some((x) => sentAttributes.indexOf(x) === -1);
  };

  private _getCredentialSubject = (schemaProperty: SchemaProperty, attributesMap: object): object => {
    const cs: object = {};

    const sentPropes: Array<string> = Object.keys(attributesMap);
    if (schemaProperty.properties) {
      schemaProperty['propertiesParsed'] = JSON.parse(schemaProperty.properties);
    }
    const SchemaProps: Array<string> = Object.keys(schemaProperty['propertiesParsed']);
    let props: Array<string> = [];

    // Check for "additionalProperties" in schemaProperty
    if (!schemaProperty.additionalProperties) {
      if (sentPropes.length > SchemaProps.length || !this._checkIfAllRequiredPropsAreSent(SchemaProps, sentPropes))
        throw new Error(
          `Only ${JSON.stringify(SchemaProps)} attributes are possible. additionalProperties is false in the schema`
        );
      props = SchemaProps;
    } else {
      props = sentPropes;
    }

    // Check all required propes
    const requiredPros: Array<string> = Object.values(schemaProperty.required);
    if (!this._checkIfAllRequiredPropsAreSent(sentPropes, requiredPros))
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
  private _getCredentialContext = (schemaId: string, schemaProperties: object) => {
    const context: any = [];

    let schemaUrl;
    if (this.hsSchema && this.hsSchema.schemaRpc) {
      schemaUrl = `${this.hsSchema.schemaRpc.schemaRestEp}/${schemaId}:`;
    } else {
      throw new Error('Error: HypersigSchema object may not be initialized');
    }

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

    if (!this.credStatusRPC || !this.hsDid || !this.hsSchema) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
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
      console.log('WARN: Credential status is  not LIVE, currentStatus ' + currentStatus);
      console.log('WARN: Status reason is ' + statusReason);
      return { verified: false };
    }

    return { verified: true };
  }

  /**
   * Initialise the offlinesigner to interact with Hypersign blockchain
   */
  public async init() {
    if (!this.credStatusRPC || !this.hsDid || !this.hsSchema) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    await this.credStatusRPC.init();
    await this.hsDid.init();
    await this.hsSchema.init();
  }

  // encode a multibase base58-btc multicodec key
  // TEST

  /**
   * Generates a new credential document
   * @params
   *  - params.schemaId             : Hypersign schema id
   *  - params.subjectDid           : DID of the subject, if not provided, will be taken from subjectDidDocSigned
   *  - params.schemaContext        :
   *  - params.type                 :
   *  - params.issuerDid            :  DID of the issuer
   *  - params.expirationDate       :  Date of the expiration for this credential
   *  - params.fields               :  Schema fields values for this credential
   * @returns {Promise<IVerifiableCredential>} Result a credential document
   */
  public async generate(params: {
    schemaId: string;
    subjectDid?: string;
    subjectDidDocSigned?: JSON;
    schemaContext?: Array<string>;
    type?: Array<string>;
    issuerDid: string;
    expirationDate: string;
    fields: object;
  }): Promise<IVerifiableCredential> {
    let schemaDoc: Schema = {} as Schema;
    if (params.subjectDid && params.subjectDidDocSigned) {
      throw new Error('HID-SSI-SDK:: Error: Both subjectDid and subjectDidDoc cannot be passed');
    }

    if (!this.credStatusRPC || !this.hsDid || !this.hsSchema) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const issuerDid = params.issuerDid;
    const subjectDid = params.subjectDid;
    let resolvedsubjectDidDoc;
    const { didDocument: issuerDidDoc } = await this.hsDid.resolve({ did: issuerDid });
    //
    if (params.subjectDid) {
      resolvedsubjectDidDoc = await this.hsDid.resolve({ did: params.subjectDid });
    } else if (params.subjectDidDocSigned) {
      resolvedsubjectDidDoc = {};
      resolvedsubjectDidDoc.didDocument = params.subjectDidDocSigned;
    } else {
      throw new Error('HID-SSI-SDK:: Error: Could not resolve the subjectDid or subjectDidDoc');
    }
    const { didDocument: subjectDidDoc } = resolvedsubjectDidDoc;
    if (!issuerDidDoc) {
      throw new Error('HID-SSI-SDK:: Error: Could not fetch issuer did doc, issuer did = ' + issuerDid);
    }

    if (!subjectDidDoc) {
      throw new Error('HID-SSI-SDK:: Error: Could not fetch subject did doc, subject did = ' + subjectDid);
    }

    if (params && params.schemaContext && params.type) {
      try {
        const context = Array<string>();
        context.push(VC.CREDENTAIL_BASE_CONTEXT);
        params.schemaContext.forEach((x) => {
          context.push(x);
        });

        const issuerDid = params.issuerDid;
        const subjectDid = params.subjectDid;
        const expirationDate = params.expirationDate;
        const credentialSubject = params.fields;

        const vc: IVerifiableCredential = {} as IVerifiableCredential;
        vc['@context'] = context;
        vc.id = await this._getId();
        vc.type = [];
        vc.type.push('VerifiableCredential');
        params.type.forEach((x) => {
          vc.type.push(x);
        });

        vc.issuer = issuerDid;
        vc.issuanceDate = this._dateNow(new Date(new Date().getTime() - 100000).toISOString());
        vc.expirationDate = this._dateNow(expirationDate);
        vc.credentialSubject = credentialSubject;
        vc.credentialSubject['id'] = subjectDid && subjectDid != undefined ? subjectDid : subjectDidDoc.id;

        // TODO: confusion here is, what would be the status of this credential at the time of its creation?
        // If this properpty is present , then checkStatus() must be passed at the time of verification of the credential
        // Ref: https://github.com/digitalbazaar/vc-js/blob/7e14ef27bc688194635077d243d9025c0020448b/test/10-verify.spec.js#L188
        vc.credentialStatus = {
          id: this.credStatusRPC.credentialRestEP + '/' + vc.id, // TODO: Will add credentialStatus path when issueing this crdential
          type: this.credentialStatus.type,
        } as ICredentialStatus;

        return vc;
      } catch (error) {
        throw new Error('HID-SSI-SDK:: Error: Could not create credential, error = ' + error);
      }
    } else if (!params.schemaId) {
      throw new Error('HID-SSI-SDK:: Error: schemaId is required when schemaContext and type not passed');
    }

    try {
      schemaDoc = await this.hsSchema.resolve({ schemaId: params.schemaId });
    } catch (e) {
      throw new Error('HID-SSI-SDK:: Error: Could not resolve the schema from schemaId = ' + params.schemaId);
    }
    // TODO: do proper check for date and time
    //if(params.expirationDate < new Date()) throw  new Error("Expiration date can not be lesser than current date")

    const vc: IVerifiableCredential = {} as IVerifiableCredential;

    const schemaInternal = schemaDoc.schema as SchemaProperty;
    const schemaProperties = JSON.parse(schemaInternal.properties);
    // context
    vc['@context'] = this._getCredentialContext(params.schemaId, schemaProperties);

    /// TODO:  need to implement this properly
    vc.id = await this._getId();

    // Type
    vc.type = [];
    vc.type.push('VerifiableCredential');
    vc.type.push(schemaDoc.name);

    vc.expirationDate = this._dateNow(params.expirationDate);
    vc.issuanceDate = this._dateNow(); // TODO: need to remove this.

    vc.issuer = issuerDid;
    vc.credentialSubject = {};
    vc.credentialSubject = {
      ...this._getCredentialSubject(schemaDoc.schema as SchemaProperty, params.fields),
    };
    vc.credentialSubject['id'] = subjectDid && subjectDid != undefined ? subjectDid : subjectDidDoc.id;
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

  /**
   * Generates signed credentials document and registers its status on Hypersign blockchain
   * @params
   *  - params.credential             : Hypersign credentail document
   *  - params.privateKeyMultibase    : P
   *  - params.issuerDid              : DID of the issuer
   *  - params.verificationMethodId   : Verifcation Method of Issuer
   *  - params.registerCredential     : If false, does not registers credentail status on Hypersign blockchain. Default is true.
   * @returns {Promise<{
    signedCredential: IVerifiableCredential;
    credentialStatus: CredentialStatus;
    credentialStatusProof: CredentialProof;
    credentialStatusRegistrationResult?: DeliverTxResponse;
  }>}
   */
  public async issue(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    verificationMethodId: string; // vermethod of issuer for assestion
    privateKeyMultibase: string;
    registerCredential?: boolean;
  }): Promise<{
    signedCredential: IVerifiableCredential;
    credentialStatus: CredentialStatus;
    credentialStatusProof: CredentialProof;
    credentialStatusRegistrationResult?: DeliverTxResponse;
  }> {
    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to issue credential');
    }

    if (!params.credential) {
      throw new Error('HID-SSI-SDK:: Error: params.credential is required to issue credential');
    }

    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to issue credential');
    }

    if (!params.issuerDid) {
      throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to issue credential');
    }

    if (params.registerCredential == undefined) {
      params.registerCredential = true;
    }

    if (!this.credStatusRPC || !this.hsDid || !this.hsSchema) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const { didDocument: signerDidDoc } = await this.hsDid.resolve({ did: params.issuerDid });
    if (signerDidDoc === null || signerDidDoc === undefined)
      throw new Error('HID-SSI-SDK:: Error: Could not resolve issuerDid = ' + params.issuerDid);

    // TODO: take verification method from params
    const publicKeyId = params.verificationMethodId; // TODO: bad idea -  should not hardcode it.
    const publicKeyVerMethod: VerificationMethod = signerDidDoc['verificationMethod'].find(
      (x) => x.id == publicKeyId
    ) as VerificationMethod;

    if (!publicKeyVerMethod) {
      throw new Error(
        'HID-SSI-SDK:: Error: Could not find verification method for id = ' + params.verificationMethodId
      );
    }

    const convertedKeyPair = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
      publicKey: publicKeyVerMethod.publicKeyMultibase,
    });

    publicKeyVerMethod['publicKeyMultibase'] = convertedKeyPair.publicKeyMultibase;

    const keyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: params.privateKeyMultibase,
      ...publicKeyVerMethod,
    });

    const suite = new Ed25519Signature2020({
      verificationMethod: publicKeyId,
      key: keyPair,
    });

    /// Before we issue the credential the credential status has to be added
    /// for that we will call RegisterCredentialStatus RPC
    //  Let us generate credentialHash first
    const credentialHash = this._sha256Hash(JSON.stringify(params.credential));

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

    const proofValue = await this._sign({
      message: JSON.stringify(credentialStatus),
      privateKeyMultibase: params.privateKeyMultibase,
    });

    // check params.issuer is a controller of params.credential.issuer

    const { didDocument: issuerDID } = await this.hsDid.resolve({ did: params.credential.issuer });
    if (issuerDID === null || issuerDID === undefined)
      throw new Error('Could not resolve issuerDid = ' + params.credential.issuer);
    const credIssuerDidDoc: Did = issuerDID as Did;
    const credIssuerController = credIssuerDidDoc.controller;
    if (!credIssuerController.includes(params.issuerDid)) {
      throw new Error(params.issuerDid + ' is not a controller of ' + params.credential.issuer);
    }

    // const issuerDidDoc: Did = issuerDID as Did;
    // const issuerPublicKeyId = params.verificationMethodId;
    // const issuerPublicKeyVerMethod: VerificationMethod = issuerDidDoc.verificationMethod.find(
    //   (x) => x.id == issuerPublicKeyId
    // ) as VerificationMethod;

    const issuerPublicKeyVerMethod: VerificationMethod = publicKeyVerMethod;

    const proof: CredentialProof = {
      type: VC.VERIFICATION_METHOD_TYPE,
      created: this._dateNow(),
      updated: this._dateNow(),
      verificationMethod: issuerPublicKeyVerMethod.id,
      proofValue,
      proofPurpose: VC.PROOF_PURPOSE,
    };

    /// RegisterCRedeRPC
    const signedVC = await vc.issue({
      credential: params.credential,
      suite,
      documentLoader,
    });

    let credentialStatusRegistrationResult: DeliverTxResponse;
    if (params.registerCredential) {
      credentialStatusRegistrationResult = await this.credStatusRPC.registerCredentialStatus(credentialStatus, proof);

      if (!credentialStatusRegistrationResult || credentialStatusRegistrationResult.code != 0) {
        throw new Error(
          'HID-SSI-SDK:: Error while issuing the credential error = ' + credentialStatusRegistrationResult.rawLog
        );
      }

      return {
        signedCredential: signedVC,
        credentialStatus,
        credentialStatusProof: proof,
        credentialStatusRegistrationResult,
      };
    }

    return { signedCredential: signedVC, credentialStatus, credentialStatusProof: proof };
  }

  public async registerCredentialStatus(params: {
    credentialStatus: CredentialStatus;
    credentialStatusProof: CredentialProof;
  }): Promise<DeliverTxResponse> {
    const { credentialStatus, credentialStatusProof } = params;
    if (!credentialStatus || !credentialStatusProof)
      throw new Error(
        'HID-SSI-SDK:: Error: credentialStatus and credentialStatusProof are required to register credential status'
      );

    if (!this.credStatusRPC || !this.hsDid || !this.hsSchema) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const resp: DeliverTxResponse = await this.credStatusRPC.registerCredentialStatus(
      credentialStatus,
      credentialStatusProof
    );
    if (!resp || resp.code != 0) {
      throw new Error('HID-SSI-SDK:: Error while issuing the credential error = ' + resp.rawLog);
    }
    return resp;
  }

  public async updateCredentialStatus(params: {
    credStatus: CredentialStatus;
    issuerDid: string;
    verificationMethodId: string; // vermethod of issuer for assestion
    privateKey: string;
    status: string;
    statusReason?: string;
  }): Promise<DeliverTxResponse> {
    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required revoke credential');
    }

    if (!params.credStatus) {
      throw new Error('HID-SSI-SDK:: Error: params.credential is required to revoke credential');
    }

    if (!params.privateKey) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKey is required to revoke credential');
    }

    if (!params.issuerDid) {
      throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to revoke credential');
    }
    if (!params.status) {
      throw new Error('HID-SSI-SDK:: Error: params.status is required to revoke credential');
    }

    if (!this.credStatusRPC || !this.hsDid || !this.hsSchema) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const { didDocument: signerDidDoc } = await this.hsDid.resolve({ did: params.issuerDid });
    if (!signerDidDoc) throw new Error('Could not resolve issuerDid = ' + params.issuerDid);

    // TODO: take verification method from params
    const publicKeyId = params.verificationMethodId; // TODO: bad idea -  should not hardcode it.
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
    params.status = params.status.toUpperCase();
    const claim: Claim = params.credStatus.claim as Claim;
    const credentialStatus: CredentialStatus = {
      claim: {
        id: claim.id,
        currentStatus: VC.CRED_STATUS_TYPES[params.status],
        statusReason: params.statusReason ? params.statusReason : VC.CRED_STATUS_REASON_TYPES[params.status],
      },
      issuer: params.credStatus.issuer,
      issuanceDate: params.credStatus.issuanceDate,
      expirationDate: params.credStatus.expirationDate,
      credentialHash: params.credStatus.credentialHash,
    };

    const proofValue = await this._sign({
      message: JSON.stringify(credentialStatus),
      privateKeyMultibase: params.privateKey,
    });

    const { didDocument: issuerDID } = await this.hsDid.resolve({ did: params.credStatus.issuer });
    const issuerDidDoc: Did = issuerDID as Did;
    const issuerDidDocController = issuerDidDoc.controller;
    const verificationMethodController = params.verificationMethodId.split('#')[0];

    if (!issuerDidDocController.includes(verificationMethodController)) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId does not belong to issuerDid');
    }

    const { didDocument: controllerDidDoc } = await this.hsDid.resolve({ did: verificationMethodController });
    if (!controllerDidDoc)
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId does not belong to issuerDid');
    const didDocofController = controllerDidDoc as Did;

    const issuerPublicKeyId = params.verificationMethodId;
    const issuerPublicKeyVerMethod: VerificationMethod = didDocofController.verificationMethod.find(
      (x) => x.id == issuerPublicKeyId
    ) as VerificationMethod;

    const proof: CredentialProof = {
      type: VC.VERIFICATION_METHOD_TYPE,
      created: params.credStatus.issuanceDate,
      updated: this._dateNow(),
      verificationMethod: issuerPublicKeyVerMethod.id,
      proofValue,
      proofPurpose: VC.PROOF_PURPOSE,
    };

    /// RegisterCRedeRPC
    const resp: DeliverTxResponse = await this.credStatusRPC.registerCredentialStatus(credentialStatus, proof);

    if (!resp || resp.code != 0) {
      throw new Error('HID-SSI-SDK:: Error while revoking the credential error = ' + resp.rawLog);
    }

    return resp;
  }

  public async generateRegisterCredentialStatusTxnMessage(credentialStatus: CredentialStatus, proof: CredentialProof) {
    if (!credentialStatus || !proof)
      throw new Error('HID-SSI-SDK:: Error: credentialStatus and proof are required to register credential status');

    if (!this.credStatusRPC || !this.hsDid || !this.hsSchema) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    const txnMessage = await this.credStatusRPC.generateCredentialStatusTxnMessage(credentialStatus, proof);

    return txnMessage;
  }

  public async registerCredentialStatusTxnBulk(txnMessage: []) {
    if (!txnMessage) throw new Error('HID-SSI-SDK:: Error: txnMessage is required to register credential status');

    if (!this.credStatusRPC || !this.hsDid || !this.hsSchema) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const resp: DeliverTxResponse = await this.credStatusRPC.registerCredentialStatusBulk(txnMessage);
    if (!resp || resp.code != 0) {
      throw new Error('HID-SSI-SDK:: Error while issuing the credential error = ' + resp.rawLog);
    }
    return resp;
  }
  // TODO:  Implement a method to update credential status of a doc.

  /**
   *
   * This method is used to resolve credential status from the Hypersign Identity Network
   * @params {credentialId}
   *
   * @example
   * const credentialStatus = await sdk.vc.resolveCredentialStatus({credentialId: 'vc:hid:testnet:Zlakfjkjs....'})
   * console.log(credentialStatus)
   *
   * @returns CredentialStatus
   */

  public async resolveCredentialStatus(params: { credentialId }): Promise<CredentialStatus> {
    if (!params.credentialId)
      throw new Error('HID-SSI-SDK:: Error: credentialId is required to resolve credential status');

    if (!this.credStatusRPC || !this.hsDid || !this.hsSchema) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    const credentialStatus: CredentialStatus = await this.credStatusRPC.resolveCredentialStatus(params.credentialId);
    return credentialStatus;
  }

  //https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L251
  public async verifyCredential(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    verificationMethodId: string;
  }): Promise<object> {
    if (!params.credential) throw new Error('HID-SSI-SDK:: Credential is required to verify credential');

    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to verify credential');
    }

    if (!params.issuerDid) {
      throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to verify credential');
    }

    if (!this.credStatusRPC || !this.hsDid || !this.hsSchema) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const { didDocument: issuerDID } = await this.hsDid.resolve({ did: params.issuerDid });
    const issuerDidDoc: Did = issuerDID as Did;
    const publicKeyId = params.verificationMethodId;
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
