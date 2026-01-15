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
let didDocId;
let schemaId;
let signedDocument;
let verificationMethodId;
let didDocument;
let schemaObject;
let schemaSignature;
const challenge = '1231231231';
const domain = 'www.adbv.com';
let offlineSigner;
let credentialId;
let credentialDetail;
let hypersignDID;
let hypersignSchema;
let hypersignVC;
let signedSchema;
let credentialStatusId;
let signedVC;
let credenStatus;
let credentialStatusProof2 = {};
let credentialStatus2 = {};
let credentialStatus;
let holderDidDocument;
let holderSignedDidDoc;
let holdersPrivateKeyMultibase;
let credentialDetail2;
let credentialDetail3;
let issuedCredResult;
let issuedCredResult2;
const credentialTransMessage = [];
const entityApiSecretKey = '57ed4af5b3f51428250e76a769ce8.d8f70a64e3d060b377c85eb75b60ae25011ecebb63f28a27f72183e5bcba140222f8628f17a72eee4833a9174f5ae8309';
const credentialBody = {
    schemaId: '',
    subjectDid: '',
    type: [],
    issuerDid: '',
    fields: { name: 'Varsha' },
    expirationDate: '',
};
const schemaBody = {
    name: 'TestSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [{ name: 'name', type: 'string', isRequired: false }],
    additionalProperties: false,
};
const issueCredentialBody = {
    credential: credentialDetail,
    issuerDid: didDocId,
    verificationMethodId,
    privateKeyMultibase: privateKeyMultibase,
    registerCredential: true,
};
beforeEach(function () {
    return __awaiter(this, void 0, void 0, function* () {
        offlineSigner = yield (0, config_1.createWallet)(config_1.mnemonic);
        const constructorParams = {
            offlineSigner,
            nodeRestEndpoint: config_1.hidNodeEp.rest,
            nodeRpcEndpoint: config_1.hidNodeEp.rpc,
            namespace: config_1.hidNodeEp.namespace,
        };
        hypersignDID = new index_1.HypersignDID(constructorParams);
        yield hypersignDID.init();
        hypersignSchema = new index_1.HypersignSchema(constructorParams);
        yield hypersignSchema.init();
        hypersignVC = new index_1.HypersignVerifiableCredential(constructorParams);
        yield hypersignVC.init();
    });
});
// Generate public and private key pair
describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const kp = yield hypersignDID.generateKeys();
            privateKeyMultibase = kp.privateKeyMultibase;
            publicKeyMultibase = kp.publicKeyMultibase;
            (0, chai_1.expect)(kp).to.be.a('object');
            (0, chai_1.should)().exist(kp.privateKeyMultibase);
            (0, chai_1.should)().exist(kp.publicKeyMultibase);
        });
    });
});
/**
 * DID creation and registration
 */
