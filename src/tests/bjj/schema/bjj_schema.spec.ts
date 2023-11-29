
import { HypersignSSISdk } from '../../../index';
import { expect, should } from 'chai';
import { createWallet, mnemonic, hidNodeEp } from '../../config'
let privateKeyMultibase;
let publicKeyMultibase;
let offlineSigner
let hsSdk
let didDocument;
let verificationMethod;
let didDocId;
let schemaObject;
let signedSchema;
let schemaId
const schemaBody = {
    name: 'TestSchema',
    description: 'This is a test schema generation',
    author: '',
    fields: [{ name: 'name', type: 'string', isRequired: false }, { name: "address", type: "string", isRequired: true }],
    additionalProperties: false,
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
        privateKeyMultibase = kp.privateKeyMultibase;
        publicKeyMultibase = kp.publicKeyMultibase;
        expect(kp).to.be.a('object');
        should().exist(kp.privateKeyMultibase);
        should().exist(kp.publicKeyMultibase);
        should().not.exist(kp.id);
    });
});
describe('DID Operation', () => {
    describe('#generate() method to generate new did', function () {
        it('should be able to generate a did using babyJubJub', async () => {
            didDocument = await hsSdk.did.bjjDID.generate({
                publicKeyMultibase
            })
            didDocId = didDocument.id
            verificationMethod = didDocument.verificationMethod
            expect(didDocument).to.be.a('object');
            should().exist(didDocument['@context']);
            should().exist(didDocument['id']);
            should().exist(didDocument['controller']);
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
            expect(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021')
            should().exist(didDocument['authentication']);
            should().exist(didDocument['assertionMethod']);
            should().exist(didDocument['keyAgreement']);
            should().exist(didDocument['capabilityInvocation']);
            should().exist(didDocument['capabilityDelegation']);
            should().exist(didDocument['service']);
            expect(didDocument['authentication'].length).to.be.greaterThan(0)
            expect(didDocument['assertionMethod'].length).to.be.greaterThan(0)
            expect(didDocument['capabilityInvocation'].length).to.be.equal(0)
            expect(didDocument['capabilityDelegation'].length).to.be.equal(0)
            expect(didDocument['keyAgreement'].length).to.be.equal(0)
            expect(didDocument['service'].length).to.be.equal(0)

        })
    })
    describe('#register() method to register did', function () {
        it('should be able to register did generated using BabyJubJubKey', async () => {
            const registerDid = await hsSdk.did.bjjDID.register({
                didDocument: didDocument,
                privateKeyMultibase,
                verificationMethodId: verificationMethod[0].id
            })
            didDocument = registerDid.didDocument
            expect(didDocument).to.be.a('object');
            should().exist(didDocument['@context']);
            should().exist(didDocument['id']);
            should().exist(didDocument['controller']);
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
            expect(verificationMethod[0].type).to.be.equal('BabyJubJubKey2021')
            should().exist(didDocument['authentication']);
            should().exist(didDocument['assertionMethod']);
            should().exist(didDocument['keyAgreement']);
            should().exist(didDocument['capabilityInvocation']);
            should().exist(didDocument['capabilityDelegation']);
            should().exist(didDocument['service']);
            expect(didDocument['authentication'].length).to.be.greaterThan(0)
            expect(didDocument['assertionMethod'].length).to.be.greaterThan(0)
            expect(didDocument['capabilityInvocation'].length).to.be.equal(0)
            expect(didDocument['capabilityDelegation'].length).to.be.equal(0)
            expect(didDocument['keyAgreement'].length).to.be.equal(0)
            expect(didDocument['service'].length).to.be.equal(0)
            should().exist(registerDid.transactionHash);
        })
    })
})

describe('Schema Operations', () => {
    describe('#generate() method to create schema', function () {
        it('should not be able to create a new schema as author is not passed', function () {
            const tempSchemaBody = { ...schemaBody };
            return hsSdk.schema.hypersignBjjschema.generate(tempSchemaBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: Author must be passed');
            });
        });
        it('should be able to generate new schema', async function () {
            const tempSchemaBody = { ...schemaBody }
            tempSchemaBody.author = didDocId
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
        it('should not be able to sign a new schema as privateKeyMultibase is not passed', function () {
            return hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase: "",
                schema: schemaObject,
                verificationMethodId: didDocument['assertionMethod'][0]
            }).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase must be passed');
            });
        });
        it('should not be able to sign a new schema as verificationMethodId is not passed', function () {
            return hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase,
                schema: schemaObject,
                verificationMethodId: ""
            }).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId must be passed');
            });
        });
        it('should not be able to sign a new schema as schema is not passed', function () {
            return hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase,
                verificationMethodId: didDocument['assertionMethod'][0]
            }).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: Schema must be passed');
            });
        });
        it('should be able to sign newly created schema', async () => {
            signedSchema = await hsSdk.schema.hypersignBjjschema.sign({
                privateKeyMultibase,
                schema: schemaObject,
                verificationMethodId: didDocument['assertionMethod'][0]
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
        it('Should not be able to register schema as schema is not passed in params', async () => {
            const params = {
                schemas: signedSchema
            }
            return hsSdk.schema.hypersignBjjschema.register(params).catch(function (err) {
                expect(function () {
                    throw err
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema must be passed')
            })
        })
        it('Should not be able to register schema as schema object does not have proof field', async () => {
            const tempSchemaDetail = { ...signedSchema }
            delete tempSchemaDetail.proof
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                expect(function () {
                    throw err
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must be passed')
            })
        })
        it('Should not be able to register schema as schema proof does not have "created" field or it is empty ', async () => {
            const tempSchemaDetail = JSON.parse(JSON.stringify({ ...signedSchema }))
            tempSchemaDetail.proof.created = ""
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                expect(function () {
                    throw err
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain created')
            })
        })
        it('Should not be able to register schema as schema proof does not have "proofPurpose" field or it is empty ', async () => {
            const tempSchemaDetail = JSON.parse(JSON.stringify({ ...signedSchema }))
            tempSchemaDetail.proof.proofPurpose = ""
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                expect(function () {
                    throw err
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain proofPurpose')
            })
        })
        it('Should not be able to register schema as schema proof does not have "proofValue" field or it is empty ', async () => {
            const tempSchemaDetail = JSON.parse(JSON.stringify({ ...signedSchema }))
            tempSchemaDetail.proof.proofValue = ""
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                expect(function () {
                    throw err
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain proofValue')
            })
        })
        it('Should not be able to register schema as schema proof does not have "type" field or it is empty ', async () => {
            const tempSchemaDetail = JSON.parse(JSON.stringify({ ...signedSchema }))
            tempSchemaDetail.proof.type = ""
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                expect(function () {
                    throw err
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain type')
            })
        })
        it('Should not be able to register schema as schema proof does not have "verificationMethod" field or it is empty ', async () => {
            const tempSchemaDetail = JSON.parse(JSON.stringify({ ...signedSchema }))
            tempSchemaDetail.proof.verificationMethod = ""
            return hsSdk.schema.hypersignBjjschema.register({ schema: tempSchemaDetail }).catch(function (err) {
                expect(function () {
                    throw err
                }).to.throw(Error, 'HID-SSI-SDK:: Error: schema.proof must Contain verificationMethod')
            })
        })
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
            expect(resolvedSchema.proof.type).to.be.equal('BJJSignature2021')
            should().exist(resolvedSchema.proof.created)
            should().exist(resolvedSchema.proof.verificationMethod)
            should().exist(resolvedSchema.proof.proofPurpose)
            should().exist(resolvedSchema.proof.proofValue)
            should().exist(resolvedSchema.proof.clientSpecType)
            expect(resolvedSchema.proof.clientSpecType).to.be.equal('CLIENT_SPEC_TYPE_NONE')
        })
    })
})