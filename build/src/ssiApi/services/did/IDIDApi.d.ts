import { DidDocument as Did } from "../../../../libs/generated/ssi/did";
import { IDIDResolve, ISignInfo } from "../../../did/IDID";
import { VerificationMethodTypes, VerificationMethodRelationships as IVerificationRelationships } from "../../../../libs/generated/ssi/client/enums";
export interface IGenerateDid {
    namespace: string;
    methodSpecificId?: string;
    options?: {
        keyType: VerificationMethodTypes;
        chainId: string;
        publicKey: string;
        walletAddress: string;
        verificationRelationships: IVerificationRelationships[];
    };
}
export interface IRegister {
    didDocument: Did;
    verificationMethodId?: string;
    signInfos?: Array<ISignInfo>;
}
export interface IUpdate extends IRegister {
    deactivate: boolean;
}
export interface IDidApiService {
    auth(): void;
    generateDid(params: IGenerateDid): Promise<Did>;
    registerDid(params: IRegister): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    resolveDid(params: {
        did: string;
    }): Promise<IDIDResolve>;
    updateDid(params: IUpdate): Promise<{
        transactionHash: string;
    }>;
}
//# sourceMappingURL=IDIDApi.d.ts.map