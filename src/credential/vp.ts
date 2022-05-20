import vc from "vc-js";
import jsonSigs from "jsonld-signatures";
import { documentLoader } from "jsonld";
import { v4 as uuidv4 } from "uuid";
import HypersignDID from "../did/did";
import { Did, VerificationMethod } from "../generated/ssi/did";
import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import Utils from '../utils';
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;
import { VP, DID } from '../constants';


interface ISchema {
  id: string;
  type: string;
}

// https://www.w3.org/TR/vc-data-model/#basic-concepts
interface IVerifiableCredential {
  "@context": Array<string>;
  id: string;
  type: Array<string>;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: Object;
  credentialSchema: ISchema;
  proof: Object;
}

// https://www.w3.org/TR/vc-data-model/#presentations-0
interface IVerifiablePresentation {
  id: string;
  type: Array<string>;
  verifiableCredential: Array<IVerifiableCredential>;
  holder: string;
  proof: Object;
}

export interface IPresentationMethods {
  getPresentation(params: {
    verifiableCredential: IVerifiableCredential;
    holderDid: string;
  }): Promise<any>;
  signPresentation(params: {
    presentation: IVerifiablePresentation;
    holderDid: string;
    privateKey: string;
    challenge: string;
  }): Promise<any>;
  verifyPresentation(params: {
    signedPresentation: IVerifiablePresentation ,
    challenge: string,
    domain?: string,
    issuerDid: string,
    holderDid: string,
  }): Promise<any>;
}

export default class HypersignVerifiablePresentation
  implements IPresentationMethods, IVerifiablePresentation
{
  private hsDid: HypersignDID;

  id: string;
  type: Array<string>;
  verifiableCredential: Array<IVerifiableCredential>;
  holder: string;
  proof: Object;
  constructor() {
    this.hsDid = new HypersignDID();

    this.id = "";
    this.type = [];
    this.verifiableCredential = [];
    this.holder = "";
    this.proof = "";
  }

  private getId = () => {
    return VP.PREFIX + uuidv4()
  };

  async getPresentation(params: {
    verifiableCredential: IVerifiableCredential;
    holderDid: string;
  }): Promise<any> {
    const id = this.getId();
    const presentation = vc.createPresentation({
      verifiableCredential: params.verifiableCredential,
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
  }): Promise<any> {
    if (!params.holderDid) {
      throw new Error(
        "params.holderDid is required for signinng a presentation"
      );
    }

    if (!params.privateKey) {
      throw new Error(
        "params.holderDid is required for signinng a presentation"
      );
    }

    if (!params.presentation) {
      throw new Error(
        "params.presentation is required for signinng a presentation"
      );
    }

    if (!params.challenge) {
      throw new Error(
        "params.challenge is required for signinng a presentation"
      );
    }

    let { didDocument: signerDidDoc } = await this.hsDid.resolve(
      { did: params.holderDid}
    );

    let publicKeyId = signerDidDoc["assertionMethod"][0]; // TODO: bad idea -  should not hardcode it.
    let publicKeyVerMethod = signerDidDoc["verificationMethod"].find(
      (x) => x.id == publicKeyId
    );

    const Uint8ArrayPrivKey = new Uint8Array(
      Buffer.from(params.privateKey, "base64")
    );

    const convertedKeyPair =
      Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
        privKey: Uint8ArrayPrivKey,
        publicKey: publicKeyVerMethod.publicKeyMultibase,
      });

    publicKeyVerMethod["publicKeyMultibase"] =
      convertedKeyPair.publicKeyMultibase;


    const keyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: convertedKeyPair.privateKeyMultibase,
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
    signedPresentation: IVerifiablePresentation ,
    challenge: string,
    domain?: string,
    issuerDid: string,
    holderDid: string,
  }): Promise<any> {
    
     if (!params.holderDid) {
      throw new Error(
        "params.signedPresentation is required for verifying a presentation"
      );
    }

    if (!params.issuerDid) {
      throw new Error(
        "params.issuerDid is required for verifying a presentation"
      );
    }

    if (!params.holderDid) {
      throw new Error(
        "params.holderDid is required for verifying a presentation"
      );
    }

    if (!params.challenge) {
      throw new Error(
        "params.challenge is required for verifying a presentation"
      );
    }

    ///---------------------------------------
    /// Holder
    const { didDocument: holderDID } = await this.hsDid.resolve(
      {did: params.holderDid}
    );

    const holderDidDoc: Did = holderDID as Did;
    const holderPublicKeyId = holderDidDoc.authentication[0];

    let holderPublicKeyVerMethod: VerificationMethod =
      holderDidDoc.verificationMethod.find(
        (x) => x.id == holderPublicKeyId
      ) as VerificationMethod;

    // Connvert the 45 byte pub key of holder into 48 byte 
    const { publicKeyMultibase: holderPublicKeyMultibase } =Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
      publicKey: holderPublicKeyVerMethod.publicKeyMultibase
    })
    holderPublicKeyVerMethod.publicKeyMultibase = holderPublicKeyMultibase;

    const holderController = {
      "@context": DID.CONTROLLER_CONTEXT,
      id: holderDidDoc.id,
      authentication: holderDidDoc.authentication,
    };


    // TODO:  need to use domainname.
    const presentationPurpose = new AuthenticationProofPurpose({
      controller: holderController,
      challenge: params.challenge,
    });

    const keyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: "",
      ...holderPublicKeyVerMethod,
    });

    const vpSuite_holder = new Ed25519Signature2020({
      verificationMethod: holderPublicKeyId,
      key: keyPair,
    });


    ///---------------------------------------
    /// Issuer
    const { didDocument: issuerDID } = await this.hsDid.resolve(
      {did: params.issuerDid}
    );

    const issuerDidDoc: Did = issuerDID as Did;
    const issuerPublicKeyId = issuerDidDoc.assertionMethod[0];

    let issuerPublicKeyVerMethod: VerificationMethod =
      issuerDidDoc.verificationMethod.find(
        (x) => x.id == issuerPublicKeyId
      ) as VerificationMethod;


    // Connvert the 45 byte pub key of issuer into 48 byte 
    const { publicKeyMultibase:  issuerPublicKeyMultibase} = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
      publicKey: issuerPublicKeyVerMethod.publicKeyMultibase
    })
    issuerPublicKeyVerMethod.publicKeyMultibase = issuerPublicKeyMultibase;

    const issuerController = {
      "@context": DID.CONTROLLER_CONTEXT,
      id: issuerDidDoc.id,
      assertionMethod: issuerDidDoc.assertionMethod,
    };

    const purpose = new AssertionProofPurpose({
      controller: issuerController,
    });

    const issuerKeyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: "",
      ...issuerPublicKeyVerMethod,
    });

    const vcSuite_issuer = new Ed25519Signature2020({
      verificationMethod: issuerPublicKeyId,
      key: issuerKeyPair,
    });

    const result = await vc.verify({
            presentation:  params.signedPresentation,
            presentationPurpose,
            purpose,
            suite:[vpSuite_holder, vcSuite_issuer],
            documentLoader
            
    })

    return result;
  }
}
