import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  SigningStargateClient,
} from "@cosmjs/stargate";

export interface IHIDWallet {
    rpcEndpoint: string;
    mnemonic: string;
    account: string;
    connectSigner(registry?: any): Promise<any>;
    signAndBroadcastMessages(message: Array<Object>, fee: Object, memo?: string): Promise<any>;
    transferTokens(recipientAddress: string, amount: Array<object>, fee: Object, memo?: string): Promise<any>;
    init(): Promise<any>;
    getFee(): Object;

}

export class HIDWallet implements IHIDWallet {
    mnemonic: string;
    wallet : any;
    rpcEndpoint: string;
    client: any;
    account: string;
    constructor({
        mnemonic,
        rpcEndpoint
    }){
        if(!mnemonic){
            throw new Error("mnemonic is required");
        }

        if(!rpcEndpoint){
            throw new Error("rpcEndpoint is required");
        }

        this.rpcEndpoint = rpcEndpoint;
        this.mnemonic = mnemonic;
        this.account = "";
    }
    
    private async createWallet(){
        console.log('Createing wallet with mnemonic ', this.mnemonic);
        this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(this.mnemonic);
    }

    /**
     * step 1: Initiates the wallet
     */
    public async init(){
        await this.createWallet();
        const accounts = await this.wallet.getAccounts()
        this.account = accounts[0].address;
    }

    // step2: 
    public async connectSigner(registry?: any){
        
        this.client = await SigningStargateClient.connectWithSigner(this.rpcEndpoint, this.wallet, { registry });
        if(!this.client) throw new Error("Client could not inistliaed")
    }

    public getFee(): Object{
        return {
            amount: [
                {
                denom: "uatom", 
                amount: "10",
                },
            ],
            gas: "6200000",
          };
    }

    public async signAndBroadcastMessages(message: Array<Object>, fee?: Object, memo?: string): Promise<any>{
        if(!this.account || !this.client){
            throw new Error("Wallet is not initialize")
        }
        return await this.client.signAndBroadcast(this.account, [message], fee? fee: this.getFee(), memo);
    }

    public async transferTokens(recipientAddress: string, amount: Array<object>, fee?: Object, memo?: string): Promise<any>{
        if(!this.account || !this.client){
            throw new Error("Wallet is not initialize")
        }
        return await this.client.sendTokens(this.account, recipientAddress, amount, fee? fee: this.getFee(), memo);
    }
}