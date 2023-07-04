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
const index_1 = require("../index");
const config_1 = require("./config");
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
const credentialBody = {
    schemaId: '',
    subjectDid: '',
    type: [],
    issuerDid: '',
    fields: { name: 'Varsha' },
    expirationDate: '',
};
const schemaBody = {
    name: 'testSchema',
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
    });
    describe('#register() this is to register did on the blockchain', function () {
        it('should be able to register didDocument in the blockchain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield hypersignDID.register({ didDocument, privateKeyMultibase, verificationMethodId });
                (0, chai_1.should)().exist(result.code);
                (0, chai_1.should)().exist(result.height);
                (0, chai_1.should)().exist(result.rawLog);
                (0, chai_1.should)().exist(result.transactionHash);
                (0, chai_1.should)().exist(result.gasUsed);
                (0, chai_1.should)().exist(result.gasWanted);
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
                //console.log(JSON.stringify(registeredSchema, null, 2))
                (0, chai_1.expect)(registeredSchema).to.be.a('object');
                (0, chai_1.should)().exist(registeredSchema.code);
                (0, chai_1.should)().exist(registeredSchema.height);
                (0, chai_1.should)().exist(registeredSchema.rawLog);
                (0, chai_1.should)().exist(registeredSchema.transactionHash);
                (0, chai_1.should)().exist(registeredSchema.gasUsed);
                (0, chai_1.should)().exist(registeredSchema.gasWanted);
                (0, chai_1.expect)(registeredSchema.rawLog).to.be.a('string');
            });
        });
    });
});
/**
 * Test cases related to credential
 */
