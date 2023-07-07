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
let hypersignSSISDK;
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
let hypersignVP;
let unsignedverifiablePresentation;
let verifiableCredentialPresentationId;
let signedVerifiablePresentation;
const credentialBody = {
    schemaId: '',
    subjectDid: '',
    type: [],
    issuerDid: '',
    fields: { name: 'Varsha' },
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
        // hypersignDID = new HypersignDID(constructorParams);
        // await hypersignDID.init();
        hypersignSchema = new index_1.HypersignSchema(constructorParams);
        yield hypersignSchema.init();
        hypersignVC = new index_1.HypersignVerifiableCredential(constructorParams);
        yield hypersignVC.init();
        // hypersignVP = new HypersignVerifiablePresentation();
        hypersignSSISDK = new index_1.HypersignSSISdk(constructorParams);
        yield hypersignSSISDK.init();
        const { vc, vp, did, schema } = hypersignSSISDK;
        hypersignDID = did;
        hypersignSchema = schema;
        hypersignVP = vp;
        hypersignVC = vc;
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
        it('should be able to generate new credential for a schema with subject DID', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('12/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.subjectDid = didDocId;
                tempCredentialBody['expirationDate'] = expirationDate;
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
    });
    describe('#issueCredential() method for issuing credential', function () {
        it('should be able to issue credential with credential status registered on chain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = didDocId;
                tempIssueCredentialBody.verificationMethodId = verificationMethodId;
                tempIssueCredentialBody.privateKeyMultibase = privateKeyMultibase;
                //console.log(JSON.stringify(tempIssueCredentialBody, null, 2));
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
                // console.log({
                //   signedCredentialId: signedVC ? signedVC['id'] : '',
                //   credentialId,
                //   id: tempIssueCredentialBody.credential.id,
                // });
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
    });
});
/**
 * Test cases related to verifiable presentation
 */
