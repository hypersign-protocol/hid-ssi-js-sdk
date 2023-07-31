/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
import { Did as IDidProto, SignInfo } from '../../libs/generated/ssi/did';
import { IDIDResolve, IDIDRpc, DeliverTxResponse } from './IDID';
import { OfflineSigner } from '@cosmjs/proto-signing';
export declare class DIDRpc implements IDIDRpc {
    private didRestEp;
    private hidClient;
    constructor({ offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, }: {
        offlineSigner?: OfflineSigner;
        nodeRpcEndpoint: string;
        nodeRestEndpoint: string;
    });
    init(): Promise<void>;
    registerDID(didDoc: IDidProto, signInfos: SignInfo[]): Promise<DeliverTxResponse>;
    updateDID(didDoc: IDidProto, signInfos: SignInfo[], versionId: string): Promise<DeliverTxResponse>;
    deactivateDID(did: string, signInfos: SignInfo[], versionId: string): Promise<DeliverTxResponse>;
    resolveDID(did: string): Promise<IDIDResolve>;
}
//# sourceMappingURL=didRPC.d.ts.map