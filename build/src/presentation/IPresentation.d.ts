import { IVerifiableCredential } from '../credential/ICredential';
export interface IVerifiableUnsignedPresentation {
    id: string;
    type: Array<string>;
    verifiableCredential: Array<IVerifiableCredential>;
    holder: string;
}
export interface IVerifiablePresentation extends IVerifiableUnsignedPresentation {
    proof: object;
}
export interface IPresentationMethods {
    generate(params: {
        verifiableCredentials: Array<IVerifiableCredential>;
        holderDid: string;
    }): Promise<object>;
    sign(params: {
        presentation: IVerifiablePresentation;
        holderDid: string;
        privateKeyMultibase: string;
        challenge: string;
        verificationMethodId: string;
        domain?: string;
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
    signByClientSpec(params: {
        presentation: IVerifiablePresentation;
        holderDid?: string;
        verificationMethodId: string;
        web3Obj: any;
        domain?: string;
        challenge?: string;
    }): Promise<IVerifiablePresentation>;
    verifyByClientSpec(params: {
        signedPresentation: IVerifiablePresentation;
        challenge?: string;
        domain?: string;
        issuerDid: string;
        holderDid?: string;
        holderDidDocSigned?: JSON;
        holderVerificationMethodId: string;
        issuerVerificationMethodId: string;
        web3Obj: any;
    }): Promise<{
        verified: boolean;
        credentialResults: any;
        presentationResult: any;
        error: any;
    }>;
}
//# sourceMappingURL=IPresentation.d.ts.map