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
class ApiAuth {
    constructor(apiKey) {
        if (!apiKey || apiKey.trim() === "") {
            throw new Error("HID-SSI_SDK:: Error: Please Provide apiKey");
        }
        this.apiKey = apiKey;
    }
    generateAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const studioApiUrl = "https://api.entity.hypersign.id/api/v1/app/oauth";
            const headers = {
                "X-Api-Secret-Key": this.apiKey,
                "Origin": "https://entity.hypersign.id"
            };
            const requestOptions = {
                method: "POST",
                headers,
            };
            const response = yield (0, node_fetch_1.default)(studioApiUrl, requestOptions);
            if (!response.ok) {
                // what error to send not getting error message from api
                throw new Error('HID-SSI_SDK:: Error: Unauthorized');
            }
            const authToken = yield response.json();
            return authToken;
        });
    }
}
exports.ApiAuth = ApiAuth;
