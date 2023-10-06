import { IKeyManager, IKeyPair } from '../IKeyManager';
export default class Ed25519KeyManager implements IKeyManager {
    #private;
    constructor(params: {
        seed?: string | Uint8Array;
        controller?: string;
    });
    initiate(): Promise<IKeyPair>;
    get signer(): any;
    get publicKeyMultibase(): string | undefined;
    get id(): string | undefined;
    get type(): "Ed25519VerificationKey2020" | undefined;
}
//# sourceMappingURL=Ed25519KeyManager.d.ts.map