import { IValidateAccesstokenResp, IgenerateToken } from './IAuth';
export declare class ApiAuth {
    private apiKey;
    constructor(apiKey: any);
    generateAccessToken(): Promise<IgenerateToken>;
    checkAndRefreshAToken(params: {
        accessToken: string;
    }): Promise<IValidateAccesstokenResp>;
}
//# sourceMappingURL=apiAuth.d.ts.map