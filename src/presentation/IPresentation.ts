import { IVerifiableCredential } from '../credential/ICredential';

// interface ISchema {
//     id: string;
//     type: string;
//   }

// https://www.w3.org/TR/vc-data-model/#basic-concepts
// export interface IVerifiableCredential {
//     '@context': Array<string>;
//     id: string;
//     type: Array<string>;
//     issuer: string;
//     issuanceDate: string;
//     expirationDate: string;
//     credentialSubject: object;
//     credentialSchema: ISchema;
//     proof: object;
//}

// https://www.w3.org/TR/vc-data-model/#presentations-0
export interface IVerifiablePresentation {
  id: string;
  type: Array<string>;
  verifiableCredential: Array<IVerifiableCredential> | Array<string>;
  holder: string;
  proof: object;
}

export interface IPresentationMethods {
  generate(params: { verifiableCredentials: Array<IVerifiableCredential>; holderDid: string }): Promise<object>;

  sign(params: {
    presentation: IVerifiablePresentation;
    holderDid: string;
    privateKeyMultibase: string;
    challenge: string;
    verificationMethodId: string;
  }): Promise<object>;

  verify(params: {
    signedPresentation: IVerifiablePresentation;
    challenge: string;
    domain?: string;
    issuerDid: string;
    holderDid: string;
    holderVerificationMethodId: string;
    issuerVerificationMethodId: string;
  }): Promise<object>;
}
