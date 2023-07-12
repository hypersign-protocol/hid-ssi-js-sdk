import { IVerifiableCredential } from '../credential/ICredential';
export interface IVerifiablePresentation {
    id: string;
    type: Array<string>;
    verifiableCredential: Array<IVerifiableCredential> | Array<string>;
    holder: string;
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
//# sourceMappingURL=IPresentation.d.ts.map