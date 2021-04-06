import Did, { IDID } from './did'
import Credential, {ICredential}  from './credential';
import Schema, {IScheme} from './schema/schema';
import IOptions from './IOptions';

interface IHsSdk{
    did: IDID;
    credential: ICredential;
    schema: IScheme;
}

export = class HypersignSsiSDK implements IHsSdk{
    did: IDID;
    credential: ICredential;
    schema: IScheme;
    constructor(options: IOptions){
        this.did = new Did(options);
        this.credential = new Credential(options);
        this.schema = new Schema(options);
    }
}

// import Test, {ITest} from './test';


// interface IHsSdk{
//     test: ITest;
// }

// export = class HypersignSsiSDK implements IHsSdk{
//     test: ITest;
//     constructor(){
//         this.test = new Test();
//     }

//     get(){
//         return {
//             test: this.test
//         }
//     }

// }

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