describe('Verifiable Presentation Operataions', () => {
    describe('#generate() method to generate new presentation document', () => {
        const presentationBody = {
            verifiableCredentials: [credentialDetail],
            holderDid: didDocId,
        };
        it('should be able to gnerate a new presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempPresentationBody = Object.assign({}, presentationBody);
            tempPresentationBody.verifiableCredentials[0] = credentialDetail;
            tempPresentationBody.holderDid = didDocId;
            // console.log(JSON.stringify(tempPresentationBody, null, 2));
            unsignedverifiablePresentation = yield hypersignVP.generate(tempPresentationBody);
            // console.log(JSON.stringify(unsignedverifiablePresentation, null, 2));
            (0, chai_1.should)().exist(unsignedverifiablePresentation['@context']);
            (0, chai_1.should)().exist(unsignedverifiablePresentation['type']);
            (0, chai_1.expect)(unsignedverifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
            (0, chai_1.should)().exist(unsignedverifiablePresentation['verifiableCredential']);
            (0, chai_1.expect)(unsignedverifiablePresentation.verifiableCredential).to.be.a('array');
            (0, chai_1.should)().exist(unsignedverifiablePresentation['id']);
            (0, chai_1.should)().exist(unsignedverifiablePresentation['holder']);
            verifiableCredentialPresentationId = unsignedverifiablePresentation.id;
            // expect(unsignedverifiablePresentation['verifiableCredential'][0].id).to.be.equal(credentialId);
        }));
    });
    describe('#sign() method to sign presentation document', () => {
        const signPresentationBody = {
            presentation: unsignedverifiablePresentation,
            holderDid: didDocId,
            verificationMethodId,
            privateKeyMultibase: privateKeyMultibase,
            challenge,
        };
        it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSignPresentationBody = Object.assign({}, signPresentationBody);
                tempSignPresentationBody.presentation = unsignedverifiablePresentation;
                tempSignPresentationBody.holderDid = didDocId;
                tempSignPresentationBody.verificationMethodId = verificationMethodId;
                tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
                tempSignPresentationBody['holderDidDocSigned'] = signedDocument;
                return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
                });
            });
        });
        it('should not be able to sign presentation as privateKeyMultibase in null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSignPresentationBody = Object.assign({}, signPresentationBody);
                tempSignPresentationBody.privateKeyMultibase = '';
                return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.privateKeyMultibase is required for signing a presentation');
                });
            });
        });
        // it('should not be able to sign presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
        //   const tempSignPresentationBody = { ...signPresentationBody };
        //   tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
        //   tempSignPresentationBody.presentation = {} as IVerifiablePresentation;
        //   return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
        //     expect(function () {
        //       throw err;
        //     }).to.throw(Error, 'HID-SSI-SDK:: params.presentation is required for signinng a presentation');
        //   });
        // });
        it('should not be able to sign presentation as challenge is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSignPresentationBody = Object.assign({}, signPresentationBody);
                tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
                tempSignPresentationBody.presentation = unsignedverifiablePresentation;
                tempSignPresentationBody.challenge = '';
                return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for signinng a presentation');
                });
            });
        });
        it('should not be able to sign presentation as verificationMethodId is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSignPresentationBody = Object.assign({}, signPresentationBody);
                tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
                tempSignPresentationBody.presentation = unsignedverifiablePresentation;
                tempSignPresentationBody.challenge = challenge;
                tempSignPresentationBody.verificationMethodId = '';
                return hypersignVP.sign(tempSignPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.verificationMethodId is required for signinng a presentation');
                });
            });
        });
        it('should be able a sign presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSignPresentationBody = Object.assign({}, signPresentationBody);
            tempSignPresentationBody.presentation = unsignedverifiablePresentation;
            tempSignPresentationBody.holderDid = didDocId;
            tempSignPresentationBody.verificationMethodId = verificationMethodId;
            tempSignPresentationBody.privateKeyMultibase = privateKeyMultibase;
            signedVerifiablePresentation = yield hypersignVP.sign(tempSignPresentationBody);
            // console.log(JSON.stringify(signedVerifiablePresentation, null, 2));
            (0, chai_1.should)().exist(signedVerifiablePresentation['@context']);
            (0, chai_1.should)().exist(signedVerifiablePresentation['type']);
            (0, chai_1.expect)(signedVerifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
            (0, chai_1.should)().exist(signedVerifiablePresentation['verifiableCredential']);
            (0, chai_1.expect)(signedVerifiablePresentation.id).to.be.equal(verifiableCredentialPresentationId);
        }));
    });
    describe('#verify() method to verify a signed presentation document', () => {
        const verifyPresentationBody = {
            signedPresentation: signedVerifiablePresentation,
            holderDid: didDocId,
            holderVerificationMethodId: verificationMethodId,
            issuerVerificationMethodId: verificationMethodId,
            privateKey: privateKeyMultibase,
            challenge,
            issuerDid: didDocId,
        };
        it('should not be able to verify presentation as either holderDid or holderDidDocSigned is required but passed both', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
                tempverifyPresentationBody.holderDid = didDocId;
                tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
                tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
                tempverifyPresentationBody.privateKey = privateKeyMultibase;
                tempverifyPresentationBody['holderDidDocSigned'] = signedDocument;
                return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
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
                return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
                });
            });
        });
        it('should not be able to verify presentation as challenge is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = didDocId;
                tempverifyPresentationBody.challenge = '';
                return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for verifying a presentation');
                });
            });
        });
        it('should not be able to verify presentation as holderVerificationMethodId is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = didDocId;
                tempverifyPresentationBody.challenge = challenge;
                tempverifyPresentationBody.holderVerificationMethodId = '';
                return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.holderVerificationMethodId is required for verifying a presentation');
                });
            });
        });
        it('should not be able to verify presentation as issuerVerificationMethodId is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = didDocId;
                tempverifyPresentationBody.challenge = challenge;
                tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
                tempverifyPresentationBody.issuerVerificationMethodId = '';
                return hypersignVP.verify(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
                });
            });
        });
        it('should be able a verify sgned presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
            tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
            tempverifyPresentationBody.issuerDid = didDocId;
            tempverifyPresentationBody.holderDid = didDocId;
            tempverifyPresentationBody.holderVerificationMethodId = verificationMethodId;
            tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
            tempverifyPresentationBody.challenge = didDocId;
            const verifiedPresentationDetail = yield hypersignVP.verify(tempverifyPresentationBody);
            // console.log(JSON.stringify(verifiedPresentationDetail, null, 2));
            (0, chai_1.should)().exist(verifiedPresentationDetail.verified);
            (0, chai_1.expect)(verifiedPresentationDetail.verified).to.be.equal(true);
            (0, chai_1.expect)(verifiedPresentationDetail).to.be.a('object');
            (0, chai_1.should)().exist(verifiedPresentationDetail.results);
            (0, chai_1.expect)(verifiedPresentationDetail.results).to.be.a('array');
            (0, chai_1.should)().exist(verifiedPresentationDetail.credentialResults);
            (0, chai_1.expect)(verifiedPresentationDetail.credentialResults).to.be.a('array');
            (0, chai_1.expect)(verifiedPresentationDetail.credentialResults[0].verified).to.be.equal(true);
            (0, chai_1.expect)(verifiedPresentationDetail.credentialResults[0].credentialId).to.be.equal(credentialId);
        }));
    });
});
