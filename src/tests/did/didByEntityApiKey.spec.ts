import { expect, should } from 'chai';
import { HypersignDID } from '../../index';
import { createWallet, mnemonic, hidNodeEp, entityApiSecret } from '../config';

// with local edv
let offlineSigner;
let hypersignDID;
let privateKeyMultibase;
let publicKeyMultibase;
let didDocument;
let didDocId;
let versionId;
let verificationMethodId;
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
});

describe('testing hypersignDid initiation', function () {
  it('It should throw error as hypersignDid is neither init using offlineSigner nor using entityApiKey', async () => {
    const params = {
      nodeRestEndpoint: hidNodeEp.rest,
      nodeRpcEndpoint: hidNodeEp.rpc,
      namespace: hidNodeEp.namespace,
    };
    const hypersigndid = new HypersignDID(params);
    return await hypersigndid.init().catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner');
    });
  });
});
describe('DID Test Scenarios using entiAPiSecretKey', () => {
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
      expect(didDocument['keyAgreement'].length).to.be.equal(0);
      should().exist(didDocument['authentication']);
      should().exist(didDocument['assertionMethod']);
      should().exist(didDocument['keyAgreement']);
      should().exist(didDocument['capabilityInvocation']);
      should().exist(didDocument['capabilityDelegation']);
      should().exist(didDocument['service']);
    });
  });

  describe('#register() to register did on chain', function () {
    it('should not be able to initialize HypersignDID with entityApiSecretKey as entityApiSecretKey is invalid', async () => {
      const HypersignDid = new HypersignDID({
        entityApiSecretKey: 'entityApiSecretKey',
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
      });
      try {
        await HypersignDid.init();
        expect.fail('Expected an error but initialization succeeded');
      } catch (error: any) {
        expect(error.message).to.equal('HID-SSI-SDK:: access_denied');
      }
    });
    it('should not able to register did document and throw error as didDocument is not passed or it is empty', async () => {
      return hypersignDID
        .register({ didDocument: {}, privateKeyMultibase, verificationMethodId })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocString is required to register a did');
        });
    });
    it('should not be able to register did document as privateKeyMultibase is null or empty', function () {
      return hypersignDID
        .register({ didDocument, privateKeyMultibase: '', verificationMethodId })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
        });
    });
    it('should not be able to register a did document as neither privateKeyMultibase nor verificationMethodId is passed and signData passed is empty array', async () => {
      return hypersignDID.register({ didDocument, signData: [] }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
      });
    });
    it('should be able to registr did using entityApiSecret', async () => {
      const HypersignDid = new HypersignDID({
        entityApiSecretKey: entityApiSecret,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
      });
      await HypersignDid.init();
      const registerdDid = await hypersignDID.register({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
      });
      should().exist(registerdDid.didDocument);
      should().exist(registerdDid.transactionHash);
    });
  });
  describe('#resolve() to resove did using ', function () {
    it('should not able to resolve did document and throw error didDocId is not passed', function () {
      return hypersignDID.resolve({ params: { did: '' } }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a did');
      });
    });
    it('Should be able to resolve did using entityApiSecret', async () => {
      const params = {
        did: didDocId,
      };
      const HypersignDid = new HypersignDID({
        entityApiSecretKey: entityApiSecret,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
      });
      await HypersignDid.init();
      const result = await HypersignDid.resolve(params);
      expect(result).to.be.a('object');
      expect(result.didDocument.id).to.be.equal(didDocId);
      expect(result.didDocumentMetadata).to.be.a('object');
      versionId = result.didDocumentMetadata.versionId;
    });
  });

  describe('#update() this is to update didDocument', function () {
    it('should not be able to update did document using entityApiKey as privateKeyMultibase is null or empty', function () {
      return hypersignDID
        .update({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
        });
    });
    it('should not be able to update did document using entityApiKey as verificationMethodId is null or empty', function () {
      return hypersignDID
        .update({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
        });
    });
    it('should not be able to update did document using entityApiKey as versionId is null or empty', function () {
      return hypersignDID
        .update({ didDocument, privateKeyMultibase, verificationMethodId, versionId: '' })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
        });
    });
    it('should be able to update did document using entityApiSecret', async () => {
      const HypersignDid = new HypersignDID({
        entityApiSecretKey: entityApiSecret,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
      });
      await HypersignDid.init();
      didDocument['alsoKnownAs'].push('Varsha');

      const result = await HypersignDid.update({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
        versionId,
      });
      should().exist(result);
    });
  });
  describe('#resolve() did ater updating did document', function () {
    it('Should be able to resolve did', async function () {
      const params = {
        did: didDocId,
      };
      const result = await hypersignDID.resolve(params);
      expect(result).to.be.a('object');
      expect(result.didDocument.id).to.be.equal(didDocId);
      expect(result.didDocumentMetadata).to.be.a('object');
      expect(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.not.equal(publicKeyMultibase);
      versionId = result.didDocumentMetadata.versionId;
    });
  });

  describe('#deactivate() this is to deactivate didDocument', function () {
    it('should not be able to deactivate did document using entityApiSecretKey as privateKeyMultibase is null or empty', async () => {
      const HypersignDid = new HypersignDID({
        entityApiSecretKey: entityApiSecret,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
      });
      await HypersignDid.init();
      return HypersignDid.deactivate({
        didDocument,
        privateKeyMultibase: '',
        verificationMethodId,
        versionId: '1.0',
      }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
      });
    });
    it('should not be able to deactivate did document as verificationMethodId is null or empty', async function () {
      const HypersignDid = new HypersignDID({
        entityApiSecretKey: entityApiSecret,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
      });
      await HypersignDid.init();
      return HypersignDid.deactivate({
        didDocument,
        privateKeyMultibase,
        verificationMethodId: '',
        versionId: '1.0',
      }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
      });
    });
    it('should not be able to deactivate did document as versionId is null or empty', function () {
      return hypersignDID
        .deactivate({ didDocument, privateKeyMultibase, verificationMethodId, versionId: '' })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
        });
    });
    it('Should be able to deactivate did document using entityApiSecretKey', async () => {
      const HypersignDid = new HypersignDID({
        entityApiSecretKey: entityApiSecret,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
      });
      await HypersignDid.init();
      const result = await HypersignDid.deactivate({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
        versionId,
      });
      should().exist(result.transactionHash);
    });
    it('Should be able to resolve deactivated did and get deactivated as true in didDoc', async () => {
      const params = {
        did: didDocId,
      };
      const HypersignDid = new HypersignDID({
        entityApiSecretKey: entityApiSecret,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
      });
      await HypersignDid.init();
      const result = await HypersignDid.resolve(params);
      should().exist(result.didDocument);
      should().exist(result.didDocumentMetadata);
      expect(result.didDocumentMetadata.deactivated).to.equal(true);
    });
  });
});
