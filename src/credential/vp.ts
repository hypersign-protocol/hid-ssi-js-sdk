import vc from "vc-js";
import { Ed25519KeyPair } from "crypto-ld";
import jsonSigs from "jsonld-signatures";
import { documentLoader } from "jsonld";
import { v4 as uuidv4 } from "uuid";

import HypersignSchema from "../schema/schema";
import { Schema, SchemaProperty } from "../generated/ssi/schema";
import HypersignDID from "../did";
import { Did, VerificationMethod } from "../generated/ssi/did";
import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";

const { encode, decode } = require("base58-universal");

const MULTICODEC_ED25519_PUB_HEADER = new Uint8Array([0xed, 0x01]);
// multicodec ed25519-priv header as varint
const MULTICODEC_ED25519_PRIV_HEADER = new Uint8Array([0x80, 0x26]);

const VC_PREFIX = "vc_";
const VP_PREFIX = "vp_";
const { Ed25519Signature2018 } = jsonSigs.suites;
const { AuthenticationProofPurpose, AssertionProofPurpose } = jsonSigs.purposes;

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
  getPresentation(verifiableCredential, holderDid): Promise<any>;
  signPresentation(
    presentation,
    holderDid,
    privateKey,
    challenge
  ): Promise<any>;
  verifyPresentation({
    signedPresentation,
    challenge,
    domain,
    issuerDid,
    holderDid,
  }): Promise<any>;
}

