import { Did } from '../../../../libs/generated/ssi/did';
import { IDIDResolve } from '../../../did/IDID';
import { IGenerateDid, IRegister } from '../IDid';
export declare class DID {
    private authService;
    private accessToken;
    constructor(apiKey: string);
    private initAccessToken;
    generateDid(params: IGenerateDid): Promise<any>;
    registerDid(params: IRegister): Promise<{
        didDocument: Did;
        transactionHash: string;
    }>;
    resolveDid(params: {
        did: string;
    }): Promise<IDIDResolve>;
}
//# sourceMappingURL=did.service.d.ts.map