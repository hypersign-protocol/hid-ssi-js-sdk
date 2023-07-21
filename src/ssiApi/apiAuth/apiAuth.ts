import fetch from "node-fetch"
import { IgenerateToken } from "./IAuth";
export class ApiAuth {
    private apiKey: string;
    constructor(apiKey) {
        if (!apiKey || apiKey.trim() === "") {
            throw new Error("HID-SSI_SDK:: Error: Please Provide apiKey")
        }
        this.apiKey = apiKey
    }
    async generateAccessToken(): Promise<IgenerateToken> {
        const studioApiUrl = "https://api.entity.hypersign.id/api/v1/app/oauth"
        const headers = {
            "X-Api-Secret-Key": this.apiKey,
            "Origin": "https://entity.hypersign.id"
        }
        const requestOptions = {
            method: "POST",
            headers,
        }
        const response = await fetch(studioApiUrl, requestOptions)
        if (!response.ok) {
            // what error to send not getting error message from api
            throw new Error('HID-SSI_SDK:: Error: Unauthorized')
        }
        const authToken = await response.json()
        return authToken
    }
}
