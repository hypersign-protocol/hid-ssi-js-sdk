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
exports.DID = void 0;
const apiAuth_1 = require("../../apiAuth/apiAuth");
const node_fetch_1 = __importDefault(require("node-fetch"));
class DID {
    constructor(apiKey) {
        this.authService = new apiAuth_1.ApiAuth(apiKey);
        this.initAccessToken();
    }
    initAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield this.authService.generateAccessToken();
            this.accessToken = accessToken.access_token;
        });
    }
    generateDid(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = "https://api.entity.hypersign.id/api/v1/did/create";
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.accessToken}`,
                Origin: "https://entity.hypersign.id"
            };
            const requestOptions = {
                method: "POST",
                headers,
                body: JSON.stringify(Object.assign({}, params))
            };
            const response = yield (0, node_fetch_1.default)(apiUrl, requestOptions);
            if (!response.ok) {
                // need to figure out how to send correct error message as not getting exact message from studio
                throw new Error('HID-SSI_SDK:: Error: Issue in generating did');
            }
            const { metaData } = yield response.json();
            return metaData.didDocument;
        });
    }
}
exports.DID = DID;
// const test = new DID("c4dae4b264f98798920ad22456c6f.acd24a3adeaed7fddf86044925d419afc252ada299b018e961ed3ac3ae2d1aaebd577eb0550c2c011fd9f51d33097d88a")
const test = new DID("586a74602fffda655f186ca9c162f.445dbab93f8b3b24501a9bdb1254de6a1528d4db306d87e2674f2277ddcc40a5b6686c4b2fe996ae11509d72eb4bb0d38");
console.log(test, "test");
