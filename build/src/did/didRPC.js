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
const axios_1 = __importDefault(require("axios"));
const client_1 = require("../hid/client");
class DIDRpc {
    constructor({ offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, }) {
        if (offlineSigner) {
            this.hidClient = new client_1.HIDClient(offlineSigner, nodeRpcEndpoint, nodeRestEndpoint);
        }
        else {
            this.hidClient = null;
        }
        this.didRestEp =
            (client_1.HIDClient.hidNodeRestEndpoint ? client_1.HIDClient.hidNodeRestEndpoint : nodeRestEndpoint) + constants_1.HYPERSIGN_NETWORK_DID_PATH;
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
            const typeUrl = `${constants_1.HID_COSMOS_MODULE}.${constants_1.HIDRpcEnums.MsgCreateDID}`;
            const txMessage = {
                typeUrl,
                value: generatedProto[constants_1.HIDRpcEnums.MsgCreateDID].fromPartial({
                    didDocString: didDoc,
                    signatures: signInfos,
                    creator: client_1.HIDClient.getHidWalletAddress(),
                }),
            };
            const fee = 'auto';
            const hidClient = client_1.HIDClient.getHidClient();
            const txResult = yield hidClient.signAndBroadcast(client_1.HIDClient.getHidWalletAddress(), [txMessage], fee);
            return txResult;
        });
    }
    updateDID(didDoc, signInfos, versionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hidClient) {
                throw new Error('HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
            }
            const typeUrl = `${constants_1.HID_COSMOS_MODULE}.${constants_1.HIDRpcEnums.MsgUpdateDID}`;
            const txMessage = {
                typeUrl,
                value: generatedProto[constants_1.HIDRpcEnums.MsgUpdateDID].fromPartial({
                    didDocString: didDoc,
                    signatures: signInfos,
                    creator: client_1.HIDClient.getHidWalletAddress(),
                    version_id: versionId,
                }),
            };
            // TODO: need to find a way to make it dynamic
            const fee = 'auto';
            const hidClient = client_1.HIDClient.getHidClient();
            const txResult = yield hidClient.signAndBroadcast(client_1.HIDClient.getHidWalletAddress(), [txMessage], fee);
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
                    didId: did,
                    signatures: signInfos,
                    creator: client_1.HIDClient.getHidWalletAddress(),
                    version_id: versionId,
                }),
            };
            // TODO: need to find a way to make it dynamic
            const fee = 'auto';
            const hidClient = client_1.HIDClient.getHidClient();
            const txResult = yield hidClient.signAndBroadcast(client_1.HIDClient.getHidWalletAddress(), [txMessage], fee);
            return txResult;
        });
    }
    resolveDID(did) {
        return __awaiter(this, void 0, void 0, function* () {
            did = did + ':'; // TODO:  we need to sort this out ... need to remove later
            const get_didUrl = `${this.didRestEp}/${did}`;
            let response;
            try {
                response = yield axios_1.default.get(get_didUrl);
                const didDoc = response.data;
                return didDoc;
            }
            catch (err) {
                return { didDocument: null, didDocumentMetadata: null };
            }
        });
    }
}
exports.DIDRpc = DIDRpc;
