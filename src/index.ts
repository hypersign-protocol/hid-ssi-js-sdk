import Did from './did'
import Credential  from './credential'

export = {
    did: options => {
        return new Did(options)
    },

    credential: options => {
        return new Credential(options)
    }
}