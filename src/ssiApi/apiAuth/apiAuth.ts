import fetch from "node-fetch"
import { IgenerateToken } from "./IAuth";
import {APIENDPOINT} from "../api-constant"
export class ApiAuth {
    private apiKey: string;
    constructor(apiKey) {
        if (!apiKey || apiKey.trim() === "") {
            throw new Error("HID-SSI_SDK:: Error: Please Provide apiKey")
        }
        this.apiKey = apiKey
    }
    async generateAccessToken(): Promise<IgenerateToken> {
            const studioApiUrl = `${APIENDPOINT.STUDIO_API_BASE_URL}${APIENDPOINT.AUTH}`
            const headers = {
                "X-Api-Secret-Key": this.apiKey,
            }
            const requestOptions = {
                method: "POST",
                headers,
            }
            const response = await fetch(studioApiUrl, requestOptions)
            const authToken = await response.json()
            if (!response.ok) {
                throw new Error(`HID-SSI-SDK:: Error: ${authToken.message}`)
            }
            return authToken
       
       
    }
}
