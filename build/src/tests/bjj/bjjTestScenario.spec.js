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
const index_1 = require("../../index");
const chai_1 = require("chai");
const config_1 = require("../config");
const enums_1 = require("../../../libs/generated/ssi/client/enums");
let offlineSigner;
let hsSdk;
let privateKeyMultibase;
let publicKeyMultibase;
let didDocument;
let didDocId;
let subjectDid;
let verificationMethodId;
let bjjPubKey;
let bjjPrivKey;
let schemaObject;
let signedSchema;
let schemaId;
let credentialDetail;
let signedVC;
let unsignedverifiablePresentation;
let issuerDidDoc;
let issuerDid;
let holderDidDoc;
let holderDid;
let signedVerifiablePresentation;
let challenge;
let credenStatus;
let credentialStatusId;
let credentialId;
let verifiableCredentialPresentationId;
let IssuerKp;
let holderKp;
const schemaBody = {
    name: 'TestSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [{ name: 'name', type: 'string', isRequired: true }],
    additionalProperties: false,
};
const credentialBody = {
    schemaId: '',
    subjectDid: '',
    type: [],
    issuerDid: '',
    fields: { name: 'Varsha' },
    expirationDate: '',
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
describe('DID Test scenarios', () => {
    describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
        it('should return publickeyMultibase and privateKeyMultibase', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const kp = yield hsSdk.did.generateKeys();
                privateKeyMultibase = kp.privateKeyMultibase;
                publicKeyMultibase = kp.publicKeyMultibase;
                const bjjKp = yield hsSdk.did.bjjDID.generateKeys();
                bjjPubKey = bjjKp.publicKeyMultibase;
                bjjPrivKey = bjjKp.privateKeyMultibase;
            });
        });
    });
    describe('Bjj test scenario', function () {
        it('Should be able to generate and register a DID using the Ed25519 key type, and update it by adding a Baby JubJub (BJJ) verification method (VM)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                didDocument = yield hsSdk.did.generate({ publicKeyMultibase });
                didDocId = didDocument['id'];
                verificationMethodId = didDocument['verificationMethod'][0].id;
                yield hsSdk.did.register({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId,
                });
                const didDocWithBjjVM = yield hsSdk.did.addVerificationMethod({
                    didDocument,
                    type: enums_1.VerificationMethodTypes.BabyJubJubKey2021,
                    publicKeyMultibase: bjjPubKey,
                });
                const resolvedDid = yield hsSdk.did.resolve({ did: didDocId });
                delete didDocWithBjjVM.alsoKnownAs;
                const bjjSign = yield hsSdk.did.bjjDID.update({
                    didDocument: didDocWithBjjVM,
                    privateKeyMultibase: bjjPrivKey,
                    verificationMethodId: didDocWithBjjVM.verificationMethod[1].id,
                    versionId: resolvedDid.didDocumentMetadata.versionId,
                    readonly: true,
                });
                yield hsSdk.did.update({
                    didDocument: didDocWithBjjVM,
                    privateKeyMultibase,
                    verificationMethodId: verificationMethodId,
                    versionId: resolvedDid.didDocumentMetadata.versionId,
                    otherSignInfo: bjjSign.signInfos,
                });
                const resolvedBjjDid = yield hsSdk.did.resolve({ did: didDocId });
                // console.log(resolvedBjjDid)
            });
        });
        it('Should be able to generate and register a DID using the Bjj key type, and update it by adding a Ed255 verification method (VM)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const holderDidDocument = yield hsSdk.did.bjjDID.generate({ publicKeyMultibase: bjjPubKey });
                subjectDid = holderDidDocument['id'];
                const verificationMethodId = holderDidDocument['verificationMethod'][0].id;
                yield hsSdk.did.bjjDID.register({
                    didDocument: holderDidDocument,
                    privateKeyMultibase: bjjPrivKey,
                    verificationMethodId,
                });
                const didDocWithEdd255VM = yield hsSdk.did.addVerificationMethod({
                    didDocument: holderDidDocument,
                    type: enums_1.VerificationMethodTypes.Ed25519VerificationKey2020,
                    publicKeyMultibase,
                });
                const resolvedDid = yield hsSdk.did.resolve({ did: subjectDid });
                delete didDocWithEdd255VM.alsoKnownAs;
                const ed255Sign = yield hsSdk.did.update({
                    didDocument: didDocWithEdd255VM,
                    privateKeyMultibase: privateKeyMultibase,
                    verificationMethodId: didDocWithEdd255VM.verificationMethod[1].id,
                    versionId: resolvedDid.didDocumentMetadata.versionId,
                    readonly: true,
                });
                delete didDocWithEdd255VM.proof;
                yield hsSdk.did.bjjDID.update({
                    didDocument: didDocWithEdd255VM,
                    privateKeyMultibase: bjjPrivKey,
                    verificationMethodId: verificationMethodId,
                    versionId: resolvedDid.didDocumentMetadata.versionId,
                    otherSignInfo: ed255Sign.signInfos,
                });
                const resolvedBjjDid = yield hsSdk.did.resolve({ did: subjectDid });
                // console.log(resolvedBjjDid.didDocument.verificationMethod, 'resolvedBjjDid');
            });
        });
    });
    describe('Register did with two vm together', function () {
        it('Should be able to generate a DID BJJ and register it by adding Ed255 VM', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const ed25519Kp = yield hsSdk.did.generateKeys();
                IssuerKp = yield hsSdk.did.bjjDID.generateKeys();
                issuerDidDoc = yield hsSdk.did.bjjDID.generate({ publicKeyMultibase: IssuerKp.publicKeyMultibase });
                issuerDid = issuerDidDoc['id'];
                const verificationMethodId = issuerDidDoc['verificationMethod'][0].id;
                const didDocWithEdd255VM = yield hsSdk.did.addVerificationMethod({
                    didDocument: issuerDidDoc,
                    type: enums_1.VerificationMethodTypes.Ed25519VerificationKey2020,
                    publicKeyMultibase: ed25519Kp.publicKeyMultibase,
                });
                delete didDocWithEdd255VM.alsoKnownAs;
                let ed255Sign = yield hsSdk.did.createSignInfos({
                    didDocument: didDocWithEdd255VM,
                    privateKeyMultibase: ed25519Kp.privateKeyMultibase,
                    verificationMethodId: didDocWithEdd255VM.verificationMethod[1].id,
                });
                ed255Sign = ed255Sign[0];
                delete didDocWithEdd255VM.proof;
                let bjjSign = yield hsSdk.did.bjjDID.createSignInfos({
                    didDocument: didDocWithEdd255VM,
                    privateKeyMultibase: IssuerKp.privateKeyMultibase,
                    verificationMethodId: verificationMethodId,
                });
                bjjSign = bjjSign[0];
                const registeredDid = yield hsSdk.did.registerByClientSpec({
                    didDocument: didDocWithEdd255VM,
                    signInfos: [
                        {
                            type: bjjSign.type,
                            verification_method_id: bjjSign.verification_method_id,
                            signature: bjjSign.signature,
                            created: bjjSign.created
                        },
                        {
                            type: ed255Sign.type,
                            verification_method_id: ed255Sign.verification_method_id,
                            signature: ed255Sign.signature,
                            created: ed255Sign.created
                        },
                    ]
                });
                //console.log(registeredDid)
            });
        });
        it('Should be able to generate a Ed255 Did and register it by adding Bjj VM', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const ed25519Kp = yield hsSdk.did.generateKeys();
                holderKp = yield hsSdk.did.bjjDID.generateKeys();
                holderDidDoc = yield hsSdk.did.generate({ publicKeyMultibase: ed25519Kp.publicKeyMultibase });
                holderDid = holderDidDoc['id'];
                const verificationMethodId = holderDidDoc['verificationMethod'][0].id;
                const didDocWithBJJVM = yield hsSdk.did.addVerificationMethod({
                    didDocument: holderDidDoc,
                    type: enums_1.VerificationMethodTypes.BabyJubJubKey2021,
                    publicKeyMultibase: holderKp.publicKeyMultibase,
                });
                delete didDocWithBJJVM.alsoKnownAs;
                let bjjSign = yield hsSdk.did.bjjDID.createSignInfos({
                    didDocument: didDocWithBJJVM,
                    privateKeyMultibase: holderKp.privateKeyMultibase,
                    verificationMethodId: didDocWithBJJVM.verificationMethod[1].id,
                });
                bjjSign = bjjSign[0];
                let ed255Sign = yield hsSdk.did.createSignInfos({
                    didDocument: didDocWithBJJVM,
                    privateKeyMultibase: ed25519Kp.privateKeyMultibase,
                    verificationMethodId,
                });
                ed255Sign = ed255Sign[0];
                const registeredDid = yield hsSdk.did.registerByClientSpec({
                    didDocument: didDocWithBJJVM,
                    signInfos: [
                        {
                            type: 'Ed25519Signature2020',
                            verification_method_id: verificationMethodId,
                            signature: ed255Sign.signature,
                            created: ed255Sign.created
                        },
                        {
                            type: 'BJJSignature2021',
                            verification_method_id: bjjSign.verification_method_id,
                            signature: bjjSign.signature,
                            created: bjjSign.created
                        },
                    ]
                });
                // console.log(registeredDid)
            });
        });
    });
});
describe('#generate() method to create schema', function () {
    it('should be able to create a new schema', function () {
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
        });
    });
});
describe('#sign() function to sign schema', function () {
    it('should be able to sign newly created schema', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const tempSchemaBody = JSON.parse(JSON.stringify(schemaObject));
            signedSchema = yield hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase: IssuerKp.privateKeyMultibase,
                schema: tempSchemaBody,
                verificationMethodId: issuerDidDoc.verificationMethod[0].id,
            });
            (0, chai_1.expect)(signedSchema).to.be.a('object');
            (0, chai_1.should)().exist(signedSchema.proof);
            (0, chai_1.should)().exist(signedSchema.proof.type);
            (0, chai_1.should)().exist(signedSchema.proof.verificationMethod);
            (0, chai_1.should)().exist(signedSchema.proof.proofPurpose);
            (0, chai_1.should)().exist(signedSchema.proof.proofValue);
            (0, chai_1.should)().exist(signedSchema.proof.created);
            (0, chai_1.should)().exist(signedSchema.type);
            (0, chai_1.should)().exist(signedSchema.modelVersion);
            (0, chai_1.should)().exist(signedSchema.author);
            (0, chai_1.should)().exist(signedSchema['id']);
            (0, chai_1.should)().exist(signedSchema['name']);
            (0, chai_1.should)().exist(signedSchema['author']);
            (0, chai_1.should)().exist(signedSchema['authored']);
            (0, chai_1.should)().exist(signedSchema['schema']);
        });
    });
});
describe('#register() function to register schema on blockchain', function () {
    it('should be able to register schema on blockchain', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const registeredSchema = yield hsSdk.schema.hypersignBjjschema.register({
                schema: signedSchema,
            });
            (0, chai_1.should)().exist(registeredSchema.transactionHash);
        });
    });
});
describe('Verifiable Credential Opearations', () => {
    describe('#generate() method to generate a credential', function () {
        it('should be able to generate new credential for a schema with subject DID', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('12/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.subjectDid = holderDid;
                tempCredentialBody['expirationDate'] = expirationDate.toString();
                tempCredentialBody.issuerDid = issuerDid;
                tempCredentialBody.fields = { name: 'varsha' };
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
            });
        });
    });
    describe('#issueCredential() method for issuing credential', function () {
        it('should be able to issue credential with credential status registered on chain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempIssueCredentialBody = Object.assign({}, issueCredentialBody);
                tempIssueCredentialBody.credential = credentialDetail;
                tempIssueCredentialBody.issuerDid = issuerDid;
                tempIssueCredentialBody.verificationMethodId = issuerDidDoc.verificationMethod[0].id;
                tempIssueCredentialBody.privateKeyMultibase = IssuerKp.privateKeyMultibase;
                const issuedCredResult = yield hsSdk.vc.bjjVC.issue(tempIssueCredentialBody);
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
    });
    describe('#verifyCredential() method to verify a credential', function () {
        it('should be able to verify credential', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const params = {
                    credential: signedVC,
                    issuerDid: issuerDid,
                    verificationMethodId: issuerDidDoc.verificationMethod[0].id,
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
    });
});
describe('Verifiable Presentation Operataions', () => {
    describe('#generate() method to generate new presentation document', () => {
        it('should be able to generate a new presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const presentationBody = {
                verifiableCredentials: [credentialDetail],
                holderDid: holderDid,
            };
            const tempPresentationBody = Object.assign({}, presentationBody);
            tempPresentationBody.verifiableCredentials[0] = credentialDetail;
            tempPresentationBody.holderDid = holderDid;
            unsignedverifiablePresentation = yield hsSdk.vp.bjjVp.generate(tempPresentationBody);
            (0, chai_1.should)().exist(unsignedverifiablePresentation['@context']);
            (0, chai_1.should)().exist(unsignedverifiablePresentation['type']);
            (0, chai_1.expect)(unsignedverifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
            (0, chai_1.should)().exist(unsignedverifiablePresentation['verifiableCredential']);
            (0, chai_1.expect)(unsignedverifiablePresentation.verifiableCredential).to.be.a('array');
            (0, chai_1.should)().exist(unsignedverifiablePresentation['id']);
            (0, chai_1.should)().exist(unsignedverifiablePresentation['holder']);
            verifiableCredentialPresentationId = unsignedverifiablePresentation.id;
        }));
    });
    describe('#sign() method to sign presentation document', () => {
        const signPresentationBody = {
            presentation: unsignedverifiablePresentation,
            holderDid: '',
            verificationMethodId: '',
            privateKeyMultibase: '',
            challenge,
        };
        it('should be able a sign presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempSignPresentationBody = Object.assign({}, signPresentationBody);
            tempSignPresentationBody.presentation = unsignedverifiablePresentation;
            tempSignPresentationBody.holderDid = holderDid;
            tempSignPresentationBody.verificationMethodId = holderDidDoc.verificationMethod[1].id;
            tempSignPresentationBody.privateKeyMultibase = holderKp.privateKeyMultibase;
            tempSignPresentationBody.challenge = "abc";
            tempSignPresentationBody['domain'] = "http://xyz.com";
            signedVerifiablePresentation = yield hsSdk.vp.bjjVp.sign(tempSignPresentationBody);
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
            holderDid: '',
            holderVerificationMethodId: '',
            issuerVerificationMethodId: verificationMethodId,
            privateKey: privateKeyMultibase,
            challenge,
            issuerDid: didDocId,
        };
        it('should be able to verify signed presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
            tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
            tempverifyPresentationBody.issuerDid = issuerDid;
            tempverifyPresentationBody.holderDid = holderDid;
            tempverifyPresentationBody.holderVerificationMethodId = holderDidDoc.verificationMethod[1].id;
            tempverifyPresentationBody.issuerVerificationMethodId = issuerDidDoc.verificationMethod[0].id;
            tempverifyPresentationBody.challenge = "abc";
            tempverifyPresentationBody['domain'] = "http://xyz.com";
            const verifiedPresentationDetail = yield hsSdk.vp.bjjVp.verify(tempverifyPresentationBody);
            (0, chai_1.should)().exist(verifiedPresentationDetail['verified']);
            (0, chai_1.expect)(verifiedPresentationDetail.verified).to.be.equal(true);
            (0, chai_1.should)().exist(verifiedPresentationDetail['results']);
            (0, chai_1.expect)(verifiedPresentationDetail.results).to.be.a('array');
            (0, chai_1.expect)(verifiedPresentationDetail.results[1].credentialResult).to.be.a('array');
            (0, chai_1.expect)(verifiedPresentationDetail.results[1].credentialResult.length).to.be.greaterThan(0);
            (0, chai_1.expect)(verifiedPresentationDetail.results[1].credentialResult[0].verified).to.be.equal(true);
        }));
    });
});
