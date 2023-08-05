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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAuth = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const api_constant_1 = require("../api-constant");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ApiAuth {
    constructor(apiKey) {
        if (!apiKey || apiKey.trim() === '') {
            throw new Error('HID-SSI_SDK:: Error: Please Provide apiKey');
        }
        this.apiKey = apiKey;
    }
    generateAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const studioApiUrl = `${api_constant_1.APIENDPOINT.STUDIO_API_BASE_URL}${api_constant_1.APIENDPOINT.AUTH}`;
            const headers = {
                'X-Api-Secret-Key': this.apiKey,
                origin: `${api_constant_1.APIENDPOINT.STUDIO_API_ORIGIN}`
            };
            const requestOptions = {
                method: 'POST',
                headers,
            };
            const response = yield (0, node_fetch_1.default)(studioApiUrl, requestOptions);
            const authToken = yield response.json();
            if (!response.ok) {
                throw new Error(`HID-SSI-SDK:: Error: ${authToken.message}`);
            }
            return authToken;
        });
    }
    checkAndRefreshAToken(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodeToken = jsonwebtoken_1.default.decode(params.accessToken, { complete: true });
                if (!decodeToken) {
                    throw new Error('HID-SSI-SDK:: Error: Token is invalid or malformed');
                }
                const currentTime = Math.floor(Date.now() / 1000);
                if (currentTime >= decodeToken.payload.exp) {
                    const { access_token } = yield this.generateAccessToken();
                    return { valid: false, accessToken: access_token };
                }
                else {
                    return { valid: true };
                }
            }
            catch (e) {
                throw new Error(`HID-SSI-SDK:: Error: ${e}`);
            }
        });
    }
}
exports.ApiAuth = ApiAuth;
