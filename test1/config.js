const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");

const fs = require('fs')

const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"

const createWallet = async(mnemonic) => {
    if (!mnemonic) {
        return await DirectSecp256k1HdWallet.generate(24, options = {
            prefix: "hid",
        });
    } else {
        return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, options = {
            prefix: "hid",
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
    rpc: "http://localhost:26657",
    rest: "http://localhost:1317"
}

module.exports = {
    props,
    writeDataInFile,
    readDateFromFile,
    ifFileExists,
    createWallet,
    mnemonic,
    hidNodeEp
}