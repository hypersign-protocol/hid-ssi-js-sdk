export default class Utils {
    static getUUID(): Promise<string>;
    static checkUrl(url: string): string;
    static _encodeMbKey(header: any, key: any): string;
    static _decodeMbKey(header: any, key: any): Uint8Array;
    static _decodeMbPubKey(header: any, key: any): string;
    static _bufToMultibase(pubKeyBuf: Uint8Array): string;
    static convertedStableLibKeysIntoEd25519verificationkey2020(stableLibKp: {
        privKey?: Uint8Array;
        publicKey?: string;
    }): {
        publicKeyMultibase: string;
        privateKeyMultibase: string;
    };
    static convertEd25519verificationkey2020toStableLibKeysInto(ed255192020VerKeys: {
        privKey?: string;
        publicKey?: string;
    }): {
        publicKeyMultibase: string;
        privateKeyMultibase: string;
    };
    static jsonToLdConvertor(json: any): {};
    static ldToJsonConvertor(ld: any): {};
    static getFee(): string;
}
//# sourceMappingURL=utils.d.ts.map