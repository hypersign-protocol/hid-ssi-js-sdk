import BaseSignInfo from './BaseSignInfo'

import { IClientSpec } from './types'

export default class CosmosADR036SignInfo extends BaseSignInfo {
    constructor(verification_method_id: string, signature: string, adr036SignerAddress: string){
        super(verification_method_id, signature)
        this.clientSpec = {
            type: IClientSpec['cosmos-ADR036'],
            adr036SignerAddress: adr036SignerAddress
        }
    }
}