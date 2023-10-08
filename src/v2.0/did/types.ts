import { 
    Did as IDidDocumentJs,  
    Did as DIDEncoder,  
    Metadata as IDidDocumentMetadata,
    VerificationMethod as IVerificationMethod,
    Service as IService,
} from '../../../libs/generated/ssi/did';

import { BaseSigner } from '../signers/types'
import DidDocumentMessage from '../signers/messages/DidDocumentMessage'

export interface IDIDResolve {
    didDocument: IDidDocument;
    didDocumentMetadata: IDidDocumentMetadata;
}

type IDidDocumentJson = Omit<IDidDocumentJs, "context">;
export interface IDidDocument extends IDidDocumentJson {
    // TODO: add appropriate type here.
    '@context': Array<any>;
}

export interface IProof {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    challenge?: string;
    domain?: string;
    proofValue: string;
}
  
export interface ISignedDIDDocument extends IDidDocument {
    proof: IProof;
}

export interface IDIDManager {
    didDocument: IDidDocument;
    did: string;
    createDIDDocument();
    registerDIDDocument();
    updateDIDDocument();
    deactivateDIDDocument();
}


export interface IDIDDocumentService {
    addVerificationMethod(verificationMethod: IVerificationMethod);
    removeVerificationMethod(verificationMethodId: string);
    addService(service: IService);
    removeService(serviceId: string);
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




export interface IDidManager {

    sign(params: {
        didDocument: IDidDocument;
        signer: BaseSigner
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
    IDidDocumentJs,
    IDidDocumentMetadata,
    IVerificationMethod,
    IService,
    DIDEncoder   
}


