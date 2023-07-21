export interface IAuth{
    generateAccessToken():Promise<IgenerateToken>
}

export interface IgenerateToken{
    access_token:string;
     expiresIn:number;
     tokenType:string;
}