import { DidDocument as Did } from '../libs/generated/ssi/did';
export default class Utils {
    static getUUID(): Promise<string>;
    static checkUrl(url: string): string;
    static _encodeMbKey(header: any, key: any): string;
    static _decodeMbKey(header: any, key: any): Uint8Array;
    static _decodeMbPubKey(header: any, key: any): string;
    static _bufToMultibase(pubKeyBuf: Uint8Array): string;
    static jsonToLdConvertor(json: any): Did;
    static ldToJsonConvertor(ld: any): {};
    static getFee(): string;
    static removeEmptyString(obj: object): object;
    static fetchFee(methodName: string, baseUrl: any): Promise<any>;
}
//# sourceMappingURL=utils.d.ts.map