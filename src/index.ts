const jsonSigs =  require('jsonld-signatures')
const { Ed25519KeyPair } = require('crypto-ld');
const { AuthenticationProofPurpose } = jsonSigs.purposes;
const { Ed25519Signature2018 } = jsonSigs.suites;
const { documentLoader } = require('jsonld');
const { v4: uuidv4 } = require('uuid');

const DID_SCHEME = 'did:hsauth';
const compactProof = false;

interface IUser{
  name: string
  email: string
  telephone: string
  birthdate: string
  jobTitle: string 
}

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
  doc: {}
  privateKeyBase58?: string
  publicKey: IPublicKey
  challenge: string
  domain: string
  controller: IController
}

// Generate new key pairs
const generateKeys = async (name) => {
  const kp = await Ed25519KeyPair.generate();
  kp.id = `${DID_SCHEME}:${name}#` + kp.fingerprint();
  const eKp = await kp.export();
  const publicKey = {
    '@context': jsonSigs.SECURITY_CONTEXT_URL,
    ...eKp
  }
  delete publicKey['privateKeyBase58']
  return {
    privateKeyBase58: eKp.privateKeyBase58,
    publicKey
  }
}

export function getChallange(){
  return uuidv4()
}

// Get challenge
export function getUserDoc (user: IUser){
  user["@context"] = ["https://schema.org", "https://w3id.org/security/v1"];
  user["@type"] = "https://schema.org/Person";
  return user
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

// verify the signature
export async function verify (params: IParams){
  const { doc, publicKey, challenge, domain, controller } = params
  // TODO: checks..."All params are mandatory"
  const verified = await jsonSigs.verify(doc, {
    suite: new Ed25519Signature2018({
      key: new Ed25519KeyPair(publicKey)
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

// Generate credential [keys  and controller object]
export async function getCredential (name: string){
  if(!name) throw Error('Name must be passed.')
  const keys = await generateKeys(name);
  const { publicKey } = keys;
  const controller: IController = {
    '@context': jsonSigs.SECURITY_CONTEXT_URL,
    id: `${DID_SCHEME}:${name}`,
    publicKey: [ publicKey ],
    authentication: [ publicKey.id ]
  }
  const credential = {
    keys,
    controller
  }
  return credential;
}

