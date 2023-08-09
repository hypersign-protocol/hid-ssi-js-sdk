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
let didDocument;
let didDocId;
let privateKeyMultibase;
let publicKeyMultibase;
let schemaId;
let verificationMethodId;
let offlineSigner;
let hypersignDID;
let hypersignSchema;
let hypersignVC;
const challenge = '1231231231';
let signedDocument;
let schemaObject;
let signedSchema;
let credentialDetail;
let credentialId;
let credentialStatus;
let credentialsProof;
const domain = 'www.adbv.com';
const schemaBody = {
    name: 'testSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [{ name: 'name', type: 'string', isRequired: false }],
    additionalProperties: false,
};
const entityApiSecret = "69b91e007904228e3313e586ba695.bc7705956989e43bbd7060e845c2763a381cbc80f935ac848119b8c2d7d00616346eeb74efe22a0ff140506a0c6157ef6";
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
describe('Verifiable credential operation', function () {
    describe('#generate() method to generate new credential', function () {
        it('should be able to generate new credential for a schema with subject DID', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const credentialbody = {
                    schemaId,
                    subjectDid: didDocId,
                    type: [],
                    issuerDid: didDocId,
                    fields: { name: "varsha" },
                    expirationDate: '',
                };
                const expirationDate = new Date('12/11/2027');
                credentialbody['expirationDate'] = expirationDate.toString();
                credentialDetail = yield hypersignVC.generate(credentialbody);
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
        it('Should be able to issue credential without registering on chain', () => __awaiter(this, void 0, void 0, function* () {
            const credentialbody = {
                credential: credentialDetail,
                issuerDid: didDocId,
                verificationMethodId,
                privateKeyMultibase,
                registerCredential: false
            };
            const issuedCredentialResult = yield hypersignVC.issue(credentialbody);
            (0, chai_1.should)().exist(issuedCredentialResult.signedCredential);
            (0, chai_1.expect)(issuedCredentialResult.signedCredential).to.be.a('object');
            (0, chai_1.should)().exist(issuedCredentialResult.signedCredential.id);
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.id).to.be.a('string');
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.id).to.be.equal(credentialId);
            (0, chai_1.should)().exist(issuedCredentialResult.signedCredential.type);
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.type).to.be.a('array');
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.type).to.include('VerifiableCredential');
            (0, chai_1.should)().exist(issuedCredentialResult.signedCredential.expirationDate);
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.expirationDate).to.be.a('string');
            (0, chai_1.should)().exist(issuedCredentialResult.signedCredential.issuanceDate);
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.issuanceDate).to.be.a('string');
            (0, chai_1.should)().exist(issuedCredentialResult.signedCredential.credentialSubject);
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.credentialSubject).to.be.a('object');
            (0, chai_1.should)().exist(issuedCredentialResult.signedCredential.credentialSchema);
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.credentialSchema).to.be.a('object');
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.credentialSchema.id).to.be.equal(schemaId);
            (0, chai_1.should)().exist(issuedCredentialResult.signedCredential.credentialStatus);
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.credentialStatus).to.be.a('object');
            (0, chai_1.expect)(issuedCredentialResult.signedCredential.credentialStatus.id).to.be.include(credentialId);
            (0, chai_1.should)().exist(issuedCredentialResult.credentialStatus);
            (0, chai_1.expect)(issuedCredentialResult.credentialStatus).to.be.a('object');
            credentialStatus = issuedCredentialResult.credentialStatus;
            (0, chai_1.should)().exist(issuedCredentialResult.credentialStatusProof);
            (0, chai_1.expect)(issuedCredentialResult.credentialStatusProof).to.be.a('object');
            credentialsProof = issuedCredentialResult.credentialStatusProof;
        }));
    });
    describe('#registerCredentialStatus() method to register credential status on chain', () => {
        it('Should be able to register credential using entityApiSecretKey', () => __awaiter(this, void 0, void 0, function* () {
            const hypersignVC = new index_1.HypersignVerifiableCredential({
                entityApiSecretKey: entityApiSecret,
                nodeRestEndpoint: config_1.hidNodeEp.rest,
                nodeRpcEndpoint: config_1.hidNodeEp.rpc,
                namespace: config_1.hidNodeEp.namespace,
            });
            yield hypersignVC.init();
            const registerdCredStatus = yield hypersignVC.registerCredentialStatus({
                credentialStatus: credentialStatus,
                credentialStatusProof: credentialsProof
            });
            (0, chai_1.should)().exist(registerdCredStatus.transactionHash);
            (0, chai_1.expect)(registerdCredStatus.transactionHash).to.be.a('string');
        }));
    });
});
