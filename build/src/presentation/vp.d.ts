/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { IVerifiableCredential } from '../credential/ICredential';
import { IPresentationMethods, IVerifiablePresentation } from './IPresentation';
export default class HypersignVerifiablePresentation implements IPresentationMethods, IVerifiablePresentation {
    private hsDid;
    private vc;
    id: string;
    type: Array<string>;
    verifiableCredential: Array<IVerifiableCredential>;
    holder: string;
    proof: object;
    namespace: string;
    constructor(params?: {
        namespace?: string;
        nodeRpcEndpoint?: string;
        nodeRestEndpoint?: string;
    });
    private _getId;
    /**
     * Generates a new presentation document
     * @params
     *  - params.verifiableCredentials: Array of Verifiable Credentials
     *  - params.holderDid            : DID of the subject
     * @returns {Promise<object>}
     */
    generate(params: {
        verifiableCredentials: Array<IVerifiableCredential>;
        holderDid: string;
    }): Promise<object>;
    /**
     * Signs a new presentation document
     * @params
     *  - params.presentation         : Array of Verifiable Credentials
     *  - params.holderDid            : *Optional* DID of the subject
     *  - params.holderDidDocSigned   : *Optional* DID Doc of the subject
     *  - params.verificationMethodId : verificationMethodId of holder
     *  - params.privateKeyMultibase  : Private key associated with the verification method
     *  - params.challenge            : Any random challenge
     * @returns {Promise<object>}
     */
    sign(params: {
        presentation: IVerifiablePresentation;
        holderDid?: string;
        holderDidDocSigned?: JSON;
        verificationMethodId: string;
        privateKeyMultibase: string;
        challenge: string;
    }): Promise<IVerifiablePresentation>;
    /**
     * Verifies signed presentation document
     * @params
     *  - params.signedPresentation         : Signed presentation document
     *  - params.holderDid                  : DID of the subject
     *  - params.holderDidDocSigned         : DIDdocument of the subject
     *  - params.holderVerificationMethodId : verificationMethodId of holder
     *  - params.issuerDid                  : DID of the issuer
     *  - params.issuerVerificationMethodId : Optional DIDDoc of the issuer
     *  - params.domain                     : Optional domain
     *  - params.challenge                  : Random challenge
     * @returns {Promise<object>}
     */
    verify(params: {
        signedPresentation: IVerifiablePresentation;
        challenge: string;
        domain?: string;
        issuerDid: string;
        holderDid?: string;
        holderDidDocSigned?: JSON;
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
        credentialResults: any[];
        presentationResult: {};
        error: unknown;
    }>;
}
//# sourceMappingURL=vp.d.ts.map