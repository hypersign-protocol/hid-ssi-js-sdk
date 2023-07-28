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
// const test= new ApiAuth(   '286d30b3e009714679904dbb16f97.8c2cd0db41a845bae96b3837a5df159fbf0a881b4f31d5a2d5a35a5d42978e95d428dbd8e57c38d973c73c050b409b7c1')
// // const result= test.checkAndRefreshToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImQ2N2NkNjEyNTE2NzY0MmEyMjhjNzRjNTcwZGU5YjZjYzQ0OCIsInVzZXJJZCI6InZhcnNoYWt1bWFyaTM3MEBnbWFpbC5jb20iLCJncmFudFR5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJpYXQiOjE2OTAxMjk2OTgsImV4cCI6MTY5MDE0NDA5OH0.yc7Ly8XKNmevTe8LjQTOoYFuKVDljjzZdwUfzNZXsbo")
// // const newToen= test.generateAccessToken()
//  const result2= test.checkAndRefreshToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImQ2N2NkNjEyNTE2NzY0MmEyMjhjNzRjNTcwZGU5YjZjYzQ0OCIsInVzZXJJZCI6InZhcnNoYWt1bWFyaTM3MEBnbWFpbC5jb20iLCJncmFudFR5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJpYXQiOjE2OTA1Mjc1NDQsImV4cCI6MTY5MDU0MTk0NH0.kIl2zIjuJa-keotjP5B18KM3HzTBq3T-_-vRdLqkr7w')
