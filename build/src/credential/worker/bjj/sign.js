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
const worker_threads_1 = require("worker_threads");
const jsonld_signatures_1 = __importDefault(require("jsonld-signatures"));
const babyjubjubsignature2021_1 = require("babyjubjubsignature2021");
const babyjubjub2021_1 = require("babyjubjub2021");
const jsonld_signatures_2 = require("jsonld-signatures");
const jsonld_signatures_3 = require("jsonld-signatures");
const v1_1 = __importDefault(require("../../../../libs/w3cache/v1"));
const documentLoader = (0, jsonld_signatures_3.extendContextLoader)(v1_1.default);
function signCredential(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyPair = babyjubjub2021_1.BabyJubJubKeys2021.fromKeys(params.keys);
        const suite = new babyjubjubsignature2021_1.BabyJubJubSignature2021Suite({
            key: keyPair,
            verificationMethod: params.publicKeyId,
        });
        const purpose = new jsonld_signatures_2.purposes.AssertionProofPurpose({
            controller: {
                '@context': ['https://www.w3.org/ns/did/v1'],
                id: params.issuerDID.id,
                assertionMethod: params.issuerDID.assertionMethod,
            },
        });
        return jsonld_signatures_1.default.sign(params.credential, {
            purpose,
            suite,
            documentLoader,
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield signCredential(worker_threads_1.workerData);
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ success: true, result });
    }
    catch (error) {
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({
            success: false,
            error,
        });
    }
}))();
