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
let credentialStatusId;
let credenStatus;
let verificationMethod;
let schemaObject;
let signedSchema;
let schemaId;
let subjectDid;
let signedVC1;
let issuerDid;
let issuerDidDoc;
let subjectDidDoc;
let credentialDetail;
let credentialId;
let signedVp1;
let signedVC;
let unsignedSdVerifiablePresentation;
let unsignedVerifiablePresentation;
let signedVp;
let signedSdVp;
let selectiveDisclosure;
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
/**
 * DID creation and registration
 */
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
// /**
//  * Schema Creation and Registration
//  */
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
// /**
//  * Test cases related to credential
//  */
describe('Credential Operation', () => {
    describe('#generate() method to generate a credential', function () {
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
    });
    describe('#issueCredential() method for issuing credential', function () {
        it('should be able to issue credential with credential status registered on chain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = issuerDid;
                tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
                tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
                const issuedCredResult = yield hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
                const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = issuedCredResult;
                signedVC1 = {};
                Object.assign(signedVC1, signedCredential);
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
    });
    describe('#generateSeletiveDisclosure() method for genertaing sd', function () {
        const presentationBody = {
            verifiableCredential: signedVC1,
            frame: {},
            verificationMethodId: '',
            issuerDid,
        };
        it('should be able to generate a sd document', () => __awaiter(this, void 0, void 0, function* () {
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
});
// /**
//  * Test cases related to verifiable presentation
//  */
describe('Verifiable Presentation Operataions', () => {
    describe('#generate() method to generate new presentation document', () => {
        it('should be able to generate a new presentation for sd document', () => __awaiter(void 0, void 0, void 0, function* () {
            const presentationBody = {
                verifiableCredentials: [selectiveDisclosure],
                holderDid: subjectDid,
            };
            const tempPresentationBody = Object.assign({}, presentationBody);
            tempPresentationBody.holderDid = subjectDid;
            unsignedSdVerifiablePresentation = yield hsSdk.vp.bjjVp.generate(tempPresentationBody);
            (0, chai_1.should)().exist(unsignedSdVerifiablePresentation['@context']);
            (0, chai_1.should)().exist(unsignedSdVerifiablePresentation['type']);
            (0, chai_1.expect)(unsignedSdVerifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
            (0, chai_1.should)().exist(unsignedSdVerifiablePresentation['verifiableCredential']);
            (0, chai_1.expect)(unsignedSdVerifiablePresentation.verifiableCredential).to.be.a('array');
            (0, chai_1.should)().exist(unsignedSdVerifiablePresentation['id']);
            (0, chai_1.should)().exist(unsignedSdVerifiablePresentation['holder']);
        }));
        it('should be able to generate a presentation for credential document', () => __awaiter(void 0, void 0, void 0, function* () {
            const presentationBody = {
                verifiableCredentials: [signedVC1],
                holderDid: subjectDid,
            };
            const tempPresentationBody = Object.assign({}, presentationBody);
            tempPresentationBody.holderDid = subjectDid;
            unsignedVerifiablePresentation = yield hsSdk.vp.bjjVp.generate(tempPresentationBody);
            (0, chai_1.should)().exist(unsignedVerifiablePresentation['@context']);
            (0, chai_1.should)().exist(unsignedVerifiablePresentation['type']);
            (0, chai_1.expect)(unsignedVerifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
            (0, chai_1.should)().exist(unsignedVerifiablePresentation['verifiableCredential']);
            (0, chai_1.expect)(unsignedVerifiablePresentation.verifiableCredential).to.be.a('array');
            (0, chai_1.should)().exist(unsignedVerifiablePresentation['id']);
            (0, chai_1.should)().exist(unsignedVerifiablePresentation['holder']);
        }));
    });
    describe('#sign() method to sign presentation of credential', () => {
        const signPresentaionBody = {
            presentation: unsignedVerifiablePresentation,
            holderDid: subjectDid,
            verificationMethodId: '',
            privateKeyMultibase: holderPrivateKeyMultibase,
            challenge: 'abc',
            domain: 'www.xyz.com',
        };
        it('should not be able to sign a presentation as both holderDidDoc as well did is passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSignPresentaionBody = Object.assign({}, signPresentaionBody);
            tempSignPresentaionBody['holderDid'] = subjectDid;
            tempSignPresentaionBody['holderDidDocSigned'] = subjectDidDoc;
            return hsSdk.vp.bjjVp.sign(tempSignPresentaionBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
            });
        }));
        it('should not be able to sign a presentation as privateKeyMultibase is not passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSignPresentaionBody = Object.assign({}, signPresentaionBody);
            tempSignPresentaionBody['holderDid'] = subjectDid;
            tempSignPresentaionBody['privateKeyMultibase'] = '';
            return hsSdk.vp.bjjVp.sign(tempSignPresentaionBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.privateKeyMultibase is required for signing a presentation');
            });
        }));
        it('should not be able to sign a presentation as presentation is not passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSignPresentaionBody = Object.assign({}, signPresentaionBody);
            tempSignPresentaionBody['holderDid'] = subjectDid;
            tempSignPresentaionBody['privateKeyMultibase'] = holderPrivateKeyMultibase;
            tempSignPresentaionBody['presentation'] = null;
            return hsSdk.vp.bjjVp.sign(tempSignPresentaionBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.presentation is required for signing a presentation');
            });
        }));
        it('should not be able to sign a presentation as verificationMethodId is not passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSignPresentaionBody = Object.assign({}, signPresentaionBody);
            tempSignPresentaionBody['holderDid'] = subjectDid;
            tempSignPresentaionBody['privateKeyMultibase'] = holderPrivateKeyMultibase;
            tempSignPresentaionBody['presentation'] = unsignedVerifiablePresentation;
            tempSignPresentaionBody['challenge'] = 'abc';
            return hsSdk.vp.bjjVp.sign(tempSignPresentaionBody).catch(function (err) {
                (0, chai_1.expect)(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.verificationMethodId is required for signing a presentation');
            });
        }));
        it('should be able to sign a selective discloser presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const presentationBody = {
                presentation: unsignedSdVerifiablePresentation,
                holderDid: subjectDid,
                verificationMethodId: subjectDidDoc.authentication[0],
                privateKeyMultibase: holderPrivateKeyMultibase,
                challenge: 'abc',
                domain: 'www.xyz.com',
            };
            signedSdVp = yield hsSdk.vp.bjjVp.sign(presentationBody);
            (0, chai_1.should)().exist(signedSdVp['@context']);
            (0, chai_1.should)().exist(signedSdVp['type']);
            (0, chai_1.expect)(signedSdVp.type[0]).to.be.equal('VerifiablePresentation');
            (0, chai_1.should)().exist(signedSdVp['verifiableCredential']);
            (0, chai_1.should)().exist(signedSdVp['id']);
            (0, chai_1.should)().exist(signedSdVp['holder']);
            (0, chai_1.should)().exist(signedSdVp['proof']);
            (0, chai_1.expect)(signedSdVp['proof'].type).to.be.equal('BJJSignature2021');
            (0, chai_1.should)().exist(signedSdVp['proof'].created);
            (0, chai_1.should)().exist(signedSdVp['proof'].verificationMethod);
            (0, chai_1.should)().exist(signedSdVp['proof'].proofPurpose);
            (0, chai_1.should)().exist(signedSdVp['proof'].challenge);
            (0, chai_1.should)().exist(signedSdVp['proof'].proofValue);
        }));
        it('should be able to sign a verifiable presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const presentationBody = {
                presentation: unsignedVerifiablePresentation,
                holderDid: subjectDid,
                verificationMethodId: subjectDidDoc.authentication[0],
                privateKeyMultibase: holderPrivateKeyMultibase,
                challenge: 'abc',
                domain: 'www.xyz.com',
            };
            signedVp = yield hsSdk.vp.bjjVp.sign(presentationBody);
            signedVp1 = {};
            Object.assign(signedVp1, signedVp);
            (0, chai_1.should)().exist(signedVp['@context']);
            (0, chai_1.should)().exist(signedVp['type']);
            (0, chai_1.expect)(signedVp.type[0]).to.be.equal('VerifiablePresentation');
            (0, chai_1.should)().exist(signedVp['verifiableCredential']);
            (0, chai_1.should)().exist(signedVp['id']);
            (0, chai_1.should)().exist(signedVp['holder']);
            (0, chai_1.should)().exist(signedVp['proof']);
            (0, chai_1.expect)(signedVp['proof'].type).to.be.equal('BJJSignature2021');
            (0, chai_1.should)().exist(signedVp['proof'].created);
            (0, chai_1.should)().exist(signedVp['proof'].verificationMethod);
            (0, chai_1.should)().exist(signedVp['proof'].proofPurpose);
            (0, chai_1.should)().exist(signedVp['proof'].challenge);
            (0, chai_1.should)().exist(signedVp['proof'].proofValue);
        }));
    });
    describe('#verify() method to verify signed presentation of credential', () => {
        const verifyPresentationBody = {
            signedPresentation: signedSdVp,
            challenge: 'abc',
            domain: 'www.xyz.com',
            issuerDid,
            holderDid: subjectDid,
            issuerVerificationMethodId: '',
            holderVerificationMethodId: '',
        };
        it('should not be able to verify presentation as either holderDid or holderDidDocSigned is required but passed both', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.signedPresentation = signedVp;
                tempverifyPresentationBody.holderDid = subjectDid;
                tempverifyPresentationBody.holderVerificationMethodId = subjectDidDoc.verificationMethod[0].id;
                tempverifyPresentationBody.issuerVerificationMethodId = verificationMethod[0].id;
                tempverifyPresentationBody['holderDidDocSigned'] = subjectDidDoc;
                return hsSdk.vp.bjjVp.verify(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
                });
            });
        });
        it('should not be able to verify presentation as issuerDid is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = '';
                return hsSdk.vp.bjjVp.verify(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
                });
            });
        });
        it('should not be able to verify presentation as challenge is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = issuerDid;
                tempverifyPresentationBody.challenge = '';
                return hsSdk.vp.bjjVp.verify(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for verifying a presentation');
                });
            });
        });
        it('should not be able to verify presentation as holderVerificationMethodId is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = issuerDid;
                tempverifyPresentationBody.challenge = 'abc';
                tempverifyPresentationBody.holderVerificationMethodId = '';
                return hsSdk.vp.bjjVp.verify(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.holderVerificationMethodId is required for verifying a presentation');
                });
            });
        });
        it('should not be able to verify presentation as issuerVerificationMethodId is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = issuerDid;
                tempverifyPresentationBody.challenge = 'abc';
                tempverifyPresentationBody.holderVerificationMethodId = subjectDidDoc.verificationMethod[0].id;
                tempverifyPresentationBody.issuerVerificationMethodId = '';
                return hsSdk.vp.bjjVp.verify(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
                });
            });
        });
        it('should not be able to verify a sd presentation as challenge is different that used in signing', () => __awaiter(void 0, void 0, void 0, function* () {
            const presentationBody = {
                signedPresentation: JSON.parse(JSON.stringify(signedSdVp)),
                challenge: 'abcdvfgh',
                domain: 'www.xyz.com',
                issuerDid,
                holderDid: subjectDid,
                issuerVerificationMethodId: issuerDidDoc.assertionMethod[0],
                holderVerificationMethodId: subjectDidDoc.authentication[0],
            };
            const verifiedVp = yield hsSdk.vp.bjjVp.verify(presentationBody);
            (0, chai_1.should)().exist(verifiedVp['verified']);
            (0, chai_1.expect)(verifiedVp.verified).to.be.equal(false);
            (0, chai_1.should)().exist(verifiedVp['results']);
            (0, chai_1.expect)(verifiedVp.results).to.be.a('array');
            (0, chai_1.expect)(verifiedVp.results[0].verified).to.be.equal(false);
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult).to.be.a('array');
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult.length).to.be.greaterThan(0);
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult[0].verified).to.be.equal(true);
        }));
        it('should not be able to verify a sd presentation as domain is different that used in signing', () => __awaiter(void 0, void 0, void 0, function* () {
            const presentationBody = {
                signedPresentation: JSON.parse(JSON.stringify(signedSdVp)),
                challenge: 'abc',
                domain: 'www.xyz1.com',
                issuerDid,
                holderDid: subjectDid,
                issuerVerificationMethodId: issuerDidDoc.assertionMethod[0],
                holderVerificationMethodId: subjectDidDoc.authentication[0],
            };
            const verifiedVp = yield hsSdk.vp.bjjVp.verify(presentationBody);
            (0, chai_1.should)().exist(verifiedVp['verified']);
            (0, chai_1.expect)(verifiedVp.verified).to.be.equal(false);
            (0, chai_1.should)().exist(verifiedVp['results']);
            (0, chai_1.expect)(verifiedVp.results).to.be.a('array');
            (0, chai_1.expect)(verifiedVp.results[0].verified).to.be.equal(false);
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult).to.be.a('array');
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult.length).to.be.greaterThan(0);
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult[0].verified).to.be.equal(true);
        }));
        it('should be able to verify a sd presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const presentationBody = {
                signedPresentation: signedSdVp,
                challenge: 'abc',
                domain: 'www.xyz.com',
                issuerDid,
                holderDid: subjectDid,
                issuerVerificationMethodId: issuerDidDoc.assertionMethod[0],
                holderVerificationMethodId: subjectDidDoc.authentication[0],
            };
            const verifiedVp = yield hsSdk.vp.bjjVp.verify(presentationBody);
            (0, chai_1.should)().exist(verifiedVp['verified']);
            (0, chai_1.expect)(verifiedVp.verified).to.be.equal(true);
            (0, chai_1.should)().exist(verifiedVp['results']);
            (0, chai_1.expect)(verifiedVp.results).to.be.a('array');
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult).to.be.a('array');
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult.length).to.be.greaterThan(0);
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult[0].verified).to.be.equal(true);
        }));
        it('should not be able to verify presentation as challenge used at the time of verification is different than challenge used in vp sign and getting presentation verification result false', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.signedPresentation = signedVp1;
                tempverifyPresentationBody.issuerDid = issuerDid;
                tempverifyPresentationBody.holderDid = subjectDid;
                tempverifyPresentationBody.challenge = 'abczshdsfhgk';
                tempverifyPresentationBody['domain'] = 'http://xyz.com';
                tempverifyPresentationBody.holderVerificationMethodId = subjectDidDoc.assertionMethod[0];
                tempverifyPresentationBody.issuerVerificationMethodId = issuerDidDoc.assertionMethod[0];
                const verifiedPresentationDetail = yield hsSdk.vp.bjjVp.verify(tempverifyPresentationBody);
                (0, chai_1.expect)(verifiedPresentationDetail.verified).to.be.equal(false);
                (0, chai_1.expect)(verifiedPresentationDetail.results[0].verified).to.be.equal(false);
            });
        });
        it('should not be able to verify presentation as domain used at the time of vp verification is differ than domain used in vp sign and getting  presentation verification result false', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.signedPresentation = signedVp1;
                tempverifyPresentationBody.issuerDid = issuerDid;
                tempverifyPresentationBody.holderDid = subjectDid;
                tempverifyPresentationBody.challenge = 'abc';
                tempverifyPresentationBody['domain'] = 'http://xyz1.com';
                tempverifyPresentationBody.holderVerificationMethodId = subjectDidDoc.authentication[0];
                tempverifyPresentationBody.issuerVerificationMethodId = issuerDidDoc.assertionMethod[0];
                const verifiedPresentationDetail = yield hsSdk.vp.bjjVp.verify(tempverifyPresentationBody);
                (0, chai_1.expect)(verifiedPresentationDetail.verified).to.be.equal(false);
                (0, chai_1.expect)(verifiedPresentationDetail.results[0].verified).to.be.equal(false);
            });
        });
        it('should be able to verify a presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const presentationBody = {
                signedPresentation: signedVp1,
                challenge: 'abc',
                domain: 'www.xyz.com',
                issuerDid,
                holderDid: subjectDid,
                issuerVerificationMethodId: issuerDidDoc.assertionMethod[0],
                holderVerificationMethodId: subjectDidDoc.authentication[0],
            };
            const verifiedVp = yield hsSdk.vp.bjjVp.verify(presentationBody);
            (0, chai_1.should)().exist(verifiedVp['verified']);
            (0, chai_1.expect)(verifiedVp.verified).to.be.equal(true);
            (0, chai_1.should)().exist(verifiedVp['results']);
            (0, chai_1.expect)(verifiedVp.results).to.be.a('array');
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult).to.be.a('array');
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult.length).to.be.greaterThan(0);
            (0, chai_1.expect)(verifiedVp.results[1].credentialResult[0].verified).to.be.equal(true);
        }));
    });
});
