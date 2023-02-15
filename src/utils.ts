import * as constants from "./constants";
const { encode, decode } = require("base58-universal");
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';

export default class Utils {

  public static async getUUID(): Promise<string> {
    const edKeyPair = await Ed25519VerificationKey2020.generate();
    const exportedKp = await edKeyPair.export({ publicKey: true });
    const { publicKeyMultibase: publicKeyMultibase1 } = this.convertEd25519verificationkey2020toStableLibKeysInto({
      publicKey: exportedKp.publicKeyMultibase,
    });
    return publicKeyMultibase1;
  }
  
  public static checkUrl(url: string) {
    // TODO: check if the url is a valid url
    if (url.charAt(url.length - 1) === "/") {
      return url;
    } else {
      return (url = url + "/");
    }
  }

  static _encodeMbKey(header, key) {
    const mbKey = new Uint8Array(header.length + key.length);
    mbKey.set(header);
    mbKey.set(key, header.length);
    return "z" + encode(mbKey);
  }

  static _decodeMbKey(header, key) {
    let mbKey = new Uint8Array(key); //header + orginaley
    mbKey = mbKey.slice(header.length);
    return mbKey; //Buffer.from(mbKey).toString('base64');
  }


  static _decodeMbPubKey(header, key) {
    let mbKey = new Uint8Array(key); //header + orginaley
    mbKey = mbKey.slice(header.length);
    return "z" + encode(mbKey); //Buffer.from(mbKey).toString('base64');
  }
  

  public static _bufToMultibase(pubKeyBuf: Uint8Array){
    return "z"+encode(
      pubKeyBuf
    );
  }
  
  // Converting 45byte public key to 48 by padding header 
  // Converting 88byte private key to 91 by padding header
  public static convertedStableLibKeysIntoEd25519verificationkey2020(stableLibKp: {
    privKey?: Uint8Array;
    publicKey?: string;
  }): {publicKeyMultibase: string, privateKeyMultibase: string} {
    const result = {} as {publicKeyMultibase: string, privateKeyMultibase: string};
    if(stableLibKp.publicKey){
      const stableLibPubKeyWithoutZ = stableLibKp.publicKey.substr(1);
      const stableLibPubKeyWithoutZDecode = decode(stableLibPubKeyWithoutZ);
      result['publicKeyMultibase'] = Utils._encodeMbKey(
        constants.KEY_HEADERS.MULTICODEC_ED25519_PUB_HEADER,
        stableLibPubKeyWithoutZDecode
      );
    }
    
    if(stableLibKp.privKey){
      result['privateKeyMultibase'] = Utils._encodeMbKey(
        constants.KEY_HEADERS.MULTICODEC_ED25519_PRIV_HEADER,
        stableLibKp.privKey
      );
    }
    
    return result;
  }

  public static convertEd25519verificationkey2020toStableLibKeysInto(ed255192020VerKeys: {
    privKey?: string;
    publicKey?: string;
  }): {publicKeyMultibase: string, privateKeyMultibase: string} {
    const result = {} as {publicKeyMultibase: string, privateKeyMultibase: any};
    if(ed255192020VerKeys.publicKey){
      const stableLibPubKeyWithoutZ = ed255192020VerKeys.publicKey.substr(1);
      const stableLibPubKeyWithoutZDecode = decode(stableLibPubKeyWithoutZ);
      result['publicKeyMultibase'] = Utils._decodeMbPubKey(
        constants.KEY_HEADERS.MULTICODEC_ED25519_PUB_HEADER,
        stableLibPubKeyWithoutZDecode
      );
    }

    // privateKeyMultibase = z + encode(header+original)
    if(ed255192020VerKeys.privKey){
      const stableLibPrivKeyWithoutZ = ed255192020VerKeys.privKey.substr(1);
      const stableLibPrivKeyWithoutZDecode = decode(stableLibPrivKeyWithoutZ);
      result['privateKeyMultibase'] = Utils._decodeMbKey(
        constants.KEY_HEADERS.MULTICODEC_ED25519_PRIV_HEADER,
        stableLibPrivKeyWithoutZDecode
      );
    }
    
    return result;
  }


  public static jsonToLdConvertor(json: any) {
    const ld = {};
    for (const key in json) {
      if (key === "context") {
        ld['@'+key] = json[key];
      } else {
        ld[key] = json[key]
      }
    }
    return ld;
  }

  public static ldToJsonConvertor(ld: any) {
    const json = {};
    for (const key in ld) {
      if (key === "@context") {
        json['context'] = ld[key];
      } else {
        json[key] = ld[key]
      }
    }
    return json;
  }
  

  // TODO: need to find a way to make it dynamic
  public static getFee(){
    return "auto";
  }

}
