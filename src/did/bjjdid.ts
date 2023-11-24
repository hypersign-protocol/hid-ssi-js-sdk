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
import { BabyJubJubKeys2021 } from '@hypersign-protocol/babyjubjub2021';
import { BabyJubJubSignature2021Suite } from '@hypersign-protocol/babyjubjubsignature2021';
import { DidDocument as Did, VerificationMethod, Service, DidDocument } from '../../libs/generated/ssi/did';
import { DocumentProof, DocumentProof as SignInfo } from '../../libs/generated/ssi/proof';

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
} from './IDID';
import {
  ProofTypes,
  VerificationMethodRelationships,
  VerificationMethodTypes,
} from '../../libs/generated/ssi/client/enums';
import { OfflineSigner } from '@cosmjs/proto-signing';
import customLoader from '../../libs/w3cache/v1';
import { DeliverTxResponse } from './IDID';
import { ClientSpecType } from '../../libs/generated/ssi/client_spec';

const documentLoader = jsonSigs.extendContextLoader(customLoader);
class DIDDocument implements Did {
  '@context': string[];
  id: string;
  controller: string[];
  alsoKnownAs?: string[];
  verificationMethod?: VerificationMethod[];
  authentication: string[] | any;
  assertionMethod: string[] | any;
  keyAgreement: string[] | any;
  capabilityInvocation: string[] | any;
  capabilityDelegation: string[] | any;
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
        this['@context'] = [
          constant['DID_' + keyType].DID_BASE_CONTEXT,
          constant['DID_' + keyType].DID_BABYJUBJUBKEY2021,
        ];
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
      case VerificationMethodTypes.BabyJubJubKey2021: {
        this['@context'] = [
          constant['DID_' + keyType].DID_BASE_CONTEXT,
          constant['DID_' + keyType].DID_BABYJUBJUBKEY2021,
        ];
        this.id = id;
        this.controller = [this.id];
        vm = {
          id: this.id + '#key-1',
          type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
          controller: this.id,
          publicKeyMultibase: publicKey,
        };

        const verificationMethod: VerificationMethod = vm;
        this.verificationMethod = [verificationMethod];
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        this.authentication = [vm.id];
        this.assertionMethod = [vm.id];
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
  }
  sign(params: {
    didDocument: Did;
    privateKeyMultibase: string;
    challenge: string;
    domain: string;
    did: string;
    verificationMethodId: string;
  }): Promise<ISignedDIDDocument> {
    throw new Error('Method not implemented.');
  }
  verify(params: {
    didDocument: Did;
    verificationMethodId: string;
    challenge: string;
    domain?: string | undefined;
  }): Promise<object> {
    throw new Error('Method not implemented.');
  }
  addVerificationMethod(params: {
    did?: string | undefined;
    didDocument?: Did | undefined;
    type: VerificationMethodTypes; // TODO: we should take services object in consntructor
    // TODO: we should take services object in consntructor
    id?: string | undefined;
    controller?: string | undefined;
    publicKeyMultibase?: string | undefined;
    blockchainAccountId?: string | undefined;
  }): Promise<Did> {
    throw new Error('Method not implemented.');
  }
  createByClientSpec(params: {
    methodSpecificId: string;
    publicKey?: string | undefined;
    address: string;
    chainId: string;
    clientSpec: IClientSpec;
    verificationRelationships?: VerificationMethodRelationships[] | undefined;
  }): Promise<Did> {
    throw new Error('Method not implemented.');
  }
  registerByClientSpec(params: {
    didDocument: Did;
    signInfos: DocumentProof[];
  }): Promise<{ didDocument: Did; transactionHash: string }> {
    throw new Error('Method not implemented.');
  }
  updateByClientSpec(params: {
    didDocument: Did;
    versionId: string;
    signInfos: DocumentProof[];
  }): Promise<{ transactionHash: string }> {
    throw new Error('Method not implemented.');
  }
  deactivateByClientSpec(params: {
    didDocument: Did;
    signInfos: DocumentProof[];
    versionId: string;
  }): Promise<{ transactionHash: string }> {
    throw new Error('Method not implemented.');
  }
  signAndRegisterByClientSpec(params: {
    didDocument: Did;
    address: string;
    verificationMethodId: string;
    web3: any;
    clientSpec: IClientSpec;
    chainId?: string | undefined;
  }): Promise<{ didDocument: Did; transactionHash: string }> {
    throw new Error('Method not implemented.');
  }
  signByClientSpec(params: {
    didDocument: Did;
    clientSpec: IClientSpec;
    address: string;
    web3: any;
    chainId?: string | undefined;
    verificationMethodId: any;
  }): Promise<ISignedDIDDocument> {
    throw new Error('Method not implemented.');
  }

  private _getDateTime(): string {
    return new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
  }

