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
// with local edv
let offlineSigner;
let hypersignDID;
let privateKeyMultibase;
let publicKeyMultibase;
let didDocument;
let didDocId;
let versionId;
let verificationMethodId;
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
describe("testing hypersignDid initiation", function () {
    it('It should throw error as hypersignDid is neither init using offlineSigner nor using entityApiKey', () => __awaiter(this, void 0, void 0, function* () {
        const params = {
            nodeRestEndpoint: config_1.hidNodeEp.rest,
            nodeRpcEndpoint: config_1.hidNodeEp.rpc,
            namespace: config_1.hidNodeEp.namespace,
        };
        const hypersigndid = new index_1.HypersignDID(params);
        return yield hypersigndid.init().catch(function (err) {
            (0, chai_1.expect)(function () {
                throw err;
            }).to.throw(Error, 'HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
        });
    }));
});
describe('DID Test Scenarios using entiAPiSecretKey', () => {
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
                (0, chai_1.expect)(didDocument['keyAgreement'].length).to.be.equal(0);
                (0, chai_1.should)().exist(didDocument['authentication']);
                (0, chai_1.should)().exist(didDocument['assertionMethod']);
                (0, chai_1.should)().exist(didDocument['keyAgreement']);
                (0, chai_1.should)().exist(didDocument['capabilityInvocation']);
                (0, chai_1.should)().exist(didDocument['capabilityDelegation']);
                (0, chai_1.should)().exist(didDocument['service']);
            });
        });
    });
    describe('#register() to register did on chain', function () {
        it('should not be able to initialize HypersignDID with entityApiSecretKey as entityApiSecretKey is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const HypersignDid = new index_1.HypersignDID({
                entityApiSecretKey: "entityApiSecretKey",
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            });
            try {
                yield HypersignDid.init();
                chai_1.expect.fail("Expected an error but initialization succeeded");
            }
            catch (error) {
                (0, chai_1.expect)(error.message).to.equal("HID-SSI-SDK:: access_denied");
            }
        }));
        it('should not able to register did document and throw error as didDocument is not passed or it is empty', () => __awaiter(this, void 0, void 0, function* () {
            return hypersignDID
                .register({ didDocument: {}, privateKeyMultibase, verificationMethodId })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocString is required to register a did');
            });
        }));
        it('should not be able to register did document as privateKeyMultibase is null or empty', function () {
            return hypersignDID
                .register({ didDocument, privateKeyMultibase: '', verificationMethodId })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
            });
        });
        it('should not be able to register a did document as neither privateKeyMultibase nor verificationMethodId is passed and signData passed is empty array', () => __awaiter(this, void 0, void 0, function* () {
            return hypersignDID.register({ didDocument, signData: [] }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            });
        }));
        it('should be able to registr did using entityApiSecret', () => __awaiter(this, void 0, void 0, function* () {
            const HypersignDid = new index_1.HypersignDID({
                entityApiSecretKey: config_1.entityApiSecret,
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            });
            yield HypersignDid.init();
            const registerdDid = yield hypersignDID.register({
                didDocument,
                privateKeyMultibase,
                verificationMethodId,
            });
            (0, chai_1.should)().exist(registerdDid.didDocument);
            (0, chai_1.should)().exist(registerdDid.transactionHash);
        }));
    });
    describe('#resolve() to resove did using ', function () {
        it('should not able to resolve did document and throw error didDocId is not passed', function () {
            return hypersignDID.resolve({ params: { did: '' } }).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a did');
            });
        });
        it('Should be able to resolve did using entityApiSecret', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                did: didDocId
            };
            const HypersignDid = new index_1.HypersignDID({
                entityApiSecretKey: config_1.entityApiSecret,
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            });
            yield HypersignDid.init();
            const result = yield HypersignDid.resolve(params);
            (0, chai_1.expect)(result).to.be.a('object');
            (0, chai_1.expect)(result.didDocument.id).to.be.equal(didDocId);
            (0, chai_1.expect)(result.didDocumentMetadata).to.be.a('object');
            versionId = result.didDocumentMetadata.versionId;
        }));
    });
    describe('#update() this is to update didDocument', function () {
        it('should not be able to update did document using entityApiKey as privateKeyMultibase is null or empty', function () {
            return hypersignDID
                .update({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
            });
        });
        it('should not be able to update did document using entityApiKey as verificationMethodId is null or empty', function () {
            return hypersignDID
                .update({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
            });
        });
        it('should not be able to update did document using entityApiKey as versionId is null or empty', function () {
            return hypersignDID
                .update({ didDocument, privateKeyMultibase, verificationMethodId, versionId: '' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
            });
        });
        it('should be able to update did document using entityApiSecret', () => __awaiter(this, void 0, void 0, function* () {
            const HypersignDid = new index_1.HypersignDID({
                entityApiSecretKey: config_1.entityApiSecret,
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            });
            yield HypersignDid.init();
            didDocument['alsoKnownAs'].push('Varsha');
            const result = yield HypersignDid.update({
                didDocument,
                privateKeyMultibase,
                verificationMethodId,
                versionId,
            });
            (0, chai_1.should)().exist(result.transactionHash);
        }));
    });
    describe('#resolve() did ater updating did document', function () {
        it('Should be able to resolve did', function () {
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
    });
    describe('#deactivate() this is to deactivate didDocument', function () {
        it('should not be able to deactivate did document using entityApiSecretKey as privateKeyMultibase is null or empty', () => __awaiter(this, void 0, void 0, function* () {
            const HypersignDid = new index_1.HypersignDID({
                entityApiSecretKey: config_1.entityApiSecret,
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            });
            yield HypersignDid.init();
            return HypersignDid
                .deactivate({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
                .catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
            });
        }));
        it('should not be able to deactivate did document as verificationMethodId is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const HypersignDid = new index_1.HypersignDID({
                    entityApiSecretKey: config_1.entityApiSecret,
                    nodeRestEndpoint: config_1.hidNodeEp.rest,
                    nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                    namespace: config_1.hidNodeEp.namespace,
                });
                yield HypersignDid.init();
                return HypersignDid
                    .deactivate({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
                    .catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
                });
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
        it('Should be able to deactivate did document using entityApiSecretKey', () => __awaiter(this, void 0, void 0, function* () {
            const HypersignDid = new index_1.HypersignDID({
                entityApiSecretKey: config_1.entityApiSecret,
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            });
            yield HypersignDid.init();
            const result = yield HypersignDid.deactivate({
                didDocument,
                privateKeyMultibase,
                verificationMethodId,
                versionId,
            });
            (0, chai_1.should)().exist(result.transactionHash);
        }));
        it('Should be able to resolve deactivated did and get deactivated as true in didDoc', () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                did: didDocId
            };
            const HypersignDid = new index_1.HypersignDID({
                entityApiSecretKey: config_1.entityApiSecret,
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            });
            yield HypersignDid.init();
            const result = yield HypersignDid.resolve(params);
            (0, chai_1.should)().exist(result.didDocument);
            (0, chai_1.should)().exist(result.didDocumentMetadata);
            (0, chai_1.expect)(result.didDocumentMetadata.deactivated).to.equal(true);
        }));
    });
});
