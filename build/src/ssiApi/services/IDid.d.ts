import { Did } from "../../../libs/generated/ssi/did";
import { IClientSpec, IKeyType, IVerificationRelationships } from "../../did/IDID";
export interface IGenerateDid {
    namespace: string;
    methodSpecificId?: string;
    options?: {
        keyType: IKeyType;
        chainId: string;
        publicKey: string;
        walletAddress: string;
        verificationRelationships: IVerificationRelationships[];
    };
}
interface ClientSpec {
    type: IClientSpec;
    adr036SignerAddress?: string;
}
interface SignInfo {
    verification_method_id: string;
    signature: string;
    clientSpec: ClientSpec;
}
export interface IRegister {
    didDocument: Did;
    verificationMethodId?: string;
    signInfos?: Array<SignInfo>;
}
export interface IUpdate extends IRegister {
    deactivate: boolean;
}
export {};
//# sourceMappingURL=IDid.d.ts.map