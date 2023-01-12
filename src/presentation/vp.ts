/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import vc from 'vc-js';
import jsonSigs from 'jsonld-signatures';
import { documentLoader } from 'jsonld';
import HypersignDID from '../did/did';
import { Did, VerificationMethod } from '../generated/ssi/did';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import Utils from '../utils';
import HypersignVerifiableCredential from '../credential/vc';
import { IVerifiableCredential, ICredentialMethods } from '../credential/ICredential';
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
import { VP, DID } from '../constants';
import { IPresentationMethods, IVerifiablePresentation } from './IPresentation';
import { OfflineSigner } from '@cosmjs/proto-signing';

export default class HypersignVerifiablePresentation implements IPresentationMethods, IVerifiablePresentation {
  private hsDid: HypersignDID | null;
  private vc: HypersignVerifiableCredential | null;
  id: string;
  type: Array<string>;
  verifiableCredential: Array<IVerifiableCredential>;
  holder: string;
  proof: object;
  namespace: string;
  constructor(
    params: {
      namespace?: string;
      offlineSigner?: OfflineSigner;
      nodeRpcEndpoint?: string;
      nodeRestEndpoint?: string;
    } = {}
  ) {
    const { namespace, offlineSigner, nodeRpcEndpoint, nodeRestEndpoint } = params;

    this.namespace = namespace && namespace != '' ? namespace : '';
    const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'TEST';
    const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
    if (offlineSigner) {
      const offlineConstuctorParams = { offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp };
      this.vc = new HypersignVerifiableCredential(offlineConstuctorParams);
      this.hsDid = new HypersignDID(offlineConstuctorParams);
    } else {
      this.vc = null;
      this.hsDid = null;
    }

    this.id = '';
    this.type = [];
    this.verifiableCredential = [];
    this.holder = '';
    this.proof = {};
  }

  private async _getId(): Promise<string> {
    const uuid = await Utils.getUUID();
    let id;
    if (this.namespace && this.namespace != '') {
      id = `${VP.SCHEME}:${VP.METHOD}:${this.namespace}:${uuid}`;
    } else {
      id = `${VP.SCHEME}:${VP.METHOD}:${uuid}`;
    }
    return id;
  }

