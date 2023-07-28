import { Did } from '../../../../libs/generated/ssi/did';
import { IDIDResolve } from '../../../did/IDID';
import { IDidApi, IGenerateDid, IRegister, IUpdate } from './IDid';
export default class DidApi implements IDidApi {
    private authService;
    private accessToken;
    constructor(apiKey: string);
    private initAccessToken;
    /**
     * Create a new DID Document from api
     * @param
     * - params.namespace                          : namespace of did id, Default "di:hid"
     * - params.methoSpecificId                    : Optional, methodSpecificId (min 32 bit alphanumeric) else it will generate new random methodSpecificId or may be walletaddress
     * - params.options                            : Optional, options for providing some extra information
     * - params.options.keyType                    : Optional, keyType used for verification
     * - params.options.chainId                    : Optional, chainId
     * - params.options.publicKey                  : Optional, publicKey 'Public Key' extracted from keplr wallet
     * - params.options.walletAddress              : Optional, walletAdress is Checksum address from web3 wallet
     * - params.options.verificationRelationships  : Optional, verification relationships  where you want to add your verificaiton method ids
     * @returns {Promise<Did>}  DidDocument object
     */
    generateDid(params: IGenerateDid): Promise<Did>;
    /**
      * Register a new DID and Document in Hypersign blockchain - an onchain activity
      * @params
      * - params.didDocument                       : LD did document
      * - params.verificationMethodId              : VerificationMethodId of the document
      * - params.signInfos[]                       : Optional, signInfos array of verificationId, signature and clientSpec
      * - params.signInfos.verification_method_id  : VerificationMethodId of the document
      * - params.signInfos.signature               : Signature for clientSpec
      * - params.signInfos.clientSpec              : ClientSpec
      * @return {Promise<didDocument:Did, transactionHash: string>}
      */
    registerDid(params: IRegister): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    /**
     * @params
     * - params.did         : Did document Id
     * @returns {Promise<IDIDResolve>}  didDocument and didDocumentMetadata
     */
    resolveDid(params: {
        did: string;
    }): Promise<IDIDResolve>;
    /**
      * Update a DIDDocument in Hypersign blockchain - an onchain activity
      * - params.didDocument                       : LD did document
      * - params.verificationMethodId              : VerificationMethodId of the document
      * - params.deactivate                        : deactivate Field to check if to deactivate did or to update it
      * - params.signInfos[]                       : Optional, signInfos array of verificationId, signature and clientSpec
      * - params.signInfos.verification_method_id  : VerificationMethodId of the document
      * - params.signInfos.signature               : Signature for clientSpec
      * - params.signInfos.clientSpec              : ClientSpec
      * @return {Promise<transactionHash: string>}
      */
    updateDid(params: IUpdate): Promise<{
        transactionHash: string;
    }>;
}
//# sourceMappingURL=did.service.d.ts.map