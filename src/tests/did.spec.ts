import { expect, should } from 'chai';
import { HypersignDID, HypersignSSISdk } from '../index';
import { IPublicKey, IController, IDID } from '../did/IDID';
import Web3 from 'web3';
import { createWallet, mnemonic, hidNodeEp } from './config';
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let offlineSigner;
let versionId;
let hypersignDID;
let transactionHash;
let signedDocument;
const challenge = '1231231231';
const domain = 'www.adbv.com';
let hypersignSSISDK;
const MMWalletAddress = '0x7967C85D989c41cA245f1Bb54c97D42173B135E0';
let didDocumentByClientspec;
//const web3 = new Web3('https://mainnet.infura.io/v3/');

//add mnemonic of wallet that have balance

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

describe('DID Test scenarios', () => {
  //remove seed while creating did so that wallet can generate different did every time

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

    it('should return publickeyMultibase and privateKeyMultibase along with controller', async function () {
      const controller = 'did:hid:testnet:controller';
      const kpnew = await hypersignDID.generateKeys({ controller });
      expect(kpnew).to.be.a('object');
      should().exist(kpnew.privateKeyMultibase);
      should().exist(kpnew.publicKeyMultibase);
      should().exist(kpnew.id);
      expect(kpnew.id).to.be.equal(controller);
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
      should().exist(didDocument['authentication']);
      should().exist(didDocument['assertionMethod']);
      should().exist(didDocument['keyAgreement']);
      should().exist(didDocument['capabilityInvocation']);
      should().exist(didDocument['capabilityDelegation']);
      should().exist(didDocument['service']);
    });

    it('should be able to generate didDocument with passsed verification relationships (authentication and assertion) only', async function () {
      didDocument = await hypersignDID.generate({
        publicKeyMultibase,
        verificationRelationships: ['authentication', 'assertionMethod'],
      });
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

      expect(didDocument['authentication'][0]).to.be.equal(verificationMethodId);
      expect(didDocument['authentication']).to.be.a('array').of.length(1);
      expect(didDocument['assertionMethod']).to.be.a('array').of.length(1);
      expect(didDocument['keyAgreement']).to.be.a('array').of.length(0);
      expect(didDocument['capabilityInvocation']).to.be.a('array').of.length(0);
      expect(didDocument['service']).to.be.a('array').of.length(0);
      expect(didDocument['capabilityDelegation']).to.be.a('array').of.length(0);
    });

    it('should be able to generate didDocument with custom id', async function () {
      const methodSpecificId = 'e157620d69d003e12d935c37b8c21baa78d24898398829b39d943d253c006332';
      const didDocument = await hypersignDID.generate({ publicKeyMultibase, methodSpecificId });
      const didDocId = didDocument['id'];
      expect(didDocument).to.be.a('object');
      expect(didDocId).to.be.equal('did:hid:testnet:' + methodSpecificId);
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

    it('should be able to generate didDocument with custom id using HypersignSSISDk instance', async function () {
      const methodSpecificId = 'e157620d69d003e12d935c37b8c21baa78d24898398829b39d943d253c006332';

      const params = {
        offlineSigner,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
      };

      hypersignSSISDK = new HypersignSSISdk(params);
      await hypersignSSISDK.init();
      hypersignDID = hypersignSSISDK.did;

      const didDocument = await hypersignDID.generate({ publicKeyMultibase, methodSpecificId });
      const didDocId = didDocument['id'];
      expect(didDocument).to.be.a('object');
      expect(didDocId).to.be.equal('did:hid:testnet:' + methodSpecificId);
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

  describe('#register() this is to register did on the blockchain', function () {
    it('should not able to register did document and throw error as didDocument is not passed or it is empty', function () {
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
    it('should not be able to register did document as verificationMethodId is null or empty', function () {
      return hypersignDID
        .register({ didDocument, privateKeyMultibase, verificationMethodId: '' })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
        });
    });
    it('should be able to register didDocument in the blockchain', async function () {
      const result = await hypersignDID.register({ didDocument, privateKeyMultibase, verificationMethodId });
      transactionHash = result.transactionHash;
      should().exist(result.code);
      should().exist(result.height);
      should().exist(result.rawLog);
      should().exist(result.transactionHash);
      should().exist(result.gasUsed);
      should().exist(result.gasWanted);
    });
  });

  describe('#resolve() this is to resolve didDocument based on didDocId', function () {
    it('should not able to resolve did document and throw error didDocId is not passed', function () {
      return hypersignDID.resolve({ params: { did: '' } }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a did');
      });
    });
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
    it('should not be able to update did document as privateKeyMultibase is null or empty', function () {
      return hypersignDID
        .update({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
        });
    });
    it('should not be able to update did document as verificationMethodId is null or empty', function () {
      return hypersignDID
        .update({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
        });
    });
    it('should not be able to update did document as versionId is null or empty', function () {
      return hypersignDID
        .update({ didDocument, privateKeyMultibase, verificationMethodId, versionId: '' })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
        });
    });
    it('should not be able to update did document as versionId pased is incorrect', function () {
      const updateBody = { didDocument, privateKeyMultibase, verificationMethodId, versionId: '1.0.1' };
      didDocument['alsoKnownAs'].push('Random Data');
      return hypersignDID.update(updateBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          `Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${updateBody.versionId}: unexpected DID version`
        );
      });
    });
    it('should be able to update did document', async function () {
      didDocument['alsoKnownAs'].push('Some DATA');

      const result = await hypersignDID.update({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
        versionId,
      });

      should().exist(result.code);
      should().exist(result.height);
      should().exist(result.rawLog);
      should().exist(result.transactionHash);
      should().exist(result.gasUsed);
      should().exist(result.gasWanted);
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
      expect(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.not.equal(publicKeyMultibase);
      versionId = result.didDocumentMetadata.versionId;
    });
    // should we able to get same publicKeyMultibase as generated in the begining in didDoc
    it('should be able to resolve did if params.ed25519verificationkey2020 is passed', async function () {
      const params = {
        did: didDocId,
        ed25519verificationkey2020: true,
      };
      const result = await hypersignDID.resolve(params);
      expect(result).to.be.a('object');
      expect(result.didDocument.id).to.be.equal(didDocId);
      expect(result.didDocumentMetadata).to.be.a('object');
      expect(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.equal(publicKeyMultibase);
      versionId = result.didDocumentMetadata.versionId;
    });

    it('should be able to resolve DID even without offline signer passed to the constructor; making resolve RPC offchain activity', async function () {
      const hypersignDID = new HypersignDID();

      const params = {
        did: didDocId,
        ed25519verificationkey2020: true,
      };

      const result = await hypersignDID.resolve(params);

      expect(result).to.be.a('object');
      expect(result.didDocument.id).to.be.equal(didDocId);
      expect(result.didDocumentMetadata).to.be.a('object');
      expect(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.equal(publicKeyMultibase);
    });
  });
  describe('#deactivate() this is to deactivate didDocument based on didDocId', function () {
    it('should not be able to deactivate did document as privateKeyMultibase is null or empty', function () {
      return hypersignDID
        .deactivate({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
        });
    });
    it('should not be able to deactivate did document as verificationMethodId is null or empty', function () {
      return hypersignDID
        .deactivate({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
        .catch(function (err) {
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
    it('should not be able to deactivate did document as versionId pased is incorrect', function () {
      const deactivateBody = { didDocument, privateKeyMultibase, verificationMethodId, versionId: '1.0.1' };

      return hypersignDID.deactivate(deactivateBody).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          `Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: Expected ${didDocId} with version ${versionId}. Got version ${deactivateBody.versionId}: unexpected DID version`
        );
      });
    });
    it('should be able to deactivate did document', async function () {
      const result = await hypersignDID.deactivate({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
        versionId,
      });
      should().exist(result.code);
      should().exist(result.height);
      should().exist(result.rawLog);
      should().exist(result.transactionHash);
      should().exist(result.gasUsed);
      should().exist(result.gasWanted);
    });
  });

  describe('#sign() this is to sign didDoc', function () {
    const publicKey: IPublicKey = {
      '@context': '',
      id: '',
      type: '',
      publicKeyBase58: '',
    };
    const controller: IController = {
      '@context': '',
      id: '',
      authentication: [],
    };

    it('should not able to sign did document and throw error as privateKey is not passed or it is empty', function () {
      const params = {
        privateKeyMultibase: privateKeyMultibase as string,
        challenge: challenge as string,
        domain: domain as string,
        did: didDocId,
        didDocument: didDocument as object,
        verificationMethodId: verificationMethodId as string,
        publicKey,
        controller,
      };
      params.privateKeyMultibase = '';
      return hypersignDID.sign(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKey is required to sign a did');
      });
    });
    it('should not able to sign did document and throw error as challenge is not passed or it is empty', function () {
      const params = {
        privateKeyMultibase: privateKeyMultibase as string,
        challenge: challenge as string,
        domain: domain as string,
        did: didDocId,
        didDocument: didDocument as object,
        verificationMethodId: verificationMethodId as string,
        publicKey,
        controller,
      };
      params.challenge = '';
      return hypersignDID.sign(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.challenge is required to sign a did');
      });
    });
    it('should not able to sign did document and throw error as domain is not passed or it is empty', function () {
      const params = {
        privateKeyMultibase: privateKeyMultibase as string,
        challenge: challenge as string,
        domain: domain as string,
        did: didDocId,
        didDocument: didDocument as object,
        verificationMethodId: verificationMethodId as string,
        publicKey,
        controller,
      };
      params.domain = '';
      return hypersignDID.sign(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.domain is required to sign a did');
      });
    });
    it('should not able to sign did document and throw error as did is not resolved', function () {
      const params = {
        privateKeyMultibase: privateKeyMultibase as string,
        challenge: challenge as string,
        domain: domain as string,
        did: didDocId as string,
        didDocument: didDocument as object,
        verificationMethodId: verificationMethodId as string,
        publicKey,
        controller,
      };
      return hypersignDID.sign(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, `HID-SSI-SDK:: Error: could not resolve did ${params.did}`);
      });
    });
    it('should not able to sign did document and throw error as verificationMethodId is invalid or wrong', function () {
      const params = {
        privateKeyMultibase: privateKeyMultibase as string,
        challenge: challenge as string,
        domain: domain as string,
        did: '',
        didDocument: didDocument as object,
        verificationMethodId: verificationMethodId as string,
        publicKey,
        controller,
      };
      params.verificationMethodId = '';
      return hypersignDID.sign(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: Incorrect verification method id');
      });
    });

    it('should able to sign did document', async function () {
      const params = {
        privateKeyMultibase: privateKeyMultibase as string,
        challenge: challenge as string,
        domain: domain as string,
        did: '', // This is taken as empty as didDoc is yet not register on blockchain and won't able to resolve based on did
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
  describe('#verify() method to verify did document', function () {
    it('should not able to verify did document and throw error as verificationMethodId is not passed or it is empty', function () {
      return hypersignDID
        .verify({ didDocument: signedDocument, verificationMethodId: '', challenge, domain })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to verify a did');
        });
    });
    it('should not able to verify did document and throw error as challenge is not passed or it is empty', function () {
      return hypersignDID
        .verify({ didDocument: signedDocument, verificationMethodId, challenge: '', domain })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.challenge is required to verify a did');
        });
    });

    it('should return verification result', async function () {
      const result = await hypersignDID.verify({
        didDocument: signedDocument,
        verificationMethodId,
        challenge,
        domain,
      });
      expect(result).to.be.a('object');
      should().exist(result);
      should().exist(result.verified);
      should().exist(result.results);
      expect(result.results).to.be.a('array');
      expect(result.verified).to.equal(true);
    });

    it('should not able to verify did document and throw error as unknown verification method id is passed', function () {
      const verMethIdMod = verificationMethodId + 'somerandomtext';
      return hypersignDID
        .verify({ didDocument: signedDocument, verificationMethodId: verMethIdMod, challenge, domain })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(
            Error,
            'HID-SSI-SDK:: Error: could not find verification method for verificationMethodId: ' +
              verMethIdMod +
              ' in did document'
          );
        });
    });

    it('should not able to verify did document and throw error as proof is not present in the signedDID doc', function () {
      const signedDIDDoc = signedDocument;
      delete signedDIDDoc['proof'];
      return hypersignDID
        .verify({ didDocument: signedDIDDoc, verificationMethodId, challenge, domain })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument.proof is not present in the signed did document');
        });
    });
  });

  describe('#createByClientSpec() this is to generate did using clientSpec', function () {
    const param = {
      methodSpecificId: MMWalletAddress,
      address: MMWalletAddress,
      chainId: '0x1',
      clientSpec: 'eth-personalSign',
    };
    it('should not be able to create did using clientSpec as methodSpecificId is null or empty', async () => {
      const tempParams = { ...param };
      tempParams.methodSpecificId = '';
      const params = tempParams;
      return hypersignDID.createByClientSpec(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.methodSpecificId is required to create didoc');
      });
    });
    it('Should not be able to create did using clientSpec as address is null or empty', async () => {
      const tempParams = { ...param };
      tempParams.address = '';
      const params = tempParams;
      return hypersignDID.createByClientSpec(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.address is required to create didoc');
      });
    });
    it('should not be able to create did using clientSpec as chainId is null or empty', async () => {
      const tempParams = { ...param };
      tempParams.chainId = '';
      const params = tempParams;
      return hypersignDID.createByClientSpec(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.chainId is required to create didoc');
      });
    });
    it('should not be able to create did using clientSpec as clientSpec is null or empty', async () => {
      const tempParams = { ...param };
      tempParams.clientSpec = '';
      const params = tempParams;

      return hypersignDID.createByClientSpec(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is required to create didoc');
      });
    });
    it('should not be able to create did using clientSpec as clientSpec passed is invalid', async () => {
      const tempParams = { ...param };
      tempParams.clientSpec = 'xyz';
      const params = tempParams;

      return hypersignDID.createByClientSpec(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is invalid');
      });
    });
    it('should not be able to create did using clientSpec as clientSpec is of type "cosmos-ADR036" but publicKey is not passed ', async () => {
      const tempParams = { ...param };
      tempParams.clientSpec = 'cosmos-ADR036';
      const params = tempParams;

      return hypersignDID.createByClientSpec(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          'HID-SSI-SDK:: Error: params.publicKey is required to create didoc for EcdsaSecp256k1VerificationKey2019'
        );
      });
    });
    it('should not be able to create did using clientSpec as clientSpec is of type "cosmos-ADR036" and invalid public key is passed', async () => {
      const tempParams = { ...param };
      tempParams.clientSpec = 'cosmos-ADR036';
      tempParams['publicKey'] = 'xyzt';
      const params = tempParams;

      return hypersignDID.createByClientSpec(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          'HID-SSI-SDK:: Error: params.publicKey mustbe multibase encoded base58 string for EcdsaSecp256k1VerificationKey2019'
        );
      });
    });
    it('should be able to create did using clientSpec', async () => {
      const tempParams = { ...param };
      const params = tempParams;
      didDocumentByClientspec = await hypersignDID.createByClientSpec(params);
      expect(didDocumentByClientspec).to.be.a('object');
      should().exist(didDocumentByClientspec['@context']);
      should().exist(didDocumentByClientspec['id']);
      should().exist(didDocumentByClientspec['controller']);
      should().exist(didDocumentByClientspec['alsoKnownAs']);
      should().exist(didDocumentByClientspec['verificationMethod']);
      expect(
        didDocumentByClientspec['verificationMethod'] &&
          didDocumentByClientspec['authentication'] &&
          didDocumentByClientspec['assertionMethod'] &&
          didDocumentByClientspec['keyAgreement'] &&
          didDocumentByClientspec['capabilityInvocation'] &&
          didDocumentByClientspec['capabilityDelegation']
      ).to.be.a('array');
      should().exist(didDocumentByClientspec['authentication']);
      should().exist(didDocumentByClientspec['assertionMethod']);
      should().exist(didDocumentByClientspec['keyAgreement']);
      should().exist(didDocumentByClientspec['capabilityInvocation']);
      should().exist(didDocumentByClientspec['capabilityDelegation']);
    });
  });
});
