
import { HypersignSSISdk } from '../../../index';
import { expect, should } from 'chai';
import { createWallet, mnemonic, hidNodeEp } from '../../config'
import { BabyJubJubKeys2021 } from '@hypersign-protocol/babyjubjub2021';
import exp from 'constants';
let issuerPrivateKeyMultibase;
let issuerPublicKeyMultibase;
let holderPrivateKeyMultibase;
let holderPublicKeyMultibase;
let offlineSigner
let hsSdk
let credentialStatusId
let credenStatus
let verificationMethod;
let schemaObject;
let signedSchema;
let schemaId;
let subjectDid;
let issuerDid;
let issuerDidDoc
let subjectDidDoc
let credentialDetail
let credentialId
let signedVC
let unsignedSdVerifiablePresentation
let unsignedVerifiablePresentation

let signedVp;
let signedSdVp
let selectiveDisclosure
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
    fields: [{ name: 'name', type: 'string', isRequired: false }, { name: "address", type: "string", isRequired: true }],
    additionalProperties: false,
};
const credentialBody = {
    schemaId: '',
    subjectDid: '',
    type: [],
    issuerDid: '',
    fields: { name: 'Varsha', address: "Random address" },
    expirationDate: '',
};
beforeEach(async function () {
    offlineSigner = await createWallet(mnemonic);
    const params = {
        offlineSigner,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
    };
    hsSdk = new HypersignSSISdk(params);
    await hsSdk.init();
});

describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
    it('should return publickeyMultibase and privateKeyMultibase', async function () {
        const kp = await hsSdk.did.bjjDID.generateKeys();
        issuerPrivateKeyMultibase = kp.privateKeyMultibase;
        issuerPublicKeyMultibase = kp.publicKeyMultibase;
        expect(kp).to.be.a('object');
        should().exist(kp.privateKeyMultibase);
        should().exist(kp.publicKeyMultibase);
        should().not.exist(kp.id);
    });
});
/**
 * DID creation and registration
 */
