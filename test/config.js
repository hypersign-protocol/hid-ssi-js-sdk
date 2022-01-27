const HypersignSsiSDK = require('../dist')
const { HYPERSIGN_TESTNET_RPC } = require('../dist/constants')
const fs  =  require('fs')

const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
const options = { nodeUrl: "https://stage.hypermine.in/core", mnemonic, rpc: HYPERSIGN_TESTNET_RPC }
const hsSdk = new HypersignSsiSDK(options); 

const writeDataInFile = (fileName, data) => {
    return fs.writeFile(fileName, data, (error) => {
        if(error){
            throw new Error(error)
        }
        console.log('Successfully written into file ', fileName);
    })
}

const readDateFromFile  = (fileName) => {
    return new Promise((resolve, reject) => {
        return fs.readFile(fileName, (err, data) => {
            if(err){
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

module.exports = {
    hsSdk,
    props,
    writeDataInFile,
    readDateFromFile,
    ifFileExists
}

