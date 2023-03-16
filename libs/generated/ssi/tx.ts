/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";
import { Did, SignInfo } from "./did";
import { SchemaDocument, SchemaProof } from "./schema";
import { ClientSpec } from "./clientSpec";
import { CredentialStatus, CredentialProof } from "./credential";

export const protobufPackage = "hypersignprotocol.hidnode.ssi";

export interface MsgCreateDID {
  didDocString: Did | undefined;
  signatures: SignInfo[];
  creator: string;
}

export interface MsgCreateDIDResponse {
  id: number;
}

export interface MsgUpdateDID {
  didDocString: Did | undefined;
  version_id: string;
  signatures: SignInfo[];
  creator: string;
}

export interface MsgUpdateDIDResponse {
  updateId: string;
}

export interface MsgCreateSchema {
  creator: string;
  schemaDoc: SchemaDocument | undefined;
  schemaProof: SchemaProof | undefined;
  clientSpec: ClientSpec | undefined;
}

export interface MsgCreateSchemaResponse {
  id: number;
}

export interface MsgDeactivateDID {
  creator: string;
  didId: string;
  version_id: string;
  signatures: SignInfo[];
}

export interface MsgDeactivateDIDResponse {
  id: number;
}

export interface MsgRegisterCredentialStatus {
  creator: string;
  credentialStatus: CredentialStatus | undefined;
  proof: CredentialProof | undefined;
  clientSpec: ClientSpec | undefined;
}

export interface MsgRegisterCredentialStatusResponse {
  id: number;
}

const baseMsgCreateDID: object = { creator: "" };

