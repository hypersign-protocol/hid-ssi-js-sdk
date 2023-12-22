import { ICredentialService, IRegisterCredStatus } from "./ICredentialApi";
export default class CredentialApiService implements ICredentialService {
    private authService;
    private accessToken;
    constructor(apiKey: string);
    auth(): Promise<void>;
    /**
     * Register credential status on blockchain
     * @param
     * - params.credentialStatus           : Credential status information
     * - params.credentialStatusProof      : Status proof of the credential
     * @return {Promise<{transactionHash: string}>}
     */
    registerCredentialStatus(params: IRegisterCredStatus): Promise<{
        transactionHash: string;
    }>;
}
//# sourceMappingURL=credential.service.d.ts.map