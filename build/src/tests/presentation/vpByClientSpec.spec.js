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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../../index");
const config_1 = require("../config");
const web3_1 = __importDefault(require("web3"));
const did_1 = require("../../../libs/generated/ssi/did");
let holderDidDoc;
let holderVmId;
let hypersignDID;
let hypersignVC;
let offlineSigner;
let privateKeyMultibase;
let publicKeyMultibase;
let issuerDidDocument;
let didDocId;
let issuerVerificationMethodId;
let unsignedverifiablePresentation;
let signedVerifiablePresentation;
let hypersignPresentation;
let signedDocument;
let vpId;
const challenge = '1231231231';
const domain = 'www.adbv.com';
let credentialDetail;
let credentialId;
let verificationMethodId;
const holderDid = "did:hid:testnet:0xec437f1b8DCe95e7094D04A38665AB6f2A1D47ec";
const credentialBody = {
    // schemaId: '',
    schemaContext: ["https://schema.org"],
    type: ["Person"],
    subjectDid: '',
    issuerDid: '',
    fields: { name: 'Varsha' },
};
let account;
let mmKeyPair;
let web3;
beforeEach(function () {
    return __awaiter(this, void 0, void 0, function* () {
        offlineSigner = yield (0, config_1.createWallet)(config_1.mnemonic);
        const params = {
            offlineSigner,
            nodeRestEndpoint: config_1.hidNodeEp.rest,
            nodeRpcEndpoint: config_1.hidNodeEp.rpc,
            namespace: config_1.hidNodeEp.namespace,
        };
        const provider = new web3_1.default.providers.HttpProvider(config_1.metamaskProvider);
        web3 = new web3_1.default(provider);
        account = web3.eth.accounts.create();
        //  account= account.address
        hypersignDID = new index_1.HypersignDID(params);
        yield hypersignDID.init();
        hypersignVC = new index_1.HypersignVerifiableCredential(params);
        yield hypersignVC.init();
        hypersignPresentation = new index_1.HypersignVerifiablePresentation(params);
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
describe('DID Opearations', () => {
    describe('#generate() to generate did', function () {
        it('should be able to generate didDocument', function () {
            return __awaiter(this, void 0, void 0, function* () {
                issuerDidDocument = yield hypersignDID.generate({ publicKeyMultibase });
                didDocId = issuerDidDocument['id'];
                issuerVerificationMethodId = issuerDidDocument['verificationMethod'][0].id;
                (0, chai_1.expect)(issuerDidDocument).to.be.a('object');
                (0, chai_1.should)().exist(issuerDidDocument['@context']);
                (0, chai_1.should)().exist(issuerDidDocument['id']);
                (0, chai_1.should)().exist(issuerDidDocument['controller']);
                (0, chai_1.should)().exist(issuerDidDocument['alsoKnownAs']);
                (0, chai_1.should)().exist(issuerDidDocument['verificationMethod']);
                (0, chai_1.expect)(issuerDidDocument['verificationMethod'] &&
                    issuerDidDocument['authentication'] &&
                    issuerDidDocument['assertionMethod'] &&
                    issuerDidDocument['keyAgreement'] &&
                    issuerDidDocument['capabilityInvocation'] &&
                    issuerDidDocument['capabilityDelegation'] &&
                    issuerDidDocument['service']).to.be.a('array');
                (0, chai_1.should)().exist(issuerDidDocument['authentication']);
                (0, chai_1.should)().exist(issuerDidDocument['assertionMethod']);
                (0, chai_1.should)().exist(issuerDidDocument['keyAgreement']);
                (0, chai_1.should)().exist(issuerDidDocument['capabilityInvocation']);
                (0, chai_1.should)().exist(issuerDidDocument['capabilityDelegation']);
                (0, chai_1.should)().exist(issuerDidDocument['service']);
            });
        });
        it('should be able to generated did for holder using metamask', function () {
            return __awaiter(this, void 0, void 0, function* () {
                holderDidDoc = yield hypersignDID.createByClientSpec({ methodSpecificId: account.address, address: account.address, chainId: '0x1', clientSpec: 'eth-personalSign' });
                holderVmId = holderDidDoc.verificationMethod[0].id;
            });
        });
    });
});
// describe('#sign() this is to sign didDoc', function () {
//     const controller = {
//         '@context': '',
//         id: '',
//         authentication: [],
//     };
//     it('should able to sign did document', async function () {
//         const didDoc = JSON.parse(JSON.stringify(issuerDidDocument));
//         const params = {
//             privateKeyMultibase: privateKeyMultibase as string,
//             challenge: challenge as string,
//             domain: domain as string,
//             did: '',
//             didDocument: didDoc as object,
//             verificationMethodId: issuerVerificationMethodId as string,
//             controller,
//         };
//         signedDocument = await hypersignDID.sign(params);
//         expect(signedDocument).to.be.a('object');
//         should().exist(signedDocument['@context']);
//         should().exist(signedDocument['id']);
//         expect(didDocId).to.be.equal(signedDocument['id']);
//         should().exist(signedDocument['controller']);
//         should().exist(signedDocument['alsoKnownAs']);
//         should().exist(signedDocument['verificationMethod']);
//         should().exist(signedDocument['authentication']);
//         should().exist(signedDocument['assertionMethod']);
//         should().exist(signedDocument['keyAgreement']);
//         should().exist(signedDocument['capabilityInvocation']);
//         should().exist(signedDocument['capabilityDelegation']);
//         should().exist(signedDocument['service']);
//         should().exist(signedDocument['proof']);
//     });
// });
describe('#register() this is to register did on the blockchain', function () {
    it('should be able to register didDocument for issuer on the blockchain', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield hypersignDID.register({ didDocument: issuerDidDocument, privateKeyMultibase, verificationMethodId: issuerVerificationMethodId });
            (0, chai_1.should)().exist(result.transactionHash);
            (0, chai_1.should)().exist(result.didDocument);
        });
    });
    it('should be able to register didDocument for holder on the blockchain', function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(account.address);
            const address = account.address;
            const signature = web3.eth.accounts.sign(holderDidDoc, account.privateKey);
            console.log(signature);
            const created = new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
            const signInfo = [{
                    verification_method_id: holderVmId,
                    signature: signature.signature,
                    created,
                    clientSpec: { type: 'eth-personalSign' }
                }];
            const result = yield hypersignDID.registerByClientSpec({ didDocument: holderDidDoc, signInfos: signInfo });
            console.log(result);
            (0, chai_1.should)().exist(result.transactionHash);
            (0, chai_1.should)().exist(result.didDocument);
            // const sign = await signDid(holderDidDoc, "eth-personalSign", holderVmId, account)
            // console.log(sign)
        });
    });
});
// return
// /**
//  * Test cases related to credential
//  */
describe('Verifiable Credential Opearations', () => {
    describe('#getCredential() method to generate a credential', function () {
        it('should be able to generate new credential using schemacontext', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expirationDate = new Date('12/11/2027');
                const tempCredentialBody = Object.assign({}, credentialBody);
                // tempCredentialBody.schemaId = schemaId;
                tempCredentialBody.subjectDid = holderDid;
                tempCredentialBody['expirationDate'] = expirationDate;
                tempCredentialBody.issuerDid = didDocId;
                tempCredentialBody.fields = { name: 'varsha' };
                credentialDetail = yield hypersignVC.generate(tempCredentialBody);
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
                // should().exist(credentialDetail['credentialSchema']);
                (0, chai_1.should)().exist(credentialDetail['credentialStatus']);
                (0, chai_1.expect)(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
            });
        });
    });
    describe('#issueCredential() method for issuing credential', function () {
        it('should be able to issue credential with credential status registered on chain', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const issuedCredResult = yield hypersignVC.issue({
                    credential: credentialDetail,
                    issuerDid: didDocId,
                    verificationMethodId: `${didDocId}#key-1`,
                    privateKeyMultibase: privateKeyMultibase
                });
                const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = issuedCredResult;
                (0, chai_1.expect)(signedCredential).to.be.a('object');
                (0, chai_1.should)().exist(signedCredential['@context']);
                (0, chai_1.should)().exist(signedCredential['id']);
                (0, chai_1.should)().exist(signedCredential['type']);
                (0, chai_1.should)().exist(signedCredential['expirationDate']);
                (0, chai_1.should)().exist(signedCredential['issuanceDate']);
                (0, chai_1.should)().exist(signedCredential['issuer']);
                (0, chai_1.should)().exist(signedCredential['credentialSubject']);
                // should().exist(signedCredential['credentialSchema']);
                (0, chai_1.should)().exist(signedCredential['credentialStatus']);
                (0, chai_1.should)().exist(signedCredential['proof']);
                (0, chai_1.expect)(credentialStatus).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatus['issuer']);
                (0, chai_1.should)().exist(credentialStatus['issuanceDate']);
                (0, chai_1.should)().exist(credentialStatus['revoked']);
                (0, chai_1.should)().exist(credentialStatus['suspended']);
                (0, chai_1.should)().exist(credentialStatus['remarks']);
                (0, chai_1.should)().exist(credentialStatus['credentialMerkleRootHash']);
                (0, chai_1.expect)(credentialStatusProof).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatusProof['type']);
                (0, chai_1.should)().exist(credentialStatusProof['created']);
                (0, chai_1.should)().exist(credentialStatusProof['verificationMethod']);
                (0, chai_1.should)().exist(credentialStatusProof['proofPurpose']);
                (0, chai_1.should)().exist(credentialStatusProof['proofValue']);
                (0, chai_1.expect)(credentialStatusRegistrationResult).to.be.a('object');
                (0, chai_1.should)().exist(credentialStatusRegistrationResult['code']);
                (0, chai_1.should)().exist(credentialStatusRegistrationResult['height']);
                (0, chai_1.should)().exist(credentialStatusRegistrationResult['transactionHash']);
                (0, chai_1.should)().exist(credentialStatusRegistrationResult['gasUsed']);
                (0, chai_1.should)().exist(credentialStatusRegistrationResult['gasWanted']);
            });
        });
    });
});
// // /**
// //  * Test cases related to verifiable presentation
// //  */
describe('Verifiable Presentation Operataions', () => {
    describe('#generate() method to generate new presentation document', () => {
        it('should be able to gnerate a new presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            const presentationBody = {
                verifiableCredentials: [credentialDetail],
                holderDid: holderDid,
            };
            const tempPresentationBody = Object.assign({}, presentationBody);
            tempPresentationBody.verifiableCredentials[0] = credentialDetail;
            tempPresentationBody.holderDid = holderDid;
            unsignedverifiablePresentation = yield hypersignPresentation.generate(tempPresentationBody);
            (0, chai_1.should)().exist(unsignedverifiablePresentation['@context']);
            (0, chai_1.should)().exist(unsignedverifiablePresentation['type']);
            (0, chai_1.expect)(unsignedverifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
            (0, chai_1.should)().exist(unsignedverifiablePresentation['verifiableCredential']);
            (0, chai_1.expect)(unsignedverifiablePresentation.verifiableCredential).to.be.a('array');
            (0, chai_1.should)().exist(unsignedverifiablePresentation['id']);
            (0, chai_1.should)().exist(unsignedverifiablePresentation['holder']);
            vpId = unsignedverifiablePresentation.id;
        }));
    });
    describe('#signByClientSpec() method to sign presentation document', () => {
        const signPresentationBody = {
            presentation: unsignedverifiablePresentation,
            holderDid: "",
            verificationMethodId: "",
            web3Obj: {},
            challenge,
        };
        const web3 = new web3_1.default();
        it('should not be able to sign presentation as  holderDid is required but not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSignPresentationBody = Object.assign({}, signPresentationBody);
                tempSignPresentationBody.holderDid = '';
                tempSignPresentationBody.presentation = unsignedverifiablePresentation;
                tempSignPresentationBody.verificationMethodId = `${holderDid}#key-1`;
                tempSignPresentationBody.web3Obj = web3;
                return hypersignPresentation.signByClientSpec(tempSignPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.holderDid is required to sign a presentation');
                });
            });
        });
        it('should not be able to sign presentation as presentation is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSignPresentationBody = Object.assign({}, signPresentationBody);
                tempSignPresentationBody.presentation = null;
                tempSignPresentationBody.challenge = challenge;
                tempSignPresentationBody.holderDid = holderDid;
                return hypersignPresentation.signByClientSpec(tempSignPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.presentation is required for signinng a presentation');
                });
            });
        });
        it('should not be able to sign presentation as challenge is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSignPresentationBody = Object.assign({}, signPresentationBody);
                tempSignPresentationBody.presentation = unsignedverifiablePresentation;
                tempSignPresentationBody.holderDid = holderDid;
                tempSignPresentationBody.challenge = '';
                return hypersignPresentation.signByClientSpec(tempSignPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for signinng a presentation');
                });
            });
        });
        it('should not be able to sign presentation as verificationMethodId is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSignPresentationBody = Object.assign({}, signPresentationBody);
                tempSignPresentationBody.holderDid = holderDid;
                tempSignPresentationBody.presentation = unsignedverifiablePresentation;
                tempSignPresentationBody.challenge = challenge;
                tempSignPresentationBody.verificationMethodId = '';
                return hypersignPresentation.signByClientSpec(tempSignPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.verificationMethodId is required for signinng a presentation');
                });
            });
        });
        it('should not be able to sign presentation as web3 object is not passed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempSignPresentationBody = Object.assign({}, signPresentationBody);
                tempSignPresentationBody.holderDid = holderDid;
                tempSignPresentationBody.presentation = unsignedverifiablePresentation;
                tempSignPresentationBody.challenge = challenge;
                tempSignPresentationBody.verificationMethodId = issuerVerificationMethodId;
                return hypersignPresentation.signByClientSpec(tempSignPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.web3Obj is required to sign a presentation');
                });
            });
        });
    });
    describe('#verify() method to verify a signed presentation document', () => {
        const verifyPresentationBody = {
            signedPresentation: signedVerifiablePresentation,
            challenge,
            issuerDid: "",
            holderDid: "",
            holderDidDocSigned: did_1.DidDocument,
            holderVerificationMethodId: "",
            issuerVerificationMethodId: verificationMethodId,
            web3Obj: {}
        };
        it('should not be able to verify presentation as either holderDid or holderDidDocSigned is required but passed both', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
                tempverifyPresentationBody.holderDid = holderDid;
                tempverifyPresentationBody.holderVerificationMethodId = `${holderDid}#key-1`;
                tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
                tempverifyPresentationBody['holderDidDocSigned'] = did_1.DidDocument;
                return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
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
                return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
                });
            });
        });
        it('should not be able to verify presentation as challenge is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = issuerDidDocument.id;
                tempverifyPresentationBody.challenge = '';
                return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
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
                return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
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
                tempverifyPresentationBody.holderVerificationMethodId = `${holderDid}#key-1`;
                tempverifyPresentationBody.issuerVerificationMethodId = '';
                return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
                });
            });
        });
        it('should not be able to verify presentation as web3Obj is null or empty', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const web3 = new web3_1.default();
                const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
                tempverifyPresentationBody.issuerDid = didDocId;
                tempverifyPresentationBody.challenge = challenge;
                tempverifyPresentationBody.holderVerificationMethodId = `${holderDid}#key-1`;
                tempverifyPresentationBody.issuerVerificationMethodId = issuerVerificationMethodId;
                tempverifyPresentationBody.web3Obj = {};
                return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
                    (0, chai_1.expect)(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.web3Obj is required to verify a presentation');
                });
            });
        });
        it('should be able a verify signed presentation document', () => __awaiter(void 0, void 0, void 0, function* () {
            signedVerifiablePresentation = yield (0, config_1.generatePresentationProof)(unsignedverifiablePresentation, challenge, holderDid, [`${holderDid}#key-1`], `${holderDid}#key-1`);
            // const verificationResult = await verifyPresentation(signedVerifiablePresentation, challenge, holderDid)
            // console.log(verificationResult)
            const web3 = yield (0, config_1.generateWeb3Obj)();
            const tempverifyPresentationBody = Object.assign({}, verifyPresentationBody);
            tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
            tempverifyPresentationBody.issuerDid = issuerDidDocument.id;
            tempverifyPresentationBody.holderDid = holderDid;
            tempverifyPresentationBody.holderVerificationMethodId = `${holderDid}#key-1`;
            tempverifyPresentationBody.issuerVerificationMethodId = issuerVerificationMethodId;
            tempverifyPresentationBody.challenge = challenge;
            tempverifyPresentationBody.web3Obj = web3;
            const verifiedPresentationDetail = yield hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody);
            console.log(JSON.stringify(verifiedPresentationDetail, null, 2));
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
