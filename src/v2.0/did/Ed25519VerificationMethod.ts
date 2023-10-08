// TODO: this need to improve..
import Ed25519Signer from '../signers/ed25519/Ed25519Signer';
import { IVerificationMethod  } from "./types";

export default class Ed25519VerificationMethod{
  readonly #signer: Ed25519Signer;
  readonly #id: string;
  readonly #type: string;
  readonly #controller: string;
  readonly #publicKeyMultibase: string;
  readonly #blockchainAccountId = '';
  constructor(signer: Ed25519Signer) {
    this.#signer = signer;
    // TODO: remove hardcoding
    this.#id = this.#signer.id? this.#signer.id: this.#signer.controller+'#'+'key-1';
    this.#type = this.#signer.type;
    this.#controller = this.#signer.controller; 
    this.#publicKeyMultibase = this.#signer.publicKeyMultibase;
  }

  getVerificationMethod(): IVerificationMethod {
    return {
      id: this.#id,
      type: this.#type,
      controller: this.#controller,
      publicKeyMultibase: this.#publicKeyMultibase,
      blockchainAccountId: this.#blockchainAccountId
    }
  }
}