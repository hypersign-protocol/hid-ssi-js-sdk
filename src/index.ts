import Did, { IDID } from './did'
import Credential  from './credential';
import Schema from './schema/schema';
import IOptions from './IOptions';

interface IHsSdk{
    did: IDID;
    credential: Credential;
    schema: Schema;
}

export = class HypersignSsiSDK implements IHsSdk{
    did: IDID;
    credential: Credential;
    schema: Schema;
    constructor(options: IOptions){
        this.did = (new Did(options)).get();
        console.log(typeof this.did)
        this.credential = new Credential(options);
        this.schema = new Schema(options);
    }


}

// export = {
//     did: options => {
//         return new Did(options)
//     },

//     credential: options => {
//         return new Credential(options)
//     },

//     schema: (options) => {
//         return new Schema(options)
//     }
    
// }