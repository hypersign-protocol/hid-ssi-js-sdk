import * as constants from "./constants";
import axios from "axios";
import IOptions from './IOptions';
import { DIDRpc, IDIDRpc } from './rpc/didRPC';
import { IHIDWallet } from "./wallet/wallet";
import protobuf from 'protobufjs'

export async function getByteArray(payload) {
  const DidProto = await protobuf.load('./proto/did.proto');
  const Did = DidProto.lookupType('hypersignprotocol.hidnode.ssi.Did');

  const byteArrayData = new Uint8Array(Did.encode(payload).finish())
  return byteArrayData
}

export default class Utils {
  nodeurl: string;
  didScheme: string;
  didRpc: IDIDRpc;
  constructor(options: IOptions, wallet?) {
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

  resolve = async (did) => {
    // const url = `${this.nodeurl}${constants.HYPERSIGN_NETWORK_DID_EP}${did}`;
    // const didDoc = await this.fetchData(url);
    // if (!didDoc) throw new Error("Could not resolve did =" + did);
    // if (didDoc["status"] === 500)
    //   throw new Error("Could not resolve did = " + did);
    // return didDoc;
    return await this.didRpc.resolveDID(did);
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
