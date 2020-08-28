const jsonSigs =  require('jsonld-signatures')
const { Ed25519KeyPair } = require('crypto-ld');
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
const { Ed25519Signature2018 } = jsonSigs.suites;
const { documentLoader } = require('jsonld');
const { v4: uuidv4 } = require('uuid');

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
  controller: IController
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

const getId = (name) => `${DID_SCHEME}:${name}`;

// Ref: https://www.w3.org/TR/did-core/
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
  const publicKey  = doc['publicKey']

  const controller = {
    '@context' : doc['@context'],
    id: doc['id'],
    publicKey,
    authentication: doc['authentication']
  }

  const verified = await jsonSigs.verify(doc, {
    suite: new Ed25519Signature2018({
      key: new Ed25519KeyPair(publicKey[0])
    }),
    purpose: new AuthenticationProofPurpose({
      controller,
      challenge,
      domain
    }),
    documentLoader,
    compactProof
  })
  return verified;
}

// Sign the doc
export async function sign (params: IParams) {
  const { doc, privateKeyBase58, publicKey, challenge, domain } = params
  // TODO: checks..."All params are mandatory"
  const signed = await jsonSigs.sign(doc, {
    suite: new Ed25519Signature2018({
      verificationMethod: publicKey.id,
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