describe('DID Operation', () => {
    describe('#generate() method to generate new did', function () {
        it('should be able to generate a issuer did using babyJubJub', async () => {
            issuerDidDoc = await hsSdk.did.bjjDID.generate({
                publicKeyMultibase: issuerPublicKeyMultibase
            })
            issuerDid = issuerDidDoc.id
            verificationMethod = issuerDidDoc.verificationMethod
            expect(issuerDidDoc).to.be.a('object');
            should().exist(issuerDidDoc['@context']);
            should().exist(issuerDidDoc['id']);
            should().exist(issuerDidDoc['controller']);
            should().exist(issuerDidDoc['verificationMethod']);
            expect(
                issuerDidDoc['verificationMethod'] &&
                issuerDidDoc['authentication'] &&
                issuerDidDoc['assertionMethod'] &&
                issuerDidDoc['keyAgreement'] &&
                issuerDidDoc['capabilityInvocation'] &&
                issuerDidDoc['capabilityDelegation'] &&
                issuerDidDoc['service']
            ).to.be.a('array');
            expect(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021')
            should().exist(issuerDidDoc['authentication']);
            should().exist(issuerDidDoc['assertionMethod']);
            should().exist(issuerDidDoc['keyAgreement']);
            should().exist(issuerDidDoc['capabilityInvocation']);
            should().exist(issuerDidDoc['capabilityDelegation']);
            should().exist(issuerDidDoc['service']);
            expect(issuerDidDoc['authentication'].length).to.be.greaterThan(0)
            expect(issuerDidDoc['assertionMethod'].length).to.be.greaterThan(0)
            expect(issuerDidDoc['capabilityInvocation'].length).to.be.equal(0)
            expect(issuerDidDoc['capabilityDelegation'].length).to.be.equal(0)
            expect(issuerDidDoc['keyAgreement'].length).to.be.equal(0)
            expect(issuerDidDoc['service'].length).to.be.equal(0)

        })
        it('should be able to genrate a did for holder', async () => {
            const kp = await hsSdk.did.bjjDID.generateKeys();
            holderPrivateKeyMultibase = kp.privateKeyMultibase
            holderPublicKeyMultibase = kp.publicKeyMultibase
            subjectDidDoc = await hsSdk.did.bjjDID.generate({
                publicKeyMultibase: holderPublicKeyMultibase
            })
            subjectDid = subjectDidDoc.id
        })
    })
    describe('#register() method to register did', function () {
        it('should be able to register did generated using BabyJubJubKey', async () => {
            const registerDid = await hsSdk.did.bjjDID.register({
                didDocument: issuerDidDoc,
                privateKeyMultibase: issuerPrivateKeyMultibase,
                verificationMethodId: verificationMethod[0].id
            })
            issuerDidDoc = registerDid.didDocument
            expect(issuerDidDoc).to.be.a('object');
            should().exist(issuerDidDoc['@context']);
            should().exist(issuerDidDoc['id']);
            should().exist(issuerDidDoc['controller']);
            should().exist(issuerDidDoc['verificationMethod']);
            expect(
                issuerDidDoc['verificationMethod'] &&
                issuerDidDoc['authentication'] &&
                issuerDidDoc['assertionMethod'] &&
                issuerDidDoc['keyAgreement'] &&
                issuerDidDoc['capabilityInvocation'] &&
                issuerDidDoc['capabilityDelegation'] &&
                issuerDidDoc['service']
            ).to.be.a('array');
            expect(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021')
            should().exist(issuerDidDoc['authentication']);
            should().exist(issuerDidDoc['assertionMethod']);
            should().exist(issuerDidDoc['keyAgreement']);
            should().exist(issuerDidDoc['capabilityInvocation']);
            should().exist(issuerDidDoc['capabilityDelegation']);
            should().exist(issuerDidDoc['service']);
            expect(issuerDidDoc['authentication'].length).to.be.greaterThan(0)
            expect(issuerDidDoc['assertionMethod'].length).to.be.greaterThan(0)
            expect(issuerDidDoc['capabilityInvocation'].length).to.be.equal(0)
            expect(issuerDidDoc['capabilityDelegation'].length).to.be.equal(0)
            expect(issuerDidDoc['keyAgreement'].length).to.be.equal(0)
            expect(issuerDidDoc['service'].length).to.be.equal(0)
            should().exist(registerDid.transactionHash);
        })
        it('should be able to register did for holder', async () => {
            const registerDid = await hsSdk.did.bjjDID.register({
                didDocument: subjectDidDoc,
                privateKeyMultibase: holderPrivateKeyMultibase,
                verificationMethodId: subjectDidDoc.verificationMethod[0].id
            })
            subjectDidDoc = registerDid.didDocument
        })
    })
})
// /**
//  * Schema Creation and Registration
//  */
describe('Schema Operations', () => {
    describe('#generate() method to create schema', function () {
        it('should be able to generate new schema', async function () {
            const tempSchemaBody = { ...schemaBody }
            tempSchemaBody.author = issuerDid
            schemaObject = await hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody)
            schemaId = schemaObject['id']
            expect(schemaObject).to.be.a('object')
            should().exist(schemaObject['type']);
            should().exist(schemaObject['modelVersion']);
            should().exist(schemaObject['id']);
            should().exist(schemaObject['name']);
            should().exist(schemaObject['author']);
            should().exist(schemaObject['authored']);
            should().exist(schemaObject['schema']);
            expect(schemaObject.schema).to.be.a('object');
            expect(schemaObject['name']).to.be.equal(tempSchemaBody.name);
            expect(schemaObject['author']).to.be.equal(tempSchemaBody.author);
            expect(schemaObject['schema'].required).to.be.a('array')
        })
    })

    describe('#sign() method to sign a schema', function () {
        it('should be able to sign newly created schema', async () => {
            signedSchema = await await hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase: issuerPrivateKeyMultibase,
                schema: schemaObject,
                verificationMethodId: issuerDidDoc['assertionMethod'][0]
            })
            expect(signedSchema).to.be.a('object');
            should().exist(signedSchema.type);
            should().exist(signedSchema.modelVersion);
            should().exist(signedSchema['id']);
            should().exist(signedSchema['name']);
            should().exist(signedSchema['author']);
            should().exist(signedSchema['authored']);
            should().exist(signedSchema['schema']);
            should().exist(signedSchema.schema.schema);
            should().exist(signedSchema.schema.description);
            should().exist(signedSchema.schema.type);
            should().exist(signedSchema.schema.properties);
            should().exist(signedSchema.schema.required);
            should().exist(signedSchema.proof);
            should().exist(signedSchema.proof.type);
            expect(signedSchema.proof.type).to.be.equal('BJJSignature2021')
            should().exist(signedSchema.proof.created);
            should().exist(signedSchema.proof.verificationMethod);
            should().exist(signedSchema.proof.proofPurpose);
            expect(signedSchema.proof.proofPurpose).to.be.equal('assertionMethod')
            should().exist(signedSchema.proof.proofValue);

        })
    })

    describe('#register() method to register a schema', function () {
        it('should be able to register newly created schema', async () => {
            const registerdSchema = await hsSdk.schema.hypersignBjjschema.register({ schema: signedSchema })
            should().exist(registerdSchema.transactionHash);
        })
    })

    describe('#resolve() method to resolve a schema', function () {
        it('Should be able to resolve schema from blockchain', async () => {
            const resolvedSchema = await hsSdk.schema.hypersignBjjschema.resolve({ schemaId })
            should().exist(resolvedSchema.context)
            should().exist(resolvedSchema.type)
            should().exist(resolvedSchema.modelVersion)
            should().exist(resolvedSchema.id)
            should().exist(resolvedSchema.name)
            should().exist(resolvedSchema.author)
            should().exist(resolvedSchema.authored)
            should().exist(resolvedSchema.schema)
            should().exist(resolvedSchema.schema.schema)
            should().exist(resolvedSchema.schema.description)
            should().exist(resolvedSchema.schema.type)
            should().exist(resolvedSchema.schema.properties)
            should().exist(resolvedSchema.schema.required)
            should().exist(resolvedSchema.schema.additionalProperties)
            should().exist(resolvedSchema.proof)
            should().exist(resolvedSchema.proof.type)
            should().exist(resolvedSchema.proof.created)
            should().exist(resolvedSchema.proof.verificationMethod)
            should().exist(resolvedSchema.proof.proofPurpose)
            should().exist(resolvedSchema.proof.proofValue)
            should().exist(resolvedSchema.proof.clientSpecType)
            expect(resolvedSchema.proof.clientSpecType).to.be.equal('CLIENT_SPEC_TYPE_NONE')
        })
    })
})
// /**
//  * Test cases related to credential
//  */
describe('Credential Operation', () => {
    describe('#generate() method to generate a credential', function () {
        it('should be able to generate a credential', async () => {
            const expirationDate = new Date('12/11/2027');
            const tempCredentialBody = { ...credentialBody }
            tempCredentialBody.schemaId = schemaId;
            tempCredentialBody.subjectDid = subjectDid;
            tempCredentialBody['expirationDate'] = expirationDate.toString();
            tempCredentialBody.issuerDid = issuerDid;
            tempCredentialBody.fields = { name: 'varsha', address: "random address" };
            credentialDetail = await hsSdk.vc.bjjVC.generate(tempCredentialBody)
            expect(credentialDetail).to.be.a('object');
            should().exist(credentialDetail['@context']);
            should().exist(credentialDetail['id']);
            credentialId = credentialDetail.id;
            should().exist(credentialDetail['type']);
            should().exist(credentialDetail['issuanceDate']);
            should().exist(credentialDetail['issuer']);
            should().exist(credentialDetail['credentialSubject']);
            should().exist(credentialDetail['credentialStatus']);
            expect(credentialDetail['credentialStatus'].type).to.be.equal('HypersignCredentialStatus2023');
        })
    })

    describe('#issueCredential() method for issuing credential', function () {

        it('should be able to issue credential with credential status registered on chain', async function () {
            const tempIssueCredentialBody = { ...issueCredentialBody };
            tempIssueCredentialBody.credential = credentialDetail;
            tempIssueCredentialBody.issuerDid = issuerDid;
            tempIssueCredentialBody.verificationMethodId = verificationMethod[0].id;
            tempIssueCredentialBody.privateKeyMultibase = issuerPrivateKeyMultibase;
            const issuedCredResult = await hsSdk.vc.bjjVC.issue(
                tempIssueCredentialBody);
            const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } =
                issuedCredResult;
            signedVC = signedCredential;
            credenStatus = credentialStatus;
            credentialId = signedVC.id;
            credentialStatusId = signedCredential['credentialStatus'].id;
            expect(signedCredential).to.be.a('object');
            should().exist(signedCredential['@context']);
            should().exist(signedCredential['id']);
            should().exist(signedCredential['type']);
            should().exist(signedCredential['issuanceDate']);
            should().exist(signedCredential['issuer']);
            should().exist(signedCredential['credentialSubject']);
            should().exist(signedCredential['credentialSchema']);
            should().exist(signedCredential['credentialStatus']);
            should().exist(signedCredential['proof']);
            expect(signedCredential['id']).to.be.equal(tempIssueCredentialBody.credential.id);
            expect(credentialStatus).to.be.a('object');
            should().exist(credentialStatus['@context']);
            should().exist(credentialStatus['id']);
            should().exist(credentialStatus['issuer']);
            should().exist(credentialStatus['issuanceDate']);
            should().exist(credentialStatus['credentialMerkleRootHash']);
            should().exist(credentialStatus['proof']);
            should().exist(credentialStatus['proof'].type);
            expect(credentialStatus['proof'].type).to.be.equal("BJJSignature2021")
            expect(credentialStatusProof).to.be.a('object');
            should().exist(credentialStatusProof['type']);
            expect(credentialStatusProof['type']).to.be.equal('BJJSignature2021')
            should().exist(credentialStatusProof['created']);
            should().exist(credentialStatusProof['verificationMethod']);
            should().exist(credentialStatusProof['proofPurpose']);
            should().exist(credentialStatusProof['proofValue']);
            expect(credentialStatusRegistrationResult).to.be.a('object');
            should().exist(credentialStatusRegistrationResult['height']);
            should().exist(credentialStatusRegistrationResult['transactionHash']);
            should().exist(credentialStatusRegistrationResult['gasUsed']);
            should().exist(credentialStatusRegistrationResult['gasWanted']);
        });
    });

    describe('#generateSeletiveDisclosure() method for genertaing sd', function () {
        it('should be able to generate a sd document', async () => {
            const presentationBody = {
                verifiableCredential: signedVC,
                frame: {},
                verificationMethodId: verificationMethod[0].id,
                issuerDid
            };
            const revelDocument = {
                type: ["VerifiableCredential", "TestSchema"],
                expirationDate: {},
                issuanceDate: {},
                issuer: {},
                credentialSubject: {
                    "@explicit": true,
                    id: {},
                }
            }
            const tempPresentationBody = { ...presentationBody };
            tempPresentationBody.verifiableCredential = signedVC;
            tempPresentationBody.frame = revelDocument;
            tempPresentationBody.issuerDid = issuerDid
            tempPresentationBody.verificationMethodId = verificationMethod[0].id
            selectiveDisclosure = await hsSdk.vc.bjjVC.generateSeletiveDisclosure(tempPresentationBody);
            should().exist(selectiveDisclosure['@context'])
            should().exist(selectiveDisclosure['id'])
            expect(selectiveDisclosure['id']).to.be.equal(credentialId)
            should().exist(selectiveDisclosure['type'])
            should().exist(selectiveDisclosure['credentialSchema'])
            should().exist(selectiveDisclosure['credentialStatus'])
            should().exist(selectiveDisclosure['credentialSubject'])
            expect(selectiveDisclosure['credentialSubject']).to.be.equal(subjectDid)
            should().exist(selectiveDisclosure['expirationDate'])
            should().exist(selectiveDisclosure['issuanceDate'])
            should().exist(selectiveDisclosure['issuer'])
            expect(selectiveDisclosure['issuer']).to.be.equal(issuerDid)
            should().exist(selectiveDisclosure['proof'])
            should().exist(selectiveDisclosure['proof'].type)
            expect(selectiveDisclosure['proof'].type).to.be.equal('BabyJubJubSignatureProof2021')
            should().exist(selectiveDisclosure['proof'].created)
            should().exist(selectiveDisclosure['proof'].verificationMethod)
            should().exist(selectiveDisclosure['proof'].proofPurpose)
            should().exist(selectiveDisclosure['proof'].credentialRoot)
            should().exist(selectiveDisclosure['proof'].proofValue)

        });
    })
})

