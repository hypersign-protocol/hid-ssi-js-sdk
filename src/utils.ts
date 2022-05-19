import * as constants from "./constants";
import axios from "axios";
import { DIDRpc, IDIDRpc } from './rpc/didRPC';
import { IHIDWallet } from "./wallet/wallet";

export default class Utils {
  nodeurl: string;
  didScheme: string;
  didRpc: IDIDRpc;
  constructor(options, wallet?) {
    this.didScheme = options.didScheme && options.didScheme != "" ?  options.didScheme : constants.DID_SCHEME
    this.nodeurl = Utils.checkUrl(options.nodeUrl);
    this.didRpc = new DIDRpc();
  }

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

  async fetchData(url) {
    const response = await axios.get(url);
    return response.data;
  }

}
