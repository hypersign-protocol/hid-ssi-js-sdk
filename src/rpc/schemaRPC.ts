import { HIDRpcEnums, HID_COSMOS_MODULE, HYPERSIGN_TESTNET_REST, HYPERSIGN_NETWORK_SCHEMA_PATH } from '../constants'
import * as generatedProto from '../generated/did/tx';
import { IHIDWallet } from '../wallet/wallet';

import axios from "axios";

export interface ISchemaRPC {
    createSchema({schema, signatures}):Promise<Object>;
    getSchema(schemaId: string):Promise<Object>
}

export class SchemaRpc implements ISchemaRPC{
    hidWallet: IHIDWallet;
    constructor(wallet: IHIDWallet){
        this.hidWallet = wallet;
    }

    async createSchema({
        schema,
        signatures
    }):Promise<Object>{
        const typeUrl = `${HID_COSMOS_MODULE}.${HIDRpcEnums.MsgCreateSchema}`;
        const message = {
            typeUrl, // Same as above
            value: generatedProto[HIDRpcEnums.MsgCreateSchema].fromPartial({
                    schema,
                    signatures,
                    creator: this.hidWallet.account,
                }),
            };
            return await this.hidWallet.signAndBroadcastMessages(message, this.hidWallet.getFee());
    }

    async getSchema(schemaId:string):Promise<Object>{
        const get_didUrl = `${HYPERSIGN_TESTNET_REST}${HYPERSIGN_NETWORK_SCHEMA_PATH}/${schemaId}`;
        const response = await axios.get(get_didUrl);
        const { schema } = response.data;
        return JSON.parse(schema);
    }
}