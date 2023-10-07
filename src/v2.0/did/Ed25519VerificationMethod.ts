import Ed25519Signer from '../signers/ed25519/Ed25519Signer';
import { IVerificationMethod  } from "./types";

export default class Ed25519VerificationMethod implements IVerificationMethod {
  #signer: Ed25519Signer;
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase: string;
  blockchainAccountId = '';
  constructor(signer: Ed25519Signer) {
    this.#signer = signer;
    this.id = this.#signer.id;
    this.type = this.#signer.type;
    this.controller = this.#signer.controller; 
    this.publicKeyMultibase = this.#signer.publicKeyMultibase;
  }
}