import { DidDocument as Did } from '../../libs/generated/ssi/did';
import { ICredentialMethods, IVerifiableCredential, ICredentialStatus, ISchema, ICredentialProof, IResolveCredential } from './ICredential';
import { CredentialStatusDocument as CredentialStatus } from '../../libs/generated/ssi/credential_status';
import { DocumentProof as CredentialProof } from '../../libs/generated/ssi/proof';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
export default class HypersignBJJVerifiableCredential implements ICredentialMethods, IVerifiableCredential {
    '@context': Array<string>;
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
    private credentialApiService;
    private namespace;
    private hsSchema;
    private hsDid;
    documentL: any;
    constructor(params?: {
        namespace?: string;
        offlineSigner?: OfflineSigner;
        nodeRpcEndpoint?: string;
        nodeRestEndpoint?: string;
        entityApiSecretKey?: string;
    });
    private _jsonLdSign;
    private _dateNow;
    private _getId;
    private _toTitleCase;
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
        issuerDidDoc?: JSON;
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
        issuerDid?: string;
        issuerDidDocument?: Did;
        verificationMethodId: string;
    }): Promise<any>;
    /**
     * Resolves credential status from Hypersign Blokchain
     * @params
     *  - params.credentialId           : Verifiable credential id
     * @returns {Promise<IResolveCredential>}
     */
    resolveCredentialStatus(params: {
        credentialId: string;
    }): Promise<IResolveCredential>;
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
    /**
     * Check status of credential on Hypersign Chain
     * @param
     * - params.credentialId     : Credential Id
     * @returns {Promise<{ verified: boolean }>}
     */
    checkCredentialStatus(params: {
        credentialId: string;
    }): Promise<{
        verified: boolean;
    }>;
    /**
     * Register credential status on Hypersign Chain
     * @param
     * - params.credentialStatus       : Credential status
     * - params.credentialStatusProof  : Status proof of the credential
     * @returns {Promise<{ transactionHash: string }>}
     */
    registerCredentialStatus(params: {
        credentialStatus: CredentialStatus;
        credentialStatusProof: CredentialProof;
    }): Promise<{
        transactionHash: string;
    }>;
    /**
     * Generate transaction message
     * @param
     * - params.credentialStatus       : Credential status
     * - params.credentialStatusProof  : Status proof of the credential
     * @returns {Promise<{typeUrl: string, value: MsgRegisterCredentialStatus}>}
     */
    generateRegisterCredentialStatusTxnMessage(credentialStatus: CredentialStatus, proof: CredentialProof): Promise<{
        typeUrl: string;
        value: import("../../libs/generated/ssi/tx").MsgRegisterCredentialStatus;
    }>;
    /**
     * Register multiple credential status
     * @param
     * - params.txnMessage      : Array of transaction message
     * @returns {Promise<DeliverTxResponse>}
     */
    registerCredentialStatusTxnBulk(txnMessage: []): Promise<DeliverTxResponse>;
    generateSeletiveDisclosure(param: {
        verifiableCredential: IVerifiableCredential;
        frame: object;
        verificationMethodId: string;
        issuerDid: string;
    }): Promise<any>;
}
//# sourceMappingURL=bjjvc.d.ts.map