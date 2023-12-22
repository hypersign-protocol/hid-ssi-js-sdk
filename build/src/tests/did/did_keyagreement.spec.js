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
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let versionId;
let hypersignDID;
let transactionHash;
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
describe('DID Test scenarios for keyagreement type', () => {
    describe('DID Test scenarios for keyType X25519KeyAgreementKey2020', () => {
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
        });
        describe('#generate() to generate did', function () {
            it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
                return hypersignDID.generate({ publicKeyMultibase: '' }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
                });
            });
            it('should be able to generate didDocument with ed25519 key', function () {
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
        });
        // adding keyagreement type as vm
        describe('#addVerificationMethod() to add verificationMethod in didDocument', function () {
            it('should be able to add verification method of type X25519KeyAgreementKey2020 in didDocument', () => __awaiter(this, void 0, void 0, function* () {
                const params = {
                    didDocument: didDocument,
                    type: 'X25519KeyAgreementKey2020',
                    publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
                };
                const didDoc = JSON.parse(JSON.stringify(didDocument));
                const updatedDidDoc = yield hypersignDID.addVerificationMethod(Object.assign({}, params));
                (0, chai_1.expect)(updatedDidDoc).to.be.a('object');
                (0, chai_1.should)().exist(updatedDidDoc['@context']);
                (0, chai_1.should)().exist(updatedDidDoc['id']);
                (0, chai_1.should)().exist(updatedDidDoc['controller']);
                (0, chai_1.should)().exist(updatedDidDoc['alsoKnownAs']);
                (0, chai_1.should)().exist(updatedDidDoc['verificationMethod']);
                (0, chai_1.expect)(updatedDidDoc['verificationMethod'] &&
                    updatedDidDoc['authentication'] &&
                    updatedDidDoc['assertionMethod'] &&
                    updatedDidDoc['keyAgreement'] &&
                    updatedDidDoc['capabilityInvocation'] &&
                    updatedDidDoc['capabilityDelegation'] &&
                    updatedDidDoc['service']).to.be.a('array');
                (0, chai_1.should)().exist(updatedDidDoc['authentication']);
                (0, chai_1.should)().exist(updatedDidDoc['assertionMethod']);
                (0, chai_1.expect)(updatedDidDoc.verificationMethod.length).to.be.greaterThan(didDoc.verificationMethod.length);
            }));
        });
        describe('#register() this is to register did on the blockchain', function () {
            it('should be able to register didDocument in the blockchain  with two vm one is of type Ed25519VerificationKey2020 and other is of type X25519KeyAgreementKey2020 and register method is called without signData field', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield hypersignDID.register({
                        didDocument,
                        privateKeyMultibase,
                        verificationMethodId
                    });
                    transactionHash = result.transactionHash;
                    (0, chai_1.should)().exist(result.transactionHash);
                });
            });
        });
        describe('#resolve() this is to resolve didDocument based on didDocId', function () {
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
            it('should be able to update did document with key type X25519KeyAgreementKey2020', function () {
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
        });
        describe('#deactivate() this is to deactivate didDocument based on didDocId', function () {
            it('should be able to deactivate did document with key type X25519KeyAgreementKey2020', function () {
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
        });
    });
    describe('DID Test scenarios for keyType X25519KeyAgreementKeyEIP5630', () => {
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
        });
        describe('#generate() to generate did', function () {
            it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
                return hypersignDID.generate({ publicKeyMultibase: '' }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
                });
            });
            it('should be able to generate didDocument with ed25519 key', function () {
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
        });
        // adding keyagreement type as vm
        describe('#addVerificationMethod() to add verificationMethod in didDocument', function () {
            it('should be able to add verification method of type X25519KeyAgreementKeyEIP5630 in didDocument', () => __awaiter(this, void 0, void 0, function* () {
                const params = {
                    didDocument: didDocument,
                    type: 'X25519KeyAgreementKeyEIP5630',
                    publicKeyMultibase: '23fer44374u3rmhvf47ri35ty1',
                };
                const didDoc = JSON.parse(JSON.stringify(didDocument));
                const updatedDidDoc = yield hypersignDID.addVerificationMethod(Object.assign({}, params));
                (0, chai_1.expect)(updatedDidDoc).to.be.a('object');
                (0, chai_1.should)().exist(updatedDidDoc['@context']);
                (0, chai_1.should)().exist(updatedDidDoc['id']);
                (0, chai_1.should)().exist(updatedDidDoc['controller']);
                (0, chai_1.should)().exist(updatedDidDoc['alsoKnownAs']);
                (0, chai_1.should)().exist(updatedDidDoc['verificationMethod']);
                (0, chai_1.expect)(updatedDidDoc['verificationMethod'] &&
                    updatedDidDoc['authentication'] &&
                    updatedDidDoc['assertionMethod'] &&
                    updatedDidDoc['keyAgreement'] &&
                    updatedDidDoc['capabilityInvocation'] &&
                    updatedDidDoc['capabilityDelegation'] &&
                    updatedDidDoc['service']).to.be.a('array');
                (0, chai_1.should)().exist(updatedDidDoc['authentication']);
                (0, chai_1.should)().exist(updatedDidDoc['assertionMethod']);
                (0, chai_1.expect)(updatedDidDoc.verificationMethod.length).to.be.greaterThan(didDoc.verificationMethod.length);
            }));
        });
        describe('#register() this is to register did with keyType Ed25519VerificationKey2020 and X25519KeyAgreementKeyEIP5630  on the blockchain', function () {
            it('should be able to register didDocument in the blockchain  with two vm one is of type Ed25519VerificationKey2020 and other is of type X25519KeyAgreementKeyEIP5630 and register method is called without signData field', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield hypersignDID.register({
                        didDocument,
                        privateKeyMultibase,
                        verificationMethodId
                    });
                    transactionHash = result.transactionHash;
                    (0, chai_1.should)().exist(result.transactionHash);
                });
            });
        });
        describe('#resolve() this is to resolve didDocument based on didDocId', function () {
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
            it('should be able to update did document with keyType X25519KeyAgreementKeyEIP5630', function () {
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
        });
        describe('#deactivate() this is to deactivate didDocument based on didDocId', function () {
            it('should be able to deactivate did document with keytype X25519KeyAgreementKeyEIP5630', function () {
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
        });
    });
});
