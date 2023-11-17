/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import jssig from 'jsonld-signatures';
import { purposes } from 'jsonld-signatures';
import vc from 'vc-js';
import Utils from '../utils';
import HypersignSchema from '../schema/schema';
import {
  CredentialSchemaState as Schema,
  CredentialSchemaProperty as SchemaProperty,
} from '../../libs/generated/ssi/credential_schema';
import HypersignDID from '../did/did';
import { DidDocument as Did, DidDocument, VerificationMethod } from '../../libs/generated/ssi/did';

import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';

import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
const ed25519 = require('@stablelib/ed25519');
import { CredentialRPC } from './credRPC';
import {
  ICredentialMethods,
  IVerifiableCredential,
  ICredentialStatus,
  ISchema,
  ICredentialProof,
  IResolveCredential,
} from './ICredential';
import { VC, DID, CredentialStatusEnums } from '../constants';
import {
  CredentialStatusDocument as CredentialStatus,
  CredentialStatusDocument,
  CredentialStatusState,
} from '../../libs/generated/ssi/credential_status';
import { DocumentProof as CredentialProof } from '../../libs/generated/ssi/proof';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import crypto from 'crypto';
import customLoader from '../../libs/w3cache/v1';
import { EthereumEip712Signature2021 } from 'ethereumeip712signature2021suite';
import { IClientSpec } from '../did/IDID';
import { extendContextLoader } from 'jsonld-signatures';
import { ICredentialService } from '../ssiApi/services/credential/ICredentialApi';
import CredentialApiService from '../ssiApi/services/credential/credential.service';
import { IResolveSchema } from '../schema/ISchema';
import { base58btc } from 'multiformats/bases/base58';
const { Merklizer, MtValue } = require('@iden3/js-jsonld-merklization');
const documentLoader = extendContextLoader(customLoader);

export default class HypersignVerifiableCredential implements ICredentialMethods, IVerifiableCredential {
  public '@context': Array<string>;
  public id: string;
  public type: Array<string>;
  public issuer: string;
  public issuanceDate: string;
  public expirationDate: string;
  public credentialSubject: object;
  public credentialSchema: ISchema;
  public proof: ICredentialProof;
  public credentialStatus: ICredentialStatus;
  private credStatusRPC: CredentialRPC | null;
  private credentialApiService: ICredentialService | null;
  private namespace: string;
  private hsSchema: HypersignSchema;
  private hsDid: HypersignDID;

