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
exports.CredentialRPC = void 0;
const constants_1 = require("../constants");
const generatedProto = __importStar(require("../../libs/generated/ssi/tx"));
const axios_1 = __importDefault(require("axios"));
const client_1 = require("../hid/client");
const utils_1 = __importDefault(require("../utils"));
const constants = __importStar(require("../constants"));
class CredentialRPC {
    constructor({ offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, }) {
        if (offlineSigner) {
            this.hidClient = new client_1.HIDClient(offlineSigner, nodeRpcEndpoint, nodeRestEndpoint);
        }
        else {
            this.hidClient = null;
        }
        this.nodeRestEp = nodeRestEndpoint;
        this.credentialRestEP =
            (client_1.HIDClient.hidNodeRestEndpoint ? client_1.HIDClient.hidNodeRestEndpoint : nodeRestEndpoint) +
                constants_1.HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hidClient) {
                throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
            }
            yield this.hidClient.init();
        });
    }
    registerCredentialStatus(credentialStatus, proof) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!credentialStatus) {
                throw new Error('CredentialStatus must be passed as a param while registerting credential status');
            }
            if (!proof) {
                throw new Error('Proof must be passed as a param while registering crdential status');
            }
            if (!this.hidClient) {
                throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
            }
            const typeUrl = `${constants_1.HID_COSMOS_MODULE}.${constants_1.HIDRpcEnums.MsgRegisterCredentialStatus}`;
            const txMessage = {
                typeUrl,
                value: generatedProto[constants_1.HIDRpcEnums.MsgRegisterCredentialStatus].fromPartial({
                    credentialStatusDocument: credentialStatus,
                    credentialStatusProof: proof,
                    txAuthor: client_1.HIDClient.getHidWalletAddress(),
                }),
            };
            const amount = yield utils_1.default.fetchFee(constants.GAS_FEE_METHODS.Register_Cred_Status, this.nodeRestEp);
            const fee = {
                amount: [
                    {
                        denom: 'uhid',
                        amount: amount,
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
    generateCredentialStatusTxnMessage(credentialStatus, proof) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!credentialStatus) {
                throw new Error('CredentialStatus must be passed as a param while registerting credential status');
            }
            if (!proof) {
                throw new Error('Proof must be passed as a param while registering crdential status');
            }
            const typeUrl = `${constants_1.HID_COSMOS_MODULE}.${constants_1.HIDRpcEnums.MsgRegisterCredentialStatus}`;
            const txMessage = {
                typeUrl,
                value: generatedProto[constants_1.HIDRpcEnums.MsgRegisterCredentialStatus].fromPartial({
                    credentialStatusDocument: credentialStatus,
                    credentialStatusProof: proof,
                    txAuthor: client_1.HIDClient.getHidWalletAddress(),
                }),
            };
            return txMessage;
        });
    }
    registerCredentialStatusBulk(txMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hidClient) {
                throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
            }
            const txLenght = txMessages.length;
            const amount = (txLenght * parseInt(yield utils_1.default.fetchFee(constants.GAS_FEE_METHODS.Register_Cred_Status, this.nodeRestEp))).toString();
            const fee = {
                amount: [
                    {
                        denom: 'uhid',
                        amount: amount,
                    },
                ],
                gas: '200000',
            };
            const hidClient = client_1.HIDClient.getHidClient();
            const txResult = yield hidClient.signAndBroadcast(client_1.HIDClient.getHidWalletAddress(), txMessages, fee);
            if (txResult.code !== 0) {
                throw new Error(`${txResult.rawLog}`);
            }
            return txResult;
        });
    }
    resolveCredentialStatus(credentialId) {
        return __awaiter(this, void 0, void 0, function* () {
            credentialId = credentialId + ':'; // TODO:  we need to sort this out ... need to remove later
            const get_didUrl = `${this.credentialRestEP}/${credentialId}`;
            let response;
            try {
                response = yield axios_1.default.get(get_didUrl);
                if (!response.data) {
                    throw new Error('Could not resolve credential status of credentialId ' + credentialId);
                }
                const credStatus = response.data.credentialStatus;
                if (!credStatus || !credStatus.credentialStatusDocument || !credStatus.credentialStatusProof) {
                    throw new Error('No credential status found. Probably invalid credentialId');
                }
                return credStatus;
            }
            catch (err) {
                const credStatus = {
                    claim: null,
                    issuer: '',
                    issuanceDate: '',
                    expirationDate: '',
                    credentialHash: '',
                    proof: null,
                };
                if (!credStatus || !credStatus.credentialStatusDocument || !credStatus.credentialStatusProof) {
                    throw new Error('No credential status found. Probably invalid credentialId');
                }
                return credStatus;
            }
        });
    }
    updateCredentialStatus(credentialStatus, proof) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!credentialStatus) {
                throw new Error('CredentialStatus must be passed as a param while registerting credential status');
            }
            if (!proof) {
                throw new Error('Proof must be passed as a param while registering crdential status');
            }
            if (!this.hidClient) {
                throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
            }
            const typeUrl = `${constants_1.HID_COSMOS_MODULE}.${constants_1.HIDRpcEnums.MsgUpdateCredentialStatus}`;
            const txMessage = {
                typeUrl,
                value: generatedProto[constants_1.HIDRpcEnums.MsgUpdateCredentialStatus].fromPartial({
                    credentialStatusDocument: credentialStatus,
                    credentialStatusProof: proof,
                    txAuthor: client_1.HIDClient.getHidWalletAddress(),
                }),
            };
            const amount = yield utils_1.default.fetchFee(constants.GAS_FEE_METHODS.Update_Cred_Status, this.nodeRestEp);
            const fee = {
                amount: [
                    {
                        denom: 'uhid',
                        amount: amount,
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
}
exports.CredentialRPC = CredentialRPC;
