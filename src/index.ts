import Did from './did'
import Credential  from './credential';
import Schema from './schema/schema';
import { ISchema } from './schema/ISchema';
export = {
    did: options => {
        return new Did(options)
    },

    credential: options => {
        return new Credential(options)
    },

    schema: (options) => {
        return new Schema(options)
    }
    
}