import HypersignDID from './did/did';
import HypersignVerifiableCredential from './credential/vc';
import HypersignVerifiablePresentation from './presentation/vp';
import HypersignSchema from './schema/schema';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { IClientSpec, IKeyType, ISignInfo, IVerificationRelationships } from './did/IDID';
import { Did } from '../libs/generated/ssi/did';
import { IVerifiableCredential } from './credential/ICredential';
declare class HypersignSSISdk {
    did: HypersignDID;
    vc: HypersignVerifiableCredential;
    vp: HypersignVerifiablePresentation;
    schema: HypersignSchema;
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
export { HypersignSSISdk, HypersignDID, HypersignSchema, HypersignVerifiableCredential, HypersignVerifiablePresentation, IVerificationRelationships, IKeyType, ISignInfo, IClientSpec, Did, IVerifiableCredential, };
//# sourceMappingURL=index.d.ts.map