/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import * as constant from '../constants';
import jsonSigs from 'jsonld-signatures';
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
import { DIDRpc } from './didRPC';
import Utils from '../utils';
import { DidDocument as Did, VerificationMethod, Service, DidDocument } from '../../libs/generated/ssi/did';
import { DocumentProof, DocumentProof as SignInfo } from '../../libs/generated/ssi/proof';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import Web3 from 'web3';
import DidApiService from '../ssiApi/services/did/did.service';
import { IDidApiService } from '../ssiApi/services/did/IDIDApi';
import jsonld from 'jsonld';
import crypto from 'crypto';
import {
  IDID,
  IDid,
  IDIDResolve,
  IDIDRpc,
  IController,
  ISignedDIDDocument,
  IClientSpec,
  ISignData,
  ISignInfo,
  SupportedPurpose,
} from './IDID';
import {
  ProofTypes,
  VerificationMethodRelationships,
  VerificationMethodTypes,
} from '../../libs/generated/ssi/client/enums';
import { OfflineSigner } from '@cosmjs/proto-signing';
import customLoader from '../../libs/w3cache/v1';
import { DeliverTxResponse } from '../did/IDID';
import { ClientSpecType } from '../../libs/generated/ssi/client_spec';
import HypersignBJJDId from './bjjdid';
const documentLoader = jsonSigs.extendContextLoader(customLoader);
class DIDDocument implements Did {
  '@context': string[];
  id: string;
  controller: string[];
  alsoKnownAs: string[];
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement: string[];
  capabilityInvocation: string[];
  capabilityDelegation: string[];
  service: Service[];
  constructor(
    publicKey: string,
    blockchainAccountId: string,
    id: string,
    keyType: VerificationMethodTypes,
    verificationRelationships?: VerificationMethodRelationships[]
  ) {
    let vm;
    switch (keyType) {
      case VerificationMethodTypes.Ed25519VerificationKey2020: {
        this['@context'] = [constant['DID_' + keyType].DID_BASE_CONTEXT, constant.VC.CREDENTIAIL_SECURITY_SUITE];
        this.id = id;
        this.controller = [this.id];
        this.alsoKnownAs = [this.id];
        vm = {
          id: this.id + '#key-1',
          type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
          controller: this.id,
          publicKeyMultibase: publicKey,
        };

        const verificationMethod: VerificationMethod = vm;
        this.verificationMethod = [verificationMethod];
        this.authentication = [];
        this.assertionMethod = [];
        this.keyAgreement = [];
        this.capabilityInvocation = [];
        this.capabilityDelegation = [];
        verificationRelationships?.forEach((value) => {
          const vmId = verificationMethod.id as string;
          this[value] = [vmId];
        });

        // TODO: we should take services object in consntructor
        this.service = [];

        break;
      }
      case VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020: {
        this['@context'] = [
          constant['DID_' + keyType].DID_BASE_CONTEXT,
          constant['DID_' + keyType].SECP256K12020_RECOVERY_CONTEXT,
        ];
        this.id = id;
        this.controller = [this.id];
        this.alsoKnownAs = [this.id];
        vm = {
          id: this.id + '#key-1',
          type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
          controller: this.id,
          blockchainAccountId: blockchainAccountId,
        };
        const verificationMethod: VerificationMethod = vm;
        this.verificationMethod = [verificationMethod];
        this.authentication = [];
        this.assertionMethod = [];
        this.keyAgreement = [];
        this.capabilityInvocation = [];
        this.capabilityDelegation = [];
        verificationRelationships?.forEach((value) => {
          const vmId = verificationMethod.id as string;
          this[value] = [vmId];
        });
        // TODO: we should take services object in consntructor
        this.service = [];

        break;
      }
      case VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019: {
        this['@context'] = [
          constant['DID_' + keyType].DID_BASE_CONTEXT,
          constant['DID_' + keyType].SECP256K12020_VERIFICATION_CONTEXT,
        ];
        this.id = id;
        this.controller = [this.id];
        this.alsoKnownAs = [this.id];
        vm = {
          id: this.id + '#key-1',
          type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
          controller: this.id,
          publicKeyMultibase: publicKey,
          blockchainAccountId: blockchainAccountId,
        };
        const verificationMethod: VerificationMethod = vm;
        this.verificationMethod = [verificationMethod];
        this.authentication = [];
        this.assertionMethod = [];
        this.keyAgreement = [];
        this.capabilityInvocation = [];
        this.capabilityDelegation = [];
        verificationRelationships?.forEach((value) => {
          const vmId = verificationMethod.id as string;
          this[value] = [vmId];
        });
        // TODO: we should take services object in consntructor
        this.service = [];

        break;
      }
      default:
        throw new Error('Invalid');
    }
  }
}

/** Class representing HypersignDID */
export default class HypersignDID implements IDID {
  private didrpc: IDIDRpc | null;
  private didAPIService: IDidApiService | null;
  public namespace: string;
  public bjjDID: HypersignBJJDId;

  /**
   * Creates instance of HypersignDID class
   * @constructor
   * @params
   *  - params.namespace        : namespace of did id, Default 'did:hid'
   *  - params.offlineSigner    : signer of type OfflineSigner
   *  - params.nodeRpcEndpoint  : RPC endpoint of the Hypersign blockchain, Default 'TEST'
   *  - params.nodeRestEndpoint : REST endpoint of the Hypersign blockchain
   */
  constructor(
    params: {
      namespace?: string;
      offlineSigner?: OfflineSigner;
      nodeRpcEndpoint?: string;
      nodeRestEndpoint?: string;
      entityApiSecretKey?: string;
    } = {}
  ) {
    const { offlineSigner, namespace, nodeRpcEndpoint, nodeRestEndpoint, entityApiSecretKey } = params;
    const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
    const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';

    const rpcConstructorParams = {
      offlineSigner,
      nodeRpcEndpoint: nodeRPCEp,
      nodeRestEndpoint: nodeRestEp,
    };
    this.didrpc = new DIDRpc(rpcConstructorParams);
    if (entityApiSecretKey && entityApiSecretKey != '') {
      this.didAPIService = new DidApiService(entityApiSecretKey);
      this.didrpc = null;
    } else {
      this.didAPIService = null;
    }
    this.namespace = namespace ? namespace : '';

    this.bjjDID = new HypersignBJJDId(params);
  }

  private _getDateTime(): string {
    return new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
  }

