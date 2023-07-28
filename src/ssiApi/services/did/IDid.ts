import { Did } from "../../../../libs/generated/ssi/did";
import { IClientSpec, IDIDResolve, IKeyType, IVerificationRelationships } from "../../../did/IDID";

export interface IGenerateDid{
    namespace:string;
    methodSpecificId?:string;
    options?:{
        keyType:IKeyType,
        chainId:string,
        publicKey:string,
        walletAddress:string,
        verificationRelationships:IVerificationRelationships[]
    }
}

export interface ClientSpec{
    type:IClientSpec;
    adr036SignerAddress?:string;
}
export interface SignInfo{
    verification_method_id:string;
    signature: string;
    clientSpec:ClientSpec
}
export interface IRegister{
    didDocument:Did;
    verificationMethodId?:string;
    signInfos?:Array<SignInfo>

}

export interface IUpdate extends IRegister{
    deactivate:boolean
}


export interface IDidApi{
    generateDid(params:IGenerateDid):Promise<Did>  
    registerDid(params:IRegister):Promise<{ didDocument: Did; transactionHash: string }>
    resolveDid(params:{did:string}):Promise<IDIDResolve>
    updateDid(params:IUpdate):Promise<{transactionHash: string}>
}