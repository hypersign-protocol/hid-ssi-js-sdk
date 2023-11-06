import HypersignDID from './did/did';
import HypersignVerifiableCredential from './credential/vc';
import HypersignVerifiablePresentation from './presentation/vp';
import HypersignSchema from './schema/schema';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { IClientSpec, ISignInfo } from './did/IDID';
import { VerificationMethodTypes as IKeyType } from '../libs/generated/ssi/client/enums';
import { VerificationMethodRelationships as IVerificationRelationships } from '../libs/generated/ssi/client/enums';
import { DidDocument as Did } from '../libs/generated/ssi/did';
import { IVerifiableCredential } from './credential/ICredential';
import { CredentialSchemaDocument as Schema } from '../libs/generated/ssi/credential_schema';
import { IVerifiablePresentation } from './presentation/IPresentation';
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
export { HypersignSSISdk, HypersignDID, HypersignSchema, HypersignVerifiableCredential, HypersignVerifiablePresentation, IVerificationRelationships, IKeyType, ISignInfo, IClientSpec, Did, IVerifiableCredential, IVerifiablePresentation, Schema, };
//# sourceMappingURL=index.d.ts.map