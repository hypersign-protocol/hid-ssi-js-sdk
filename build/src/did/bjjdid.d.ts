import { DidDocument as Did } from '../../libs/generated/ssi/did';
import { DocumentProof, DocumentProof as SignInfo } from '../../libs/generated/ssi/proof';
import { IDID, IDIDResolve, ISignedDIDDocument, IClientSpec, ISignData, ISignInfo } from './IDID';
import { VerificationMethodRelationships, VerificationMethodTypes } from '../../libs/generated/ssi/client/enums';
import { OfflineSigner } from '@cosmjs/proto-signing';
/** Class representing HypersignDID */
export default class HypersignBJJDID implements IDID {
    private didrpc;
    private didAPIService;
    namespace: string;
    /**
     * Creates instance of HypersignDID class
     * @constructor
     * @params
     *  - params.namespace        : namespace of did id, Default 'did:hid'
     *  - params.offlineSigner    : signer of type OfflineSigner
     *  - params.nodeRpcEndpoint  : RPC endpoint of the Hypersign blockchain, Default 'TEST'
     *  - params.nodeRestEndpoint : REST endpoint of the Hypersign blockchain
     */
    constructor(params?: {
        namespace?: string;
        offlineSigner?: OfflineSigner;
        nodeRpcEndpoint?: string;
        nodeRestEndpoint?: string;
        entityApiSecretKey?: string;
    });
    sign(params: {
        didDocument: Did;
        privateKeyMultibase: string;
        challenge: string;
        domain: string;
        did: string;
        verificationMethodId: string;
    }): Promise<ISignedDIDDocument>;
    verify(params: {
        didDocument: Did;
        verificationMethodId: string;
        challenge: string;
        domain?: string | undefined;
    }): Promise<object>;
    addVerificationMethod(params: {
        did?: string | undefined;
        didDocument?: Did | undefined;
        type: VerificationMethodTypes;
        id?: string | undefined;
        controller?: string | undefined;
        publicKeyMultibase?: string | undefined;
        blockchainAccountId?: string | undefined;
    }): Promise<Did>;
    createByClientSpec(params: {
        methodSpecificId: string;
        publicKey?: string | undefined;
        address: string;
        chainId: string;
        clientSpec: IClientSpec;
        verificationRelationships?: VerificationMethodRelationships[] | undefined;
    }): Promise<Did>;
    registerByClientSpec(params: {
        didDocument: Did;
        signInfos: DocumentProof[];
    }): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    updateByClientSpec(params: {
        didDocument: Did;
        versionId: string;
        signInfos: DocumentProof[];
    }): Promise<{
        transactionHash: string;
    }>;
    deactivateByClientSpec(params: {
        didDocument: Did;
        signInfos: DocumentProof[];
        versionId: string;
    }): Promise<{
        transactionHash: string;
    }>;
    signAndRegisterByClientSpec(params: {
        didDocument: Did;
        address: string;
        verificationMethodId: string;
        web3: any;
        clientSpec: IClientSpec;
        chainId?: string | undefined;
    }): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    signByClientSpec(params: {
        didDocument: Did;
        clientSpec: IClientSpec;
        address: string;
        web3: any;
        chainId?: string | undefined;
        verificationMethodId: any;
    }): Promise<ISignedDIDDocument>;
    private _getDateTime;
    private _jsonLdSign;
    private _getId;
    private _filterVerificationRelationships;
    /**
     * Creates a new DID Document from wallet address
     * @params
     *  - params.blockChainAccountId  :
     *  - params.methodSpecificId   : methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId or may be walletaddress
     * @returns {Promise<object>} DidDocument object
     */
    private _getBlockChainAccountID;
    init(): Promise<void>;
    /**
     * Generate a new key pair of type Ed25519VerificationKey2020
     * @params params.seed - Optional, Seed to generate the key pair, if not passed, random seed will be taken
     * @params params.controller - Optional, controller field
     * @returns {Promise<object>} The key pair of type Ed25519
     */
    generateKeys(params: {
        mnemonic?: string;
        controller?: string;
    }): Promise<{
        privateKeyMultibase: string;
        publicKeyMultibase: string;
    }>;
    /**
     * Generates a new DID Document
     * @params
     *  - params.publicKeyMultibase : public key
     *  - params.methodSpecificId   : Optional methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId
     *  - params.verificationRelationships: Optional, verification relationships where you want to add your verificaiton method ids
     * @returns {Promise<object>} DidDocument object
     */
    generate(params: {
        methodSpecificId?: string;
        publicKeyMultibase: string;
        verificationRelationships?: VerificationMethodRelationships[];
    }): Promise<Did>;
    private prepareDidDocument;
    /**
     * Register a new DID and Document in Hypersign blockchain - an onchain activity
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     * @returns {Promise<object>} Result of the registration
     */
    register(params: {
        didDocument: Did;
        privateKeyMultibase?: string;
        verificationMethodId: string;
        signData?: ISignData[];
    }): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    /**
     * Generate signature
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     * @returns {Promise<ISignInfo>} Generate Array
     */
    createSignInfos(params: {
        didDocument: Did;
        privateKeyMultibase: string;
        verificationMethodId: string;
    }): Promise<Array<ISignInfo>>;
    /**
     * Resolves a DID into DIDDocument from Hypersign blockchain - an onchain activity
     * @params
     *  - params.did                        : DID
     * @returns  {Promise<IDIDResolve>} didDocument and didDocumentMetadata
     */
    resolve(params: {
        did: string;
    }): Promise<IDIDResolve>;
    /**
     * Update a DIDDocument in Hypersign blockchain - an onchain activity
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     *  - params.versionId            : Version of the document
     * @returns {Promise<{ transactionHash: string }>} Result of the update operation
     */
    update(params: {
        didDocument: Did;
        privateKeyMultibase: string;
        verificationMethodId: string;
        versionId: string;
        readonly?: boolean;
        otherSignInfo?: Array<SignInfo>;
    }): Promise<{
        transactionHash: string;
    } | {
        didDocument: any;
        signInfos: any;
        versionId: any;
    }>;
    /**
     * Deactivate a DIDDocument in Hypersign blockchain - an onchain activity
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     *  - params.versionId            : Version of the document
     * @returns {Promise<object>} Result of the deactivatee operation
     */
    deactivate(params: {
        didDocument: Did;
        privateKeyMultibase: string;
        verificationMethodId: string;
        versionId: string;
    }): Promise<{
        transactionHash: string;
    }>;
    /**
     * Signs a DIDDocument
     * @params
     *  - params.didDocument               :   Did document to be signed
     *  - params.privateKeyMultibase       :   private key in multibase format (base58 digitalbazar format)
     *  - params.challenge                 :   challenge is a random string generated by the client
     *  - params.did                       :   did of the user
     *  - params.domain                    :   domain is the domain of the DID Document that is being authenticated
     *  - params.verificationMethodId      :   verificationMethodId of the DID
     * @returns {Promise<object>} Signed DID Document
     */
    private _isValidMultibaseBase58String;
}
//# sourceMappingURL=bjjdid.d.ts.map