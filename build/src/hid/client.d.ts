import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
export declare class HIDClient {
    private static hidNodeClient;
    private static hidWalletAddress;
    private signer;
    private registry;
    static hidNodeEndpoint: string;
    static hidNodeRestEndpoint: string | undefined;
    constructor(signer: OfflineSigner, hidNodeEndpoint: string, // 'TEST' | 'MAIN' | <custom node url>
    hidNodeRestEndpoint?: string);
    init(): Promise<void>;
    static getHidClient(): SigningStargateClient;
    static getHidWalletAddress(): string;
}
//# sourceMappingURL=client.d.ts.map