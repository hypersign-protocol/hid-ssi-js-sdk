const HypersignSsiSDK = require('../dist')
const { HYPERSIGN_TESTNET_RPC } = require('../dist/constants')

const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
const options = { nodeUrl: "https://stage.hypermine.in/core", mnemonic, rpc: HYPERSIGN_TESTNET_RPC }
const hsSdk = new HypersignSsiSDK(options); 

module.exports = {
    hsSdk
}

