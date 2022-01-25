import { HIDRpcEnums, HID_COSMOS_MODULE, HYPERSIGN_TESTNET_REST, HYPERSIGN_NETWORK_DID_PATH } from '../constants'
import * as generatedProto from '../generated/did/tx';
import { IHIDWallet } from '../wallet/wallet';

import axios from "axios";

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
        const message = {
            typeUrl, // Same as above
            value: generatedProto[HIDRpcEnums.MsgCreateDID].fromPartial({
                    did,
                    didDocString,
                    createdAt: Date.now().toString(),
                    creator: this.hidWallet.account,
                }),
            };
            return await this.hidWallet.signAndBroadcastMessages(message, this.hidWallet.getFee());
    }

    async resolveDID(did:string):Promise<Object>{
        did = did + ":"; // TODO:  we need to sort this out ... need to remove later
        const get_didUrl = `${HYPERSIGN_TESTNET_REST}${HYPERSIGN_NETWORK_DID_PATH}/${did}`;
        console.log(get_didUrl)
        const response = await axios.get(get_didUrl);
        console.log(response.data)
        const { didDoc } = response.data;
        return didDoc;
    }

}