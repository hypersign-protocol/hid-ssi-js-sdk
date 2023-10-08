import BaseSignInfo from './BaseSignInfo'

import { IClientSpec } from './types'

export default class EthPersonalSignInfo extends BaseSignInfo {
    constructor(verification_method_id: string, signature: string){
        super(verification_method_id, signature)
        this.clientSpec = {
            type: IClientSpec['eth-personalSign'],
            adr036SignerAddress: ''
        }
    }
}