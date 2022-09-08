
const SSIWallet = require('../../build/src/hid/SSIWallet');
const {encode, decode} =require ('base58-universal');
const { Bech32 } = require('@cosmjs/encoding')
const crypto = require('crypto');
 const  {
    sign,
    verify,
    createHash,
    createPrivateKey,
    createPublicKey,
    randomBytes , 
  } =require('node:crypto');
// import elliptic from 'elliptic';
// import Utils from '../../build/src/utils'
// const bip39 = require('bip39');
// import {HdPath,Slip10RawIndex,Slip10Curve,Slip10Ed25519HdSeed,Ed25519HdKeyPair,} from '@transmute/did-key-ed25519';
const { Bip39, Secp256k1 ,Slip10,Slip10Curve,Slip10RawIndex,Ed25519 ,Ed25519Keypair} =require ("@cosmjs/crypto")
// import { TextDecoder } from "util";
const { hidNodeEp } = require('../config')
const ed = require('@digitalbazaar/ed25519-verification-key-2020');
const { createWallet, mnemonic } =require ('../config')
// import { rawEd25519PubkeyToRawAddress ,pubkeyToAddress,pubkeyToRawAddress,parseCoins,pubkeyType} from '@cosmjs/amino';
function makeCosmoshubPath(a) {
    return [
        Slip10RawIndex.hardened(0),
        Slip10RawIndex.hardened(1),
        Slip10RawIndex.hardened(2),
        Slip10RawIndex.hardened(a),
        // Slip10RawIndex.hardened(a),

    ];
}


 function assertKeyBytes({bytes, expectedLength = 32, code}) {
    if(!(bytes instanceof Uint8Array)) {
      throw new TypeError('"bytes" must be a Uint8Array.');
    }
    if(bytes.length !== expectedLength) {
      const error = new Error(
        `"bytes" must be a ${expectedLength}-byte Uint8Array.`);
      // we need DataError for invalid byte length
      error.name = 'DataError';
      // add the error code from the did:key spec if provided
      if(code) {
        error.code = code;
      }
      throw error;
    }
  }



const publicKeyEncoding = {format: 'der', type: 'spki'};

// used to turn private key bytes into a buffer in DER format
const DER_PRIVATE_KEY_PREFIX = Buffer.from(
    '302e020100300506032b657004220420', 'hex');
  // used to turn public key bytes into a buffer in DER format
  const DER_PUBLIC_KEY_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

  function getKeyMaterial(buffer) {
    if(buffer.indexOf(DER_PUBLIC_KEY_PREFIX) === 0) {
      return buffer.slice(DER_PUBLIC_KEY_PREFIX.length, buffer.length);
    }
    if(buffer.indexOf(DER_PRIVATE_KEY_PREFIX) === 0) {
      return buffer.slice(DER_PRIVATE_KEY_PREFIX.length, buffer.length);
    }
    throw new Error('Expected Buffer to match Ed25519 Public or Private Prefix');
  }


  function privateKeyDerEncode({privateKeyBytes, seedBytes}) {
    if(!(privateKeyBytes || seedBytes)) {
      throw new TypeError('`privateKeyBytes` or `seedBytes` is required.');
    }
    if(!privateKeyBytes) {
      assertKeyBytes({
        bytes: seedBytes,
        expectedLength: 32
      });
    }
    if(!seedBytes) {
      assertKeyBytes({
        bytes: privateKeyBytes,
        expectedLength: 64
      });
    }
    let p;
    if(seedBytes) {
      p = seedBytes;
    } else {
      // extract the first 32 bytes of the 64 byte private key representation
      p = privateKeyBytes.slice(0, 32);
    }
    return Buffer.concat([DER_PRIVATE_KEY_PREFIX, p]);
  }

  async function generateKeyPairFromSeed(seedBytes) {
    const privateKey = await createPrivateKey({
      // node is more than happy to create a new private key using a DER
      key: privateKeyDerEncode({seedBytes}),
      format: 'der',
      type: 'pkcs8'
    });
    // this expects either a PEM encoded key or a node privateKeyObject
    const publicKey = await createPublicKey(privateKey);
    const publicKeyBuffer = publicKey.export(publicKeyEncoding);
    const publicKeyBytes = getKeyMaterial(publicKeyBuffer);
    return {
      publicKey: publicKeyBytes,
      secretKey: Buffer.concat([seedBytes, publicKeyBytes])
    };
  }

