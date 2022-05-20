import * as constant from '../constants'
import { v4 as uuidv4 } from 'uuid';
import { DIDRpc, IDIDRpc } from './didRPC';
import Utils from '../utils'
const ed25519 = require('@stablelib/ed25519');
const {encode} = require('base58-universal');
const webCrypto = require('crypto').webcrypto;

import { Did, SignInfo, VerificationMethod, Service} from '../generated/ssi/did';


import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';

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

export interface IDID{
  generateKeys(seed:string): Promise<{ privateKeyMultibase: string, publicKeyMultibase: string }>;
  generate(publicKeyMultibase: string): string;
  register(didDocString: string , privateKeyMultibase: string, verificationMethodId: string): Promise<any>;
  resolve(did: string): Promise<any>;
  update(didDocString: string , privateKeyMultibase: string, verificationMethodId: string, versionId: string): Promise<any>;
  deactivate(didDocString: string , privateKeyMultibase: string, verificationMethodId: string, versionId: string): Promise<any>;
  
  // didAuth
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
    this.context = [constant.DID.DID_BASE_CONTEXT];
    this.id = this.getId();
    this.controller = [this.id];
    this.alsoKnownAs = [this.id];
    const verificationMethod: VerificationMethod = {
      id: this.id + '#' + publicKey,
      type: constant.DID.VERIFICATION_METHOD_TYPE, 
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

  private getId = () => `${constant.DID.SCHEME}:${uuidv4()}`;

}


export default class HypersignDID implements IDID{
  private didrpc: IDIDRpc;
  constructor() {
    this.didrpc = new DIDRpc();  
  }

   // Sign the doc
  private async sign(params: { didDocString: string, privateKeyMultibase: string} ): Promise<any> {
    
    const { privateKeyMultibase : privateKeyMultibaseConverted } = Utils.convertEd25519verificationkey2020toStableLibKeysInto({
        privKey: params.privateKeyMultibase
    });

    const { didDocString } = params; 
    // TODO:  do proper checck of paramaters
    const did: Did = JSON.parse(didDocString);
    const didBytes = (await Did.encode(did)).finish()
    const signed = ed25519.sign(privateKeyMultibaseConverted,  didBytes);
    return Buffer.from(signed).toString('base64');  
  }


  // Generate a new key pair of type Ed25519VerificationKey2020
  public async generateKeys(seed: string): Promise<{ privateKeyMultibase: string, publicKeyMultibase: string }> {
    
    let edKeyPair;
    if(seed){
       const seedBytes = new Uint8Array(Buffer.from(seed))
       edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes });
    } else {
        edKeyPair= await Ed25519VerificationKey2020.generate();
    }
    const exportedKp = await edKeyPair.export({publicKey: true, privateKey: true});
    return {
      privateKeyMultibase: exportedKp.privateKeyMultibase,  // 91byte //zbase58
      publicKeyMultibase: exportedKp.publicKeyMultibase //48 bytes
    }
  }

  /// Generate Did Document
  public generate(publicKeyMultibase:string): string{
    const {publicKeyMultibase: publicKeyMultibase1} = Utils.convertEd25519verificationkey2020toStableLibKeysInto({
      publicKey: publicKeyMultibase
    })
    const newDid = new DID(publicKeyMultibase1)
    return newDid.getDidString();
  }

  // Update DID Document
  public async update(didDocString: string , privateKeyMultibase: string, verificationMethodId: string, versionId: string): Promise<any> {
    if(!didDocString) throw new Error('didDocString is required to udpate DID')
    if(!privateKeyMultibase) throw new Error('privateKeyMultibase is required to udpate DID')
    const signature = await this.sign({didDocString, privateKeyMultibase })
    const didDoc: Did = JSON.parse(didDocString)
    return await this.didrpc.updateDID(didDoc, signature, verificationMethodId, versionId)
  }

  public async deactivate(didDocString: string , privateKeyMultibase: string, verificationMethodId: string, versionId: string): Promise<any> {
    const signature = await this.sign({didDocString, privateKeyMultibase })
    const didDoc: Did = JSON.parse(didDocString)
    return await this.didrpc.deactivateDID(didDoc, signature, verificationMethodId, versionId)
  }

  // TODO:  this method MUST also accept signature/proof 
  public async register(didDocString: string , privateKeyMultibase: string, verificationMethodId: string): Promise<any>{
    const signature = await this.sign({didDocString, privateKeyMultibase })
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

  /// Did Auth
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
