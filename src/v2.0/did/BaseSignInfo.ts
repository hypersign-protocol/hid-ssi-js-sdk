import { SignInfo } from '../../../libs/generated/ssi/did';
import { ClientSpec } from "../../../libs/generated/ssi/clientSpec";


export default class BaseSignInfo implements SignInfo {
    readonly verification_method_id: string;
    readonly signature: string;
    clientSpec: ClientSpec | undefined;
    constructor(verification_method_id: string, signature: string, clientSpec = undefined) {
        this.verification_method_id = verification_method_id;
        this.signature = signature;
        this.clientSpec = undefined;
    }

    getSignInfo(): SignInfo {
        return {
            verification_method_id: this.verification_method_id,
            signature: this.signature,
            clientSpec: this.clientSpec
        }
    }
}