// /**
//  * Test cases related to verifiable presentation
//  */
describe('Verifiable Presentation Operataions', () => {
    describe('#generate() method to generate new presentation document', () => {

        it('should be able to generate a new presentation for sd document', async () => {
            const presentationBody = {
                verifiableCredentials: [selectiveDisclosure],
                holderDid: subjectDid,
            };
            const tempPresentationBody = { ...presentationBody };
            tempPresentationBody.holderDid = subjectDid;
            unsignedSdVerifiablePresentation = await hsSdk.vp.bjjVp.generate(tempPresentationBody);
            should().exist(unsignedSdVerifiablePresentation['@context']);
            should().exist(unsignedSdVerifiablePresentation['type']);
            expect(unsignedSdVerifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
            should().exist(unsignedSdVerifiablePresentation['verifiableCredential']);
            expect(unsignedSdVerifiablePresentation.verifiableCredential).to.be.a('array');
            should().exist(unsignedSdVerifiablePresentation['id']);
            should().exist(unsignedSdVerifiablePresentation['holder']);
        });

        it('should be able to generate a new presentation for sd document', async () => {
            const presentationBody = {
                verifiableCredentials: [credentialDetail],
                holderDid: subjectDid,
            };
            const tempPresentationBody = { ...presentationBody };
            tempPresentationBody.verifiableCredentials[0] = credentialDetail;
            tempPresentationBody.holderDid = subjectDid;
            unsignedVerifiablePresentation = await hsSdk.vp.bjjVp.generate(tempPresentationBody);
            should().exist(unsignedVerifiablePresentation['@context']);
            should().exist(unsignedVerifiablePresentation['type']);
            expect(unsignedVerifiablePresentation.type[0]).to.be.equal('VerifiablePresentation');
            should().exist(unsignedVerifiablePresentation['verifiableCredential']);
            expect(unsignedVerifiablePresentation.verifiableCredential).to.be.a('array');
            should().exist(unsignedVerifiablePresentation['id']);
            should().exist(unsignedVerifiablePresentation['holder']);
        });

    })

    describe('#sign() method to sign presentation of credential', () => {
        const signPresentaionBody = {
            presentation: unsignedVerifiablePresentation,
            holderDid: subjectDid,
            verificationMethodId: "",//subjectDidDoc.authentication[0],
            privateKeyMultibase: holderPrivateKeyMultibase,
            challenge: 'abc',
            domain: 'www.xyz.com',
        };
        it('should not be able to sign a presentation as both holderDidDoc as well did is passed', async () => {
            const tempSignPresentaionBody = { ...signPresentaionBody }
            tempSignPresentaionBody['holderDid'] = subjectDid
            tempSignPresentaionBody['holderDidDocSigned'] = subjectDidDoc
            return hsSdk.vp.bjjVp.sign(tempSignPresentaionBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
            });
        })
        it('should not be able to sign a presentation as privateKeyMultibase is not passed', async () => {
            const tempSignPresentaionBody = { ...signPresentaionBody }
            tempSignPresentaionBody['holderDid'] = subjectDid
            tempSignPresentaionBody['privateKeyMultibase'] = ''

            return hsSdk.vp.bjjVp.sign(tempSignPresentaionBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.privateKeyMultibase is required for signing a presentation');
            });
        })
        it('should not be able to sign a presentation as presentation is not passed', async () => {
            const tempSignPresentaionBody = { ...signPresentaionBody }
            tempSignPresentaionBody['holderDid'] = subjectDid
            tempSignPresentaionBody['privateKeyMultibase'] = holderPrivateKeyMultibase
            tempSignPresentaionBody['presentation'] = null

            return hsSdk.vp.bjjVp.sign(tempSignPresentaionBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.presentation is required for signing a presentation');
            });
        })
        it('should not be able to sign a presentation as challenge is not passed', async () => {
            const tempSignPresentaionBody = { ...signPresentaionBody }
            tempSignPresentaionBody['holderDid'] = subjectDid
            tempSignPresentaionBody['privateKeyMultibase'] = holderPrivateKeyMultibase
            tempSignPresentaionBody['presentation'] = unsignedVerifiablePresentation
            tempSignPresentaionBody['challenge'] = ""


            return hsSdk.vp.bjjVp.sign(tempSignPresentaionBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for signing a presentation');
            });
        })
        it('should not be able to sign a presentation as verificationMethodId is not passed', async () => {
            const tempSignPresentaionBody = { ...signPresentaionBody }
            tempSignPresentaionBody['holderDid'] = subjectDid
            tempSignPresentaionBody['privateKeyMultibase'] = holderPrivateKeyMultibase
            tempSignPresentaionBody['presentation'] = unsignedVerifiablePresentation
            tempSignPresentaionBody['challenge'] = "abc"


            return hsSdk.vp.bjjVp.sign(tempSignPresentaionBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.verificationMethodId is required for signing a presentation');
            });
        })
        it('should be able to sign a selective discloser presentation document', async () => {
            const presentationBody = {
                presentation: unsignedSdVerifiablePresentation,
                holderDid: subjectDid,
                verificationMethodId: subjectDidDoc.authentication[0],
                privateKeyMultibase: holderPrivateKeyMultibase,
                challenge: 'abc',
                domain: 'www.xyz.com',
            };
            signedSdVp = await hsSdk.vp.bjjVp.sign(presentationBody);

            should().exist(signedSdVp['@context'])
            should().exist(signedSdVp['type'])
            expect(signedSdVp.type[0]).to.be.equal('VerifiablePresentation')
            should().exist(signedSdVp['verifiableCredential'])
            should().exist(signedSdVp['id'])
            should().exist(signedSdVp['holder'])
            should().exist(signedSdVp['proof'])
            expect(signedSdVp['proof'].type).to.be.equal('BJJSignature2021')
            should().exist(signedSdVp['proof'].created)
            should().exist(signedSdVp['proof'].verificationMethod)
            should().exist(signedSdVp['proof'].proofPurpose)
            should().exist(signedSdVp['proof'].challenge)
            should().exist(signedSdVp['proof'].proofValue)
        });
        it('should be able to sign a verifiable presentation document', async () => {
            const presentationBody = {
                presentation: unsignedVerifiablePresentation,
                holderDid: subjectDid,
                verificationMethodId: subjectDidDoc.authentication[0],
                privateKeyMultibase: holderPrivateKeyMultibase,
                challenge: 'abc',
                domain: 'www.xyz.com',
            };
            signedVp = await hsSdk.vp.bjjVp.sign(presentationBody);
            should().exist(signedVp['@context'])
            should().exist(signedVp['type'])
            expect(signedVp.type[0]).to.be.equal('VerifiablePresentation')
            should().exist(signedVp['verifiableCredential'])
            should().exist(signedVp['id'])
            should().exist(signedVp['holder'])
            should().exist(signedVp['proof'])
            expect(signedVp['proof'].type).to.be.equal('BJJSignature2021')
            should().exist(signedVp['proof'].created)
            should().exist(signedVp['proof'].verificationMethod)
            should().exist(signedVp['proof'].proofPurpose)
            should().exist(signedVp['proof'].challenge)
            should().exist(signedVp['proof'].proofValue)
        });
    })
    describe('#verify() method to verify signed presentation of credential', () => {
        const verifyPresentationBody = {
            signedPresentation: signedSdVp,
            challenge: 'abc',
            domain: 'www.xyz.com',
            issuerDid,
            holderDid: subjectDid,
            issuerVerificationMethodId: '',
            holderVerificationMethodId: ''
        };
        it('should not be able to verify presentation as either holderDid or holderDidDocSigned is required but passed both', async function () {
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.signedPresentation = signedVp;
            tempverifyPresentationBody.holderDid = subjectDid;
            tempverifyPresentationBody.holderVerificationMethodId = subjectDidDoc.verificationMethod[0].id;
            tempverifyPresentationBody.issuerVerificationMethodId = verificationMethod[0].id;
            tempverifyPresentationBody['holderDidDocSigned'] = subjectDidDoc;
            return hsSdk.vp.bjjVp.verify(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
            });
        });
        it('should not be able to verify presentation as issuerDid is null or empty', async function () {
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.issuerDid = '';
            return hsSdk.vp.bjjVp.verify(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
            });
        });
        it('should not be able to verify presentation as challenge is null or empty', async function () {
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.issuerDid = issuerDid;
            tempverifyPresentationBody.challenge = '';

            return hsSdk.vp.bjjVp.verify(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.challenge is required for verifying a presentation');
            });
        });
        it('should not be able to verify presentation as holderVerificationMethodId is null or empty', async function () {
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.issuerDid = issuerDid;
            tempverifyPresentationBody.challenge = "abc";
            tempverifyPresentationBody.holderVerificationMethodId = '';

            return hsSdk.vp.bjjVp.verify(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.holderVerificationMethodId is required for verifying a presentation');
            });
        });
        it('should not be able to verify presentation as issuerVerificationMethodId is null or empty', async function () {
            const tempverifyPresentationBody = { ...verifyPresentationBody };
            tempverifyPresentationBody.issuerDid = issuerDid;
            tempverifyPresentationBody.challenge = "abc";
            tempverifyPresentationBody.holderVerificationMethodId = subjectDidDoc.verificationMethod[0].id;
            tempverifyPresentationBody.issuerVerificationMethodId = '';

            return hsSdk.vp.bjjVp.verify(tempverifyPresentationBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
            });
        });
        it('should be able to verify a sd presentation document', async () => {
            const presentationBody = {
                signedPresentation: signedSdVp,
                challenge: 'abc',
                domain: 'www.xyz.com',
                issuerDid,
                holderDid: subjectDid,
                issuerVerificationMethodId: issuerDidDoc.assertionMethod[0],
                holderVerificationMethodId: subjectDidDoc.authentication[0]
            };


            const verifiedVp = await hsSdk.vp.bjjVp.verify(presentationBody);

            should().exist(verifiedVp['verified'])
            expect(verifiedVp.verified).to.be.equal(true)
            should().exist(verifiedVp['results'])
            expect(verifiedVp.results).to.be.a('array')
            expect(verifiedVp.results[1].credentialResult).to.be.a('array')
            expect(verifiedVp.results[1].credentialResult.length).to.be.greaterThan(0)
            expect(verifiedVp.results[1].credentialResult[0].verified).to.be.equal(true)
        });

        it('should be able to verify a presentation document', async () => {
            const presentationBody = {
                signedPresentation: signedVp,
                challenge: 'abc',
                domain: 'www.xyz.com',
                issuerDid,
                holderDid: subjectDid,
                issuerVerificationMethodId: issuerDidDoc.assertionMethod[0],
                holderVerificationMethodId: subjectDidDoc.authentication[0]
            };
            const verifiedVp = await hsSdk.vp.bjjVp.verify(presentationBody);
            should().exist(verifiedVp['verified'])
            expect(verifiedVp.verified).to.be.equal(true)
            should().exist(verifiedVp['results'])
            expect(verifiedVp.results).to.be.a('array')
            expect(verifiedVp.results[1].credentialResult).to.be.a('array')
            expect(verifiedVp.results[1].credentialResult.length).to.be.greaterThan(0)
            expect(verifiedVp.results[1].credentialResult[0].verified).to.be.equal(true)
        });
    })
})


// add test case for noraml presentation without sd