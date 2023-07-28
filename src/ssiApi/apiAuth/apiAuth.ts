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

// const test= new ApiAuth(   '286d30b3e009714679904dbb16f97.8c2cd0db41a845bae96b3837a5df159fbf0a881b4f31d5a2d5a35a5d42978e95d428dbd8e57c38d973c73c050b409b7c1')
// // const result= test.checkAndRefreshToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImQ2N2NkNjEyNTE2NzY0MmEyMjhjNzRjNTcwZGU5YjZjYzQ0OCIsInVzZXJJZCI6InZhcnNoYWt1bWFyaTM3MEBnbWFpbC5jb20iLCJncmFudFR5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJpYXQiOjE2OTAxMjk2OTgsImV4cCI6MTY5MDE0NDA5OH0.yc7Ly8XKNmevTe8LjQTOoYFuKVDljjzZdwUfzNZXsbo")
// // const newToen= test.generateAccessToken()
//  const result2= test.checkAndRefreshToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImQ2N2NkNjEyNTE2NzY0MmEyMjhjNzRjNTcwZGU5YjZjYzQ0OCIsInVzZXJJZCI6InZhcnNoYWt1bWFyaTM3MEBnbWFpbC5jb20iLCJncmFudFR5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJpYXQiOjE2OTA1Mjc1NDQsImV4cCI6MTY5MDU0MTk0NH0.kIl2zIjuJa-keotjP5B18KM3HzTBq3T-_-vRdLqkr7w')