async function testxx() {

    // const ssiwallet=new SSIWallet("123",'dumb theory history raccoon celery curve lazy sentence circle gospel riot ill call worry surprise foil ancient swim between solar later burger jazz diamond')
    // console.log(await ssiwallet.isWalletReady());
    // console.log(await ssiwallet.getMnemomic({password: "123"}));
    // console.log(ssiwallet);
    const wallet = await createWallet(mnemonic);
    console.log(mnemonic);
    const data = await wallet.getAccountsWithPrivkeys()
    console.log(data[0].address);






    // const seed= new Uint8Array();



    const seed = Bip39.decode(mnemonic)
    console.log(seed.length);
    
    const newSeed=await Bip39.mnemonicToSeed(mnemonic)

    
    const slip = Slip10.derivePath(Slip10Curve.Ed25519, Uint8Array.from(Buffer.from('000102030405060708090a0b0c0d0e0f','hex')) , makeCosmoshubPath(2));
  
    console.log(slip);
   
    
    
    console.log(Buffer.from(slip.chainCode,slip.chainCode.length).toString('hex'))
    
    console.log(Buffer.from(slip.privkey,slip.privkey.length).toString('hex'))
    const privatekey=Buffer.from(slip.privkey,slip.privkey.length).toString('hex')
   const pubkey=(await Ed25519.makeKeypair(slip.privkey)).pubkey
   const test=await Ed25519.makeKeypair(slip.privkey)
   console.log("PubKey",Buffer.from(pubkey,pubkey.length).toString('hex'))
   console.log(test);
    const sig=await  Ed25519.createSignature(new Uint8Array(Buffer.from("test")),test)
    const verification=await Ed25519.verifySignature(sig,new Uint8Array(Buffer.from("test")), test.pubkey)
    console.log(sig ,verification);
    console.log(encode(Buffer.from(pubkey,pubkey.length)));
    console.log(encode(Buffer.from(slip.privkey,slip.privkey.length)));
    


const {publicKey,secretKey}=await generateKeyPairFromSeed(slip.privkey)

console.log(publicKey.toString('base64'))
console.log (secretKey.toString('base64'));






// console.log( await createPrivateKey({
//     key:privatekeyD
// }));

   
    
    // const keypair = await Ed25519Keypair.fromLibsodiumPrivkey(slip.privkey);
// console.log(keypair);




  
    // sconsole.log(elliptic.ec('curve25519').)
    
   
    // console.log(keyPairEd25519);
    
    // console.log({pubkey:Buffer.from(keyPairEd25519.pubkey).toString('base64'),privKey:Buffer.from(pk).toString('base64')});
    
     // const mnemonic = bip39.entropyToMnemonic(entropy);
    //     console.log(bip39.mnemonicToEntropy(mnemonic));
    //     console.log(mnemonic);
    // //   const memonic=bip39.generateMnemonic(seed)
    // //   console.log(memonic);
    // const keyPair = await ed.Ed25519VerificationKey2020.generate({ seed });
    // console.log(keyPair);
    
    // console.log(Buffer.from(keyPair.publicKeyMultibase).toString('hex'));
    
    
    // const ed255192020VerKeys = {
    //     "publicKey": keyPair.publicKeyMultibase, "privKey": keyPair.privateKeyMultibase
    // }
    // console.log(Utils.convertEd25519verificationkey2020toStableLibKeysInto(ed255192020VerKeys));

    //     console.log(await keyPair.export({ publicKey: true, privateKey: true }))
    //     // const { sign } = keyPair.signer();

    //     // // data is a Uint8Array of bytes
    //     // const data = (new TextEncoder()).encode('test data goes here');
    //     // // Signing also outputs a Uint8Array, which you can serialize to text etc.
    //     // const signatureValueBytes = await sign({ data });
    //     // console.log(signatureValueBytes)
    //     // const { verify } = keyPair.verifier();
    //     // console.log(verify);
    //     // const valid = await verify({ data, signature: signatureValueBytes });
    //     // console.log(valid);
}
testxx()




///// READ Digital Bazar REPO FOR MORE INFO https://github.dev/digitalbazaar/ed25519-verification-key-2020/blob/84f727ec01a8ce77f329955121077fde07b158e9/lib/ed25519.js