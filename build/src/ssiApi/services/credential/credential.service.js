"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_constant_1 = require("../../api-constant");
const apiAuth_1 = require("../../apiAuth/apiAuth");
class CredentialApiService {
    constructor(apiKey) {
        if (!apiKey || apiKey.trim() === "") {
            throw new Error('HID-SSI_SDK:: Error: Please Provide apiKey');
        }
        this.authService = new apiAuth_1.ApiAuth(apiKey);
    }
    auth() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield this.authService.generateAccessToken();
            this.accessToken = accessToken.access_token;
        });
    }
    /**
     * Register credential status on blockchain
     * @param
     * - params.credentialStatus           : Credential status information
     * - params.credentialStatusProof      : Status proof of the credential
     * @return {Promise<{transactionHash: string}>}
     */
    registerCredentialStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.credentialStatus || Object.keys(params.credentialStatus).length === 0) {
                throw new Error('HID-SSI-SDK:: Error: params.credentialStatus is required to register credential status');
            }
            if (!params.credentialStatusProof || Object.keys(params.credentialStatusProof).length === 0) {
                throw new Error('HID-SSI-SDK:: Error: params.credentialStatusProof is required to register credential status');
            }
            const isAccessTokenValid = yield this.authService.checkAndRefreshAToken({ accessToken: this.accessToken });
            if (!isAccessTokenValid.valid) {
                this.accessToken = isAccessTokenValid.accessToken;
            }
            const apiUrl = `${api_constant_1.APIENDPOINT.STUDIO_API_BASE_URL}${api_constant_1.APIENDPOINT.CREDENTIALS.REGISTER_CREDENTIAL_STATUS}`;
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.accessToken}`,
                origin: `${api_constant_1.APIENDPOINT.STUDIO_API_ORIGIN}`
            };
            const requestOptions = {
                method: 'POST',
                headers,
                body: JSON.stringify(Object.assign({}, params)),
            };
            const response = yield fetch(apiUrl, requestOptions);
            const result = yield response.json();
            if (!response.ok) {
                throw new Error(`HID-SSI-SDK:: Error: ${result.message}`);
            }
            return result;
        });
    }
}
exports.default = CredentialApiService;
