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
import { Did, VerificationMethod, Service, SignInfo } from '../../libs/generated/ssi/did';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import Web3 from 'web3';
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
  IVerificationRelationships,
} from './IDID';

import { ClientSpec } from '../../libs/generated/ssi/clientSpec';
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
  constructor(
    publicKey: string,
    blockchainAccountId: string,
    id: string,
    keyType: IKeyType,
    verificationRelationships?: IVerificationRelationships[]
  ) {
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
        this.authentication = [];
        this.assertionMethod = [];
        this.keyAgreement = [];
        this.capabilityInvocation = [];
        this.capabilityDelegation = [];
        verificationRelationships?.forEach((value) => {
          this[value] = [verificationMethod.id];
        });

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
        this.authentication = [];
        this.assertionMethod = [];
        this.keyAgreement = [];
        this.capabilityInvocation = [];
        this.capabilityDelegation = [];
        verificationRelationships?.forEach((value) => {
          this[value] = [verificationMethod.id];
        });
        // TODO: we should take services object in consntructor
        this.service = [];

        break;
      }
      case IKeyType.EcdsaSecp256k1VerificationKey2019: {
        this.context = [constant['DID_' + keyType].DID_BASE_CONTEXT];
        this.id = id;
        this.controller = [this.id];
        this.alsoKnownAs = [];
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
          this[value] = [verificationMethod.id];
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
    verificationRelationships: IVerificationRelationships[]
  ): IVerificationRelationships[] {
    let vR: IVerificationRelationships[] = [
      IVerificationRelationships.assertionMethod,
      IVerificationRelationships.authentication,
      IVerificationRelationships.capabilityDelegation,
      IVerificationRelationships.capabilityInvocation,
      IVerificationRelationships.keyAgreement,
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
    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error:  HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    await this.didrpc.init();
  }

  /**
   * Generate a new key pair of type Ed25519VerificationKey2020
   * @params params.seed - Optional, Seed to generate the key pair, if not passed, random seed will be taken
   * @params params.controller - Optional, controller field
   * @returns {Promise<object>} The key pair of type Ed25519
   */
  public async generateKeys(params: {
    seed?: string;
    controller?: string;
  }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }> {
    let edKeyPair;
    if (params && params.seed && params.controller) {
      const seedBytes = new Uint8Array(Buffer.from(params.seed));
      edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes, id: params.controller });
    } else if (params && params.controller) {
      edKeyPair = await Ed25519VerificationKey2020.generate({ id: params.controller });
    } else if (params && params.seed) {
      const seedBytes = new Uint8Array(Buffer.from(params.seed));
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
    verificationRelationships?: IVerificationRelationships[];
  }): Promise<object> {
    let verificationRelationships: IVerificationRelationships[] = [];
    if (params.verificationRelationships && params.verificationRelationships.length > 0) {
      verificationRelationships = this._filterVerificationRelationships(params.verificationRelationships);
    } else {
      verificationRelationships = this._filterVerificationRelationships([]);
    }
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

    const newDid = new DIDDocument(
      publicKeyMultibase1,
      '',
      didId,
      IKeyType.Ed25519VerificationKey2020,
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
    const signInfos: Array<SignInfo> = [
      {
        signature,
        verification_method_id: verificationMethodId,
        clientSpec: undefined,
      },
    ];
    return await this.didrpc.registerDID(didDoc, signInfos);
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
    const signInfos: Array<SignInfo> = [
      {
        signature,
        verification_method_id: verificationMethodId,
        clientSpec: undefined,
      },
    ];
    return await this.didrpc.updateDID(didDoc, signInfos, versionId);
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
    const signInfos: Array<SignInfo> = [
      {
        signature,
        verification_method_id: verificationMethodId,
        clientSpec: undefined,
      },
    ];
    return await this.didrpc.deactivateDID(didDoc.id, signInfos, versionId);
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
  private _isValidMultibaseBase58String = (str) => {
    const multibaseBase58Regex = /^z([1-9A-HJ-NP-Za-km-z]+)$/;
    return multibaseBase58Regex.test(str);
  };
  // using in API
  public async createByClientSpec(params: {
    methodSpecificId: string;
    publicKey?: string;
    address: string;
    chainId: string;
    clientSpec: IClientSpec;
    verificationRelationships?: IVerificationRelationships[];
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
    let verificationRelationships: IVerificationRelationships[] = [];
    if (params.verificationRelationships && params.verificationRelationships.length > 0) {
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
          IKeyType.EcdsaSecp256k1RecoveryMethod2020,
          verificationRelationships
        );
        didDoc = Utils.jsonToLdConvertor({ ...newDid });
        delete didDoc.service;
        break;
      }
      case IClientSpec['cosmos-ADR036']: {
        if (!params.publicKey) {
          throw new Error(
            'HID-SSI-SDK:: Error: params.publicKey is required to create didoc for ' +
              IKeyType.EcdsaSecp256k1VerificationKey2019
          );
        }
        if (!this._isValidMultibaseBase58String(params.publicKey)) {
          throw new Error(
            'HID-SSI-SDK:: Error: params.publicKey mustbe multibase encoded base58 string for ' +
              IKeyType.EcdsaSecp256k1VerificationKey2019
          );
        }

        const multibasePublicKey = params.publicKey;
        const didId = this._getId(params.methodSpecificId);
        const blockChainAccountId = 'cosmos:' + params.chainId + ':' + params.address;
        const newDid = new DIDDocument(
          multibasePublicKey,
          blockChainAccountId,
          didId,
          IKeyType.EcdsaSecp256k1VerificationKey2019
        );
        didDoc = Utils.jsonToLdConvertor({ ...newDid });

        break;
      }
      default: {
        throw new Error('HID-SSI-SDK:: Error: params.clientSpec is invalid use object.generate() method');
      }
    }
    return didDoc;
  }

  // using in API
  public async registerByClientSpec(params: {
    didDocument: object; // Ld document
    signInfos: SignInfo[];
  }) {
    if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
    }

    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error:  HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
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
      if (!params.signInfos[i].verification_method_id) {
        throw new Error(
          `HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to register a did`
        );
      }
      if (!params.signInfos[i].clientSpec) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].clientSpec is required to register a did`);
      }

      if (params.signInfos[i].clientSpec?.type === IClientSpec['cosmos-ADR036']) {
        if (
          params.signInfos[i].clientSpec?.adr036SignerAddress === '' ||
          params.signInfos[i].clientSpec?.adr036SignerAddress === undefined
        ) {
          throw new Error(
            `HID-SSI-SDK:: Error: params.signInfos[${i}].adr036SignerAddress is required to register a did, when clientSpec type is${params.signInfos[i].clientSpec?.type} `
          );
        }
      }

      if (!params.signInfos[i].signature) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to register a did`);
      }
    }
    const didDocStringJson = Utils.ldToJsonConvertor(params.didDocument);

    const didDoc: Did = didDocStringJson as Did;
    return await this.didrpc.registerDID(didDoc, params.signInfos);
  }

  // using in API
  public async updateByClientSpec(params: {
    didDocument: object;
    versionId: string;
    signInfos: SignInfo[];
  }): Promise<object> {
    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
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
      if (!params.signInfos[i].verification_method_id) {
        throw new Error(
          `HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to register a did`
        );
      }
      if (!params.signInfos[i].clientSpec) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].clientSpec is required to register a did`);
      }

      if (params.signInfos[i].clientSpec?.type === IClientSpec['cosmos-ADR036']) {
        if (
          params.signInfos[i].clientSpec?.adr036SignerAddress === '' ||
          params.signInfos[i].clientSpec?.adr036SignerAddress === undefined
        ) {
          throw new Error(
            `HID-SSI-SDK:: Error: params.signInfos[${i}].adr036SignerAddress is required to register a did, when clientSpec type is${params.signInfos[i].clientSpec?.type} `
          );
        }
      }

      if (!params.signInfos[i].signature) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to register a did`);
      }
    }
    if (!params.versionId) {
      throw new Error('HID-SSI-SDK:: Error: params.versionId is required to update a did');
    }

    const { didDocument, signInfos, versionId } = params;
    return await this.didrpc.updateDID(didDocument as Did, signInfos, versionId);
  }

  // using in API
  public async deactivateByClientSpec(params: {
    didDocument: object;
    signInfos: SignInfo[];
    versionId: string;
  }): Promise<object> {
    if (!this.didrpc) {
      throw new Error(
        'HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignDID class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    if (!params.didDocument) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did');
    }
    if (!params.signInfos) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to register a did');
    }
    if (params.signInfos.length < 1) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
    }

    for (const i in params.signInfos) {
      if (!params.signInfos[i].verification_method_id) {
        throw new Error(
          `HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to register a did`
        );
      }
      if (!params.signInfos[i].clientSpec) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].clientSpec is required to register a did`);
      }

      if (params.signInfos[i].clientSpec?.type === IClientSpec['cosmos-ADR036']) {
        if (
          params.signInfos[i].clientSpec?.adr036SignerAddress === '' ||
          params.signInfos[i].clientSpec?.adr036SignerAddress === undefined
        ) {
          throw new Error(
            `HID-SSI-SDK:: Error: params.signInfos[${i}].adr036SignerAddress is required to register a did, when clientSpec type is${params.signInfos[i].clientSpec?.type} `
          );
        }
      }

      if (!params.signInfos[i].signature) {
        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to register a did`);
      }
    }

    if (!params.versionId) {
      throw new Error('HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
    }

    // if (!params.clientSpec) {
    //   throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is required to deactivate');
    // }
    // if (!(params.clientSpec in IClientSpec)) {
    //   throw new Error('HID-SSI-SDK:: Error: invalid clientSpec');
    // }
    const { didDocument, signInfos, versionId } = params;
    const didDoc: Did = didDocument as Did;
    return await this.didrpc.deactivateDID(didDoc.id, signInfos, versionId);
  }

  public async signAndRegisterByClientSpec(params: {
    didDocument: any;
    address: string;
    verificationMethodId: string;
    web3: Web3 | any;
    clientSpec: IClientSpec;
    chainId?: string; // only for [cosmos-ADR036]
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
      chainId: params.chainId,
    });

    const signInfos: Array<SignInfo> = [
      {
        signature,
        verification_method_id: params.verificationMethodId,
        clientSpec: {
          type: params.clientSpec,
          adr036SignerAddress: params.clientSpec === IClientSpec['cosmos-ADR036'] ? params.address : '',
        },
      },
    ];
    return await this.registerByClientSpec({
      didDocument,
      signInfos,
      // only for [cosmos-ADR036]
    });
  }

  public async signByClientSpec(params: {
    didDocument: object;
    clientSpec: IClientSpec;
    address: string;
    web3: Web3 | any;
    chainId?: string; // only for [cosmos-ADR036]
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

        const signature = await params.web3.eth.personal.sign(
          JSON.stringify(didDoc, (key, value) => {
            if (value === '' || (Array.isArray(value) && value.length === 0)) {
              return undefined;
            }
            return value;
          }),
          params.address
        );
        return { didDocument: didDoc, signature };
      }
      case IClientSpec['cosmos-ADR036']: {
        if (!params.chainId) {
          throw new Error(
            'HID-SSI-SDK:: Error:  params.chainId is required to sign for clientSpec ' +
              IClientSpec['cosmos-ADR036'] +
              ' and keyType ' +
              IKeyType.EcdsaSecp256k1VerificationKey2019
          );
        }
        const didDocStringJson = Utils.ldToJsonConvertor(params.didDocument);
        const didDoc: Did = didDocStringJson as Did;
        const didDocBytes = (await Did.encode(didDoc)).finish();
        const signRespObj = await params.web3.requestMethod('signArbitrary', [
          params.chainId,
          params.address,
          didDocBytes,
        ]);
        return { didDocument: didDoc, signature: signRespObj['signature'] };
      }

      default:
        throw Error('HID-SSI-SDK:: Error: Invalid clientSpec');

        break;
    }
  }
}
