import { Did, SignInfo } from '../../libs/generated/ssi/did';
import Web3 from 'web3';
import { IDID, IDIDResolve, ISignedDIDDocument, IKeyType, IClientSpec, IVerificationRelationships, ISignData } from './IDID';
import { OfflineSigner } from '@cosmjs/proto-signing';
/** Class representing HypersignDID */
export default class HypersignDID implements IDID {
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
    private _sign;
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
        seed?: string;
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
        verificationRelationships?: IVerificationRelationships[];
    }): Promise<object>;
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
     * Resolves a DID into DIDDocument from Hypersign blockchain - an onchain activity
     * @params
     *  - params.did                        : DID
     *  - params.ed25519verificationkey2020 : *Optional* True/False
     * @returns  {Promise<IDIDResolve>} didDocument and didDocumentMetadata
     */
    resolve(params: {
        did: string;
        ed25519verificationkey2020?: boolean;
    }): Promise<IDIDResolve>;
    /**
     * Update a DIDDocument in Hypersign blockchain - an onchain activity
     * @params
     *  - params.didDocument          : LD did document
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     *  - params.versionId            : Version of the document
     * @returns {Promise<object>} Result of the update operation
     */
    update(params: {
        didDocument: Did;
        privateKeyMultibase: string;
        verificationMethodId: string;
        versionId: string;
    }): Promise<{
        transactionHash: string;
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
     *  - params.didDocument               :
     *  - params.privateKeyMultibase       :   private key in multibase format (base58 digitalbazar format)
     *  - params.challenge                 :   challenge is a random string generated by the client
     *  - params.did                       :   did of the user
     *  - params.domain                    :   domain is the domain of the DID Document that is being authenticated
     *  - params.verificationMethodId      :   verificationMethodId of the DID
     * @returns {Promise<object>} Signed DID Document
     */
    sign(params: {
        didDocument: object;
        privateKeyMultibase: string;
        challenge: string;
        domain: string;
        did: string;
        verificationMethodId: string;
    }): Promise<ISignedDIDDocument>;
    /**
     * Verifies a signed DIDDocument
     * @params
     *  - params.didDocument :   Signed DID Document
     *  - params.privateKey  :   private key in multibase format (base58 digitalbazar format)
     *  - params.challenge   :   challenge is a random string generated by the client
     *  - params.did         :   did of the user
     *  - params.domain      :   domain is the domain of the DID Document that is being authenticated
     * @returns Promise<{ verificationResult }> Verification Result
     */
    verify(params: {
        didDocument: object;
        verificationMethodId: string;
        challenge: string;
        domain?: string;
    }): Promise<object>;
    private _isValidMultibaseBase58String;
    createByClientSpec(params: {
        methodSpecificId: string;
        publicKey?: string;
        address: string;
        chainId: string;
        clientSpec: IClientSpec;
        verificationRelationships?: IVerificationRelationships[];
    }): Promise<object>;
    registerByClientSpec(params: {
        didDocument: object;
        signInfos: SignInfo[];
    }): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    updateByClientSpec(params: {
        didDocument: Did;
        versionId: string;
        signInfos: SignInfo[];
    }): Promise<{
        transactionHash: string;
    }>;
    deactivateByClientSpec(params: {
        didDocument: Did;
        signInfos: SignInfo[];
        versionId: string;
    }): Promise<{
        transactionHash: string;
    }>;
    signAndRegisterByClientSpec(params: {
        didDocument: any;
        address: string;
        verificationMethodId: string;
        web3: Web3 | any;
        clientSpec: IClientSpec;
        chainId?: string;
    }): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    signByClientSpec(params: {
        didDocument: object;
        clientSpec: IClientSpec;
        address: string;
        web3: Web3 | any;
        chainId?: string;
    }): Promise<{
        didDocument: Did;
        signature: string;
    }>;
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
        type: IKeyType;
        id?: string;
        controller?: string;
        publicKeyMultibase?: string;
        blockchainAccountId?: string;
    }): Promise<Did>;
}
//# sourceMappingURL=did.d.ts.map