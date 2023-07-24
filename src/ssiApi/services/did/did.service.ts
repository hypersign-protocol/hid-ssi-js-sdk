import { Did } from '../../../../libs/generated/ssi/did';
import { IClientSpec, IDIDResolve } from '../../../did/IDID';
import { APIENDPOINT } from '../../api-constant';
import { IAuth } from '../../apiAuth/IAuth';
import { ApiAuth } from '../../apiAuth/apiAuth';
import { IGenerateDid, IRegister, IUpdate } from '../IDid';
import fetch from 'node-fetch';

export class DID {
  private authService: IAuth;
  private accessToken;
  constructor(apiKey: string) {
    this.authService = new ApiAuth(apiKey);
    this.initAccessToken();
  }

  private async initAccessToken() {
    const accessToken = await this.authService.generateAccessToken();
    this.accessToken = accessToken.access_token;
  }
  public async generateDid(params: IGenerateDid) {
    if (!params.namespace) {
      throw new Error('HID-SSI-SDK:: Error: params.namespace is required to generate new did doc ');
    }
    const apiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.DID.CREATE_DID_ENDPOINT}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    };
    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...params }),
    };
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    console.log(result);
    // need to add scenario of checking if token is expired or not
    // can be done either by directly call in studio-api and then based on error regenerate it
    // or add jwt package to validate its expiry
    if (!response.ok) {
      throw new Error(`HID-SSI-SDK:: Error: ${result.message}`);
    }
    const { metaData } = result;
    return metaData.didDocument;
  }

  public async registerDid(params: IRegister): Promise<{ didDocument: Did; transactionHash: string }> {
    if (!params.didDocument || Object.keys(params.didDocument).length === 0) {
      throw new Error('HID-SSI-SDK:: Error: params.didDocument is required to register a did');
    }
    if(!params.signInfos){
      if(!params.verificationMethodId){
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
        if (!params.signInfos[i].clientSpec) {
          throw new Error(`HID-SSI-SDK:: Error: params.signInfos[${i}].clientSpec is required to register a did`);
        }
        if (!(params.signInfos[i].clientSpec.type in IClientSpec)) {
          throw new Error('HID-SSI-SDK:: Error:  params.clientSpec is invalid');
        }
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
    const apiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.DID.REGISTER_DID_ENDPOINT}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
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

  public async resolveDid(params: { did: string }): Promise<IDIDResolve> {
    if (!params.did) {
      throw new Error('HID-SSI-SDK:: Error: params.did is required to resolve a did');
    }
    const apiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.DID.RESOLVE_DID_ENDPOINT}/${params.did}`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
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

  // public async updateDid(params:IUpdate){

  // }
}
