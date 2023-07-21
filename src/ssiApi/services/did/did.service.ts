import { IAuth } from "../../apiAuth/IAuth"
import { ApiAuth } from "../../apiAuth/apiAuth"
import { IGenerateDid } from "../IDid"
import fetch from "node-fetch"

export class DID {
  private authService: IAuth
  private accessToken
  constructor(apiKey: string) {
    this.authService = new ApiAuth(apiKey);
    this.initAccessToken()
  }

  private async initAccessToken() {
    const accessToken = await this.authService.generateAccessToken()
    this.accessToken = accessToken.access_token
  }
  public async generateDid(params: IGenerateDid) {
    const apiUrl = "https://api.entity.hypersign.id/api/v1/did/create"
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.accessToken}`,
      Origin: "https://entity.hypersign.id"
    }
    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify({ ...params })
    }
    const response = await fetch(apiUrl, requestOptions)
    if (!response.ok) {
      // need to figure out how to send correct error message as not getting exact message from studio
      throw new Error('HID-SSI_SDK:: Error: Issue in generating did')
    }
    const { metaData } = await response.json()
    return metaData.didDocument
  }

}




// const test = new DID("c4dae4b264f98798920ad22456c6f.acd24a3adeaed7fddf86044925d419afc252ada299b018e961ed3ac3ae2d1aaebd577eb0550c2c011fd9f51d33097d88a")
const test = new DID("586a74602fffda655f186ca9c162f.445dbab93f8b3b24501a9bdb1254de6a1528d4db306d87e2674f2277ddcc40a5b6686c4b2fe996ae11509d72eb4bb0d38")

console.log(test, "test")