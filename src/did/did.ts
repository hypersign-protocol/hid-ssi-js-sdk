/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import * as constant from '../constants';
import jsonSigs from 'jsonld-signatures';
const { AuthenticationProofPurpose } = jsonSigs.purposes;
import { DIDRpc } from './didRPC';
import Utils from '../utils';
const ed25519 = require('@stablelib/ed25519');
import { Did, VerificationMethod, Service } from '../../libs/generated/ssi/did';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import Web3 from 'web3';
import { IdEncoder } from '../../libs/bnid';
import {
  IParams,
  IDID,
  IDid,
  IDIDResolve,
  IDIDRpc,
  IController,
  IDidDocument,
  ISignedDIDDocument,
  IKeyType,
  IClientSpec,
} from './IDID';
import { OfflineSigner } from '@cosmjs/proto-signing';
import customLoader from '../../libs/w3cache/v1';

class DIDDocument implements Did {
  context: string[];
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
  constructor(publicKey: string, blockchainAccountId: string, id: string, keyType: IKeyType) {
    let vm;
    switch (keyType) {
      case IKeyType.Ed25519VerificationKey2020: {
        this.context = [constant['DID_' + keyType].DID_BASE_CONTEXT];
        this.id = id;
        this.controller = [this.id];
        this.alsoKnownAs = [this.id];
        vm = {
          id: this.id + '#key-1',
          type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
          controller: this.id,
          publicKeyMultibase: publicKey,
          blockchainAccountId: '',
        };

        const verificationMethod: VerificationMethod = vm;
        this.verificationMethod = [verificationMethod];
        this.authentication = [verificationMethod.id];
        this.assertionMethod = [verificationMethod.id];
        this.keyAgreement = [verificationMethod.id];
        this.capabilityInvocation = [verificationMethod.id];
        this.capabilityDelegation = [verificationMethod.id];
        // TODO: we should take services object in consntructor
        this.service = [];

        break;
      }
      case IKeyType.EcdsaSecp256k1RecoveryMethod2020: {
        this.context = [constant['DID_' + keyType].DID_BASE_CONTEXT];
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
        this.authentication = [verificationMethod.id];
        this.assertionMethod = [verificationMethod.id];
        this.keyAgreement = [verificationMethod.id];
        this.capabilityInvocation = [verificationMethod.id];
        this.capabilityDelegation = [verificationMethod.id];
        // TODO: we should take services object in consntructor
        this.service = [
          {
            id: id + '#linked-domain',
            type: 'LinkedDomains',
            serviceEndpoint: 'https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/did/' + id,
          },
        ];

        break;
      }
      case IKeyType.EcdsaSecp256k1VerificationKey2019: {
        this.context = [constant['DID_' + keyType].DID_BASE_CONTEXT];
        this.id = id;
        this.controller = [this.id];
        this.alsoKnownAs = [this.id];
        vm = {
          id: this.id + '#key-1',
          type: constant['DID_' + keyType].VERIFICATION_METHOD_TYPE,
          controller: this.id,
          publicKeyMultibase: publicKey,
          blockchainAccountId: '',
        };
        const verificationMethod: VerificationMethod = vm;
        this.verificationMethod = [verificationMethod];
        this.authentication = [verificationMethod.id];
        this.assertionMethod = [verificationMethod.id];
        this.keyAgreement = [verificationMethod.id];
        this.capabilityInvocation = [verificationMethod.id];
        this.capabilityDelegation = [verificationMethod.id];
        // TODO: we should take services object in consntructor
        this.service = [
          {
            id: id + '#linked-domain',
            type: 'LinkedDomains',
            serviceEndpoint: 'https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/did/' + id,
          },
        ];

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
    } = {}
  ) {
    const { offlineSigner, namespace, nodeRpcEndpoint, nodeRestEndpoint } = params;
    const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
    const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
    const rpcConstructorParams = {
      offlineSigner,
      nodeRpcEndpoint: nodeRPCEp,
      nodeRestEndpoint: nodeRestEp,
    };
    this.didrpc = new DIDRpc(rpcConstructorParams);
    this.namespace = namespace ? namespace : '';
  }

  public async init() {
    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error:  HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    await this.didrpc.init();
  }

  private async _sign(params: { didDocString: string; privateKeyMultibase: string }): Promise<string> {
    const { privateKeyMultibase: privateKeyMultibaseConverted } =
      Utils.convertEd25519verificationkey2020toStableLibKeysInto({
        privKey: params.privateKeyMultibase,
      });

    const { didDocString } = params;
    // TODO:  do proper checck of paramaters
    const did: Did = JSON.parse(didDocString);
    const didBytes = (await Did.encode(did)).finish();
    const signed = ed25519.sign(privateKeyMultibaseConverted, didBytes);
    return Buffer.from(signed).toString('base64');
  }

  private _getId = (methodSpecificId) => {
    let did = '';
    did =
      this.namespace && this.namespace != ''
        ? `${constant.DID.SCHEME}:${constant.DID.METHOD}:${this.namespace}:${methodSpecificId}`
        : `${constant.DID.SCHEME}:${constant.DID.METHOD}:${methodSpecificId}`;
    return did;
  };

  /**
   * Generate a new key pair of type Ed25519VerificationKey2020
   * @params params.seed - Seed to generate the key pair
   * @returns {Promise<object>} The key pair of type Ed25519
   */
  public async generateKeys(params: {
    seed?: string;
  }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }> {
    let edKeyPair;
    if (params && params.seed) {
      const seedBytes = new Uint8Array(Buffer.from(params.seed));
      edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes });
    } else {
      edKeyPair = await Ed25519VerificationKey2020.generate();
    }
    const exportedKp = await edKeyPair.export({ publicKey: true, privateKey: true });
    return {
      privateKeyMultibase: exportedKp.privateKeyMultibase, // 91byte //zbase58
      publicKeyMultibase: exportedKp.publicKeyMultibase, //48 bytes
    };
  }

  /**
   * Generates a new DID Document
   * @params
   *  - params.publicKeyMultibase : public key
   *  - params.methodSpecificId   : Optional methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId
   * @returns {Promise<object>} DidDocument object
   */
  public async generate(params: { methodSpecificId?: string; publicKeyMultibase: string }): Promise<object> {
    if (!params.publicKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
    }
    const { publicKeyMultibase: publicKeyMultibase1 } = Utils.convertEd25519verificationkey2020toStableLibKeysInto({
      publicKey: params.publicKeyMultibase,
    });

    const methodSpecificId = publicKeyMultibase1;
    let didId;
    if (params.methodSpecificId) {
      didId = this._getId(params.methodSpecificId);
    } else {
      didId = this._getId(methodSpecificId);
    }
    const newDid = new DIDDocument(publicKeyMultibase1, '', didId, IKeyType.Ed25519VerificationKey2020) as IDid;
    return Utils.jsonToLdConvertor({ ...newDid });
  }

  /**
   * Creates a new DID Document from wallet address
   * @params
   *  - params.blockChainAccountId  :
   *  - params.methodSpecificId   : methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId or may be walletaddress
   * @returns {Promise<object>} DidDocument object
   */

  private _getBlockChainAccountID(chainId: string, address: string) {
    let blockChainAccountId;
    switch (chainId) {
      case '0x1': {
        const web3 = new Web3();

        const inDecimelChainId = web3.utils.toNumber(chainId);
        blockChainAccountId = constant.CAIP_10_PREFIX.eip155 + ':' + inDecimelChainId + ':' + address;
        break;
      }
      case '0x89': {
        const web3 = new Web3();

        const inDecimelChainId = web3.utils.toNumber(chainId);
        blockChainAccountId = constant.CAIP_10_PREFIX.eip155 + ':' + inDecimelChainId + ':' + address;
        break;
      }
      default:
        throw new Error('HID-SSI-SDK:: Error: unsupported chain Id');
    }

    return blockChainAccountId;
  }

  private _bufToMultibase(pubKeyBuf: Uint8Array) {
    // Convert to multibase
    const encoder = new IdEncoder({
      encoding: 'base58btc',
      multibase: true,
    });
    const newPubKeyMultibase = encoder.encode(pubKeyBuf);
    return newPubKeyMultibase;
  }

  public async createByClientSpec(params: {
    methodSpecificId: string;
    publicKey?: Uint8Array;
    chainId: string;
    keyType: IKeyType;
  }): Promise<object> {
    if (this['window'] === 'undefined') {
      console.log('HID-SSI-SDK:: Warning:  Running in non browser mode');
    }
    if (!params.methodSpecificId) {
      throw new Error('HID-SSI-SDK:: Error: params.methodSpecificId is required to create didoc');
    }

    if (!params.chainId) {
      throw new Error('HID-SSI-SDK:: Error: params.chainId is required to create didoc');
    }

    if (!params.keyType) {
      throw new Error('HID-SSI-SDK:: Error: params.keyType is required to create didoc');
    }
    if (!(params.keyType in IKeyType)) {
      throw new Error('HID-SSI-SDK:: Error: params.keyType is invalid');
    }

    let didDoc;
    switch (params.keyType) {
      case IKeyType.Ed25519VerificationKey2020:
        throw new Error('HID-SSI-SDK:: Error: params.keyType is invalid use object.generate() method');
      case IKeyType.EcdsaSecp256k1RecoveryMethod2020: {
        const blockChainAccountId = this._getBlockChainAccountID(params.chainId, params.methodSpecificId);

        const didId = this._getId(params.methodSpecificId);
        const newDid = new DIDDocument('', blockChainAccountId, didId, params.keyType);
        didDoc = Utils.jsonToLdConvertor({ ...newDid });
        break;
      }

      case IKeyType.EcdsaSecp256k1VerificationKey2019: {
        if (!params.publicKey) {
          throw new Error(
            'HID-SSI-SDK:: Error: params.publicKey is required to create didoc for ' +
              IKeyType.EcdsaSecp256k1VerificationKey2019
          );
        }
        const multibasePublicKey = this._bufToMultibase(params.publicKey);
        const didId = this._getId(params.methodSpecificId);
        const newDid = new DIDDocument(multibasePublicKey, '', didId, params.keyType);
        didDoc = Utils.jsonToLdConvertor({ ...newDid });

        break;
      }
      default: {
        throw new Error('HID-SSI-SDK:: Error: invalid keytype');
      }
    }
    return didDoc;
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
    didDocument: object; // Ld document
    privateKeyMultibase: string;
    verificationMethodId: string;
  }): Promise<object> {
    // TODO:  this method MUST also accept signature/proof
    if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
    }
    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
    }

    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
    }

    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const { didDocument, privateKeyMultibase, verificationMethodId } = params;
    const didDocStringJson = Utils.ldToJsonConvertor(didDocument);
    const signature: string = await this._sign({ didDocString: JSON.stringify(didDocStringJson), privateKeyMultibase });
    const didDoc: Did = didDocStringJson as Did;
    return await this.didrpc.registerDID(didDoc, signature, verificationMethodId);
  }

  public async signAndRegisterByClientSpec(params: {
    didDocument: any;
    address: string;
    verificationMethodId: string;
    web3: Web3 | any;
    clientSpec: IClientSpec;
  }) {
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

    const { didDocument, signature } = await this.signByClientSpec({
      didDocument: params.didDocument,
      clientSpec: params.clientSpec,
      address: params.address,
      web3: params.web3,
    });

    return await this.registerByClientSpec({
      didDocument,
      signature,
      verificationMethodId: params.verificationMethodId,
      clientSpec: params.clientSpec,
    });
  }

  public async signByClientSpec(params: {
    didDocument: object;
    clientSpec: IClientSpec;
    address: string;
    web3: Web3 | any;
  }): Promise<{ didDocument: Did; signature: string }> {
    if (this['window'] === 'undefined') {
      throw new Error('HID-SSI-SDK:: Error:  Running in non browser mode');
    }
    if (!params.didDocument) {
      throw Error('HID-SSI-SDK:: Error: params.didDocument is required to sign');
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

    switch (params.clientSpec) {
      case IClientSpec['eth-personalSign']: {
        const didDocStringJson = Utils.ldToJsonConvertor(params.didDocument);

        const didDoc: Did = didDocStringJson as Did;

        const signature = await params.web3.eth.personal.sign(JSON.stringify(didDoc), params.address);
        return { didDocument: didDoc, signature };
      }
      case IClientSpec['cosmos-ADR036']: {
        throw Error('HID-SSI-SDK:: Error: Not Supported yet');
      }

      default:
        throw Error('HID-SSI-SDK:: Error: Invalid clientSpec');

        break;
    }
  }

  public async registerByClientSpec(params: {
    didDocument: object; // Ld document
    clientSpec: IClientSpec;
    verificationMethodId: string;
    signature: string;
  }) {
    if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
    }

    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error:  HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
    }
    if (!params.clientSpec) {
      throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to sign');
    }
    if (!(params.clientSpec in IClientSpec)) {
      throw new Error('HID-SSI-SDK:: Error: invalid clientSpec');
    }
    const didDocStringJson = Utils.ldToJsonConvertor(params.didDocument);

    const didDoc: Did = didDocStringJson as Did;
    return await this.didrpc.registerDID(didDoc, params.signature, params.verificationMethodId, params.clientSpec);
  }

  /**
   * Resolves a DID into DIDDocument from Hypersign blockchain - an onchain activity
   * @params
   *  - params.did                        : DID
   *  - params.ed25519verificationkey2020 : *Optional* True/False
   * @returns  {Promise<IDIDResolve>} didDocument and didDocumentMetadata
   */
  public async resolve(params: { did: string; ed25519verificationkey2020?: boolean }): Promise<IDIDResolve> {
    if (!params.did) {
      throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
    }

    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const result = await this.didrpc.resolveDID(params.did);
    if (params.ed25519verificationkey2020) {
      const didDoc: IDidDocument = result.didDocument as IDidDocument;
      const verificationMethods = didDoc.verificationMethod;
      verificationMethods.forEach((verificationMethod) => {
        if (verificationMethod.type === constant.DID.VERIFICATION_METHOD_TYPE) {
          const ed25519PublicKey = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
            publicKey: verificationMethod.publicKeyMultibase,
          });
          verificationMethod.publicKeyMultibase = ed25519PublicKey.publicKeyMultibase;
        }
      });
      didDoc.verificationMethod = verificationMethods;
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
   * @returns {Promise<object>} Result of the update operation
   */
  public async update(params: {
    didDocument: object;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object> {
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

    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const { didDocument, privateKeyMultibase, verificationMethodId, versionId } = params;
    const didDocStringJson = Utils.ldToJsonConvertor(didDocument);
    const signature = await this._sign({ didDocString: JSON.stringify(didDocStringJson), privateKeyMultibase });
    const didDoc: Did = didDocStringJson as Did;
    return await this.didrpc.updateDID(didDoc, signature, verificationMethodId, versionId);
  }

  public async updateByClientSpec(params: {
    didDocument: object;
    verificationMethodId: string;
    versionId: string;
    signature: string;
    clientSpec: IClientSpec;
  }): Promise<object> {
    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    if (!params.didDocument) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to update a did');
    }

    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
    }
    if (!params.versionId) {
      throw new Error('HID-SSI-SDK:: Error: params.versionId is required to update a did');
    }

    if (!params.signature) {
      throw new Error('HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: params.signature is required to update a did');
    }
    if (!params.clientSpec) {
      throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to update');
    }
    if (!(params.clientSpec in IClientSpec)) {
      throw new Error('HID-SSI-SDK:: Error: invalid clientSpec');
    }
    const { didDocument, verificationMethodId, versionId, signature } = params;
    return await this.didrpc.updateDID(
      didDocument as Did,
      signature,
      verificationMethodId,
      versionId,
      params.clientSpec
    );
  }

  public async deactivateByClientSpec(params: {
    didDocument: object;
    verificationMethodId: string;
    versionId: string;
    signature: string;
    clientSpec: IClientSpec;
  }): Promise<object> {
    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    if (!params.didDocument) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did');
    }

    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
    }
    if (!params.versionId) {
      throw new Error('HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
    }

    if (!params.signature) {
      throw new Error('HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: params.signature is required to deactivate a did');
    }
    if (!params.clientSpec) {
      throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to deactivate');
    }
    if (!(params.clientSpec in IClientSpec)) {
      throw new Error('HID-SSI-SDK:: Error: invalid clientSpec');
    }
    const { didDocument, verificationMethodId, versionId, signature } = params;
    const didDoc: Did = didDocument as Did;
    return await this.didrpc.deactivateDID(didDoc.id, signature, verificationMethodId, versionId, params.clientSpec);
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
    didDocument: object;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object> {
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

    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    const { didDocument, privateKeyMultibase, verificationMethodId, versionId } = params;
    const didDocStringJson = Utils.ldToJsonConvertor(didDocument);
    const signature = await this._sign({ didDocString: JSON.stringify(didDocStringJson), privateKeyMultibase });
    const didDoc: Did = didDocStringJson as Did;
    return await this.didrpc.deactivateDID(didDoc.id, signature, verificationMethodId, versionId);
  }

  /**
   * Signs a DIDDocument
   * @params
   *  - params.didDocument               :
   *  - params.privateKeyMultibase       :   private key in multibase format (base58 digitalbazar format)
   *  - params.challenge                 :   challenge is a random string generated by the client
   *  - params.did                       :   did of the user
   *  - params.domain                    :   domain is the domain of the DID Document that is being authenticated
   *  - params.verificationMethodId      :   verificationMethodId of the DID
   * @returns {Promise<object>} Signed DID Document
   */
  public async sign(params: {
    didDocument: object;
    privateKeyMultibase: string;
    challenge: string;
    domain: string;
    did: string;
    verificationMethodId: string;
  }): Promise<ISignedDIDDocument> {
    const { privateKeyMultibase, challenge, domain, did, didDocument, verificationMethodId } = params;
    let resolveddoc;
    if (!privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKey is required to sign a did');
    }
    if (!challenge) {
      throw new Error('HID-SSI-SDK:: Error: params.challenge is required to sign a did');
    }
    if (!domain) {
      throw new Error('HID-SSI-SDK:: Error: params.domain is required to sign a did');
    }

    try {
      // if did is prvovided then resolve the did doc from the blockchain or else use the did doc provided in the params object to sign the did doc with the proof
      if (did && this.didrpc) {
        resolveddoc = await this.didrpc.resolveDID(did);
      } else if (didDocument) {
        resolveddoc = {};
        resolveddoc.didDocument = didDocument;
      } else {
        throw new Error('HID-SSI-SDK:: Error: params.did or params.didDocument is required to sign a did');
      }
    } catch (error) {
      throw new Error(`HID-SSI-SDK:: Error: could not resolve did ${did}`);
    }

    const publicKeyId = verificationMethodId;
    const pubkey = resolveddoc.didDocument.verificationMethod.find((item) => item.id === publicKeyId);
    if (!pubkey) {
      throw new Error('HID-SSI-SDK:: Error: Incorrect verification method id');
    }
    const { publicKeyMultibase: publicKeyMultibase1 } = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
      publicKey: pubkey.publicKeyMultibase,
    });

    const keyPair = await Ed25519VerificationKey2020.from({
      id: publicKeyId,
      privateKeyMultibase,
      publicKeyMultibase: publicKeyMultibase1,
    });

    const suite = new Ed25519Signature2020({
      verificationMethod: publicKeyId,
      key: keyPair,
    });
    const didDocumentLd = Utils.jsonToLdConvertor(resolveddoc.didDocument);
    didDocumentLd['@context'].push(constant.VC.CREDENTAIL_SECURITY_SUITE);
    // didDocumentLd['@context'].push(constant.VC.CREDENTAIL_ECDSA_SECURITY_SUITE)

    const signedDidDocument = (await jsonSigs.sign(didDocumentLd, {
      suite,
      purpose: new AuthenticationProofPurpose({
        challenge,
        domain,
      }),
      documentLoader: customLoader,
      compactProof: constant.compactProof,
    })) as ISignedDIDDocument;

    return signedDidDocument;
  }

  /**
   * Verifies a signed DIDDocument
   * @params
   *  - params.didDocument :   Signed DID Document
   *  - params.privateKey  :   private key in multibase format (base58 digitalbazar format)
   *  - params.challenge   :   challenge is a random string generated by the client
   *  - params.did         :   did of the user
   *  - params.domain      :   domain is the domain of the DID Document that is being authenticated
   * @returns Promise<{ verificationResult }> Verification Result
   */
  public async verify(params: {
    didDocument: object;
    verificationMethodId: string;
    challenge: string;
    domain?: string;
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

    if (!challenge) {
      throw new Error('HID-SSI-SDK:: Error: params.challenge is required to verify a did');
    }

    const didDoc = didDocument as Did;
    const publicKeyId = verificationMethodId;
    const pubkey = didDoc.verificationMethod.find((item) => item.id === publicKeyId);

    if (!pubkey) {
      throw new Error(
        'HID-SSI-SDK:: Error: could not find verification method for verificationMethodId: ' +
          verificationMethodId +
          ' in did document'
      );
    }

    const { publicKeyMultibase: publicKeyMultibase1 } = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
      publicKey: pubkey.publicKeyMultibase,
    });

    const keyPair = await Ed25519VerificationKey2020.from({
      id: publicKeyId,

      publicKeyMultibase: publicKeyMultibase1,
    });

    const suite = new Ed25519Signature2020({
      key: keyPair,
    });
    suite.date = new Date(new Date().getTime() - 100000).toISOString();

    const controller: IController = {
      '@context': constant.DID.CONTROLLER_CONTEXT,
      id: publicKeyId,
      authentication: didDoc.authentication,
    };

    const purpose = new AuthenticationProofPurpose({
      controller,
      challenge,
      domain,
    });

    const result = await jsonSigs.verify(didDoc, {
      suite,
      purpose: purpose,
      documentLoader: customLoader,
      compactProof: constant.compactProof,
    });
    return result;
  }
}
