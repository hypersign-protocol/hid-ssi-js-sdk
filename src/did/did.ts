import * as constant from '../constants';

import vc from 'vc-js';
import * as jsonld from 'jsonld';
import { v4 as uuidv4 } from 'uuid';
import jsonSigs from 'jsonld-signatures';
import { documentLoader } from 'jsonld';
const { AuthenticationProofPurpose, ProofPurpose } = jsonSigs.purposes;
import { DIDRpc } from './didRPC';
import Utils from '../utils';
const ed25519 = require('@stablelib/ed25519');
import { Did, VerificationMethod, Service } from '../generated/ssi/did';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import { IParams, IDID, IDIDResolve, IDIDRpc } from './IDID';
import { Signer } from 'crypto';
import { constants } from 'buffer';

class DID implements Did {
  context: string[];
  id: string;
  controller: string[];
  alsoKnownAs: string[];
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement: string[];
  capabilityInvocation: string[];
  capabilityDelegation: string[];
  namespace: string;
  service: Service[];
  constructor(publicKey: string, methodSpecificId: string, namespace?: string) {
    this.context = [constant.DID.DID_BASE_CONTEXT];
    this.namespace = namespace && namespace != '' ? namespace : '';
    this.id = this.getId(methodSpecificId);
    this.controller = [this.id];
    this.alsoKnownAs = [this.id];
    const verificationMethod: VerificationMethod = {
      id: this.id + '#key-1',
      type: constant.DID.VERIFICATION_METHOD_TYPE,
      controller: this.id,
      publicKeyMultibase: publicKey,
    };
    this.verificationMethod = [verificationMethod];
    this.authentication = [verificationMethod.id];
    this.assertionMethod = [verificationMethod.id];
    this.keyAgreement = [verificationMethod.id];
    this.capabilityInvocation = [verificationMethod.id];
    this.capabilityDelegation = [verificationMethod.id];
    // TODO: we should take services object in consntructor
    this.service = [];
  }

  public getDidString(): string {
    return JSON.stringify(this);
  }

  private getId = (methodSpecificId) => {
    let did = '';
    did =
      this.namespace && this.namespace != ''
        ? `${constant.DID.SCHEME}:${constant.DID.METHOD}:${this.namespace}:${methodSpecificId}`
        : `${constant.DID.SCHEME}:${constant.DID.METHOD}:${methodSpecificId}`;
    return did;
  };

  // {
  //   const edKeyPair = await Ed25519VerificationKey2020.generate();
  //   const exportedKp = await edKeyPair.export({ publicKey: true });
  //   return;
  // };
}

export default class HypersignDID implements IDID {
  private didrpc: IDIDRpc;
  public namespace: string;
  constructor(namespace?: string) {
    this.didrpc = new DIDRpc();
    this.namespace = namespace ? namespace : '';
  }

  // Sign the doc
  private async sign(params: { didDocString: string; privateKeyMultibase: string }): Promise<string> {
    const { privateKeyMultibase: privateKeyMultibaseConverted } =
      Utils.convertEd25519verificationkey2020toStableLibKeysInto({
        privKey: params.privateKeyMultibase,
      });

    const { didDocString } = params;
    // TODO:  do proper checck of paramaters
    const did: Did = JSON.parse(didDocString);
    const didBytes = (await Did.encode(did)).finish();
    const signed = ed25519.sign(privateKeyMultibaseConverted, didBytes);
    return Buffer.from(signed).toString('base64');
  }

