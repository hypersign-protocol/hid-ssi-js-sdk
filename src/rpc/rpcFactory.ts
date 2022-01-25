import { Registry } from "@cosmjs/proto-signing";
import {
  defaultRegistryTypes,
} from "@cosmjs/stargate";
import * as generatedProto from '../generated/did/tx';
import { HIDRpcEnums, HID_COSMOS_MODULE } from '../constants';

export interface IHIDRpcFactory{
    registerRpc: any;
}

export class HIDRpcFactory implements IHIDRpcFactory{
    hidRPCRegistery: any
    constructor(){
        this.hidRPCRegistery = new Registry(defaultRegistryTypes);
    }

    public registerRpc(rpcName: HIDRpcEnums){
        if(!rpcName || !generatedProto[rpcName]){
            throw new Error("Invalid rpcName")
        }
        console.log("Inside registerRPC");
        console.log(rpcName)
        const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgCreateDID}`;
        console.log(typeUrl)

        // myRegistry.register("/hypersignprotocol.hidnode.did.MsgCreateDID", MsgCreateDID);
        console.log(generatedProto.MsgCreateDID)
        this.hidRPCRegistery.register(typeUrl, generatedProto.MsgCreateDID);
    }  
}