import { IKeyType, IVerificationRelationships } from "../../did/IDID";

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