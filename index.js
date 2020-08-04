const jsonSigs =  require('jsonld-signatures')
const { Ed25519KeyPair } = require('crypto-ld');
const { AuthenticationProofPurpose } = jsonSigs.purposes;
const { Ed25519Signature2018 } = jsonSigs.suites;
const { personDoc } = require('./sampleDoc')
const { documentLoader } = require('jsonld');

const DID_SCHEME = 'did:hsauth:id#';
const compactProof = false;

// Generate new key pairs
const generateKeys = async () => {
  const kp = await Ed25519KeyPair.generate();
  kp.id = DID_SCHEME + kp.fingerprint();
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

// Sign the doc
const do_Sign = async (doc,  privateKeyBase58, publicKey) => {
  const signed = await jsonSigs.sign(doc, {
    suite: new Ed25519Signature2018({
      verificationMethod: publicKey.id,
      key: new Ed25519KeyPair({ privateKeyBase58, ...publicKey })
    }),
    purpose: new AuthenticationProofPurpose({
      challenge: 'ABC',
      domain: 'example.com'
    }),
    documentLoader,
    compactProof
  });
  return signed;
}

// verify the signature
const do_verify = async (signedDoc, publicKey, controller) => {
  const verified = await jsonSigs.verify(signedDoc, {
    suite: new Ed25519Signature2018({
      key: new Ed25519KeyPair(publicKey)
    }),
    purpose: new AuthenticationProofPurpose({
      controller,
      challenge: 'ABC',
      domain: 'example.com'
    }),
    documentLoader,
    compactProof
  })
  return verified;
}

async function testRun(doc){
  try{
    
    console.log('====================Generate Keys=======================')
    const keys = await generateKeys();
    const { privateKeyBase58, publicKey } = keys;
    console.log(keys)
    console.log('====================Generate Keys=======================')

    console.log('====================Controller==========================')
    // specify the public key controller object
    const controller = {
      '@context': jsonSigs.SECURITY_CONTEXT_URL,
      id: 'did:hsauth:vishwas',
      publicKey: [ publicKey ],
      authentication: [ publicKey.id ], // this authorizes this key to be used for authenticating,
    };
    console.log(controller)
    console.log('====================Controller==========================')

    console.log('====================Signing=============================')
    const signedDoc = await do_Sign(doc, privateKeyBase58, publicKey)
    console.log(JSON.stringify(signedDoc))
    console.log('====================Signing=============================')
  
    console.log('====================Verifing=============================')
    const verified = await do_verify(signedDoc, publicKey, controller)
    console.log(JSON.stringify(verified))
    console.log('====================Verifing=============================')
  }catch(err){
    console.error(`Error: ${err.message}`)
  }
}

testRun(personDoc)






