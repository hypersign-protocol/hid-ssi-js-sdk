
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
let versionId;
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
describe('DID Test scenarios', () => {
    //remove seed while creating did so that wallet can generate different did every time
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

    describe('#generate() method to generate new did', function () {
        it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
            return hsSdk.did.bjjDID.generate({ publicKeyMultibase: '' }).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
            });
        });
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
        it('should be able to generate a did using babyJubJub with passed verification relationships', async () => {
            const didDocument = await hsSdk.did.bjjDID.generate({
                publicKeyMultibase,
                verificationRelationships: ['authentication', 'assertionMethod'],
            })
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
        it('should not able to register did document and throw error as didDocument is not passed or it is empty', function () {
            return hsSdk.did.bjjDID
                .register({ didDocument: {}, privateKeyMultibase, verificationMethodId: verificationMethod[0].id })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocString is required to register a did');
                });
        });
        it('should not be able to register did document as privateKeyMultibase is null or empty', function () {
            return hsSdk.did.bjjDID
                .register({ didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethod[0].id })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
                });
        });
        it('should not be able to register did document as verificationMethodId is null or empty', function () {
            return hsSdk.did.bjjDID
                .register({ didDocument, privateKeyMultibase, verificationMethodId: '' })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
                });
        });
        it('should not be able to register did document as didDocument is not in Ld-json fromat', function () {
            const didDoc = JSON.parse(JSON.stringify(didDocument))
            didDoc.context = didDoc['@context']
            delete didDoc['@context']
            return hsSdk.did.bjjDID
                .register({ didDocument: didDoc, privateKeyMultibase, verificationMethodId: verificationMethod[0].id })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: didDocument is not in Ld-json format');
                });
        });
        it('should not be able to register a did document as neither privateKeyMultibase nor verificationMethodId is passed and signData passed is empty array', async () => {
            return hsSdk.did.bjjDID.register({ didDocument, signData: [] }).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
            });
        });
        it('should not be able to register a did document as verificationMethodId is not passed inside signData', async () => {
            return hsSdk.did.bjjDID.register({ didDocument, signData: [{ privateKeyMultibase: privateKeyMultibase }] }).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(
                    Error,
                    'HID-SSI-SDK:: Error: params.signData[0].verificationMethodId is required to register a did'
                );
            });
        });
        it('should not be able to register a did document as verificationMethodId is not passed inside signData', async () => {
            return hsSdk.did.bjjDID.register({ didDocument, signData: [{ privateKeyMultibase: privateKeyMultibase }] }).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(
                    Error,
                    'HID-SSI-SDK:: Error: params.signData[0].verificationMethodId is required to register a did'
                );
            });
        });
        it('should not be able to register a did document as privateKeyMultibase is not passed inside signData', async () => {
            return hsSdk.did.bjjDID
                .register({
                    didDocument,
                    signData: [
                        {
                            verificationMethodId: verificationMethod[0].id,
                        },
                    ],
                })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(
                        Error,
                        'HID-SSI-SDK:: Error: params.signData[0].privateKeyMultibase is required to register a did'
                    );
                });
        });
        it('should not be able to register a did document as type is not passed inside signData', async () => {
            return hsSdk.did.bjjDID
                .register({
                    didDocument,
                    signData: [
                        {
                            verificationMethodId: verificationMethod[0].id,
                            privateKeyMultibase: privateKeyMultibase,
                        },
                    ],
                })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signData[0].type is required to register a did');
                });
        });
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

    describe('#resolve() method to resolve did', function () {
        it('should not able to resolve did document and throw error as didDocId is not passed', function () {
            return hsSdk.did.bjjDID.resolve({ params: { did: '' } }).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a did');
            });
        });
        it('should be able to resolve did', async () => {
            const resolvedDid = await hsSdk.did.bjjDID.resolve({
                did: didDocId
            })
            versionId = resolvedDid.didDocumentMetadata.versionId
            didDocument = resolvedDid.didDocument
            const didDocumentmetaData = resolvedDid.didDocumentMetadata
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
            expect(didDocumentmetaData).to.be.a('object')
            should().exist(didDocumentmetaData.created)
            should().exist(didDocumentmetaData.updated)
            should().exist(didDocumentmetaData.deactivated)
            should().exist(didDocumentmetaData.versionId)
            expect(didDocumentmetaData.created).to.be.equal(didDocumentmetaData.updated)
        })

    })

    describe('#update() method to update a did', function () {
        it('should not be able to update did document as privateKeyMultibase is null or empty', function () {
            return hsSdk.did.bjjDID
                .update({ didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethod[0].id, versionId: '1.0' })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
                });
        });
        it('should not be able to update did document as verificationMethodId is null or empty', function () {
            return hsSdk.did.bjjDID
                .update({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
                });
        });
        it('should not be able to update did document as versionId is null or empty', function () {
            return hsSdk.did.bjjDID
                .update({ didDocument, privateKeyMultibase, verificationMethodId: verificationMethod[0].id, versionId: '' })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
                });
        });
        it('should not be able to update did document as versionId passed is incorrect', function () {
            const updateBody = { didDocument, privateKeyMultibase, verificationMethodId: verificationMethod[0].id, versionId: '1.0.1' };
            const didDoc = JSON.parse(JSON.stringify(didDocument))
            updateBody['didDocument'] = didDoc
            updateBody['didDocument']['authentication'] = [];
            return hsSdk.did.bjjDID.update(updateBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(
                    Error,
                    `Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${updateBody.versionId}: unexpected DID version`
                );
            });
        });
        // add testcase should not update did if it is not modified
        it('should not be able to update did document as there is no change in didDocument', function () {
            const updateBody = { didDocument, privateKeyMultibase, verificationMethodId: verificationMethod[0].id, versionId: '1.0.1' };
            const didDoc = JSON.parse(JSON.stringify(didDocument))
            updateBody['didDocument'] = didDoc
            return hsSdk.did.bjjDID.update(updateBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(
                    Error,
                    `Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: incoming DID Document does not have any changes: didDoc is invalid`
                );
            });
        });
        it('should be able to update did generated using BabyJubJubKey', async () => {
            const newDidDoc = JSON.parse(JSON.stringify(didDocument))
            newDidDoc['authentication'] = []
            const updatedDid = await hsSdk.did.bjjDID.update({
                didDocument: newDidDoc,
                privateKeyMultibase,
                verificationMethodId: verificationMethod[0].id,
                versionId
            })
            should().exist(updatedDid.transactionHash);
        })
    })

    describe('#resolve() method to resolve did', function () {
        it('should be able to resolve did after updation', async () => {
            const resolvedDid = await hsSdk.did.bjjDID.resolve({
                did: didDocId
            })
            versionId = resolvedDid.didDocumentMetadata.versionId
            didDocument = resolvedDid.didDocument
            const didDocumentmetaData = resolvedDid.didDocumentMetadata
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
            // expect(didDocument['authentication'].length).to.be.greaterThan(0)
            expect(didDocument['assertionMethod'].length).to.be.greaterThan(0)
            expect(didDocument['capabilityInvocation'].length).to.be.equal(0)
            expect(didDocument['capabilityDelegation'].length).to.be.equal(0)
            expect(didDocument['keyAgreement'].length).to.be.equal(0)
            expect(didDocument['service'].length).to.be.equal(0)
            expect(didDocumentmetaData).to.be.a('object')
            should().exist(didDocumentmetaData.created)
            should().exist(didDocumentmetaData.updated)
            should().exist(didDocumentmetaData.deactivated)
            should().exist(didDocumentmetaData.versionId)
            const date1 = new Date(didDocumentmetaData.updated);
            const date2 = new Date(didDocumentmetaData.created);
            expect(date1).to.be.greaterThan(date2)
        })
    })
    describe('#deactivate() method to deactivate a did document', function () {
        it('should not be able to deactivate did document as privateKeyMultibase is null or empty', function () {
            return hsSdk.did.bjjDID
                .deactivate({ didDocument, privateKeyMultibase: '', verificationMethodId: verificationMethod[0].id, versionId: '1.0' })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
                });
        });
        it('should not be able to deactivate did document as verificationMethodId is null or empty', function () {
            return hsSdk.did.bjjDID
                .deactivate({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
                });
        });
        it('should not be able to deactivate did document as versionId is null or empty', function () {
            return hsSdk.did.bjjDID
                .deactivate({ didDocument, privateKeyMultibase, verificationMethodId: verificationMethod[0].id, versionId: '' })
                .catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
                });
        });
        it('should not be able to deactivate did document as versionId pased is incorrect', function () {
            const didDoc = JSON.parse(JSON.stringify(didDocument))
            const deactivateBody = { didDocument: didDoc, privateKeyMultibase, verificationMethodId: verificationMethod[0].id, versionId: '1.0.1' };
            return hsSdk.did.bjjDID.deactivate(deactivateBody).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(
                    Error,
                    `Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${deactivateBody.versionId}: unexpected DID version`
                );
            });
        });
        it('should be able to deactivate did generated using BabyJubJubKey', async () => {
            const updatedDid = await hsSdk.did.bjjDID.deactivate({
                didDocument: didDocument,
                privateKeyMultibase,
                verificationMethodId: verificationMethod[0].id,
                versionId
            })
            should().exist(updatedDid.transactionHash);
        })
        it('should be able to resolve did after deactivation and deactivated should be true', async () => {
            const resolvedDid = await hsSdk.did.bjjDID.resolve({
                did: didDocId
            })
            versionId = resolvedDid.didDocumentMetadata.versionId
            didDocument = resolvedDid.didDocument
            const didDocumentmetaData = resolvedDid.didDocumentMetadata
            expect(didDocument).to.be.a('object');
            expect(didDocumentmetaData).to.be.a('object')
            should().exist(didDocumentmetaData.created)
            should().exist(didDocumentmetaData.updated)
            should().exist(didDocumentmetaData.deactivated)
            expect(didDocumentmetaData.deactivated).to.be.equal(true)
            should().exist(didDocumentmetaData.versionId)
            const date1 = new Date(didDocumentmetaData.updated);
            const date2 = new Date(didDocumentmetaData.created);
            expect(date1).to.be.greaterThan(date2)
        })
    })
})