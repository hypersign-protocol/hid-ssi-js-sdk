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
const chai_1 = require("chai");
const index_1 = require("../index");
const web3_1 = __importDefault(require("web3"));
const crypto_1 = __importDefault(require("crypto"));
const ethers_1 = require("ethers");
const config_1 = require("./config");
const bip39 = __importStar(require("bip39"));
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let versionId;
let hypersignDID;
let hypersignDid;
let transactionHash;
let signedDocument;
const challenge = '1231231231';
const domain = 'www.adbv.com';
let hypersignSSISDK;
let MMWalletAddress; //= '0x7967C85D989c41cA245f1Bb54c97D42173B135E0';
let didDocumentByClientspec;
let signedDidDocByClientSpec;
let MMPrivateKey;
let MMPublicKey;
const metamaskProvider = 'https://linea-goerli.infura.io/v3/6014efc44d9346bcb69d99d97aa0ad27';
//const web3 = new Web3('https://mainnet.infura.io/v3/');
//add mnemonic of wallet that have balance
beforeEach(function () {
    return __awaiter(this, void 0, void 0, function* () {
        offlineSigner = yield (0, config_1.createWallet)(config_1.mnemonic);
        const params = {
            offlineSigner,
            nodeRestEndpoint: config_1.hidNodeEp.rest,
            nodeRpcEndpoint: config_1.hidNodeEp.rpc,
            namespace: config_1.hidNodeEp.namespace,
        };
        hypersignDID = new index_1.HypersignDID(params);
        yield hypersignDID.init();
    });
});
function generateSignature() {
    return __awaiter(this, void 0, void 0, function* () {
        const mnemonic = yield bip39.generateMnemonic(256, crypto_1.default.randomBytes);
        const Mnemonics = yield ethers_1.Mnemonic.fromPhrase(mnemonic);
        const wallet = yield ethers_1.HDNodeWallet.fromMnemonic(Mnemonics, `m/44'/60'/0'/0/${0}`);
        const web3 = new web3_1.default();
        const account = yield web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
        MMWalletAddress = account.address;
        MMPrivateKey = wallet.privateKey;
        MMPublicKey = wallet.publicKey;
    });
}
describe('DID Test scenarios', () => {
    //remove seed while creating did so that wallet can generate different did every time
    describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
        it('should return publickeyMultibase and privateKeyMultibase', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const kp = yield hypersignDID.generateKeys();
                privateKeyMultibase = kp.privateKeyMultibase;
                publicKeyMultibase = kp.publicKeyMultibase;
                (0, chai_1.expect)(kp).to.be.a('object');
                (0, chai_1.should)().exist(kp.privateKeyMultibase);
                (0, chai_1.should)().exist(kp.publicKeyMultibase);
                (0, chai_1.should)().not.exist(kp.id);
            });
        });
        it('should return publickeyMultibase and privateKeyMultibase along with controller', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const controller = 'did:hid:testnet:controller';
                const kpnew = yield hypersignDID.generateKeys({ controller });
                (0, chai_1.expect)(kpnew).to.be.a('object');
                (0, chai_1.should)().exist(kpnew.privateKeyMultibase);
                (0, chai_1.should)().exist(kpnew.publicKeyMultibase);
                (0, chai_1.should)().exist(kpnew.id);
                (0, chai_1.expect)(kpnew.id).to.be.equal(controller);
            });
        });
    });
    describe('#generate() to generate did', function () {
        it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
            return hypersignDID.generate({ publicKeyMultibase: '' }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
            });
        });
        it('should be able to generate didDocument', function () {
            return __awaiter(this, void 0, void 0, function* () {
                didDocument = yield hypersignDID.generate({ publicKeyMultibase });
                didDocId = didDocument['id'];
                verificationMethodId = didDocument['verificationMethod'][0].id;
                (0, chai_1.expect)(didDocument).to.be.a('object');
                (0, chai_1.should)().exist(didDocument['@context']);
                (0, chai_1.should)().exist(didDocument['id']);
                (0, chai_1.should)().exist(didDocument['controller']);
                (0, chai_1.should)().exist(didDocument['alsoKnownAs']);
                (0, chai_1.should)().exist(didDocument['verificationMethod']);
                (0, chai_1.expect)(didDocument['verificationMethod'] &&
                    didDocument['authentication'] &&
                    didDocument['assertionMethod'] &&
                    didDocument['keyAgreement'] &&
                    didDocument['capabilityInvocation'] &&
                    didDocument['capabilityDelegation'] &&
                    didDocument['service']).to.be.a('array');
                (0, chai_1.should)().exist(didDocument['authentication']);
                (0, chai_1.should)().exist(didDocument['assertionMethod']);
                (0, chai_1.should)().exist(didDocument['keyAgreement']);
                (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
                (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
                (0, chai_1.should)().exist(didDocument['service']);
            });
        });
        it('should be able to generate didDocument with passsed verification relationships (authentication and assertion) only', function () {
            return __awaiter(this, void 0, void 0, function* () {
                didDocument = yield hypersignDID.generate({
                    publicKeyMultibase,
                    verificationRelationships: ['authentication', 'assertionMethod'],
                });
                didDocId = didDocument['id'];
                verificationMethodId = didDocument['verificationMethod'][0].id;
                (0, chai_1.expect)(didDocument).to.be.a('object');
                (0, chai_1.should)().exist(didDocument['@context']);
                (0, chai_1.should)().exist(didDocument['id']);
                (0, chai_1.should)().exist(didDocument['controller']);
                (0, chai_1.should)().exist(didDocument['alsoKnownAs']);
                (0, chai_1.should)().exist(didDocument['verificationMethod']);
                (0, chai_1.expect)(didDocument['verificationMethod'] &&
                    didDocument['authentication'] &&
                    didDocument['assertionMethod'] &&
                    didDocument['keyAgreement'] &&
                    didDocument['capabilityInvocation'] &&
                    didDocument['capabilityDelegation'] &&
                    didDocument['service']).to.be.a('array');
                (0, chai_1.should)().exist(didDocument['authentication']);
                (0, chai_1.should)().exist(didDocument['assertionMethod']);
                (0, chai_1.expect)(didDocument['authentication'][0]).to.be.equal(verificationMethodId);
                (0, chai_1.expect)(didDocument['authentication']).to.be.a('array').of.length(1);
                (0, chai_1.expect)(didDocument['assertionMethod']).to.be.a('array').of.length(1);
                (0, chai_1.expect)(didDocument['keyAgreement']).to.be.a('array').of.length(0);
                (0, chai_1.expect)(didDocument['capabilityInvocation']).to.be.a('array').of.length(0);
                (0, chai_1.expect)(didDocument['service']).to.be.a('array').of.length(0);
                (0, chai_1.expect)(didDocument['capabilityDelegation']).to.be.a('array').of.length(0);
            });
        });
        it('should be able to generate didDocument with custom id', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const methodSpecificId = 'e157620d69d003e12d935c37b8c21baa78d24898398829b39d943d253c006332';
                const didDocument = yield hypersignDID.generate({ publicKeyMultibase, methodSpecificId });
                const didDocId = didDocument['id'];
                (0, chai_1.expect)(didDocument).to.be.a('object');
                (0, chai_1.expect)(didDocId).to.be.equal('did:hid:testnet:' + methodSpecificId);
                (0, chai_1.should)().exist(didDocument['@context']);
                (0, chai_1.should)().exist(didDocument['id']);
                (0, chai_1.should)().exist(didDocument['controller']);
                (0, chai_1.should)().exist(didDocument['alsoKnownAs']);
                (0, chai_1.should)().exist(didDocument['verificationMethod']);
                (0, chai_1.expect)(didDocument['verificationMethod'] &&
                    didDocument['authentication'] &&
                    didDocument['assertionMethod'] &&
                    didDocument['keyAgreement'] &&
                    didDocument['capabilityInvocation'] &&
                    didDocument['capabilityDelegation'] &&
                    didDocument['service']).to.be.a('array');
                (0, chai_1.should)().exist(didDocument['authentication']);
                (0, chai_1.should)().exist(didDocument['assertionMethod']);
                (0, chai_1.should)().exist(didDocument['keyAgreement']);
                (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
                (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
                (0, chai_1.should)().exist(didDocument['service']);
            });
        });
        it('should be able to generate didDocument with custom id using HypersignSSISDk instance', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const methodSpecificId = 'e157620d69d003e12d935c37b8c21baa78d24898398829b39d943d253c006332';
                const params = {
                    offlineSigner,
                    nodeRestEndpoint: config_1.hidNodeEp.rest,
                    nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                    namespace: config_1.hidNodeEp.namespace,
                };
                hypersignSSISDK = new index_1.HypersignSSISdk(params);
                yield hypersignSSISDK.init();
                hypersignDID = hypersignSSISDK.did;
                const didDocument = yield hypersignDID.generate({ publicKeyMultibase, methodSpecificId });
                const didDocId = didDocument['id'];
                (0, chai_1.expect)(didDocument).to.be.a('object');
                (0, chai_1.expect)(didDocId).to.be.equal('did:hid:testnet:' + methodSpecificId);
                (0, chai_1.should)().exist(didDocument['@context']);
                (0, chai_1.should)().exist(didDocument['id']);
                (0, chai_1.should)().exist(didDocument['controller']);
                (0, chai_1.should)().exist(didDocument['alsoKnownAs']);
                (0, chai_1.should)().exist(didDocument['verificationMethod']);
                (0, chai_1.expect)(didDocument['verificationMethod'] &&
                    didDocument['authentication'] &&
                    didDocument['assertionMethod'] &&
                    didDocument['keyAgreement'] &&
                    didDocument['capabilityInvocation'] &&
                    didDocument['capabilityDelegation'] &&
                    didDocument['service']).to.be.a('array');
                (0, chai_1.should)().exist(didDocument['authentication']);
                (0, chai_1.should)().exist(didDocument['assertionMethod']);
                (0, chai_1.should)().exist(didDocument['keyAgreement']);
                (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
                (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
                (0, chai_1.should)().exist(didDocument['service']);
            });
        });
    });
    describe('#register() this is to register did on the blockchain', function () {
        it('should not able to register did document and throw error as didDocument is not passed or it is empty', function () {
            return hypersignDID
                .register({ didDocument: {}, privateKeyMultibase, verificationMethodId })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocString is required to register a did');
            });
        });
        it('should not be able to register did document as privateKeyMultibase is null or empty', function () {
            return hypersignDID
                .register({ didDocument, privateKeyMultibase: '', verificationMethodId })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
            });
        });
        it('should not be able to register did document as verificationMethodId is null or empty', function () {
            return hypersignDID
                .register({ didDocument, privateKeyMultibase, verificationMethodId: '' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
            });
        });
        it('should be able to register didDocument in the blockchain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield hypersignDID.register({ didDocument, privateKeyMultibase, verificationMethodId });
                transactionHash = result.transactionHash;
                (0, chai_1.should)().exist(result.code);
                (0, chai_1.should)().exist(result.height);
                (0, chai_1.should)().exist(result.rawLog);
                (0, chai_1.should)().exist(result.transactionHash);
                (0, chai_1.should)().exist(result.gasUsed);
                (0, chai_1.should)().exist(result.gasWanted);
            });
        });
    });
    describe('#resolve() this is to resolve didDocument based on didDocId', function () {
        it('should not able to resolve did document and throw error didDocId is not passed', function () {
            return hypersignDID.resolve({ params: { did: '' } }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a did');
            });
        });
        it('should be able to resolve did', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    did: didDocId,
                };
                const result = yield hypersignDID.resolve(params);
                (0, chai_1.expect)(result).to.be.a('object');
                (0, chai_1.expect)(result.didDocument.id).to.be.equal(didDocId);
                (0, chai_1.expect)(result.didDocumentMetadata).to.be.a('object');
                versionId = result.didDocumentMetadata.versionId;
            });
        });
    });
    describe('#update() this is to update didDocument based on didDocId', function () {
        it('should not be able to update did document as privateKeyMultibase is null or empty', function () {
            return hypersignDID
                .update({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
            });
        });
        it('should not be able to update did document as verificationMethodId is null or empty', function () {
            return hypersignDID
                .update({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
            });
        });
        it('should not be able to update did document as versionId is null or empty', function () {
            return hypersignDID
                .update({ didDocument, privateKeyMultibase, verificationMethodId, versionId: '' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
            });
        });
        it('should not be able to update did document as versionId pased is incorrect', function () {
            const updateBody = { didDocument, privateKeyMultibase, verificationMethodId, versionId: '1.0.1' };
            didDocument['alsoKnownAs'].push('Random Data');
            return hypersignDID.update(updateBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${updateBody.versionId}: unexpected DID version`);
            });
        });
        it('should be able to update did document', function () {
            return __awaiter(this, void 0, void 0, function* () {
                didDocument['alsoKnownAs'].push('Some DATA');
                const result = yield hypersignDID.update({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId,
                    versionId,
                });
                (0, chai_1.should)().exist(result.code);
                (0, chai_1.should)().exist(result.height);
                (0, chai_1.should)().exist(result.rawLog);
                (0, chai_1.should)().exist(result.transactionHash);
                (0, chai_1.should)().exist(result.gasUsed);
                (0, chai_1.should)().exist(result.gasWanted);
            });
        });
    });
    describe('#resolve() did after updating did document', function () {
        it('should be able to resolve did', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    did: didDocId,
                };
                const result = yield hypersignDID.resolve(params);
                (0, chai_1.expect)(result).to.be.a('object');
                (0, chai_1.expect)(result.didDocument.id).to.be.equal(didDocId);
                (0, chai_1.expect)(result.didDocumentMetadata).to.be.a('object');
                (0, chai_1.expect)(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.not.equal(publicKeyMultibase);
                versionId = result.didDocumentMetadata.versionId;
            });
        });
        // should we able to get same publicKeyMultibase as generated in the begining in didDoc
        it('should be able to resolve did if params.ed25519verificationkey2020 is passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    did: didDocId,
                    ed25519verificationkey2020: true,
                };
                const result = yield hypersignDID.resolve(params);
                (0, chai_1.expect)(result).to.be.a('object');
                (0, chai_1.expect)(result.didDocument.id).to.be.equal(didDocId);
                (0, chai_1.expect)(result.didDocumentMetadata).to.be.a('object');
                (0, chai_1.expect)(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.equal(publicKeyMultibase);
                versionId = result.didDocumentMetadata.versionId;
            });
        });
        it('should be able to resolve DID even without offline signer passed to the constructor; making resolve RPC offchain activity', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const hypersignDID = new index_1.HypersignDID();
                const params = {
                    did: didDocId,
                    ed25519verificationkey2020: true,
                };
                const result = yield hypersignDID.resolve(params);
                (0, chai_1.expect)(result).to.be.a('object');
                (0, chai_1.expect)(result.didDocument.id).to.be.equal(didDocId);
                (0, chai_1.expect)(result.didDocumentMetadata).to.be.a('object');
                (0, chai_1.expect)(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.equal(publicKeyMultibase);
            });
        });
    });
    describe('#deactivate() this is to deactivate didDocument based on didDocId', function () {
        it('should not be able to deactivate did document as privateKeyMultibase is null or empty', function () {
            return hypersignDID
                .deactivate({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
            });
        });
        it('should not be able to deactivate did document as verificationMethodId is null or empty', function () {
            return hypersignDID
                .deactivate({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
            });
        });
        it('should not be able to deactivate did document as versionId is null or empty', function () {
            return hypersignDID
                .deactivate({ didDocument, privateKeyMultibase, verificationMethodId, versionId: '' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
            });
        });
        it('should not be able to deactivate did document as versionId pased is incorrect', function () {
            const deactivateBody = { didDocument, privateKeyMultibase, verificationMethodId, versionId: '1.0.1' };
            return hypersignDID.deactivate(deactivateBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${deactivateBody.versionId}: unexpected DID version`);
            });
        });
        it('should be able to deactivate did document', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield hypersignDID.deactivate({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId,
                    versionId,
                });
                (0, chai_1.should)().exist(result.code);
                (0, chai_1.should)().exist(result.height);
                (0, chai_1.should)().exist(result.rawLog);
                (0, chai_1.should)().exist(result.transactionHash);
                (0, chai_1.should)().exist(result.gasUsed);
                (0, chai_1.should)().exist(result.gasWanted);
            });
        });
    });
    describe('#sign() this is to sign didDoc', function () {
        const publicKey = {
            '@context': '',
            id: '',
            type: '',
            publicKeyBase58: '',
        };
        const controller = {
            '@context': '',
            id: '',
            authentication: [],
        };
        it('should not able to sign did document and throw error as privateKey is not passed or it is empty', function () {
            const params = {
                privateKeyMultibase: privateKeyMultibase,
                challenge: challenge,
                domain: domain,
                did: didDocId,
                didDocument: didDocument,
                verificationMethodId: verificationMethodId,
                publicKey,
                controller,
            };
            params.privateKeyMultibase = '';
            return hypersignDID.sign(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKey is required to sign a did');
            });
        });
        it('should not able to sign did document and throw error as challenge is not passed or it is empty', function () {
            const params = {
                privateKeyMultibase: privateKeyMultibase,
                challenge: challenge,
                domain: domain,
                did: didDocId,
                didDocument: didDocument,
                verificationMethodId: verificationMethodId,
                publicKey,
                controller,
            };
            params.challenge = '';
            return hypersignDID.sign(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.challenge is required to sign a did');
            });
        });
        it('should not able to sign did document and throw error as domain is not passed or it is empty', function () {
            const params = {
                privateKeyMultibase: privateKeyMultibase,
                challenge: challenge,
                domain: domain,
                did: didDocId,
                didDocument: didDocument,
                verificationMethodId: verificationMethodId,
                publicKey,
                controller,
            };
            params.domain = '';
            return hypersignDID.sign(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.domain is required to sign a did');
            });
        });
        it('should not able to sign did document and throw error as did is not resolved', function () {
            const params = {
                privateKeyMultibase: privateKeyMultibase,
                challenge: challenge,
                domain: domain,
                did: didDocId,
                didDocument: didDocument,
                verificationMethodId: verificationMethodId,
                publicKey,
                controller,
            };
            return hypersignDID.sign(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: could not resolve did ${params.did}`);
            });
        });
        it('should not able to sign did document and throw error as verificationMethodId is invalid or wrong', function () {
            const params = {
                privateKeyMultibase: privateKeyMultibase,
                challenge: challenge,
                domain: domain,
                did: '',
                didDocument: didDocument,
                verificationMethodId: verificationMethodId,
                publicKey,
                controller,
            };
            params.verificationMethodId = '';
            return hypersignDID.sign(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: Incorrect verification method id');
            });
        });
        it('should able to sign did document', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    privateKeyMultibase: privateKeyMultibase,
                    challenge: challenge,
                    domain: domain,
                    did: '',
                    didDocument: didDocument,
                    verificationMethodId: verificationMethodId,
                    controller,
                };
                signedDocument = yield hypersignDID.sign(params);
                (0, chai_1.expect)(signedDocument).to.be.a('object');
                (0, chai_1.should)().exist(signedDocument['@context']);
                (0, chai_1.should)().exist(signedDocument['id']);
                (0, chai_1.expect)(didDocId).to.be.equal(signedDocument['id']);
                (0, chai_1.should)().exist(signedDocument['controller']);
                (0, chai_1.should)().exist(signedDocument['alsoKnownAs']);
                (0, chai_1.should)().exist(signedDocument['verificationMethod']);
                (0, chai_1.should)().exist(signedDocument['authentication']);
                (0, chai_1.should)().exist(signedDocument['assertionMethod']);
                (0, chai_1.should)().exist(signedDocument['keyAgreement']);
                (0, chai_1.should)().exist(signedDocument['capabilityInvocation']);
                (0, chai_1.should)().exist(signedDocument['capabilityDelegation']);
                (0, chai_1.should)().exist(signedDocument['service']);
                (0, chai_1.should)().exist(signedDocument['proof']);
            });
        });
    });
    describe('#verify() method to verify did document', function () {
        it('should not able to verify did document and throw error as verificationMethodId is not passed or it is empty', function () {
            return hypersignDID
                .verify({ didDocument: signedDocument, verificationMethodId: '', challenge, domain })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to verify a did');
            });
        });
        it('should not able to verify did document and throw error as challenge is not passed or it is empty', function () {
            return hypersignDID
                .verify({ didDocument: signedDocument, verificationMethodId, challenge: '', domain })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.challenge is required to verify a did');
            });
        });
        it('should return verification result', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield hypersignDID.verify({
                    didDocument: signedDocument,
                    verificationMethodId,
                    challenge,
                    domain,
                });
                (0, chai_1.expect)(result).to.be.a('object');
                (0, chai_1.should)().exist(result);
                (0, chai_1.should)().exist(result.verified);
                (0, chai_1.should)().exist(result.results);
                (0, chai_1.expect)(result.results).to.be.a('array');
                (0, chai_1.expect)(result.verified).to.equal(true);
            });
        });
        it('should not able to verify did document and throw error as unknown verification method id is passed', function () {
            const verMethIdMod = verificationMethodId + 'somerandomtext';
            return hypersignDID
                .verify({ didDocument: signedDocument, verificationMethodId: verMethIdMod, challenge, domain })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: could not find verification method for verificationMethodId: ' +
                    verMethIdMod +
                    ' in did document');
            });
        });
        it('should not able to verify did document and throw error as proof is not present in the signedDID doc', function () {
            const signedDIDDoc = signedDocument;
            delete signedDIDDoc['proof'];
            return hypersignDID
                .verify({ didDocument: signedDIDDoc, verificationMethodId, challenge, domain })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument.proof is not present in the signed did document');
            });
        });
    });
    describe('#createByClientSpec() this is to generate did using clientSpec', function () {
        const param = {
            methodSpecificId: 'xyz',
            address: 'xyz',
            chainId: '0x1',
            clientSpec: 'eth-personalSign',
        };
        it('should not be able to create did using clientSpec as methodSpecificId is null or empty', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.methodSpecificId = '';
            const params = tempParams;
            return hypersignDID.createByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.methodSpecificId is required to create didoc');
            });
        }));
        it('Should not be able to create did using clientSpec as address is null or empty', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.address = '';
            const params = tempParams;
            return hypersignDID.createByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.address is required to create didoc');
            });
        }));
        it('should not be able to create did using clientSpec as chainId is null or empty', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.chainId = '';
            const params = tempParams;
            return hypersignDID.createByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.chainId is required to create didoc');
            });
        }));
        it('should not be able to create did using clientSpec as clientSpec is null or empty', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.clientSpec = '';
            const params = tempParams;
            return hypersignDID.createByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is required to create didoc');
            });
        }));
        it('should not be able to create did using clientSpec as clientSpec passed is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.clientSpec = 'xyz';
            const params = tempParams;
            return hypersignDID.createByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is invalid');
            });
        }));
        it('should not be able to create did using clientSpec as clientSpec is of type "cosmos-ADR036" but publicKey is not passed ', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.clientSpec = 'cosmos-ADR036';
            const params = tempParams;
            return hypersignDID.createByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKey is required to create didoc for EcdsaSecp256k1VerificationKey2019');
            });
        }));
        it('should not be able to create did using clientSpec as clientSpec is of type "cosmos-ADR036" and invalid public key is passed', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.clientSpec = 'cosmos-ADR036';
            tempParams['publicKey'] = 'xyzt';
            const params = tempParams;
            return hypersignDID.createByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKey mustbe multibase encoded base58 string for EcdsaSecp256k1VerificationKey2019');
            });
        }));
        it('should be able to create did using clientSpec', () => __awaiter(this, void 0, void 0, function* () {
            yield generateSignature();
            const tempParams = Object.assign({}, param);
            tempParams.address = MMWalletAddress;
            tempParams.methodSpecificId = MMWalletAddress;
            const params = tempParams;
            didDocumentByClientspec = yield hypersignDID.createByClientSpec(params);
            (0, chai_1.expect)(didDocumentByClientspec).to.be.a('object');
            (0, chai_1.should)().exist(didDocumentByClientspec['@context']);
            (0, chai_1.should)().exist(didDocumentByClientspec['id']);
            (0, chai_1.should)().exist(didDocumentByClientspec['controller']);
            (0, chai_1.should)().exist(didDocumentByClientspec['alsoKnownAs']);
            (0, chai_1.should)().exist(didDocumentByClientspec['verificationMethod']);
            (0, chai_1.expect)(didDocumentByClientspec['verificationMethod'] &&
                didDocumentByClientspec['authentication'] &&
                didDocumentByClientspec['assertionMethod'] &&
                didDocumentByClientspec['keyAgreement'] &&
                didDocumentByClientspec['capabilityInvocation'] &&
                didDocumentByClientspec['capabilityDelegation']).to.be.a('array');
            (0, chai_1.should)().exist(didDocumentByClientspec['authentication']);
            (0, chai_1.should)().exist(didDocumentByClientspec['assertionMethod']);
            (0, chai_1.should)().exist(didDocumentByClientspec['keyAgreement']);
            (0, chai_1.should)().exist(didDocumentByClientspec['capabilityInvocation']);
            (0, chai_1.should)().exist(didDocumentByClientspec['capabilityDelegation']);
        }));
    });
    describe('#signByClientSpec() this is to generate signature of the didDoc', function () {
        it('should not be able to generate signature as didDocument is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: null,
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to sign');
            });
        }));
        it('should not be able to generate signature as address is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.address is required to sign a did');
            });
        }));
        it('should not be able to generate signature as clientSpec is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is required to sign');
            });
        }));
        it('should not be able to generate signature as clientSpec passed is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
                clientSpec: 'xyz',
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is invalid');
            });
        }));
        it('should not be able to generate signature as clientSpec passed is of type "cosmos-ADR036" but chainId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
                clientSpec: 'cosmos-ADR036',
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error:  params.chainId is required to sign for clientSpec ${params.clientSpec} and keyType EcdsaSecp256k1VerificationKey2019`);
            });
        }));
        it('should not be able to generate signature as web3 object is required but not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
                clientSpec: 'eth-personalSign',
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.web3 is required to sign');
            });
        }));
        // it('Should be able to generate signature for didDoc', async()=>{
        //   const web3= new Web3(metamaskProvider)
        //   console.log(web3.eth.personal.sign)
        //   const params={
        //     didDocument:didDocumentByClientspec,
        //     address:MMWalletAddress,
        //     clientSpec:"eth-personalSign",
        //     web3:web3
        //   }
        //   const signedDidDocByClientSpec= await hypersignDID.signByClientSpec(params)
        //   console.log(signedDidDocByClientSpec)
        //   // error Cannot read properties of undefined (reading 'eth')
        // })
    });
    describe('#registerByClientSpec() this is to register did generated using clientspec on the blockchain', function () {
        const signInfo = [
            {
                verification_method_id: '',
                clientSpec: 'xyz',
                signature: 'rrnenf',
            },
        ];
        const param = {
            didDocument: didDocumentByClientspec,
            signInfos: signInfo,
        };
        it('should not be able to register did using registerByClientSpec() as didDocument is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.didDocument = {};
            const params = tempParams;
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocString is required to register a did');
            });
        }));
        it('should not be able to register did using registerByClientSpec() as signInfos is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
            };
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos is required to register a did');
            });
        }));
        it('should not be able to register did using registerByClientSpec() as signInfos is an empty array', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.didDocument = didDocumentByClientspec;
            tempParams.signInfos = [];
            const params = tempParams;
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            });
        }));
        // it('should not be able to register did using registerByClientSpec() as hypersign is not initialised with offlinesigner', async ()=>{
        //   const tempParams= {...param}
        //   tempParams.didDocument=didDocumentByClientspec
        //   tempParams.signInfos[0].verification_method_id=""
        //   const params=tempParams
        //   hypersignDid= new HypersignDID();
        //   await hypersignDid.init()
        //   return hypersignDid.registerByClientSpec(params).catch(function (err){
        //     expect(function (){
        //       throw err;
        //     }).to.throw(Error,"HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner")
        //   })
        // })
        it('should not be able to register did using registerByClientSpec() as verificationMethodId is not passed in signInfo parameter', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.didDocument = didDocumentByClientspec;
            tempParams.signInfos = signInfo;
            const params = tempParams;
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].verification_method_id is required to register a did`);
            });
        }));
        it('should not be able to register did using registerByClientSpec() as clientSpec is not passed in signInfo parameter', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    signature: 'cdf',
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is required to register a did`);
            });
        }));
        it('should not be able to register did using registerByClientSpec() as clientSpec passed in signInfo parameter is not valid', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: 'xyz' },
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
            });
        }));
        it('should not be able to register did using registerByClientSpec() as signature is not passed in signInfo parameter', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: {},
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].signature is required to register a did`);
            });
        }));
        it('should be able to register did using registerByClientSpec()', () => __awaiter(this, void 0, void 0, function* () {
            const privateKey = MMPrivateKey;
            const wallet = new ethers_1.Wallet(privateKey);
            const signature = yield wallet.signMessage(JSON.stringify(didDocumentByClientspec));
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: 'eth-personalSign' },
                    signature: signature,
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            const registerdDidDoc = yield hypersignDID.registerByClientSpec(params);
            // console.log(registerdDidDoc)
        }));
    });
    describe('#signAndRegisterByClientSpec() this is to sign and register did using clientspec on the blockchain', function () {
        it('should not able to sign and register did as didDocument is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: null,
            };
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocString is required to register a did');
            });
        }));
        it('should not be able to sign and register did as clientSpec is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
            };
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is required to sign');
            });
        }));
        it('should not be able to sign and register did as clientspec passed is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                clientSpec: 'xyz',
            };
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: invalid clientSpec');
            });
        }));
        it('should not be able to sign and register did as verificationMethodId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                clientSpec: 'eth-personalSign',
            };
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
            });
        }));
        it('should not be able to sign and register did as web3 is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                clientSpec: 'eth-personalSign',
                verificationMethodId: didDocumentByClientspec.verificationMethod[0].id,
            };
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.web should be passed');
            });
        }));
        it('should not be able to sign and register did as address is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const web3 = new web3_1.default(metamaskProvider);
            const params = {
                didDocument: didDocumentByClientspec,
                clientSpec: 'eth-personalSign',
                verificationMethodId: didDocumentByClientspec.verificationMethod[0].id,
                web3: web3,
            };
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.address is required to sign a did');
            });
        }));
        // it('should be able to sign and register did', async ()=>{
        //   const web3= new Web3(metamaskProvider)
        //   const params={
        //     didDocument:didDocumentByClientspec,
        //     clientSpec:"eth-personalSign",
        //     verificationMethodId:didDocumentByClientspec.verificationMethod[0].id,
        //     web3:web3,
        //     address:MMWalletAddress
        //   }
        //   const regDId= await hypersignDID.signAndRegisterByClientSpec(params)
        //   console.log(regDId)
        // Error: Returned error: The method personal_sign does not exist/is not available
        //})
    });
    describe('#updateByClientSpec() this is for updating didDocument', function () {
        it('should not be able to updateDid as didDocument is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: null,
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to update a did');
            });
        }));
        it('should not be able to updateDid as signInfos is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos is required to register a did');
            });
        }));
        it('should not be able to updateDid as signInfos passed is an empty array', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: [],
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            });
        }));
        it('should not be able to updateDid as verificationMethod is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: '',
                    clientSpec: 'xyz',
                    signature: 'rrnenf',
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].verification_method_id is required to register a did`);
            });
        }));
        it('should not be able to updateDid as clientSpec is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    signature: 'rrnenf',
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is required to register a did`);
            });
        }));
        it('should not be able to updateDid as invalid clientSpec is passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: 'xyz',
                    // signature:"rrnenf"
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
            });
        }));
        it('should not be able to updateDid as signature is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: 'xyz',
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].signature is required to register a did`);
            });
        }));
        it('should not be able to updateDid as clientSpec is of type "cosmos-ADR036" and adr036SignerAddress is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: 'cosmos-ADR036' },
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                var _a;
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].adr036SignerAddress is required to register a did, when clientSpec type is${(_a = params.signInfos[0].clientSpec) === null || _a === void 0 ? void 0 : _a.type} `);
            });
        }));
        it('should not be able to updateDid as versionId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: 'eth-personalSign' },
                    signature: 'xyz',
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
            });
        }));
    });
    describe('#deactivateByClientSpec() this is for deactivating didDocument', function () {
        it('should not be able to deactivate did as didDocument is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: null,
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did');
            });
        }));
        it('should not be able to deactivate did as signInfos is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos is required to register a did');
            });
        }));
        it('should not be able to deactivate did as signInfos passed is an empty array', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: [],
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            });
        }));
        it('should not be able to deactivate did as verificationMethod is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: '',
                    clientSpec: 'xyz',
                    signature: 'rrnenf',
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].verification_method_id is required to register a did`);
            });
        }));
        it('should not be able to deactivate did as clientSpec is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    signature: 'rrnenf',
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is required to register a did`);
            });
        }));
        it('should not be able to deactivate did as invalid clientSpec is passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: 'xyz',
                    // signature:"rrnenf"
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
            });
        }));
        it('should not be able to deactivate did as signature is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: 'xyz',
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].signature is required to register a did`);
            });
        }));
        it('should not be able to deactivate did as clientSpec is of type "cosmos-ADR036" and adr036SignerAddress is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: 'cosmos-ADR036' },
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                var _a;
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].adr036SignerAddress is required to register a did, when clientSpec type is${(_a = params.signInfos[0].clientSpec) === null || _a === void 0 ? void 0 : _a.type} `);
            });
        }));
        it('should not be able to deactivate did as versionId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: 'eth-personalSign' },
                    signature: 'xyz',
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
            });
        }));
    });
});
// error in deactivate it should be to deactivae a did but mentioned is register a did
// some validation is missing for web3, clientSpec type in some cases
