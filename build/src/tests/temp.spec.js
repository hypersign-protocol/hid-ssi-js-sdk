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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const config_1 = require("./config");
const enums_1 = require("../../libs/generated/ssi/client/enums");
let offlineSigner;
// let hypersignDID;
let hypersignBjjDID;
let hsSdk;
let privateKeyMultibase;
let publicKeyMultibase;
let didDocument;
let didDocId;
let verificationMethodId;
let didDocWithBjjVM;
let bjjPubKey;
let bjjPrivKey;
beforeEach(function () {
    return __awaiter(this, void 0, void 0, function* () {
        offlineSigner = yield (0, config_1.createWallet)(config_1.mnemonic);
        const params = {
            offlineSigner,
            nodeRestEndpoint: config_1.hidNodeEp.rest,
            nodeRpcEndpoint: config_1.hidNodeEp.rpc,
            namespace: config_1.hidNodeEp.namespace,
        };
        hsSdk = new index_1.HypersignSSISdk(params);
        yield hsSdk.init();
    });
});
describe('DID Test scenarios', () => {
    describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
        it('should return publickeyMultibase and privateKeyMultibase', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const kp = yield hsSdk.did.generateKeys();
                // const kp = await hsSdk.did.bjjDID.generateKeys();
                privateKeyMultibase = kp.privateKeyMultibase;
                publicKeyMultibase = kp.publicKeyMultibase;
                const bjjKp = yield hsSdk.did.bjjDID.generateKeys();
                bjjPubKey = bjjKp.publicKeyMultibase;
                bjjPrivKey = bjjKp.privateKeyMultibase;
            });
        });
    });
    describe('#generate() to generate did', function () {
        it('should not be able to generate and add bjj vm to did document', function () {
            return __awaiter(this, void 0, void 0, function* () {
                didDocument = yield hsSdk.did.generate({ publicKeyMultibase });
                // didDocument = await hsSdk.did.bjjDID.generate({ publicKeyMultibase });
                didDocId = didDocument['id'];
                verificationMethodId = didDocument['verificationMethod'][0].id;
                yield hsSdk.did.register({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId,
                });
                didDocWithBjjVM = yield hsSdk.did.addVerificationMethod({
                    didDocument,
                    type: enums_1.VerificationMethodTypes.BabyJubJubKey2021,
                    publicKeyMultibase: bjjPubKey,
                });
                const resolvedDid = yield hsSdk.did.resolve({ did: didDocId });
                delete didDocWithBjjVM.alsoKnownAs;
                const bjjSign = yield hsSdk.did.bjjDID.update({
                    didDocument: didDocWithBjjVM,
                    privateKeyMultibase: bjjPrivKey,
                    verificationMethodId: didDocWithBjjVM.verificationMethod[1].id,
                    versionId: resolvedDid.didDocumentMetadata.versionId,
                    readonly: true,
                });
                delete didDocWithBjjVM.verificationMethod[1].blockChainAccountId;
                const registerDid = yield hsSdk.did.update({
                    didDocument: didDocWithBjjVM,
                    privateKeyMultibase,
                    verificationMethodId,
                    versionId: resolvedDid.didDocumentMetadata.versionId,
                    otherSignInfo: bjjSign.signInfos,
                });
                console.log(registerDid, 'registeredDid');
            });
        });
    });
});
