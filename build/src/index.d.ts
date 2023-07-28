import HypersignDID from './did/did';
import HypersignVerifiableCredential from './credential/vc';
import HypersignVerifiablePresentation from './presentation/vp';
import HypersignSchema from './schema/schema';
import { OfflineSigner } from '@cosmjs/proto-signing';
import DidApi from './ssiApi/services/did/did.service';
declare class HypersignSSISdk {
    did: HypersignDID;
    vc: HypersignVerifiableCredential;
    vp: HypersignVerifiablePresentation;
    schema: HypersignSchema;
    didApi: DidApi;
    private namespace;
    private signer;
    private nodeRpcEndpoint;
    private nodeRestEndpoint;
    private apiKey;
    constructor(params: {
        offlineSigner: OfflineSigner;
        nodeRpcEndpoint?: string;
        nodeRestEndpoint?: string;
        namespace?: string;
        apiKey?: string;
    });
    init(): Promise<void>;
}
export { HypersignSSISdk, HypersignDID, DidApi, HypersignSchema, HypersignVerifiableCredential, HypersignVerifiablePresentation, };
//# sourceMappingURL=index.d.ts.map