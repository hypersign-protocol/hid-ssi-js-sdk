const { HIDWallet } = require('../dist/wallet/wallet')
const { HYPERSIGN_TESTNET_RPC, HYPERSIGN_NETWORK_SCHEMA_EP } = require('../dist/constants')
const mnemonic = "engage start cigar bulb naive borrow damp march hotel scare basic begin nest increase maid damage march spice eternal myself nose shy eye simple"
const toAddress =  "cosmos12g32k94y4xxzv4zq9378yl0cy5f3jh73en2yfp"

let hdWallet = null;
async function initWallet(){

    console.log('Initiating wallet')
    hdWallet = new HIDWallet({
        mnemonic: "",
        rpc: HYPERSIGN_TESTNET_RPC
    })
    
    await hdWallet.init();    
    console.log('Wallet inislized account', hdWallet.account)
    let accounts = await hdWallet.wallet.getAccounts()
    let mnemonic = hdWallet.mnemonic;
    console.log({
        mnemonic,
        accounts
    })

    const password = 'Passowd1@';
    const encryptedStr = await hdWallet.encryptWalletWithPassword(password)
    console.log(encryptedStr)
    
    
    await hdWallet.recoverWalletFromPassword(encryptedStr, password)
     accounts = await hdWallet.wallet.getAccounts()
     mnemonic = hdWallet.mnemonic;
    console.log({
        mnemonic,
        accounts
    })

    await hdWallet.fundWalletViaFaucet(hdWallet.account)
    console.log(await hdWallet.balance())
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
        return transfer(toAddress, "1")
    })
    .then(txHash => {
        console.log(txHash)
    })
    .catch(e => {
        console.log(e)
    })





