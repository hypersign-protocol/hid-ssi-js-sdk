/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "hypersignprotocol.hidnode.did";

export interface MsgDeleteDID {
  creator: string;
  did: string;
}

export interface MsgDeleteDIDResponse {
  success: boolean;
}

export interface MsgCreateDID {
  creator: string;
  did: string;
  didDocString: string;
  createdAt: string;
}

export interface MsgCreateDIDResponse {
  id: number;
}

const baseMsgDeleteDID: object = { creator: "", did: "" };

export const MsgDeleteDID = {
  encode(message: MsgDeleteDID, writer: Writer = Writer.create()): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.did !== "") {
      writer.uint32(18).string(message.did);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgDeleteDID {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDeleteDID } as MsgDeleteDID;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.did = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeleteDID {
    const message = { ...baseMsgDeleteDID } as MsgDeleteDID;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.did !== undefined && object.did !== null) {
      message.did = String(object.did);
    } else {
      message.did = "";
    }
    return message;
  },

  toJSON(message: MsgDeleteDID): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.did !== undefined && (obj.did = message.did);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgDeleteDID>): MsgDeleteDID {
    const message = { ...baseMsgDeleteDID } as MsgDeleteDID;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.did !== undefined && object.did !== null) {
      message.did = object.did;
    } else {
      message.did = "";
    }
    return message;
  },
};

const baseMsgDeleteDIDResponse: object = { success: false };

export const MsgDeleteDIDResponse = {
  encode(
    message: MsgDeleteDIDResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgDeleteDIDResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDeleteDIDResponse } as MsgDeleteDIDResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeleteDIDResponse {
    const message = { ...baseMsgDeleteDIDResponse } as MsgDeleteDIDResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },

  toJSON(message: MsgDeleteDIDResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgDeleteDIDResponse>): MsgDeleteDIDResponse {
    const message = { ...baseMsgDeleteDIDResponse } as MsgDeleteDIDResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
};

const baseMsgCreateDID: object = {
  creator: "",
  did: "",
  didDocString: "",
  createdAt: "",
};

export const MsgCreateDID = {
  encode(message: MsgCreateDID, writer: Writer = Writer.create()): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.did !== "") {
      writer.uint32(18).string(message.did);
    }
    if (message.didDocString !== "") {
      writer.uint32(26).string(message.didDocString);
    }
    if (message.createdAt !== "") {
      writer.uint32(34).string(message.createdAt);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreateDID {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreateDID } as MsgCreateDID;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.did = reader.string();
          break;
        case 3:
          message.didDocString = reader.string();
          break;
        case 4:
          message.createdAt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateDID {
    const message = { ...baseMsgCreateDID } as MsgCreateDID;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.did !== undefined && object.did !== null) {
      message.did = String(object.did);
    } else {
      message.did = "";
    }
    if (object.didDocString !== undefined && object.didDocString !== null) {
      message.didDocString = String(object.didDocString);
    } else {
      message.didDocString = "";
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = String(object.createdAt);
    } else {
      message.createdAt = "";
    }
    return message;
  },

  toJSON(message: MsgCreateDID): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.did !== undefined && (obj.did = message.did);
    message.didDocString !== undefined &&
      (obj.didDocString = message.didDocString);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreateDID>): MsgCreateDID {
    const message = { ...baseMsgCreateDID } as MsgCreateDID;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.did !== undefined && object.did !== null) {
      message.did = object.did;
    } else {
      message.did = "";
    }
    if (object.didDocString !== undefined && object.didDocString !== null) {
      message.didDocString = object.didDocString;
    } else {
      message.didDocString = "";
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = object.createdAt;
    } else {
      message.createdAt = "";
    }
    return message;
  },
};

const baseMsgCreateDIDResponse: object = { id: 0 };

export const MsgCreateDIDResponse = {
  encode(
    message: MsgCreateDIDResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreateDIDResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreateDIDResponse } as MsgCreateDIDResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateDIDResponse {
    const message = { ...baseMsgCreateDIDResponse } as MsgCreateDIDResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id);
    } else {
      message.id = 0;
    }
    return message;
  },

  toJSON(message: MsgCreateDIDResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreateDIDResponse>): MsgCreateDIDResponse {
    const message = { ...baseMsgCreateDIDResponse } as MsgCreateDIDResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = 0;
    }
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  CreateDID(request: MsgCreateDID): Promise<MsgCreateDIDResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  DeleteDID(request: MsgDeleteDID): Promise<MsgDeleteDIDResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  CreateDID(request: MsgCreateDID): Promise<MsgCreateDIDResponse> {
    const data = MsgCreateDID.encode(request).finish();
    const promise = this.rpc.request(
      "hypersignprotocol.hidnode.did.Msg",
      "CreateDID",
      data
    );
    return promise.then((data) =>
      MsgCreateDIDResponse.decode(new Reader(data))
    );
  }

  DeleteDID(request: MsgDeleteDID): Promise<MsgDeleteDIDResponse> {
    const data = MsgDeleteDID.encode(request).finish();
    const promise = this.rpc.request(
      "hypersignprotocol.hidnode.did.Msg",
      "DeleteDID",
      data
    );
    return promise.then((data) =>
      MsgDeleteDIDResponse.decode(new Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (true) {
  // util.Long = Long as any;
  configure();
}