export default class HypersignVerifiablePresentation
  implements IPresentationMethods, IVerifiablePresentation
{
  private hsSchema: HypersignSchema;
  private hsDid: HypersignDID;

  id: string;
  type: Array<string>;
  verifiableCredential: Array<IVerifiableCredential>;
  holder: string;
  proof: Object;
  constructor() {
    this.hsSchema = new HypersignSchema();
    this.hsDid = new HypersignDID();

    this.id = "";
    this.type = [];
    this.verifiableCredential = [];
    this.holder = "";
    this.proof = "";
  }

  private getId = (type) => {
    const id = uuidv4();
    return type
      ? type === "VC"
        ? VC_PREFIX + id
        : type === "VP"
        ? VP_PREFIX + id
        : id
      : id;
  };

  async getPresentation(params: {
    verifiableCredential: IVerifiableCredential;
    holderDid: string;
  }): Promise<any> {
    const id = this.getId("VP");
    const presentation = vc.createPresentation({
      verifiableCredential: params.verifiableCredential,
      id: id,
      holder: params.holderDid,
    });
    return presentation;
  }

  private convertedStableLibKeysIntoEd25519verificationkey2020(stableLibKp: {
    privKey: Uint8Array;
    publicKeyMultibase: string;
  }) {
    // const stableLibKp = generateStableLibKeys();
    // console.log(stableLibKp)

    const stableLibPubKeyWithoutZ = stableLibKp.publicKeyMultibase.substr(1);
    const stableLibPubKeyWithoutZDecode = decode(stableLibPubKeyWithoutZ);
    const publicKeyMultibase = this._encodeMbKey(
      MULTICODEC_ED25519_PUB_HEADER,
      stableLibPubKeyWithoutZDecode
    );

    const privateKeyMultibase = this._encodeMbKey(
      MULTICODEC_ED25519_PRIV_HEADER,
      stableLibKp.privKey
    );

    return {
      publicKeyMultibase,
      privateKeyMultibase,
    };
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
      params.holderDid
    );

    let publicKeyId = signerDidDoc["assertionMethod"][0]; // TODO: bad idea -  should not hardcode it.
    let publicKeyVerMethod = signerDidDoc["verificationMethod"].find(
      (x) => x.id == publicKeyId
    );

    const Uint8ArrayPrivKey = new Uint8Array(
      Buffer.from(params.privateKey, "base64")
    );

    const convertedKeyPair =
      this.convertedStableLibKeysIntoEd25519verificationkey2020({
        privKey: Uint8ArrayPrivKey,
        publicKeyMultibase: publicKeyVerMethod.publicKeyMultibase,
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


  private _encodeMbKey(header, key) {
    const mbKey = new Uint8Array(header.length + key.length);

    mbKey.set(header);
    mbKey.set(key, header.length);

    return "z" + encode(mbKey);
  }
  
  // https://github.com/digitalbazaar/vc-js/blob/44ca660f62ad3569f338eaaaecb11a7b09949bd2/lib/vc.js#L392
  async verifyPresentation(params: {
    signedPresentation: IVerifiablePresentation ,
    challenge: string,
    domain?: string,
    issuerDid: string,
    holderDid: string,
  }): Promise<any> {
    
    
    ///---------------------------------------
    /// Holder
    const { didDocument: holderDID } = await this.hsDid.resolve(
      params.holderDid
    );

    const holderDidDoc: Did = holderDID as Did;
    const holderPublicKeyId = holderDidDoc.authentication[0];

    let holderPublicKeyVerMethod: VerificationMethod =
      holderDidDoc.verificationMethod.find(
        (x) => x.id == holderPublicKeyId
      ) as VerificationMethod;

    const holderStableLibPubKeyWithoutZ =
      holderPublicKeyVerMethod.publicKeyMultibase.substr(1);
    const holderStableLibPubKeyWithoutZDecode = decode(holderStableLibPubKeyWithoutZ);
    const holderPublicKeyMultibase = this._encodeMbKey(
      MULTICODEC_ED25519_PUB_HEADER,
      holderStableLibPubKeyWithoutZDecode
    );
    holderPublicKeyVerMethod.publicKeyMultibase = holderPublicKeyMultibase;

    const holderController = {
      "@context": "https://w3id.org/security/v2",
      id: holderDidDoc.id,
      authentication: holderDidDoc.authentication,
    };

    console.log(holderController)

    const presentationPurpose = new AuthenticationProofPurpose({
      controller: holderController,
      challenge: params.challenge,
    });
    // domain: params.domain,
// 

console.log(presentationPurpose)
    const keyPair = await Ed25519VerificationKey2020.from({
      privateKeyMultibase: "",
      ...holderPublicKeyVerMethod,
    });


    const vpSuite_holder = new Ed25519Signature2020({
      verificationMethod: holderPublicKeyId,
      key: keyPair,
    });

//    console.log(vpSuite_holder)

    ///---------------------------------------
    /// Issuer
    const { didDocument: issuerDID } = await this.hsDid.resolve(
      params.issuerDid
    );

    const issuerDidDoc: Did = issuerDID as Did;
    const issuerPublicKeyId = issuerDidDoc.assertionMethod[0];

    let issuerPublicKeyVerMethod: VerificationMethod =
      issuerDidDoc.verificationMethod.find(
        (x) => x.id == issuerPublicKeyId
      ) as VerificationMethod;

    const issuerStableLibPubKeyWithoutZ =
      issuerPublicKeyVerMethod.publicKeyMultibase.substr(1);
    const issuerStableLibPubKeyWithoutZDecode = decode(issuerStableLibPubKeyWithoutZ);
    const issuerPublicKeyMultibase = this._encodeMbKey(
      MULTICODEC_ED25519_PUB_HEADER,
      issuerStableLibPubKeyWithoutZDecode
    );
    issuerPublicKeyVerMethod.publicKeyMultibase = issuerPublicKeyMultibase;

    const issuerController = {
      "@context": "https://w3id.org/security/v2",
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


    // console.log(vcSuite_issuer)
    ///---------------------------------------

    // const result = await vc.verify({
    //   presentation: params.signedPresentation,
    //   purpose,
    //   suite: [vcSuite_issuer, vpSuite_holder],
    //   documentLoader,
    // });

    const result = await vc.verify({
            presentation:  params.signedPresentation,
            presentationPurpose,
            purpose,
            suite:[vpSuite_holder, vcSuite_issuer],
            documentLoader
            
        })


        
        // const result = await vc.verify({
        //     challenge: para,
        //     suite,
        //     documentLoader,
        //     presentation
        // });
    //console.log(JSON.stringify(result))
    return result;
  }
}
