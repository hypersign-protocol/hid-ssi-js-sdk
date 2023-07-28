import fetch from 'node-fetch';
import { IValidateAccesstokenResp, IgenerateToken } from './IAuth';
import { APIENDPOINT } from '../api-constant';
import jwt from "jsonwebtoken"
export class ApiAuth {
  private apiKey: string;
  constructor(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('HID-SSI_SDK:: Error: Please Provide apiKey');
    }
    this.apiKey = apiKey;
  }
  public async generateAccessToken(): Promise<IgenerateToken> {
    const studioApiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.AUTH}`;
    const headers = {
      'X-Api-Secret-Key': this.apiKey,
    };
    const requestOptions = {
      method: 'POST',
      headers,
    };
    const response = await fetch(studioApiUrl, requestOptions);
    const authToken = await response.json();
    if (!response.ok) {
      throw new Error(`HID-SSI-SDK:: Error: ${authToken.message}`);
    }
    return authToken;
  }

  public async checkAndRefreshAToken(params:{accessToken:string}):Promise<IValidateAccesstokenResp>{
   try{
     const decodeToken= jwt.decode(params.accessToken,{complete: true});
     if(!decodeToken){
      throw new Error('HID-SSI-SDK:: Error: Token is invalid or malformed')
     }
     const currentTime= Math.floor(Date.now() / 1000);
     if(currentTime>=decodeToken.payload.exp){
     const {access_token}= await this.generateAccessToken()
     return {valid:false,accessToken:access_token }
     }else{
      return {valid:true}
     }
   }catch(e){
    throw new Error(`HID-SSI-SDK:: Error: ${e}`);
   }
  }
}