describe('DID Opearations', () => {
    describe('#generate() to generate did', function () {
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
        it('should be able to generate didDocument', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const kp = yield hypersignDID.generateKeys();
                holdersPrivateKeyMultibase = kp.privateKeyMultibase;
                holderDidDocument = yield hypersignDID.generate({ publicKeyMultibase: kp.publicKeyMultibase });
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
    describe('#sign() this is to sign didDoc', function () {
        const controller = {
            '@context': '',
            id: '',
            authentication: [],
        };
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
        it('should able to sign did document for holder', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    privateKeyMultibase: holdersPrivateKeyMultibase,
                    challenge: challenge,
                    domain: domain,
                    did: '',
                    didDocument: holderDidDocument,
                    verificationMethodId: holderDidDocument.verificationMethod[0].id,
                    controller,
                };
                holderSignedDidDoc = yield hypersignDID.sign(params);
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
    describe('#register() this is to register did on the blockchain', function () {
        it('should be able to register didDocument in the blockchain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const didDoc = didDocument;
                delete didDoc.proof;
                const result = yield hypersignDID.register({ didDocument: didDoc, privateKeyMultibase, verificationMethodId });
                (0, chai_1.should)().exist(result.transactionHash);
                (0, chai_1.should)().exist(result.didDocument);
            });
        });
    });
});
/**
 * Schema Creation and Registration
 */
describe('Schema Opearations', () => {
    describe('#getSchema() method to create schema', function () {
        it('should able to create a new schema', function () {
            return __awaiter(this, void 0, void 0, function* () {
                schemaBody.author = didDocId;
                schemaObject = yield hypersignSchema.generate(schemaBody);
                schemaId = schemaObject['id'];
                (0, chai_1.expect)(schemaObject).to.be.a('object');
                (0, chai_1.should)().exist(schemaObject['type']);
                (0, chai_1.should)().exist(schemaObject['modelVersion']);
                (0, chai_1.should)().exist(schemaObject['id']);
                (0, chai_1.should)().exist(schemaObject['name']);
                (0, chai_1.should)().exist(schemaObject['author']);
                (0, chai_1.should)().exist(schemaObject['authored']);
                (0, chai_1.should)().exist(schemaObject['schema']);
                (0, chai_1.expect)(schemaObject.schema).to.be.a('object');
                (0, chai_1.expect)(schemaObject['name']).to.be.equal(schemaBody.name);
                (0, chai_1.expect)(schemaObject['author']).to.be.equal(schemaBody.author);
            });
        });
    });
    describe('#sign() function to sign schema', function () {
        it('should be able to sign newly created schema', function () {
            return __awaiter(this, void 0, void 0, function* () {
                signedSchema = yield hypersignSchema.sign({ privateKeyMultibase, schema: schemaObject, verificationMethodId });
                (0, chai_1.expect)(signedSchema).to.be.a('object');
            });
        });
    });
    describe('#registerSchema() function to register schema on blockchain', function () {
        it('should be able to register schema on blockchain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const registeredSchema = yield hypersignSchema.register({
                    schema: signedSchema,
                });
                (0, chai_1.expect)(registeredSchema).to.be.a('object');
                (0, chai_1.should)().exist(registeredSchema.transactionHash);
            });
        });
    });
});
/**
 * Test cases related to credential
 */
