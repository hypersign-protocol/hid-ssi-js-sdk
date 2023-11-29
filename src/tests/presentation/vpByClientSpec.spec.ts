import { expect, should } from 'chai';
import { HypersignDID, HypersignVerifiableCredential, HypersignVerifiablePresentation } from '../../index';
import { createWallet, mnemonic, hidNodeEp, generatePresentationProof, verifyPresentation, generateWeb3Obj, metamaskProvider, signDid } from '../config';
import Web3 from 'web3';
import { DidDocument } from '../../../libs/generated/ssi/did';
let holderDidDoc
let holderVmId
let hypersignDID;
let hypersignVC;
let offlineSigner;
let privateKeyMultibase;
let publicKeyMultibase;
let issuerDidDocument;
let didDocId;
let issuerVerificationMethodId;
let unsignedverifiablePresentation
let signedVerifiablePresentation
let hypersignPresentation;
let signedDocument;
let vpId;
const challenge = '1231231231';
const domain = 'www.adbv.com';
let credentialDetail;
let credentialId;
let verificationMethodId
const holderDid = "did:hid:testnet:0xec437f1b8DCe95e7094D04A38665AB6f2A1D47ec"
const credentialBody = {
    // schemaId: '',
    schemaContext: ["https://schema.org"],
    type: ["Person"],
    subjectDid: '',
    issuerDid: '',
    fields: { name: 'Varsha' },
};
let account
let mmKeyPair
let web3
beforeEach(async function () {
    offlineSigner = await createWallet(mnemonic)
    const params = {
        offlineSigner,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
    }
    const provider = new Web3.providers.HttpProvider(metamaskProvider)
    web3 = new Web3(provider)
    account = web3.eth.accounts.create()
    //  account= account.address
    hypersignDID = new HypersignDID(params);
    await hypersignDID.init();


    hypersignVC = new HypersignVerifiableCredential(params);
    await hypersignVC.init();
    hypersignPresentation = new HypersignVerifiablePresentation(params);
});

// Generate public and private key pair
describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', async function () {
        const kp = await hypersignDID.generateKeys();
        privateKeyMultibase = kp.privateKeyMultibase;
        publicKeyMultibase = kp.publicKeyMultibase;
        expect(kp).to.be.a('object');
        should().exist(kp.privateKeyMultibase);
        should().exist(kp.publicKeyMultibase);
    });
});

