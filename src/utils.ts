import * as constants from "./constants";
const { encode, decode } = require("base58-universal");

export default class Utils {
  constructor() {}
  hostName({ mode }) {
    let nodeUrl;
    switch (mode) {
      case "live":
        nodeUrl = Utils.checkUrl(constants.HYPERSIGN_NETWORK_LIVE);
        break;
      case "test":
        nodeUrl = Utils.checkUrl(constants.HYPERSIGN_NETWORK_LIVE);
        break;
      default:
        throw new Error("Invalid mode");
    }
    return nodeUrl;
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


}
