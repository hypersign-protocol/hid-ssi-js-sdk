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
const chai_1 = require("chai");
const index_1 = require("../../index");
const config_1 = require("../config");
const enums_1 = require("../../../libs/generated/ssi/client/enums");
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let versionId;
let hypersignDID;
let transactionHash;
let signedDocument;
let signedDocumentAssertion;
const challenge = '1231231231';
const domain = 'www.adbv.com';
let hypersignSSISDK;
let pubKey;
let privKey;
let didDocToReg;
let DIdDOcWithMultiplVM;
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
        it('should be able to generate didDocument with different kp', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const kp = yield hypersignDID.generateKeys();
                privKey = kp.privateKeyMultibase;
                pubKey = kp.publicKeyMultibase;
                didDocToReg = yield hypersignDID.generate({ publicKeyMultibase: pubKey });
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
    describe('#addVerificationMethod() to add verificationMethod in didDocument', function () {
        it('should not be able to add verificationMethod as neither did nor didDoc is passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: {},
                type: 'X25519KeyAgreementKey2020',
                id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
                publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
            };
            return hypersignDID.addVerificationMethod(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI_SDK:: Error: params.did or params.didDocument is required to addVerificationMethod');
            });
        }));
        it('should not be able to add verificationMethod as type is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument,
                id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
                publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
            };
            return hypersignDID.addVerificationMethod(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.type is required to addVerificationMethod');
            });
        }));
        it('should not be able to add verificationMethod as type passed is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument,
                type: 'dsyifx',
                id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
                publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
            };
            return hypersignDID.addVerificationMethod(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.type is invalid');
            });
        }));
        it('should not be able to add verificationMethod as params.did is passed but yet not registerd', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                did: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY',
                type: enums_1.VerificationMethodTypes.Ed25519VerificationKey2020,
                id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
                publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
            };
            const hypersignDid = new index_1.HypersignDID({ namespace: 'testnet' });
            return hypersignDid.addVerificationMethod(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: could not resolve did ${params.did}`);
            });
        }));
        it('should not be able to add verificationMethod in didDocument as type is EcdsaSecp256k1RecoveryMethod2020 but blockchainAccountId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument,
                type: 'EcdsaSecp256k1RecoveryMethod2020',
                id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
                publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
            };
            return hypersignDID.addVerificationMethod(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.blockchainAccountId is required for keyType ${params.type}`);
            });
        }));
        it('should not be able to add verificationMethod in didDocument as type is EcdsaSecp256k1RecoveryMethod2020 but params.id is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument,
                type: 'EcdsaSecp256k1RecoveryMethod2020',
                publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
                blockchainAccountId: 'eip155:1:23fer44374u3rmhvf47ri35ty',
            };
            return hypersignDID.addVerificationMethod(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.id is required for keyType ${params.type}`);
            });
        }));
        it('should not be able to add verificationMethod in didDocument as type is EcdsaSecp256k1VerificationKey2019 but neither params.blockchainAccountId nor params.publicKeyMultibase is passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument,
                type: 'EcdsaSecp256k1VerificationKey2019',
                id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
            };
            return hypersignDID.addVerificationMethod(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.blockchainAccountId and params.publicKeyMultibase is required for keyType ${params.type}`);
            });
        }));
        it('should not be able to add verificationMethod in didDocument as type is EcdsaSecp256k1VerificationKey2019 params.publicKeyMultibase is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument,
                type: 'EcdsaSecp256k1VerificationKey2019',
                id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
                blockchainAccountId: 'eip155:1:23fer44374u3rmhvf47ri35ty',
            };
            return hypersignDID.addVerificationMethod(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.blockchainAccountId and params.publicKeyMultibase is required for keyType ${params.type}`);
            });
        }));
        it('should not be able to add verificationMethod in didDocument as type is EcdsaSecp256k1VerificationKey2019 params.blockchainAccountId is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument,
                type: 'EcdsaSecp256k1VerificationKey2019',
                id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
                blockchainAccountId: 'eip155:1:23fer44374u3rmhvf47ri35ty',
            };
            return hypersignDID.addVerificationMethod(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.blockchainAccountId and params.publicKeyMultibase is required for keyType ${params.type}`);
            });
        }));
        it('Should not be able to add verification method to didDocument as it is already exists', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocument,
                type: 'X25519KeyAgreementKey2020',
                id: `${didDocument.verificationMethod[0].id}`,
                publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
            };
            return hypersignDID.addVerificationMethod(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: verificationMethod ${params.id} already exists`);
            });
        }));
        // it('should be able to add verification method of type X25519KeyAgreementKey2020 in didDocument', async () => {
        //   const params = {
        //     didDocument: didDocument,
        //     type: 'X25519KeyAgreementKey2020',
        //     publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
        //   };
        //   const didDoc = JSON.parse(JSON.stringify(didDocument));
        //   const updatedDidDoc = await hypersignDID.addVerificationMethod({ ...params });
        //   expect(updatedDidDoc).to.be.a('object');
        //   should().exist(updatedDidDoc['@context']);
        //   should().exist(updatedDidDoc['id']);
        //   should().exist(updatedDidDoc['controller']);
        //   should().exist(updatedDidDoc['alsoKnownAs']);
        //   should().exist(updatedDidDoc['verificationMethod']);
        //   expect(
        //     updatedDidDoc['verificationMethod'] &&
        //     updatedDidDoc['authentication'] &&
        //     updatedDidDoc['assertionMethod'] &&
        //     updatedDidDoc['keyAgreement'] &&
        //     updatedDidDoc['capabilityInvocation'] &&
        //     updatedDidDoc['capabilityDelegation'] &&
        //     updatedDidDoc['service']
        //   ).to.be.a('array');
        //   should().exist(updatedDidDoc['authentication']);
        //   should().exist(updatedDidDoc['assertionMethod']);
        //   expect(updatedDidDoc.verificationMethod.length).to.be.greaterThan(didDoc.verificationMethod.length);
        // });
        it('should be able to add verification method in didDocument without offlinesigner', () => __awaiter(this, void 0, void 0, function* () {
            const hypersignDid = new index_1.HypersignDID({ namespace: 'testnet' });
            const didDoc = JSON.parse(JSON.stringify(didDocument));
            const params = {
                didDocument: didDoc,
                type: enums_1.VerificationMethodTypes.X25519KeyAgreementKey2020,
                publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
            };
            const testDidDoc = yield hypersignDid.addVerificationMethod(params);
            (0, chai_1.expect)(testDidDoc).to.be.a('object');
            (0, chai_1.should)().exist(testDidDoc['@context']);
            (0, chai_1.should)().exist(testDidDoc['id']);
            (0, chai_1.should)().exist(testDidDoc['controller']);
            (0, chai_1.should)().exist(testDidDoc['alsoKnownAs']);
            (0, chai_1.should)().exist(testDidDoc['verificationMethod']);
            (0, chai_1.expect)(testDidDoc['verificationMethod'] &&
                testDidDoc['authentication'] &&
                testDidDoc['assertionMethod'] &&
                testDidDoc['keyAgreement'] &&
                testDidDoc['capabilityInvocation'] &&
                testDidDoc['capabilityDelegation'] &&
                testDidDoc['service']).to.be.a('array');
            (0, chai_1.should)().exist(testDidDoc['authentication']);
            (0, chai_1.should)().exist(testDidDoc['assertionMethod']);
        }));
        it('should be able to add verification method in didDocument with key type Ed25519VerificationKey2020', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                didDocument: didDocToReg,
                type: 'Ed25519VerificationKey2020',
                id: didDocument.verificationMethod[0].id,
                publicKeyMultibase: publicKeyMultibase,
            };
            const didDoc = JSON.parse(JSON.stringify(didDocToReg));
            DIdDOcWithMultiplVM = yield hypersignDID.addVerificationMethod(params);
            (0, chai_1.expect)(DIdDOcWithMultiplVM).to.be.a('object');
            (0, chai_1.should)().exist(DIdDOcWithMultiplVM['@context']);
            (0, chai_1.should)().exist(DIdDOcWithMultiplVM['id']);
            (0, chai_1.should)().exist(DIdDOcWithMultiplVM['controller']);
            (0, chai_1.should)().exist(DIdDOcWithMultiplVM['alsoKnownAs']);
            (0, chai_1.should)().exist(DIdDOcWithMultiplVM['verificationMethod']);
            (0, chai_1.expect)(DIdDOcWithMultiplVM['verificationMethod'] &&
                DIdDOcWithMultiplVM['authentication'] &&
                DIdDOcWithMultiplVM['assertionMethod'] &&
                DIdDOcWithMultiplVM['keyAgreement'] &&
                DIdDOcWithMultiplVM['capabilityInvocation'] &&
                DIdDOcWithMultiplVM['capabilityDelegation'] &&
                DIdDOcWithMultiplVM['service']).to.be.a('array');
            (0, chai_1.should)().exist(DIdDOcWithMultiplVM['authentication']);
            (0, chai_1.should)().exist(DIdDOcWithMultiplVM['assertionMethod']);
            (0, chai_1.expect)(DIdDOcWithMultiplVM.verificationMethod.length).to.be.greaterThan(didDoc.verificationMethod.length);
        }));
    });
    describe('#createSignInfos() to generated sign array', function () {
        it('should not able to create sign of did document and throw error as didDocument is not passed or it is empty', function () {
            return hypersignDID
                .createSignInfos({ didDocument: {}, privateKeyMultibase, verificationMethodId })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to create signature of a did');
            });
        });
        it('should not be able to create sign of did document as privateKeyMultibase is null or empty', function () {
            return hypersignDID
                .createSignInfos({ didDocument, privateKeyMultibase: '', verificationMethodId })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to create signature of a did');
            });
        });
        it('should not be able to create sign of did document as verificationMethodId is null or empty', function () {
            return hypersignDID
                .createSignInfos({ didDocument, privateKeyMultibase, verificationMethodId: '' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to create signature of a did');
            });
        });
        it('should not be able to create sign of did document as didDocument is not in Ld-json format', function () {
            const didDoc = JSON.parse(JSON.stringify(didDocument));
            didDoc.context = didDoc['@context'];
            delete didDoc['@context'];
            return hypersignDID
                .createSignInfos({ didDocument: didDoc, privateKeyMultibase, verificationMethodId: verificationMethodId })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
            });
        });
        it('should be able to generate signature array', () => __awaiter(this, void 0, void 0, function* () {
            const tempDidDoc = JSON.parse(JSON.stringify(didDocument));
            let signInfo = yield hypersignDID.createSignInfos({ didDocument: tempDidDoc, privateKeyMultibase, verificationMethodId });
            (0, chai_1.expect)(signInfo).to.be.a('array');
            signInfo = signInfo[0];
            (0, chai_1.should)().exist(signInfo.signature);
            (0, chai_1.expect)(signInfo.signature).to.be.a("string");
            (0, chai_1.should)().exist(signInfo.verification_method_id);
            (0, chai_1.expect)(signInfo.verification_method_id).to.be.a("string");
            (0, chai_1.should)().exist(signInfo.created);
            (0, chai_1.expect)(signInfo.created).to.be.a("string");
        }));
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
        it('should not be able to register did document as didDocument is not in Ld-json fromat', function () {
            const didDoc = JSON.parse(JSON.stringify(didDocument));
            // const context = didDoc['@context']
            didDoc.context = didDoc['@context'];
            delete didDoc['@context'];
            return hypersignDID
                .register({ didDocument: didDoc, privateKeyMultibase, verificationMethodId: verificationMethodId })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
            });
        });
        it('should not be able to register a did document as neither privateKeyMultibase nor verificationMethodId is passed and signData passed is empty array', () => __awaiter(this, void 0, void 0, function* () {
            return hypersignDID.register({ didDocument, signData: [] }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            });
        }));
        it('should not be able to register a did document as verificationMethodId is not passed inside signData', () => __awaiter(this, void 0, void 0, function* () {
            return hypersignDID.register({ didDocument, signData: [{ privateKeyMultibase: privKey }] }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signData[0].verificationMethodId is required to register a did');
            });
        }));
        it('should not be able to register a did document as privateKeyMultibase is not passed inside signData', () => __awaiter(this, void 0, void 0, function* () {
            return hypersignDID
                .register({
                didDocument,
                signData: [
                    {
                        verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[0].id,
                    },
                ],
            })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signData[0].privateKeyMultibase is required to register a did');
            });
        }));
        it('should not be able to register a did document as type is not passed inside signData', () => __awaiter(this, void 0, void 0, function* () {
            return hypersignDID
                .register({
                didDocument,
                signData: [
                    {
                        verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[0].id,
                        privateKeyMultibase: privKey,
                    },
                ],
            })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signData[0].type is required to register a did');
            });
        }));
        it('should not be able to register a did Doc of type Ed25519VerificationKey2020 with multiple verification method as one of the privateKeyMultibase is not passed', () => __awaiter(this, void 0, void 0, function* () {
            const signData = [
                {
                    verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[0].id,
                    privateKeyMultibase: privKey,
                    type: 'Ed25519VerificationKey2020',
                },
                {
                    verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[1].id,
                    type: 'Ed25519VerificationKey2020',
                },
            ];
            return yield hypersignDID
                .register({
                didDocument: DIdDOcWithMultiplVM,
                signData,
            })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signData[1].privateKeyMultibase is required to register a did`);
            });
        }));
        // it('should not able to register did document and throw error as hypersign is neither init by offlinesigner nor entityApiKey', async () => {
        //   const hypersign = new HypersignDID();
        //   await hypersign.init();
        //   return hypersign.register({ didDocument, privateKeyMultibase, verificationMethodId })
        //     .catch(function (err) {
        //       expect(function () {
        //         throw err;
        //       }).to.throw(Error, "HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner");
        //     });
        // });
        it('should be able to register didDocument without signData field in the blockchain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield hypersignDID.register({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId,
                    // or we could pass only signData and didDoc
                    // signData: [
                    //   { privateKeyMultibase, verificationMethodId, type: 'Ed25519VerificationKey2020' },
                    //   {
                    //     privateKeyMultibase: 'xyztrtjvnb',
                    //     type: 'X25519KeyAgreementKey2020',
                    //     verificationMethodId: didDocument.verificationMethod[1].id,
                    //   },
                    // ],
                });
                transactionHash = result.transactionHash;
                (0, chai_1.should)().exist(result.transactionHash);
            });
        });
        it('should not be able to register didDocument as didDocument is already registered', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield hypersignDID.register({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId,
                })
                    .catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `failed to execute message; message index: 0: ${didDocId}: didDoc already exists`);
                });
            });
        });
        it('should be able to register a did Doc of type Ed25519VerificationKey2020 with multiple verification method', () => __awaiter(this, void 0, void 0, function* () {
            const registerdDidDoc = yield hypersignDID.register({
                didDocument: DIdDOcWithMultiplVM,
                signData: [
                    {
                        verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[0].id,
                        privateKeyMultibase: privKey,
                        type: 'Ed25519VerificationKey2020',
                    },
                    {
                        verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[1].id,
                        privateKeyMultibase,
                        type: 'Ed25519VerificationKey2020',
                    },
                ],
            });
            (0, chai_1.should)().exist(registerdDidDoc.transactionHash);
        }));
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
        it('should not be able to update did document as versionId passed is incorrect', function () {
            const updateBody = { didDocument, privateKeyMultibase, verificationMethodId, versionId: '1.0.1' };
            const didDoc = JSON.parse(JSON.stringify(didDocument));
            updateBody['didDocument'] = didDoc;
            updateBody['didDocument']['alsoKnownAs'].push('Random Data');
            return hypersignDID.update(updateBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${updateBody.versionId}: unexpected DID version`);
            });
        });
        it('should not be able to update did document as there is no change in didDoc', function () {
            const updateBody = { didDocument, privateKeyMultibase, verificationMethodId, versionId };
            const didDoc = JSON.parse(JSON.stringify(didDocument));
            updateBody['didDocument'] = didDoc;
            return hypersignDID.update(updateBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `failed to execute message; message index: 0: incoming DID Document does not have any changes: didDoc is invalid`);
            });
        });
        it('should be able to update did document', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const didDoc = JSON.parse(JSON.stringify(didDocument));
                didDoc['alsoKnownAs'].push('Some DATA');
                const result = yield hypersignDID.update({
                    didDocument: didDoc,
                    privateKeyMultibase,
                    verificationMethodId,
                    versionId,
                });
                (0, chai_1.should)().exist(result.transactionHash);
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
                // expect(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.equal(publicKeyMultibase);
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
        it('should not be able to deactivate did document as versionId passed is incorrect', function () {
            const didDoc = JSON.parse(JSON.stringify(didDocument));
            const deactivateBody = { didDocument: didDoc, privateKeyMultibase, verificationMethodId, versionId: '1.0.1' };
            return hypersignDID.deactivate(deactivateBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${deactivateBody.versionId}: unexpected DID version`);
            });
        });
        // add test case should not be able to deacivate a deactivated did
        it('should be able to deactivate did document', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const didDocTodeactivate = JSON.parse(JSON.stringify(didDocument));
                const result = yield hypersignDID.deactivate({
                    didDocument: didDocTodeactivate,
                    privateKeyMultibase,
                    verificationMethodId,
                    versionId,
                });
                (0, chai_1.should)().exist(result.transactionHash);
            });
        });
        it('should not be able to deactivate did document as its already deactivated', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const didDocTodeactivate = JSON.parse(JSON.stringify(didDocument));
                return hypersignDID.deactivate({
                    didDocument: didDocTodeactivate,
                    privateKeyMultibase,
                    verificationMethodId,
                    versionId,
                }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `failed to execute message; message index: 0: DID Document ${didDocId} is already deactivated: didDoc is deactivated`);
                });
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
        it('should not able to sign did document and throw error as unsupported purpose is passed', function () {
            const params = {
                privateKeyMultibase: privateKeyMultibase,
                challenge: challenge,
                domain: domain,
                did: '',
                didDocument: didDocument,
                verificationMethodId: verificationMethodId,
                publicKey,
                controller,
                purpose: "random purpose"
            };
            params.verificationMethodId = '';
            return hypersignDID.sign(params).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: unsupported purpose ${params.purpose}`);
            });
        });
        it('should able to sign did document for didAuth using assertion purpose', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempDidDoc = JSON.parse(JSON.stringify(didDocument));
                const params = {
                    privateKeyMultibase: privateKeyMultibase,
                    challenge: challenge,
                    domain: domain,
                    did: '',
                    didDocument: tempDidDoc,
                    verificationMethodId: verificationMethodId,
                    controller,
                    purpose: 'assertion'
                };
                signedDocumentAssertion = yield hypersignDID.sign(params);
                (0, chai_1.expect)(signedDocumentAssertion).to.be.a('object');
                (0, chai_1.should)().exist(signedDocumentAssertion['@context']);
                (0, chai_1.should)().exist(signedDocumentAssertion['id']);
                (0, chai_1.expect)(didDocId).to.be.equal(signedDocumentAssertion['id']);
                (0, chai_1.should)().exist(signedDocumentAssertion['controller']);
                (0, chai_1.should)().exist(signedDocumentAssertion['alsoKnownAs']);
                (0, chai_1.should)().exist(signedDocumentAssertion['verificationMethod']);
                (0, chai_1.should)().exist(signedDocumentAssertion['authentication']);
                (0, chai_1.should)().exist(signedDocumentAssertion['assertionMethod']);
                (0, chai_1.should)().exist(signedDocumentAssertion['keyAgreement']);
                (0, chai_1.should)().exist(signedDocumentAssertion['capabilityInvocation']);
                (0, chai_1.should)().exist(signedDocumentAssertion['capabilityDelegation']);
                (0, chai_1.should)().exist(signedDocumentAssertion['service']);
                (0, chai_1.should)().exist(signedDocumentAssertion['proof']);
            });
        });
        it('should able to sign did document for didAuth using authentication purpose', function () {
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
        it('should not able to verify did document and throw error as unsupported purpose is passed', function () {
            return hypersignDID
                .verify({ didDocument: signedDocument, verificationMethodId, challenge: '', domain, purpose: "random" })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: unsupported purpose random`);
            });
        });
        it('should return verification result for didAuthentication', function () {
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
        it('should return verification result for didAssertion', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield hypersignDID.verify({
                    didDocument: signedDocumentAssertion,
                    verificationMethodId,
                    purpose: "assertion"
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
});
