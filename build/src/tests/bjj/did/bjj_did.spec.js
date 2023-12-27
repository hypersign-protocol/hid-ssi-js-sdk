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
const index_1 = require("../../../index");
const chai_1 = require("chai");
const config_1 = require("../../config");
let privateKeyMultibase;
let publicKeyMultibase;
let offlineSigner;
let hsSdk;
let didDocument;
let verificationMethod;
let didDocId;
let versionId;
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
describe('DID Test scenarios for BabyJubJub key', () => {
    //remove seed while creating did so that wallet can generate different did every time
    describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
        it('should return publickeyMultibase and privateKeyMultibase', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const kp = yield hsSdk.did.bjjDID.generateKeys();
                privateKeyMultibase = kp.privateKeyMultibase;
                publicKeyMultibase = kp.publicKeyMultibase;
                (0, chai_1.expect)(kp).to.be.a('object');
                (0, chai_1.should)().exist(kp.privateKeyMultibase);
                (0, chai_1.should)().exist(kp.publicKeyMultibase);
                (0, chai_1.should)().not.exist(kp.id);
            });
        });
    });
    describe('#generate() method to generate new did', function () {
        it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
            return hsSdk.did.bjjDID.generate({ publicKeyMultibase: '' }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
            });
        });
        it('should be able to generate a did using babyJubJub', () => __awaiter(this, void 0, void 0, function* () {
            didDocument = yield hsSdk.did.bjjDID.generate({
                publicKeyMultibase
            });
            didDocId = didDocument.id;
            verificationMethod = didDocument.verificationMethod;
            (0, chai_1.expect)(didDocument).to.be.a('object');
            (0, chai_1.should)().exist(didDocument['@context']);
            (0, chai_1.should)().exist(didDocument['id']);
            (0, chai_1.should)().exist(didDocument['controller']);
            (0, chai_1.should)().exist(didDocument['verificationMethod']);
            (0, chai_1.expect)(didDocument['verificationMethod'] &&
                didDocument['authentication'] &&
                didDocument['assertionMethod'] &&
                didDocument['keyAgreement'] &&
                didDocument['capabilityInvocation'] &&
                didDocument['capabilityDelegation'] &&
                didDocument['service']).to.be.a('array');
            (0, chai_1.expect)(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
            (0, chai_1.should)().exist(didDocument['authentication']);
            (0, chai_1.should)().exist(didDocument['assertionMethod']);
            (0, chai_1.should)().exist(didDocument['keyAgreement']);
            (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
            (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
            (0, chai_1.should)().exist(didDocument['service']);
            (0, chai_1.expect)(didDocument['authentication'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['assertionMethod'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['capabilityInvocation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['capabilityDelegation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['keyAgreement'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['service'].length).to.be.equal(0);
        }));
        it('should be able to generate a did using babyJubJub with passed verification relationships', () => __awaiter(this, void 0, void 0, function* () {
            const didDocument = yield hsSdk.did.bjjDID.generate({
                publicKeyMultibase,
                verificationRelationships: ['authentication', 'assertionMethod'],
            });
            (0, chai_1.expect)(didDocument).to.be.a('object');
            (0, chai_1.should)().exist(didDocument['@context']);
            (0, chai_1.should)().exist(didDocument['id']);
            (0, chai_1.should)().exist(didDocument['controller']);
            (0, chai_1.should)().exist(didDocument['verificationMethod']);
            (0, chai_1.expect)(didDocument['verificationMethod'] &&
                didDocument['authentication'] &&
                didDocument['assertionMethod'] &&
                didDocument['keyAgreement'] &&
                didDocument['capabilityInvocation'] &&
                didDocument['capabilityDelegation'] &&
                didDocument['service']).to.be.a('array');
            (0, chai_1.expect)(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
            (0, chai_1.should)().exist(didDocument['authentication']);
            (0, chai_1.should)().exist(didDocument['assertionMethod']);
            (0, chai_1.should)().exist(didDocument['keyAgreement']);
            (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
            (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
            (0, chai_1.should)().exist(didDocument['service']);
            (0, chai_1.expect)(didDocument['authentication'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['assertionMethod'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['capabilityInvocation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['capabilityDelegation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['keyAgreement'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['service'].length).to.be.equal(0);
        }));
    });
    describe('#register() method to register did', function () {
        it('should not able to register did document and throw error as didDocument is not passed or it is empty', function () {
            return hsSdk.did.bjjDID
                .register({ didDocument: {}, privateKeyMultibase, verificationMethodId: verificationMethod[0].id })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocString is required to register a did');
            });
        });
        it('should not be able to register did document as privateKeyMultibase is null or empty', function () {
            return hsSdk.did.bjjDID
                .register({ didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethod[0].id })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
            });
        });
        it('should not be able to register did document as verificationMethodId is null or empty', function () {
            return hsSdk.did.bjjDID
                .register({ didDocument, privateKeyMultibase, verificationMethodId: '' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
            });
        });
        it('should not be able to register did document as didDocument is not in Ld-json fromat', function () {
            const didDoc = JSON.parse(JSON.stringify(didDocument));
            didDoc.context = didDoc['@context'];
            delete didDoc['@context'];
            return hsSdk.did.bjjDID
                .register({ didDocument: didDoc, privateKeyMultibase, verificationMethodId: verificationMethod[0].id })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
            });
        });
        it('should not be able to register a did document as neither privateKeyMultibase nor verificationMethodId is passed and signData passed is empty array', () => __awaiter(this, void 0, void 0, function* () {
            return hsSdk.did.bjjDID.register({ didDocument, signData: [] }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            });
        }));
        it('should not be able to register a did document as verificationMethodId is not passed inside signData', () => __awaiter(this, void 0, void 0, function* () {
            return hsSdk.did.bjjDID.register({ didDocument, signData: [{ privateKeyMultibase: privateKeyMultibase }] }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signData[0].verificationMethodId is required to register a did');
            });
        }));
        it('should not be able to register a did document as verificationMethodId is not passed inside signData', () => __awaiter(this, void 0, void 0, function* () {
            return hsSdk.did.bjjDID.register({ didDocument, signData: [{ privateKeyMultibase: privateKeyMultibase }] }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signData[0].verificationMethodId is required to register a did');
            });
        }));
        it('should not be able to register a did document as privateKeyMultibase is not passed inside signData', () => __awaiter(this, void 0, void 0, function* () {
            return hsSdk.did.bjjDID
                .register({
                didDocument,
                signData: [
                    {
                        verificationMethodId: verificationMethod[0].id,
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
            return hsSdk.did.bjjDID
                .register({
                didDocument,
                signData: [
                    {
                        verificationMethodId: verificationMethod[0].id,
                        privateKeyMultibase: privateKeyMultibase,
                    },
                ],
            })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signData[0].type is required to register a did');
            });
        }));
        it('should be able to register did generated using BabyJubJubKey', () => __awaiter(this, void 0, void 0, function* () {
            const registerDid = yield hsSdk.did.bjjDID.register({
                didDocument: didDocument,
                privateKeyMultibase,
                verificationMethodId: verificationMethod[0].id
            });
            didDocument = registerDid.didDocument;
            (0, chai_1.expect)(didDocument).to.be.a('object');
            (0, chai_1.should)().exist(didDocument['@context']);
            (0, chai_1.should)().exist(didDocument['id']);
            (0, chai_1.should)().exist(didDocument['controller']);
            (0, chai_1.should)().exist(didDocument['verificationMethod']);
            (0, chai_1.expect)(didDocument['verificationMethod'] &&
                didDocument['authentication'] &&
                didDocument['assertionMethod'] &&
                didDocument['keyAgreement'] &&
                didDocument['capabilityInvocation'] &&
                didDocument['capabilityDelegation'] &&
                didDocument['service']).to.be.a('array');
            (0, chai_1.expect)(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
            (0, chai_1.should)().exist(didDocument['authentication']);
            (0, chai_1.should)().exist(didDocument['assertionMethod']);
            (0, chai_1.should)().exist(didDocument['keyAgreement']);
            (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
            (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
            (0, chai_1.should)().exist(didDocument['service']);
            (0, chai_1.expect)(didDocument['authentication'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['assertionMethod'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['capabilityInvocation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['capabilityDelegation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['keyAgreement'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['service'].length).to.be.equal(0);
            (0, chai_1.should)().exist(registerDid.transactionHash);
        }));
        it('should not be able to register didDocument as didDocument is already registered', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield hsSdk.did.bjjDID.register({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId: verificationMethod[0].id,
                }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `failed to execute message; message index: 0: ${didDocId}: didDoc already exists`);
                });
            });
        });
    });
    describe('#resolve() method to resolve did', function () {
        it('should not able to resolve did document and throw error as didDocId is not passed', function () {
            return hsSdk.did.bjjDID.resolve({ params: { did: '' } }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a did');
            });
        });
        it('should be able to resolve did', () => __awaiter(this, void 0, void 0, function* () {
            const resolvedDid = yield hsSdk.did.bjjDID.resolve({
                did: didDocId
            });
            versionId = resolvedDid.didDocumentMetadata.versionId;
            didDocument = resolvedDid.didDocument;
            const didDocumentmetaData = resolvedDid.didDocumentMetadata;
            (0, chai_1.expect)(didDocument).to.be.a('object');
            (0, chai_1.should)().exist(didDocument['@context']);
            (0, chai_1.should)().exist(didDocument['id']);
            (0, chai_1.should)().exist(didDocument['controller']);
            (0, chai_1.should)().exist(didDocument['verificationMethod']);
            (0, chai_1.expect)(didDocument['verificationMethod'] &&
                didDocument['authentication'] &&
                didDocument['assertionMethod'] &&
                didDocument['keyAgreement'] &&
                didDocument['capabilityInvocation'] &&
                didDocument['capabilityDelegation'] &&
                didDocument['service']).to.be.a('array');
            (0, chai_1.expect)(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
            (0, chai_1.should)().exist(didDocument['authentication']);
            (0, chai_1.should)().exist(didDocument['assertionMethod']);
            (0, chai_1.should)().exist(didDocument['keyAgreement']);
            (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
            (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
            (0, chai_1.should)().exist(didDocument['service']);
            (0, chai_1.expect)(didDocument['authentication'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['assertionMethod'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['capabilityInvocation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['capabilityDelegation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['keyAgreement'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['service'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocumentmetaData).to.be.a('object');
            (0, chai_1.should)().exist(didDocumentmetaData.created);
            (0, chai_1.should)().exist(didDocumentmetaData.updated);
            (0, chai_1.should)().exist(didDocumentmetaData.deactivated);
            (0, chai_1.should)().exist(didDocumentmetaData.versionId);
            (0, chai_1.expect)(didDocumentmetaData.created).to.be.equal(didDocumentmetaData.updated);
        }));
    });
    describe('#update() method to update a did', function () {
        it('should not be able to update did document as privateKeyMultibase is null or empty', function () {
            return hsSdk.did.bjjDID
                .update({ didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethod[0].id, versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
            });
        });
        it('should not be able to update did document as verificationMethodId is null or empty', function () {
            return hsSdk.did.bjjDID
                .update({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
            });
        });
        it('should not be able to update did document as versionId is null or empty', function () {
            return hsSdk.did.bjjDID
                .update({ didDocument, privateKeyMultibase, verificationMethodId: verificationMethod[0].id, versionId: '' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
            });
        });
        it('should not be able to update did document as versionId passed is incorrect', function () {
            const updateBody = { didDocument, privateKeyMultibase, verificationMethodId: verificationMethod[0].id, versionId: '1.0.1' };
            const didDoc = JSON.parse(JSON.stringify(didDocument));
            updateBody['didDocument'] = didDoc;
            updateBody['didDocument']['authentication'] = [];
            return hsSdk.did.bjjDID.update(updateBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${updateBody.versionId}: unexpected DID version`);
            });
        });
        it('should not be able to update did document as there is no change in didDocument', function () {
            const updateBody = { didDocument, privateKeyMultibase, verificationMethodId: verificationMethod[0].id, versionId: '1.0.1' };
            const didDoc = JSON.parse(JSON.stringify(didDocument));
            updateBody['didDocument'] = didDoc;
            return hsSdk.did.bjjDID.update(updateBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, "failed to execute message; message index: 0: incoming DID Document does not have any changes: didDoc is invalid");
            });
        });
        it('should be able to update did generated using BabyJubJubKey', () => __awaiter(this, void 0, void 0, function* () {
            const newDidDoc = JSON.parse(JSON.stringify(didDocument));
            newDidDoc['authentication'] = [];
            const updatedDid = yield hsSdk.did.bjjDID.update({
                didDocument: newDidDoc,
                privateKeyMultibase,
                verificationMethodId: verificationMethod[0].id,
                versionId
            });
            (0, chai_1.should)().exist(updatedDid.transactionHash);
        }));
    });
    describe('#resolve() method to resolve did', function () {
        it('should be able to resolve did after updation', () => __awaiter(this, void 0, void 0, function* () {
            const resolvedDid = yield hsSdk.did.bjjDID.resolve({
                did: didDocId
            });
            versionId = resolvedDid.didDocumentMetadata.versionId;
            didDocument = resolvedDid.didDocument;
            const didDocumentmetaData = resolvedDid.didDocumentMetadata;
            (0, chai_1.expect)(didDocument).to.be.a('object');
            (0, chai_1.should)().exist(didDocument['@context']);
            (0, chai_1.should)().exist(didDocument['id']);
            (0, chai_1.should)().exist(didDocument['controller']);
            (0, chai_1.should)().exist(didDocument['verificationMethod']);
            (0, chai_1.expect)(didDocument['verificationMethod'] &&
                didDocument['authentication'] &&
                didDocument['assertionMethod'] &&
                didDocument['keyAgreement'] &&
                didDocument['capabilityInvocation'] &&
                didDocument['capabilityDelegation'] &&
                didDocument['service']).to.be.a('array');
            (0, chai_1.expect)(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
            (0, chai_1.should)().exist(didDocument['authentication']);
            (0, chai_1.should)().exist(didDocument['assertionMethod']);
            (0, chai_1.should)().exist(didDocument['keyAgreement']);
            (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
            (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
            (0, chai_1.should)().exist(didDocument['service']);
            // expect(didDocument['authentication'].length).to.be.greaterThan(0)
            (0, chai_1.expect)(didDocument['assertionMethod'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(didDocument['capabilityInvocation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['capabilityDelegation'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['keyAgreement'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocument['service'].length).to.be.equal(0);
            (0, chai_1.expect)(didDocumentmetaData).to.be.a('object');
            (0, chai_1.should)().exist(didDocumentmetaData.created);
            (0, chai_1.should)().exist(didDocumentmetaData.updated);
            (0, chai_1.should)().exist(didDocumentmetaData.deactivated);
            (0, chai_1.should)().exist(didDocumentmetaData.versionId);
            const date1 = new Date(didDocumentmetaData.updated);
            const date2 = new Date(didDocumentmetaData.created);
            (0, chai_1.expect)(date1).to.be.greaterThan(date2);
        }));
    });
    describe('#deactivate() method to deactivate a did document', function () {
        it('should not be able to deactivate did document as privateKeyMultibase is null or empty', function () {
            return hsSdk.did.bjjDID
                .deactivate({ didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethod[0].id, versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
            });
        });
        it('should not be able to deactivate did document as verificationMethodId is null or empty', function () {
            return hsSdk.did.bjjDID
                .deactivate({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
            });
        });
        it('should not be able to deactivate did document as versionId is null or empty', function () {
            return hsSdk.did.bjjDID
                .deactivate({ didDocument, privateKeyMultibase, verificationMethodId: verificationMethod[0].id, versionId: '' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
            });
        });
        it('should not be able to deactivate did document as versionId passed is incorrect', function () {
            const didDoc = JSON.parse(JSON.stringify(didDocument));
            const deactivateBody = { didDocument: didDoc, privateKeyMultibase, verificationMethodId: verificationMethod[0].id, versionId: '1.0.1' };
            return hsSdk.did.bjjDID.deactivate(deactivateBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, `failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version 1.0.1: unexpected DID version`);
            });
        });
        it('should be able to deactivate did generated using BabyJubJubKey', () => __awaiter(this, void 0, void 0, function* () {
            const updatedDid = yield hsSdk.did.bjjDID.deactivate({
                didDocument: didDocument,
                privateKeyMultibase,
                verificationMethodId: verificationMethod[0].id,
                versionId
            });
            (0, chai_1.should)().exist(updatedDid.transactionHash);
        }));
        it('should not be able to deactivate did document as its already deactivated', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const didDocTodeactivate = JSON.parse(JSON.stringify(didDocument));
                return hsSdk.did.bjjDID.deactivate({
                    didDocument: didDocTodeactivate,
                    privateKeyMultibase,
                    verificationMethodId: verificationMethod[0].id,
                    versionId,
                }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `failed to execute message; message index: 0: DID Document ${didDocId} is already deactivated: didDoc is deactivated`);
                });
            });
        });
        it('should be able to resolve did after deactivation and deactivated should be true', () => __awaiter(this, void 0, void 0, function* () {
            const resolvedDid = yield hsSdk.did.bjjDID.resolve({
                did: didDocId
            });
            versionId = resolvedDid.didDocumentMetadata.versionId;
            didDocument = resolvedDid.didDocument;
            const didDocumentmetaData = resolvedDid.didDocumentMetadata;
            (0, chai_1.expect)(didDocument).to.be.a('object');
            (0, chai_1.expect)(didDocumentmetaData).to.be.a('object');
            (0, chai_1.should)().exist(didDocumentmetaData.created);
            (0, chai_1.should)().exist(didDocumentmetaData.updated);
            (0, chai_1.should)().exist(didDocumentmetaData.deactivated);
            (0, chai_1.expect)(didDocumentmetaData.deactivated).to.be.equal(true);
            (0, chai_1.should)().exist(didDocumentmetaData.versionId);
            const date1 = new Date(didDocumentmetaData.updated);
            const date2 = new Date(didDocumentmetaData.created);
            (0, chai_1.expect)(date1).to.be.greaterThan(date2);
        }));
    });
});
