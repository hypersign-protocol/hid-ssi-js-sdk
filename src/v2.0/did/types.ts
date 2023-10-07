import { 
    Did as IDidDocument,  
    Did as DIDEncoder,  
    Metadata as IDidDocumentMetadata,
    VerificationMethod as IVerificationMethod,
    Service as IService,
} from '../../../libs/generated/ssi/did';

import { HypersignBaseSigner } from '../signers/types'
import DidDocumentMessage from '../signers/messages/DidDocumentMessage'

export interface IDIDResolve {
    didDocument: IDidDocument;
    didDocumentMetadata: IDidDocumentMetadata;
}


export interface IHypersignDidDocument extends IDidDocument {
    '@context': Array<any>;
}
  
export interface IProof {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    challenge: string;
    domain: string;
    proofValue: string;
}
  
export interface ISignedDIDDocument extends IHypersignDidDocument {
    proof: IProof;
}

export interface IHypersignDIDManager {
    didDocument: IDidDocument;
    did: string;
    createDIDDocument();
    registerDIDDocument();
    updateDIDDocument();
    deactivateDIDDocument();
}

export type IVerificationRelationship =
      'authentication'
    | 'assertionMethod'
    | 'keyAgreement'
    | 'capabilityInvocation'
    | 'capabilityDelegation'

export type IClientSpec = 
      'eth-personalSign'
    | 'cosmos-ADR036'




export interface IHypersignManager {

    sign(params: {
        didDocument: DidDocumentMessage;
        signer: HypersignBaseSigner
    }): Promise<ISignedDIDDocument>

    // register(params: {
    //     didDocument: IDidDocument; // Ld document
    //     privateKeyMultibase?: string;
    //     verificationMethodId?: string;
    //     signData?: any[];
    // }): Promise<{ didDocument: IDidDocument; transactionHash: string }>;

    // resolve(params: { did: string; ed25519verificationkey2020?: boolean }): Promise<IDIDResolve>;

    // update(params: {
    // didDocument: IDidDocument;
    // privateKeyMultibase: string;
    // verificationMethodId: string;
    // versionId: string;
    // }): Promise<{ transactionHash: string }>;

    // deactivate(params: {
    // didDocument: IDidDocument;
    // privateKeyMultibase: string;
    // verificationMethodId: string;
    // versionId: string;
    // }): Promise<{ transactionHash: string }>;
}


export {
    IDidDocument,
    IDidDocumentMetadata,
    IVerificationMethod,
    IService,
    DIDEncoder   
}


