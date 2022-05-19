import Did, { IDID } from './did';
import VC  from './credential/vc'
import Schema from './schema/schema';
import { OfflineSigner } from "@cosmjs/proto-signing";
import { HIDClient } from './hid/hidClient';
import IOptions from './IOptions';

export = class HypersignSSISdk{
    // TODO: Make sure to use proper type so that dev can see list of available methods.
    did: any;
    vc: any;
    schema: any;
    
    private signer: OfflineSigner;
    private nodeEndpoint: string; // http://localhost:26657 | 'TEST' | 'MAIN'
    private nodeRestEndpoint: string; // "" | http://localhost:1317
    constructor(offlineSigner: OfflineSigner, nodeEndpoint: string, nodeRestEndpoint?: string){
        
        // TODO validate if offlinesigner is of type OfflineSiner
        this.signer = offlineSigner; 

        if(!nodeEndpoint){
            throw new Error("HID Node enpoint must be passed. Possible values:  'TEST' | 'MAIN' | <custom node url>")
        }

        this.nodeEndpoint = nodeEndpoint; 
        this.nodeRestEndpoint = nodeRestEndpoint ? nodeRestEndpoint : "";

        
        // this.did = {} as Did;
    }

    async init(){
        const hidClient = new HIDClient(this.signer, this.nodeEndpoint, this.nodeRestEndpoint);
        await hidClient.init();

        console.log('hID wallet address in init()' + HIDClient.getHidWalletAddress())


        this.did = new Did();
        this.schema = new Schema();
        this.vc = new VC();
    }

}

