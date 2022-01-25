import { HIDRpcEnums, HID_COSMOS_MODULE } from '../constants'
import * as generatedProto from '../generated/did/tx';
import { IHIDWallet } from '../wallet/wallet';

export interface IDIDRpc {
    registerDID({did, didDocString}):Promise<Object>;
    resolveDID(did):Promise<Object>
}



export class DIDRpc implements IDIDRpc{
    hidWallet: IHIDWallet;
    constructor(wallet: IHIDWallet){
        this.hidWallet = wallet;
    }

    async registerDID({
        did,
        didDocString
    }):Promise<Object>{
        const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgCreateDID}`;
        console.log(typeUrl)
        const message = {
            typeUrl, // Same as above
            value: generatedProto[HIDRpcEnums.MsgCreateDID].fromPartial({
                did,
                didDocString,
                createdAt: Date.now().toLocaleString(),
                creator: this.hidWallet.account,
                }),
            };
            return await this.hidWallet.signAndBroadcastMessages([message], this.hidWallet.getFee());
    }
    
    async resolveDID(did:string):Promise<Object>{
        return new Promise((resolve, reject) => {
            resolve({})
        })
    }

}