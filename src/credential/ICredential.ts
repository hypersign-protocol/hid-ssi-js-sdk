import { CredentialStatus, CredentialProof, Credential } from '../generated/ssi/credential';
import { DeliverTxResponse } from '@cosmjs/stargate';

// interface ICredStatus {
//     status: CredentialStatus,
//     proof: CredentialProof
// }
// export interface ICredStatusResolve {
//   credStatus: ICredStatus;
// }

export interface ISchema {
  id: string;
  type: string;
}

export interface ICredentialStatus {
  id: string; // https://example.edu/status/24
  type: string; // CredentialStatusList2017
}

// https://www.w3.org/TR/vc-data-model/#basic-concepts
export interface IVerifiableCredential {
  context: Array<string>;
  id: string;
  type: Array<string>;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: object;
  credentialSchema: ISchema;

  // Ref: https://www.w3.org/TR/vc-data-model/#status
  credentialStatus: ICredentialStatus;

  proof: object;
}

export interface ICredentialMethods {
  generate(params: {
    schemaId: string;
    subjectDid?: string;
    subjectDidDocSigned?: JSON;
    schemaContext?: Array<string>;
    type?: Array<string>;
    issuerDid: string;
    expirationDate: string;
    fields: object;
  }): Promise<IVerifiableCredential>;

  issueCredential(params: {
    credential: IVerifiableCredential;
    issuerDid: string;
    privateKey: string;
  }): Promise<object>;
  verifyCredential(params: { credential: IVerifiableCredential; issuerDid: string }): Promise<object>;
  checkCredentialStatus(credentialId: string): Promise<{ verified: boolean }>;
}

export interface ICredentialRPC {
  credentialRestEP: string;
  registerCredentialStatus(credentialStatus: CredentialStatus, proof: CredentialProof): Promise<DeliverTxResponse>;
  resolveCredentialStatus(credentialId: string): Promise<Credential>;
  generateCredentialStatusTxnMessage(credentialStatus: CredentialStatus, proof: CredentialProof): Promise<object>;
  registerCredentialStatusBulk(txMessages: Array<any>[]): Promise<DeliverTxResponse>;
}
