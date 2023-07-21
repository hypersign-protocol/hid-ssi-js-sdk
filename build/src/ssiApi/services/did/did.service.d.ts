import { IGenerateDid } from "../IDid";
export declare class DID {
    private authService;
    private accessToken;
    constructor(apiKey: string);
    private initAccessToken;
    generateDid(params: IGenerateDid): Promise<any>;
}
//# sourceMappingURL=did.service.d.ts.map