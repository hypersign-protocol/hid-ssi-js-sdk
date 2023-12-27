import { Registry } from "@cosmjs/proto-signing";
import { HIDRpcEnums } from './constants';
export interface IHIDRpcFactory {
    registerRpc: any;
}
export declare class HIDRpcFactory implements IHIDRpcFactory {
    hidRPCRegistery: Registry;
    constructor();
    registerRpc(rpcName: HIDRpcEnums): void;
}
//# sourceMappingURL=rpcFactory.d.ts.map