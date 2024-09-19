import { DidDocument as Did } from '../../libs/generated/ssi/did';
import { DocumentProof as SignInfo } from '../../libs/generated/ssi/proof';
import Web3 from 'web3';
import { IDID, IDIDResolve, ISignedDIDDocument, IClientSpec, ISignData, ISignInfo, SupportedPurpose } from './IDID';
import { VerificationMethodRelationships, VerificationMethodTypes } from '../../libs/generated/ssi/client/enums';
import { OfflineSigner } from '@cosmjs/proto-signing';
import HypersignBJJDId from './bjjdid';
/** Class representing HypersignDID */
export default class HypersignDID implements IDID {
    private didrpc;
    private didAPIService;
    namespace: string;
    bjjDID: HypersignBJJDId;
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
    private _getDateTime;
    private _jsonLdSign;
    private _jsonLdNormalize;
    private _concat;
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
        seed?: string | Uint8Array;
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
        verificationMethodId?: string;
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
     * -  params.purpose                   :   purpose of Auth (authentication or assertionMethod)
     * @returns {Promise<object>} Signed DID Document
     */
    sign(params: {
        didDocument?: Did;
        privateKeyMultibase: string;
        challenge: string;
        domain: string;
        did?: string;
        verificationMethodId: string;
        purpose?: SupportedPurpose;
    }): Promise<ISignedDIDDocument>;
    /**
     * Verifies a signed DIDDocument
     * @params
     *  - params.didDocument :   Signed DID Document
     *  - params.privateKey  :   private key in multibase format (base58 digitalbazar format)
     *  - params.challenge   :   challenge is a random string generated by the client required for authentication purpose
     *  - params.did         :   did of the user
     *  - params.domain      :   domain is the domain of the DID Document that is being authenticated
     *  -  params.purpose    :   purpose of Auth (authentication or assertion)
     * @returns Promise<{ verificationResult }> Verification Result
     */
    verify(params: {
        didDocument: Did;
        verificationMethodId: string;
        challenge?: string;
        domain?: string;
        purpose?: SupportedPurpose;
    }): Promise<object>;
    private _isValidMultibaseBase58String;
    /**
     * Create DIDDocument using metamask or kepler
     * @param
     *  - params.methodSpecificId           : methodSpecificId (min 32 bit alhanumeric) else it will generate new random methodSpecificId or may be walletaddress
     *  - params.publicKey                  : Optional, Used for cosmos-ADR036
     *  - params.address                    : Checksum address from web3 wallet
     *  - params.chainId                    : Chain Id
     *  - params.clientSpec                 : ClientSpec either it is eth-personalSign or cosmos-ADR036\
     *  - params.verificationRelationships  : Optional, verification relationships where you want to add your verificaiton method ids
     * @returns {Promise<Did>}  DidDocument object
     */
    createByClientSpec(params: {
        methodSpecificId: string;
        publicKey?: string;
        address: string;
        chainId: string;
        clientSpec: IClientSpec;
        verificationRelationships?: VerificationMethodRelationships[];
    }): Promise<Did>;
    /**
     * Register did on chain generated using wallet
     * @param
     * - params.didDocument      : DidDocument to register
     * - params.signInfos        : Array of signature, verificationMethodId and clientSpec
     * @returns {Promise<{didDocument: Did,transactionHash: string }>}
     */
    registerByClientSpec(params: {
        didDocument: Did;
        signInfos: ISignInfo[];
    }): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    /**
     * Update a didDocument in Hypersign blockchain
     * @param
     * - params.didDocument      : LD DidDocument to updated
     * - params.versionId        : Version of the document. See the didDocumentMetadata when DID resolves
     * - params.signInfos        : Array of signature, verificationMethodId and clientSpec
     * @returns {Promise<{ transactionHash: string }>}  Result of the update operation
     */
    updateByClientSpec(params: {
        didDocument: Did;
        versionId: string;
        signInfos: ISignInfo[];
    }): Promise<{
        transactionHash: string;
    }>;
    /**
     * Deactivate a didDocument in Hypersign blockchain - an onchain activity
     * @param
     * - params.didDocument      : LD DidDocument to updated
     * - params.versionId        : Version of the document. See the didDocumentMetadata when DID resolves
     * - params.signInfos        : Array of signature, verificationMethodId and clientSpec
     * @returns {Promise<{ transactionHash: string }>}  Result of the update operation
     */
    deactivateByClientSpec(params: {
        didDocument: Did;
        signInfos: ISignInfo[];
        versionId: string;
    }): Promise<{
        transactionHash: string;
    }>;
    /**
     * Sign and Register a DIDDocument
     * @param
     * - params.didDocument           : DidDocument to be signed and register
     * - params.address               : Checksum address from web3 wallet
     * - params.verificationMethodId  : verificationMethodId of the DID
     * - params.web3                  : Web3 object
     * - params.clientSpec            : ClientSpec either it is eth-personalSign or cosmos-ADR036
     * - params.chainId               : OPtional, ChainId
     * @returns {Promise<{ didDocument: Did; transactionHash: string }>}
     */
    signAndRegisterByClientSpec(params: {
        didDocument: Did;
        address: string;
        verificationMethodId: string;
        web3: Web3 | any;
        clientSpec: IClientSpec;
        chainId?: string;
    }): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    /**
     * Signs a DIDDocument
     * @param
     * - params.didDocument          : Did document to be signed
     * - params.clientSpec           : ClientSpec either it is eth-personalSign or cosmos-ADR036
     * - params.address              : Checksum address from web3 wallet
     * - params.web3                 : web3 object
     * - params.chainId              : Optional, chainId
     * - params.verificationMethodId : verificationMEthodId for generating signature
     * @returns {Promise<ISignedDIDDocument>}
     */
    signByClientSpec(params: {
        didDocument: Did;
        clientSpec: IClientSpec;
        address: string;
        web3: Web3 | any;
        verificationMethodId: string;
        chainId?: string;
    }): Promise<ISignedDIDDocument>;
    /**
     * Add verification method
     * @param
     * - params.didDocument          : Optional, unregistered Did document
     * - params.did                  : Optional, didDoc Id of registered didDoc
     * - params.type                 : key type
     * - params.id                   : Optional, verificationMethodId
     * - params.controller           : Optional, controller field
     * - params.publicKeyMultibase   : public key
     * - params.blockchainAccountId  : Optional, blockchain accountId
     * @return {Promise<Did>}  DidDocument object
     */
    addVerificationMethod(params: {
        did?: string;
        didDocument?: Did;
        type: VerificationMethodTypes;
        id?: string;
        controller?: string;
        publicKeyMultibase?: string;
        blockchainAccountId?: string;
    }): Promise<Did>;
}
//# sourceMappingURL=did.d.ts.map