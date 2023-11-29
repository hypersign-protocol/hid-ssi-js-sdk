/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */

import vc from 'vc-js';
import jsonSigs from 'jsonld-signatures';
import HypersignDID from '../did/did';
import { DidDocument as Did, VerificationMethod } from '../../libs/generated/ssi/did';

import Utils from '../utils';
import HypersignVerifiableCredential from '../credential/vc';
import { IVerifiableCredential } from '../credential/ICredential';
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
import { VP, DID } from '../constants';
import { IPresentationMethods, IVerifiablePresentation } from './IPresentation';
import customLoader from '../../libs/w3cache/v1';
import { BabyJubJubKeys2021 } from '@hypersign-protocol/babyjubjub2021';
import {
  BabyJubJubSignature2021Suite,
  BabyJubJubSignatureProof2021,
} from '@hypersign-protocol/babyjubjubsignature2021';

const documentLoader = jsonSigs.extendContextLoader(customLoader);

export default class HyperSignBJJVP implements IPresentationMethods, IVerifiablePresentation {
  private hsDid: HypersignDID;
  private vc: HypersignVerifiableCredential;
  id: string;
  type: Array<string>;
  verifiableCredential: Array<IVerifiableCredential>;
  holder: string;
  proof: object;
  namespace: string;
  constructor(
    params: {
      namespace?: string;
      nodeRpcEndpoint?: string;
      nodeRestEndpoint?: string;
    } = {}
  ) {
    const { namespace, nodeRpcEndpoint, nodeRestEndpoint } = params;

    this.namespace = namespace && namespace != '' ? namespace : '';
    const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
    const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
    const offlineConstuctorParams = { nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp };

    this.vc = new HypersignVerifiableCredential(offlineConstuctorParams);
    this.hsDid = new HypersignDID(offlineConstuctorParams);

    this.id = '';
    this.type = [];
    this.verifiableCredential = [];
    this.holder = '';
    this.proof = {};
  }
  signByClientSpec(params: {
    presentation: IVerifiablePresentation;
    holderDid?: string | undefined;
    verificationMethodId: string;
    web3Obj: any;
    domain?: string | undefined;
    challenge?: string | undefined;
  }): Promise<IVerifiablePresentation> {
    throw new Error('Method not implemented.');
  }
  verifyByClientSpec(params: {
    signedPresentation: IVerifiablePresentation;
    challenge?: string | undefined;
    domain?: string | undefined;
    issuerDid: string;
    holderDid?: string | undefined;
    holderDidDocSigned?: JSON | undefined;
    holderVerificationMethodId: string;
    issuerVerificationMethodId: string;
    web3Obj: any;
  }): Promise<{ verified: boolean; credentialResults: any; presentationResult: any; error: any }> {
    throw new Error('Method not implemented.');
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
   *  - params.holderDid            : *Optional* DID of the subject
   *  - params.holderDidDocSigned   : *Optional* DID Doc of the subject
   *  - params.verificationMethodId : verificationMethodId of holder
   *  - params.privateKeyMultibase  : Private key associated with the verification method
   *  - params.challenge            : Any random challenge
   * @returns {Promise<IVerifiablePresentation>}
   */
  async sign(params: {
    presentation: IVerifiablePresentation;
    holderDid?: string;
    holderDidDocSigned?: JSON;
    verificationMethodId: string;
    privateKeyMultibase: string;
    challenge: string;
    domain?: string;
  }): Promise<IVerifiablePresentation> {
    if (params.holderDid && params.holderDidDocSigned) {
      throw new Error('HID-SSI-SDK:: Either holderDid or holderDidDocSigned should be provided');
    }
    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: params.privateKeyMultibase is required for signing a presentation');
    }

    if (!params.presentation) {
      throw new Error('HID-SSI-SDK:: params.presentation is required for signing a presentation');
    }

    if (!params.challenge) {
      throw new Error('HID-SSI-SDK:: params.challenge is required for signing a presentation');
    }

    if (!params.verificationMethodId) {
      throw new Error('HID-SSI-SDK:: params.verificationMethodId is required for signing a presentation');
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
        'HID-SSI-SDK:: params.holderDid or params.holderDidDocSigned is required for signing a presentation'
      );
    }
    const { didDocument: signerDidDoc } = resolvedDidDoc;

    // TODO: take verification method from params
    const publicKeyId = params.verificationMethodId; // TODO: bad idea -  should not hardcode it.
    const publicKeyVerMethod: VerificationMethod = signerDidDoc['verificationMethod'].find(
      (x) => x.id == publicKeyId
    ) as VerificationMethod;

