const jsonSigs =  require('jsonld-signatures')
const { Ed25519KeyPair } = require('crypto-ld');
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
const { Ed25519Signature2018 } = jsonSigs.suites;
const { documentLoader } = require('jsonld');
const { v4: uuidv4 } = require('uuid');
const { resolve, getControllerAndPublicKeyFromDid } = require('./utils');

const DID_SCHEME = 'did:hs';
const compactProof = false;


interface IPublicKey {
  '@context': string
  id: string
  type: string
  publicKeyBase58: string
}

interface IController{
  '@context': string
  id: string
  publicKey: Array<IPublicKey>
  authentication: Array<string>
}

interface IParams{
  doc: Object
  privateKeyBase58?: string
  publicKey: IPublicKey
  challenge: string
  domain: string
  controller: IController,
  did: string
}

// Generate new key pairs
const generateKeys = async (name) => {
  const kp = await Ed25519KeyPair.generate();
  const did = getId(name)
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

// Get challenge
export function getChallange(){
  return uuidv4()
}

const getId = (name) => `${DID_SCHEME}:${getChallange()}`;

// Ref: https://www.w3.org/TR/did-core/
// Also Check this: https://www.npmjs.com/package/did-veres-one
export async function getDidDocAndKeys(user: Object){
  let didDoc = {};
  if(!user['name']) throw new Error("Name is required")
  const kp = await generateKeys(user['name']);
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
    keys:{
      publicKey: kp['publicKey'],
      privateKeyBase58: kp['privateKeyBase58']
    },
    did: kp['did'],
    didDoc
  }
}

// verify the signature
export async function verify (params: IParams){
  const { doc, challenge, domain } = params
  // TODO: checks..."All params are mandatory"
  
  // TODO: Fetch did doc from ledger and compare it here.
  const did = doc['id']
  const {controller, publicKey, didDoc: didDocOnLedger} = await getControllerAndPublicKeyFromDid(did, 'authentication')
  
  const didDocWhichIsPassedTemp = Object.assign({}, doc)
  delete didDocWhichIsPassedTemp['proof'];
  delete didDocOnLedger['proof'];
  if(JSON.stringify(didDocWhichIsPassedTemp) !== JSON.stringify(didDocOnLedger)) throw new Error("Invalid didDoc for did = " + did)

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
    compactProof
  })

  return verified;
}

// Sign the doc
export async function sign (params: IParams) {
  const { did, privateKeyBase58, challenge, domain } = params
  
  const doc = await resolve(did);
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
    compactProof
  });
  return signed;
}

