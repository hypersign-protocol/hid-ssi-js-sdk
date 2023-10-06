export type KeyType = 'Ed25519VerificationKey2020' | 'Ed25519VerificationKey2020';
export interface IKeyPair {
    id?: string;
    type: KeyType;
    publicKeyMultibase: string;
    privateKeyMultibase?: string;
}
export interface IKeyManager {
    initiate(): Promise<IKeyPair>;
}
//# sourceMappingURL=IKeyManager.d.ts.map