export const MsgCreateDID = {
  encode(message: MsgCreateDID, writer: Writer = Writer.create()): Writer {
    if (message.didDocString !== undefined) {
      Did.encode(message.didDocString, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.signatures) {
      SignInfo.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.creator !== "") {
      writer.uint32(26).string(message.creator);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreateDID {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreateDID } as MsgCreateDID;
    message.signatures = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.didDocString = Did.decode(reader, reader.uint32());
          break;
        case 2:
          message.signatures.push(SignInfo.decode(reader, reader.uint32()));
          break;
        case 3:
          message.creator = reader.string();
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
    message.signatures = [];
    if (object.didDocString !== undefined && object.didDocString !== null) {
      message.didDocString = Did.fromJSON(object.didDocString);
    } else {
      message.didDocString = undefined;
    }
    if (object.signatures !== undefined && object.signatures !== null) {
      for (const e of object.signatures) {
        message.signatures.push(SignInfo.fromJSON(e));
      }
    }
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    return message;
  },

  toJSON(message: MsgCreateDID): unknown {
    const obj: any = {};
    message.didDocString !== undefined &&
      (obj.didDocString = message.didDocString
        ? Did.toJSON(message.didDocString)
        : undefined);
    if (message.signatures) {
      obj.signatures = message.signatures.map((e) =>
        e ? SignInfo.toJSON(e) : undefined
      );
    } else {
      obj.signatures = [];
    }
    message.creator !== undefined && (obj.creator = message.creator);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreateDID>): MsgCreateDID {
    const message = { ...baseMsgCreateDID } as MsgCreateDID;
    message.signatures = [];
    if (object.didDocString !== undefined && object.didDocString !== null) {
      message.didDocString = Did.fromPartial(object.didDocString);
    } else {
      message.didDocString = undefined;
    }
    if (object.signatures !== undefined && object.signatures !== null) {
      for (const e of object.signatures) {
        message.signatures.push(SignInfo.fromPartial(e));
      }
    }
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
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

const baseMsgUpdateDID: object = { version_id: "", creator: "" };

export const MsgUpdateDID = {
  encode(message: MsgUpdateDID, writer: Writer = Writer.create()): Writer {
    if (message.didDocString !== undefined) {
      Did.encode(message.didDocString, writer.uint32(10).fork()).ldelim();
    }
    if (message.version_id !== "") {
      writer.uint32(18).string(message.version_id);
    }
    for (const v of message.signatures) {
      SignInfo.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.creator !== "") {
      writer.uint32(34).string(message.creator);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgUpdateDID {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgUpdateDID } as MsgUpdateDID;
    message.signatures = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.didDocString = Did.decode(reader, reader.uint32());
          break;
        case 2:
          message.version_id = reader.string();
          break;
        case 3:
          message.signatures.push(SignInfo.decode(reader, reader.uint32()));
          break;
        case 4:
          message.creator = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateDID {
    const message = { ...baseMsgUpdateDID } as MsgUpdateDID;
    message.signatures = [];
    if (object.didDocString !== undefined && object.didDocString !== null) {
      message.didDocString = Did.fromJSON(object.didDocString);
    } else {
      message.didDocString = undefined;
    }
    if (object.version_id !== undefined && object.version_id !== null) {
      message.version_id = String(object.version_id);
    } else {
      message.version_id = "";
    }
    if (object.signatures !== undefined && object.signatures !== null) {
      for (const e of object.signatures) {
        message.signatures.push(SignInfo.fromJSON(e));
      }
    }
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    return message;
  },

  toJSON(message: MsgUpdateDID): unknown {
    const obj: any = {};
    message.didDocString !== undefined &&
      (obj.didDocString = message.didDocString
        ? Did.toJSON(message.didDocString)
        : undefined);
    message.version_id !== undefined && (obj.version_id = message.version_id);
    if (message.signatures) {
      obj.signatures = message.signatures.map((e) =>
        e ? SignInfo.toJSON(e) : undefined
      );
    } else {
      obj.signatures = [];
    }
    message.creator !== undefined && (obj.creator = message.creator);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgUpdateDID>): MsgUpdateDID {
    const message = { ...baseMsgUpdateDID } as MsgUpdateDID;
    message.signatures = [];
    if (object.didDocString !== undefined && object.didDocString !== null) {
      message.didDocString = Did.fromPartial(object.didDocString);
    } else {
      message.didDocString = undefined;
    }
    if (object.version_id !== undefined && object.version_id !== null) {
      message.version_id = object.version_id;
    } else {
      message.version_id = "";
    }
    if (object.signatures !== undefined && object.signatures !== null) {
      for (const e of object.signatures) {
        message.signatures.push(SignInfo.fromPartial(e));
      }
    }
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    return message;
  },
};

const baseMsgUpdateDIDResponse: object = { updateId: "" };

export const MsgUpdateDIDResponse = {
  encode(
    message: MsgUpdateDIDResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.updateId !== "") {
      writer.uint32(10).string(message.updateId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgUpdateDIDResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgUpdateDIDResponse } as MsgUpdateDIDResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.updateId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateDIDResponse {
    const message = { ...baseMsgUpdateDIDResponse } as MsgUpdateDIDResponse;
    if (object.updateId !== undefined && object.updateId !== null) {
      message.updateId = String(object.updateId);
    } else {
      message.updateId = "";
    }
    return message;
  },

  toJSON(message: MsgUpdateDIDResponse): unknown {
    const obj: any = {};
    message.updateId !== undefined && (obj.updateId = message.updateId);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgUpdateDIDResponse>): MsgUpdateDIDResponse {
    const message = { ...baseMsgUpdateDIDResponse } as MsgUpdateDIDResponse;
    if (object.updateId !== undefined && object.updateId !== null) {
      message.updateId = object.updateId;
    } else {
      message.updateId = "";
    }
    return message;
  },
};

const baseMsgCreateSchema: object = { creator: "" };

export const MsgCreateSchema = {
  encode(message: MsgCreateSchema, writer: Writer = Writer.create()): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.schemaDoc !== undefined) {
      SchemaDocument.encode(
        message.schemaDoc,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.schemaProof !== undefined) {
      SchemaProof.encode(
        message.schemaProof,
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.clientSpec !== undefined) {
      ClientSpec.encode(message.clientSpec, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreateSchema {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreateSchema } as MsgCreateSchema;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.schemaDoc = SchemaDocument.decode(reader, reader.uint32());
          break;
        case 3:
          message.schemaProof = SchemaProof.decode(reader, reader.uint32());
          break;
        case 4:
          message.clientSpec = ClientSpec.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateSchema {
    const message = { ...baseMsgCreateSchema } as MsgCreateSchema;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.schemaDoc !== undefined && object.schemaDoc !== null) {
      message.schemaDoc = SchemaDocument.fromJSON(object.schemaDoc);
    } else {
      message.schemaDoc = undefined;
    }
    if (object.schemaProof !== undefined && object.schemaProof !== null) {
      message.schemaProof = SchemaProof.fromJSON(object.schemaProof);
    } else {
      message.schemaProof = undefined;
    }
    if (object.clientSpec !== undefined && object.clientSpec !== null) {
      message.clientSpec = ClientSpec.fromJSON(object.clientSpec);
    } else {
      message.clientSpec = undefined;
    }
    return message;
  },

  toJSON(message: MsgCreateSchema): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.schemaDoc !== undefined &&
      (obj.schemaDoc = message.schemaDoc
        ? SchemaDocument.toJSON(message.schemaDoc)
        : undefined);
    message.schemaProof !== undefined &&
      (obj.schemaProof = message.schemaProof
        ? SchemaProof.toJSON(message.schemaProof)
        : undefined);
    message.clientSpec !== undefined &&
      (obj.clientSpec = message.clientSpec
        ? ClientSpec.toJSON(message.clientSpec)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreateSchema>): MsgCreateSchema {
    const message = { ...baseMsgCreateSchema } as MsgCreateSchema;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.schemaDoc !== undefined && object.schemaDoc !== null) {
      message.schemaDoc = SchemaDocument.fromPartial(object.schemaDoc);
    } else {
      message.schemaDoc = undefined;
    }
    if (object.schemaProof !== undefined && object.schemaProof !== null) {
      message.schemaProof = SchemaProof.fromPartial(object.schemaProof);
    } else {
      message.schemaProof = undefined;
    }
    if (object.clientSpec !== undefined && object.clientSpec !== null) {
      message.clientSpec = ClientSpec.fromPartial(object.clientSpec);
    } else {
      message.clientSpec = undefined;
    }
    return message;
  },
};

const baseMsgCreateSchemaResponse: object = { id: 0 };

export const MsgCreateSchemaResponse = {
  encode(
    message: MsgCreateSchemaResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreateSchemaResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgCreateSchemaResponse,
    } as MsgCreateSchemaResponse;
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

  fromJSON(object: any): MsgCreateSchemaResponse {
    const message = {
      ...baseMsgCreateSchemaResponse,
    } as MsgCreateSchemaResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id);
    } else {
      message.id = 0;
    }
    return message;
  },

  toJSON(message: MsgCreateSchemaResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgCreateSchemaResponse>
  ): MsgCreateSchemaResponse {
    const message = {
      ...baseMsgCreateSchemaResponse,
    } as MsgCreateSchemaResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = 0;
    }
    return message;
  },
};

const baseMsgDeactivateDID: object = { creator: "", didId: "", version_id: "" };

export const MsgDeactivateDID = {
  encode(message: MsgDeactivateDID, writer: Writer = Writer.create()): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.didId !== "") {
      writer.uint32(18).string(message.didId);
    }
    if (message.version_id !== "") {
      writer.uint32(26).string(message.version_id);
    }
    for (const v of message.signatures) {
      SignInfo.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgDeactivateDID {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDeactivateDID } as MsgDeactivateDID;
    message.signatures = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.didId = reader.string();
          break;
        case 3:
          message.version_id = reader.string();
          break;
        case 4:
          message.signatures.push(SignInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeactivateDID {
    const message = { ...baseMsgDeactivateDID } as MsgDeactivateDID;
    message.signatures = [];
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.didId !== undefined && object.didId !== null) {
      message.didId = String(object.didId);
    } else {
      message.didId = "";
    }
    if (object.version_id !== undefined && object.version_id !== null) {
      message.version_id = String(object.version_id);
    } else {
      message.version_id = "";
    }
    if (object.signatures !== undefined && object.signatures !== null) {
      for (const e of object.signatures) {
        message.signatures.push(SignInfo.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: MsgDeactivateDID): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.didId !== undefined && (obj.didId = message.didId);
    message.version_id !== undefined && (obj.version_id = message.version_id);
    if (message.signatures) {
      obj.signatures = message.signatures.map((e) =>
        e ? SignInfo.toJSON(e) : undefined
      );
    } else {
      obj.signatures = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MsgDeactivateDID>): MsgDeactivateDID {
    const message = { ...baseMsgDeactivateDID } as MsgDeactivateDID;
    message.signatures = [];
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.didId !== undefined && object.didId !== null) {
      message.didId = object.didId;
    } else {
      message.didId = "";
    }
    if (object.version_id !== undefined && object.version_id !== null) {
      message.version_id = object.version_id;
    } else {
      message.version_id = "";
    }
    if (object.signatures !== undefined && object.signatures !== null) {
      for (const e of object.signatures) {
        message.signatures.push(SignInfo.fromPartial(e));
      }
    }
    return message;
  },
};

const baseMsgDeactivateDIDResponse: object = { id: 0 };

export const MsgDeactivateDIDResponse = {
  encode(
    message: MsgDeactivateDIDResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgDeactivateDIDResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgDeactivateDIDResponse,
    } as MsgDeactivateDIDResponse;
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

  fromJSON(object: any): MsgDeactivateDIDResponse {
    const message = {
      ...baseMsgDeactivateDIDResponse,
    } as MsgDeactivateDIDResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id);
    } else {
      message.id = 0;
    }
    return message;
  },

  toJSON(message: MsgDeactivateDIDResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgDeactivateDIDResponse>
  ): MsgDeactivateDIDResponse {
    const message = {
      ...baseMsgDeactivateDIDResponse,
    } as MsgDeactivateDIDResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = 0;
    }
    return message;
  },
};

const baseMsgRegisterCredentialStatus: object = { creator: "" };

export const MsgRegisterCredentialStatus = {
  encode(
    message: MsgRegisterCredentialStatus,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.credentialStatus !== undefined) {
      CredentialStatus.encode(
        message.credentialStatus,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.proof !== undefined) {
      CredentialProof.encode(message.proof, writer.uint32(26).fork()).ldelim();
    }
    if (message.clientSpec !== undefined) {
      ClientSpec.encode(message.clientSpec, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgRegisterCredentialStatus {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgRegisterCredentialStatus,
    } as MsgRegisterCredentialStatus;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.credentialStatus = CredentialStatus.decode(
            reader,
            reader.uint32()
          );
          break;
        case 3:
          message.proof = CredentialProof.decode(reader, reader.uint32());
          break;
        case 4:
          message.clientSpec = ClientSpec.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterCredentialStatus {
    const message = {
      ...baseMsgRegisterCredentialStatus,
    } as MsgRegisterCredentialStatus;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (
      object.credentialStatus !== undefined &&
      object.credentialStatus !== null
    ) {
      message.credentialStatus = CredentialStatus.fromJSON(
        object.credentialStatus
      );
    } else {
      message.credentialStatus = undefined;
    }
    if (object.proof !== undefined && object.proof !== null) {
      message.proof = CredentialProof.fromJSON(object.proof);
    } else {
      message.proof = undefined;
    }
    if (object.clientSpec !== undefined && object.clientSpec !== null) {
      message.clientSpec = ClientSpec.fromJSON(object.clientSpec);
    } else {
      message.clientSpec = undefined;
    }
    return message;
  },

  toJSON(message: MsgRegisterCredentialStatus): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.credentialStatus !== undefined &&
      (obj.credentialStatus = message.credentialStatus
        ? CredentialStatus.toJSON(message.credentialStatus)
        : undefined);
    message.proof !== undefined &&
      (obj.proof = message.proof
        ? CredentialProof.toJSON(message.proof)
        : undefined);
    message.clientSpec !== undefined &&
      (obj.clientSpec = message.clientSpec
        ? ClientSpec.toJSON(message.clientSpec)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgRegisterCredentialStatus>
  ): MsgRegisterCredentialStatus {
    const message = {
      ...baseMsgRegisterCredentialStatus,
    } as MsgRegisterCredentialStatus;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (
      object.credentialStatus !== undefined &&
      object.credentialStatus !== null
    ) {
      message.credentialStatus = CredentialStatus.fromPartial(
        object.credentialStatus
      );
    } else {
      message.credentialStatus = undefined;
    }
    if (object.proof !== undefined && object.proof !== null) {
      message.proof = CredentialProof.fromPartial(object.proof);
    } else {
      message.proof = undefined;
    }
    if (object.clientSpec !== undefined && object.clientSpec !== null) {
      message.clientSpec = ClientSpec.fromPartial(object.clientSpec);
    } else {
      message.clientSpec = undefined;
    }
    return message;
  },
};

const baseMsgRegisterCredentialStatusResponse: object = { id: 0 };

export const MsgRegisterCredentialStatusResponse = {
  encode(
    message: MsgRegisterCredentialStatusResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgRegisterCredentialStatusResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgRegisterCredentialStatusResponse,
    } as MsgRegisterCredentialStatusResponse;
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

  fromJSON(object: any): MsgRegisterCredentialStatusResponse {
    const message = {
      ...baseMsgRegisterCredentialStatusResponse,
    } as MsgRegisterCredentialStatusResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id);
    } else {
      message.id = 0;
    }
    return message;
  },

  toJSON(message: MsgRegisterCredentialStatusResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgRegisterCredentialStatusResponse>
  ): MsgRegisterCredentialStatusResponse {
    const message = {
      ...baseMsgRegisterCredentialStatusResponse,
    } as MsgRegisterCredentialStatusResponse;
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
  UpdateDID(request: MsgUpdateDID): Promise<MsgUpdateDIDResponse>;
  CreateSchema(request: MsgCreateSchema): Promise<MsgCreateSchemaResponse>;
  DeactivateDID(request: MsgDeactivateDID): Promise<MsgDeactivateDIDResponse>;
  RegisterCredentialStatus(
    request: MsgRegisterCredentialStatus
  ): Promise<MsgRegisterCredentialStatusResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  CreateDID(request: MsgCreateDID): Promise<MsgCreateDIDResponse> {
    const data = MsgCreateDID.encode(request).finish();
    const promise = this.rpc.request(
      "hypersignprotocol.hidnode.ssi.Msg",
      "CreateDID",
      data
    );
    return promise.then((data) =>
      MsgCreateDIDResponse.decode(new Reader(data))
    );
  }

  UpdateDID(request: MsgUpdateDID): Promise<MsgUpdateDIDResponse> {
    const data = MsgUpdateDID.encode(request).finish();
    const promise = this.rpc.request(
      "hypersignprotocol.hidnode.ssi.Msg",
      "UpdateDID",
      data
    );
    return promise.then((data) =>
      MsgUpdateDIDResponse.decode(new Reader(data))
    );
  }

  CreateSchema(request: MsgCreateSchema): Promise<MsgCreateSchemaResponse> {
    const data = MsgCreateSchema.encode(request).finish();
    const promise = this.rpc.request(
      "hypersignprotocol.hidnode.ssi.Msg",
      "CreateSchema",
      data
    );
    return promise.then((data) =>
      MsgCreateSchemaResponse.decode(new Reader(data))
    );
  }

  DeactivateDID(request: MsgDeactivateDID): Promise<MsgDeactivateDIDResponse> {
    const data = MsgDeactivateDID.encode(request).finish();
    const promise = this.rpc.request(
      "hypersignprotocol.hidnode.ssi.Msg",
      "DeactivateDID",
      data
    );
    return promise.then((data) =>
      MsgDeactivateDIDResponse.decode(new Reader(data))
    );
  }

  RegisterCredentialStatus(
    request: MsgRegisterCredentialStatus
  ): Promise<MsgRegisterCredentialStatusResponse> {
    const data = MsgRegisterCredentialStatus.encode(request).finish();
    const promise = this.rpc.request(
      "hypersignprotocol.hidnode.ssi.Msg",
      "RegisterCredentialStatus",
      data
    );
    return promise.then((data) =>
      MsgRegisterCredentialStatusResponse.decode(new Reader(data))
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

// if (util.Long !== Long) {
//   util.Long = Long as any;
//   configure();
// }