describe('Verifiable Credential Opearations', () => {
    describe('#generate() method to generate a credential', function () {
        it('should not be able to generate new credential for a schema as both subjectDid and subjectDidDocSigned is passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.subjectDid = holderDidDocument.id;
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                return hypersignVC.generate(tempCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: Both subjectDid and subjectDidDoc cannot be passed');
                });
            });
        });
        it('should not be able to generate new credential for a schema as not able to resolve subjectDid or subjectDidDoc as  neither subjectDid nor subjectDidDocSigned is passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.issuerDid = didDocId;
                return hypersignVC.generate(tempCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: Could not resolve the subjectDid or subjectDidDoc');
                });
            });
        });
        it('should not be able to generate new credential for a schema as nether schemaId nor schema Context is passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                return hypersignVC.generate(tempCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'schemaId is required when schemaContext and type not passed');
                });
            });
        });
        it('should not be able to generate new credential for a schema as wrong issuer did is passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.issuerDid = didDocId + 'xyz';
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                return hypersignVC.generate(tempCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `HID-SSI-SDK:: Error: Could not fetch issuer did doc, issuer did = ${tempCredentialBody.issuerDid}`);
                });
            });
        });
        it('should not be able to generate new credential for a schema as not able to get subject did doc based on subjectDid passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody['subjectDid'] = holderDidDocument.id;
                return hypersignVC.generate(tempCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `HID-SSI-SDK:: Error: Could not fetch subject did doc, subject did ${tempCredentialBody.subjectDid}`);
                });
            });
        });
        it('should not be able to generate new credential for a schema as expiration date is passed in wrong format', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const todaysDate = new Date();
                const tempExpirationDate = todaysDate.setDate(todaysDate.getDate() + 2);
                const expirationDate = tempExpirationDate.toString();
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = didDocId;
                return hypersignVC.generate(tempCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'Invalid time value');
                });
            });
        });
        it('should not be able to generate new credential for a schema as additional properties in schema is set to false but sending additional properties in field value at the time of generating credential', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('12/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields['type'] = 'string';
                tempCredentialBody.fields['value'] = 'Varsha';
                tempCredentialBody.fields['name'] = 'name';
                return hypersignVC.generate(tempCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `Only ["${schemaBody.fields[0].name}"] attributes are possible. additionalProperties is false in the schema`);
                });
            });
        });
        it('should be able to generate new credential for a schema with subject DID', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('12/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.subjectDid = holderDidDocument.id;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields = { name: 'varsha' };
                credentialDetail = yield hypersignVC.generate(tempCredentialBody);
                (0, chai_1.expect)(credentialDetail).to.be.a('object');
                (0, chai_1.should)().exist(credentialDetail['@context']);
                (0, chai_1.should)().exist(credentialDetail['id']);
                credentialId = credentialDetail.id;
                (0, chai_1.should)().exist(credentialDetail['type']);
                (0, chai_1.should)().exist(credentialDetail['issuanceDate']);
                (0, chai_1.should)().exist(credentialDetail['issuer']);
                (0, chai_1.should)().exist(credentialDetail['credentialSubject']);
                (0, chai_1.should)().exist(credentialDetail['credentialStatus']);
                (0, chai_1.expect)(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
            });
        });
        it('should be able to generate new credential even without offlinesigner passed to constructor', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('11/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.subjectDid = holderDidDocument.id;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields = { name: 'varsha' };
                const hypersignVC1 = new index_1.HypersignVerifiableCredential({
                    nodeRestEndpoint: config_1.hidNodeEp.rest,
                    nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                    namespace: config_1.hidNodeEp.namespace,
                });
                credentialDetail2 = yield hypersignVC1.generate(tempCredentialBody);
                (0, chai_1.expect)(credentialDetail).to.be.a('object');
                (0, chai_1.should)().exist(credentialDetail['@context']);
                (0, chai_1.should)().exist(credentialDetail['id']);
                (0, chai_1.should)().exist(credentialDetail['type']);
                (0, chai_1.should)().exist(credentialDetail['issuanceDate']);
                (0, chai_1.should)().exist(credentialDetail['issuer']);
                (0, chai_1.should)().exist(credentialDetail['credentialSubject']);
                (0, chai_1.should)().exist(credentialDetail['credentialSchema']);
                (0, chai_1.should)().exist(credentialDetail['credentialStatus']);
                (0, chai_1.expect)(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
            });
        });
        it('should be able to generate new credential even without offlinesigner passed to constructor to test bulkRegistration', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('11/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.subjectDid = holderDidDocument.id;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields = { name: 'varsha' };
                const hypersignVC1 = new index_1.HypersignVerifiableCredential({
                    nodeRestEndpoint: config_1.hidNodeEp.rest,
                    nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                    namespace: config_1.hidNodeEp.namespace,
                });
                credentialDetail3 = yield hypersignVC1.generate(tempCredentialBody);
                (0, chai_1.expect)(credentialDetail).to.be.a('object');
                (0, chai_1.should)().exist(credentialDetail['@context']);
                (0, chai_1.should)().exist(credentialDetail['id']);
                (0, chai_1.should)().exist(credentialDetail['type']);
                (0, chai_1.should)().exist(credentialDetail['issuanceDate']);
                (0, chai_1.should)().exist(credentialDetail['issuer']);
                (0, chai_1.should)().exist(credentialDetail['credentialSubject']);
                (0, chai_1.should)().exist(credentialDetail['credentialSchema']);
                (0, chai_1.should)().exist(credentialDetail['credentialStatus']);
                (0, chai_1.expect)(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
            });
        });
        it('should be able to generate new credential for a schema with signed subject DID doc', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('10/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields = { name: 'varsha' };
                const credentialDetail = yield hypersignVC.generate(tempCredentialBody);
                (0, chai_1.expect)(credentialDetail).to.be.a('object');
                (0, chai_1.should)().exist(credentialDetail['@context']);
                (0, chai_1.should)().exist(credentialDetail['id']);
                (0, chai_1.should)().exist(credentialDetail['type']);
                (0, chai_1.should)().exist(credentialDetail['issuanceDate']);
                (0, chai_1.should)().exist(credentialDetail['issuer']);
                (0, chai_1.should)().exist(credentialDetail['credentialSubject']);
                (0, chai_1.should)().exist(credentialDetail['credentialSchema']);
                (0, chai_1.should)().exist(credentialDetail['credentialStatus']);
                (0, chai_1.expect)(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
            });
        });
    });
    describe('#issueCredential() method for issuing credential', function () {
        it('should not be able to issueCredential as verificationMethodId is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = '';
                tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
                return yield hypersignVC.issue(tempIssueCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to issue credential');
                });
            });
        });
        it('should not be able to issueCredential as credentialObject is null or undefined', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = undefined;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
                return yield hypersignVC.issue(tempIssueCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credential is required to issue credential');
                });
            });
        });
        it('should not be able to issueCredential as privateKey is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKeyMultibase = '';
                return yield hypersignVC.issue(tempIssueCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to issue credential');
                });
            });
        });
        it('should not be able to issueCredential as issuerDid is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = '';
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKeyMultibase = publicKeyMultibase;
                return yield hypersignVC.issue(tempIssueCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to issue credential');
                });
            });
        });
        it('should be able to issue credential with credential status registered on chain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
                const issuedCredResult = yield hypersignVC.issue(tempIssueCredentialBody);
                const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = issuedCredResult;
                signedVC = signedCredential;
                credenStatus = credentialStatus;
                credentialId = signedVC.id;
                credentialStatusId = signedCredential['credentialStatus'].id;
                (0, chai_1.expect)(signedCredential).to.be.a('object');
                (0, chai_1.should)().exist(signedCredential['@context']);
                (0, chai_1.should)().exist(signedCredential['id']);
                (0, chai_1.should)().exist(signedCredential['type']);
                (0, chai_1.should)().exist(signedCredential['issuanceDate']);
                (0, chai_1.should)().exist(signedCredential['issuer']);
                (0, chai_1.should)().exist(signedCredential['credentialSubject']);
                (0, chai_1.should)().exist(signedCredential['credentialSchema']);
                (0, chai_1.should)().exist(signedCredential['credentialStatus']);
                (0, chai_1.should)().exist(signedCredential['proof']);
                (0, chai_1.expect)(signedCredential['id']).to.be.equal(tempIssueCredentialBody.credential.id);
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatus['@context']);
                (0, chai_1.should)().exist(credentialStatus['id']);
                (0, chai_1.should)().exist(credentialStatus['issuer']);
                (0, chai_1.should)().exist(credentialStatus['issuanceDate']);
                (0, chai_1.should)().exist(credentialStatus['credentialMerkleRootHash']);
                (0, chai_1.expect)(credentialStatusProof).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatusProof['type']);
                (0, chai_1.should)().exist(credentialStatusProof['created']);
                (0, chai_1.should)().exist(credentialStatusProof['verificationMethod']);
                (0, chai_1.should)().exist(credentialStatusProof['proofPurpose']);
                (0, chai_1.should)().exist(credentialStatusProof['proofValue']);
                (0, chai_1.expect)(credentialStatusRegistrationResult).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatusRegistrationResult['height']);
                (0, chai_1.should)().exist(credentialStatusRegistrationResult['transactionHash']);
                (0, chai_1.should)().exist(credentialStatusRegistrationResult['gasUsed']);
                (0, chai_1.should)().exist(credentialStatusRegistrationResult['gasWanted']);
            });
        });
        it('should be able to issue credential without having the credential status registered on chain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('12/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody['subjectDidDocSigned'] = holderSignedDidDoc;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields = { name: 'varsha' };
                const credentialDetail = yield hypersignVC.generate(tempCredentialBody);
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
                tempIssueCredentialBody.registerCredential = false;
                const issuedCredResult = yield hypersignVC.issue(tempIssueCredentialBody);
                const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = issuedCredResult;
                credentialStatus2 = credentialStatus;
                credentialStatusProof2 = credentialStatusProof;
                (0, chai_1.expect)(signedCredential).to.be.a('object');
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.expect)(credentialStatusProof).to.be.a('object');
                (0, chai_1.should)().not.exist(credentialStatusRegistrationResult);
            });
        });
        it('should be able to issue credential without having the credential status registered on chain to test bulkRegistration', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail2;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
                tempIssueCredentialBody.registerCredential = false;
                issuedCredResult = yield hypersignVC.issue(tempIssueCredentialBody);
                const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = issuedCredResult;
                (0, chai_1.expect)(signedCredential).to.be.a('object');
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.expect)(credentialStatusProof).to.be.a('object');
                (0, chai_1.should)().not.exist(credentialStatusRegistrationResult);
            });
        });
        it('should be able to issue credential without having the credential status registered on chain to test bulkRegistration', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail3;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
                tempIssueCredentialBody.registerCredential = false;
                issuedCredResult2 = yield hypersignVC.issue(tempIssueCredentialBody);
                const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = issuedCredResult;
                // credentialStatus2 = credentialStatus;
                // credentialStatusProof2 = credentialStatusProof;
                (0, chai_1.expect)(signedCredential).to.be.a('object');
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.expect)(credentialStatusProof).to.be.a('object');
                (0, chai_1.should)().not.exist(credentialStatusRegistrationResult);
            });
        });
    });
    describe('#verifyCredential() method to verify a credential', function () {
        it('should be able to verify credential', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credential: signedVC,
                    issuerDid: didDocId,
                    verificationMethodId,
                };
                const verificationResult = yield hypersignVC.verify(params);
                (0, chai_1.expect)(verificationResult).to.be.a('object');
                (0, chai_1.should)().exist(verificationResult.verified);
                (0, chai_1.expect)(verificationResult.verified).to.be.equal(true);
                (0, chai_1.should)().exist(verificationResult.results);
                (0, chai_1.expect)(verificationResult.results).to.be.a('array');
                (0, chai_1.should)().exist(verificationResult.statusResult);
                (0, chai_1.expect)(verificationResult.statusResult.verified).to.be.equal(true);
            });
        });
        it('should be able to verify even without offlinesigner passed to constructor', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credential: signedVC,
                    issuerDid: didDocId,
                    verificationMethodId,
                };
                const hypersignVC1 = new index_1.HypersignVerifiableCredential();
                const verificationResult = yield hypersignVC1.verify(params);
                (0, chai_1.expect)(verificationResult).to.be.a('object');
                (0, chai_1.should)().exist(verificationResult['verified']);
                (0, chai_1.expect)(verificationResult['verified']).to.be.equal(true);
                (0, chai_1.should)().exist(verificationResult['results']);
                (0, chai_1.expect)(verificationResult['results']).to.be.a('array');
                (0, chai_1.should)().exist(verificationResult['statusResult']);
                (0, chai_1.expect)(verificationResult['statusResult'].verified).to.be.equal(true);
            });
        });
        it('should not be able to verify credential as verificationMethodId is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credential: signedVC,
                    issuerDid: didDocId,
                    verificationMethodId,
                };
                params.verificationMethodId = '';
                return hypersignVC.verify(params).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to verify credential');
                });
            });
        });
        it('should not be able to verify credential as issuerDid is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credential: signedVC,
                    issuerDid: didDocId,
                    verificationMethodId,
                };
                params.issuerDid = '';
                return hypersignVC.verify(params).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to verify credential');
                });
            });
        });
        it('should not be able to verify credential as proof is null or undefined', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credential: signedVC,
                    issuerDid: didDocId,
                    verificationMethodId,
                };
                if (params.credential) {
                    params.credential.proof = undefined;
                }
                return hypersignVC.verify(params).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.credential.proof is required to verify credential');
                });
            });
        });
        // it('should not be able to verify credential as credential is null or undefined', async function () {
        //   const params = {
        //     credential: signedVC,
        //     issuerDid: didDocId,
        //     verificationMethodId,
        //   };
        //   params.credential = {} as IVerifiableCredential;
        //   return hypersignVC.verify(params).catch(function (err) {
        //     expect(function () {
        //       throw err;
        //     }).to.throw(Error, 'HID-SSI-SDK:: params.credential is required to verify credential');
        //   });
        // });
    });
});
describe('Verifiable Credential Status Opearations', () => {
    describe('#checkCredentialStatus() method to check status of the credential', function () {
        it('should not be able to check credential as credentialId is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hypersignVC.checkCredentialStatus().catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
                });
            });
        });
        it('should not be able to check credential as credentialId is invalid', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hypersignVC.checkCredentialStatus({ credentialId: credentialId + 'x' }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'No credential status found. Probably invalid credentialId');
                });
            });
        });
        it('should be able to check credential status', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hypersignVC.checkCredentialStatus({ credentialId: credentialId });
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatus.verified);
                (0, chai_1.expect)(credentialStatus.verified).to.be.equal(true);
            });
        });
    });
    describe('#resolveCredentialStatus this is to resolve credential status', function () {
        it('should not be able to resolve credential as credentialId is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hypersignVC.resolveCredentialStatus({ credentialId: '' }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
                });
            });
        });
        it('should be able to resolve credential', function () {
            return __awaiter(this, void 0, void 0, function* () {
                credentialStatus = yield hypersignVC.resolveCredentialStatus({ credentialId });
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatus.revoked);
                (0, chai_1.should)().exist(credentialStatus.suspended);
                (0, chai_1.should)().exist(credentialStatus.remarks);
                (0, chai_1.should)().exist(credentialStatus.issuer);
                (0, chai_1.should)().exist(credentialStatus.issuanceDate);
                (0, chai_1.should)().exist(credentialStatus.credentialMerkleRootHash);
                (0, chai_1.should)().exist(credentialStatus.proof);
            });
        });
    });
    describe('#updateCredentialStatus this method is to change credential status to revoked or suspended', function () {
        const params = {
            credentialStatus: credenStatus,
            issuerDid: didDocId,
            verificationMethodId,
            privateKeyMultibase,
            status: 'SUSPENDED',
            statusReason: 'Suspending this credential for some time',
        };
        it('should not be able to update credential as verificationMethodId is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempParams = Object.assign({}, params);
                tempParams.verificationMethodId = '';
                return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update credential status');
                });
            });
        });
        // it('should not be able to update credential as credStatus is not passed', async function () {
        //   const tempParams = { ...params };
        //   tempParams.verificationMethodId = verificationMethodId;
        //   tempParams.privateKeyMultibase = privateKeyMultibase;
        //   tempParams.issuerDid = didDocId;
        //   tempParams.credentialStatus =  {} as ICredentialStatus;
        //   return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
        //     expect(function () {
        //       throw err;
        //     }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credentialStatus is required to update credential status');
        //   });
        // });
        it('should not be able to update credential as privateKey is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempParams = Object.assign({}, params);
                tempParams.verificationMethodId = verificationMethodId;
                tempParams.credentialStatus = credenStatus;
                tempParams.privateKeyMultibase = '';
                return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update credential status');
                });
            });
        });
        it('should not be able to update credential as issuerDid is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempParams = Object.assign({}, params);
                tempParams.verificationMethodId = verificationMethodId;
                tempParams.credentialStatus = credenStatus;
                tempParams.privateKeyMultibase = privateKeyMultibase;
                tempParams.issuerDid = '';
                return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to update credential status');
                });
            });
        });
        it('should not be able to update credential as status is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempParams = Object.assign({}, params);
                tempParams.verificationMethodId = verificationMethodId;
                tempParams.credentialStatus = credenStatus;
                tempParams.privateKeyMultibase = privateKeyMultibase;
                tempParams.issuerDid = didDocId;
                tempParams.status = '';
                return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.status is required to update credential status');
                });
            });
        });
        it('should not be able to update credential as status passed is invalid', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempParams = Object.assign({}, params);
                tempParams.verificationMethodId = verificationMethodId;
                tempParams.credentialStatus = credenStatus;
                tempParams.privateKeyMultibase = privateKeyMultibase;
                tempParams.issuerDid = didDocId;
                tempParams.status = 'svgsdvjif';
                return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `HID-SSI-SDK:: Error: params.status is invalid`);
                });
            });
        });
        it('should be able to change credential status to suspended', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hypersignVC.resolveCredentialStatus({ credentialId });
                const tempParams = Object.assign({}, params);
                tempParams['credentialStatus'] = credentialStatus;
                tempParams['verificationMethodId'] = verificationMethodId;
                tempParams.issuerDid = didDocId;
                tempParams.privateKeyMultibase = privateKeyMultibase;
                tempParams['status'] = 'SUSPENDED';
                tempParams['statusReason'] = 'Suspending this credential for some time';
                const updatedCredResult = yield hypersignVC.updateCredentialStatus(tempParams);
                (0, chai_1.expect)(updatedCredResult).to.be.a('object');
                (0, chai_1.expect)(updatedCredResult.code).to.be.equal(0);
                (0, chai_1.expect)(updatedCredResult.transactionHash).to.be.a('string');
            });
        });
        it('should not be able to suspend a suspended  credential status', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hypersignVC.resolveCredentialStatus({ credentialId });
                const tempParams = Object.assign({}, params);
                tempParams['credentialStatus'] = credentialStatus;
                tempParams['verificationMethodId'] = verificationMethodId;
                tempParams['status'] = 'SUSPENDED';
                tempParams.privateKeyMultibase = privateKeyMultibase;
                tempParams.issuerDid = didDocId;
                tempParams['statusReason'] = 'Suspending this credential for some time';
                return hypersignVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, "failed to execute message; message index: 0: incoming Credential Status Document does not have any changes: invalid Credential Status");
                });
            });
        });
        it('should be able to change credential status to Live', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hypersignVC.resolveCredentialStatus({ credentialId });
                const params = {
                    credentialStatus,
                    issuerDid: didDocId,
                    verificationMethodId,
                    privateKeyMultibase,
                    status: 'LIVE',
                    statusReason: 'Setting the status to LIVE',
                };
                const updatedCredResult = yield hypersignVC.updateCredentialStatus(params);
                (0, chai_1.expect)(updatedCredResult).to.be.a('object');
                (0, chai_1.expect)(updatedCredResult.code).to.be.equal(0);
            });
        });
        it('should be able to change credential status to Revoked', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hypersignVC.resolveCredentialStatus({ credentialId });
                const params = {
                    credentialStatus,
                    issuerDid: didDocId,
                    verificationMethodId,
                    privateKeyMultibase,
                    status: 'REVOKED',
                    statusReason: 'Revoking the credential',
                };
                const updatedCredResult = yield hypersignVC.updateCredentialStatus(params);
                (0, chai_1.expect)(updatedCredResult).to.be.a('object');
                (0, chai_1.expect)(updatedCredResult.code).to.be.equal(0);
            });
        });
        it('should not be able to revoke a revoked credential status', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hypersignVC.resolveCredentialStatus({ credentialId });
                const params = {
                    credentialStatus,
                    issuerDid: didDocId,
                    verificationMethodId,
                    privateKeyMultibase,
                    status: 'REVOKED',
                    statusReason: 'Revoking the credential',
                };
                return hypersignVC.updateCredentialStatus(params).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'failed to execute message; message index: 0: incoming Credential Status Document does not have any changes: invalid Credential Status');
                });
            });
        });
        it('should not be able to change the status of credential as it is revoked', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credentialStatus,
                    issuerDid: didDocId,
                    verificationMethodId,
                    privateKeyMultibase,
                    status: 'SUSPENDED',
                    statusReason: 'Suspending this credential for some time',
                };
                return hypersignVC.updateCredentialStatus(params).catch(function (err) {
                    (0, chai_1.expect)(err.message).to.include(`failed to execute message; message index: 0: credential status ${credentialId} could not be updated since it is revoked: invalid Credential Status`);
                });
            });
        });
    });
    describe('#registerCredentialStatus() method to register credential on blockchain', function () {
        it('should not be able to register credential as credentialStatusProof is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hypersignVC.registerCredentialStatus({ credentialStatus: credentialStatus2 }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: credentialStatus and credentialStatusProof are required to register credential status');
                });
            });
        });
        it('should not be able to register credential as credentialStatus is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hypersignVC
                    .registerCredentialStatus({ credentialStatusProof: credentialStatusProof2 })
                    .catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: credentialStatus and credentialStatusProof are required to register credential status');
                });
            });
        });
        it('should be able to register credential on blockchain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const registerCredDetail = yield hypersignVC.registerCredentialStatus({
                    credentialStatus: credentialStatus2,
                    credentialStatusProof: credentialStatusProof2,
                });
                (0, chai_1.expect)(registerCredDetail).to.be.a('object');
                (0, chai_1.should)().exist(registerCredDetail.transactionHash);
            });
        });
        it('should not be able to register credential on blockchain as stutus already registerd on chain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hypersignVC.registerCredentialStatus({
                    credentialStatus: credentialStatus2,
                    credentialStatusProof: credentialStatusProof2,
                }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw('failed to execute message; message index: 0: credential status document already exists');
                });
            });
        });
    });
    describe('#generateRegisterCredentialStatusTxnMessage() method to generate transaction message for credential2', function () {
        it('should not be able to generatecredential status TxnMessage as credentialStatus is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = null;
                const credentialStatusProof = issuedCredResult.credentialStatusProof;
                return hypersignVC.generateRegisterCredentialStatusTxnMessage(credentialStatus, credentialStatusProof).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: credentialStatus and proof are required to register credential status');
                });
            });
        });
        it('should not be able to generatecredential status TxnMessage as credentialStatusProof is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = issuedCredResult.credentialStatus;
                const credentialStatusProof = null;
                return hypersignVC.generateRegisterCredentialStatusTxnMessage(credentialStatus, credentialStatusProof).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: credentialStatus and proof are required to register credential status');
                });
            });
        });
        it('should be able to generate credential status TxnMessage', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = issuedCredResult.credentialStatus;
                const credentialStatusProof = issuedCredResult.credentialStatusProof;
                const credentialStatus2 = issuedCredResult2.credentialStatus;
                const credentialStatusProof2 = issuedCredResult2.credentialStatusProof;
                const txnMessage1 = yield hypersignVC.generateRegisterCredentialStatusTxnMessage(credentialStatus, credentialStatusProof);
                credentialTransMessage.push(txnMessage1);
                const txnMessage2 = yield hypersignVC.generateRegisterCredentialStatusTxnMessage(credentialStatus2, credentialStatusProof2);
                credentialTransMessage.push(txnMessage2);
                (0, chai_1.expect)(txnMessage1).to.be.a('object');
                (0, chai_1.should)().exist(txnMessage1.typeUrl);
                (0, chai_1.should)().exist(txnMessage1.value);
                (0, chai_1.should)().exist(txnMessage1.value.credentialStatusDocument);
                (0, chai_1.should)().exist(txnMessage1.value.credentialStatusProof);
                (0, chai_1.should)().exist(txnMessage1.value.txAuthor);
            });
        });
    });
    describe('#registerCredentialStatusTxnBulk() method to register credential on blockchain', function () {
        it('should not be able to register multiple credential as txnMessage is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const txnMessage = [];
                return hypersignVC.registerCredentialStatusTxnBulk(txnMessage).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: txnMessage is required to register credential status');
                });
            });
        });
        it('should be able to register credential on blockchain in a bulk', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const registerCredDetail = yield hypersignVC.registerCredentialStatusTxnBulk(credentialTransMessage);
                (0, chai_1.expect)(registerCredDetail).to.be.a('object');
                (0, chai_1.should)().exist(registerCredDetail.transactionHash);
            });
        });
    });
});
