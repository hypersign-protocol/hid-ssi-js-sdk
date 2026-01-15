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
const index_1 = require("../../index");
const web3_1 = __importDefault(require("web3"));
const crypto_1 = __importDefault(require("crypto"));
const ethers_1 = require("ethers");
const config_1 = require("../config");
const bip39 = __importStar(require("bip39"));
let hypersignDID;
const MMWalletAddress = "0x4457bCb9351c5677f892F9d8Be75493B8F7A7932";
let MMPrivateKey;
let MMPublicKey;
let offlineSigner;
let didDocumentByClientspec;
const metamaskProvider = 'https://linea-goerli.infura.io/v3/6014efc44d9346bcb69d99d97aa0ad27';
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
        // MMWalletAddress = account.address;
        MMPrivateKey = wallet.privateKey;
        MMPublicKey = wallet.publicKey;
    });
}
describe('DID Test scenarion for clientSpec', () => {
    describe('#createByClientSpec() this is to generate did using clientSpec', function () {
        const param = {
            methodSpecificId: "xyz",
            address: "xyz",
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
                didDocument: null
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to sign');
            });
        }));
        it('should not be able to generate signature as address is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec
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
                address: MMWalletAddress
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
                clientSpec: "xyz"
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is invalid');
            });
        }));
        it('should not be able to generate signature as web3 object is required but not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
                clientSpec: "eth-personalSign"
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.web3 is required to sign');
            });
        }));
        it('should not be able to generate signature as verificationMethodId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const web3 = new web3_1.default(metamaskProvider);
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
                web3,
                clientSpec: "eth-personalSign"
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to sign');
            });
        }));
        it('should not be able to generate signature as verificationMethodId passed is invalid or not presnet in didDoc', () => __awaiter(this, void 0, void 0, function* () {
            const web3 = new web3_1.default(metamaskProvider);
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
                web3,
                clientSpec: "eth-personalSign",
                verificationMethodId: didDocumentByClientspec.id + "e#key-1",
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI_SDK:: Error: invalid verificationMethodId");
            });
        }));
        it('should not be able to generate signature as clientSpec passed is of type "cosmos-ADR036" but chainId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const web3 = new web3_1.default(metamaskProvider);
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
                web3,
                verificationMethodId: didDocumentByClientspec.verificationMethod[0].id,
                clientSpec: "cosmos-ADR036"
            };
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error:  params.chainId is required to sign for clientSpec ${params.clientSpec} and keyType EcdsaSecp256k1VerificationKey2019`);
            });
        }));
        // it('Should be able to generate signature for didDoc', async () => {
        //     const web3 = new Web3(metamaskProvider)
        //     const params = {
        //         didDocument: didDocumentByClientspec,
        //         address: MMWalletAddress,//"0x4457bCb9351c5677f892F9d8Be75493B8F7A7932",
        //         clientSpec: "eth-personalSign",
        //         web3: web3,
        //         verificationMethodId: didDocumentByClientspec.verificationMethod[0].id,
        //     }
        //     const signedDidDocByClientSpec = await hypersignDID.signByClientSpec(params)
        //     // error Cannot read properties of undefined (reading 'eth')
        // })
    });
    describe("#registerByClientSpec() this is to register did generated using clientspec on the blockchain", function () {
        const signInfo = [{
                verification_method_id: "",
                clientSpec: undefined,
                signature: "rrnenf"
            }];
        const param = {
            didDocument: didDocumentByClientspec,
            signInfos: signInfo
        };
        it('should not be able to register did using registerByClientSpec() as didDocument is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const tempParams = Object.assign({}, param);
            tempParams.didDocument = {};
            const params = tempParams;
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: params.didDocString is required to register a did");
            });
        }));
        it('should not be able to register did using registerByClientSpec() as signInfos is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec
            };
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: params.signInfos is required to register a did");
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
        it('should not be able to register did using registerByClientSpec() as hypersign is not initialised with offlinesigner', () => __awaiter(this, void 0, void 0, function* () {
            const hypersignDid = new index_1.HypersignDID({
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            });
            yield hypersignDid.init().catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner");
            });
        }));
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
        it('should not be able to register did using registerByClientSpec() as signature is not passed in signInfo parameter', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: {},
                }
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            };
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].signature is required to register a did`);
            });
        }));
        // it('should be able to register did using registerByClientSpec()', async () => {
        //     const privateKey = MMPrivateKey
        //     const wallet = new Wallet(privateKey)
        //     const signature = await wallet.signMessage(JSON.stringify(didDocumentByClientspec))
        //     const signInfo = [
        //         {
        //             verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
        //             clientSpec: { type: 'eth-personalSign' },
        //             signature: signature
        //         }]
        //     const params = {
        //         didDocument: didDocumentByClientspec,
        //         signInfos: signInfo
        //     }
        //     const registerdDidDoc = await hypersignDID.registerByClientSpec(params)
        //     // console.log(registerdDidDoc)
        // })
    });
    describe('#signAndRegisterByClientSpec() this is to sign and register did using clientspec on the blockchain', function () {
        it('should not able to sign and register did as didDocument is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: null
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
                }).to.throw(Error, "HID-SSI-SDK:: Error:  params.clientSpec is required to sign");
            });
        }));
        it('should not be able to sign and register did as clientspec passed is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                clientSpec: "xyz"
            };
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: invalid clientSpec");
            });
        }));
        it('should not be able to sign and register did as verificationMethodId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                clientSpec: "eth-personalSign"
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
                clientSpec: "eth-personalSign",
                verificationMethodId: didDocumentByClientspec.verificationMethod[0].id
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
                clientSpec: "eth-personalSign",
                verificationMethodId: didDocumentByClientspec.verificationMethod[0].id,
                web3: web3
            };
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: params.address is required to sign a did");
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
                didDocument: null
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to update a did');
            });
        }));
        it('should not be able to updateDid as signInfos is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec
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
                signInfos: []
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            });
        }));
        it('should not be able to updateDid as verificationMethod is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [{
                    verification_method_id: "",
                    clientSpec: "xyz",
                    signature: "rrnenf"
                }];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].verification_method_id is required to register a did`);
            });
        }));
        it('should not be able to updateDid as invalid clientSpec is passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [{
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: "xyz" }
                }];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
            });
        }));
        it('should not be able to updateDid as signature is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [{
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: "eth-personalSign" },
                }];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].signature is required to register a did`);
            });
        }));
        it('should not be able to updateDid as clientSpec is of type "cosmos-ADR036" and adr036SignerAddress is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [{
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: "cosmos-ADR036" },
                }];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            };
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                var _a;
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].adr036SignerAddress is required to register a did, when clientSpec type is${(_a = params.signInfos[0].clientSpec) === null || _a === void 0 ? void 0 : _a.type} `);
            });
        }));
        it('should not be able to updateDid as versionId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [{
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: "eth-personalSign" },
                    signature: "xyz"
                }];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
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
                didDocument: null
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did');
            });
        }));
        it('should not be able to deactivate did as signInfos is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos is required to deactivate a did');
            });
        }));
        it('should not be able to deactivate did as signInfos passed is an empty array', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: []
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            });
        }));
        it('should not be able to deactivate did as verificationMethod is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [{
                    verification_method_id: "",
                    clientSpec: "xyz",
                    signature: "rrnenf"
                }];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].verification_method_id is required to deactivate a did`);
            });
        }));
        it('should not be able to deactivate did as invalid clientSpec is passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [{
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: "xyz" },
                }];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
            });
        }));
        it('should not be able to deactivate did as signature is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [{
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: "xyz",
                }];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].signature is required to deactivate a did`);
            });
        }));
        it('should not be able to deactivate did as clientSpec is of type "cosmos-ADR036" and adr036SignerAddress is not passed inside signInfos', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [{
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: "cosmos-ADR036" },
                }];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                var _a;
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].adr036SignerAddress is required to deactivate a did, when clientSpec type is${(_a = params.signInfos[0].clientSpec) === null || _a === void 0 ? void 0 : _a.type}`);
            });
        }));
        it('should not be able to deactivate did as versionId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const signInfo = [{
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: "eth-personalSign" },
                    signature: "xyz"
                }];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            };
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
            });
        }));
    });
});