  private async _jsonLdSign(params: {
    didDocument: Did;
    privateKeyMultibase: string;
    verificationMethodId: string;
  }): Promise<ISignedDIDDocument> {
    const { didDocument, privateKeyMultibase, verificationMethodId } = params;
    const publicKeyId = verificationMethodId;
    const pubKey = didDocument.verificationMethod?.find((item) => item.id === publicKeyId);
    const publicKeyMultibase1 = pubKey?.publicKeyMultibase;
    const keyPair = await Ed25519VerificationKey2020.from({
      id: publicKeyId,
      privateKeyMultibase: privateKeyMultibase,
      publicKeyMultibase: publicKeyMultibase1,
    });
    const suite = new Ed25519Signature2020({ key: keyPair });
    const signedDidDocument = (await jsonSigs.sign(didDocument, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader,
    })) as ISignedDIDDocument;
    return signedDidDocument;
  }

  private async _jsonLdNormalize(params: { doc }) {
    const docToNormalize = params.doc;
    const normalizedoc = await jsonld.normalize(docToNormalize, {
      format: 'application/n-quads',
      algorithm: 'URDNA2015',
    });
    return normalizedoc;
  }
  private _concat(arr1, arr2) {
    const concatenatedArr = new Uint8Array(arr1.length + arr2.length);
    concatenatedArr.set(arr1, 0);
    concatenatedArr.set(arr2, arr1.length);
    return concatenatedArr;
  }
  private _getId = (methodSpecificId: string) => {
    if (methodSpecificId && methodSpecificId.length > 32) {
      throw new Error('HID-SSI-SDK:: Error: methodSpecificId should be of minimum size 32');
    }
    let did = '';
    did =
      this.namespace && this.namespace != ''
        ? `${constant.DID.SCHEME}:${constant.DID.METHOD}:${this.namespace}:${methodSpecificId}`
        : `${constant.DID.SCHEME}:${constant.DID.METHOD}:${methodSpecificId}`;
    return did;
  };

  private _filterVerificationRelationships(
    verificationRelationships: VerificationMethodRelationships[]
  ): VerificationMethodRelationships[] {
    let vR: VerificationMethodRelationships[] = [
      VerificationMethodRelationships.assertionMethod,
      VerificationMethodRelationships.authentication,
      VerificationMethodRelationships.capabilityDelegation,
      VerificationMethodRelationships.capabilityInvocation,
    ];
    if (verificationRelationships && verificationRelationships.length > 0) {
      const set1 = new Set(vR);
      const set2 = new Set(verificationRelationships);
      vR = Array.from(set1).filter((value) => set2.has(value));
    }

    return vR;
  }

  /**
   * Creates a new DID Document from wallet address
   * @params
   *  - params.blockChainAccountId  :
   *  - params.methodSpecificId   : methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId or may be walletaddress
   * @returns {Promise<object>} DidDocument object
   */
  private _getBlockChainAccountID(chainId: string, address: string) {
    try {
      const web3 = new Web3();
      const inDecimelChainId = web3.utils.hexToNumber(chainId);
      const blockChainAccountId = constant.CAIP_10_PREFIX.eip155 + ':' + inDecimelChainId + ':' + address;
      return blockChainAccountId;
    } catch (error) {
      throw new Error('HID-SSI-SDK:: Error: unsupported chain Id');
    }
  }

  public async init() {
    if (!this.didrpc && !this.didAPIService) {
      throw new Error(
        'HID-SSI-SDK:: Error:  HypersignDID class is not instantiated with Offlinesigner or have not been initilized with entityApiSecretKey'
      );
    }
    if (this.didrpc) {
      await this.didrpc.init();
    }
    if (this.didAPIService) {
      await this.didAPIService.auth();
    }
  }

  /**
   * Generate a new key pair of type Ed25519VerificationKey2020
   * @params params.seed - Optional, Seed to generate the key pair, if not passed, random seed will be taken
   * @params params.controller - Optional, controller field
   * @returns {Promise<object>} The key pair of type Ed25519
   */
  public async generateKeys(params: {
    seed?: string | Uint8Array;
    controller?: string;
  }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }> {
    let edKeyPair;
    if (params && params.seed && params.controller) {
      const seedBytes = params.seed instanceof Uint8Array ? params.seed : new Uint8Array(Buffer.from(params.seed));
      edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes, id: params.controller });
    } else if (params && params.controller) {
      edKeyPair = await Ed25519VerificationKey2020.generate({ id: params.controller });
    } else if (params && params.seed) {
      const seedBytes = params.seed instanceof Uint8Array ? params.seed : new Uint8Array(Buffer.from(params.seed));
      edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes });
    } else {
      edKeyPair = await Ed25519VerificationKey2020.generate();
    }
    const exportedKp = await edKeyPair.export({ publicKey: true, privateKey: true });
    return {
      ...exportedKp,
    };
  }

  /**
   * Generates a new DID Document
   * @params
   *  - params.publicKeyMultibase : public key
   *  - params.methodSpecificId   : Optional methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId
   *  - params.verificationRelationships: Optional, verification relationships where you want to add your verificaiton method ids
   * @returns {Promise<object>} DidDocument object
   */
  public async generate(params: {
    methodSpecificId?: string;
    publicKeyMultibase: string;
    verificationRelationships?: VerificationMethodRelationships[];
  }): Promise<Did> {
    let verificationRelationships: VerificationMethodRelationships[] = [];
    if (params.verificationRelationships && params.verificationRelationships.length > 0) {
      if (params.verificationRelationships.includes(VerificationMethodRelationships.keyAgreement)) {
        throw new Error('HID-SSI-SDK:: Error: keyAgreement is not allowed in verificationRelationships');
      }
      verificationRelationships = this._filterVerificationRelationships(params.verificationRelationships);
    } else {
      verificationRelationships = this._filterVerificationRelationships([]);
    }
    if (!params.publicKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
    }
    const publicKeyMultibase1 = params.publicKeyMultibase;
    const methodSpecificId = publicKeyMultibase1;
    let didId;
    if (params.methodSpecificId) {
      didId = this._getId(params.methodSpecificId);
    } else {
      didId = this._getId(methodSpecificId);
    }

    const newDid = new DIDDocument(
      publicKeyMultibase1,
      '',
      didId,
      VerificationMethodTypes.Ed25519VerificationKey2020,
      verificationRelationships
    ) as IDid;
    return Utils.jsonToLdConvertor({ ...newDid });
  }

  /**
   * Register a new DID and Document in Hypersign blockchain - an onchain activity
   * @params
   *  - params.didDocument          : LD did document
   *  - params.privateKeyMultibase  : Private Key to sign the doc
   *  - params.verificationMethodId : VerificationMethodId of the document
   * @returns {Promise<object>} Result of the registration
   */
  public async register(params: {
    didDocument: Did; // Ld document
    privateKeyMultibase?: string;
    verificationMethodId?: string;
    signData?: ISignData[];
  }): Promise<{ didDocument: Did; transactionHash: string }> {
    const response = {} as { didDocument: Did; transactionHash: string };
    // TODO:  this method MUST also accept signature/proof
    if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
    }
    if (!this.didrpc && !this.didAPIService) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"'
      );
    }
    let { didDocument } = params;
    const didDoc: Did = didDocument as Did;
    const signInfos: Array<SignInfo> = [];
    if (!params.signData) {
      if (!params.privateKeyMultibase) {
        throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
      }
      if (!params.verificationMethodId) {
        throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
      }
      const { privateKeyMultibase, verificationMethodId } = params;
      let signature;
      let createdAt;
      if (!didDocument['@context']) {
        throw new Error('HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
      } else {
        didDocument = Utils.removeEmptyString(didDocument);
        const signedDidDoc = await this._jsonLdSign({
          didDocument: didDocument,
          privateKeyMultibase,
          verificationMethodId,
        });
        const { proof } = signedDidDoc;
        signature = proof.proofValue;
        createdAt = proof.created;
      }
      signInfos.push({
        type: constant['DID_Ed25519VerificationKey2020'].SIGNATURE_TYPE,
        created: createdAt ?? this._getDateTime(),
        verificationMethod: verificationMethodId,
        proofPurpose: VerificationMethodRelationships.assertionMethod,
        proofValue: signature,
      });
    } else {
      if (params.signData.length < 1) {
        throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
      }
      for (const i in params.signData) {
        if (!params.signData[i].verificationMethodId) {
          throw new Error(
            `HID-SSI-SDK:: Error: params.signData[${i}].verificationMethodId is required to register a did`
          );
        }
        if (!params.signData[i].privateKeyMultibase) {
          throw new Error(
            `HID-SSI-SDK:: Error: params.signData[${i}].privateKeyMultibase is required to register a did`
          );
        }
        if (!params.signData[i].type) {
          throw new Error(`HID-SSI-SDK:: Error: params.signData[${i}].type is required to register a did`);
        }
        const { type, privateKeyMultibase, verificationMethodId } = params.signData[i];
        let createdAt;
        if (
          type !== VerificationMethodTypes.X25519KeyAgreementKey2020 &&
          type !== VerificationMethodTypes.X25519KeyAgreementKeyEIP5630
        ) {
          let signature: string;
          if (!didDocument['@context']) {
            throw new Error('HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
          } else {
            didDocument = Utils.removeEmptyString(didDocument);
            const signedDidDoc = await this._jsonLdSign({
              didDocument: didDocument,
              privateKeyMultibase,
              verificationMethodId,
            });
            const { proof } = signedDidDoc;
            signature = proof.proofValue as string;
            createdAt = proof.created;
          }
          signInfos.push({
            type: constant['DID_Ed25519VerificationKey2020'].SIGNATURE_TYPE,
            created: createdAt ?? this._getDateTime(),
            verificationMethod: verificationMethodId,
            proofPurpose: VerificationMethodRelationships.assertionMethod,
            proofValue: signature,
          });
          delete didDocument['proof'];
        }
      }
    }
    if (this.didrpc) {
      const result: DeliverTxResponse = await this.didrpc.registerDID(didDoc, signInfos);
      response.didDocument = params.didDocument;
      response.transactionHash = result.transactionHash;
    } else if (this.didAPIService) {
      const newSignInfos = signInfos as Array<ISignInfo>;
      const result: { didDocument: Did; transactionHash: string } = await this.didAPIService.registerDid({
        didDocument,
        signInfos: newSignInfos,
      });
      response.didDocument = didDocument;
      response.transactionHash = result.transactionHash;
    }
    return response;
  }

  /**
   * Generate signature
   * @params
   *  - params.didDocument          : LD did document
   *  - params.privateKeyMultibase  : Private Key to sign the doc
   *  - params.verificationMethodId : VerificationMethodId of the document
   * @returns {Promise<ISignInfo>} Generate Array
   */
  public async createSignInfos(params: {
    didDocument: Did; // Ld document
    privateKeyMultibase: string;
    verificationMethodId: string;
  }): Promise<Array<ISignInfo>> {
    if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to create signature of a did');
    }
    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to create signature of a did');
    }
    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to create signature of a did');
    }
    let { didDocument } = params;
    const signInfos: Array<ISignInfo> = [];
    const { privateKeyMultibase, verificationMethodId } = params;
    let signature;
    let createdAt;
    let type;
    if (!didDocument['@context']) {
      throw new Error('HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
    } else {
      didDocument = Utils.removeEmptyString(didDocument);
      const signedDidDocument = await this._jsonLdSign({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
      });
      const { proof } = signedDidDocument;
      signature = proof.proofValue;
      createdAt = proof.created;
      type = proof.type;
    }
    signInfos.push({
      signature,
      verification_method_id: verificationMethodId,
      created: createdAt,
      clientSpec: undefined,
      type,
    });
    return signInfos;
  }

  /**
   * Resolves a DID into DIDDocument from Hypersign blockchain - an onchain activity
   * @params
   *  - params.did                        : DID
   * @returns  {Promise<IDIDResolve>} didDocument and didDocumentMetadata
   */
  public async resolve(params: { did: string }): Promise<IDIDResolve> {
    let result = {} as IDIDResolve;
    if (!params.did) {
      throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
    }

    if (this.didrpc) {
      result = await this.didrpc.resolveDID(params.did);
    } else if (this.didAPIService) {
      result = await this.didAPIService.resolveDid({ did: params.did });
    }

    return {
      didDocument: Utils.jsonToLdConvertor(result.didDocument),
      didDocumentMetadata: result.didDocumentMetadata,
    } as IDIDResolve;
  }

  /**
   * Update a DIDDocument in Hypersign blockchain - an onchain activity
   * @params
   *  - params.didDocument          : LD did document
   *  - params.privateKeyMultibase  : Private Key to sign the doc
   *  - params.verificationMethodId : VerificationMethodId of the document
   *  - params.versionId            : Version of the document
   * @returns {Promise<{ transactionHash: string }>} Result of the update operation
   */
  public async update(params: {
    didDocument: Did;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
    readonly?: boolean;
    otherSignInfo?: Array<SignInfo>;
  }): Promise<{ transactionHash: string } | { didDocument; signInfos; versionId }> {
    if (!params.readonly) {
      params.readonly = false;
    }
    const response = {} as { transactionHash: string };
    if (!params.didDocument) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to update a did');
    }
    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
    }

    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
    }
    if (!params.versionId) {
      throw new Error('HID-SSI-SDK:: Error: params.versionId is required to update a did');
    }

    if (!this.didrpc && !this.didAPIService) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"'
      );
    }

    const { didDocument, privateKeyMultibase, verificationMethodId, versionId, otherSignInfo } = params;
    const signedDidDocument = await this._jsonLdSign({
      didDocument,
      privateKeyMultibase,
      verificationMethodId,
    });
    const { proof } = signedDidDocument;
    let signInfos: Array<SignInfo> = [
      {
        type: constant['DID_Ed25519VerificationKey2020'].SIGNATURE_TYPE,
        created: proof.created ?? this._getDateTime(),
        verificationMethod: verificationMethodId,
        proofPurpose: VerificationMethodRelationships.assertionMethod,
        proofValue: proof.proofValue,
      },
    ];
    if (otherSignInfo) {
      signInfos = [...signInfos, ...otherSignInfo];
    }
    if (params.readonly === true) {
      return {
        didDocument,
        signInfos,
        versionId,
      };
    }
    if (this.didrpc) {
      const result: DeliverTxResponse = await this.didrpc.updateDID(didDocument, signInfos, versionId);
      response.transactionHash = result.transactionHash;
    } else if (this.didAPIService) {
      const newSignInfos = signInfos as Array<ISignInfo>;
      const result = await this.didAPIService.updateDid({
        didDocument: didDocument as Did,
        signInfos: newSignInfos,
        deactivate: false,
      });
      response.transactionHash = result.transactionHash;
    }
    return response;
  }

  /**
   * Deactivate a DIDDocument in Hypersign blockchain - an onchain activity
   * @params
   *  - params.didDocument          : LD did document
   *  - params.privateKeyMultibase  : Private Key to sign the doc
   *  - params.verificationMethodId : VerificationMethodId of the document
   *  - params.versionId            : Version of the document
   * @returns {Promise<object>} Result of the deactivatee operation
   */
  public async deactivate(params: {
    didDocument: Did;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<{ transactionHash: string }> {
    const response = {} as { transactionHash: string };
    if (!params.didDocument) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did');
    }
    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
    }

    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
    }
    if (!params.versionId) {
      throw new Error('HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
    }

    if (!this.didrpc && !this.didAPIService) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"'
      );
    }

    const { didDocument, privateKeyMultibase, verificationMethodId, versionId } = params;

    const signedDidDocument = await this._jsonLdSign({
      didDocument,
      privateKeyMultibase,
      verificationMethodId,
    });
    const { proof } = signedDidDocument;
    const signInfos: Array<SignInfo> = [
      {
        type: constant['DID_Ed25519VerificationKey2020'].SIGNATURE_TYPE,
        created: proof.created ?? this._getDateTime(),
        verificationMethod: verificationMethodId,
        proofPurpose: VerificationMethodRelationships.assertionMethod,
        proofValue: proof.proofValue,
      },
    ];
    if (this.didrpc) {
      const result: DeliverTxResponse = await this.didrpc.deactivateDID(didDocument.id as string, signInfos, versionId);
      response.transactionHash = result.transactionHash;
    } else if (this.didAPIService) {
      const newSignInfos = signInfos as Array<ISignInfo>;
      const result: { transactionHash: string } = await this.didAPIService.updateDid({
        didDocument: didDocument as Did,
        signInfos: newSignInfos,
        deactivate: true,
      });
      response.transactionHash = result.transactionHash;
    }
    return response;
  }

  /**
   * Signs a DIDDocument
   * @params
   *  - params.didDocument               :   Did document to be signed
   *  - params.privateKeyMultibase       :   private key in multibase format (base58 digitalbazar format)
   *  - params.challenge                 :   challenge is a random string generated by the client
   *  - params.did                       :   did of the user
   *  - params.domain                    :   domain is the domain of the DID Document that is being authenticated
   *  - params.verificationMethodId      :   verificationMethodId of the DID
   * -  params.purpose                   :   purpose of Auth (authentication or assertionMethod)
   * @returns {Promise<object>} Signed DID Document
   */
  public async sign(params: {
    didDocument?: Did;
    privateKeyMultibase: string;
    challenge: string;
    domain: string;
    did?: string;
    verificationMethodId: string;
    purpose?: SupportedPurpose;
  }): Promise<ISignedDIDDocument> {
    const { privateKeyMultibase, challenge, domain, did, didDocument, verificationMethodId } = params;
    let resolveddoc;
    if (!privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKey is required to sign a did');
    }
    const didAuthType = params.purpose ?? 'authentication';
    try {
      // if did is prvovided then resolve the did doc from the blockchain or else use the did doc provided in the params object to sign the did doc with the proof
      if (did && this.didrpc) {
        resolveddoc = await this.didrpc.resolveDID(did);
      } else if (didDocument) {
        resolveddoc = {};
        resolveddoc.didDocument = Utils.removeEmptyString(didDocument) as Did;
      } else {
        throw new Error('HID-SSI-SDK:: Error: params.did or params.didDocument is required to sign a did');
      }
    } catch (error) {
      throw new Error(`HID-SSI-SDK:: Error: could not resolve did ${did}`);
    }
    let signedDidDocument;
    if (didAuthType === 'authentication') {
      if (!challenge) {
        throw new Error('HID-SSI-SDK:: Error: params.challenge is required to sign a did');
      }
      if (!domain) {
        throw new Error('HID-SSI-SDK:: Error: params.domain is required to sign a did');
      }
      const publicKeyId = verificationMethodId;
      const pubkey = resolveddoc.didDocument.verificationMethod.find((item) => item.id === publicKeyId);
      if (!pubkey) {
        throw new Error('HID-SSI-SDK:: Error: Incorrect verification method id');
      }

      const publicKeyMultibase1 = pubkey.publicKeyMultibase;
      const keyPair = await Ed25519VerificationKey2020.from({
        id: publicKeyId,
        privateKeyMultibase,
        publicKeyMultibase: publicKeyMultibase1,
      });

      const suite = new Ed25519Signature2020({
        verificationMethod: publicKeyId,
        key: keyPair,
      });

      const didDocumentLd = resolveddoc.didDocument;
      const controller = {
        '@context': constant.DID.CONTROLLER_CONTEXT,
        id: publicKeyId,
        authentication: didDocumentLd.authentication as string[],
      };
      signedDidDocument = (await jsonSigs.sign(didDocumentLd, {
        suite,
        purpose: new AuthenticationProofPurpose({
          controller,
          challenge,
          domain,
        }),
        documentLoader,
        compactProof: constant.compactProof,
      })) as ISignedDIDDocument;
    } else if (didAuthType === 'assertionMethod') {
      signedDidDocument = await this._jsonLdSign({
        didDocument: resolveddoc.didDocument,
        privateKeyMultibase,
        verificationMethodId,
      });
    } else {
      throw new Error(`HID-SSI-SDK:: Error: unsupported purpose ${params.purpose}`);
    }
    return signedDidDocument;
  }

  /**
   * Verifies a signed DIDDocument
   * @params
   *  - params.didDocument :   Signed DID Document
   *  - params.privateKey  :   private key in multibase format (base58 digitalbazar format)
   *  - params.challenge   :   challenge is a random string generated by the client required for authentication purpose
   *  - params.did         :   did of the user
   *  - params.domain      :   domain is the domain of the DID Document that is being authenticated
   *  -  params.purpose    :   purpose of Auth (authentication or assertion)
   * @returns Promise<{ verificationResult }> Verification Result
   */
  public async verify(params: {
    didDocument: Did;
    verificationMethodId: string;
    challenge?: string;
    domain?: string;
    purpose?: SupportedPurpose;
  }): Promise<object> {
    const { didDocument, verificationMethodId, challenge, domain } = params;
    if (!didDocument) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to verify a did');
    }

    if (!didDocument['proof']) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument.proof is not present in the signed did document');
    }

    if (!verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to verify a did');
    }
    const didAuthType = params.purpose ?? 'authentication';
    const didDoc = Utils.removeEmptyString(didDocument) as Did;
    const publicKeyId = verificationMethodId;
    const pubkey = didDoc.verificationMethod?.find((item) => item.id === publicKeyId);

    if (!pubkey) {
      throw new Error(
        'HID-SSI-SDK:: Error: could not find verification method for verificationMethodId: ' +
          verificationMethodId +
          ' in did document'
      );
    }
    const publicKeyMultibase1 = pubkey.publicKeyMultibase;
    const keyPair = await Ed25519VerificationKey2020.from({
      id: publicKeyId,
      publicKeyMultibase: publicKeyMultibase1,
    });
    const suite = new Ed25519Signature2020({
      key: keyPair,
    });
    suite.date = new Date(new Date().getTime() - 100000).toISOString();
    let controller: IController;
    let purpose;
    if (didAuthType === 'authentication') {
      if (!challenge) {
        throw new Error('HID-SSI-SDK:: Error: params.challenge is required to verify a did');
      }
      controller = {
        '@context': constant.DID.CONTROLLER_CONTEXT,
        id: publicKeyId,
        authentication: didDoc.authentication as string[],
      };
      purpose = new AuthenticationProofPurpose({
        controller,
        challenge,
        domain,
      });
    } else if (didAuthType === 'assertionMethod') {
      controller = {
        '@context': constant.DID.CONTROLLER_CONTEXT,
        id: publicKeyId,
        assertionMethod: didDoc.assertionMethod as string[],
      };
      purpose = new AssertionProofPurpose({
        controller,
      });
    } else {
      throw new Error(`HID-SSI-SDK:: Error: unsupported purpose ${params.purpose}`);
    }

    const result = await jsonSigs.verify(didDoc, {
      suite,
      purpose: purpose,
      documentLoader,
      compactProof: constant.compactProof,
    });
    return result;
  }
  private _isValidMultibaseBase58String = (str) => {
    const multibaseBase58Regex = /^z([1-9A-HJ-NP-Za-km-z]+)$/;
    return multibaseBase58Regex.test(str);
  };
  // using in API
  /**
   * Create DIDDocument using metamask or kepler
   * @param
   *  - params.methodSpecificId           : methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId or may be walletaddress
   *  - params.publicKey                  : Optional, Used for cosmos-ADR036
   *  - params.address                    : Checksum address from web3 wallet
   *  - params.chainId                    : Chain Id
   *  - params.clientSpec                 : ClientSpec either it is eth-personalSign or cosmos-ADR036\
   *  - params.verificationRelationships  : Optional, verification relationships where you want to add your verificaiton method ids
   * @returns {Promise<Did>}  DidDocument object
   */
  public async createByClientSpec(params: {
    methodSpecificId: string;
    publicKey?: string;
    address: string;
    chainId: string;
    clientSpec: IClientSpec;
    verificationRelationships?: VerificationMethodRelationships[];
  }): Promise<Did> {
    if (this['window'] === 'undefined') {
      console.log('HID-SSI-SDK:: Warning:  Running in non browser mode');
    }
    if (!params.methodSpecificId) {
      throw new Error('HID-SSI-SDK:: Error: params.methodSpecificId is required to create didoc');
    }

    if (!params.chainId) {
      throw new Error('HID-SSI-SDK:: Error: params.chainId is required to create didoc');
    }
    if (!params.address) {
      throw new Error('HID-SSI-SDK:: Error: params.address is required to create didoc');
    }

    if (!params.clientSpec) {
      throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to create didoc');
    }
    if (!(params.clientSpec in IClientSpec)) {
      throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is invalid');
    }
    let didDoc;
    let verificationRelationships: VerificationMethodRelationships[] = [];
    if (params.verificationRelationships && params.verificationRelationships.length > 0) {
      if (params.verificationRelationships.includes(VerificationMethodRelationships.keyAgreement)) {
        throw new Error('HID-SSI-SDK:: Error: keyAgreement is not allowed in verificationRelationships');
      }
      verificationRelationships = this._filterVerificationRelationships(params.verificationRelationships);
    } else {
      verificationRelationships = this._filterVerificationRelationships([]);
    }

    switch (params.clientSpec) {
      case IClientSpec['eth-personalSign']: {
        const blockChainAccountId = this._getBlockChainAccountID(params.chainId, params.address);

        const didId = this._getId(params.methodSpecificId);
        const newDid = new DIDDocument(
          '',
          blockChainAccountId,
          didId,
          VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020,
          verificationRelationships
        );
        didDoc = { ...newDid };
        delete didDoc.service;
        break;
      }
      case IClientSpec['cosmos-ADR036']: {
        if (!params.publicKey) {
          throw new Error(
            'HID-SSI-SDK:: Error: params.publicKey is required to create didoc for ' +
              VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019
          );
        }
        if (!this._isValidMultibaseBase58String(params.publicKey)) {
          throw new Error(
            'HID-SSI-SDK:: Error: params.publicKey mustbe multibase encoded base58 string for ' +
              VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019
          );
        }

        const multibasePublicKey = params.publicKey;
        const didId = this._getId(params.methodSpecificId);
        const blockChainAccountId = 'cosmos:' + params.chainId + ':' + params.address;
        const newDid = new DIDDocument(
          multibasePublicKey,
          blockChainAccountId,
          didId,
          VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019,
          verificationRelationships
        );
        didDoc = { ...newDid };

        break;
      }
      default: {
        throw new Error('HID-SSI-SDK:: Error: params.clientSpec is invalid use object.generate() method');
      }
    }
    return didDoc;
  }

  // public generateKeyPairBabyJubJub() {
  //   return;
  // }
  // public async createDIDbyBabyJubJub() {
  //   return;
  // }

  // using in API
  /**
   * Register did on chain generated using wallet
   * @param
   * - params.didDocument      : DidDocument to register
   * - params.signInfos        : Array of signature, verificationMethodId and clientSpec
   * @returns {Promise<{didDocument: Did,transactionHash: string }>}
   */

  public async registerByClientSpec(params: {
    didDocument: Did; // Ld document
    signInfos: ISignInfo[]; // type should be documentProof type. will change it later
  }): Promise<{ didDocument: Did; transactionHash: string }> {
    const response = {} as { didDocument: Did; transactionHash: string };
    if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
    }

    if (!this.didrpc && !this.didAPIService) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"'
      );
    }
    if (!params.signInfos) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to register a did');
    }

    if (params.signInfos.length < 1) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
    }
    if (!params.signInfos) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to register a did');
    }
    if (params.signInfos.length < 1) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
    }
    for (const i in params.signInfos) {
      if (!params.signInfos[i]['verification_method_id']) {
        throw new Error(
          `HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to register a did`
        );
      }
      const clientSpec = params.signInfos[i]['clientSpec'];
      if (clientSpec && clientSpec.type && !(clientSpec.type in IClientSpec)) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
      }
      if (clientSpec === undefined) {
        if (!params.signInfos[i].type) {
          throw new Error(
            `HID-SSI-SDK:: Error: params.signInfos[${i}].type is required to register a did if clientSpec is not passed or undefined`
          );
        }
      }

      if (!params.signInfos[i]['signature']) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to register a did`);
      }
    }

    const didDoc: Did = params.didDocument as Did;
    const { signInfos } = params;
    if (this.didrpc) {
      const proofs: DocumentProof[] = [];
      signInfos.forEach((sign) => {
        let type;
        let clientSpec;
        if (sign.clientSpec?.type === IClientSpec['eth-personalSign']) {
          type = constant['DID_EcdsaSecp256k1RecoveryMethod2020'].SIGNATURE_TYPE;
          clientSpec = ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN;
        } else if (sign['clientSpec']?.type === IClientSpec['cosmos-ADR036']) {
          type = constant['DID_EcdsaSecp256k1VerificationKey2019'].SIGNATURE_TYPE;
          clientSpec = ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036;
        } else if (sign['clientSpec'] === undefined) {
          type = sign.type;
        } else {
          throw new Error('Invalid clientSpec type');
        }
        const proof = {
          type,
          created: sign['created'],
          verificationMethod: sign['verification_method_id'],
          proofPurpose: VerificationMethodRelationships.assertionMethod,
          proofValue: sign['signature'],
          clientSpecType: clientSpec,
        };
        proofs.push(proof);
      });
      const result: DeliverTxResponse = await this.didrpc.registerDID(didDoc, proofs);
      response.didDocument = didDoc;
      response.transactionHash = result.transactionHash;
    } else if (this.didAPIService) {
      const newSignInfos = signInfos as Array<ISignInfo>;
      const result: { didDocument: Did; transactionHash: string } = await this.didAPIService.registerDid({
        didDocument: didDoc,
        signInfos: newSignInfos,
      });
      response.didDocument = didDoc;
      response.transactionHash = result.transactionHash;
    }
    return response;
  }

  // using in API
  /**
   * Update a didDocument in Hypersign blockchain
   * @param
   * - params.didDocument      : LD DidDocument to updated
   * - params.versionId        : Version of the document. See the didDocumentMetadata when DID resolves
   * - params.signInfos        : Array of signature, verificationMethodId and clientSpec
   * @returns {Promise<{ transactionHash: string }>}  Result of the update operation
   */
  public async updateByClientSpec(params: {
    didDocument: Did;
    versionId: string;
    signInfos: ISignInfo[];
  }): Promise<{ transactionHash: string }> {
    const response = {} as { transactionHash: string };
    if (!this.didrpc && !this.didAPIService) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"'
      );
    }
    if (!params.didDocument) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to update a did');
    }

    if (!params.signInfos) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to register a did');
    }
    if (params.signInfos.length < 1) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
    }
    for (const i in params.signInfos) {
      if (!params.signInfos[i]['verification_method_id']) {
        throw new Error(
          `HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to register a did`
        );
      }

      const clientSpec = params.signInfos[i]['clientSpec'];
      if (clientSpec && clientSpec.type && !(clientSpec.type in IClientSpec)) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
      }

      if (!params.signInfos[i]['signature']) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to register a did`);
      }
    }
    if (!params.versionId) {
      throw new Error('HID-SSI-SDK:: Error: params.versionId is required to update a did');
    }

    const { didDocument, signInfos, versionId } = params;
    if (this.didrpc) {
      const proofs: DocumentProof[] = [];
      signInfos.forEach((sign) => {
        let type;
        let clientSpec;
        if (sign['clientSpec']?.type === IClientSpec['eth-personalSign']) {
          type = constant['DID_EcdsaSecp256k1RecoveryMethod2020'].SIGNATURE_TYPE;
          clientSpec = ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN;
        } else if (sign['clientSpec']?.type === IClientSpec['cosmos-ADR036']) {
          type = constant['DID_EcdsaSecp256k1VerificationKey2019'].SIGNATURE_TYPE;
          clientSpec = ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036;
        } else {
          throw new Error('Invalid clientSpec type');
        }
        const proof = {
          type,
          created: sign['created'],
          verificationMethod: sign['verification_method_id'],
          proofPurpose: VerificationMethodRelationships.assertionMethod,
          proofValue: sign['signature'],
          clientSpecType: clientSpec,
        };
        proofs.push(proof);
      });
      const result: DeliverTxResponse = await this.didrpc.updateDID(didDocument as Did, proofs, versionId);
      response.transactionHash = result.transactionHash;
    } else if (this.didAPIService) {
      const newSignInfos = signInfos as Array<ISignInfo>;
      const result: { transactionHash: string } = await this.didAPIService.updateDid({
        didDocument: didDocument as Did,
        signInfos: newSignInfos,
        deactivate: false,
      });
      response.transactionHash = result.transactionHash;
    }
    return response;
  }

  // using in API
  /**
   * Deactivate a didDocument in Hypersign blockchain - an onchain activity
   * @param
   * - params.didDocument      : LD DidDocument to updated
   * - params.versionId        : Version of the document. See the didDocumentMetadata when DID resolves
   * - params.signInfos        : Array of signature, verificationMethodId and clientSpec
   * @returns {Promise<{ transactionHash: string }>}  Result of the update operation
   */
  public async deactivateByClientSpec(params: {
    didDocument: Did;
    signInfos: ISignInfo[];
    versionId: string;
  }): Promise<{ transactionHash: string }> {
    const response = {} as { transactionHash: string };

    if (!this.didrpc && !this.didAPIService) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignDID class is not instantiated with "Offlinesigner" or have not been initilized with "EntityAPISecreKey"'
      );
    }
    if (!params.didDocument) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did');
    }
    if (!params.signInfos) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to deactivate a did');
    }
    if (params.signInfos.length < 1) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
    }

    for (const i in params.signInfos) {
      if (!params.signInfos[i]['verification_method_id']) {
        throw new Error(
          `HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to deactivate a did`
        );
      }

      const clientSpec = params.signInfos[i]['clientSpec'];
      if (clientSpec && clientSpec.type && !(clientSpec.type in IClientSpec)) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
      }

      if (!params.signInfos[i]['signature']) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to deactivate a did`);
      }
    }

    if (!params.versionId) {
      throw new Error('HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
    }
    const { didDocument, signInfos, versionId } = params;
    const didDoc: Did = didDocument as Did;
    if (this.didrpc) {
      const proofs: DocumentProof[] = [];
      signInfos.forEach((sign) => {
        let type;
        let clientSpec;
        if (sign['clientSpec']?.type === IClientSpec['eth-personalSign']) {
          type = constant['DID_EcdsaSecp256k1RecoveryMethod2020'].SIGNATURE_TYPE;
          clientSpec = ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN;
        } else if (sign['clientSpec']?.type === IClientSpec['cosmos-ADR036']) {
          type = constant['DID_EcdsaSecp256k1VerificationKey2019'].SIGNATURE_TYPE;
          clientSpec = ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036;
        } else {
          throw new Error('Invalid clientSpec type');
        }
        const proof = {
          type,
          created: sign['created'],
          verificationMethod: sign['verification_method_id'],
          proofPurpose: VerificationMethodRelationships.assertionMethod,
          proofValue: sign['signature'],
          clientSpecType: clientSpec,
        };
        proofs.push(proof);
      });
      const result: DeliverTxResponse = await this.didrpc.deactivateDID(didDoc.id as string, proofs, versionId);
      response.transactionHash = result.transactionHash;
    } else if (this.didAPIService) {
      const newSignInfos = signInfos as Array<ISignInfo>;
      const result: { transactionHash: string } = await this.didAPIService.updateDid({
        didDocument: didDocument as Did,
        signInfos: newSignInfos,
        deactivate: true,
      });
      response.transactionHash = result.transactionHash;
    }
    return response;
  }
  /**
   * Sign and Register a DIDDocument
   * @param
   * - params.didDocument           : DidDocument to be signed and register
   * - params.address               : Checksum address from web3 wallet
   * - params.verificationMethodId  : verificationMethodId of the DID
   * - params.web3                  : Web3 object
   * - params.clientSpec            : ClientSpec either it is eth-personalSign or cosmos-ADR036
   * - params.chainId               : OPtional, ChainId
   * @returns {Promise<{ didDocument: Did; transactionHash: string }>}
   */
  public async signAndRegisterByClientSpec(params: {
    didDocument: Did;
    address: string;
    verificationMethodId: string;
    web3: Web3 | any;
    clientSpec: IClientSpec;
    chainId?: string; // only for [cosmos-ADR036]
  }): Promise<{ didDocument: Did; transactionHash: string }> {
    if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
    }

    if (!params.clientSpec) {
      throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to sign');
    }
    if (!(params.clientSpec in IClientSpec)) {
      throw new Error('HID-SSI-SDK:: Error: invalid clientSpec');
    }
    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error:  HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
    }
    if (!params.web3) {
      throw new Error('HID-SSI-SDK:: Error: params.web should be passed');
    }

    if (!params.address) {
      throw new Error('HID-SSI-SDK:: Error: params.address is required to sign a did');
    }

    const signedDidDoc = await this.signByClientSpec({
      didDocument: params.didDocument,
      clientSpec: params.clientSpec,
      address: params.address,
      web3: params.web3,
      chainId: params.chainId,
      verificationMethodId: params.verificationMethodId,
    });
    const signInfos = [
      {
        signature: signedDidDoc.proof.proofValue,
        verification_method_id: params.verificationMethodId,
        created: signedDidDoc.proof.created,
        clientSpec: {
          type:
            params.clientSpec === IClientSpec['cosmos-ADR036']
              ? IClientSpec['cosmos-ADR036']
              : IClientSpec['eth-personalSign'],
        },
      },
    ];
    return await this.registerByClientSpec({
      didDocument: params.didDocument,
      signInfos,
    });
  }
  /**
   * Signs a DIDDocument
   * @param
   * - params.didDocument          : Did document to be signed
   * - params.clientSpec           : ClientSpec either it is eth-personalSign or cosmos-ADR036
   * - params.address              : Checksum address from web3 wallet
   * - params.web3                 : web3 object
   * - params.chainId              : Optional, chainId
   * - params.verificationMethodId : verificationMEthodId for generating signature
   * @returns {Promise<ISignedDIDDocument>}
   */
  public async signByClientSpec(params: {
    didDocument: Did;
    clientSpec: IClientSpec;
    address: string;
    web3: Web3 | any;
    verificationMethodId: string;
    chainId?: string; // only for [cosmos-ADR036]
  }): Promise<ISignedDIDDocument> {
    if (this['window'] === 'undefined') {
      throw new Error('HID-SSI-SDK:: Error:  Running in non browser mode');
    }
    if (!params.didDocument) {
      throw Error('HID-SSI-SDK:: Error: params.didDocument is required to sign');
    }
    if (params.didDocument['proof']) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument should not contain proof in it');
    }

    if (!params.address) {
      throw new Error('HID-SSI-SDK:: Error: params.address is required to sign a did');
    }
    if (!params.clientSpec) {
      throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to sign');
    }
    if (!(params.clientSpec in IClientSpec)) {
      throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is invalid');
    }
    if (!params.web3) {
      throw new Error('HID-SSI-SDK:: Error: params.web3 is required to sign');
    }
    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to sign');
    }
    const vmId = params.didDocument.verificationMethod?.find((x) => x.id == params.verificationMethodId);
    if (!vmId || vmId == undefined) {
      throw new Error(`HID-SSI_SDK:: Error: invalid verificationMethodId`);
    }
    const didDoc: Did = Utils.removeEmptyString(params.didDocument) as Did;
    switch (params.clientSpec) {
      case IClientSpec['eth-personalSign']: {
        // normalize didDoc with JSON LD
        const normalizedDidDoc = await this._jsonLdNormalize({ doc: didDoc });
        const normalizedDidDocHash = new Uint8Array(
          Buffer.from(crypto.createHash('sha256').update(normalizedDidDoc).digest('hex'), 'hex')
        );

        // construct proof
        const proof = {
          '@context': didDoc['@context'],
          type: ProofTypes.EcdsaSecp256k1RecoverySignature2020,
          created: this._getDateTime(),
          verificationMethod: params.verificationMethodId, //didDoc?.verificationMethod && (didDoc.verificationMethod[0]?.id as string), // which vmId to use in case of multiple vms  or we should pass vmId also in sign function
          proofPurpose: VerificationMethodRelationships.assertionMethod,
        };

        // normalize proof with JSON LD
        const normalizedProof = await this._jsonLdNormalize({ doc: proof });
        delete proof['@context'];
        const normalizedProofHash = new Uint8Array(
          Buffer.from(crypto.createHash('sha256').update(normalizedProof).digest('hex'), 'hex')
        );
        const combinedHash = await this._concat(normalizedProofHash, normalizedDidDocHash);

        const didDocJsonDigest = {
          didId: didDoc.id,
          didDocDigest: Buffer.from(combinedHash).toString('hex'),
        };
        const signature = await params.web3.eth.personal.sign(
          JSON.stringify(didDocJsonDigest, (key, value) => {
            if (value === '' || (Array.isArray(value) && value.length === 0)) {
              return undefined;
            }
            return value;
          }),
          params.address
        );
        proof['proofValue'] = signature;
        proof['clientSpecType'] = ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN;
        didDoc['proof'] = proof;
        return didDoc as ISignedDIDDocument;
      }
      case IClientSpec['cosmos-ADR036']: {
        if (!params.chainId) {
          throw new Error(
            'HID-SSI-SDK:: Error:  params.chainId is required to sign for clientSpec ' +
              IClientSpec['cosmos-ADR036'] +
              ' and keyType ' +
              VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019
          );
        }
        const normalizedDidDoc = await this._jsonLdNormalize({ doc: didDoc });
        const normalizedDidDochash = new Uint8Array(
          Buffer.from(crypto.createHash('sha256').update(normalizedDidDoc).digest('hex'), 'hex')
        );

        // construct proof
        const proof = {
          '@context': didDoc['@context'],
          type: ProofTypes.EcdsaSecp256k1Signature2019,
          created: this._getDateTime(),
          verificationMethod: params.verificationMethodId, // which vmId to use in case of multiple vms  or we should pass vmId also in sign function
          proofPurpose: VerificationMethodRelationships.assertionMethod,
        };
        const normalizedProof = await this._jsonLdNormalize({ doc: proof });
        delete proof['@context'];
        const normalizedProofHash = new Uint8Array(
          Buffer.from(crypto.createHash('sha256').update(normalizedProof).digest('hex'), 'hex')
        );
        const combinedHash = await this._concat(normalizedProofHash, normalizedDidDochash);
        const signRespObj = await params.web3.requestMethod('signArbitrary', [
          params.chainId,
          params.address,
          combinedHash,
        ]);
        proof['proofValue'] = signRespObj['signature'];
        proof['clientSpecType'] = ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036;
        didDoc['proof'] = proof;
        return didDoc as ISignedDIDDocument;
      }

      default:
        throw Error('HID-SSI-SDK:: Error: Invalid clientSpec');

        break;
    }
  }

  /**
   * Add verification method
   * @param
   * - params.didDocument          : Optional, unregistered Did document
   * - params.did                  : Optional, didDoc Id of registered didDoc
   * - params.type                 : key type
   * - params.id                   : Optional, verificationMethodId
   * - params.controller           : Optional, controller field
   * - params.publicKeyMultibase   : public key
   * - params.blockchainAccountId  : Optional, blockchain accountId
   * @return {Promise<Did>}  DidDocument object
   */
  public async addVerificationMethod(params: {
    did?: string;
    didDocument?: Did;
    type: VerificationMethodTypes;
    id?: string; // verificationMethodId
    controller?: string;
    publicKeyMultibase?: string;
    blockchainAccountId?: string;
  }): Promise<Did> {
    let resolvedDidDoc;

    if (!params.did && (!params.didDocument || Object.keys(params.didDocument).length === 0)) {
      throw new Error('HID-SSI_SDK:: Error: params.did or params.didDocument is required to addVerificationMethod');
    }
    if (!params.type) {
      throw new Error('HID-SSI-SDK:: Error: params.type is required to addVerificationMethod');
    }
    const { type } = params;
    if (!(type in VerificationMethodTypes)) {
      throw new Error('HID-SSI-SDK:: Error: params.type is invalid');
    }
    try {
      if (params.did) {
        if (!this.didrpc) {
          throw new Error(
            'HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
          );
        }
        resolvedDidDoc = await this.didrpc.resolveDID(params.did);
        if (!resolvedDidDoc.didDocument) {
          if (!params.didDocument) {
            throw new Error('HID-SSI_SDK:: Error: can not able to resolve did please send didDocument');
          }
        }
      } else if (params.didDocument) {
        resolvedDidDoc = {};
        resolvedDidDoc.didDocument = params.didDocument;
      } else {
        throw new Error('HID-SSI-SDK:: Error: params.did or params.didDocument is required to addVerificationMethod');
      }
    } catch (e) {
      throw new Error(`HID-SSI-SDK:: Error: could not resolve did ${params.did}`);
    }
    if (
      type === VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020 &&
      (!params.blockchainAccountId || params.blockchainAccountId.trim() === '')
    ) {
      throw new Error(`HID-SSI-SDK:: Error: params.blockchainAccountId is required for keyType ${params.type}`);
    }
    if (type === VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020 && (!params.id || params.id.trim() === '')) {
      throw new Error(`HID-SSI-SDK:: Error: params.id is required for keyType ${params.type}`);
    }
    if (
      type === VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019 &&
      (!params.blockchainAccountId ||
        params.blockchainAccountId.trim() === '' ||
        !params.publicKeyMultibase ||
        params.publicKeyMultibase.trim() === '')
    ) {
      throw new Error(
        `HID-SSI-SDK:: Error: params.blockchainAccountId and params.publicKeyMultibase is required for keyType ${params.type}`
      );
    }

    if (
      (type === VerificationMethodTypes.Ed25519VerificationKey2020 ||
        type === VerificationMethodTypes.X25519KeyAgreementKey2020 ||
        type === VerificationMethodTypes.X25519KeyAgreementKeyEIP5630) &&
      !params.publicKeyMultibase
    ) {
      throw new Error('HID-SSI-SDK:: Error: params.publicKeyMultibase is required to addVerificationMethod');
    }
    const verificationMethod = {} as VerificationMethod;
    const { didDocument } = resolvedDidDoc;

    if (params.id) {
      const checkIfVmIdExists = didDocument.verificationMethod.some((vm) => vm.id === params.id);
      if (checkIfVmIdExists) {
        throw new Error(`HID-SSI-SDK:: Error: verificationMethod ${params.id} already exists`);
      }
    }

    const VMLength = didDocument.verificationMethod.length;
    verificationMethod['id'] = params?.id ?? `${didDocument.id}#key-${VMLength + 1}`;
    verificationMethod['type'] = type;
    verificationMethod['controller'] = didDocument.id;
    if (type !== VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020) {
      verificationMethod['publicKeyMultibase'] = params?.publicKeyMultibase ?? '';
    }
    if (type !== VerificationMethodTypes.Ed25519VerificationKey2020) {
      verificationMethod['blockchainAccountId'] = params?.blockchainAccountId ?? '';
    }
    if (type == VerificationMethodTypes.BabyJubJubKey2021) {
      delete verificationMethod['blockchainAccountId'];
    }
    didDocument.verificationMethod.push(verificationMethod);
    if (
      verificationMethod['type'] === VerificationMethodTypes.X25519KeyAgreementKey2020 ||
      verificationMethod['type'] === VerificationMethodTypes.X25519KeyAgreementKeyEIP5630
    ) {
      didDocument.keyAgreement.push(verificationMethod['id']);
    } else {
      didDocument.authentication.push(verificationMethod['id']);
      didDocument.assertionMethod.push(verificationMethod['id']);
      didDocument.capabilityDelegation.push(verificationMethod['id']);
      didDocument.capabilityInvocation.push(verificationMethod['id']);
    }
    if (verificationMethod['type'] === VerificationMethodTypes.X25519KeyAgreementKey2020) {
      const newContext = constant['DID_' + VerificationMethodTypes.Ed25519VerificationKey2020].DID_KEYAGREEMENT_CONTEXT;
      if (!didDocument['@context'].includes(newContext)) {
        didDocument['@context'].push(newContext);
      }
    }
    if (verificationMethod['type'] === VerificationMethodTypes.X25519KeyAgreementKeyEIP5630) {
      const newContext =
        constant['DID_' + VerificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020].DID_KEYAGREEMENT_CONTEXT;
      if (!didDocument['@context'].includes(newContext)) {
        didDocument['@context'].push(newContext);
      }
    }
    if (verificationMethod['type'] === VerificationMethodTypes.BabyJubJubKey2021) {
      const newContext = constant['DID_' + VerificationMethodTypes.BabyJubJubKey2021].DID_BABYJUBJUBKEY2021;
      if (!didDocument['@context'].includes(newContext)) {
        didDocument['@context'].push(newContext);
      }
      const newContext1 = constant['DID_' + VerificationMethodTypes.BabyJubJubKey2021].BABYJUBJUBSIGNATURE;

      if (!didDocument['@context'].includes(newContext1)) {
        didDocument['@context'].push(newContext1);
      }
    }
    return didDocument;
  }
}
