// const utils = require('../../build/src/utils.js');
import {base58btc } from'multiformats/bases/base58'
import { CID } from 'multiformats/cid'
// console.log(utils.default.convertEd25519verificationkey2020toStableLibKeysInto({
//     publicKey: 'z6Mkwdme8GFKRWLAgaUphzxVYAvjWEqauPSfZvVRJKoAkaLB', privKey: 'zrv2VmKBer6kxjNywaUd5e25fpFpwogESBHZA8ehCuJzvYzMu5HQxo8Bige2Cf42XVjnAERBWiinNoEkcqBn8yUesFR',

// }));



// console.log(Buffer.from([
//     93,   5,  70, 146, 250,  86,  70, 170, 136, 108,  56,
//    241, 187, 121, 205, 182, 170, 153, 229,  18, 225,  40,
//    228, 168, 198,  68, 203,   8, 163, 139,  53, 182, 255,
//     71, 243,  18,  26, 159, 130,  58, 113,  16,  33,  36,
//    158,  31,  49,  36,  57,   3, 157,  63, 166, 182, 114,
//    216,   2,  14, 103,  77, 145,  77,  90,   4
//  ]).toString('base64'));

CID.create(1,)
const key='zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1'


// console.log(utils.default.convertedStableLibKeysIntoEd25519verificationkey2020({publicKey:key}))
const zkey='z6MkeqTDw7grjTmGuyg7uicQumnCJY7jjx5dSi8fRwZD7jWP'

// console.log(utils.default.convertEd25519verificationkey2020toStableLibKeysInto({publicKey:zkey}))


console.log(CID.parse(zkey,base58btc.decoder));



/**
 * offlineSigner DirectSecp256k1HdWallet {
  secret: EnglishMnemonic {
    data: 'napkin delay purchase easily camp mimic share wait stereo reflect allow soccer believe exhibit laptop upset tired talent transfer talk surface solution omit crack'
  },
  seed: Uint8Array(64) [
    194, 225, 255, 238,  10,  57,  82, 233, 238, 150, 212,
    108, 120,   8,  65, 177, 198,  62, 197, 112, 240, 134,
    130,  86, 230, 249, 180, 174, 190,  91,  98, 145,  72,
    111, 154,   1, 213, 132,  79,  64,  21, 102, 178, 173,
    175, 112,  37, 144,  85, 117, 253,  65,  71, 171, 123,
    169, 248,   9, 148,  68, 167, 192,  96,  90
  ],
  accounts: [ { hdPath: [Array], prefix: 'hid' } ]
}
[
  {
    algo: 'secp256k1',
    pubkey: Uint8Array(33) [
        3, 144,  39,  33,  52, 116, 220, 154,
       63, 186,  29, 211, 187,  64,  55,  91,
      189, 202, 143, 230, 229, 106,  57, 112,
      232, 168, 246,  51,  14, 245, 177,  98,
       55
    ],
    address: 'hid1pfrjvt2vp6uyseuepv5eheyss7dklach9zzlkt'
  }
]
===============GENERATE DID-KEYS=======================
kp {
  privateKeyMultibase: 'zrv3ZpMjw7NDYrrtxvHoyAk1Z2s1Ueq2PS4Ac3ExGZDp8EDmRWSzeYM79teNdNHh4Vcpxd8PoFgLTrVzEVbB63WVuSP',
  publicKeyMultibase: 'z6MkeqTDw7grjTmGuyg7uicQumnCJY7jjx5dSi8fRwZD7jWP'
}
{
  privateKeyMultibase: 'zrv3ZpMjw7NDYrrtxvHoyAk1Z2s1Ueq2PS4Ac3ExGZDp8EDmRWSzeYM79teNdNHh4Vcpxd8PoFgLTrVzEVbB63WVuSP',
  publicKeyMultibase: 'z6MkeqTDw7grjTmGuyg7uicQumnCJY7jjx5dSi8fRwZD7jWP'
}
===============GENERATE DID&DIDDoc=======================
{
  '@context': [ 'https://www.w3.org/ns/did/v1' ],
  id: 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1',
  controller: [ 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1' ],
  alsoKnownAs: [ 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1' ],
  verificationMethod: [
    {
      id: 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1',
      type: 'Ed25519VerificationKey2020',
      controller: 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1',
      publicKeyMultibase: 'zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1'
    }
  ],
  authentication: [
    'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1'
  ],
  assertionMethod: [
    'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1'
  ],
  keyAgreement: [
    'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1'
  ],
  capabilityInvocation: [
    'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1'
  ],
  capabilityDelegation: [
    'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1'
  ],
  service: []
}
===============SIGN DID=======================
Successfully written into file  ../mock/public/did.json
Successfully written into file  ../mock/public/keys.json
{
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/suites/ed25519-2020/v1'
  ],
  id: 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1',
  controller: [ 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1' ],
  alsoKnownAs: [ 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1' ],
  verificationMethod: [
    {
      id: 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1',
      type: 'Ed25519VerificationKey2020',
      controller: 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1',
      publicKeyMultibase: 'zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1'
    }
  ],
  authentication: [
    'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1'
  ],
  assertionMethod: [
    'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1'
  ],
  keyAgreement: [
    'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1'
  ],
  capabilityInvocation: [
    'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1'
  ],
  capabilityDelegation: [
    'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1'
  ],
  service: [],
  proof: {
    type: 'Ed25519Signature2020',
    created: '2022-10-14T12:05:19Z',
    verificationMethod: 'did:hid:testnet:zPCBLsSRPvGooUqRE9ea4gECUxqtL4qGkhDjbfbCCWj1#key-1',
    proofPurpose: 'authentication',
    challenge: '1231231231',
    domain: 'www.adbv.com',
    proofValue: 'z2bHwRkTBPgtNL2ENn8kodCw5iH84kf6e5BjPndJR6RPwHg5Vy3EVaTtfTEbTcqNSr1j5aQDk2jUgUvLmrbnejzqk'
  }
}
 */