const { HIDWallet } = require('../dist/wallet/wallet')
const { HYPERSIGN_TESTNET_RPC, HYPERSIGN_NETWORK_SCHEMA_EP } = require('../dist/constants')
const mnemonic = "engage start cigar bulb naive borrow damp march hotel scare basic begin nest increase maid damage march spice eternal myself nose shy eye simple"
const toAddress =  "cosmos12g32k94y4xxzv4zq9378yl0cy5f3jh73en2yfp"

let hdWallet = null;
async function initWallet(){

    console.log('Initiating wallet')
    hdWallet = new HIDWallet({
        mnemonic,
        rpcEndpoint: HYPERSIGN_TESTNET_RPC
    })
    await hdWallet.init();    
    console.log('Wallet inislized account', hdWallet.account)
    await addSigner();
    return hdWallet.account;  
}


async function addSigner(){
    console.log('connecting signer')
    await hdWallet.connectSigner();   
}


async function transfer(toAddress, amount){

    const amt = [{
        denom: "uatom",
        amount,
      }];

      console.log('transfering tokens to ', toAddress)
    return hdWallet.transferTokens(toAddress, amt)
}


initWallet()
    .then(account => {
        console.log(account)
        return transfer(toAddress, "200")
    })
    .then(txHash => {
        console.log(txHash)
    })
    .catch(e => {
        console.log(e)
    })





