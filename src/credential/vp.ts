import vc from 'vc-js';
import jsonSigs from 'jsonld-signatures';
import { documentLoader } from 'jsonld';
import HypersignDID from '../did/did';
import { Did, VerificationMethod } from '../generated/ssi/did';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import Utils from '../utils';
import HypersignVerifiableCredential from './vc';
import { ICredentialMethods } from './ICredential';
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
import { VP, DID } from '../constants';

interface ISchema {
  id: string;
  type: string;
}

// https://www.w3.org/TR/vc-data-model/#basic-concepts
interface IVerifiableCredential {
  '@context': Array<string>;
  id: string;
  type: Array<string>;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: object;
  credentialSchema: ISchema;
  proof: object;
}

// https://www.w3.org/TR/vc-data-model/#presentations-0
interface IVerifiablePresentation {
  id: string;
  type: Array<string>;
  verifiableCredential: Array<IVerifiableCredential>;
  holder: string;
  proof: object;
}

export interface IPresentationMethods {
  getPresentation(params: { verifiableCredentials: Array<IVerifiableCredential>; holderDid: string }): Promise<object>;
  signPresentation(params: {
    presentation: IVerifiablePresentation;
    holderDid: string;
    privateKey: string;
    challenge: string;
  }): Promise<object>;
  verifyPresentation(params: {
    signedPresentation: IVerifiablePresentation;
    challenge: string;
    domain?: string;
    issuerDid: string;
    holderDid: string;
  }): Promise<object>;
}

export default class HypersignVerifiablePresentation implements IPresentationMethods, IVerifiablePresentation {
  private hsDid: HypersignDID;

  id: string;
  vc: ICredentialMethods;
  type: Array<string>;
  verifiableCredential: Array<IVerifiableCredential>;
  holder: string;
  proof: object;
  namespace: string;
  constructor(namespace?: string) {
    this.hsDid = new HypersignDID();
    this.vc = new HypersignVerifiableCredential();
    this.namespace = namespace && namespace != '' ? namespace : '';

    this.id = '';
    this.type = [];
    this.verifiableCredential = [];
    this.holder = '';
    this.proof = {};
  }

  private async getId(): Promise<string> {
    const uuid = await Utils.getUUID();
    let id;
    if (this.namespace && this.namespace != '') {
      id = `${VP.SCHEME}:${VP.METHOD}:${this.namespace}:${uuid}`;
    } else {
      id = `${VP.SCHEME}:${VP.METHOD}:${uuid}`;
    }
    return id;
  }

  async getPresentation(params: {
    verifiableCredentials: Array<IVerifiableCredential>;
    holderDid: string;
  }): Promise<object> {    
    const id = await this.getId();
    const presentation = vc.createPresentation({
      verifiableCredential: params.verifiableCredentials,
      id: id,
      holder: params.holderDid,
    });
    return presentation;
  }

  async signPresentation(params: {
    presentation: IVerifiablePresentation;
    holderDid: string;
    privateKey: string;
    challenge: string;
  }): Promise<object> {
    if (!params.holderDid) {
      throw new Error('params.holderDid is required for signinng a presentation');
    }

    if (!params.privateKey) {
      throw new Error('params.privateKey is required for signinng a presentation');
    }

    if (!params.presentation) {
      throw new Error('params.presentation is required for signinng a presentation');
    }

    if (!params.challenge) {
      throw new Error('params.challenge is required for signinng a presentation');
    }

    const { didDocument: signerDidDoc } = await this.hsDid.resolve({ did: params.holderDid });

    const publicKeyId = signerDidDoc['assertionMethod'][0]; // TODO: bad idea -  should not hardcode it.
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
  async verifyPresentation(params: {
    signedPresentation: IVerifiablePresentation;
    challenge: string;
    domain?: string;
    issuerDid: string;
    holderDid: string;
  }): Promise<object> {
    if (!params.holderDid) {
      throw new Error('params.signedPresentation is required for verifying a presentation');
    }

    if (!params.issuerDid) {
      throw new Error('params.issuerDid is required for verifying a presentation');
    }

    if (!params.holderDid) {
      throw new Error('params.holderDid is required for verifying a presentation');
    }

    if (!params.challenge) {
      throw new Error('params.challenge is required for verifying a presentation');
    }

    ///---------------------------------------
    /// Holder
    const { didDocument: holderDID } = await this.hsDid.resolve({ did: params.holderDid });

    const holderDidDoc: Did = holderDID as Did;
    const holderPublicKeyId = holderDidDoc.authentication[0];

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

    const issuerDidDoc: Did = issuerDID as Did;
    const issuerPublicKeyId = issuerDidDoc.assertionMethod[0];

    const issuerPublicKeyVerMethod: VerificationMethod = issuerDidDoc.verificationMethod.find(
      (x) => x.id == issuerPublicKeyId
    ) as VerificationMethod;

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
        return await that.vc.checkCredentialStatus(options.credential.id);
      },
    });

    return result;
  }
}
