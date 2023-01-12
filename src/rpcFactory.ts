import { Registry } from "@cosmjs/proto-signing";
import {
  defaultRegistryTypes,
} from "@cosmjs/stargate";
import * as generatedProto from '../libs/generated/ssi/tx';
import { HIDRpcEnums, HID_COSMOS_MODULE } from './constants';

export interface IHIDRpcFactory{
    registerRpc: any;
}

export class HIDRpcFactory implements IHIDRpcFactory{
    hidRPCRegistery: Registry
    constructor(){
        this.hidRPCRegistery = new Registry(defaultRegistryTypes);
    }

    public registerRpc(rpcName: HIDRpcEnums){
        if(!rpcName || !generatedProto[rpcName]){
            throw new Error("Invalid rpcName")
        }
        const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums[rpcName]}`;    
        this.hidRPCRegistery.register(typeUrl, generatedProto[rpcName]);
    }  
}