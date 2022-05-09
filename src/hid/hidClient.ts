
import { OfflineSigner } from "@cosmjs/proto-signing";
import {
    SigningStargateClient, StargateClient,
} from "@cosmjs/stargate";
import { HIDRpcFactory } from '../rpc/rpcFactory';
import Utils from "../utils";
const { HYPERSIGN_TESTNET_RPC, HYPERSIGN_TESTNET_REST , HYPERSIGN_MAINNET_RPC, HYPERSIGN_MAINNET_REST, HIDRpcEnums } = require('../constants')
export class HIDClient {
    private static hidNodeClient: SigningStargateClient;
    private static hidWalletAddress: string;
    private signer: OfflineSigner;
    private registry: HIDRpcFactory;
    static hidNodeEndpoint: string;
    static hidNodeRestEndpoint: string | undefined;
    constructor(
        signer: OfflineSigner, 
        hidNodeEndpoint: string, // 'TEST' | 'MAIN' | <custom node url>
        hidNodeRestEndpoint?: string
        ){

        this.signer = signer;   
        this.registry = new HIDRpcFactory();
        
        if(!hidNodeEndpoint){
            throw new Error("HID Node enpoint must be passed. Possible values:  'TEST' | 'MAIN' | <custom node url>")
        }

        if(hidNodeEndpoint === 'TEST'){
            HIDClient.hidNodeEndpoint = Utils.checkUrl(HYPERSIGN_TESTNET_RPC)
            HIDClient.hidNodeRestEndpoint = Utils.checkUrl(HYPERSIGN_TESTNET_REST);
        } else if (hidNodeEndpoint === 'MAIN'){
            HIDClient.hidNodeEndpoint = Utils.checkUrl(HYPERSIGN_MAINNET_RPC)
            HIDClient.hidNodeRestEndpoint = Utils.checkUrl(HYPERSIGN_MAINNET_REST);
        } else {
            HIDClient.hidNodeEndpoint = Utils.checkUrl(hidNodeEndpoint)
            if(!hidNodeRestEndpoint){
                throw new Error("HID node REST endpoint can not be empty for custom network");
            }
            HIDClient.hidNodeRestEndpoint = Utils.checkUrl(hidNodeRestEndpoint); 
        }
    }

    public async init(){
        Object.keys(HIDRpcEnums).forEach(rpc =>{
            this.registry.registerRpc(HIDRpcEnums[rpc]);
        });


        HIDClient.hidNodeClient = await SigningStargateClient.connectWithSigner(
            HIDClient.hidNodeEndpoint,
            this.signer,
            { registry: this.registry.hidRPCRegistery }
        )  
        
        const accounts = await this.signer.getAccounts();
        HIDClient.hidWalletAddress = accounts[0].address
    }

    public static getHidClient(): SigningStargateClient{
        return  HIDClient.hidNodeClient;
    }


    public static getHidWalletAddress():  string{
        return HIDClient.hidWalletAddress;
    }
}