import { DeliverTxResponse } from "@cosmjs/stargate";
import { CredentialProof, CredentialStatus } from "../../../../libs/generated/ssi/credential";

export interface IRegisterCredStatus {
    credentialStatus: CredentialStatus;
    credentialStatusProof: CredentialProof;
    namespace: string
}
export interface ICredentialService {
    auth(): void,
    registerCredentialStatus(params: IRegisterCredStatus): Promise<Pick<DeliverTxResponse, 'transactionHash'>>
}