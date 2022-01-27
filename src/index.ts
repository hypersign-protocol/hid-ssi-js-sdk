import Did, { IDID } from './did'
import Credential, {ICredential}  from './credential';
import Schema, {IScheme} from './schema/schema';
import IOptions from './IOptions';
import { HIDWallet } from './wallet/wallet';
const { HYPERSIGN_TESTNET_RPC, HYPERSIGN_NETWORK_SCHEMA_EP, HIDRpcEnums } = require('./constants')
import { HIDRpcFactory } from './rpc/rpcFactory'


// const options = { rpc: 'TEST' | 'MAIN' | 'http://localhost:26657', mnemonic? : "" }

interface IHsSdk{
    did: IDID;
    credential: ICredential;
    schema: IScheme;
}



export = class HypersignSsiSDK implements IHsSdk{
    did: any;
    credential: any;
    schema: any;
    wallet: any;
    options: IOptions;
    constructor(options: IOptions){
        this.wallet = new HIDWallet({
            mnemonic: options.mnemonic,
            rpc: options.rpc
        })
        this.options = options;
    }

    async init(){
        await this.wallet.init();    
        const rf = new HIDRpcFactory()
        
        /// TODO: need to make it dynamic later
        Object.keys(HIDRpcEnums).forEach(rpc =>{
            rf.registerRpc(HIDRpcEnums[rpc]);
        })
        await this.wallet.connectSigner(rf.hidRPCRegistery);  

        this.did = new Did(this.options, this.wallet);
        this.schema = new Schema(this.options, this.wallet);
        this.credential = new Credential(this.options, this.wallet);
    }

}