describe('Verifiable Credential Opearations', () => {
    describe('#getCredential() method to generate a credential', function () {
        it('should not be able to generate new credential for a schema as both subjectDid and subjectDidDocSigned is passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.subjectDid = didDocId;
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
                tempCredentialBody['subjectDid'] = didDocId;
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
                tempCredentialBody.subjectDid = didDocId;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields = { name: 'varsha' };
                credentialDetail = yield hypersignVC.generate(tempCredentialBody);
                // console.log('New Credential --------------------------------');
                // console.log(JSON.stringify(credentialDetail, null, 2));
                (0, chai_1.expect)(credentialDetail).to.be.a('object');
                (0, chai_1.should)().exist(credentialDetail['@context']);
                (0, chai_1.should)().exist(credentialDetail['id']);
                credentialId = credentialDetail.id;
                (0, chai_1.should)().exist(credentialDetail['type']);
                (0, chai_1.should)().exist(credentialDetail['expirationDate']);
                (0, chai_1.should)().exist(credentialDetail['issuanceDate']);
                (0, chai_1.should)().exist(credentialDetail['issuer']);
                (0, chai_1.should)().exist(credentialDetail['credentialSubject']);
                (0, chai_1.should)().exist(credentialDetail['credentialSchema']);
                (0, chai_1.should)().exist(credentialDetail['credentialStatus']);
                (0, chai_1.expect)(credentialDetail['credentialStatus'].type).to.be.equal('CredentialStatusList2017');
            });
        });
        it('should be able to generate new credential even without offlinesigner passed to constructor', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('12/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.subjectDid = didDocId;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields = { name: 'varsha' };
                const hypersignVC1 = new index_1.HypersignVerifiableCredential();
                const credentialDetail = yield hypersignVC1.generate(tempCredentialBody);
                (0, chai_1.expect)(credentialDetail).to.be.a('object');
                (0, chai_1.should)().exist(credentialDetail['@context']);
                (0, chai_1.should)().exist(credentialDetail['id']);
                (0, chai_1.should)().exist(credentialDetail['type']);
                (0, chai_1.should)().exist(credentialDetail['expirationDate']);
                (0, chai_1.should)().exist(credentialDetail['issuanceDate']);
                (0, chai_1.should)().exist(credentialDetail['issuer']);
                (0, chai_1.should)().exist(credentialDetail['credentialSubject']);
                (0, chai_1.should)().exist(credentialDetail['credentialSchema']);
                (0, chai_1.should)().exist(credentialDetail['credentialStatus']);
                (0, chai_1.expect)(credentialDetail['credentialStatus'].type).to.be.equal('CredentialStatusList2017');
            });
        });
        it('should be able to generate new credential for a schema with signed subject DID doc', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('12/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields = { name: 'varsha' };
                // console.log(tempCredentialBody)
                const credentialDetail = yield hypersignVC.generate(tempCredentialBody);
                // console.log(JSON.stringify(credentialDetail));
                (0, chai_1.expect)(credentialDetail).to.be.a('object');
                (0, chai_1.should)().exist(credentialDetail['@context']);
                (0, chai_1.should)().exist(credentialDetail['id']);
                (0, chai_1.should)().exist(credentialDetail['type']);
                (0, chai_1.should)().exist(credentialDetail['expirationDate']);
                (0, chai_1.should)().exist(credentialDetail['issuanceDate']);
                (0, chai_1.should)().exist(credentialDetail['issuer']);
                (0, chai_1.should)().exist(credentialDetail['credentialSubject']);
                (0, chai_1.should)().exist(credentialDetail['credentialSchema']);
                (0, chai_1.should)().exist(credentialDetail['credentialStatus']);
                (0, chai_1.expect)(credentialDetail['credentialStatus'].type).to.be.equal('CredentialStatusList2017');
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
                // console.log(JSON.stringify(tempIssueCredentialBody, null, 2));
                const issuedCredResult = yield hypersignVC.issue(tempIssueCredentialBody);
                const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = issuedCredResult;
                signedVC = signedCredential;
                credenStatus = credentialStatus;
                credentialId = signedVC.id;
                // console.log('Signed Credential --------------------------------');
                // console.log(JSON.stringify(signedVC, null, 2));
                credentialStatusId = signedCredential['credentialStatus'].id;
                (0, chai_1.expect)(signedCredential).to.be.a('object');
                (0, chai_1.should)().exist(signedCredential['@context']);
                (0, chai_1.should)().exist(signedCredential['id']);
                (0, chai_1.should)().exist(signedCredential['type']);
                (0, chai_1.should)().exist(signedCredential['expirationDate']);
                (0, chai_1.should)().exist(signedCredential['issuanceDate']);
                (0, chai_1.should)().exist(signedCredential['issuer']);
                (0, chai_1.should)().exist(signedCredential['credentialSubject']);
                (0, chai_1.should)().exist(signedCredential['credentialSchema']);
                (0, chai_1.should)().exist(signedCredential['credentialStatus']);
                (0, chai_1.should)().exist(signedCredential['proof']);
                console.log({
                    signedCredentialId: signedVC ? signedVC['id'] : '',
                    credentialId,
                    id: tempIssueCredentialBody.credential.id,
                });
                (0, chai_1.expect)(signedCredential['id']).to.be.equal(tempIssueCredentialBody.credential.id);
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatus['claim']);
                (0, chai_1.should)().exist(credentialStatus['issuer']);
                (0, chai_1.should)().exist(credentialStatus['issuanceDate']);
                (0, chai_1.should)().exist(credentialStatus['expirationDate']);
                (0, chai_1.should)().exist(credentialStatus['credentialHash']);
                (0, chai_1.expect)(credentialStatusProof).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatusProof['type']);
                (0, chai_1.should)().exist(credentialStatusProof['created']);
                (0, chai_1.should)().exist(credentialStatusProof['updated']);
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
                tempCredentialBody['subjectDidDocSigned'] = signedDocument;
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
                // console.log({
                //   signedCredential,
                //   credentialStatusRegistrationResult,
                //   credentialStatus2,
                //   credentialStatusProof2,
                // });
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
                // console.log('Signed vc --------------------------------');
                // console.log(JSON.stringify(params.credential, null, 2));
                const verificationResult = yield hypersignVC.verify(params);
                // console.log('Credential Verifification result --------------------------------');
                // console.log(JSON.stringify(verificationResult, null, 2));
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
                // console.log('Credential ID ' + credentialId);
                const credentialStatus = yield hypersignVC.checkCredentialStatus({ credentialId: credentialId });
                // console.log(JSON.stringify(credentialStatus, null, 2));
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
                // console.log(JSON.stringify(credentialStatus, null, 2));
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatus.issuer);
                (0, chai_1.should)().exist(credentialStatus.issuanceDate);
                (0, chai_1.should)().exist(credentialStatus.expirationDate);
                (0, chai_1.should)().exist(credentialStatus.credentialHash);
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
        //   tempParams.issuerDid = credentialStatus;
        //   tempParams.credentialStatus = {} as ICredentialStatus;
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
        it('should be able to change credential status to suspended', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hypersignVC.resolveCredentialStatus({ credentialId });
                const params = {
                    credentialStatus,
                    issuerDid: didDocId,
                    verificationMethodId,
                    privateKeyMultibase,
                    status: 'SUSPENDED',
                    statusReason: 'Suspending this credential for some time',
                };
                const updatedCredResult = yield hypersignVC.updateCredentialStatus(params);
                // console.log(updatedCredResult);
                (0, chai_1.expect)(updatedCredResult).to.be.a('object');
                (0, chai_1.expect)(updatedCredResult.code).to.be.equal(0);
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
                // console.log({
                //   credentialStatus2,
                // });
                const registerCredDetail = yield hypersignVC.registerCredentialStatus({
                    credentialStatus: credentialStatus2,
                    credentialStatusProof: credentialStatusProof2,
                });
                // console.log(JSON.stringify(registerCredDetail, null, 2));
                (0, chai_1.expect)(registerCredDetail).to.be.a('object');
                (0, chai_1.should)().exist(registerCredDetail.code);
                (0, chai_1.should)().exist(registerCredDetail.transactionHash);
            });
        });
    });
});