describe('DID Opearations', () => {
    describe('#generate() to generate did', function () {
        it('should be able to generate didDocument', async function () {
            issuerDidDocument = await hypersignDID.generate({ publicKeyMultibase });
            didDocId = issuerDidDocument['id'];
            issuerVerificationMethodId = issuerDidDocument['verificationMethod'][0].id;
            expect(issuerDidDocument).to.be.a('object');
            should().exist(issuerDidDocument['@context']);
            should().exist(issuerDidDocument['id']);
            should().exist(issuerDidDocument['controller']);
            should().exist(issuerDidDocument['alsoKnownAs']);

            should().exist(issuerDidDocument['verificationMethod']);
            expect(
                issuerDidDocument['verificationMethod'] &&
                issuerDidDocument['authentication'] &&
                issuerDidDocument['assertionMethod'] &&
                issuerDidDocument['keyAgreement'] &&
                issuerDidDocument['capabilityInvocation'] &&
                issuerDidDocument['capabilityDelegation'] &&
                issuerDidDocument['service']
            ).to.be.a('array');
            should().exist(issuerDidDocument['authentication']);
            should().exist(issuerDidDocument['assertionMethod']);
            should().exist(issuerDidDocument['keyAgreement']);
            should().exist(issuerDidDocument['capabilityInvocation']);
            should().exist(issuerDidDocument['capabilityDelegation']);
            should().exist(issuerDidDocument['service']);
        });
        it('should be able to generated did for holder using metamask', async function () {
            holderDidDoc = await hypersignDID.createByClientSpec({ methodSpecificId: account.address, address: account.address, chainId: '0x1', clientSpec: 'eth-personalSign' });
            holderVmId = holderDidDoc.verificationMethod[0].id
        })
    });
})
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
    it('should be able to register didDocument for issuer on the blockchain', async function () {
        const result = await hypersignDID.register({ didDocument: issuerDidDocument, privateKeyMultibase, verificationMethodId: issuerVerificationMethodId });
        should().exist(result.transactionHash);
        should().exist(result.didDocument);
    });
    it('should be able to register didDocument for holder on the blockchain', async function () {

        const address = account.address

        const signature = web3.eth.accounts.sign(holderDidDoc, account.privateKey)
        const created = new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z'
        const signInfo = [{
            verification_method_id: holderVmId,
            signature: signature.signature,
            created,
            clientSpec: { type: 'eth-personalSign' }
        }]
        const result = await hypersignDID.registerByClientSpec({ didDocument: holderDidDoc, signInfos: signInfo });
        should().exist(result.transactionHash);
        should().exist(result.didDocument);
        // const sign = await signDid(holderDidDoc, "eth-personalSign", holderVmId, account)
        // console.log(sign)
    });

});
// return
// /**
//  * Test cases related to credential
//  */
describe('Verifiable Credential Opearations', () => {
    describe('#getCredential() method to generate a credential', function () {
        it('should be able to generate new credential using schemacontext', async function () {
            const expirationDate = new Date('12/11/2027');
            const tempCredentialBody = { ...credentialBody };
            // tempCredentialBody.schemaId = schemaId;
            tempCredentialBody.subjectDid = holderDid;
            tempCredentialBody['expirationDate'] = expirationDate;
            tempCredentialBody.issuerDid = didDocId;
            tempCredentialBody.fields = { name: 'varsha' };

            credentialDetail = await hypersignVC.generate(tempCredentialBody);
            // console.log(JSON.stringify(credentialDetail, null, 2));

            expect(credentialDetail).to.be.a('object');
            should().exist(credentialDetail['@context']);
            should().exist(credentialDetail['id']);
            credentialId = credentialDetail.id;
            should().exist(credentialDetail['type']);
            should().exist(credentialDetail['expirationDate']);
            should().exist(credentialDetail['issuanceDate']);
            should().exist(credentialDetail['issuer']);
            should().exist(credentialDetail['credentialSubject']);
            // should().exist(credentialDetail['credentialSchema']);
            should().exist(credentialDetail['credentialStatus']);
            expect(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
        });
    });
    describe('#issueCredential() method for issuing credential', function () {
        it('should be able to issue credential with credential status registered on chain', async function () {
            const issuedCredResult = await hypersignVC.issue({
                credential: credentialDetail,
                issuerDid: didDocId,
                verificationMethodId: `${didDocId}#key-1`,
                privateKeyMultibase: privateKeyMultibase
            });
            const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } =
                issuedCredResult;
            expect(signedCredential).to.be.a('object');
            should().exist(signedCredential['@context']);
            should().exist(signedCredential['id']);
            should().exist(signedCredential['type']);
            should().exist(signedCredential['expirationDate']);
            should().exist(signedCredential['issuanceDate']);
            should().exist(signedCredential['issuer']);
            should().exist(signedCredential['credentialSubject']);
            // should().exist(signedCredential['credentialSchema']);
            should().exist(signedCredential['credentialStatus']);
            should().exist(signedCredential['proof']);
            expect(credentialStatus).to.be.a('object');
            should().exist(credentialStatus['issuer']);
            should().exist(credentialStatus['issuanceDate']);
            should().exist(credentialStatus['revoked']);
            should().exist(credentialStatus['suspended']);
            should().exist(credentialStatus['remarks']);
            should().exist(credentialStatus['credentialMerkleRootHash']);
            expect(credentialStatusProof).to.be.a('object');
            should().exist(credentialStatusProof['type']);
            should().exist(credentialStatusProof['created']);
            should().exist(credentialStatusProof['verificationMethod']);
            should().exist(credentialStatusProof['proofPurpose']);
            should().exist(credentialStatusProof['proofValue']);

            expect(credentialStatusRegistrationResult).to.be.a('object');
            should().exist(credentialStatusRegistrationResult['code']);
            should().exist(credentialStatusRegistrationResult['height']);
            should().exist(credentialStatusRegistrationResult['transactionHash']);
            should().exist(credentialStatusRegistrationResult['gasUsed']);
            should().exist(credentialStatusRegistrationResult['gasWanted']);
        });
    });
});


