import { DidDocument as Did } from '../../../../libs/generated/ssi/did';
import { IClientSpec, IDIDResolve } from '../../../did/IDID';
import { APIENDPOINT } from '../../api-constant';
import { IAuth, IValidateAccesstokenResp } from '../../apiAuth/IAuth';
import { ApiAuth } from '../../apiAuth/apiAuth';
import { IDidApiService, IGenerateDid, IRegister, IUpdate } from './IDIDApi';
import fetch from 'node-fetch';

export default class DidApiService implements IDidApiService {
  private authService: IAuth;
  private accessToken;
  constructor(apiKey: string) {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('HID-SSI_SDK:: Error: Please Provide apiKey');
    }
    this.authService = new ApiAuth(apiKey);
  }

  public async auth() {
    const accessToken = await this.authService.generateAccessToken();
    this.accessToken = accessToken.access_token;
  }
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
  public async generateDid(params: IGenerateDid): Promise<Did> {
    if (!params.namespace) {
      throw new Error('HID-SSI-SDK:: Error: params.namespace is required to generate new did doc ');
    }
    const isAccessTokenValid: IValidateAccesstokenResp = await this.authService.checkAndRefreshAToken({ accessToken: this.accessToken })
    if (!isAccessTokenValid.valid) {
      this.accessToken = isAccessTokenValid.accessToken
    }
    const apiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.DID.CREATE_DID_ENDPOINT}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
      origin: `${APIENDPOINT.STUDIO_API_ORIGIN}`
    };
    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...params }),
    };
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(`HID-SSI-SDK:: Error: ${result.message}`);
    }
    const { metaData } = result;
    return metaData.didDocument;
  }
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
  public async registerDid(params: IRegister): Promise<{ didDocument: Did; transactionHash: string }> {
    if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to register a did');
    }
    if (!params.signInfos) {
      if (!params.verificationMethodId) {
        throw new Error('HID-SSI-SDK:: Error: either params.verificationMethodId or params.signInfos is required to register a did')
      }
    }
    if (params.signInfos && params.signInfos.length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to register a did');
    }
    if (params.signInfos && params.signInfos.length > 0) {
      for (const i in params.signInfos) {
        if (!params.signInfos[i].verification_method_id) {
          throw new Error(
            `HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to register a did`
          );
        }
        // if (!params.signInfos[i].clientSpec) {
        //   throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].clientSpec is required to register a did`);
        // }

        // if (params.signInfos[i].clientSpec && !(params.signInfos[i].clientSpec.type in IClientSpec)) {
        //   throw new Error('HID-SSI-SDK:: Error: params.clientSpec is invalid');
        // }          
        if (params.signInfos[i].clientSpec?.type === IClientSpec['cosmos-ADR036']) {
          if (
            params.signInfos[i].clientSpec?.adr036SignerAddress === '' ||
            params.signInfos[i].clientSpec?.adr036SignerAddress === undefined
          ) {
            throw new Error(
              `HID-SSI-SDK:: Error: params.signInfos[${i}].adr036SignerAddress is required to register a did, when clientSpec type is${params.signInfos[i].clientSpec?.type} `
            );
          }
        }

        if (!params.signInfos[i].signature) {
          throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to register a did`);
        }
      }
    }
    const isAccessTokenValid: IValidateAccesstokenResp = await this.authService.checkAndRefreshAToken({ accessToken: this.accessToken })
    if (!isAccessTokenValid.valid) {
      this.accessToken = isAccessTokenValid.accessToken
    }
    const apiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.DID.REGISTER_DID_ENDPOINT}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
      origin: `${APIENDPOINT.STUDIO_API_ORIGIN}`
    };
    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...params }),
    };
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(`HID-SSI-SDK:: Error: ${result.message}`);
    }
    const { metaData } = result;
    return { didDocument: metaData.didDocument, transactionHash: result.transactionHash };
  }
  /**
   * @params
   * - params.did         : Did document Id 
   * @returns {Promise<IDIDResolve>}  didDocument and didDocumentMetadata
   */
  public async resolveDid(params: { did: string }): Promise<IDIDResolve> {
    if (!params.did) {
      throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
    }
    const isAccessTokenValid: IValidateAccesstokenResp = await this.authService.checkAndRefreshAToken({ accessToken: this.accessToken })
    if (!isAccessTokenValid.valid) {
      this.accessToken = isAccessTokenValid.accessToken
    }
    const apiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.DID.RESOLVE_DID_ENDPOINT}/${params.did}`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      origin: `${APIENDPOINT.STUDIO_API_ORIGIN}`
    };
    const requestOptions = {
      method: 'GET',
      headers,
    };
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(`HID-SSI-SDK:: Error: ${result.message}`);
    }
    return result;
  }
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

  public async updateDid(params: IUpdate): Promise<{ transactionHash: string }> {
    console.log('did services')
    if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to update a did');
    }
    if (!params.signInfos) {
      if (!params.verificationMethodId) {
        throw new Error('HID-SSI-SDK:: Error: either params.verificationMethodId or params.signInfos is required to update a did')
      }
    }
    if (params.signInfos && params.signInfos.length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.signInfos is required to update a did');
    }
    if (params.signInfos && params.signInfos.length > 0) {
      for (const i in params.signInfos) {
        if (!params.signInfos[i].verification_method_id) {
          throw new Error(
            `HID-SSI-SDK:: Error: params.signInfos[${i}].verification_method_id is required to update a did`
          );
        }
        if (params.signInfos[i].clientSpec?.type === IClientSpec['cosmos-ADR036']) {
          if (
            params.signInfos[i].clientSpec?.adr036SignerAddress === '' ||
            params.signInfos[i].clientSpec?.adr036SignerAddress === undefined
          ) {
            throw new Error(
              `HID-SSI-SDK:: Error: params.signInfos[${i}].adr036SignerAddress is required to update a did, when clientSpec type is${params.signInfos[i].clientSpec?.type} `
            );
          }
        }

        if (!params.signInfos[i].signature) {
          throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].signature is required to register a did`);
        }
      }
    }
    const isAccessTokenValid: IValidateAccesstokenResp = await this.authService.checkAndRefreshAToken({ accessToken: this.accessToken })
    if (!isAccessTokenValid.valid) {
      this.accessToken = isAccessTokenValid.accessToken
    }
    const apiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.DID.UPDATE_DID_ENDPOINT}`
    const headers = {
      'Content-Type': "application/json",
      Authorization: `Bearer ${this.accessToken}`,
      origin: `${APIENDPOINT.STUDIO_API_ORIGIN}`
    }
    const requestOptions = {
      method: "PATCH",
      headers,
      body: JSON.stringify({ ...params })
    }
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(`HID-SSI-SDK:: Error: ${result.message}`)
    }
    return result
  }
}