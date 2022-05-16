import * as constant from './constants'
import jsonSigs from 'jsonld-signatures'
import { Ed25519KeyPair } from 'crypto-ld'
import { documentLoader } from 'jsonld'
import { v4 as uuidv4 } from 'uuid';
import blake from 'blakejs';
import axios from "axios";
import { DIDRpc, IDIDRpc } from './rpc/didRPC'
import { getByteArray } from './utils';

const ed25519 = require('@stablelib/ed25519');
const {encode} = require('base58-universal');
const webCrypto = require('crypto').webcrypto
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';

const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
const { Ed25519Signature2018 } = jsonSigs.suites;

import { Did, SignInfo, VerificationMethod, Service} from './generated/ssi/did';


interface IPublicKey {
  '@context': string
  id: string
  type: string
  publicKeyBase58: string
}

interface IController {
  '@context': string
  id: string
  publicKey: Array<IPublicKey>
  authentication: Array<string>
}

interface IParams {
  doc: Object
  privateKey?: string
  publicKey: IPublicKey
  challenge: string
  domain: string
  controller: IController,
  did: string
}

interface IDIDOptions{
  user: object;
  publicKey?: string
}

export interface IDID{
  generateDID(publicKeyMultibase: string): string;
  register(didDocString: string , signature: string, verificationMethodId: string): Promise<any>;
  resolve(did: string): Promise<any>;
  
  sign(params: { didDocString: string, privateKeyMultibase: Uint8Array} ): Promise<any>;
  signDid(params: IParams): Promise<any>;
  verify(params: IParams): Promise<any>;
}


class DID implements Did{
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
  constructor(publicKey: string){
    // TODO:  need to remove this hardcoding
    this.context = ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/v1", "https://schema.org"];

    this.id = this.getId();
    this.controller = [this.id];
    this.alsoKnownAs = [this.id];

    const verificationMethod: VerificationMethod = {
      id: this.id + '#' + publicKey,
      type: "Ed25519VerificationKey2020", // TODO: need to remove this hardcoding
      controller: this.id,
      publicKeyMultibase: publicKey,
    }

    this.verificationMethod = [verificationMethod];
    this.authentication = [verificationMethod.id];
    this.assertionMethod = [verificationMethod.id];
    this.keyAgreement = [verificationMethod.id];
    this.capabilityInvocation = [verificationMethod.id];
    this.capabilityDelegation = [verificationMethod.id];
    // TODO: we should take services object in consntructor
    this.service = [];
  }

  public getDidString(): string{
    return JSON.stringify(this);
  }
   // TODO: It should conforms did:hid method
  private getChallange() {
    return uuidv4()
  }

  private getId = () => `${constant.DID_SCHEME}:${this.getChallange()}`;

}


export default class did implements IDID{
  private didrpc: IDIDRpc;
  constructor() {
    
    this.didrpc = new DIDRpc();  
  }

 

  // private formKeyPairFromPublicKey(publicKeyBase58) {
  //   if(!publicKeyBase58) throw new Error("publicKeyBase58 can not be empty")
  //   // TODO:  hardcoing temporarly
  //   const protocol = "Ed25519VerificationKey2018"
  //   const did = this.getId()
  //   // TODO coule be a security flaw. we need to check later.
  //   const id = did + '#' + blake.blake2sHex(publicKeyBase58 + protocol)
  //   return {
  //     publicKey: {
  //       "@context": jsonSigs.SECURITY_CONTEXT_URL,
  //       id,
  //       "type": protocol,
  //       publicKeyBase58
  //     },
  //     privateKeyBase58: null,
  //     did
  //   }
  // }


  public generateKeys(cryptoObj?): { privateKeyMultibase:Uint8Array, publicKeyMultibase: string } {
    const seed = new Uint8Array(32)
    // If the SDK is run from browser, use window.crypto object
    if (cryptoObj) {
      cryptoObj.getRandomValues(seed)
    } else {
      webCrypto.getRandomValues(seed)
    }
    
    const generatedKeyPair = ed25519.generateKeyPairFromSeed(seed);
    
    const pubKey = "z" + encode(Buffer.from(generatedKeyPair["publicKey"]))
    const privKey = generatedKeyPair["secretKey"]

    return {
      privateKeyMultibase: privKey,
      publicKeyMultibase: pubKey
    }
  }

 
  /// Public methods
  public generateDID(publicKeyMultibase:string): string{
    const newDid = new DID(publicKeyMultibase)
    return newDid.getDidString();
  }

  // TODO:  this method MUST also accept signature/proof 
  public async register(didDocString: string , signature: string, verificationMethodId: string): Promise<any>{
    const didDoc: Did = JSON.parse(didDocString);
    return await this.didrpc.registerDID(
      didDoc,
      signature,
      verificationMethodId
    )
  }

  public async resolve(did: string): Promise<any>{
    return await this.didrpc.resolveDID(did)
  }

  // Sign the doc
  public async sign(params: { didDocString: string, privateKeyMultibase: Uint8Array} ): Promise<any> {
    const { didDocString, privateKeyMultibase } = params; 
    // TODO:  do proper checck of paramaters
    const did: Did = JSON.parse(didDocString);
    // TODO: Temporary addition: Until a fix for data encoding is found, we are going use a temporary API call
    // to hid-node which will return the Unmarshalled Output for an input String
    // Refer PR: https://github.com/hypersign-protocol/hid-node/pull/142
    const didBytes = await getByteArray(did, './proto/did.proto', 'hypersignprotocol.hidnode.ssi.Did')
    const signed = ed25519.sign(privateKeyMultibase,  didBytes);
    return Buffer.from(signed).toString('base64');  
  }

  public signDid(params: IParams): Promise<any>{
    throw new Error('Method not impplemented')
  }

  // verify the signature
  public async verify(params: IParams) {
    throw new Error("Method not implemented");

    const { doc, challenge, domain } = params
    //// TODO: checks..."All params are mandatory"

    //// TODO: Fetch did doc from ledger and compare it here.
    // const did = doc['id']
    // const { controller, publicKey, didDoc: didDocOnLedger } = await this.utils.getControllerAndPublicKeyFromDid(did, 'authentication')

    // const didDocWhichIsPassedTemp = Object.assign({}, doc)
    // delete didDocWhichIsPassedTemp['proof'];
    // delete didDocOnLedger['proof'];
    // if (JSON.stringify(didDocWhichIsPassedTemp) !== JSON.stringify(didDocOnLedger)) throw new Error("Invalid didDoc for did = " + did)

    // const purpose = new AuthenticationProofPurpose({
    //   controller,
    //   domain,
    //   challenge
    // })

    // const suite = new Ed25519Signature2018({
    //   key: new Ed25519KeyPair(publicKey)
    // })

    // const verified = await jsonSigs.verify(doc, {
    //   suite,
    //   purpose,
    //   documentLoader,
    //   compactProof: constant.compactProof
    // })

    // return verified;
  }
}