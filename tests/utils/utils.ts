import HypersignSSISdk from "../../src/index";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { mnemonic, HIDNODE_RPC, HIDNODE_REST } from './constants';


async function  createWallet (mnemonic) {
        console.log('inside createwakket')
        if (!mnemonic) {
            return await DirectSecp256k1HdWallet.generate(24,{
                prefix: "hid",
            });
        } else {
            return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic,   {
                prefix: "hid",
            });
        }
    }



export async function hypersignSDKInit(){
        console.log('inside init')
        const offlineSigner = await createWallet(mnemonic);
        console.log(offlineSigner)
        const hsSDK = new HypersignSSISdk(offlineSigner, HIDNODE_RPC, HIDNODE_REST);
        await hsSDK.init();
        return hsSDK;
}











