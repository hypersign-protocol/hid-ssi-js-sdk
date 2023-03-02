"use strict";
/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialRPC = void 0;
var constants_1 = require("../constants");
var generatedProto = __importStar(require("../../libs/generated/ssi/tx"));
var axios_1 = __importDefault(require("axios"));
var client_1 = require("../hid/client");
var CredentialRPC = /** @class */ (function () {
    function CredentialRPC(_a) {
        var offlineSigner = _a.offlineSigner, nodeRpcEndpoint = _a.nodeRpcEndpoint, nodeRestEndpoint = _a.nodeRestEndpoint;
        if (offlineSigner) {
            this.hidClient = new client_1.HIDClient(offlineSigner, nodeRpcEndpoint, nodeRestEndpoint);
        }
        else {
            this.hidClient = null;
        }
        this.credentialRestEP = client_1.HIDClient.hidNodeRestEndpoint + constants_1.HYPERSIGN_NETWORK_CREDENTIALSTATUS_PATH;
    }
    CredentialRPC.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hidClient) {
                            throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
                        }
                        return [4 /*yield*/, this.hidClient.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CredentialRPC.prototype.registerCredentialStatus = function (credentialStatus, proof) {
        return __awaiter(this, void 0, void 0, function () {
            var typeUrl, txMessage, fee, hidClient, txResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!credentialStatus) {
                            throw new Error('CredentialStatus must be passed as a param while registerting credential status');
                        }
                        if (!proof) {
                            throw new Error('Proof must be passed as a param while registering crdential status');
                        }
                        if (!this.hidClient) {
                            throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
                        }
                        typeUrl = "".concat(constants_1.HID_COSMOS_MODULE, ".").concat(constants_1.HIDRpcEnums.MsgRegisterCredentialStatus);
                        txMessage = {
                            typeUrl: typeUrl,
                            value: generatedProto[constants_1.HIDRpcEnums.MsgRegisterCredentialStatus].fromPartial({
                                credentialStatus: credentialStatus,
                                proof: proof,
                                creator: client_1.HIDClient.getHidWalletAddress(),
                            }),
                        };
                        fee = 'auto';
                        hidClient = client_1.HIDClient.getHidClient();
                        return [4 /*yield*/, hidClient.signAndBroadcast(client_1.HIDClient.getHidWalletAddress(), [txMessage], fee)];
                    case 1:
                        txResult = _a.sent();
                        return [2 /*return*/, txResult];
                }
            });
        });
    };
    CredentialRPC.prototype.generateCredentialStatusTxnMessage = function (credentialStatus, proof) {
        return __awaiter(this, void 0, void 0, function () {
            var typeUrl, txMessage;
            return __generator(this, function (_a) {
                if (!credentialStatus) {
                    throw new Error('CredentialStatus must be passed as a param while registerting credential status');
                }
                if (!proof) {
                    throw new Error('Proof must be passed as a param while registering crdential status');
                }
                typeUrl = "".concat(constants_1.HID_COSMOS_MODULE, ".").concat(constants_1.HIDRpcEnums.MsgRegisterCredentialStatus);
                txMessage = {
                    typeUrl: typeUrl,
                    value: generatedProto[constants_1.HIDRpcEnums.MsgRegisterCredentialStatus].fromPartial({
                        credentialStatus: credentialStatus,
                        proof: proof,
                        creator: client_1.HIDClient.getHidWalletAddress(),
                    }),
                };
                return [2 /*return*/, txMessage];
            });
        });
    };
    CredentialRPC.prototype.registerCredentialStatusBulk = function (txMessages) {
        return __awaiter(this, void 0, void 0, function () {
            var fee, hidClient, txResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hidClient) {
                            throw new Error('HID-SSI-SDK:: Error: CredentialRPC class is not initialise with offlinesigner');
                        }
                        fee = 'auto';
                        hidClient = client_1.HIDClient.getHidClient();
                        return [4 /*yield*/, hidClient.signAndBroadcast(client_1.HIDClient.getHidWalletAddress(), txMessages, fee)];
                    case 1:
                        txResult = _a.sent();
                        return [2 /*return*/, txResult];
                }
            });
        });
    };
    CredentialRPC.prototype.resolveCredentialStatus = function (credentialId) {
        return __awaiter(this, void 0, void 0, function () {
            var get_didUrl, response, credStatus, err_1, credStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        credentialId = credentialId + ':'; // TODO:  we need to sort this out ... need to remove later
                        get_didUrl = "".concat(this.credentialRestEP, "/").concat(credentialId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(get_didUrl)];
                    case 2:
                        response = _a.sent();
                        if (!response.data) {
                            throw new Error('Could not resolve credential status of credentialId ' + credentialId);
                        }
                        credStatus = response.data.credStatus;
                        if (!credStatus || !credStatus.claim || !credStatus.proof) {
                            throw new Error('No credential status found. Probably invalid credentialId');
                        }
                        return [2 /*return*/, credStatus];
                    case 3:
                        err_1 = _a.sent();
                        credStatus = {
                            claim: null,
                            issuer: '',
                            issuanceDate: '',
                            expirationDate: '',
                            credentialHash: '',
                            proof: null,
                        };
                        if (!credStatus || !credStatus.claim || !credStatus.proof) {
                            throw new Error('No credential status found. Probably invalid credentialId');
                        }
                        return [2 /*return*/, credStatus];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return CredentialRPC;
}());
exports.CredentialRPC = CredentialRPC;
