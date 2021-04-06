import * as constants from "./constants";
import axios from "axios";
import IOptions from './IOptions';

export default class Utils {
  nodeurl: string;
  didScheme: string;
  constructor(options: IOptions) {
    this.didScheme = options.didScheme && options.didScheme != "" ?  options.didScheme : constants.DID_SCHEME
    this.nodeurl = this.checkUrl(options.nodeUrl);
  }

  hostName({ mode }) {
    let nodeUrl;
    switch (mode) {
      case "live":
        nodeUrl = this.checkUrl(constants.HYPERSIGN_NETWORK_LIVE);
        break;
      case "test":
        nodeUrl = this.checkUrl(constants.HYPERSIGN_NETWORK_LIVE);
        break;
      default:
        throw new Error("Invalid mode");
    }
    return nodeUrl;
  }

  checkUrl(url: string) {
    if (url.charAt(url.length - 1) === "/") {
      return url;
    } else {
      return (url = url + "/");
    }
  }

  async fetchData(url) {
      try{
        const response = await axios.get(url);
        return response.data;
      }catch(e){
        const { response } = e;
        return response.data;
      }
  }

  resolve = async (did) => {
    const url = `${this.nodeurl}${constants.HYPERSIGN_NETWORK_DID_EP}${did}`;
    const didDoc = await this.fetchData(url);
    if (!didDoc) throw new Error("Could not resolve did =" + did);
    if (didDoc["status"] === 500)
      throw new Error("Could not resolve did = " + did);
    return didDoc;
  };

  getControllerAndPublicKeyFromDid = async (did, type) => {
    let controller = {},
      publicKey = {};
    did = did.split("#")[0];
    let didDoc = await this.resolve(did);

    let methodType = didDoc[type];
    publicKey = didDoc["publicKey"].find((x) => x.id == methodType[0]);
    if (!publicKey["controller"]) {
      controller = {
        "@context": "https://w3id.org/security/v2",
        id: did,
      };
      controller[type] = methodType;
    } else {
      controller = publicKey["controller"];
    }

    return {
      controller,
      publicKey,
      didDoc,
    };
  };
}
