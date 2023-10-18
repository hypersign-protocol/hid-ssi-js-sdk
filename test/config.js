const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { HdPath, Slip10RawIndex } = require('@cosmjs/crypto')
const fs = require('fs')

// const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
const mnemonic = "napkin delay purchase easily camp mimic share wait stereo reflect allow soccer believe exhibit laptop upset tired talent transfer talk surface solution omit crack"

function makeCosmoshubPath(a) {
    return [
        Slip10RawIndex.hardened(44),
        Slip10RawIndex.hardened(118),
        Slip10RawIndex.hardened(0),
        Slip10RawIndex.normal(0),
        Slip10RawIndex.normal(a),

    ];
}
const createWallet = async (mnemonic) => {
    if (!mnemonic) {
        return await DirectSecp256k1HdWallet.generate(24, options = {
            prefix: "hid",
            hdPaths: [makeCosmoshubPath(0)],
        });
    } else {
        return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, options = {
            prefix: "hid",
            hdPaths: [makeCosmoshubPath(0)],
        });
    }
}

const writeDataInFile = (fileName, data) => {
    return fs.writeFile(fileName, data, (error) => {
        if (error) {
            throw new Error(error)
        }
        console.log('Successfully written into file ', fileName);
    })
}

const readDateFromFile = (fileName) => {
    return new Promise((resolve, reject) => {
        return fs.readFile(fileName, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(JSON.parse(data))
        });
    })
}

const ifFileExists = (fileName) => {
    return fs.existsSync(fileName)
}

const props = {
    "name": "",
    "email": "",
    "phoneNumber": ""
}

 const hidNodeEp = {
    rpc: 'https://rpc.jagrat.hypersign.id',
    rest: 'https://api.jagrat.hypersign.id',
    namespace: 'testnet',
  };

module.exports = {
    props,
    writeDataInFile,
    readDateFromFile,
    ifFileExists,
    createWallet,
    mnemonic,
    hidNodeEp
}