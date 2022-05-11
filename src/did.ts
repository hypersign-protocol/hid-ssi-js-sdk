import * as constant from './constants'
import jsonSigs from 'jsonld-signatures'
import { Ed25519KeyPair } from 'crypto-ld'
import { documentLoader } from 'jsonld'
import { v4 as uuidv4 } from 'uuid';
import blake from 'blakejs';
import axios from "axios";
import { DIDRpc, IDIDRpc } from './rpc/didRPC'

const ed25519 = require('@stablelib/ed25519');
const {encode} = require('base58-universal');
const webCrypto = require('crypto').webcrypto
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';

const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
const { Ed25519Signature2018 } = jsonSigs.suites;

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
  getDid(): Object;
  register(didDoc: object, signatures: Array<object>): Promise<any>;
  resolve(did: string): Promise<any>;
  
  sign(params: IParams): Promise<any>;
  verify(params: IParams): Promise<any>;
}

export default class did implements IDID{
  private didrpc: IDIDRpc;
  constructor() {
    
    this.didrpc = new DIDRpc();    
  }

  // TODO: It should conforms did:hid method
  private getChallange() {
    return uuidv4()
  }

  private getId = () => `${constant.DID_SCHEME}:${this.getChallange()}`;

  private formKeyPairFromPublicKey(publicKeyBase58) {
    if(!publicKeyBase58) throw new Error("publicKeyBase58 can not be empty")
    // TODO:  hardcoing temporarly
    const protocol = "Ed25519VerificationKey2018"
    const did = this.getId()
    // TODO coule be a security flaw. we need to check later.
    const id = did + '#' + blake.blake2sHex(publicKeyBase58 + protocol)
    return {
      publicKey: {
        "@context": jsonSigs.SECURITY_CONTEXT_URL,
        id,
        "type": protocol,
        publicKeyBase58
      },
      privateKeyBase58: null,
      did
    }
  }

  private generateKeys() {
    const did = this.getId()

    const seed = new Uint8Array(32)
    webCrypto.getRandomValues(seed)
    const generatedKeyPair = ed25519.generateKeyPairFromSeed(seed);
    
    const pubKey = "z" + encode(Buffer.from(generatedKeyPair["publicKey"]))
    const privKey = generatedKeyPair["secretKey"]

    const keyObject = {
      id: did + '#' + pubKey,
      type: "Ed25519VerificationKey2020",
      controller: did,
      publicKeyMultibase: pubKey,
    }

    return {
      did,
      privateKeyMultibase: privKey,
      keyObject
    }
  }

  /// Public methods
  public getDid(): Object{
    let didDoc = {};
    // if(options.user == {})  
    // if(!user['name']) throw new Error("Name is required")
    let kp = this.generateKeys();

    
    // TODO: Need to make this dynamic. Fix this.
    didDoc['context'] = ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/v1", "https://schema.org"]

    // DID Subject
    didDoc['id'] = kp.did;
    didDoc['controller'] = [didDoc['id']];

    // Verification Method
    didDoc['verificationMethod'] = [kp.keyObject]

    // Verification Relationship
    didDoc['authentication'] = [kp.keyObject.id]
    didDoc['assertionMethod'] = [kp.keyObject.id]
    didDoc['keyAgreement'] = [kp.keyObject.id]
    didDoc['capabilityInvocation'] = [kp.keyObject.id]

    return {
      keys: {
        publicKey: kp.keyObject.publicKeyMultibase,
        privateKeyMultibase: kp.privateKeyMultibase
      },
      did: kp.did,
      didDoc
    }
  }

  // TODO:  this method MUST also accept signature/proof 
  public async register(didDoc: object, signatures: Array<object>): Promise<any>{
    if(!didDoc){
      throw new Error('')
    }
    const did = didDoc['id']
    return await this.didrpc.registerDID({
      didDocString:didDoc,
      signatures
    })
  }

  public async resolve(did: string): Promise<any>{
    return await this.didrpc.resolveDID(did)
  }

  // Sign the doc
  public sign(params: IParams) {
    const { doc, privateKey } = params
    const signed = ed25519.sign(privateKey, doc)
    return signed;
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