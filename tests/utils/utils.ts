import HypersignSSISdk from "../../src/index";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { mnemonic, HIDNODE_RPC, HIDNODE_REST } from './constants';

export default class Utils{
    private static instance: Utils;
    public hsSDK;
    private offlineSigner;
    private constructor(){}


    private static async  createWallet (mnemonic) {
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

    public static  getInstace(){
        if(!Utils.instance){
            Utils.instance = new Utils();
        } 
        return Utils.instance;
    }


    public async init(){
        console.log('inside init')
        this.offlineSigner = await Utils.createWallet(mnemonic);
        this.hsSDK = new HypersignSSISdk(this.offlineSigner,HIDNODE_RPC, HIDNODE_REST);
        await this.hsSDK.init();
        console.log('inside init')
    }

}










