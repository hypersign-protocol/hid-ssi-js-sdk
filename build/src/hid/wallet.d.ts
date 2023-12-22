export interface IHIDWallet {
    rpc: string;
    mnemonic: string;
    account: string;
    connectSigner(registry?: any): Promise<any>;
    signAndBroadcastMessages(message: object, fee: object, memo?: string): Promise<any>;
    transferTokens(recipientAddress: string, amount: Array<object>, fee: object, memo?: string): Promise<any>;
    init(): Promise<any>;
    getFee(): object;
}
export declare class HIDWallet implements IHIDWallet {
    mnemonic: string;
    wallet: any;
    rpc: string;
    client: any;
    account: string;
    constructor({ mnemonic, rpc }: {
        mnemonic: any;
        rpc: any;
    });
    private createWallet;
    encryptWalletWithPassword(password: any): Promise<any>;
    recoverWalletFromPassword(encryptedWalletStr: any, password: any): Promise<void>;
    private setAccounts;
    /**
     * step 1: Initiates the wallet
     */
    init(): Promise<void>;
    connectSigner(registry?: any): Promise<void>;
    getFee(): object;
    signAndBroadcastMessages(message: object, fee?: object, memo?: string): Promise<any>;
    transferTokens(recipientAddress: string, amount: Array<object>, fee?: object, memo?: string): Promise<any>;
    fundWalletViaFaucet(recipientAddress: string): Promise<string>;
    balance(): Promise<any>;
}
//# sourceMappingURL=wallet.d.ts.map