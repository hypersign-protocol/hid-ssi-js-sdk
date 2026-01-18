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
let issuerPrivateKeyMultibase;
let issuerPublicKeyMultibase;
let holderPrivateKeyMultibase;
let holderPublicKeyMultibase;
let offlineSigner;
let hsSdk;
let credentialDetail3;
let issuedCredResult2;
let issuedCredResult;
let credentialStatusId;
const credentialTransMessage = [];
let credentialDetail2;
let credenStatus;
let verificationMethod;
let schemaObject;
let signedSchema;
let schemaId;
let subjectDid;
let issuerDid;
let issuerDidDoc;
let subjectDidDoc;
let credentialDetail;
let credentialId;
let signedVC;
let selectiveDisclosure;
let credentialStatus2;
let credentialStatusProof2;
let signedVC1;
const issueCredentialBody = {
    credential: credentialDetail,
    issuerDid,
    verificationMethodId: '',
    privateKeyMultibase: issuerPrivateKeyMultibase,
    registerCredential: true,
};
const schemaBody = {
    name: 'TestSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [
        { name: 'name', type: 'string', isRequired: false },
        { name: 'address', type: 'string', isRequired: true },
    ],
    additionalProperties: false,
};
const credentialBody = {
    schemaId: '',
    subjectDid: '',
    type: [],
    issuerDid: '',
    fields: { name: 'Varsha', address: 'Random address' },
    expirationDate: '',
};
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
describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const kp = yield hsSdk.did.bjjDID.generateKeys();
            issuerPrivateKeyMultibase = kp.privateKeyMultibase;
            issuerPublicKeyMultibase = kp.publicKeyMultibase;
            (0, chai_1.expect)(kp).to.be.a('object');
            (0, chai_1.should)().exist(kp.privateKeyMultibase);
            (0, chai_1.should)().exist(kp.publicKeyMultibase);
            (0, chai_1.should)().not.exist(kp.id);
        });
    });
});
describe('DID Operation', () => {
    describe('#generate() method to generate new did', function () {
        it('should be able to generate a issuer did using babyJubJub', () => __awaiter(this, void 0, void 0, function* () {
            issuerDidDoc = yield hsSdk.did.bjjDID.generate({
                publicKeyMultibase: issuerPublicKeyMultibase,
            });
            issuerDid = issuerDidDoc.id;
            verificationMethod = issuerDidDoc.verificationMethod;
            (0, chai_1.expect)(issuerDidDoc).to.be.a('object');
            (0, chai_1.should)().exist(issuerDidDoc['@context']);
            (0, chai_1.should)().exist(issuerDidDoc['id']);
            (0, chai_1.should)().exist(issuerDidDoc['controller']);
            (0, chai_1.should)().exist(issuerDidDoc['verificationMethod']);
            (0, chai_1.expect)(issuerDidDoc['verificationMethod'] &&
                issuerDidDoc['authentication'] &&
                issuerDidDoc['assertionMethod'] &&
                issuerDidDoc['keyAgreement'] &&
                issuerDidDoc['capabilityInvocation'] &&
                issuerDidDoc['capabilityDelegation'] &&
                issuerDidDoc['service']).to.be.a('array');
            (0, chai_1.expect)(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
            (0, chai_1.should)().exist(issuerDidDoc['authentication']);
            (0, chai_1.should)().exist(issuerDidDoc['assertionMethod']);
            (0, chai_1.should)().exist(issuerDidDoc['keyAgreement']);
            (0, chai_1.should)().exist(issuerDidDoc['capabilityInvocation']);
            (0, chai_1.should)().exist(issuerDidDoc['capabilityDelegation']);
            (0, chai_1.should)().exist(issuerDidDoc['service']);
            (0, chai_1.expect)(issuerDidDoc['authentication'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(issuerDidDoc['assertionMethod'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(issuerDidDoc['capabilityInvocation'].length).to.be.equal(0);
            (0, chai_1.expect)(issuerDidDoc['capabilityDelegation'].length).to.be.equal(0);
            (0, chai_1.expect)(issuerDidDoc['keyAgreement'].length).to.be.equal(0);
            (0, chai_1.expect)(issuerDidDoc['service'].length).to.be.equal(0);
        }));
        it('should be able to genrate a did for holder', () => __awaiter(this, void 0, void 0, function* () {
            const kp = yield hsSdk.did.bjjDID.generateKeys();
            holderPrivateKeyMultibase = kp.privateKeyMultibase;
            holderPublicKeyMultibase = kp.publicKeyMultibase;
            subjectDidDoc = yield hsSdk.did.bjjDID.generate({
                publicKeyMultibase: holderPublicKeyMultibase,
            });
            subjectDid = subjectDidDoc.id;
        }));
    });
    describe('#register() method to register did', function () {
        it('should be able to register did generated using BabyJubJubKey', () => __awaiter(this, void 0, void 0, function* () {
            const registerDid = yield hsSdk.did.bjjDID.register({
                didDocument: issuerDidDoc,
                privateKeyMultibase: issuerPrivateKeyMultibase,
                verificationMethodId: verificationMethod[0].id,
            });
            issuerDidDoc = registerDid.didDocument;
            (0, chai_1.expect)(issuerDidDoc).to.be.a('object');
            (0, chai_1.should)().exist(issuerDidDoc['@context']);
            (0, chai_1.should)().exist(issuerDidDoc['id']);
            (0, chai_1.should)().exist(issuerDidDoc['controller']);
            (0, chai_1.should)().exist(issuerDidDoc['verificationMethod']);
            (0, chai_1.expect)(issuerDidDoc['verificationMethod'] &&
                issuerDidDoc['authentication'] &&
                issuerDidDoc['assertionMethod'] &&
                issuerDidDoc['keyAgreement'] &&
                issuerDidDoc['capabilityInvocation'] &&
                issuerDidDoc['capabilityDelegation'] &&
                issuerDidDoc['service']).to.be.a('array');
            (0, chai_1.expect)(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021');
            (0, chai_1.should)().exist(issuerDidDoc['authentication']);
            (0, chai_1.should)().exist(issuerDidDoc['assertionMethod']);
            (0, chai_1.should)().exist(issuerDidDoc['keyAgreement']);
            (0, chai_1.should)().exist(issuerDidDoc['capabilityInvocation']);
            (0, chai_1.should)().exist(issuerDidDoc['capabilityDelegation']);
            (0, chai_1.should)().exist(issuerDidDoc['service']);
            (0, chai_1.expect)(issuerDidDoc['authentication'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(issuerDidDoc['assertionMethod'].length).to.be.greaterThan(0);
            (0, chai_1.expect)(issuerDidDoc['capabilityInvocation'].length).to.be.equal(0);
            (0, chai_1.expect)(issuerDidDoc['capabilityDelegation'].length).to.be.equal(0);
            (0, chai_1.expect)(issuerDidDoc['keyAgreement'].length).to.be.equal(0);
            (0, chai_1.expect)(issuerDidDoc['service'].length).to.be.equal(0);
            (0, chai_1.should)().exist(registerDid.transactionHash);
        }));
        it('should be able to register did for holder', () => __awaiter(this, void 0, void 0, function* () {
            const registerDid = yield hsSdk.did.bjjDID.register({
                didDocument: subjectDidDoc,
                privateKeyMultibase: holderPrivateKeyMultibase,
                verificationMethodId: subjectDidDoc.verificationMethod[0].id,
            });
            subjectDidDoc = registerDid.didDocument;
        }));
    });
});
describe('Schema Operations', () => {
    describe('#generate() method to create schema', function () {
        it('should be able to generate new schema', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSchemaBody = Object.assign({}, schemaBody);
                tempSchemaBody.author = issuerDid;
                schemaObject = yield hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody);
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
                (0, chai_1.expect)(schemaObject['name']).to.be.equal(tempSchemaBody.name);
                (0, chai_1.expect)(schemaObject['author']).to.be.equal(tempSchemaBody.author);
                (0, chai_1.expect)(schemaObject['schema'].required).to.be.a('array');
            });
        });
    });
    describe('#sign() method to sign a schema', function () {
        it('should be able to sign newly created schema', () => __awaiter(this, void 0, void 0, function* () {
            signedSchema = yield yield hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase: issuerPrivateKeyMultibase,
                schema: schemaObject,
                verificationMethodId: issuerDidDoc['assertionMethod'][0],
            });
            (0, chai_1.expect)(signedSchema).to.be.a('object');
            (0, chai_1.should)().exist(signedSchema.type);
            (0, chai_1.should)().exist(signedSchema.modelVersion);
            (0, chai_1.should)().exist(signedSchema['id']);
            (0, chai_1.should)().exist(signedSchema['name']);
            (0, chai_1.should)().exist(signedSchema['author']);
            (0, chai_1.should)().exist(signedSchema['authored']);
            (0, chai_1.should)().exist(signedSchema['schema']);
            (0, chai_1.should)().exist(signedSchema.schema.schema);
            (0, chai_1.should)().exist(signedSchema.schema.description);
            (0, chai_1.should)().exist(signedSchema.schema.type);
            (0, chai_1.should)().exist(signedSchema.schema.properties);
            (0, chai_1.should)().exist(signedSchema.schema.required);
            (0, chai_1.should)().exist(signedSchema.proof);
            (0, chai_1.should)().exist(signedSchema.proof.type);
            (0, chai_1.expect)(signedSchema.proof.type).to.be.equal('BJJSignature2021');
            (0, chai_1.should)().exist(signedSchema.proof.created);
            (0, chai_1.should)().exist(signedSchema.proof.verificationMethod);
            (0, chai_1.should)().exist(signedSchema.proof.proofPurpose);
            (0, chai_1.expect)(signedSchema.proof.proofPurpose).to.be.equal('assertionMethod');
            (0, chai_1.should)().exist(signedSchema.proof.proofValue);
        }));
    });
    describe('#register() method to register a schema', function () {
        it('should be able to register newly created schema', () => __awaiter(this, void 0, void 0, function* () {
            const registerdSchema = yield hsSdk.schema.hypersignBjjschema.register({ schema: signedSchema });
            (0, chai_1.should)().exist(registerdSchema.transactionHash);
        }));
    });
    describe('#resolve() method to resolve a schema', function () {
        it('Should be able to resolve schema from blockchain', () => __awaiter(this, void 0, void 0, function* () {
            const resolvedSchema = yield hsSdk.schema.hypersignBjjschema.resolve({ schemaId });
            (0, chai_1.should)().exist(resolvedSchema.context);
            (0, chai_1.should)().exist(resolvedSchema.type);
            (0, chai_1.should)().exist(resolvedSchema.modelVersion);
            (0, chai_1.should)().exist(resolvedSchema.id);
            (0, chai_1.should)().exist(resolvedSchema.name);
            (0, chai_1.should)().exist(resolvedSchema.author);
            (0, chai_1.should)().exist(resolvedSchema.authored);
            (0, chai_1.should)().exist(resolvedSchema.schema);
            (0, chai_1.should)().exist(resolvedSchema.schema.schema);
            (0, chai_1.should)().exist(resolvedSchema.schema.description);
            (0, chai_1.should)().exist(resolvedSchema.schema.type);
            (0, chai_1.should)().exist(resolvedSchema.schema.properties);
            (0, chai_1.should)().exist(resolvedSchema.schema.required);
            (0, chai_1.should)().exist(resolvedSchema.schema.additionalProperties);
            (0, chai_1.should)().exist(resolvedSchema.proof);
            (0, chai_1.should)().exist(resolvedSchema.proof.type);
            (0, chai_1.should)().exist(resolvedSchema.proof.created);
            (0, chai_1.should)().exist(resolvedSchema.proof.verificationMethod);
            (0, chai_1.should)().exist(resolvedSchema.proof.proofPurpose);
            (0, chai_1.should)().exist(resolvedSchema.proof.proofValue);
            (0, chai_1.should)().exist(resolvedSchema.proof.clientSpecType);
            (0, chai_1.expect)(resolvedSchema.proof.clientSpecType).to.be.equal('CLIENT_SPEC_TYPE_NONE');
        }));
    });
});
describe('Credential Operation', () => {
    describe('#generate() method to generate a credential', function () {
        it('should not be able to generate new credential for a schema as both subjectDid and subjectDidDocSigned is passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.issuerDid = issuerDid;
                tempCredentialBody.subjectDid = subjectDid;
                tempCredentialBody['subjectDidDocSigned'] = subjectDidDoc;
                return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: Both subjectDid and subjectDidDoc cannot be passed');
                });
            });
        });
        it('should not be able to generate new credential for a schema as not able to resolve subjectDid or subjectDidDoc as  neither subjectDid nor subjectDidDocSigned is passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.issuerDid = issuerDid;
                return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: Could not resolve the subjectDid or subjectDidDoc');
                });
            });
        });
        it('should not be able to generate new credential for a schema as nether schemaId nor schema Context is passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.issuerDid = issuerDid;
                tempCredentialBody['subjectDidDocSigned'] = subjectDidDoc;
                return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
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
                tempCredentialBody.issuerDid = issuerDid + 'xyz';
                tempCredentialBody['subjectDidDocSigned'] = subjectDidDoc;
                return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
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
                tempCredentialBody.issuerDid = issuerDid;
                tempCredentialBody['subjectDid'] = subjectDid;
                delete tempCredentialBody['fields']['id'];
                return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
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
                tempCredentialBody['subjectDidDocSigned'] = subjectDidDoc;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = issuerDid;
                return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
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
                tempCredentialBody['subjectDidDocSigned'] = subjectDidDoc;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = issuerDid;
                tempCredentialBody.fields['type'] = 'string';
                tempCredentialBody.fields['value'] = 'Varsha';
                tempCredentialBody.fields['name'] = 'name';
                return hsSdk.vc.bjjVC.generate(tempCredentialBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `Only ["${schemaBody.fields[0].name}"] attributes are possible. additionalProperties is false in the schema`);
                });
            });
        });
        it('should be able to generate a credential', () => __awaiter(this, void 0, void 0, function* () {
            const expirationDate = new Date('12/11/2027');
            const tempCredentialBody = Object.assign({}, credentialBody);
            tempCredentialBody.schemaId = schemaId;
            tempCredentialBody.subjectDid = subjectDid;
            tempCredentialBody['expirationDate'] = expirationDate.toString();
            tempCredentialBody.issuerDid = issuerDid;
            tempCredentialBody.fields = { name: 'varsha', address: 'random address' };
            credentialDetail = yield hsSdk.vc.bjjVC.generate(tempCredentialBody);
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
        }));
        it('should be able to generate new credential for testing bulk registration', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('11/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.subjectDid = subjectDid;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = issuerDid;
                tempCredentialBody['fields'] = { name: 'varsha', address: 'random address' };
                credentialDetail2 = yield hsSdk.vc.bjjVC.generate(tempCredentialBody);
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
                tempCredentialBody.subjectDid = subjectDid;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = issuerDid;
                tempCredentialBody.fields = { name: 'varsha', address: 'random address' };
                credentialDetail3 = yield yield hsSdk.vc.bjjVC.generate(tempCredentialBody);
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
                tempIssueCredentialBody.issuerDid = issuerDid;
                tempIssueCredentialBody.verificationMethodId = '';
                tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
                return yield hsSdk.vc.bjjVC.issue(tempIssueCredentialBody).catch(function (err) {
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
                tempIssueCredentialBody.issuerDid = issuerDid;
                tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
                tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
                return yield hsSdk.vc.bjjVC.issue(tempIssueCredentialBody).catch(function (err) {
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
                tempIssueCredentialBody.issuerDid = issuerDid;
                tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
                tempIssueCredentialBody.privateKeyMultibase = '';
                return yield hsSdk.vc.bjjVC.issue(tempIssueCredentialBody).catch(function (err) {
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
                tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
                tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
                return yield hsSdk.vc.bjjVC.issue(tempIssueCredentialBody).catch(function (err) {
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
                tempIssueCredentialBody.issuerDid = issuerDid;
                tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
                tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
                const issuedCredResult = yield hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
                const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = issuedCredResult;
                signedVC = {};
                Object.assign(signedVC, signedCredential);
                signedVC1 = signedCredential;
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
                (0, chai_1.should)().exist(credentialStatus['proof']);
                (0, chai_1.should)().exist(credentialStatus['proof'].type);
                (0, chai_1.expect)(credentialStatus['proof'].type).to.be.equal('BJJSignature2021');
                (0, chai_1.expect)(credentialStatusProof).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatusProof['type']);
                (0, chai_1.expect)(credentialStatusProof['type']).to.be.equal('BJJSignature2021');
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
                // tempCredentialBody['subjectDidDocSigned'] = holderSignedDidDoc;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = issuerDid;
                tempCredentialBody.subjectDid = subjectDid;
                tempCredentialBody.fields = { name: 'varsha', address: 'random address' };
                const credentialDetail = yield hsSdk.vc.bjjVC.generate(tempCredentialBody);
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = issuerDid;
                tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
                tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
                tempIssueCredentialBody.registerCredential = false;
                const issuedCredResult = yield hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
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
                tempIssueCredentialBody.issuerDid = issuerDid;
                tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
                tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
                tempIssueCredentialBody.registerCredential = false;
                issuedCredResult = yield hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
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
                tempIssueCredentialBody.issuerDid = issuerDid;
                tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
                tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
                tempIssueCredentialBody.registerCredential = false;
                issuedCredResult2 = yield hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
                const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = issuedCredResult;
                (0, chai_1.expect)(signedCredential).to.be.a('object');
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.expect)(credentialStatusProof).to.be.a('object');
                (0, chai_1.should)().not.exist(credentialStatusRegistrationResult);
            });
        });
    });
    describe('#generateSeletiveDisclosure() method for genertaaing sd', function () {
        const presentationBody = {
            verifiableCredential: signedVC1,
            verificationMethodId: '',
            issuerDid,
        };
        it('should not be able to generate a sd presentation document as verfiableCredential is not passed or null', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempPresentationBody = Object.assign({}, presentationBody);
                tempPresentationBody.verifiableCredential = null;
                return hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: verifiableCredential is required');
                });
            });
        });
        it('should not be able to generate a sd presentation document as frame is not passed or null', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempPresentationBody = Object.assign({}, presentationBody);
                tempPresentationBody.verifiableCredential = signedVC;
                tempPresentationBody['frame'] = null;
                return hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: frame is required');
                });
            });
        });
        it('should not be able to generate a sd presentation document as verificationMethodId is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempPresentationBody = Object.assign({}, presentationBody);
                tempPresentationBody.verifiableCredential = signedVC;
                const revelDocument = {
                    type: ['VerifiableCredential', 'TestSchema'],
                    expirationDate: {},
                    issuanceDate: {},
                    issuer: {},
                    credentialSubject: {
                        '@explicit': true,
                        id: {},
                    },
                };
                tempPresentationBody['frame'] = revelDocument;
                return hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: verificationMethodId is required');
                });
            });
        });
        it('should not be able to generate a sd presentation document as issuerDid is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempPresentationBody = Object.assign({}, presentationBody);
                tempPresentationBody.verifiableCredential = signedVC;
                const revelDocument = {
                    type: ['VerifiableCredential', 'TestSchema'],
                    expirationDate: {},
                    issuanceDate: {},
                    issuer: {},
                    credentialSubject: {
                        '@explicit': true,
                        id: {},
                    },
                };
                tempPresentationBody['frame'] = revelDocument;
                tempPresentationBody.verificationMethodId = verificationMethod[0].id;
                tempPresentationBody.issuerDid = '';
                return hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: issuerDid is required');
                });
            });
        });
        it('should be able to generate a sd document', () => __awaiter(this, void 0, void 0, function* () {
            const presentationBody = {
                verifiableCredential: {},
                frame: {},
                verificationMethodId: verificationMethod[0].id,
                issuerDid,
            };
            const revelDocument = {
                type: ['VerifiableCredential', 'TestSchema'],
                expirationDate: {},
                issuanceDate: {},
                issuer: {},
                credentialSubject: {
                    '@explicit': true,
                    id: {},
                },
            };
            const tempPresentationBody = Object.assign({}, presentationBody);
            tempPresentationBody.verifiableCredential = signedVC1;
            tempPresentationBody.frame = revelDocument;
            tempPresentationBody.issuerDid = issuerDid;
            tempPresentationBody.verificationMethodId = verificationMethod[0].id;
            selectiveDisclosure = yield hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody);
            (0, chai_1.should)().exist(selectiveDisclosure['@context']);
            (0, chai_1.should)().exist(selectiveDisclosure['id']);
            (0, chai_1.expect)(selectiveDisclosure['id']).to.be.equal(credentialId);
            (0, chai_1.should)().exist(selectiveDisclosure['type']);
            (0, chai_1.should)().exist(selectiveDisclosure['credentialSchema']);
            (0, chai_1.should)().exist(selectiveDisclosure['credentialStatus']);
            (0, chai_1.should)().exist(selectiveDisclosure['credentialSubject']);
            (0, chai_1.expect)(selectiveDisclosure['credentialSubject']).to.be.equal(subjectDid);
            (0, chai_1.should)().exist(selectiveDisclosure['expirationDate']);
            (0, chai_1.should)().exist(selectiveDisclosure['issuanceDate']);
            (0, chai_1.should)().exist(selectiveDisclosure['issuer']);
            (0, chai_1.expect)(selectiveDisclosure['issuer']).to.be.equal(issuerDid);
            (0, chai_1.should)().exist(selectiveDisclosure['proof']);
            (0, chai_1.should)().exist(selectiveDisclosure['proof'].type);
            (0, chai_1.expect)(selectiveDisclosure['proof'].type).to.be.equal('BabyJubJubSignatureProof2021');
            (0, chai_1.should)().exist(selectiveDisclosure['proof'].created);
            (0, chai_1.should)().exist(selectiveDisclosure['proof'].verificationMethod);
            (0, chai_1.should)().exist(selectiveDisclosure['proof'].proofPurpose);
            (0, chai_1.should)().exist(selectiveDisclosure['proof'].credentialRoot);
            (0, chai_1.should)().exist(selectiveDisclosure['proof'].proofValue);
        }));
    });
    describe('#verify() method for verifying credential', function () {
        it('should be able to verify credential', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credential: signedVC1,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                };
                const verificationResult = yield hsSdk.vc.bjjVC.verify(params);
                (0, chai_1.expect)(verificationResult).to.be.a('object');
                (0, chai_1.should)().exist(verificationResult.verified);
                (0, chai_1.expect)(verificationResult.verified).to.be.equal(true);
                (0, chai_1.should)().exist(verificationResult.results);
                (0, chai_1.expect)(verificationResult.results).to.be.a('array');
                (0, chai_1.should)().exist(verificationResult.statusResult);
                (0, chai_1.expect)(verificationResult.statusResult.verified).to.be.equal(true);
            });
        });
        it('should not be able to verify credential as verificationMethodId is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credential: signedVC,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                };
                params.verificationMethodId = '';
                return hsSdk.vc.bjjVC.verify(params).catch(function (err) {
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
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                };
                params.issuerDid = '';
                return hsSdk.vc.bjjVC.verify(params).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid or params.issuerDidDocument is required to verify credential');
                });
            });
        });
        it('should not be able to verify credential as proof is null or undefined', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credential: signedVC,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                };
                if (params.credential) {
                    params.credential.proof = undefined;
                }
                return hsSdk.vc.bjjVC.verify(params).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.credential.proof is required to verify credential');
                });
            });
        });
        it('should not be able to verify credential as credential is null or undefined', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credential: signedVC,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                };
                params.credential = null;
                return hsSdk.vc.bjjVC.verify(params).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.credential is required to verify credential');
                });
            });
        });
    });
});
describe('Verifiable Credential Status Opearations', () => {
    describe('#checkCredentialStatus() method to check status of the credential', function () {
        it('should not be able to check credential as credentialId is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.vc.bjjVC.checkCredentialStatus().catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
                });
            });
        });
        it('should not be able to check credential as credentialId is invalid', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.vc.bjjVC.checkCredentialStatus({ credentialId: credentialId + 'x' }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'No credential status found. Probably invalid credentialId');
                });
            });
        });
        it('should be able to check credential status', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hsSdk.vc.bjjVC.checkCredentialStatus({ credentialId: credentialId });
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatus.verified);
                (0, chai_1.expect)(credentialStatus.verified).to.be.equal(true);
            });
        });
    });
    describe('#resolveCredentialStatus() method to resolve status of the credential from blockchain', function () {
        it('should not be able to resolve credential as credentialId is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId: '' }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.credentialId is required to resolve credential status');
                });
            });
        });
        it('should be able to check credential status', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId: credentialId });
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
        it('should not be able to update credential as verificationMethodId is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempParams = {
                    credentialStatus: credenStatus,
                    issuerDid,
                    verificationMethodId: '',
                    privateKeyMultibase: issuerPrivateKeyMultibase,
                    status: 'SUSPENDED',
                    statusReason: 'Suspending this credential for some time',
                };
                tempParams.verificationMethodId = '';
                return hsSdk.vc.bjjVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update credential status');
                });
            });
        });
        it('should not be able to update credential as privateKey is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempParams = {
                    credentialStatus: credenStatus,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                    privateKeyMultibase: '',
                    status: 'SUSPENDED',
                    statusReason: 'Suspending this credential for some time',
                };
                tempParams.verificationMethodId = verificationMethod[0].id;
                tempParams.credentialStatus = credenStatus;
                tempParams.privateKeyMultibase = '';
                return hsSdk.vc.bjjVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update credential status');
                });
            });
        });
        it('should not be able to update credential as issuerDid is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempParams = {
                    credentialStatus: credenStatus,
                    issuerDid: '',
                    verificationMethodId: verificationMethod[0].id,
                    privateKeyMultibase: issuerPrivateKeyMultibase,
                    status: 'SUSPENDED',
                    statusReason: 'Suspending this credential for some time',
                };
                tempParams.verificationMethodId = verificationMethod[0].id;
                tempParams.credentialStatus = credenStatus;
                tempParams.privateKeyMultibase = issuerPrivateKeyMultibase;
                tempParams.issuerDid = '';
                return hsSdk.vc.bjjVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.issuerDid is required to update credential status');
                });
            });
        });
        it('should not be able to update credential as status is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempParams = {
                    credentialStatus: credenStatus,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                    privateKeyMultibase: issuerPrivateKeyMultibase,
                    status: '',
                    statusReason: 'Suspending this credential for some time',
                };
                tempParams.verificationMethodId = verificationMethod[0].id;
                tempParams.credentialStatus = credenStatus;
                tempParams.privateKeyMultibase = issuerPrivateKeyMultibase;
                tempParams.issuerDid = issuerDid;
                tempParams.status = '';
                return hsSdk.vc.bjjVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.status is required to update credential status');
                });
            });
        });
        it('should not be able to update credential as status passed is invalid', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempParams = {
                    credentialStatus: credenStatus,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                    privateKeyMultibase: issuerPrivateKeyMultibase,
                    status: 'svgsdvjif',
                    statusReason: 'Suspending this credential for some time',
                };
                tempParams.verificationMethodId = verificationMethod[0].id;
                tempParams.credentialStatus = credenStatus;
                tempParams.privateKeyMultibase = issuerPrivateKeyMultibase;
                tempParams.issuerDid = issuerDid;
                tempParams.status = 'svgsdvjif';
                return hsSdk.vc.bjjVC.updateCredentialStatus(tempParams).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, `HID-SSI-SDK:: Error: params.status is invalid`);
                });
            });
        });
        it('should be able to change credential status to suspended', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
                const params = {
                    credentialStatus,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                    privateKeyMultibase: issuerPrivateKeyMultibase,
                    status: 'SUSPENDED',
                    statusReason: 'Suspending this credential for some time',
                };
                const updatedCredResult = yield hsSdk.vc.bjjVC.updateCredentialStatus(params);
                (0, chai_1.expect)(updatedCredResult).to.be.a('object');
                (0, chai_1.expect)(updatedCredResult.code).to.be.equal(0);
                (0, chai_1.expect)(updatedCredResult.transactionHash).to.be.a('string');
            });
        });
        it('should not be able to suspend a suspended  credential status', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
                const params = {
                    credentialStatus: credentialStatus,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                    privateKeyMultibase: issuerPrivateKeyMultibase,
                    status: 'SUSPENDED',
                    statusReason: 'Suspending this credential for some time',
                };
                return hsSdk.vc.bjjVC.updateCredentialStatus(params).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'failed to execute message; message index: 0: incoming Credential Status Document does not have any changes: invalid Credential Status');
                });
            });
        });
        it('should be able to change credential status to Live', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
                const params = {
                    credentialStatus,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                    privateKeyMultibase: issuerPrivateKeyMultibase,
                    status: 'LIVE',
                    statusReason: 'Setting the status to LIVE',
                };
                const updatedCredResult = yield hsSdk.vc.bjjVC.updateCredentialStatus(params);
                (0, chai_1.expect)(updatedCredResult).to.be.a('object');
                (0, chai_1.expect)(updatedCredResult.code).to.be.equal(0);
                (0, chai_1.expect)(updatedCredResult.transactionHash).to.be.a('string');
            });
        });
        it('should be able to change credential status to Revoke', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
                const params = {
                    credentialStatus,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                    privateKeyMultibase: issuerPrivateKeyMultibase,
                    status: 'REVOKED',
                    statusReason: 'Revoking the credential',
                };
                const updatedCredResult = yield hsSdk.vc.bjjVC.updateCredentialStatus(params);
                (0, chai_1.expect)(updatedCredResult).to.be.a('object');
                (0, chai_1.expect)(updatedCredResult.code).to.be.equal(0);
                (0, chai_1.expect)(updatedCredResult.transactionHash).to.be.a('string');
            });
        });
        it('should not be able to revoke a revoked credential status', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
                const params = {
                    credentialStatus,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                    privateKeyMultibase: issuerPrivateKeyMultibase,
                    status: 'REVOKED',
                    statusReason: 'Revoking the credential',
                };
                return hsSdk.vc.bjjVC.updateCredentialStatus(params).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'failed to execute message; message index: 0: incoming Credential Status Document does not have any changes: invalid Credential Status');
                });
            });
        });
        it('should not be able to change the status of credential as it is revoked', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialStatus = yield hsSdk.vc.bjjVC.resolveCredentialStatus({ credentialId });
                const params = {
                    credentialStatus,
                    issuerDid,
                    verificationMethodId: verificationMethod[0].id,
                    privateKeyMultibase: issuerPrivateKeyMultibase,
                    status: 'SUSPENDED',
                    statusReason: 'Suspending this credential for some time',
                };
                return hsSdk.vc.bjjVC.updateCredentialStatus(params).catch(function (err) {
                    (0, chai_1.expect)(err.message).to.include(`failed to execute message; message index: 0: credential status ${credentialId} could not be updated since it is revoked: invalid Credential Status`);
                });
            });
        });
    });
    describe('#registerCredentialStatus() method to register credential on blockchain', function () {
        it('should not be able to register credential as credentialStatusProof is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.vc.bjjVC.registerCredentialStatus({ credentialStatus: credentialStatus2 }).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: credentialStatus and credentialStatusProof are required to register credential status');
                });
            });
        });
        it('should not be able to register credential as credentialStatus is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.vc.bjjVC
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
                const registerCredDetail = yield hsSdk.vc.bjjVC.registerCredentialStatus({
                    credentialStatus: credentialStatus2,
                    credentialStatusProof: credentialStatusProof2,
                });
                (0, chai_1.expect)(registerCredDetail).to.be.a('object');
                (0, chai_1.should)().exist(registerCredDetail.transactionHash);
            });
        });
        it('should not be able to register credential on blockchain as stutus already registerd on chain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return hsSdk.vc.bjjVC
                    .registerCredentialStatus({
                    credentialStatus: credentialStatus2,
                    credentialStatusProof: credentialStatusProof2,
                })
                    .catch(function (err) {
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
                return hsSdk.vc.bjjVC
                    .generateRegisterCredentialStatusTxnMessage(credentialStatus, credentialStatusProof)
                    .catch(function (err) {
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
                return hsSdk.vc.bjjVC
                    .generateRegisterCredentialStatusTxnMessage(credentialStatus, credentialStatusProof)
                    .catch(function (err) {
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
                const txnMessage1 = yield hsSdk.vc.bjjVC.generateRegisterCredentialStatusTxnMessage(credentialStatus, credentialStatusProof);
                credentialTransMessage.push(txnMessage1);
                const txnMessage2 = yield hsSdk.vc.bjjVC.generateRegisterCredentialStatusTxnMessage(credentialStatus2, credentialStatusProof2);
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
                return hsSdk.vc.bjjVC.registerCredentialStatusTxnBulk(txnMessage).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: txnMessage is required to register credential status');
                });
            });
        });
        it('should be able to register credential on blockchain in a bulk', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const registerCredDetail = yield hsSdk.vc.bjjVC.registerCredentialStatusTxnBulk(credentialTransMessage);
                (0, chai_1.expect)(registerCredDetail).to.be.a('object');
                (0, chai_1.should)().exist(registerCredDetail.transactionHash);
            });
        });
    });
});
// add testcase for sd