    const keyPair = await BabyJubJubKeys2021.fromKeys({
      privateKeyMultibase: params.privateKeyMultibase,
      publicKeyMultibase: publicKeyVerMethod.publicKeyMultibase as string,
      options: {
        id: publicKeyVerMethod.id,
        controller: publicKeyVerMethod.controller,
      },
    });

    const suite = new BabyJubJubSignature2021Suite({
      verificationMethod: publicKeyId,
      key: keyPair,
    });
    params.presentation['@context'].push(
      'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BJJSignature2021.jsonld'
    );
    const signedVP = await jsonSigs.sign(params.presentation, {
      suite,
      purpose: new AuthenticationProofPurpose({
        controller: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: publicKeyId,
          authentication: [publicKeyId],
        },
        domain: params.domain,
        challenge: params.challenge,
      }),

      documentLoader,
    });

    return signedVP;
  }

  // https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L392
  /**
   * Verifies signed presentation document
   * @params
   *  - params.signedPresentation         : Signed presentation document
   *  - params.holderDid                  : DID of the subject
   *  - params.holderDidDocSigned         : DIDdocument of the subject
   *  - params.holderVerificationMethodId : verificationMethodId of holder
   *  - params.issuerDid                  : DID of the issuer
   *  - params.issuerVerificationMethodId : verificationMethodId of issuer
   *  - params.domain                     : Optional domain
   *  - params.challenge                  : Random challenge
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
    /* eslint-disable */
    const that = this;
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

    if (!params.signedPresentation.proof) {
      throw new Error('HID-SSI-SDK:: params.signedPresentation must be signed');
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
    const credentialResult = Array<any>();

    const verifiableCredential = params.signedPresentation.verifiableCredential;
    for (let i = 0; i < verifiableCredential.length; i++) {
      if (verifiableCredential[i].proof?.type === 'BabyJubJubSignatureProof2021') {
        const res = await this.hsDid.resolve({ did: verifiableCredential[i].issuer });

        const didDocument = res.didDocument;
        const vm = didDocument.verificationMethod.find((x) => x.id == params.issuerVerificationMethodId);

        const credentailRes = await that.verifyProof(verifiableCredential, {
          suite: new BabyJubJubSignatureProof2021({
            key: await BabyJubJubKeys2021.fromKeys({
              publicKeyMultibase: vm?.publicKeyMultibase as string,
              options: {
                id: vm?.id,
                controller: vm?.controller,
              },
            }),
          }),
        });
        credentialResult.push(credentailRes);
      } else {
        const credentailRes = await that.vc.bjjVC.verify({
          credential: verifiableCredential[i],
          issuerDid: verifiableCredential[i].issuer,
          verificationMethodId: verifiableCredential[i].proof?.verificationMethod as string,
        });
        credentialResult.push(credentailRes);
      }
    }

    const { didDocument: holderDID } = resolvedDidDoc;

    const holderDidDoc: Did = holderDID as Did;
    const holderPublicKeyId = params.holderVerificationMethodId;

    const holderPublicKeyVerMethod: VerificationMethod = (holderDidDoc.verificationMethod as VerificationMethod[]).find(
      (x) => x.id == holderPublicKeyId
    ) as VerificationMethod;

    const holderController = {
      '@context': DID.CONTROLLER_CONTEXT,
      id: holderDidDoc.id,
      authentication: holderDidDoc.authentication,
    };

    // TODO:  need to use domainname.
    const presentationPurpose = new AuthenticationProofPurpose({
      controller: holderController,

      domain: params.domain,
      challenge: params.challenge,
    });

    const keyPair = await BabyJubJubKeys2021.fromKeys({
      publicKeyMultibase: holderPublicKeyVerMethod.publicKeyMultibase as string,
      options: {
        id: holderPublicKeyVerMethod.id,
        controller: holderPublicKeyVerMethod.controller,
      },
    });

    const vpSuite_holder = new BabyJubJubSignature2021Suite({
      verificationMethod: holderPublicKeyId,
      key: keyPair,
    });

    /* eslint-enable */
    const result = await jsonSigs.verify(params.signedPresentation, {
      purpose: presentationPurpose,
      suite: vpSuite_holder,
      documentLoader,
      //   checkStatus: async function (options) {
      //     return await that.vc.checkCredentialStatus({ credentialId: options.credential.id });
      //   },
    });
    result.results.push({ credentialResult });
    return result;
  }

  async verifyProof(
    derivedProofs,
    params: {
      suite: BabyJubJubSignatureProof2021;
    }
  ) {
    const id = derivedProofs.proof.verificationMethod;

    const result = await jsonSigs.verify(derivedProofs, {
      suite: params.suite,
      purpose: new AssertionProofPurpose({
        controller: {
          '@context': ['https://www.w3.org/ns/did/v1'],
          id,
          assertionMethod: [id],
        },
      }),
      documentLoader,
    });
    return result;
  }
}
