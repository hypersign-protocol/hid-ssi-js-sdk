import { HIDRpcEnums, HID_COSMOS_MODULE, HYPERSIGN_TESTNET_REST, HYPERSIGN_NETWORK_SCHEMA_PATH } from '../constants'
import * as generatedProto from '../generated/ssi/tx';
import { IHIDWallet } from '../wallet/wallet';


import axios from "axios";
import { HIDClient } from '../hid/hidClient';
import { Schema } from '../generated/ssi/schema'
import { SignInfo } from "../generated/ssi/did";
import {
    SigningStargateClient,
} from "@cosmjs/stargate";

export interface ISchemaRPC {
    createSchema(schema: Schema, signature: string, verificationMethodId: string):Promise<Object>;
    resolveSchema(schemaId: string):Promise<Object>
}

export class SchemaRpc implements ISchemaRPC{
    public schemaRestEp: string;
    constructor(){
        this.schemaRestEp = HIDClient.hidNodeRestEndpoint + HYPERSIGN_NETWORK_SCHEMA_PATH;
    }

    async createSchema(schema: Schema, signature: string, verificationMethodId: string):Promise<Object>{
        const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgCreateSchema}`;
        
        const signInfo: SignInfo = {
            verificationMethodId,
            signature
        }

        const txMessage = {
            typeUrl, // Same as above
            value: generatedProto[HIDRpcEnums.MsgCreateSchema].fromJSON({
                    schema,
                    signatures: [signInfo],
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
        const txResult = await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
        return txResult
    }

    async resolveSchema(schemaId: string): Promise<Array<object>>{
        const getSchemaUrl = `${this.schemaRestEp}/${schemaId}:`;
        console.log("Schema Resolve URL: ", getSchemaUrl)
        const response = await axios.get(getSchemaUrl);
        const { schema }  = response.data;
        return schema;
    }
}