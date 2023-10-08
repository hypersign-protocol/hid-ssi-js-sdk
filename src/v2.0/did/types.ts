import { 
    Did as IDidDocumentJs,  
    Did as DIDEncoder,  
    Metadata as IDidDocumentMetadata,
    VerificationMethod as IVerificationMethod,
    Service as IService,
    SignInfo
} from '../../../libs/generated/ssi/did';

import { BaseSigner } from '../signers/types'

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

export enum IClientSpec {
    'eth-personalSign' = 'eth-personalSign',
    'cosmos-ADR036' = 'cosmos-ADR036',
    }



export interface MsgData {
    msgType: string;
    data: Uint8Array;
}
    
export interface DeliverTxResponse {
    readonly height: number;
    /** Error code. The transaction suceeded iff code is 0. */
    readonly code: number;
    readonly transactionHash: string;
    readonly rawLog?: string;
    readonly data?: readonly MsgData[];
    readonly gasUsed: number;
    readonly gasWanted: number;
}
    
export interface IDIDRpc {
    registerDID(didDoc: IDidDocumentJs, signInfos: SignInfo[]): Promise<DeliverTxResponse>;
    updateDID(didDoc: IDidDocumentJs | any, signInfos: SignInfo[], versionId: string): Promise<DeliverTxResponse>;
    deactivateDID(did: string, signInfos: SignInfo[], versionId: string): Promise<DeliverTxResponse>;
    resolveDID(did: string): Promise<IDIDResolve>;
    init(): Promise<void>;
}
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
    DIDEncoder,   
}


