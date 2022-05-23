const { createWallet } = require('../config')
const HypersignSsiSDK = require('../../dist')
const { grantAuthorization, grantFeeAllowance } = require("../../dist/grantRPC") 

let hsSdk = null;

let granter = "hid1sr8l29ygryda7hn3dhnf4r6gdp5qfn7m9y7k04"
let grantee = "hid1dvdht5x7xzetf5hkjeqecq04uc47wjs8xjucsw"
let typeUrl = "/hypersignprotocol.hidnode.ssi.MsgCreateDID"
let spendLimit = {
    denom: "uhid",
    amount: "100099"
}

const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
createWallet(mnemonic)
    .then((offlineSigner) => {
        hsSdk = new HypersignSsiSDK(offlineSigner, "http://localhost:26657", "http://localhost:1317");
        return hsSdk.init();
    })
    .then(() => {
        console.log("====== Authz Test =====")
        const authzRes = grantAuthorization(granter, grantee, typeUrl)
        return authzRes
    })
    .then((authRes) => {
        console.log(authRes)
        console.log("====== Auth Test Done =====")
        console.log("====== Feegrant Test =====")
        const feeAllowanceRes = grantFeeAllowance(granter, grantee, spendLimit)
        return feeAllowanceRes
    })
    .then((res) => {
        console.log(res)
        console.log("==== Feegrant Test Done ====")
    })
    .catch((e) => {
        console.error(e)
    })