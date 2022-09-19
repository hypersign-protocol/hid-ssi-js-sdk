const { createWallet, writeDataInFile, mnemonic, hidNodeEp } = require('../config')

const { Ed25519VerificationKey2020 } = require('@digitalbazaar/ed25519-verification-key-2020')
const { Bip39, Secp256k1, Slip10, Slip10Curve, Slip10RawIndex, Ed25519, Ed25519Keypair } = require("@cosmjs/crypto")

const bip39 = require("bip39")

function makeSSIWalletPath(minHardIndex) {
    return [
        Slip10RawIndex.hardened(0),
        Slip10RawIndex.hardened(118),
        Slip10RawIndex.hardened(0),
        Slip10RawIndex.hardened(0),
        Slip10RawIndex.hardened(minHardIndex),

    ];
}


const test = async () => {
    const seed = Bip39.decode(mnemonic)

    console.log(mnemonic);


    const slipPathKeys = Slip10.derivePath(Slip10Curve.Ed25519, seed, makeSSIWalletPath(0))
    console.log(slipPathKeys);
    const edKeyPair2 = await Ed25519VerificationKey2020.generate({ seed: slipPathKeys.privkey });


    console.log("derived", edKeyPair2);

}

test()