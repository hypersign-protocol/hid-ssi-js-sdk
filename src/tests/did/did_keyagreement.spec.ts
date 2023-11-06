import { expect, should } from 'chai';
import { HypersignDID } from '../../index';

import { createWallet, mnemonic, hidNodeEp } from '../config';
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let versionId;
let hypersignDID;
let transactionHash
beforeEach(async function () {
    offlineSigner = await createWallet(mnemonic);
    const params = {
        offlineSigner,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
    };
    hypersignDID = new HypersignDID(params);
    await hypersignDID.init();
})
describe('DID Test scenarios for keyagreement type', () => {
    describe('DID Test scenarios for keyType X25519KeyAgreementKey2020', () => {

        describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
            it('should return publickeyMultibase and privateKeyMultibase', async function () {
                const kp = await hypersignDID.generateKeys();
                privateKeyMultibase = kp.privateKeyMultibase;
                publicKeyMultibase = kp.publicKeyMultibase;
                expect(kp).to.be.a('object');
                should().exist(kp.privateKeyMultibase);
                should().exist(kp.publicKeyMultibase);
                should().not.exist(kp.id);
            });
        });


        describe('#generate() to generate did', function () {
            it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
                return hypersignDID.generate({ publicKeyMultibase: '' }).catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
                });
            });

            it('should be able to generate didDocument with ed25519 key', async function () {
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
        // adding keyagreement type as vm
        describe('#addVerificationMethod() to add verificationMethod in didDocument', function () {
            it('should be able to add verification method of type X25519KeyAgreementKey2020 in didDocument', async () => {
                const params = {
                    didDocument: didDocument,
                    type: 'X25519KeyAgreementKey2020',
                    publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
                };
                const didDoc = JSON.parse(JSON.stringify(didDocument));
                const updatedDidDoc = await hypersignDID.addVerificationMethod({ ...params });
                expect(updatedDidDoc).to.be.a('object');
                should().exist(updatedDidDoc['@context']);
                should().exist(updatedDidDoc['id']);
                should().exist(updatedDidDoc['controller']);
                should().exist(updatedDidDoc['alsoKnownAs']);
                should().exist(updatedDidDoc['verificationMethod']);
                expect(
                    updatedDidDoc['verificationMethod'] &&
                    updatedDidDoc['authentication'] &&
                    updatedDidDoc['assertionMethod'] &&
                    updatedDidDoc['keyAgreement'] &&
                    updatedDidDoc['capabilityInvocation'] &&
                    updatedDidDoc['capabilityDelegation'] &&
                    updatedDidDoc['service']
                ).to.be.a('array');
                should().exist(updatedDidDoc['authentication']);
                should().exist(updatedDidDoc['assertionMethod']);
                expect(updatedDidDoc.verificationMethod.length).to.be.greaterThan(didDoc.verificationMethod.length);
            });
        });
        describe('#register() this is to register did on the blockchain', function () {
            it('should be able to register didDocument in the blockchain  with two vm one is of type Ed25519VerificationKey2020 and other is of type X25519KeyAgreementKey2020 and register method is called without signData field', async function () {
                const result = await hypersignDID.register({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId
                });
                transactionHash = result.transactionHash;
                should().exist(result.transactionHash);
            });
        });
        describe('#resolve() this is to resolve didDocument based on didDocId', function () {
            it('should be able to resolve did', async function () {
                const params = {
                    did: didDocId,
                };
                const result = await hypersignDID.resolve(params);
                expect(result).to.be.a('object');
                expect(result.didDocument.id).to.be.equal(didDocId);
                expect(result.didDocumentMetadata).to.be.a('object');
                versionId = result.didDocumentMetadata.versionId;
            });
        });
        describe('#update() this is to update didDocument based on didDocId', function () {
            it('should be able to update did document with key type X25519KeyAgreementKey2020', async function () {
                const didDoc = JSON.parse(JSON.stringify(didDocument))
                didDoc['alsoKnownAs'].push('Some DATA');
                const result = await hypersignDID.update({
                    didDocument: didDoc,
                    privateKeyMultibase,
                    verificationMethodId,
                    versionId,
                });
                should().exist(result.transactionHash);
            });
        });
        describe('#resolve() did after updating did document', function () {
            it('should be able to resolve did', async function () {
                const params = {
                    did: didDocId,
                };
                const result = await hypersignDID.resolve(params);
                expect(result).to.be.a('object');
                expect(result.didDocument.id).to.be.equal(didDocId);
                expect(result.didDocumentMetadata).to.be.a('object');
                versionId = result.didDocumentMetadata.versionId;
            });

        });

        describe('#deactivate() this is to deactivate didDocument based on didDocId', function () {
            it('should be able to deactivate did document with key type X25519KeyAgreementKey2020', async function () {
                const didDocTodeactivate = JSON.parse(JSON.stringify(didDocument))
                const result = await hypersignDID.deactivate({
                    didDocument: didDocTodeactivate,
                    privateKeyMultibase,
                    verificationMethodId,
                    versionId,
                });
                should().exist(result.transactionHash);
            });
        });
    })
    describe('DID Test scenarios for keyType X25519KeyAgreementKeyEIP5630', () => {
        describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
            it('should return publickeyMultibase and privateKeyMultibase', async function () {
                const kp = await hypersignDID.generateKeys();
                privateKeyMultibase = kp.privateKeyMultibase;
                publicKeyMultibase = kp.publicKeyMultibase;
                expect(kp).to.be.a('object');
                should().exist(kp.privateKeyMultibase);
                should().exist(kp.publicKeyMultibase);
                should().not.exist(kp.id);
            });
        });


        describe('#generate() to generate did', function () {
            it('should not be able to generate did document and throw error as publicKeyMultibase passed is null or empty', function () {
                return hypersignDID.generate({ publicKeyMultibase: '' }).catch(function (err) {
                    expect(function () {
                        throw err;
                    }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
                });
            });
            it('should be able to generate didDocument with ed25519 key', async function () {
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
        // adding keyagreement type as vm
        describe('#addVerificationMethod() to add verificationMethod in didDocument', function () {
            it('should be able to add verification method of type X25519KeyAgreementKeyEIP5630 in didDocument', async () => {
                const params = {
                    didDocument: didDocument,
                    type: 'X25519KeyAgreementKeyEIP5630',
                    publicKeyMultibase: '23fer44374u3rmhvf47ri35ty1',
                };
                const didDoc = JSON.parse(JSON.stringify(didDocument));
                const updatedDidDoc = await hypersignDID.addVerificationMethod({ ...params });
                expect(updatedDidDoc).to.be.a('object');
                should().exist(updatedDidDoc['@context']);
                should().exist(updatedDidDoc['id']);
                should().exist(updatedDidDoc['controller']);
                should().exist(updatedDidDoc['alsoKnownAs']);
                should().exist(updatedDidDoc['verificationMethod']);
                expect(
                    updatedDidDoc['verificationMethod'] &&
                    updatedDidDoc['authentication'] &&
                    updatedDidDoc['assertionMethod'] &&
                    updatedDidDoc['keyAgreement'] &&
                    updatedDidDoc['capabilityInvocation'] &&
                    updatedDidDoc['capabilityDelegation'] &&
                    updatedDidDoc['service']
                ).to.be.a('array');
                should().exist(updatedDidDoc['authentication']);
                should().exist(updatedDidDoc['assertionMethod']);
                expect(updatedDidDoc.verificationMethod.length).to.be.greaterThan(didDoc.verificationMethod.length);
            });
        });
        describe('#register() this is to register did with keyType Ed25519VerificationKey2020 and X25519KeyAgreementKeyEIP5630  on the blockchain', function () {
            it('should be able to register didDocument in the blockchain  with two vm one is of type Ed25519VerificationKey2020 and other is of type X25519KeyAgreementKeyEIP5630 and register method is called without signData field', async function () {
                const result = await hypersignDID.register({
                    didDocument,
                    privateKeyMultibase,
                    verificationMethodId
                });
                transactionHash = result.transactionHash;
                should().exist(result.transactionHash);
            });
        });
        describe('#resolve() this is to resolve didDocument based on didDocId', function () {
            it('should be able to resolve did', async function () {
                const params = {
                    did: didDocId,
                };
                const result = await hypersignDID.resolve(params);
                expect(result).to.be.a('object');
                expect(result.didDocument.id).to.be.equal(didDocId);
                expect(result.didDocumentMetadata).to.be.a('object');
                versionId = result.didDocumentMetadata.versionId;
            });
        });
        describe('#update() this is to update didDocument based on didDocId', function () {
            it('should be able to update did document with keyType X25519KeyAgreementKeyEIP5630', async function () {
                const didDoc = JSON.parse(JSON.stringify(didDocument))
                didDoc['alsoKnownAs'].push('Some DATA');
                const result = await hypersignDID.update({
                    didDocument: didDoc,
                    privateKeyMultibase,
                    verificationMethodId,
                    versionId,
                });
                should().exist(result.transactionHash);
            });
        });
        describe('#resolve() did after updating did document', function () {
            it('should be able to resolve did', async function () {
                const params = {
                    did: didDocId,
                };
                const result = await hypersignDID.resolve(params);
                expect(result).to.be.a('object');
                expect(result.didDocument.id).to.be.equal(didDocId);
                expect(result.didDocumentMetadata).to.be.a('object');
                versionId = result.didDocumentMetadata.versionId;
            });

        });

        describe('#deactivate() this is to deactivate didDocument based on didDocId', function () {
            it('should be able to deactivate did document with keytype X25519KeyAgreementKeyEIP5630', async function () {
                const didDocTodeactivate = JSON.parse(JSON.stringify(didDocument))
                const result = await hypersignDID.deactivate({
                    didDocument: didDocTodeactivate,
                    privateKeyMultibase,
                    verificationMethodId,
                    versionId,
                });
                should().exist(result.transactionHash);
            });
        });
    })
})