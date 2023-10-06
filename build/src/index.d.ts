import HypersignDID from './did/did';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { IClientSpec, IKeyType, ISignInfo, IVerificationRelationships } from './did/IDID';
import { Did } from '../libs/generated/ssi/did';
import { Schema } from '../libs/generated/ssi/schema';
declare class HypersignSSISdk {
    did: HypersignDID;
    private namespace;
    private signer;
    private nodeRpcEndpoint;
    private nodeRestEndpoint;
    private entityApiSecretKey;
    constructor(params: {
        offlineSigner: OfflineSigner;
        nodeRpcEndpoint?: string;
        nodeRestEndpoint?: string;
        namespace?: string;
        entityApiSecretKey?: string;
    });
    init(): Promise<void>;
}
export { HypersignSSISdk, HypersignDID, IVerificationRelationships, IKeyType, ISignInfo, IClientSpec, Did, Schema, };
//# sourceMappingURL=index.d.ts.map