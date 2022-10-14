import Did from './did/did';
import VC  from './credential/vc'
import VP  from './credential/vp'
import Schema from './schema/schema';
import { OfflineSigner } from "@cosmjs/proto-signing";
import { HIDClient } from './hid/client'

export = class HypersignSSISdk{
    // TODO: Make sure to use proper type so that dev can see list of available methods.
    did: any;
    vc: any;
    vp: any;
    schema: any;
    namespace: string;
    
    private signer: OfflineSigner;
    private nodeEndpoint: string; // http://localhost:26657 | 'TEST' | 'MAIN'
    private nodeRestEndpoint: string; // "" | http://localhost:1317
    constructor(offlineSigner: OfflineSigner, nodeEndpoint: string, nodeRestEndpoint?: string, namespace?: string){
        
        // TODO validate if offlinesigner is of type OfflineSiner
        this.signer = offlineSigner; 

        if(!nodeEndpoint){
            throw new Error("HID Node enpoint must be passed. Possible values:  'TEST' | 'MAIN' | <custom node url>")
        }

        this.nodeEndpoint = nodeEndpoint; 
        this.nodeRestEndpoint = nodeRestEndpoint ? nodeRestEndpoint : "";
        this.namespace = namespace? namespace: "";

        // this.did = {} as Did;
        // this.vc = {} as VC;
        // this.vp = {} as VP;
        // this.schema = {} as Schema;

        
        // this.did = {} as Did;
    }

    async init(){
        const hidClient = new HIDClient(this.signer, this.nodeEndpoint, this.nodeRestEndpoint);
        await hidClient.init();

        this.did = new Did(this.namespace);
        this.schema = new Schema(this.namespace);
        this.vc = new VC(this.namespace);
        this.vp = new VP(this.namespace);
    }

}