  /**
   * Initialise the offlinesigner to interact with Hypersign blockchain
   */
  public async init() {
    if (!this.vc || !this.hsDid) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }
    await this.vc.init();
    await this.hsDid.init();
  }

  /**
   * Generates a new presentation document
   * @params
   *  - params.verifiableCredentials: Array of Verifiable Credentials
   *  - params.holderDid            : DID of the subject
   * @returns {Promise<object>}
   */
  async generate(params: { verifiableCredentials: Array<IVerifiableCredential>; holderDid: string }): Promise<object> {
    const id = await this._getId();
    const presentation = vc.createPresentation({
      verifiableCredential: params.verifiableCredentials,
      id: id,
      holder: params.holderDid,
    });
    return presentation;
  }

  /**
   * Signs a new presentation document
   * @params
   *  - params.presentation         : Array of Verifiable Credentials
   *  - params.holderDid            : DID of the subject
   *  - params.holderDidDocSigned   : DID of the subject
   *  - params.verificationMethodId : verificationMethodId of holder
   *  - params.privateKey           :
   *  - params.challenge            :
   * @returns {Promise<object>}
   */
  async sign(params: {
    presentation: IVerifiablePresentation;
    holderDid?: string;
    holderDidDocSigned?: JSON;
    verificationMethodId: string;
    privateKey: string;
    challenge: string;
  }): Promise<object> {
    if (params.holderDid && params.holderDidDocSigned) {
      throw new Error('HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
    }
    if (!params.privateKey) {
      throw new Error('HID-SSI-SDK:: params.privateKey is required for signinng a presentation');
    }

    if (!params.presentation) {
      throw new Error('HID-SSI-SDK:: params.presentation is required for signinng a presentation');
    }

    if (!params.challenge) {
      throw new Error('HID-SSI-SDK:: params.challenge is required for signinng a presentation');
    }

    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: params.verificationMethodId is required for signinng a presentation');
    }

    if (!this.hsDid) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    let resolvedDidDoc;
    if (params.holderDid) {
      resolvedDidDoc = await this.hsDid.resolve({ did: params.holderDid });
    } else if (params.holderDidDocSigned) {
      resolvedDidDoc = {};
      resolvedDidDoc.didDocument = params.holderDidDocSigned;
    } else {
      throw new Error(
        'HID-SSI-SDK:: params.holderDid or params.holderDidDocSigned is required for signinng a presentation'
      );
    }
    const { didDocument: signerDidDoc } = resolvedDidDoc;

    // TODO: take verification method from params
    const publicKeyId = params.verificationMethodId; // TODO: bad idea -  should not hardcode it.
    const publicKeyVerMethod: VerificationMethod = signerDidDoc['verificationMethod'].find(
      (x) => x.id == publicKeyId
    ) as VerificationMethod;

    const convertedKeyPair = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
      publicKey: publicKeyVerMethod.publicKeyMultibase,
    });

    publicKeyVerMethod['publicKeyMultibase'] = convertedKeyPair.publicKeyMultibase;

    const keyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: params.privateKey,
      ...publicKeyVerMethod,
    });

    const suite = new Ed25519Signature2020({
      verificationMethod: publicKeyId,
      key: keyPair,
    });

    const signedVP = await vc.signPresentation({
      presentation: params.presentation,
      suite,
      challenge: params.challenge,
      documentLoader,
    });

    return signedVP;
  }

  // https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L392
  /**
   * Verifies signed presentation documen
   * @params
   *  - params.verifiableCredentials: Array of Verifiable Credentials
   *  - params.holderDid            : DID of the subject
   * @returns {Promise<object>}
   */
  async verify(params: {
    signedPresentation: IVerifiablePresentation;
    challenge: string;
    domain?: string;
    issuerDid: string;
    holderDid?: string;
    holderDidDocSigned?: JSON;
    holderVerificationMethodId: string; // verificationMethodId of holder for authentication
    issuerVerificationMethodId: string; // verificationMethodId of issuer for assertion
  }): Promise<object> {
    if (params.holderDid && params.holderDidDocSigned) {
      throw new Error('HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
    }

    if (!params.issuerDid) {
      throw new Error('HID-SSI-SDK:: params.issuerDid is required for verifying a presentation');
    }

    if (!params.challenge) {
      throw new Error('HID-SSI-SDK:: params.challenge is required for verifying a presentation');
    }

    if (!params.holderVerificationMethodId) {
      throw new Error('HID-SSI-SDK:: params.holderVerificationMethodId is required for verifying a presentation');
    }

    if (!params.issuerVerificationMethodId) {
      throw new Error('HID-SSI-SDK:: params.issuerVerificationMethodId is required for verifying a presentation');
    }

    if (!this.vc || !this.hsDid) {
      throw new Error(
        'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
      );
    }

    ///---------------------------------------
    /// Holder
    let resolvedDidDoc;
    if (params.holderDid) {
      resolvedDidDoc = await this.hsDid.resolve({ did: params.holderDid });
    } else if (params.holderDidDocSigned) {
      resolvedDidDoc = {};
      resolvedDidDoc.didDocument = params.holderDidDocSigned;
    } else {
      throw new Error('Either holderDid or holderDidDocSigned should be provided');
    }

    const { didDocument: holderDID } = resolvedDidDoc;

    const holderDidDoc: Did = holderDID as Did;
    const holderPublicKeyId = params.holderVerificationMethodId;

    const holderPublicKeyVerMethod: VerificationMethod = holderDidDoc.verificationMethod.find(
      (x) => x.id == holderPublicKeyId
    ) as VerificationMethod;

    // Connvert the 45 byte pub key of holder into 48 byte
    const { publicKeyMultibase: holderPublicKeyMultibase } = Utils.convertedStableLibKeysIntoEd25519verificationkey2020(
      {
        publicKey: holderPublicKeyVerMethod.publicKeyMultibase,
      }
    );
    holderPublicKeyVerMethod.publicKeyMultibase = holderPublicKeyMultibase;

    const holderController = {
      '@context': DID.CONTROLLER_CONTEXT,
      id: holderDidDoc.id,
      authentication: holderDidDoc.authentication,
    };

    // TODO:  need to use domainname.
    const presentationPurpose = new AuthenticationProofPurpose({
      controller: holderController,
      challenge: params.challenge,
    });

    const keyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: '',
      ...holderPublicKeyVerMethod,
    });

    const vpSuite_holder = new Ed25519Signature2020({
      verificationMethod: holderPublicKeyId,
      key: keyPair,
    });

    ///---------------------------------------
    /// Issuer
    const { didDocument: issuerDID } = await this.hsDid.resolve({ did: params.issuerDid });
    if (issuerDID === null || issuerDID === undefined) {
      throw new Error('Issuer DID is not registered');
    }

    const issuerDidDoc: Did = issuerDID as Did;
    const issuerDidDocController = issuerDidDoc.controller;
    const issuerDidDocControllerVerificationMethod = params.issuerVerificationMethodId.split('#')[0];

    if (!issuerDidDocController.includes(issuerDidDocControllerVerificationMethod)) {
      throw new Error(issuerDidDocControllerVerificationMethod + ' is not a controller of ' + params.issuerDid);
    }

    const issuerPublicKeyId = params.issuerVerificationMethodId;

    let issuerPublicKeyVerMethod: VerificationMethod = issuerDidDoc.verificationMethod.find(
      (x) => x.id == issuerPublicKeyId
    ) as VerificationMethod;

    if (issuerPublicKeyVerMethod === null || issuerPublicKeyVerMethod === undefined) {
      const { didDocument: controllerDidDocT } = await this.hsDid.resolve({
        did: issuerDidDocControllerVerificationMethod,
      });
      const controllerDidDoc: Did = controllerDidDocT as Did;
      issuerPublicKeyVerMethod = controllerDidDoc.verificationMethod.find(
        (x) => x.id == issuerPublicKeyId
      ) as VerificationMethod;
    }
    // Connvert the 45 byte pub key of issuer into 48 byte
    const { publicKeyMultibase: issuerPublicKeyMultibase } = Utils.convertedStableLibKeysIntoEd25519verificationkey2020(
      {
        publicKey: issuerPublicKeyVerMethod.publicKeyMultibase,
      }
    );
    issuerPublicKeyVerMethod.publicKeyMultibase = issuerPublicKeyMultibase;

    const issuerController = {
      '@context': DID.CONTROLLER_CONTEXT,
      id: issuerDidDoc.id,
      assertionMethod: issuerDidDoc.assertionMethod,
    };

    const purpose = new AssertionProofPurpose({
      controller: issuerController,
    });

    const issuerKeyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: '',
      ...issuerPublicKeyVerMethod,
    });

    const vcSuite_issuer = new Ed25519Signature2020({
      verificationMethod: issuerPublicKeyId,
      key: issuerKeyPair,
    });

    /* eslint-disable */
    const that = this;
    /* eslint-enable */
    const result = await vc.verify({
      presentation: params.signedPresentation,
      presentationPurpose,
      purpose,
      suite: [vpSuite_holder, vcSuite_issuer],
      documentLoader,
      unsignedPresentation: true,
      checkStatus: async function (options) {
        if (!that.vc) {
          throw new Error(
            'HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized'
          );
        }
        return await that.vc.checkCredentialStatus({ credentialId: options.credential.id });
      },
    });

    return result;
  }
}
