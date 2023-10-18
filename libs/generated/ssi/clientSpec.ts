/* eslint-disable */
import { Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "hypersignprotocol.hidnode.ssi";

export interface ClientSpec {
  type: string;
  adr036SignerAddress: string;
}

const baseClientSpec: object = { type: "", adr036SignerAddress: "" };

export const ClientSpec = {
  encode(message: ClientSpec, writer: Writer = Writer.create()): Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.adr036SignerAddress !== "") {
      writer.uint32(18).string(message.adr036SignerAddress);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ClientSpec {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseClientSpec } as ClientSpec;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.adr036SignerAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClientSpec {
    const message = { ...baseClientSpec } as ClientSpec;
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (
      object.adr036SignerAddress !== undefined &&
      object.adr036SignerAddress !== null
    ) {
      message.adr036SignerAddress = String(object.adr036SignerAddress);
    } else {
      message.adr036SignerAddress = "";
    }
    return message;
  },

  toJSON(message: ClientSpec): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.adr036SignerAddress !== undefined &&
      (obj.adr036SignerAddress = message.adr036SignerAddress);
    return obj;
  },

  fromPartial(object: DeepPartial<ClientSpec>): ClientSpec {
    const message = { ...baseClientSpec } as ClientSpec;
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (
      object.adr036SignerAddress !== undefined &&
      object.adr036SignerAddress !== null
    ) {
      message.adr036SignerAddress = object.adr036SignerAddress;
    } else {
      message.adr036SignerAddress = "";
    }
    return message;
  },
};

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
