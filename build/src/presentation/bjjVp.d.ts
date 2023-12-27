/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { IVerifiableCredential } from '../credential/ICredential';
import { IPresentationMethods, IVerifiablePresentation } from './IPresentation';
import { BabyJubJubSignatureProof2021 } from 'babyjubjubsignature2021';
export default class HyperSignBJJVP implements IPresentationMethods, IVerifiablePresentation {
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
    signByClientSpec(params: {
        presentation: IVerifiablePresentation;
        holderDid?: string | undefined;
        verificationMethodId: string;
        web3Obj: any;
        domain?: string | undefined;
        challenge?: string | undefined;
    }): Promise<IVerifiablePresentation>;
    verifyByClientSpec(params: {
        signedPresentation: IVerifiablePresentation;
        challenge?: string | undefined;
        domain?: string | undefined;
        issuerDid: string;
        holderDid?: string | undefined;
        holderDidDocSigned?: JSON | undefined;
        holderVerificationMethodId: string;
        issuerVerificationMethodId: string;
        web3Obj: any;
    }): Promise<{
        verified: boolean;
        credentialResults: any;
        presentationResult: any;
        error: any;
    }>;
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
     *  - params.domain               : Domain url
     * @returns {Promise<IVerifiablePresentation>}
     */
    sign(params: {
        presentation: IVerifiablePresentation;
        holderDid?: string;
        holderDidDocSigned?: JSON;
        verificationMethodId: string;
        privateKeyMultibase: string;
        challenge: string;
        domain?: string;
    }): Promise<IVerifiablePresentation>;
    /**
     * Verifies signed presentation document
     * @params
     *  - params.signedPresentation         : Signed presentation document
     *  - params.holderDid                  : DID of the subject
     *  - params.holderDidDocSigned         : DIDdocument of the subject
     *  - params.holderVerificationMethodId : verificationMethodId of holder
     *  - params.issuerDid                  : DID of the issuer
     *  - params.issuerVerificationMethodId : verificationMethodId of issuer
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
    verifyProof(derivedProofs: any, params: {
        suite: BabyJubJubSignatureProof2021;
    }): Promise<any>;
}
//# sourceMappingURL=bjjVp.d.ts.map