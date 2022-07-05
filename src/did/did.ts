import * as constant from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { DIDRpc } from './didRPC';
import Utils from '../utils';
const ed25519 = require('@stablelib/ed25519');
import { Did, VerificationMethod, Service } from '../generated/ssi/did';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { IParams, IDID, IDIDResolve, IDIDRpc } from './IDID';

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
  service: Service[];
  constructor(publicKey: string) {
    this.context = [constant.DID.DID_BASE_CONTEXT];
    this.id = this.getId(publicKey);
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

  private getId = (publicKey) => {
    let did = '';
    did =
      constant.DID.NAMESPACE && constant.DID.NAMESPACE != ''
        ? `${constant.DID.SCHEME}:${constant.DID.NAMESPACE}:${publicKey}`
        : `${constant.DID.SCHEME}:${publicKey}`;
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
  constructor() {
    this.didrpc = new DIDRpc();
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
  public generate(params: { publicKeyMultibase: string }): string {
    if (!params.publicKeyMultibase) {
      throw new Error('HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
    }
    const { publicKeyMultibase: publicKeyMultibase1 } = Utils.convertEd25519verificationkey2020toStableLibKeysInto({
      publicKey: params.publicKeyMultibase,
    });
    const newDid = new DID(publicKeyMultibase1);
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

  public async resolve(params: { did: string }): Promise<IDIDResolve> {
    if (!params.did) {
      throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
    }
    return await this.didrpc.resolveDID(params.did);
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
  public signDid(params: IParams): Promise<object> {
    throw new Error('HID-SSI-SDK:: Error: Method not impplemented');
  }

  // verify the signature
  public async verify(params: IParams): Promise<object> {
    throw new Error('HID-SSI-SDK:: Error: Method not implemented');

    // const { doc, challenge, domain } = params;
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