  private async _jsonLdSign(params: {
    didDocument: Did;
    privateKeyMultibase: string;
    verificationMethodId: string;
  }): Promise<SignInfo> {
    const { didDocument, privateKeyMultibase, verificationMethodId } = params;
    const publicKeyId = verificationMethodId + 'assertionMethod';
    const pubKey = (didDocument.assertionMethod as any)?.find((item) => item.id === publicKeyId);
    const publicKeyMultibase1 = pubKey?.publicKeyMultibase;
    const keyPair = BabyJubJubKeys2021.fromKeys({
      options: {
        id: publicKeyId,
        controller: publicKeyId,
      },
      privateKeyMultibase: privateKeyMultibase,
      publicKeyMultibase: publicKeyMultibase1 as string,
    });
    const suite = new BabyJubJubSignature2021Suite({ key: keyPair });
    const signedDidDocument = (await jsonSigs.sign(didDocument, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader,
    })) as ISignedDIDDocument;
    return signedDidDocument.proof;
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
    if (methodSpecificId && methodSpecificId.length < 32) {
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
    mnemonic?: string;
    controller?: string;
  }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }> {
    let edKeyPair;
    if (params && params.mnemonic && params.controller) {
      edKeyPair = await BabyJubJubKeys2021.from(params.mnemonic, {
        id: params.controller,
      });
    } else if (params && params.controller) {
      edKeyPair = await BabyJubJubKeys2021.generate({ id: params.controller });
    } else if (params && params.mnemonic) {
      edKeyPair = await BabyJubJubKeys2021.from(params.mnemonic);
    } else {
      edKeyPair = await BabyJubJubKeys2021.generate();
    }
    return {
      ...edKeyPair,
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
      VerificationMethodTypes.BabyJubJubKey2021,
      verificationRelationships
    ) as IDid;
    return Utils.jsonToLdConvertor({ ...newDid });
  }

  private prepareDidDocument(did: Did) {
    const did1 = {} as any;
    Object.assign(did1, did);
    // delete did1.alsoKnownAs;
    //  TODO FIx
    if (did.assertionMethod) {
      did.assertionMethod.map((x) => {
        did.verificationMethod?.find((vm) => {
          if (vm.id === x) {
            did1.assertionMethod = [
              {
                id: vm.id + 'assertionMethod',
                type: vm.type,
                publicKeyMultibase: vm.publicKeyMultibase,
              },
            ];
          }
        });
      });
    }

    if (did.authentication) {
      did.authentication.map((x) => {
        did.verificationMethod?.find((vm) => {
          if (vm.id === x) {
            did1.authentication = [
              {
                id: vm.id + 'authentication',
                type: vm.type,
                publicKeyMultibase: vm.publicKeyMultibase,
              },
            ];
          }
        });
      });
    }

    did1.capabilityDelegation = [];
    did1.capabilityInvocation = [];
    did1.keyAgreement = [];
    delete did1.verificationMethod;

    return did1;
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
    verificationMethodId: string;
    signData?: ISignData[];
  }): Promise<{ didDocument: Did; transactionHash: string }> {
    //ToDO  check if did exists

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
        const prepareDidDocument = this.prepareDidDocument(didDocument);
        const proof = await this._jsonLdSign({
          didDocument: prepareDidDocument,
          privateKeyMultibase,
          verificationMethodId,
        });
        signature = proof.proofValue;
        createdAt = proof.created;
      }

      signInfos.push({
        type: constant['DID_BabyJubJubKey2021'].SIGNATURE_TYPE,
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
            const proof: SignInfo = await this._jsonLdSign({
              didDocument: didDocument,
              privateKeyMultibase,
              verificationMethodId,
            });
            signature = proof.proofValue as string;
            createdAt = proof.created;
          }
          signInfos.push({
            type: constant['DID_BabyJubJubKey2021'].SIGNATURE_TYPE,
            created: createdAt ?? this._getDateTime(),
            verificationMethod: verificationMethodId,
            proofPurpose: VerificationMethodRelationships.assertionMethod,
            proofValue: signature,
          });
          delete didDocument['proof'];
        }
      }
    }
    console.log(didDoc, signInfos);

    if (this.didrpc) {
      const result: DeliverTxResponse = await this.didrpc.registerDID(didDoc, signInfos);
      if (result.code !== 0) {
        throw new Error(result.rawLog);
      }

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
    if (!didDocument['@context']) {
      throw new Error('HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
    } else {
      didDocument = Utils.removeEmptyString(didDocument);
      const proof = await this._jsonLdSign({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
      });
      signature = proof.proofValue;
      createdAt = proof.created;
    }
    signInfos.push({
      signature,
      verification_method_id: verificationMethodId,
      created: createdAt,
      clientSpec: undefined,
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
  }): Promise<{ transactionHash: string }> {
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

    const { didDocument, privateKeyMultibase, verificationMethodId, versionId } = params;
    const prepareDidDocument = this.prepareDidDocument(didDocument);
    console.log(prepareDidDocument);

    const proof = await this._jsonLdSign({
      didDocument: prepareDidDocument,
      privateKeyMultibase,
      verificationMethodId,
    });
    const signInfos: Array<SignInfo> = [
      {
        type: constant['DID_BabyJubJubKey2021'].SIGNATURE_TYPE,
        created: proof.created ?? this._getDateTime(),
        verificationMethod: verificationMethodId,
        proofPurpose: VerificationMethodRelationships.assertionMethod,
        proofValue: proof.proofValue,
      },
    ];
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
    const prepareDidDocument = this.prepareDidDocument(didDocument);
    const proof = await this._jsonLdSign({
      didDocument: prepareDidDocument,
      privateKeyMultibase,
      verificationMethodId,
    });
    const signInfos: Array<SignInfo> = [
      {
        type: constant['DID_BabyJubJubKey2021'].SIGNATURE_TYPE,
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
   * @returns {Promise<object>} Signed DID Document
   */

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
}
