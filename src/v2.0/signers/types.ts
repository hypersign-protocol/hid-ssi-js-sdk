import  { ISignedDIDDocument } from '../../v2.0/did/types'

import TextMessage  from './messages/TextMessage';
import DidDocumentMessage from './messages/DidDocumentMessage';

export interface BaseMessage <T> {
    message: T;
    encode(): Promise<Uint8Array>;
}

export type Purpose = 
      'AuthenticationProofPurpose' 
    | 'AssertionProofPurpose'


export interface BaseSigner {
    sign<T extends TextMessage | DidDocumentMessage>(message: T): Promise<string>;
    ldSign<T extends BaseMessage<any>>(message: T, 
        purposeType: Purpose, 
        challenge?: string, 
        domain?: string): Promise<ISignedDIDDocument> ;
}


export type IVerificationKeyType = 
      'Ed25519VerificationKey2020' 
    | 'EcdsaSecp256k1RecoveryMethod2020'
    | 'EcdsaSecp256k1VerificationKey2019'

export interface IKeyPair {
    id?: string;
    type: IVerificationKeyType;
    publicKeyMultibase: string;
    privateKeyMultibase?: string;
    blockchainAccountId?: string;
  }

export interface IKeyManager {
    initiate(): Promise<IKeyPair>;
}

