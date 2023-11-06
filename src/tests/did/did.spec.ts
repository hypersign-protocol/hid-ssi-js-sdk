import { expect, should } from 'chai';
import { HypersignDID, HypersignSSISdk } from '../../index';
import { IPublicKey, IController } from '../../did/IDID';

import { createWallet, mnemonic, hidNodeEp } from '../config';
import { VerificationMethodTypes } from '../../../libs/generated/ssi/client/enums';
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
let pubKey;
let privKey;
let didDocToReg;
let DIdDOcWithMultiplVM;

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
    it('should be able to generate didDocument with different kp', async function () {
      const kp = await hypersignDID.generateKeys();
      privKey = kp.privateKeyMultibase;
      pubKey = kp.publicKeyMultibase;
      didDocToReg = await hypersignDID.generate({ publicKeyMultibase: pubKey });
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
  describe('#addVerificationMethod() to add verificationMethod in didDocument', function () {
    it('should not be able to add verificationMethod as neither did nor didDoc is passed', async () => {
      const params = {
        didDocument: {},
        type: 'X25519KeyAgreementKey2020',
        id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
        publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
      };
      return hypersignDID.addVerificationMethod(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          'HID-SSI_SDK:: Error: params.did or params.didDocument is required to addVerificationMethod'
        );
      });
    });
    it('should not be able to add verificationMethod as type is not passed', async () => {
      const params = {
        didDocument,
        id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
        publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
      };
      return hypersignDID.addVerificationMethod(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.type is required to addVerificationMethod');
      });
    });
    it('should not be able to add verificationMethod as type passed is invalid', async () => {
      const params = {
        didDocument,
        type: 'dsyifx',
        id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
        publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
      };
      return hypersignDID.addVerificationMethod(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.type is invalid');
      });
    });

    it('should not be able to add verificationMethod as params.did is passed but yet not registerd', async () => {
      const params = {
        did: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY',
        type: VerificationMethodTypes.Ed25519VerificationKey2020,
        id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
        publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
      };
      const hypersignDid = new HypersignDID({ namespace: 'testnet' });
      return hypersignDid.addVerificationMethod(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, `HID-SSI-SDK:: Error: could not resolve did ${params.did}`);
      });
    });
    it('should not be able to add verificationMethod in didDocument as type is EcdsaSecp256k1RecoveryMethod2020 but blockchainAccountId is not passed', async () => {
      const params = {
        didDocument,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
        publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
      };
      return hypersignDID.addVerificationMethod(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, `HID-SSI-SDK:: Error: params.blockchainAccountId is required for keyType ${params.type}`);
      });
    });

    it('should not be able to add verificationMethod in didDocument as type is EcdsaSecp256k1RecoveryMethod2020 but params.id is not passed', async () => {
      const params = {
        didDocument,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
        blockchainAccountId: 'eip155:1:23fer44374u3rmhvf47ri35ty',
      };
      return hypersignDID.addVerificationMethod(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, `HID-SSI-SDK:: Error: params.id is required for keyType ${params.type}`);
      });
    });

    it('should not be able to add verificationMethod in didDocument as type is EcdsaSecp256k1VerificationKey2019 but neither params.blockchainAccountId nor params.publicKeyMultibase is passed', async () => {
      const params = {
        didDocument,
        type: 'EcdsaSecp256k1VerificationKey2019',
        id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
      };
      return hypersignDID.addVerificationMethod(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          `HID-SSI-SDK:: Error: params.blockchainAccountId and params.publicKeyMultibase is required for keyType ${params.type}`
        );
      });
    });

    it('should not be able to add verificationMethod in didDocument as type is EcdsaSecp256k1VerificationKey2019 params.publicKeyMultibase is not passed', async () => {
      const params = {
        didDocument,
        type: 'EcdsaSecp256k1VerificationKey2019',
        id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
        blockchainAccountId: 'eip155:1:23fer44374u3rmhvf47ri35ty',
      };
      return hypersignDID.addVerificationMethod(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          `HID-SSI-SDK:: Error: params.blockchainAccountId and params.publicKeyMultibase is required for keyType ${params.type}`
        );
      });
    });

    it('should not be able to add verificationMethod in didDocument as type is EcdsaSecp256k1VerificationKey2019 params.blockchainAccountId is not passed', async () => {
      const params = {
        didDocument,
        type: 'EcdsaSecp256k1VerificationKey2019',
        id: 'did:hid:testnet:z8wo3LVRR4JkEguESX6hf4EBc234refrdan5xVD49quCPV7fBHYdY#key-1',
        blockchainAccountId: 'eip155:1:23fer44374u3rmhvf47ri35ty',
      };
      return hypersignDID.addVerificationMethod(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          `HID-SSI-SDK:: Error: params.blockchainAccountId and params.publicKeyMultibase is required for keyType ${params.type}`
        );
      });
    });

    it('Should not be able to add verification method to didDocument as it is already exists', async () => {
      const params = {
        didDocument: didDocument,
        type: 'X25519KeyAgreementKey2020',
        id: `${didDocument.verificationMethod[0].id}`,
        publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
      };
      return hypersignDID.addVerificationMethod(params).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, `HID-SSI-SDK:: Error: verificationMethod ${params.id} already exists`);
      });
    });

    // it('should be able to add verification method of type X25519KeyAgreementKey2020 in didDocument', async () => {
    //   const params = {
    //     didDocument: didDocument,
    //     type: 'X25519KeyAgreementKey2020',
    //     publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
    //   };
    //   const didDoc = JSON.parse(JSON.stringify(didDocument));
    //   const updatedDidDoc = await hypersignDID.addVerificationMethod({ ...params });
    //   // console.log(didDocument, "add vm ")
    //   expect(updatedDidDoc).to.be.a('object');
    //   should().exist(updatedDidDoc['@context']);
    //   should().exist(updatedDidDoc['id']);
    //   should().exist(updatedDidDoc['controller']);
    //   should().exist(updatedDidDoc['alsoKnownAs']);
    //   should().exist(updatedDidDoc['verificationMethod']);
    //   expect(
    //     updatedDidDoc['verificationMethod'] &&
    //     updatedDidDoc['authentication'] &&
    //     updatedDidDoc['assertionMethod'] &&
    //     updatedDidDoc['keyAgreement'] &&
    //     updatedDidDoc['capabilityInvocation'] &&
    //     updatedDidDoc['capabilityDelegation'] &&
    //     updatedDidDoc['service']
    //   ).to.be.a('array');
    //   should().exist(updatedDidDoc['authentication']);
    //   should().exist(updatedDidDoc['assertionMethod']);
    //   expect(updatedDidDoc.verificationMethod.length).to.be.greaterThan(didDoc.verificationMethod.length);
    // });
    it('should be able to add verification method in didDocument without offlinesigner', async () => {
      const hypersignDid = new HypersignDID({ namespace: 'testnet' });
      const didDoc = JSON.parse(JSON.stringify(didDocument));
      const params = {
        didDocument: didDoc,
        type: VerificationMethodTypes.X25519KeyAgreementKey2020,
        publicKeyMultibase: '23fer44374u3rmhvf47ri35ty',
      };

      const testDidDoc = await hypersignDid.addVerificationMethod(params);
      expect(testDidDoc).to.be.a('object');
      should().exist(testDidDoc['@context']);
      should().exist(testDidDoc['id']);
      should().exist(testDidDoc['controller']);
      should().exist(testDidDoc['alsoKnownAs']);
      should().exist(testDidDoc['verificationMethod']);
      expect(
        testDidDoc['verificationMethod'] &&
        testDidDoc['authentication'] &&
        testDidDoc['assertionMethod'] &&
        testDidDoc['keyAgreement'] &&
        testDidDoc['capabilityInvocation'] &&
        testDidDoc['capabilityDelegation'] &&
        testDidDoc['service']
      ).to.be.a('array');
      should().exist(testDidDoc['authentication']);
      should().exist(testDidDoc['assertionMethod']);
    });
    it('should be able to add verification method in didDocument with key type Ed25519VerificationKey2020', async () => {
      const params = {
        didDocument: didDocToReg,
        type: 'Ed25519VerificationKey2020',
        id: didDocument.verificationMethod[0].id,
        publicKeyMultibase: publicKeyMultibase,
      };
      const didDoc = JSON.parse(JSON.stringify(didDocToReg));

      DIdDOcWithMultiplVM = await hypersignDID.addVerificationMethod(params);
      expect(DIdDOcWithMultiplVM).to.be.a('object');
      should().exist(DIdDOcWithMultiplVM['@context']);
      should().exist(DIdDOcWithMultiplVM['id']);
      should().exist(DIdDOcWithMultiplVM['controller']);
      should().exist(DIdDOcWithMultiplVM['alsoKnownAs']);
      should().exist(DIdDOcWithMultiplVM['verificationMethod']);
      expect(
        DIdDOcWithMultiplVM['verificationMethod'] &&
        DIdDOcWithMultiplVM['authentication'] &&
        DIdDOcWithMultiplVM['assertionMethod'] &&
        DIdDOcWithMultiplVM['keyAgreement'] &&
        DIdDOcWithMultiplVM['capabilityInvocation'] &&
        DIdDOcWithMultiplVM['capabilityDelegation'] &&
        DIdDOcWithMultiplVM['service']
      ).to.be.a('array');
      should().exist(DIdDOcWithMultiplVM['authentication']);
      should().exist(DIdDOcWithMultiplVM['assertionMethod']);
      expect(DIdDOcWithMultiplVM.verificationMethod.length).to.be.greaterThan(didDoc.verificationMethod.length);
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
    it('should not be able to register a did document as neither privateKeyMultibase nor verificationMethodId is passed and signData passed is empty array', async () => {
      return hypersignDID.register({ didDocument, signData: [] }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array');
      });
    });
    it('should not be able to register a did document as verificationMethodId is not passed inside signData', async () => {
      return hypersignDID.register({ didDocument, signData: [{ privateKeyMultibase: privKey }] }).catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(
          Error,
          'HID-SSI-SDK:: Error: params.signData[0].verificationMethodId is required to register a did'
        );
      });
    });
    it('should not be able to register a did document as privateKeyMultibase is not passed inside signData', async () => {
      return hypersignDID
        .register({
          didDocument,
          signData: [
            {
              verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[0].id,
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
      return hypersignDID
        .register({
          didDocument,
          signData: [
            {
              verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[0].id,
              privateKeyMultibase: privKey,
            },
          ],
        })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signData[0].type is required to register a did');
        });
    });
    it('should not be able to register a did Doc of type Ed25519VerificationKey2020 with multiple verification method as one of the privateKeyMultibase is not passed', async () => {
      const signData = [
        {
          verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[0].id,
          privateKeyMultibase: privKey,
          type: 'Ed25519VerificationKey2020',
        },
        {
          verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[1].id,
          type: 'Ed25519VerificationKey2020',
        },
      ];
      return await hypersignDID
        .register({
          didDocument: DIdDOcWithMultiplVM,
          signData,
        })
        .catch(function (err) {
          expect(function () {
            throw err;
          }).to.throw(
            Error,
            `HID-SSI-SDK:: Error: params.signData[1].privateKeyMultibase is required to register a did`
          );
        });
    });
    // it('should not able to register did document and throw error as hypersign is neither init by offlinesigner nor entityApiKey', async () => {
    //   const hypersign = new HypersignDID();
    //   await hypersign.init();
    //   return hypersign.register({ didDocument, privateKeyMultibase, verificationMethodId })
    //     .catch(function (err) {
    //       console.log(err);
    //       expect(function () {
    //         throw err;
    //       }).to.throw(Error, "HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner");
    //     });
    // });
    it('should be able to register didDocument without signData field in the blockchain', async function () {
      const result = await hypersignDID.register({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
        // or we could pass only signData and didDoc
        // signData: [
        //   { privateKeyMultibase, verificationMethodId, type: 'Ed25519VerificationKey2020' },
        //   {
        //     privateKeyMultibase: 'xyztrtjvnb',
        //     type: 'X25519KeyAgreementKey2020',
        //     verificationMethodId: didDocument.verificationMethod[1].id,
        //   },
        // ],
      });
      transactionHash = result.transactionHash;
      should().exist(result.transactionHash);
    });
    it('should be able to register a did Doc of type Ed25519VerificationKey2020 with multiple verification method', async () => {
      const registerdDidDoc = await hypersignDID.register({
        didDocument: DIdDOcWithMultiplVM,
        signData: [
          {
            verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[0].id,
            privateKeyMultibase: privKey,
            type: 'Ed25519VerificationKey2020',
          },
          {
            verificationMethodId: DIdDOcWithMultiplVM.verificationMethod[1].id,
            privateKeyMultibase,
            type: 'Ed25519VerificationKey2020',
          },
        ],
      });
      should().exist(registerdDidDoc.transactionHash);
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
    it('should not be able to update did document as versionId passed is incorrect', function () {
      const updateBody = { didDocument, privateKeyMultibase, verificationMethodId, versionId: '1.0.1' };
      const didDoc = JSON.parse(JSON.stringify(didDocument))
      updateBody['didDocument'] = didDoc
      updateBody['didDocument']['alsoKnownAs'].push('Random Data');
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
      // expect(result.didDocument.verificationMethod[0].publicKeyMultibase).to.be.equal(publicKeyMultibase);
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
      const didDoc = JSON.parse(JSON.stringify(didDocument))
      const deactivateBody = { didDocument: didDoc, privateKeyMultibase, verificationMethodId, versionId: '1.0.1' };
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
});
