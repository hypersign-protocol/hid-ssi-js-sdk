/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ClientSpecType, clientSpecTypeFromJSON, clientSpecTypeToJSON, clientSpecTypeToNumber } from "./client_spec";

export const protobufPackage = "hypersign.ssi.v1";

export interface DocumentProof {
  type?: string | undefined;
  created?: string | undefined;
  verificationMethod?: string | undefined;
  proofPurpose?: string | undefined;
  proofValue?: string | undefined;
  clientSpecType?: ClientSpecType | undefined;
}

function createBaseDocumentProof(): DocumentProof {
  return {};
}

export const DocumentProof = {
  encode(message: DocumentProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== undefined && message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.created !== undefined && message.created !== "") {
      writer.uint32(18).string(message.created);
    }
    if (message.verificationMethod !== undefined && message.verificationMethod !== "") {
      writer.uint32(26).string(message.verificationMethod);
    }
    if (message.proofPurpose !== undefined && message.proofPurpose !== "") {
      writer.uint32(34).string(message.proofPurpose);
    }
    if (message.proofValue !== undefined && message.proofValue !== "") {
      writer.uint32(42).string(message.proofValue);
    }
    if (message.clientSpecType !== undefined && message.clientSpecType !== ClientSpecType.CLIENT_SPEC_TYPE_NONE) {
      writer.uint32(48).int32(clientSpecTypeToNumber(message.clientSpecType));
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DocumentProof {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDocumentProof();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.type = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.created = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.verificationMethod = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.proofPurpose = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.proofValue = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.clientSpecType = clientSpecTypeFromJSON(reader.int32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DocumentProof {
    return {
      type: isSet(object.type) ? globalThis.String(object.type) : undefined,
      created: isSet(object.created) ? globalThis.String(object.created) : undefined,
      verificationMethod: isSet(object.verificationMethod) ? globalThis.String(object.verificationMethod) : undefined,
      proofPurpose: isSet(object.proofPurpose) ? globalThis.String(object.proofPurpose) : undefined,
      proofValue: isSet(object.proofValue) ? globalThis.String(object.proofValue) : undefined,
      clientSpecType: isSet(object.clientSpecType) ? clientSpecTypeFromJSON(object.clientSpecType) : undefined,
    };
  },

  toJSON(message: DocumentProof): unknown {
    const obj: any = {};
    if (message.type !== undefined && message.type !== "") {
      obj.type = message.type;
    }
    if (message.created !== undefined && message.created !== "") {
      obj.created = message.created;
    }
    if (message.verificationMethod !== undefined && message.verificationMethod !== "") {
      obj.verificationMethod = message.verificationMethod;
    }
    if (message.proofPurpose !== undefined && message.proofPurpose !== "") {
      obj.proofPurpose = message.proofPurpose;
    }
    if (message.proofValue !== undefined && message.proofValue !== "") {
      obj.proofValue = message.proofValue;
    }
    if (message.clientSpecType !== undefined && message.clientSpecType !== ClientSpecType.CLIENT_SPEC_TYPE_NONE) {
      obj.clientSpecType = clientSpecTypeToJSON(message.clientSpecType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DocumentProof>, I>>(base?: I): DocumentProof {
    return DocumentProof.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DocumentProof>, I>>(object: I): DocumentProof {
    const message = createBaseDocumentProof();
    message.type = object.type ?? undefined;
    message.created = object.created ?? undefined;
    message.verificationMethod = object.verificationMethod ?? undefined;
    message.proofPurpose = object.proofPurpose ?? undefined;
    message.proofValue = object.proofValue ?? undefined;
    message.clientSpecType = object.clientSpecType ?? undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
