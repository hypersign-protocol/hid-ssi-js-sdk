import { ICredentialMethods, IVerifiableCredential, ICredentialStatus, ISchema, ICredentialProof } from './ICredential';
import { CredentialStatus, CredentialProof } from '../../libs/generated/ssi/credential';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { IClientSpec } from '../did/IDID';
export default class HypersignVerifiableCredential implements ICredentialMethods, IVerifiableCredential {
    context: Array<string>;
    id: string;
    type: Array<string>;
    issuer: string;
    issuanceDate: string;
    expirationDate: string;
    credentialSubject: object;
    credentialSchema: ISchema;
    proof: ICredentialProof;
    credentialStatus: ICredentialStatus;
    private credStatusRPC;
    private namespace;
    private hsSchema;
    private hsDid;
    constructor(params?: {
        namespace?: string;
        offlineSigner?: OfflineSigner;
        nodeRpcEndpoint?: string;
        nodeRestEndpoint?: string;
    });
    private _sign;
    private _dateNow;
    private _sha256Hash;
    private _getId;
    private _checkIfAllRequiredPropsAreSent;
    private _getCredentialSubject;
    private _getCredentialContext;
    /**
     * Initialise the offlinesigner to interact with Hypersign blockchain
     */
    init(): Promise<void>;
    /**
     * Generates a new credential document
     * @params
     *  - params.schemaId             : Hypersign schema id
     *  - params.subjectDid           : DID of the subject, if not provided, will be taken from subjectDidDocSigned
     *  - params.schemaContext        :
     *  - params.type                 :
     *  - params.issuerDid            :  DID of the issuer
     *  - params.expirationDate       :  Date of the expiration for this credential
     *  - params.fields               :  Schema fields values for this credential
     * @returns {Promise<IVerifiableCredential>} Result a credential document
     */
    generate(params: {
        schemaId?: string;
        subjectDid?: string;
        subjectDidDocSigned?: JSON;
        schemaContext?: Array<string>;
        type?: Array<string>;
        issuerDid: string;
        expirationDate: string;
        fields: object;
    }): Promise<IVerifiableCredential>;
    /**
     * Generates signed credentials document and registers its status on Hypersign blockchain
     * @params
     *  - params.credential             : Hypersign credentail document
     *  - params.privateKeyMultibase    : P
     *  - params.issuerDid              : DID of the issuer
     *  - params.verificationMethodId   : Verifcation Method of Issuer
     * @returns {Promise<{
     * signedCredential: IVerifiableCredential;
     * credentialStatus: CredentialStatus;
     * credentialStatusProof: CredentialProof;
     * credentialStatusRegistrationResult?: DeliverTxResponse;
     * }>}
     */
    issue(params: {
        credential: IVerifiableCredential;
        issuerDid: string;
        verificationMethodId: string;
        privateKeyMultibase: string;
        registerCredential?: boolean;
    }): Promise<{
        signedCredential: IVerifiableCredential;
        credentialStatus: CredentialStatus;
        credentialStatusProof: CredentialProof;
        credentialStatusRegistrationResult?: DeliverTxResponse;
    }>;
    /**
     * Verfies signed/issued credential
     * @params
     *  - params.credential             : Signed Hypersign credentail document of type IVerifiableCredential
     *  - params.issuerDid              : DID of the issuer
     *  - params.verificationMethodId   : Verifcation Method of Issuer
     * @returns {Promise<object>}
     */
    verify(params: {
        credential: IVerifiableCredential;
        issuerDid: string;
        verificationMethodId: string;
    }): Promise<object>;
    /**
     * Resolves credential status from Hypersign Blokchain
     * @params
     *  - params.credentialId           : Verifiable credential id
     * @returns {Promise<CredentialStatus>}
     */
    resolveCredentialStatus(params: {
        credentialId: string;
    }): Promise<CredentialStatus>;
    /**
     * Update credential status in blockchain Hypersign Blokchain
     * @params
     *  - params.credentialStatus           : Status of the credential of type CredentialStatus
     *  - params.issuerDid                  : DID of the issuer
     *  - params.verificationMethodId       : verificationMethodId
     *  - params.privateKeyMultibase        : privateKey of the issuer
     *  - params.status                     : Status LIVE/REVOKE/SUSPENDED
     *  - params.statusReason               : Reason for the status change
     * @returns {Promise<DeliverTxResponse>}
     */
    updateCredentialStatus(params: {
        credentialStatus: CredentialStatus;
        issuerDid: string;
        verificationMethodId: string;
        privateKeyMultibase: string;
        status: string;
        statusReason?: string;
    }): Promise<DeliverTxResponse>;
    checkCredentialStatus(params: {
        credentialId: string;
    }): Promise<{
        verified: boolean;
    }>;
    registerCredentialStatus(params: {
        credentialStatus: CredentialStatus;
        credentialStatusProof: CredentialProof;
    }): Promise<DeliverTxResponse>;
    generateRegisterCredentialStatusTxnMessage(credentialStatus: CredentialStatus, proof: CredentialProof): Promise<{
        typeUrl: string;
        value: import("../../libs/generated/ssi/tx").MsgRegisterCredentialStatus;
    }>;
    registerCredentialStatusTxnBulk(txnMessage: []): Promise<DeliverTxResponse>;
    /**
     * Issue credentials document with EthereumEip712Signature2021
   
    */
    issueByClientSpec(params: {
        credential: IVerifiableCredential;
        issuerDid: string;
        verificationMethodId: string;
        type?: string;
        web3Obj: any;
        registerCredential?: boolean;
        domain?: string;
        clientSpec?: IClientSpec;
    }): Promise<Error | {
        signedCredential: IVerifiableCredential;
    }>;
    verifyByClientSpec(params: {
        credential: IVerifiableCredential;
        issuerDid: string;
        verificationMethodId: string;
        web3Obj: any;
    }): Promise<object>;
}
//# sourceMappingURL=vc.d.ts.map