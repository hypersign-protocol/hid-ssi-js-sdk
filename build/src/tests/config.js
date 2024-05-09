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
exports.entityApiSecret = exports.signDid = exports.generateWeb3Obj = exports.metamaskProvider = exports.verifyPresentation = exports.generatePresentationProof = exports.createWallet = exports.makeCosmoshubPath = exports.hidNodeEp = exports.mnemonic = void 0;
const proto_signing_1 = require("@cosmjs/proto-signing");
const crypto_1 = require("@cosmjs/crypto");
const ethereumeip712signature2021suite_1 = require("ethereumeip712signature2021suite");
const jsonld_signatures_1 = require("jsonld-signatures");
const constants_1 = require("../constants");
const v1_1 = __importDefault(require("../../libs/w3cache/v1"));
const jcs_1 = require("jcs");
const web3_1 = __importDefault(require("web3"));
const jsonld_1 = __importDefault(require("jsonld"));
const crypto_2 = __importDefault(require("crypto"));
const enums_1 = require("../../libs/generated/ssi/client/enums");
const documentLoader = v1_1.default;
let keyPair;
exports.mnemonic = 'verify sustain lumber boat demise parade special soft bargain scout spoil there addict move badge rebuild horn achieve hollow acquire glide bundle curious present';
exports.hidNodeEp = {
    rpc: 'https://rpc.prajna.hypersign.id',
    rest: 'https://api.prajna.hypersign.id',
    namespace: 'testnet',
};
// export const hidNodeEp = {
//   rpc: 'http://127.0.0.1:26657',
//   rest: 'http://127.0.0.1:1317',
//   namespace: 'testnet',
// };
function makeCosmoshubPath(a) {
    return [
        crypto_1.Slip10RawIndex.hardened(44),
        crypto_1.Slip10RawIndex.hardened(118),
        crypto_1.Slip10RawIndex.hardened(0),
        crypto_1.Slip10RawIndex.normal(0),
        crypto_1.Slip10RawIndex.normal(a),
    ];
}
exports.makeCosmoshubPath = makeCosmoshubPath;
const phrase = 'flat vessel crawl guess female tray breeze bachelor rare fragile pottery observe';
const createWallet = (mnemonic) => __awaiter(void 0, void 0, void 0, function* () {
    let options;
    if (!mnemonic) {
        return yield proto_signing_1.DirectSecp256k1HdWallet.generate(24, (options = {
            prefix: 'hid',
            hdPaths: [makeCosmoshubPath(0)],
        }));
    }
    else {
        return yield proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, (options = {
            prefix: 'hid',
            hdPaths: [makeCosmoshubPath(0)],
        }));
    }
});
exports.createWallet = createWallet;
const generatePresentationProof = (presentation, challenge, holderDid, authentication, verificationMethodId, domain) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = yield (0, exports.generateWeb3Obj)();
    const EthereumEip712Signature2021obj = new ethereumeip712signature2021suite_1.EthereumEip712Signature2021({}, web3);
    keyPair = yield EthereumEip712Signature2021obj.fromPrivateKey('0x149195a4059ac8cafe2d56fc612f613b6b18b9265a73143c9f6d7cfbbed76b7e');
    const vcs = [];
    presentation.verifiableCredential.forEach((vc) => {
        return vcs.push(jcs_1.JCS.cannonicalize(vc));
    });
    presentation.verifiableCredential = vcs;
    const proof = yield EthereumEip712Signature2021obj.createProof({
        document: presentation,
        purpose: new jsonld_signatures_1.purposes.AuthenticationProofPurpose({
            challenge,
            domain: domain,
            controller: {
                '@context': constants_1.DID.CONTROLLER_CONTEXT,
                id: holderDid,
                authentication: authentication,
            },
        }),
        verificationMethod: verificationMethodId,
        date: new Date().toISOString(),
        documentLoader,
        domain: domain ? { name: domain } : undefined,
    });
    presentation.proof = proof;
    return presentation;
});
exports.generatePresentationProof = generatePresentationProof;
// will remove unused functions later
const verifyPresentation = (signedPresentaion, challenge, holderDid, domain) => __awaiter(void 0, void 0, void 0, function* () {
    const EthereumEip712Signature2021obj = new ethereumeip712signature2021suite_1.EthereumEip712Signature2021({});
    const proof = signedPresentaion.proof;
    delete signedPresentaion.proof;
    const verifResult = yield EthereumEip712Signature2021obj.verifyProof({
        proof: proof,
        domain: domain ? { name: domain } : undefined,
        document: signedPresentaion,
        types: 'EthereumEip712Signature2021',
        purpose: new jsonld_signatures_1.purposes.AuthenticationProofPurpose({
            challenge,
            domain: domain,
            controller: {
                '@context': constants_1.DID.CONTROLLER_CONTEXT,
                id: holderDid,
                authentication: [`${holderDid}#key-1`],
            },
        }),
        documentLoader: v1_1.default,
    });
    return verifResult;
});
exports.verifyPresentation = verifyPresentation;
function _jsonLdNormalize(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const docToNormalize = params.doc;
        const normalizedoc = yield jsonld_1.default.normalize(docToNormalize, {
            format: 'application/n-quads',
            algorithm: 'URDNA2015',
        });
        return normalizedoc;
    });
}
function _concat(arr1, arr2) {
    const concatenatedArr = new Uint8Array(arr1.length + arr2.length);
    concatenatedArr.set(arr1, 0);
    concatenatedArr.set(arr2, arr1.length);
    return concatenatedArr;
}
exports.metamaskProvider = 'https://linea-goerli.infura.io/v3/6014efc44d9346bcb69d99d97aa0ad27';
const generateWeb3Obj = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new web3_1.default.providers.HttpProvider(exports.metamaskProvider);
    const web3 = new web3_1.default(provider);
    return web3;
});
exports.generateWeb3Obj = generateWeb3Obj;
const signDid = (didDocument, clientSpec, verificationMethodId, account) => __awaiter(void 0, void 0, void 0, function* () {
    if (clientSpec == 'eth-personalSign') {
        const normalizedDidDoc = yield _jsonLdNormalize({ doc: didDocument });
        const normalizedDidDocHash = new Uint8Array(Buffer.from(crypto_2.default.createHash('sha256').update(normalizedDidDoc).digest('hex'), 'hex'));
        const proof = {
            '@context': didDocument['@context'],
            type: enums_1.ProofTypes.EcdsaSecp256k1RecoverySignature2020,
            created: new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z',
            verificationMethod: verificationMethodId,
            proofPurpose: enums_1.VerificationMethodRelationships.assertionMethod,
        };
        const normalizedProof = yield _jsonLdNormalize({ doc: proof });
        delete proof['@context'];
        const normalizedProofhash = new Uint8Array(Buffer.from(crypto_2.default.createHash('sha256').update(normalizedProof).digest('hex'), 'hex'));
        const combinedHash = _concat(normalizedProofhash, normalizedDidDocHash);
        const didDocJsonDigest = {
            didId: didDocument.id,
            didDocDigest: Buffer.from(combinedHash).toString('hex'),
        };
        const web3 = new web3_1.default();
        const signature = yield web3.eth.personal.sign(JSON.stringify(didDocJsonDigest, (key, value) => {
            if (value === '' || (Array.isArray(value) && value.length === 0)) {
                return undefined;
            }
            return value;
        }), account.address, account.privateKey);
        delete proof['@context'];
        proof['proofValue'] = signature;
        return proof;
    }
});
exports.signDid = signDid;
exports.entityApiSecret = '29a393a5d70094e409824359fc5d5.befc6c6f32d622e1c29ca900299a5695251b2407ca7cf6db8e6b2569dc13f937a4b83f4fa78738715d6267d3733e4f139';
// wallet address: hid1rh5h603fv9dneqm422uvl4xk3fc77a4uheleq5