// // /**
// //  * Test cases related to verifiable presentation
// //  */

describe('Verifiable Presentation Operataions', () => {
    describe('#generate() method to generate new presentation document', () => {
        it('should be able to gnerate a new presentation document', async () => {
            const presentationBody = {
                verifiableCredentials: [credentialDetail],
                holderDid: holderDid,
            };
            const tempPresentationBody = { ...presentationBody };
            tempPresentationBody.verifiableCredentials[0] = credentialDetail;
            tempPresentationBody.holderDid = holderDid;
            unsignedverifiablePresentation = await hypersignPresentation.generate(tempPresentationBody);
            should().exist(unsignedverifiablePresentation['@context']);
            should().exist(unsignedverifiablePresentation['type']);
            expect(unsignedverifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
            should().exist(unsignedverifiablePresentation['verifiableCredential']);
            expect(unsignedverifiablePresentation.verifiableCredential).to.be.a('array');
            should().exist(unsignedverifiablePresentation['id']);
            should().exist(unsignedverifiablePresentation['holder']);
            vpId = unsignedverifiablePresentation.id;
        });
    });
    describe('#signByClientSpec() method to sign presentation document', () => {
        const signPresentationBody = {
            presentation: unsignedverifiablePresentation,
            holderDid: "",
            verificationMethodId: "",
            web3Obj: {},
            challenge,
        };
        const web3 = new Web3()
        it('should not be able to sign presentation as  holderDid is required but not passed', async function () {
            const tempSignPresentationBody = { ...signPresentationBody };
            tempSignPresentationBody.holderDid = '';
            tempSignPresentationBody.presentation = unsignedverifiablePresentation;
            tempSignPresentationBody.verificationMethodId = `${holderDid}#key-1`;
            tempSignPresentationBody.web3Obj = web3
            return hypersignPresentation.signByClientSpec(tempSignPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.holderDid is required to sign a presentation');
            });
        });
        it('should not be able to sign presentation as presentation is not passed', async function () {
            const tempSignPresentationBody = { ...signPresentationBody };
            tempSignPresentationBody.presentation = null;
            tempSignPresentationBody.challenge = challenge
            tempSignPresentationBody.holderDid = holderDid

            return hypersignPresentation.signByClientSpec(tempSignPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.presentation is required for signinng a presentation');
            });
        });
        it('should not be able to sign presentation as challenge is not passed', async function () {
            const tempSignPresentationBody = { ...signPresentationBody };
            tempSignPresentationBody.presentation = unsignedverifiablePresentation;
            tempSignPresentationBody.holderDid = holderDid
            tempSignPresentationBody.challenge = '';
            return hypersignPresentation.signByClientSpec(tempSignPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for signinng a presentation');
            });
        });
        it('should not be able to sign presentation as verificationMethodId is not passed', async function () {
            const tempSignPresentationBody = { ...signPresentationBody };
            tempSignPresentationBody.holderDid = holderDid
            tempSignPresentationBody.presentation = unsignedverifiablePresentation;
            tempSignPresentationBody.challenge = challenge;
            tempSignPresentationBody.verificationMethodId = '';
            return hypersignPresentation.signByClientSpec(tempSignPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.verificationMethodId is required for signinng a presentation');
            });
        });
        it('should not be able to sign presentation as web3 object is not passed', async function () {
            const tempSignPresentationBody = { ...signPresentationBody };
            tempSignPresentationBody.holderDid = holderDid
            tempSignPresentationBody.presentation = unsignedverifiablePresentation;
            tempSignPresentationBody.challenge = challenge;
            tempSignPresentationBody.verificationMethodId = issuerVerificationMethodId;
            return hypersignPresentation.signByClientSpec(tempSignPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.web3Obj is required to sign a presentation');
            });
        });
    });


    describe('#verify() method to verify a signed presentation document', () => {
        const verifyPresentationBody = {
            signedPresentation: signedVerifiablePresentation,
            challenge,
            issuerDid: "",
            holderDid: "",
            holderDidDocSigned: DidDocument,
            holderVerificationMethodId: "",
            issuerVerificationMethodId: verificationMethodId,
            web3Obj: {}
        };

        it('should not be able to verify presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
            tempverifyPresentationBody.holderDid = holderDid;
            tempverifyPresentationBody.holderVerificationMethodId = `${holderDid}#key-1`;
            tempverifyPresentationBody.issuerVerificationMethodId = verificationMethodId;
            tempverifyPresentationBody['holderDidDocSigned'] = DidDocument;
            return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
            });
        });
        it('should not be able to verify presentation as issuerDid is null or empty', async function () {
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.issuerDid = '';
            return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
            });
        });

        it('should not be able to verify presentation as challenge is null or empty', async function () {
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.issuerDid = issuerDidDocument.id;
            tempverifyPresentationBody.challenge = '';

            return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for verifying a presentation');
            });
        });

        it('should not be able to verify presentation as holderVerificationMethodId is null or empty', async function () {
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.issuerDid = didDocId;
            tempverifyPresentationBody.challenge = challenge;
            tempverifyPresentationBody.holderVerificationMethodId = '';

            return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.holderVerificationMethodId is required for verifying a presentation');
            });
        });

        it('should not be able to verify presentation as issuerVerificationMethodId is null or empty', async function () {
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.issuerDid = didDocId;
            tempverifyPresentationBody.challenge = challenge;
            tempverifyPresentationBody.holderVerificationMethodId = `${holderDid}#key-1`;
            tempverifyPresentationBody.issuerVerificationMethodId = '';

            return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
            });
        });
        it('should not be able to verify presentation as web3Obj is null or empty', async function () {
            const web3 = new Web3()
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.issuerDid = didDocId;
            tempverifyPresentationBody.challenge = challenge;
            tempverifyPresentationBody.holderVerificationMethodId = `${holderDid}#key-1`;
            tempverifyPresentationBody.issuerVerificationMethodId = issuerVerificationMethodId;
            tempverifyPresentationBody.web3Obj = {}
            return hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.web3Obj is required to verify a presentation');
            });
        });

        it('should be able a verify signed presentation document', async () => {
            signedVerifiablePresentation = await generatePresentationProof(unsignedverifiablePresentation, challenge, holderDid, [`${holderDid}#key-1`], `${holderDid}#key-1`)
            // const verificationResult = await verifyPresentation(signedVerifiablePresentation, challenge, holderDid)
            // console.log(verificationResult)
            const web3 = await generateWeb3Obj()
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.signedPresentation = signedVerifiablePresentation;
            tempverifyPresentationBody.issuerDid = issuerDidDocument.id;
            tempverifyPresentationBody.holderDid = holderDid;
            tempverifyPresentationBody.holderVerificationMethodId = `${holderDid}#key-1`;
            tempverifyPresentationBody.issuerVerificationMethodId = issuerVerificationMethodId;
            tempverifyPresentationBody.challenge = challenge;
            tempverifyPresentationBody.web3Obj = web3;
            const verifiedPresentationDetail = await hypersignPresentation.verifyByClientSpec(tempverifyPresentationBody);
            should().exist(verifiedPresentationDetail.verified);
            expect(verifiedPresentationDetail.verified).to.be.equal(true);
            expect(verifiedPresentationDetail).to.be.a('object');
            should().exist(verifiedPresentationDetail.results);
            expect(verifiedPresentationDetail.results).to.be.a('array');
            should().exist(verifiedPresentationDetail.credentialResults);
            expect(verifiedPresentationDetail.credentialResults).to.be.a('array');
            expect(verifiedPresentationDetail.credentialResults[0].verified).to.be.equal(true);
            expect(verifiedPresentationDetail.credentialResults[0].credentialId).to.be.equal(credentialId);
        });
    });
});

