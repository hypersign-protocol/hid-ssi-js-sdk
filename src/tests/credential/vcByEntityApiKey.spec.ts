import { expect, should } from 'chai';
import { HypersignDID, HypersignSchema, HypersignVerifiableCredential } from '../../index';
import { createWallet, mnemonic, hidNodeEp, entityApiSecret } from '../config';
import { ICredentialStatus, IVerifiableCredential } from '../../credential/ICredential';
// import { CredentialProof, CredentialStatus } from '../../../libs/generated/ssi/credential_status';
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
let credentialsProof
const domain = 'www.adbv.com';
const schemaBody = {
    name: 'testSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [{ name: 'name', type: 'string', isRequired: false }],
    additionalProperties: false,
};
beforeEach(async function () {
    offlineSigner = await createWallet(mnemonic);
    const constructorParams = {
        offlineSigner,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
    };

    hypersignDID = new HypersignDID(constructorParams);
    await hypersignDID.init();

    hypersignSchema = new HypersignSchema(constructorParams);
    await hypersignSchema.init();

    hypersignVC = new HypersignVerifiableCredential(constructorParams);
    await hypersignVC.init();
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

/**
 * DID creation and registration
 */
describe('DID Opearations', () => {
    describe('#generate() to generate did', function () {
        it('should be able to generate didDocument', async function () {
            didDocument = await hypersignDID.generate({ publicKeyMultibase });
            didDocId = didDocument['id'];
            verificationMethodId = didDocument['verificationMethod'][0].id;
            expect(didDocument).to.be.a('object');
            should().exist(didDocument['@context']);
            should().exist(didDocument['id']);
            should().exist(didDocument['controller']);
            should().exist(didDocument['alsoKnownAs']);

            should().exist(didDocument['verificationMethod']);
            expect(
                didDocument['verificationMethod'] &&
                didDocument['authentication'] &&
                didDocument['assertionMethod'] &&
                didDocument['keyAgreement'] &&
                didDocument['capabilityInvocation'] &&
                didDocument['capabilityDelegation'] &&
                didDocument['service']
            ).to.be.a('array');
            should().exist(didDocument['authentication']);
            should().exist(didDocument['assertionMethod']);
            should().exist(didDocument['keyAgreement']);
            should().exist(didDocument['capabilityInvocation']);
            should().exist(didDocument['capabilityDelegation']);
            should().exist(didDocument['service']);
        });
    });

    describe('#sign() this is to sign didDoc', function () {
        const controller = {
            '@context': '',
            id: '',
            authentication: [],
        };
        it('should able to sign did document', async function () {
            const params = {
                privateKeyMultibase: privateKeyMultibase as string,
                challenge: challenge as string,
                domain: domain as string,
                did: '',
                didDocument: didDocument as object,
                verificationMethodId: verificationMethodId as string,
                controller,
            };
            signedDocument = await hypersignDID.sign(params);
            expect(signedDocument).to.be.a('object');
            should().exist(signedDocument['@context']);
            should().exist(signedDocument['id']);
            expect(didDocId).to.be.equal(signedDocument['id']);
            should().exist(signedDocument['controller']);
            should().exist(signedDocument['alsoKnownAs']);
            should().exist(signedDocument['verificationMethod']);
            should().exist(signedDocument['authentication']);
            should().exist(signedDocument['assertionMethod']);
            should().exist(signedDocument['keyAgreement']);
            should().exist(signedDocument['capabilityInvocation']);
            should().exist(signedDocument['capabilityDelegation']);
            should().exist(signedDocument['service']);
            should().exist(signedDocument['proof']);
        });
    });

    describe('#register() this is to register did on the blockchain', function () {
        it('should be able to register didDocument in the blockchain', async function () {
            const result = await hypersignDID.register({ didDocument, privateKeyMultibase, verificationMethodId });
            should().exist(result.transactionHash);
            should().exist(result.didDocument);
        });
    });
});


/**
 * Schema Creation and Registration
 */
describe('Schema Opearations', () => {
    describe('#getSchema() method to create schema', function () {
        it('should able to create a new schema', async function () {
            schemaBody.author = didDocId;
            schemaObject = await hypersignSchema.generate(schemaBody);
            schemaId = schemaObject['id'];
            expect(schemaObject).to.be.a('object');
            should().exist(schemaObject['type']);
            should().exist(schemaObject['modelVersion']);
            should().exist(schemaObject['id']);
            should().exist(schemaObject['name']);
            should().exist(schemaObject['author']);
            should().exist(schemaObject['authored']);
            should().exist(schemaObject['schema']);
            expect(schemaObject.schema).to.be.a('object');
            expect(schemaObject['name']).to.be.equal(schemaBody.name);
            expect(schemaObject['author']).to.be.equal(schemaBody.author);
        });
    });

    describe('#sign() function to sign schema', function () {
        it('should be able to sign newly created schema', async function () {
            signedSchema = await hypersignSchema.sign({ privateKeyMultibase, schema: schemaObject, verificationMethodId });
            expect(signedSchema).to.be.a('object');
        });
    });

    describe('#registerSchema() function to register schema on blockchain', function () {
        it('should be able to register schema on blockchain', async function () {
            const registeredSchema = await hypersignSchema.register({
                schema: signedSchema,
            });
            expect(registeredSchema).to.be.a('object');
            should().exist(registeredSchema.transactionHash);
        });
    });

});

/**
* Test cases related to credential
*/
describe('Verifiable credential operation', function () {
    describe('#generate() method to generate new credential', function () {
        it('should be able to generate new credential for a schema with subject DID', async function () {
            const credentialbody = {
                schemaId,
                subjectDid: didDocId,
                type: [],
                issuerDid: didDocId,
                fields: { name: "varsha" },
                expirationDate: '',
            }
            const expirationDate = new Date('12/11/2027');
            credentialbody['expirationDate'] = expirationDate.toString();
            credentialDetail = await hypersignVC.generate(credentialbody);
            expect(credentialDetail).to.be.a('object');
            should().exist(credentialDetail['@context']);
            should().exist(credentialDetail['id']);
            credentialId = credentialDetail.id;
            should().exist(credentialDetail['type']);
            should().exist(credentialDetail['expirationDate']);
            should().exist(credentialDetail['issuanceDate']);
            should().exist(credentialDetail['issuer']);
            should().exist(credentialDetail['credentialSubject']);
            should().exist(credentialDetail['credentialSchema']);
            should().exist(credentialDetail['credentialStatus']);
            expect(credentialDetail['credentialStatus'].type).to.be.equal('CredentialStatusList2017');
        });
    })

    describe('#issueCredential() method for issuing credential', function () {
        it('Should be able to issue credential without registering on chain', async () => {
            const credentialbody = {
                credential: credentialDetail,
                issuerDid: didDocId,
                verificationMethodId,
                privateKeyMultibase,
                registerCredential: false
            }
            const issuedCredentialResult = await hypersignVC.issue(credentialbody)
            should().exist(issuedCredentialResult.signedCredential)
            expect(issuedCredentialResult.signedCredential).to.be.a('object')
            should().exist(issuedCredentialResult.signedCredential.id)
            expect(issuedCredentialResult.signedCredential.id).to.be.a('string')
            expect(issuedCredentialResult.signedCredential.id).to.be.equal(credentialId)
            should().exist(issuedCredentialResult.signedCredential.type)
            expect(issuedCredentialResult.signedCredential.type).to.be.a('array')
            expect(issuedCredentialResult.signedCredential.type).to.include('VerifiableCredential')
            should().exist(issuedCredentialResult.signedCredential.expirationDate)
            expect(issuedCredentialResult.signedCredential.expirationDate).to.be.a('string')
            should().exist(issuedCredentialResult.signedCredential.issuanceDate)
            expect(issuedCredentialResult.signedCredential.issuanceDate).to.be.a('string')
            should().exist(issuedCredentialResult.signedCredential.credentialSubject)
            expect(issuedCredentialResult.signedCredential.credentialSubject).to.be.a('object')
            should().exist(issuedCredentialResult.signedCredential.credentialSchema)
            expect(issuedCredentialResult.signedCredential.credentialSchema).to.be.a('object')
            expect(issuedCredentialResult.signedCredential.credentialSchema.id).to.be.equal(schemaId)
            should().exist(issuedCredentialResult.signedCredential.credentialStatus)
            expect(issuedCredentialResult.signedCredential.credentialStatus).to.be.a('object')
            expect(issuedCredentialResult.signedCredential.credentialStatus.id).to.be.include(credentialId)

            should().exist(issuedCredentialResult.credentialStatus)
            expect(issuedCredentialResult.credentialStatus).to.be.a('object')
            credentialStatus = issuedCredentialResult.credentialStatus
            should().exist(issuedCredentialResult.credentialStatusProof)
            expect(issuedCredentialResult.credentialStatusProof).to.be.a('object')
            credentialsProof = issuedCredentialResult.credentialStatusProof
        })
    })

    describe('#registerCredentialStatus() method to register credential status on chain', () => {
        it('Should be able to register credential using entityApiSecretKey', async () => {
            const hypersignVC = new HypersignVerifiableCredential({
                entityApiSecretKey: entityApiSecret,
                nodeRestEndpoint: hidNodeEp.rest,
                nodeRpcEndpoint: hidNodeEp.rpc,
                namespace: hidNodeEp.namespace,
            })
            await hypersignVC.init()
            const registerdCredStatus = await hypersignVC.registerCredentialStatus({
                credentialStatus: credentialStatus,
                credentialStatusProof: credentialsProof
            })
            should().exist(registerdCredStatus.transactionHash)
            expect(registerdCredStatus.transactionHash).to.be.a('string')
        })

    })
})
