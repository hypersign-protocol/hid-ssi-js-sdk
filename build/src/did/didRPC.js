"use strict";
/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.DIDRpc = void 0;
const constants_1 = require("../constants");
const generatedProto = __importStar(require("../../libs/generated/ssi/tx"));
const axios_cache_interceptor_1 = require("axios-cache-interceptor");
const axios_1 = __importDefault(require("axios"));
const client_1 = require("../hid/client");
const utils_1 = __importDefault(require("../utils"));
const constants = __importStar(require("../constants"));
class DIDRpc {
    constructor({ offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, }) {
        if (offlineSigner) {
            this.hidClient = new client_1.HIDClient(offlineSigner, nodeRpcEndpoint, nodeRestEndpoint);
        }
        else {
            this.hidClient = null;
        }
        this.nodeRestEp = nodeRestEndpoint;
        this.didRestEp =
            (client_1.HIDClient.hidNodeRestEndpoint ? client_1.HIDClient.hidNodeRestEndpoint : nodeRestEndpoint) + constants_1.HYPERSIGN_NETWORK_DID_PATH;
        this.api = axios_1.default.create({
            baseURL: this.didRestEp,
        });
        this.axiosCache = (0, axios_cache_interceptor_1.setupCache)(this.api, {
            methods: ['get'],
            storage: (0, axios_cache_interceptor_1.buildMemoryStorage)(),
        });
    }
    getSigningStargateClient() {
        const client = client_1.HIDClient.getHidClient();
        if (!client) {
            throw new Error('HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
        }
        return client;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hidClient) {
                throw new Error('HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
            }
            yield this.hidClient.init();
        });
    }
    registerDID(didDoc, signInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hidClient) {
                throw new Error('HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
            }
            delete didDoc['proof'];
            const typeUrl = `${constants_1.HID_COSMOS_MODULE}.${constants_1.HIDRpcEnums.MsgRegisterDID}`;
            const txMessage = {
                typeUrl,
                value: generatedProto[constants_1.HIDRpcEnums.MsgRegisterDID].fromPartial({
                    didDocument: didDoc,
                    didDocumentProofs: signInfos,
                    txAuthor: client_1.HIDClient.getHidWalletAddress(),
                }),
            };
            const amount = yield utils_1.default.fetchFee(constants.GAS_FEE_METHODS.Register_Did, this.nodeRestEp);
            const fee = {
                amount: [
                    {
                        denom: 'uhid',
                        amount,
                    },
                ],
                gas: '200000',
            };
            const hidClient = client_1.HIDClient.getHidClient();
            const txResult = yield hidClient.signAndBroadcast(client_1.HIDClient.getHidWalletAddress(), [txMessage], fee);
            if (txResult.code !== 0) {
                throw new Error(`${txResult.rawLog}`);
            }
            return txResult;
        });
    }
    updateDID(didDoc, signInfos, versionId) {
        return __awaiter(this, void 0, void 0, function* () {
            delete didDoc['proof'];
            if (!this.hidClient) {
                throw new Error('HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
            }
            const typeUrl = `${constants_1.HID_COSMOS_MODULE}.${constants_1.HIDRpcEnums.MsgUpdateDID}`;
            const txMessage = {
                typeUrl,
                value: generatedProto[constants_1.HIDRpcEnums.MsgUpdateDID].fromPartial({
                    didDocument: didDoc,
                    didDocumentProofs: signInfos,
                    txAuthor: client_1.HIDClient.getHidWalletAddress(),
                    versionId: versionId,
                }),
            };
            const amount = yield utils_1.default.fetchFee(constants.GAS_FEE_METHODS.Update_Did, this.nodeRestEp);
            const fee = {
                amount: [
                    {
                        denom: 'uhid',
                        amount,
                    },
                ],
                gas: '200000',
            };
            const hidClient = this.getSigningStargateClient();
            const txResult = yield hidClient.signAndBroadcast(client_1.HIDClient.getHidWalletAddress(), [txMessage], fee);
            if (txResult.code !== 0) {
                throw new Error(`${txResult.rawLog}`);
            }
            return txResult;
        });
    }
    deactivateDID(did, signInfos, versionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hidClient) {
                throw new Error('HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
            }
            const typeUrl = `${constants_1.HID_COSMOS_MODULE}.${constants_1.HIDRpcEnums.MsgDeactivateDID}`;
            const txMessage = {
                typeUrl,
                value: generatedProto[constants_1.HIDRpcEnums.MsgDeactivateDID].fromPartial({
                    didDocumentId: did,
                    didDocumentProofs: signInfos,
                    txAuthor: client_1.HIDClient.getHidWalletAddress(),
                    versionId: versionId,
                }),
            };
            const amount = yield utils_1.default.fetchFee(constants.GAS_FEE_METHODS.Deactivate_Did, this.nodeRestEp);
            const fee = {
                amount: [
                    {
                        denom: 'uhid',
                        amount,
                    },
                ],
                gas: '200000',
            };
            const hidClient = client_1.HIDClient.getHidClient();
            const txResult = yield hidClient.signAndBroadcast(client_1.HIDClient.getHidWalletAddress(), [txMessage], fee);
            if (txResult.code !== 0) {
                throw new Error(`${txResult.rawLog}`);
            }
            return txResult;
        });
    }
    resolveDID(did) {
        return __awaiter(this, void 0, void 0, function* () {
            const get_didUrl = `${this.didRestEp}/${did}`;
            return new Promise((resolve, reject) => {
                this.axiosCache
                    .get(get_didUrl)
                    .then((response) => {
                    const didDoc = response.data;
                    resolve(didDoc);
                })
                    .catch((err) => {
                    if (err.response) {
                        console.error(err.response.data);
                    }
                    else {
                        console.error(err);
                    }
                    resolve({ didDocument: null, didDocumentMetadata: null });
                });
            });
        });
    }
}
exports.DIDRpc = DIDRpc;
