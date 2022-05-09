import { HIDRpcEnums, HID_COSMOS_MODULE, HYPERSIGN_TESTNET_REST, HYPERSIGN_NETWORK_DID_PATH, HYPERSIGN_NETWORK_DID_REST_PATH } from '../constants'
import * as generatedProto from '../generated/did/tx';
import {
    SigningStargateClient,
} from "@cosmjs/stargate";


import axios from "axios";
import { HIDClient } from '../hid/hidClient';

export interface IDIDRpc {
    registerDID({didDocString, signatures}):Promise<Object>;
    resolveDID(did):Promise<Object>
}

export class DIDRpc implements IDIDRpc{
    private didRestEp: string;
    constructor(){
        this.didRestEp = HIDClient.hidNodeRestEndpoint + HYPERSIGN_NETWORK_DID_REST_PATH;
    }

    // TODO:  this RPC MUST also accept signature/proof 
    async registerDID({
        didDocString,
        signatures
    }):Promise<Object>{
        const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgCreateDID}`;
        console.log("The wallet address is (rpc/didRPC.ts): ", HIDClient.getHidWalletAddress())
        const txMessage = {
            typeUrl, // Same as above
            value: generatedProto[HIDRpcEnums.MsgCreateDID].fromPartial({
                    didDocString,
                    signatures,
                    creator: HIDClient.getHidWalletAddress(),
                }),
            }; 

        // TODO: need to find a way to make it dynamic
        const fee = {
            amount: [{
                denom: 'uhid',
                amount: '5000',
            }, ],
            gas: '200000',
        }
    
        const hidClient: SigningStargateClient = HIDClient.getHidClient();
        return await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
    }

    async resolveDID(did:string):Promise<Object>{
        did = did + ":"; // TODO:  we need to sort this out ... need to remove later
        const get_didUrl = `${this.didRestEp}/${did}`;
        console.log("Get didUrl = " +  get_didUrl)
        const response = await axios.get(get_didUrl);
        const { didDoc } = response.data;
        return JSON.parse(didDoc);
    }

}