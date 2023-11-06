import { DeliverTxResponse } from "@cosmjs/stargate";
import { CredentialStatusDocument as CredentialStatus } from "../../../../libs/generated/ssi/credential_status";
import { DocumentProof as CredentialProof } from "../../../../libs/generated/ssi/proof";
export interface IRegisterCredStatus {
    credentialStatus: CredentialStatus;
    credentialStatusProof: CredentialProof;
    namespace: string;
}
export interface ICredentialService {
    auth(): void;
    registerCredentialStatus(params: IRegisterCredStatus): Promise<Pick<DeliverTxResponse, 'transactionHash'>>;
}
//# sourceMappingURL=ICredentialApi.d.ts.map