  // Generate a new key pair of type Ed25519VerificationKey2020
  public async generateKeys(params: {
    seed: string;
  }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }> {
    let edKeyPair;
    if (params && params.seed) {
      const seedBytes = new Uint8Array(Buffer.from(params.seed));
      edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes });
    } else {
      edKeyPair = await Ed25519VerificationKey2020.generate();
    }
    const exportedKp = await edKeyPair.export({ publicKey: true, privateKey: true });
    return {
      privateKeyMultibase: exportedKp.privateKeyMultibase, // 91byte //zbase58
      publicKeyMultibase: exportedKp.publicKeyMultibase, //48 bytes
    };
  }

  /// Generate Did Document
  public async generate(params: { publicKeyMultibase: string }): Promise<string> {
    if (!params.publicKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
    }
    const { publicKeyMultibase: publicKeyMultibase1 } = Utils.convertEd25519verificationkey2020toStableLibKeysInto({
      publicKey: params.publicKeyMultibase,
    });

    const methodSpecificId = await Utils.getUUID();
    const newDid = new DID(publicKeyMultibase1, methodSpecificId, this.namespace);
    return newDid.getDidString();
  }

  // TODO:  this method MUST also accept signature/proof
  public async register(params: {
    didDocString: string;
    privateKeyMultibase: string;
    verificationMethodId: string;
  }): Promise<object> {
    if (!params.didDocString) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to register a did');
    }
    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
    }

    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
    }

    const { didDocString, privateKeyMultibase, verificationMethodId } = params;
    const signature: string = await this.sign({ didDocString, privateKeyMultibase });
    const didDoc: Did = JSON.parse(didDocString);
    return await this.didrpc.registerDID(didDoc, signature, verificationMethodId);
  }

  /**
   * @param params params: { did?: string ,didDoc?: JSON }
   *
   *  if did is provided then it will resolve the did doc from the blockchain
   *  if didDoc is provided then it will verify the did with the proof
   * @returns  Promise : {context ,didDocument, VerificationResult , didDocumentMetadata}
   */
  public async resolve(params: { did?: string; didDoc?: JSON }): Promise<IDIDResolve> {
    if (params.did) {
      return await this.didrpc.resolveDID(params.did);
    }
    if (params.didDoc) {
      const signedDidDoc: any = params.didDoc;
      const doc = { ...signedDidDoc };
      if (!signedDidDoc.proof) {
        throw new Error('HID-SSI-SDK:: Error: params.didDoc is not signed');
      }
      const { VerificationResult } = await this.verify({ doc } as IParams);
      if (!VerificationResult.verified) {
        throw new Error('HID-SSI-SDK:: Error: params.didDoc is not verified , Invalid signature');
      }
      delete signedDidDoc.proof;
      const didDoc = signedDidDoc as Did;

      const results = {
        context: doc['@context'],
        didDocument: didDoc,
        didDocumentMetadata: {},
      } as IDIDResolve;

      return { ...results };
    }
    throw new Error('HID-SSI-SDK:: Error: params.did or params.didDoc is required to resolve a did');
  }

  // Update DID Document
  public async update(params: {
    didDocString: string;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object> {
    if (!params.didDocString) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to update a did');
    }
    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
    }

    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
    }
    if (!params.versionId) {
      throw new Error('HID-SSI-SDK:: Error: params.versionId is required to update a did');
    }

    const { didDocString, privateKeyMultibase, verificationMethodId, versionId } = params;
    const signature = await this.sign({ didDocString, privateKeyMultibase });
    const didDoc: Did = JSON.parse(didDocString);
    return await this.didrpc.updateDID(didDoc, signature, verificationMethodId, versionId);
  }

  public async deactivate(params: {
    didDocString: string;
    privateKeyMultibase: string;
    verificationMethodId: string;
    versionId: string;
  }): Promise<object> {
    if (!params.didDocString) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocString is required to deactivate a did');
    }
    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
    }

    if (!params.privateKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
    }
    if (!params.versionId) {
      throw new Error('HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
    }

    const { didDocString, privateKeyMultibase, verificationMethodId, versionId } = params;
    const signature = await this.sign({ didDocString, privateKeyMultibase });
    const didDoc: Did = JSON.parse(didDocString);
    return await this.didrpc.deactivateDID(didDoc.id, signature, verificationMethodId, versionId);
  }
  /// Did Auth

  /**
   *
   * @param params
   * -    params { privateKey, challenge, domain, did}
   * -    privateKey  :   private key in multibase format (base58 digitalbazar format)
   * -    challenge   :   challenge is a random string generated by the client
   * -    did         :   did of the user
   * -    domain      :   domain is the domain of the DID Document that is being authenticated
   * @returns signed {signedDidDocument}
   */

  public async signDid(params: IParams): Promise<object> {
    const { privateKey, challenge, domain, did, doc } = params;
    let resolveddoc;
    if (!privateKey) {
      throw new Error('HID-SSI-SDK:: Error: params.privateKey is required to sign a did');
    }
    if (!challenge) {
      throw new Error('HID-SSI-SDK:: Error: params.challenge is required to sign a did');
    }
    if (!domain) {
      throw new Error('HID-SSI-SDK:: Error: params.domain is required to sign a did');
    }
    if (!did) {
      throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
    }
    try {
      // if did is prvovided then resolve the did doc from the blockchain or else use the did doc provided in the params object to sign the did doc with the proof
      if (did) {
        resolveddoc = await this.didrpc.resolveDID(did);
      } else if (doc) {
        resolveddoc = doc;
      } else {
        throw new Error('HID-SSI-SDK:: Error: params.did or params.doc is required to sign a did');
      }
    } catch (error) {
      throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a public did');
    }

    const publicKeyId = resolveddoc.didDocument.authentication[0];
    const pubkey = resolveddoc.didDocument.verificationMethod.find((item) => item.id === publicKeyId);
    const { publicKeyMultibase: publicKeyMultibase1 } = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
      publicKey: pubkey.publicKeyMultibase,
    });

    const keyPair = await Ed25519VerificationKey2020.from({
      id: publicKeyId,

      privateKeyMultibase: privateKey,
      publicKeyMultibase: publicKeyMultibase1,
    });

    const suite = new Ed25519Signature2020({
      verificationMethod: publicKeyId,
      key: keyPair,
    });

    // suite.date = new Date().toISOString();

    const context = resolveddoc.didDocument.context;
    delete resolveddoc.didDocument.context;
    resolveddoc.didDocument['@context'] = context;
    resolveddoc.didDocument['@context'].push(constant.VC.CREDENTAIL_SECURITY_SUITE);
    const signedDidDocument = await jsonSigs.sign(resolveddoc.didDocument, {
      suite,
      purpose: new AuthenticationProofPurpose({
        challenge,
        domain,
      }),
      documentLoader,
      compactProof: constant.compactProof,
    });

    return { signedDidDocument };
  }

  // verify the signature
  /**
   *
   * @param params IParams
   * -    params { doc: signedDidDocument}
   * -    doc  :   signed did document
   *
   * @returns VerificationResult {VerificationResult}
   */
  public async verify(params: IParams): Promise<{ VerificationResult }> {
    const { doc } = params;
    if (!doc) {
      throw new Error('HID-SSI-SDK:: Error: params.doc is required to verify a did');
    }
    const didDoc = doc as Did;
    const didid = didDoc.id;
    let resolvedoc;
    try {
      resolvedoc = await this.didrpc.resolveDID(didDoc.id);
      if (!resolvedoc.didDocument && !resolvedoc.didDocumentMetadata) {
        throw new Error('HID-SSI-SDK:: Error: params.doc is required to verify a did');
      }

      // const publicKeyId=doc
    } catch (error) {
      throw new Error('HID-SSI-SDK:: Error: doc.id is required to resolve a public did');
    }

    const publicKeyId = didDoc.authentication[0];
    const controller = didDoc.controller[0];
    const pubkey = didDoc.verificationMethod.find((item) => item.id === publicKeyId);
    let result;
    if (pubkey) {
      const { publicKeyMultibase: publicKeyMultibase1 } = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
        publicKey: pubkey.publicKeyMultibase,
      });

      const keyPair = await Ed25519VerificationKey2020.from({
        id: publicKeyId,

        publicKeyMultibase: publicKeyMultibase1,
      });

      const suite = new Ed25519Signature2020({
        key: keyPair,
      });
      suite;
      suite.date = new Date().toISOString();

      result = await jsonSigs.verify(didDoc, {
        suite,
        purpose: new ProofPurpose({
          term: 'authentication',
        }),
        documentLoader,
        compactProof: constant.compactProof,
      });
    }

    return { VerificationResult: result };

    //// TODO: checks..."All params are mandatory"

    //// TODO: Fetch did doc from ledger and compare it here.
    // const did = doc['id']
    // const { controller, publicKey, didDoc: didDocOnLedger } = await this.utils.getControllerAndPublicKeyFromDid(did, 'authentication')

    // const didDocWhichIsPassedTemp = Object.assign({}, doc)
    // delete didDocWhichIsPassedTemp['proof'];
    // delete didDocOnLedger['proof'];
    // if (JSON.stringify(didDocWhichIsPassedTemp) !== JSON.stringify(didDocOnLedger)) throw new Error("Invalid didDoc for did = " + did)

    // const purpose = new AuthenticationProofPurpose({
    //   controller,
    //   domain,
    //   challenge
    // })

    // const suite = new Ed25519Signature2018({
    //   key: new Ed25519KeyPair(publicKey)
    // })

    // const verified = await jsonSigs.verify(doc, {
    //   suite,
    //   purpose,
    //   documentLoader,
    //   compactProof: constant.compactProof
    // })

    // return verified;
  }
}
