import * as constant from './constants'
import Utils from './utils'
import jsonSigs from 'jsonld-signatures'
import { Ed25519KeyPair } from 'crypto-ld'
import { documentLoader } from 'jsonld'
import { v4 as uuidv4 } from 'uuid';
import blake from 'blakejs';
import axios from "axios";

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
  privateKeyBase58?: string
  publicKey: IPublicKey
  challenge: string
  domain: string
  controller: IController,
  did: string
}


export default class did {
  didScheme: string;
  utils: Utils;
  didUrl: string;
  constructor(options = { nodeUrl: "", didScheme: "" }) {
    this.utils = new Utils({ nodeUrl: options.nodeUrl });
    this.didScheme = options.didScheme || constant.DID_SCHEME;
    this.didUrl = this.utils.nodeurl + constant.HYPERSIGN_NETWORK_DID_EP;
  }

  getChallange() {
    return uuidv4()
  }

  private getId = () => `${this.didScheme}:${this.getChallange()}`;

  async generateKeys() {
    const kp = await Ed25519KeyPair.generate();
    const did = this.getId()
    kp.id = did + '#' + kp.fingerprint();
    const eKp = await kp.export();
    const publicKey = {
      '@context': jsonSigs.SECURITY_CONTEXT_URL,
      ...eKp
    }
    delete publicKey['privateKeyBase58']
    return {
      did,
      privateKeyBase58: eKp.privateKeyBase58,
      publicKey
    }
  }

  // TODO: this is obsolete. We can remove this later.
  // use getDid method instead
  async getDidDocAndKeys(user: Object) {
    let didDoc = {};
    // if(!user['name']) throw new Error("Name is required")
    const kp = await this.generateKeys();
    didDoc['@context'] = ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/v1", "https://schema.org"]
    didDoc['@type'] = "https://schema.org/Person"

    // DID Subject
    didDoc['id'] = kp.did;

    Object.keys(user).forEach(k => {
      didDoc[k] = user[k]
    })

    // Verification Method
    didDoc['publicKey'] = [kp.publicKey]

    // Verification Relationship
    didDoc['authentication'] = [kp.publicKey.id]
    didDoc['assertionMethod'] = [kp.publicKey.id]
    didDoc['keyAgreement'] = [kp.publicKey.id]
    didDoc['capabilityInvocation'] = [kp.publicKey.id]

    didDoc['created'] = new Date()
    didDoc['updated'] = new Date()

    return {
      keys: {
        publicKey: kp['publicKey'],
        privateKeyBase58: kp['privateKeyBase58']
      },
      did: kp['did'],
      didDoc
    }

  }

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

  async getDid(options = { user: {}, publicKey: ""}){
    let didDoc = {};
    // if(options.user == {})  
    // if(!user['name']) throw new Error("Name is required")
    let kp;
    
    if(!options.publicKey || options.publicKey == ""){
      kp = await this.generateKeys();
      
    }else{
      kp = this.formKeyPairFromPublicKey(options.publicKey);
    }
    
    didDoc['@context'] = ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/v1", "https://schema.org"]
    didDoc['@type'] = "https://schema.org/Person"

    // DID Subject
    didDoc['id'] = kp.did;

    if(options.user != {}){
      Object.keys(options.user).forEach(k => {
        didDoc[k] = options.user[k]
      })
    }
    // Verification Method
    didDoc['publicKey'] = [kp.publicKey]

    // Verification Relationship
    didDoc['authentication'] = [kp.publicKey.id]
    didDoc['assertionMethod'] = [kp.publicKey.id]
    didDoc['keyAgreement'] = [kp.publicKey.id]
    didDoc['capabilityInvocation'] = [kp.publicKey.id]

    didDoc['created'] = new Date()
    didDoc['updated'] = new Date()

    return {
      keys: {
        publicKey: kp['publicKey'],
        privateKeyBase58: kp['privateKeyBase58']
      },
      did: kp['did'],
      didDoc
    }
  }

  // TODO
  async register(didDoc: object){
    try{
      console.log(this.didUrl);
      const response = await axios.post(this.didUrl, didDoc);
      return response.data;
    }catch(e){
      const { response } = e;
      return response.data;
    }
  }

  // TODO
  async resolve(did: string): Promise<any>{
    try{
      const get_didUrl = this.didUrl + did;
      console.log(get_didUrl);
      const response = await axios.get(get_didUrl);
      return response.data;
    }catch(e){
      const { response } = e;
      return response.data;
    }
  }

  // verify the signature
  async verify(params: IParams) {
    const { doc, challenge, domain } = params
    // TODO: checks..."All params are mandatory"

    // TODO: Fetch did doc from ledger and compare it here.
    const did = doc['id']
    const { controller, publicKey, didDoc: didDocOnLedger } = await this.utils.getControllerAndPublicKeyFromDid(did, 'authentication')

    const didDocWhichIsPassedTemp = Object.assign({}, doc)
    delete didDocWhichIsPassedTemp['proof'];
    delete didDocOnLedger['proof'];
    if (JSON.stringify(didDocWhichIsPassedTemp) !== JSON.stringify(didDocOnLedger)) throw new Error("Invalid didDoc for did = " + did)

    const purpose = new AuthenticationProofPurpose({
      controller,
      domain,
      challenge
    })

    const suite = new Ed25519Signature2018({
      key: new Ed25519KeyPair(publicKey)
    })

    const verified = await jsonSigs.verify(doc, {
      suite,
      purpose,
      documentLoader,
      compactProof: constant.compactProof
    })

    return verified;
  }

  // Sign the doc
  async sign(params: IParams) {
    const { did, privateKeyBase58, challenge, domain } = params

    const doc = await this.utils.resolve(did);
    const publicKeyId = doc['authentication'][0]; // TODO: bad idea -  can not hardcode it.
    const publicKey = doc['publicKey'].find(x => x.id == publicKeyId)

    const signed = await jsonSigs.sign(doc, {
      suite: new Ed25519Signature2018({
        verificationMethod: publicKeyId,
        key: new Ed25519KeyPair({ privateKeyBase58, ...publicKey })
      }),
      purpose: new AuthenticationProofPurpose({
        challenge,
        domain
      }),
      documentLoader,
      compactProof: constant.compactProof
    });
    return signed;
  }

}