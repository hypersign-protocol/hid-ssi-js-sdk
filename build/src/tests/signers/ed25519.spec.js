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
const Ed25519Signer_1 = __importDefault(require("../../v2.0/signers/ed25519/Ed25519Signer"));
const chai_1 = require("chai");
const TextMessage_1 = __importDefault(require("../../v2.0/signers/messages/TextMessage"));
const ed25519Signer = new Ed25519Signer_1.default({ controller: 'did:hid:123123123' });
function t() {
    const signer = ed25519Signer.initiate();
    console.log(signer);
}
//remove seed while creating did so that wallet can generate different did every time
describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const kp = yield ed25519Signer.initiate();
            console.log(kp);
            const message = new TextMessage_1.default('Hello');
            //   const m2 = new DidDocumentMessage()
            const signature = yield ed25519Signer.sign(message);
            console.log(signature);
            (0, chai_1.expect)(kp).to.be.a('object');
        });
    });
});
