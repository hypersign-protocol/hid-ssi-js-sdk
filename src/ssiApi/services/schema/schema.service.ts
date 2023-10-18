import { APIENDPOINT } from "../../api-constant";
import { IAuth, IValidateAccesstokenResp } from "../../apiAuth/IAuth";
import { ApiAuth } from "../../apiAuth/apiAuth";
import { IRegisterSchema, ISchemaService } from "./ISchemaApi";

export default class SchemaApiService implements ISchemaService {
    private authService: IAuth;
    private accessToken;
    constructor(apiKey: string) {
        if (!apiKey || apiKey.trim() === "") {
            throw new Error('HID:SSI-SDK:: Error: Please Provide apiKey');
        }
        this.authService = new ApiAuth(apiKey);
    }
    public async auth() {
        const accessToken = await this.authService.generateAccessToken();
        this.accessToken = accessToken.access_token;
    }

    /**
     * Register schema on blockchain
     * @param
     * - params.SchemaDocument    :Schema document to be registered on blockchain
     * - params.SchemaProof       :Proof of schema document
     * @return {Promise<{transactionHash: string}>}
     */

    public async registerSchema(params: IRegisterSchema): Promise<{ transactionHash: string }> {
        if (!params.schemaDocument || Object.keys(params.schemaDocument).length === 0) {
            throw new Error('HID-SSI-SDK:: Error: params.schemaDocument is required to register schema on blockchain')
        }
        if (!params.schemaProof || Object.keys(params.schemaProof).length === 0) {
            throw new Error('HID-SSI-SDK:: Error: params.schemaProof is required to register schema on blockchain')
        }
        const isAccessTokenValid: IValidateAccesstokenResp = await this.authService.checkAndRefreshAToken({ accessToken: this.accessToken })
        if (!isAccessTokenValid.valid) {
            this.accessToken = isAccessTokenValid.accessToken
        }
        const apiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.SCHEMA.REGISTER_SCHEMA}`;
        const headers = {
            'Content-Type': "application/json",
            Authorization: `Bearer ${this.accessToken}`,
            origin: `${APIENDPOINT.STUDIO_API_ORIGIN}`
        }
        const requestOptions = {
            method: 'POST',
            headers,
            body: JSON.stringify({ ...params }),
        }
        const response = await fetch(apiUrl, requestOptions)
        const result = await response.json()
        if (!response.ok) {
            throw new Error(`HID-SSI-SDK:: Error: ${result.message}`)
        }
        return result
    }
}