  constructor(
    params: {
      namespace?: string;
      offlineSigner?: OfflineSigner;
      nodeRpcEndpoint?: string;
      nodeRestEndpoint?: string;
      entityApiSecretKey?: string;
    } = {}
  ) {
    const { namespace, offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, entityApiSecretKey } = params;

    this.namespace = namespace && namespace != '' ? namespace : '';
    const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
    const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
    const offlineConstuctorParams = { offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp };
    this.credStatusRPC = new CredentialRPC(offlineConstuctorParams);
    this.hsDid = new HypersignDID(offlineConstuctorParams);
    this.hsSchema = new HypersignSchema(offlineConstuctorParams);
    if (entityApiSecretKey && entityApiSecretKey != '') {
      this.credentialApiService = new CredentialApiService(entityApiSecretKey);
      this.credStatusRPC = null;
    } else {
      this.credentialApiService = null;
    }

    this['@context'] = [];
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
    this.proof = {} as ICredentialProof;
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
    // return Buffer.from(signed).toString('base64');
    return base58btc.encode(signed);
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
    const requiredPros: Array<string> = Object.values(schemaProperty.required as string[]);
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
  private _getCredentialContext = (schemaId: string, schemaProperties: object, schemaName: string) => {
    const context: any = [];

    let schemaUrl;
    if (this.hsSchema && this.hsSchema.schemaRpc) {
      schemaUrl = `${this.hsSchema.schemaRpc.schemaRestEp}/${schemaId}:`;
    } else {
      throw new Error('Error: HypersigSchema object may not be initialized');
    }

    context.push(VC.CREDENTAIL_BASE_CONTEXT);
    // context.push(VC.CREDENTAIL_SECURITY_SUITE);

    context.push({
      hs: schemaUrl,
    });
    context.push({
      [schemaName]: `hs:${schemaName}`,
    });
    const props: Array<string> = Object.keys(schemaProperties);
    props.forEach((x) => {
      const obj = {};
      obj[x] = `hs:${x}`;
      context.push(obj);
    });
    context.push(VC.CONTEXT_HypersignCredentialStatus2023);

    return context;
  };

  private async _toTitleCase(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
  /**
   * Initialise the offlinesigner to interact with Hypersign blockchain
   */
  public async init() {
    if (!this.credStatusRPC && !this.credentialApiService) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized with entityApiSecretKey'
      );
    }
    if (this.credStatusRPC) {
      await this.credStatusRPC.init();
    }
    if (this.credentialApiService) {
      await this.credentialApiService.auth();
    }
  }

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
    schemaId?: string;
    subjectDid?: string;
    subjectDidDocSigned?: JSON;
    schemaContext?: Array<string>;
    type?: Array<string>;
    issuerDid: string;
    expirationDate: string;
    fields: object;
  }): Promise<IVerifiableCredential> {
    let schemaDoc: IResolveSchema = {} as IResolveSchema;
    if (params.subjectDid && params.subjectDidDocSigned) {
      throw new Error('HID-SSI-SDK:: Error: Both subjectDid and subjectDidDoc cannot be passed');
    }

    if (!this.credStatusRPC) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const issuerDid = params.issuerDid;
    const subjectDid = params.subjectDid;
    let resolvedsubjectDidDoc;
    const { didDocument: issuerDidDoc } = await this.hsDid.resolve({ did: issuerDid });
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
    // const schemaProperties = JSON.parse(schemaInternal.properties as string);
    // const schemaName = schemaDoc.name as string;
    // context
    // vc['@context'] = this._getCredentialContext(params.schemaId, schemaProperties, schemaName);
    vc['@context'] = [VC.CREDENTAIL_BASE_CONTEXT];
    vc['@context'].push({
      '@context': { ...VC.CONTEXT_HypersignCredentialStatus2023 },
    } as any);
    const JsonSchema = this.hsSchema.vcJsonSchema(schemaDoc);
    vc['@context'].push((JsonSchema as any).$metadata.jsonLdContext);

    /// TODO:  need to implement this properly
    vc.id = await this._getId();

    // Type
    vc.type = [];
    vc.type.push('VerifiableCredential');
    vc.type.push(schemaDoc.name as string);

    vc.expirationDate = this._dateNow(params.expirationDate);
    vc.issuanceDate = this._dateNow(); // TODO: need to remove this.

    vc.issuer = issuerDid;
    vc.credentialSubject = {};
    // ToDo: Implement Schema validation (JSON Schema Validator)
    vc.credentialSubject = {
      ...this._getCredentialSubject(schemaDoc.schema as SchemaProperty, params.fields),
    };
    vc.credentialSubject['id'] = subjectDid && subjectDid != undefined ? subjectDid : subjectDidDoc.id;
    vc.credentialSchema = {
      id: schemaDoc.id as string,
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
   * @returns {Promise<{
   * signedCredential: IVerifiableCredential;
   * credentialStatus: CredentialStatus;
   * credentialStatusProof: CredentialProof;
   * credentialStatusRegistrationResult?: DeliverTxResponse;
   * }>}
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

    if (!this.credStatusRPC) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    if (params.registerCredential == undefined) {
      params.registerCredential = true;
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

    // generating hash using merkelroot hash

    const merkelizerObj = await Merklizer.merklizeJSONLD(JSON.stringify(params.credential));
    let credentialHash = await merkelizerObj.mt.root();
    credentialHash = Buffer.from(credentialHash.bytes).toString('hex');

    const credentialStatus: CredentialStatus = {
      id: params.credential.id,
      issuer: params.credential.issuer,
      issuanceDate: params.credential.issuanceDate,
      revoked: false,
      suspended: false,
      remarks: 'Credential is active',
      credentialMerkleRootHash: credentialHash,
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
    const credIssuerController = credIssuerDidDoc.controller as string[];
    if (!credIssuerController.includes(params.issuerDid)) {
      throw new Error(params.issuerDid + ' is not a controller of ' + params.credential.issuer);
    }

    const issuerPublicKeyVerMethod: VerificationMethod = publicKeyVerMethod;

    const proof: CredentialProof = {
      type: VC.VERIFICATION_METHOD_TYPE,
      created: this._dateNow(),
      verificationMethod: issuerPublicKeyVerMethod.id as string,
      proofValue,
      proofPurpose: VC.PROOF_PURPOSE,
    };

    /// RegisterCRedeRPC
    const signedVC = await jssig.sign(params.credential, {
      purpose: new purposes.AssertionProofPurpose({
        controller: {
          '@context': ['https://www.w3.org/ns/did/v1'],
          id: issuerDID.id,
          assertionMethod: issuerDID.assertionMethod,
        },
      }),
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

  // Ref: https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L251
  /**
   * Verfies signed/issued credential
   * @params
   *  - params.credential             : Signed Hypersign credentail document of type IVerifiableCredential
   *  - params.issuerDid              : DID of the issuer
   *  - params.verificationMethodId   : Verifcation Method of Issuer
   * @returns {Promise<object>}
   */
  public async verify(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    verificationMethodId: string;
  }): Promise<object> {
    if (!params.credential) {
      throw new Error('HID-SSI-SDK:: params.credential is required to verify credential');
    }

    if (!params.credential.proof) {
      throw new Error('HID-SSI-SDK:: params.credential.proof is required to verify credential');
    }

    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to verify credential');
    }

    if (!params.issuerDid) {
      throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to verify credential');
    }

    const { didDocument: issuerDID } = await this.hsDid.resolve({ did: params.issuerDid });
    const issuerDidDoc: Did = issuerDID as Did;
    const publicKeyId = params.verificationMethodId;
    const publicKeyVerMethod: VerificationMethod = (issuerDidDoc.verificationMethod as VerificationMethod[]).find(
      (x) => x.id == publicKeyId
    ) as VerificationMethod;

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
    const result = await jssig.verify(params.credential, {
      purpose: new purposes.AssertionProofPurpose({
        controller: {
          '@context': ['https://www.w3.org/ns/did/v1'],
          id: issuerDID.id,
          assertionMethod: issuerDID.assertionMethod,
        },
      }),
      suite,
      documentLoader,
    });

    // const statusCheck = await that.checkCredentialStatus({ credentialId: params.credential.id });

    return result;
  }

  /**
   * Resolves credential status from Hypersign Blokchain
   * @params
   *  - params.credentialId           : Verifiable credential id
   * @returns {Promise<IResolveCredential>}
   */
  public async resolveCredentialStatus(params: { credentialId: string }): Promise<IResolveCredential> {
    if (!params || !params.credentialId)
      throw new Error('HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
    let credentialStatus = {} as CredentialStatusState;
    if (!this.credStatusRPC) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCred is not instantiated with Offlinesigner or not initialized'
      );
    }
    credentialStatus = await this.credStatusRPC.resolveCredentialStatus(params.credentialId);
    const response = {
      ...(credentialStatus.credentialStatusDocument as CredentialStatusDocument),
      proof: credentialStatus.credentialStatusProof as CredentialProof,
    };
    return response;
  }

  /**
   * Update credential status in blockchain Hypersign Blokchain
   * @params
   *  - params.credentialStatus           : Status of the credential of type CredentialStatus
   *  - params.issuerDid                  : DID of the issuer
   *  - params.verificationMethodId       : verificationMethodId
   *  - params.privateKeyMultibase        : privateKey of the issuer
   *  - params.status                     : Status LIVE/REVOKE/SUSPENDED
   *  - params.statusReason               : Reason for the status change
   * @returns {Promise<DeliverTxResponse>}
   */
  public async updateCredentialStatus(params: {
    credentialStatus: CredentialStatus;
    issuerDid: string;
    verificationMethodId: string; // vermethod of issuer for assestion
    privateKeyMultibase: string;
    status: string;
    statusReason?: string;
  }): Promise<DeliverTxResponse> {
    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to update credential status');
    }

    if (!params.credentialStatus) {
      throw new Error('HID-SSI-SDK:: Error: params.credentialStatus is required to update credential status');
    }

    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update credential status');
    }

    if (!params.issuerDid) {
      throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to update credential status');
    }
    if (!params.status) {
      throw new Error('HID-SSI-SDK:: Error: params.status is required to update credential status');
    }
    if (!this.credStatusRPC) {
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
    const status = await this._toTitleCase(params.status);
    if (!Object.values(CredentialStatusEnums).includes(status as CredentialStatusEnums)) {
      throw new Error(`HID-SSI-SDK:: Error: params.status is invalid`);
    }

    let revoked = false;
    let suspended = false;
    if (status === VC.CRED_STATUS_TYPES.REVOKED) {
      revoked = true;
    } else if (status === VC.CRED_STATUS_TYPES.SUSPENDED) {
      suspended = true;
    } else if (status === VC.CRED_STATUS_TYPES.LIVE) {
      revoked = false;
      suspended = false;
    }

    /**
     * TODO:-
     * check if credential is already suspended
     * check if credential is already Live
     * should not update a credential if it is revoked
     */

    const claim = params.credentialStatus;
    const credentialStatus: CredentialStatus = {
      id: claim.id,
      revoked,
      suspended,
      remarks: params.statusReason ?? VC.CRED_STATUS_REASON_TYPES[params.status],
      issuer: params.credentialStatus.issuer,
      issuanceDate: params.credentialStatus.issuanceDate,
      credentialMerkleRootHash: params.credentialStatus.credentialMerkleRootHash,
    };

    const proofValue = await this._sign({
      message: JSON.stringify(credentialStatus),
      privateKeyMultibase: params.privateKeyMultibase,
    });

    const { didDocument: issuerDID } = await this.hsDid.resolve({ did: params.credentialStatus.issuer as string });
    const issuerDidDoc: Did = issuerDID as Did;
    const issuerDidDocController = issuerDidDoc.controller as string[];
    const verificationMethodController = params.verificationMethodId.split('#')[0];

    if (!issuerDidDocController.includes(verificationMethodController)) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId does not belong to issuerDid');
    }

    const { didDocument: controllerDidDoc } = await this.hsDid.resolve({ did: verificationMethodController });
    if (!controllerDidDoc)
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId does not belong to issuerDid');
    const didDocofController = controllerDidDoc as Did;

    const issuerPublicKeyId = params.verificationMethodId;
    const issuerPublicKeyVerMethod: VerificationMethod = (
      didDocofController.verificationMethod as VerificationMethod[]
    ).find((x) => x.id == issuerPublicKeyId) as VerificationMethod;

    const proof: CredentialProof = {
      type: VC.VERIFICATION_METHOD_TYPE,
      created: params.credentialStatus.issuanceDate,
      verificationMethod: issuerPublicKeyVerMethod.id as string,
      proofValue,
      proofPurpose: VC.PROOF_PURPOSE,
    };

    /// UpdateCredRPC
    const resp: DeliverTxResponse = await this.credStatusRPC.updateCredentialStatus(credentialStatus, proof);

    if (!resp || resp.code != 0) {
      throw new Error('HID-SSI-SDK:: Error while revoking the credential error = ' + resp.rawLog);
    }

    return resp;
  }

  /**
   * Check status of credential on Hypersign Chain
   * @param
   * - params.credentialId     : Credential Id
   * @returns {Promise<{ verified: boolean }>}
   */

  public async checkCredentialStatus(params: { credentialId: string }): Promise<{ verified: boolean }> {
    if (!params || !params.credentialId)
      throw new Error('HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');

    const { credentialId } = params;
    let credentialStatus = {} as CredentialStatusState;
    if (!this.credStatusRPC) {
      throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCred is not instantiated with Offlinesigner');
    }
    credentialStatus = await this.credStatusRPC.resolveCredentialStatus(credentialId);
    if (!credentialStatus) {
      throw new Error('HID-SSI-SDK:: Error: while checking credential status of credentialID ' + credentialId);
    }
    // const claim: Claim = credentialStatus.claim as Claim;
    const { remarks: statusReason } = credentialStatus.credentialStatusDocument as CredentialStatus;
    let currentStatus;
    /// TODO:  probably we should also verify the credential HASH by recalculating the hash of the crdential and
    // matching with credentialHash property.
    // const { credentialHash } = credentialStatus;
    if (!credentialStatus.credentialStatusDocument?.revoked && !credentialStatus.credentialStatusDocument?.suspended) {
      currentStatus = VC.CRED_STATUS_TYPES.LIVE;
    }
    if (currentStatus != VC.CRED_STATUS_TYPES.LIVE) {
      console.log('WARN: Credential status is  not LIVE, currentStatus ' + currentStatus);
      console.log('WARN: Status reason is ' + statusReason);
      return { verified: false };
    }

    return { verified: true };
  }

  /**
   * Register credential status on Hypersign Chain
   * @param
   * - params.credentialStatus       : Credential status
   * - params.credentialStatusProof  : Status proof of the credential
   * @returns {Promise<{ transactionHash: string }>}
   */
  public async registerCredentialStatus(params: {
    credentialStatus: CredentialStatus;
    credentialStatusProof: CredentialProof;
  }): Promise<{ transactionHash: string }> {
    const { credentialStatus, credentialStatusProof } = params;
    if (!credentialStatus || !credentialStatusProof)
      throw new Error(
        'HID-SSI-SDK:: Error: credentialStatus and credentialStatusProof are required to register credential status'
      );

    if (!this.credStatusRPC && !this.credentialApiService) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized with entityApiSecret'
      );
    }

    let resp = {} as { transactionHash: string };
    if (this.credStatusRPC) {
      const result: DeliverTxResponse = await this.credStatusRPC.registerCredentialStatus(
        credentialStatus,
        credentialStatusProof
      );
      if (!result || result.code != 0) {
        throw new Error('HID-SSI-SDK:: Error while issuing the credential error = ' + result.rawLog);
      }
      resp.transactionHash = result.transactionHash;
    } else if (this.credentialApiService) {
      resp = await this.credentialApiService.registerCredentialStatus({
        credentialStatus,
        credentialStatusProof,
        namespace: this.namespace,
      });
    }
    return resp;
  }

  /**
   * Generate transaction message
   * @param
   * - params.credentialStatus       : Credential status
   * - params.credentialStatusProof  : Status proof of the credential
   * @returns {Promise<{typeUrl: string, value: MsgRegisterCredentialStatus}>}
   */
  public async generateRegisterCredentialStatusTxnMessage(credentialStatus: CredentialStatus, proof: CredentialProof) {
    if (!credentialStatus || !proof)
      throw new Error('HID-SSI-SDK:: Error: credentialStatus and proof are required to register credential status');

    if (!this.credStatusRPC) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    const txnMessage = await this.credStatusRPC.generateCredentialStatusTxnMessage(credentialStatus, proof);

    return txnMessage;
  }
  /**
   * Register multiple credential status
   * @param
   * - params.txnMessage      : Array of transaction message
   * @returns {Promise<DeliverTxResponse>}
   */

  public async registerCredentialStatusTxnBulk(txnMessage: []) {
    if (!txnMessage) throw new Error('HID-SSI-SDK:: Error: txnMessage is required to register credential status');

    if (!this.credStatusRPC) {
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

  /**
   *  Issue credentials document with EthereumEip712Signature2021
   * @param
   * - params.credential           : Hypersign credentail document
   * - params.issuerDid            : Did of the issuer
   * - params.verificationMethodId : Verification Method of Issuer
   * - params.type                 : Optional, Type of document
   * - params.web3Obj              : Web3 object
   * - params.registerCredential   : Optional, Set registerCredential to true if you want to register, false otherwise
   * - params.domain               : Optional, domain url
   * - params.clientspec           : Optional, ClientSpec either it is eth-personalSign or cosmos-ADR036
   * @returns {Promise<IVerifiableCredential>}
   */

  public async issueByClientSpec(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    verificationMethodId: string;
    type?: string;
    web3Obj?;
    privateKey?: string;
    registerCredential?: boolean;
    domain?: string;
    clientSpec?: IClientSpec;
  }) {
    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to issue credential');
    }
    if (!params.issuerDid) {
      throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to issue credential');
    }
    if (!params.credential) {
      throw new Error('HID-SSI-SDK:: Error: params.credential is required to issue credential');
    }
    if (!this.credStatusRPC) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    if (!params.web3Obj && !params.privateKey) {
      throw new Error('HID-SSI-SDK:: Error: prams.web3Obj or prams.privateKey should be passed');
    }
    if (params.type == undefined) {
      params.type = 'Document';
    }
    if (params.registerCredential == undefined) {
      params.registerCredential = true;
    }
    const { didDocument: signerDidDoc } = await this.hsDid.resolve({ did: params.issuerDid });
    if (signerDidDoc === null || signerDidDoc === undefined)
      throw new Error('HID-SSI-SDK:: Error: Could not resolve issuerDid = ' + params.issuerDid);
    const publicKeyId = params.verificationMethodId;
    const publicKeyVerMethod: VerificationMethod = signerDidDoc['verificationMethod'].find(
      (x) => x.id == publicKeyId
    ) as VerificationMethod;

    if (!publicKeyVerMethod) {
      throw new Error(
        'HID-SSI-SDK:: Error: Could not find verification method for id = ' + params.verificationMethodId
      );
    }
    let EthereumEip712Signature2021obj;
    if (params.privateKey) {
      EthereumEip712Signature2021obj = new EthereumEip712Signature2021({});
      await EthereumEip712Signature2021obj.fromPrivateKey(params.privateKey);
    } else {
      EthereumEip712Signature2021obj = new EthereumEip712Signature2021({}, params.web3Obj);
    }

    const proof = await EthereumEip712Signature2021obj.createProof({
      document: params.credential,
      purpose: new purposes.AssertionProofPurpose({
        controller: {
          '@context': ['https://w3id.org/security/v2'],
          id: signerDidDoc.id,
          assertionMethod: [params.verificationMethodId],
        },
      }),
      verificationMethod: params.verificationMethodId,
      primaryType: params.type,
      date: new Date().toISOString(),
      domain: params.domain ? { name: params.domain } : undefined,
      documentLoader,
    });
    params.credential.proof = proof;
    const signedVC = params.credential;

    const { didDocument: issuerDID } = await this.hsDid.resolve({ did: params.credential.issuer });
    if (issuerDID === null || issuerDID === undefined)
      throw new Error('Could not resolve issuerDid = ' + params.credential.issuer);
    const credIssuerDidDoc: Did = issuerDID as Did;
    const credIssuerController = credIssuerDidDoc.controller as string[];
    if (!credIssuerController.includes(params.issuerDid)) {
      throw new Error(params.issuerDid + ' is not a controller of ' + params.credential.issuer);
    }

    if (params.registerCredential) {
      // register credential status
      return new Error('HID-SSI-SDK:: Error: registerCredential is not implemented');
    }

    return { signedCredential: signedVC };
  }

  // verify credentila issued by client spec
  /**
   * Verfies signed/issued credential document with EthereumEip712Signature2021
   * @param
   * - params.credential           : Hypersign credentail document
   * - params.issuerDid            : Did of the issuer
   * - params.verificationMethodId : Verification Method of Issuer
   * - params.web3Obj              : Web3 object
   * @returns {Promise<object>}
   */

  public async verifyByClientSpec(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    verificationMethodId: string;
  }): Promise<object> {
    if (!params.credential) {
      throw new Error('HID-SSI-SDK:: params.credential is required to verify credential');
    }

    if (!params.credential.proof) {
      throw new Error('HID-SSI-SDK:: params.credential.proof is required to verify credential');
    }

    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to verify credential');
    }

    if (!params.issuerDid) {
      throw new Error('HID-SSI-SDK:: Error: params.issuerDid is required to verify credential');
    }

    const { didDocument } = await this.hsDid.resolve({ did: params.issuerDid });
    if (didDocument === null || didDocument === undefined)
      throw new Error('HID-SSI-SDK:: Error: Could not resolve issuerDid = ' + params.issuerDid);
    const EthereumEip712Signature2021obj = new EthereumEip712Signature2021({});
    const { proof } = params.credential;
    const verificationResult = await EthereumEip712Signature2021obj.verifyProof({
      proof: proof,
      document: params.credential,
      types: proof.eip712.types,
      domain: proof.eip712.domain,
      purpose: new purposes.AssertionProofPurpose({
        controller: {
          '@context': ['https://w3id.org/security/v2'],
          id: didDocument.id,
          assertionMethod: [params.verificationMethodId],
        },
      }),
      documentLoader,
    });
    return verificationResult;
  }
}
