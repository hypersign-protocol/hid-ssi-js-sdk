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
const IDID_1 = require("../../../did/IDID");
const api_constant_1 = require("../../api-constant");
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
            if (!params.namespace) {
                throw new Error('HID-SSI-SDK:: Error: params.namespace is required to generate new did doc ');
            }
            const apiUrl = `${api_constant_1.APIENDPOINT.STUDIO_API_BASE_URL}${api_constant_1.APIENDPOINT.DID.CREATE_DID_ENDPOINT}`;
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.accessToken}`,
            };
            const requestOptions = {
                method: 'POST',
                headers,
                body: JSON.stringify(Object.assign({}, params)),
            };
            const response = yield (0, node_fetch_1.default)(apiUrl, requestOptions);
            const result = yield response.json();
            console.log(result);
            // need to add scenario of checking if token is expired or not
            // can be done either by directly call in studio-api and then based on error regenerate it
            // or add jwt package to validate its expiry
            if (!response.ok) {
                throw new Error(`HID-SSI-SDK:: Error: ${result.message}`);
            }
            const { metaData } = result;
            return metaData.didDocument;
        });
    }
    registerDid(params) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
                throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to register a did');
            }
            if (!params.signInfos) {
                if (!params.verificationMethodId) {
                    throw new Error('HID-SSI-SDK:: Error: either params.verificationMethodId or params.signInfos is required to register a did');
                }
            }
            if (params.signInfos && params.signInfos.length === 0) {
                throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to register a did');
            }
            if (params.signInfos && params.signInfos.length > 0) {
                for (const i in params.signInfos) {
                    if (!params.signInfos[i].verification_method_id) {
                        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to register a did`);
                    }
                    if (!params.signInfos[i].clientSpec) {
                        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].clientSpec is required to register a did`);
                    }
                    if (!(params.signInfos[i].clientSpec.type in IDID_1.IClientSpec)) {
                        throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is invalid');
                    }
                    if (((_a = params.signInfos[i].clientSpec) === null || _a === void 0 ? void 0 : _a.type) === IDID_1.IClientSpec['cosmos-ADR036']) {
                        if (((_b = params.signInfos[i].clientSpec) === null || _b === void 0 ? void 0 : _b.adr036SignerAddress) === '' ||
                            ((_c = params.signInfos[i].clientSpec) === null || _c === void 0 ? void 0 : _c.adr036SignerAddress) === undefined) {
                            throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].adr036SignerAddress is required to register a did, when clientSpec type is${(_d = params.signInfos[i].clientSpec) === null || _d === void 0 ? void 0 : _d.type} `);
                        }
                    }
                    if (!params.signInfos[i].signature) {
                        throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to register a did`);
                    }
                }
            }
            const apiUrl = `${api_constant_1.APIENDPOINT.STUDIO_API_BASE_URL}${api_constant_1.APIENDPOINT.DID.REGISTER_DID_ENDPOINT}`;
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.accessToken}`,
            };
            const requestOptions = {
                method: 'POST',
                headers,
                body: JSON.stringify(Object.assign({}, params)),
            };
            const response = yield (0, node_fetch_1.default)(apiUrl, requestOptions);
            const result = yield response.json();
            if (!response.ok) {
                throw new Error(`HID-SSI-SDK:: Error: ${result.message}`);
            }
            const { metaData } = result;
            return { didDocument: metaData.didDocument, transactionHash: result.transactionHash };
        });
    }
    resolveDid(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.did) {
                throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
            }
            const apiUrl = `${api_constant_1.APIENDPOINT.STUDIO_API_BASE_URL}${api_constant_1.APIENDPOINT.DID.RESOLVE_DID_ENDPOINT}/${params.did}`;
            const headers = {
                Authorization: `Bearer ${this.accessToken}`,
            };
            const requestOptions = {
                method: 'GET',
                headers,
            };
            const response = yield (0, node_fetch_1.default)(apiUrl, requestOptions);
            const result = yield response.json();
            if (!response.ok) {
                throw new Error(`HID-SSI-SDK:: Error: ${result.message}`);
            }
            return result;
        });
    }
}
exports.DID = DID;
