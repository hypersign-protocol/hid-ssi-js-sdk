/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { DocumentProof } from "./proof";

export const protobufPackage = "hypersign.ssi.v1";

export interface CredentialSchemaDocument {
  "@context"?: string[] | undefined;
  type?: string | undefined;
  modelVersion?: string | undefined;
  id?: string | undefined;
  name?: string | undefined;
  author?: string | undefined;
  authored?: string | undefined;
  schema?: CredentialSchemaProperty | undefined;
}

export interface CredentialSchemaProperty {
  schema?: string | undefined;
  description?: string | undefined;
  type?: string | undefined;
  properties?: string | undefined;
  required?: string[] | undefined;
  additionalProperties?: boolean | undefined;
}

export interface CredentialSchemaState {
  credentialSchemaDocument?: CredentialSchemaDocument | undefined;
  credentialSchemaProof?: DocumentProof | undefined;
}

function createBaseCredentialSchemaDocument(): CredentialSchemaDocument {
  return {};
}

export const CredentialSchemaDocument = {
  encode(message: CredentialSchemaDocument, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message["@context"] !== undefined && message["@context"].length !== 0) {
      for (const v of message["@context"]) {
        writer.uint32(10).string(v!);
      }
    }
    if (message.type !== undefined && message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.modelVersion !== undefined && message.modelVersion !== "") {
      writer.uint32(26).string(message.modelVersion);
    }
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(34).string(message.id);
    }
    if (message.name !== undefined && message.name !== "") {
      writer.uint32(42).string(message.name);
    }
    if (message.author !== undefined && message.author !== "") {
      writer.uint32(50).string(message.author);
    }
    if (message.authored !== undefined && message.authored !== "") {
      writer.uint32(58).string(message.authored);
    }
    if (message.schema !== undefined) {
      CredentialSchemaProperty.encode(message.schema, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialSchemaDocument {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialSchemaDocument();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          if (message["@context"] === undefined) {
            message["@context"] = [];
          }
          message["@context"]!.push(reader.string());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.type = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.modelVersion = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.id = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.name = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.author = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.authored = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.schema = CredentialSchemaProperty.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CredentialSchemaDocument {
    return {
      "@context": globalThis.Array.isArray(object?.["@context"])
        ? object["@context"].map((e: any) => globalThis.String(e))
        : undefined,
      type: isSet(object.type) ? globalThis.String(object.type) : undefined,
      modelVersion: isSet(object.modelVersion) ? globalThis.String(object.modelVersion) : undefined,
      id: isSet(object.id) ? globalThis.String(object.id) : undefined,
      name: isSet(object.name) ? globalThis.String(object.name) : undefined,
      author: isSet(object.author) ? globalThis.String(object.author) : undefined,
      authored: isSet(object.authored) ? globalThis.String(object.authored) : undefined,
      schema: isSet(object.schema) ? CredentialSchemaProperty.fromJSON(object.schema) : undefined,
    };
  },

  toJSON(message: CredentialSchemaDocument): unknown {
    const obj: any = {};
    if (message["@context"]?.length) {
      obj["@context"] = message["@context"];
    }
    if (message.type !== undefined && message.type !== "") {
      obj.type = message.type;
    }
    if (message.modelVersion !== undefined && message.modelVersion !== "") {
      obj.modelVersion = message.modelVersion;
    }
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    if (message.author !== undefined && message.author !== "") {
      obj.author = message.author;
    }
    if (message.authored !== undefined && message.authored !== "") {
      obj.authored = message.authored;
    }
    if (message.schema !== undefined) {
      obj.schema = CredentialSchemaProperty.toJSON(message.schema);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialSchemaDocument>, I>>(base?: I): CredentialSchemaDocument {
    return CredentialSchemaDocument.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialSchemaDocument>, I>>(object: I): CredentialSchemaDocument {
    const message = createBaseCredentialSchemaDocument();
    message["@context"] = object["@context"]?.map((e) => e) || undefined;
    message.type = object.type ?? undefined;
    message.modelVersion = object.modelVersion ?? undefined;
    message.id = object.id ?? undefined;
    message.name = object.name ?? undefined;
    message.author = object.author ?? undefined;
    message.authored = object.authored ?? undefined;
    message.schema = (object.schema !== undefined && object.schema !== null)
      ? CredentialSchemaProperty.fromPartial(object.schema)
      : undefined;
    return message;
  },
};

function createBaseCredentialSchemaProperty(): CredentialSchemaProperty {
  return {};
}

export const CredentialSchemaProperty = {
  encode(message: CredentialSchemaProperty, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.schema !== undefined && message.schema !== "") {
      writer.uint32(10).string(message.schema);
    }
    if (message.description !== undefined && message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.type !== undefined && message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    if (message.properties !== undefined && message.properties !== "") {
      writer.uint32(34).string(message.properties);
    }
    if (message.required !== undefined && message.required.length !== 0) {
      for (const v of message.required) {
        writer.uint32(42).string(v!);
      }
    }
    if (message.additionalProperties === true) {
      writer.uint32(48).bool(message.additionalProperties);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialSchemaProperty {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialSchemaProperty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.schema = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.description = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.type = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.properties = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          if (message.required === undefined) {
            message.required = [];
          }
          message.required!.push(reader.string());
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.additionalProperties = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CredentialSchemaProperty {
    return {
      schema: isSet(object.schema) ? globalThis.String(object.schema) : undefined,
      description: isSet(object.description) ? globalThis.String(object.description) : undefined,
      type: isSet(object.type) ? globalThis.String(object.type) : undefined,
      properties: isSet(object.properties) ? globalThis.String(object.properties) : undefined,
      required: globalThis.Array.isArray(object?.required)
        ? object.required.map((e: any) => globalThis.String(e))
        : undefined,
      additionalProperties: isSet(object.additionalProperties)
        ? globalThis.Boolean(object.additionalProperties)
        : undefined,
    };
  },

  toJSON(message: CredentialSchemaProperty): unknown {
    const obj: any = {};
    if (message.schema !== undefined && message.schema !== "") {
      obj.schema = message.schema;
    }
    if (message.description !== undefined && message.description !== "") {
      obj.description = message.description;
    }
    if (message.type !== undefined && message.type !== "") {
      obj.type = message.type;
    }
    if (message.properties !== undefined && message.properties !== "") {
      obj.properties = message.properties;
    }
    if (message.required?.length) {
      obj.required = message.required;
    }
    if (message.additionalProperties === true) {
      obj.additionalProperties = message.additionalProperties;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialSchemaProperty>, I>>(base?: I): CredentialSchemaProperty {
    return CredentialSchemaProperty.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialSchemaProperty>, I>>(object: I): CredentialSchemaProperty {
    const message = createBaseCredentialSchemaProperty();
    message.schema = object.schema ?? undefined;
    message.description = object.description ?? undefined;
    message.type = object.type ?? undefined;
    message.properties = object.properties ?? undefined;
    message.required = object.required?.map((e) => e) || undefined;
    message.additionalProperties = object.additionalProperties ?? undefined;
    return message;
  },
};

function createBaseCredentialSchemaState(): CredentialSchemaState {
  return {};
}

export const CredentialSchemaState = {
  encode(message: CredentialSchemaState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credentialSchemaDocument !== undefined) {
      CredentialSchemaDocument.encode(message.credentialSchemaDocument, writer.uint32(10).fork()).ldelim();
    }
    if (message.credentialSchemaProof !== undefined) {
      DocumentProof.encode(message.credentialSchemaProof, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialSchemaState {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialSchemaState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.credentialSchemaDocument = CredentialSchemaDocument.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.credentialSchemaProof = DocumentProof.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CredentialSchemaState {
    return {
      credentialSchemaDocument: isSet(object.credentialSchemaDocument)
        ? CredentialSchemaDocument.fromJSON(object.credentialSchemaDocument)
        : undefined,
      credentialSchemaProof: isSet(object.credentialSchemaProof)
        ? DocumentProof.fromJSON(object.credentialSchemaProof)
        : undefined,
    };
  },

  toJSON(message: CredentialSchemaState): unknown {
    const obj: any = {};
    if (message.credentialSchemaDocument !== undefined) {
      obj.credentialSchemaDocument = CredentialSchemaDocument.toJSON(message.credentialSchemaDocument);
    }
    if (message.credentialSchemaProof !== undefined) {
      obj.credentialSchemaProof = DocumentProof.toJSON(message.credentialSchemaProof);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialSchemaState>, I>>(base?: I): CredentialSchemaState {
    return CredentialSchemaState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialSchemaState>, I>>(object: I): CredentialSchemaState {
    const message = createBaseCredentialSchemaState();
    message.credentialSchemaDocument =
      (object.credentialSchemaDocument !== undefined && object.credentialSchemaDocument !== null)
        ? CredentialSchemaDocument.fromPartial(object.credentialSchemaDocument)
        : undefined;
    message.credentialSchemaProof =
      (object.credentialSchemaProof !== undefined && object.credentialSchemaProof !== null)
        ? DocumentProof.fromPartial(object.credentialSchemaProof)
        : undefined;
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
