"use strict";
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
const worker_threads_1 = require("worker_threads");
const v1_1 = __importDefault(require("../../../../libs/w3cache/v1"));
const babyjubjub2021_1 = require("babyjubjub2021");
const babyjubjubsignature2021_1 = require("babyjubjubsignature2021");
const jsonld_signatures_1 = __importDefault(require("jsonld-signatures"));
const jsonld_signatures_2 = require("jsonld-signatures");
const documentLoader = (0, jsonld_signatures_2.extendContextLoader)(v1_1.default);
const { Merklizer } = require('@iden3/js-jsonld-merklization');
const constant = __importStar(require("../../../constants"));
const { AssertionProofPurpose } = jsonld_signatures_1.default.purposes;
function _jsonLdSign(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const merkelizerObj = yield Merklizer.merklizeJSONLD(JSON.stringify(params.credential), {
            documentLoader,
        });
        let credentialHash = yield merkelizerObj.mt.root();
        credentialHash = Buffer.from(credentialHash.bytes).toString('hex');
        const credentialStatus = {
            '@context': [constant.VC.CREDENTIAL_STATUS_CONTEXT, constant.DID_BabyJubJubKey2021.BABYJUBJUBSIGNATURE],
            id: params.credential.id,
            issuer: params.credential.issuer,
            issuanceDate: params.credential.issuanceDate,
            remarks: 'Credential is active',
            credentialMerkleRootHash: credentialHash,
        };
        const { privateKeyMultibase, verificationMethodId } = params;
        const keyPair = babyjubjub2021_1.BabyJubJubKeys2021.fromKeys({
            options: { id: verificationMethodId, controller: verificationMethodId },
            privateKeyMultibase: privateKeyMultibase,
            publicKeyMultibase: params.publicKeyMultibase,
        });
        const suite = new babyjubjubsignature2021_1.BabyJubJubSignature2021Suite({ key: keyPair, verificationMethod: verificationMethodId });
        const signedCredStatus = yield jsonld_signatures_1.default.sign(credentialStatus, {
            suite,
            purpose: new AssertionProofPurpose(),
            documentLoader: v1_1.default,
        });
        return { credentialStatus, credProof: signedCredStatus.proof };
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield _jsonLdSign(worker_threads_1.workerData);
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ success: true, result });
    }
    catch (error) {
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({
            success: false,
            error,
        });
    }
}))();
