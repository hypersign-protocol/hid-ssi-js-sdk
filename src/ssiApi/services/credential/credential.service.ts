import { APIENDPOINT } from "../../api-constant";
import { IAuth, IValidateAccesstokenResp } from "../../apiAuth/IAuth";
import { ApiAuth } from "../../apiAuth/apiAuth";
import { ICredentialService, IRegisterCredStatus } from "./ICredentialApi";

export default class CredentialApiService implements ICredentialService {
    private authService: IAuth;
    private accessToken;
    constructor(apiKey: string) {
        if (!apiKey || apiKey.trim() === "") {
            throw new Error('HID-SSI_SDK:: Error: Please Provide apiKey');

        }
        this.authService = new ApiAuth(apiKey);
    }
    public async auth() {
        const accessToken = await this.authService.generateAccessToken();
        this.accessToken = accessToken.access_token;
    }

    /**
     * Register credential status on blockchain
     * @param
     * - params.credentialStatus           : Credential status information
     * - params.credentialStatusProof      : Status proof of the credential
     * @return {Promise<{transactionHash: string}>}
     */

    public async registerCredentialStatus(params: IRegisterCredStatus): Promise<{ transactionHash: string }> {
        if (!params.credentialStatus || Object.keys(params.credentialStatus).length === 0) {
            throw new Error('HID-SSI-SDK:: Error: params.credentialStatus is required to register credential status');
        }
        if (!params.credentialStatusProof || Object.keys(params.credentialStatusProof).length === 0) {
            throw new Error('HID-SSI-SDK:: Error: params.credentialStatusProof is required to register credential status');
        }
        const isAccessTokenValid: IValidateAccesstokenResp = await this.authService.checkAndRefreshAToken({ accessToken: this.accessToken })
        if (!isAccessTokenValid.valid) {
            this.accessToken = isAccessTokenValid.accessToken
        }
        const apiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.CREDENTIALS.REGISTER_CREDENTIAL_STATUS}`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.accessToken}`,
            origin: `${APIENDPOINT.STUDIO_API_ORIGIN}`
        };
        const requestOptions = {
            method: 'POST',
            headers,
            body: JSON.stringify({ ...params }),
        };
        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json()
        if (!response.ok) {
            throw new Error(`HID-SSI-SDK:: Error: ${result.message}`)
        }

        return result;
    }

}