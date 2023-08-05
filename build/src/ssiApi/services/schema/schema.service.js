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
class SchemaApiService {
    constructor(apiKey) {
        if (!apiKey || apiKey.trim() === "") {
            throw new Error('HID:SSI-SDK:: Error: Please Provide apiKey');
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
     * Register schema on blockchain
     * @param
     * - params.SchemaDocument    :Schema document to be registered on blockchain
     * - params.SchemaProof       :Proof of schema document
     * @return {Promise<{transactionHash: string}>}
     */
    registerSchema(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.schemaDocument || Object.keys(params.schemaDocument).length === 0) {
                throw new Error('HID-SSI-SDK:: Error: params.schemaDocument is required to register schema on blockchain');
            }
            if (!params.schemaProof || Object.keys(params.schemaProof).length === 0) {
                throw new Error('HID-SSI-SDK:: Error: params.schemaProof is required to register schema on blockchain');
            }
            const isAccessTokenValid = yield this.authService.checkAndRefreshAToken({ accessToken: this.accessToken });
            if (!isAccessTokenValid.valid) {
                this.accessToken = isAccessTokenValid.accessToken;
            }
            const apiUrl = `${api_constant_1.APIENDPOINT.STUDIO_API_BASE_URL}${api_constant_1.APIENDPOINT.SCHEMA.REGISTER_SCHEMA}`;
            const headers = {
                'Content-Type': "application/json",
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
exports.default = SchemaApiService;
