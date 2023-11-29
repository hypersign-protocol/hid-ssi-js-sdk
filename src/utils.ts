import { DidDocument as Did } from '../libs/generated/ssi/did';
import * as constants from './constants';
const { encode, decode } = require('base58-universal');
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';

export default class Utils {
  public static async getUUID(): Promise<string> {
    const edKeyPair = await Ed25519VerificationKey2020.generate();
    const exportedKp = await edKeyPair.export({ publicKey: true });
    return exportedKp.publicKeyMultibase;
  }

  public static checkUrl(url: string) {
    // TODO: check if the url is a valid url
    if (url.charAt(url.length - 1) === '/') {
      return url;
    } else {
      return (url = url + '/');
    }
  }

  static _encodeMbKey(header, key) {
    const mbKey = new Uint8Array(header.length + key.length);
    mbKey.set(header);
    mbKey.set(key, header.length);
    return 'z' + encode(mbKey);
  }

  static _decodeMbKey(header, key) {
    let mbKey = new Uint8Array(key); //header + orginaley
    mbKey = mbKey.slice(header.length);
    return mbKey; //Buffer.from(mbKey).toString('base64');
  }

  static _decodeMbPubKey(header, key) {
    let mbKey = new Uint8Array(key); //header + orginaley
    mbKey = mbKey.slice(header.length);
    return 'z' + encode(mbKey); //Buffer.from(mbKey).toString('base64');
  }

  public static _bufToMultibase(pubKeyBuf: Uint8Array) {
    return 'z' + encode(pubKeyBuf);
  }


  public static jsonToLdConvertor(json: any) {
    const ld = {} as Did;
    for (const key in json) {
      if (key === 'context') {
        ld['@' + key] = json[key];
      } else {
        ld[key] = json[key];
      }
    }
    return ld;
  }

  public static ldToJsonConvertor(ld: any) {
    const json = {};
    for (const key in ld) {
      if (key === '@context') {
        json['context'] = ld[key];
      } else {
        json[key] = ld[key];
      }
    }
    return json;
  }

  // TODO: need to find a way to make it dynamic
  public static getFee() {
    return 'auto';
  }

  public static removeEmptyString(obj: object): object {
    if (Array.isArray(obj)) {
      for (let i = obj.length - 1; i >= 0; i--) {
        if (obj[i] === '' || (typeof obj[i] === 'object' && Object.keys(obj[i]).length === 0)) {
          obj.splice(i, 1);
        } else if (typeof obj[i] === 'object') {
          this.removeEmptyString(obj[i])
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (obj[key] === '') {
            delete obj[key]
          } else if (Array.isArray(obj[key])) {
            this.removeEmptyString(obj[key]);
          } else if (typeof obj[key] === 'object') {
            this.removeEmptyString(obj[key])
          }
        }
      }
    }
    return obj
  }
  public static async fetchFee(methodName: string) {
    const url = constants.GAS_FEE_API_URL;
    const feeStructure = await fetch(url)
    const fee = await feeStructure.json()
    if (fee && fee[methodName]) {
      const amount = fee[methodName].amount;
      return amount;
    } else {
      throw new Error(`Fee not found for method: ${methodName}`);
    }
  }
}
