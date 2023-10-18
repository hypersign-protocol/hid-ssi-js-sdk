export interface IAuth{
    generateAccessToken():Promise<IgenerateToken>
    checkAndRefreshAToken(params:{accessToken:string}):Promise<IValidateAccesstokenResp>
}

export interface IgenerateToken{
    access_token:string;
     expiresIn:number;
     tokenType:string;
}
export interface IValidateAccesstokenResp{
    valid:boolean;
    accessToken?:string
}