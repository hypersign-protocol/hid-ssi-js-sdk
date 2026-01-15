/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { CredentialSchemaDocument } from "./credential_schema";
import { CredentialStatusDocument } from "./credential_status";
import { DidDocument } from "./did";
import { DocumentProof } from "./proof";

export const protobufPackage = "hypersign.ssi.v1";

export interface MsgRegisterDID {
  didDocument?: DidDocument | undefined;
  didDocumentProofs?: DocumentProof[] | undefined;
  txAuthor?: string | undefined;
}

export interface MsgRegisterDIDResponse {
}

export interface MsgUpdateDID {
  didDocument?: DidDocument | undefined;
  didDocumentProofs?: DocumentProof[] | undefined;
  versionId?: string | undefined;
  txAuthor?: string | undefined;
}

export interface MsgUpdateDIDResponse {
}

export interface MsgDeactivateDID {
  didDocumentId?: string | undefined;
  didDocumentProofs?: DocumentProof[] | undefined;
  versionId?: string | undefined;
  txAuthor?: string | undefined;
}

export interface MsgDeactivateDIDResponse {
}

export interface MsgRegisterCredentialSchema {
  credentialSchemaDocument?: CredentialSchemaDocument | undefined;
  credentialSchemaProof?: DocumentProof | undefined;
  txAuthor?: string | undefined;
}

export interface MsgRegisterCredentialSchemaResponse {
}

export interface MsgUpdateCredentialSchema {
  credentialSchemaDocument?: CredentialSchemaDocument | undefined;
  credentialSchemaProof?: DocumentProof | undefined;
  txAuthor?: string | undefined;
}

export interface MsgUpdateCredentialSchemaResponse {
}

export interface MsgRegisterCredentialStatus {
  credentialStatusDocument?: CredentialStatusDocument | undefined;
  credentialStatusProof?: DocumentProof | undefined;
  txAuthor?: string | undefined;
}

export interface MsgRegisterCredentialStatusResponse {
}

export interface MsgUpdateCredentialStatus {
  credentialStatusDocument?: CredentialStatusDocument | undefined;
  credentialStatusProof?: DocumentProof | undefined;
  txAuthor?: string | undefined;
}

export interface MsgUpdateCredentialStatusResponse {
}

function createBaseMsgRegisterDID(): MsgRegisterDID {
  return {};
}

export const MsgRegisterDID = {
  encode(message: MsgRegisterDID, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.didDocument !== undefined) {
      DidDocument.encode(message.didDocument, writer.uint32(10).fork()).ldelim();
    }
    if (message.didDocumentProofs !== undefined && message.didDocumentProofs.length !== 0) {
      for (const v of message.didDocumentProofs) {
        DocumentProof.encode(v!, writer.uint32(18).fork()).ldelim();
      }
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      writer.uint32(26).string(message.txAuthor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterDID {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterDID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.didDocument = DidDocument.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          if (message.didDocumentProofs === undefined) {
            message.didDocumentProofs = [];
          }
          message.didDocumentProofs!.push(DocumentProof.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.txAuthor = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterDID {
    return {
      didDocument: isSet(object.didDocument) ? DidDocument.fromJSON(object.didDocument) : undefined,
      didDocumentProofs: globalThis.Array.isArray(object?.didDocumentProofs)
        ? object.didDocumentProofs.map((e: any) => DocumentProof.fromJSON(e))
        : undefined,
      txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
    };
  },

  toJSON(message: MsgRegisterDID): unknown {
    const obj: any = {};
    if (message.didDocument !== undefined) {
      obj.didDocument = DidDocument.toJSON(message.didDocument);
    }
    if (message.didDocumentProofs?.length) {
      obj.didDocumentProofs = message.didDocumentProofs.map((e) => DocumentProof.toJSON(e));
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      obj.txAuthor = message.txAuthor;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRegisterDID>, I>>(base?: I): MsgRegisterDID {
    return MsgRegisterDID.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRegisterDID>, I>>(object: I): MsgRegisterDID {
    const message = createBaseMsgRegisterDID();
    message.didDocument = (object.didDocument !== undefined && object.didDocument !== null)
      ? DidDocument.fromPartial(object.didDocument)
      : undefined;
    message.didDocumentProofs = object.didDocumentProofs?.map((e) => DocumentProof.fromPartial(e)) || undefined;
    message.txAuthor = object.txAuthor ?? undefined;
    return message;
  },
};

function createBaseMsgRegisterDIDResponse(): MsgRegisterDIDResponse {
  return {};
}

export const MsgRegisterDIDResponse = {
  encode(_: MsgRegisterDIDResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterDIDResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterDIDResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgRegisterDIDResponse {
    return {};
  },

  toJSON(_: MsgRegisterDIDResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRegisterDIDResponse>, I>>(base?: I): MsgRegisterDIDResponse {
    return MsgRegisterDIDResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRegisterDIDResponse>, I>>(_: I): MsgRegisterDIDResponse {
    const message = createBaseMsgRegisterDIDResponse();
    return message;
  },
};

function createBaseMsgUpdateDID(): MsgUpdateDID {
  return {};
}

export const MsgUpdateDID = {
  encode(message: MsgUpdateDID, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.didDocument !== undefined) {
      DidDocument.encode(message.didDocument, writer.uint32(10).fork()).ldelim();
    }
    if (message.didDocumentProofs !== undefined && message.didDocumentProofs.length !== 0) {
      for (const v of message.didDocumentProofs) {
        DocumentProof.encode(v!, writer.uint32(18).fork()).ldelim();
      }
    }
    if (message.versionId !== undefined && message.versionId !== "") {
      writer.uint32(26).string(message.versionId);
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      writer.uint32(34).string(message.txAuthor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateDID {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateDID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.didDocument = DidDocument.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          if (message.didDocumentProofs === undefined) {
            message.didDocumentProofs = [];
          }
          message.didDocumentProofs!.push(DocumentProof.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.versionId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.txAuthor = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateDID {
    return {
      didDocument: isSet(object.didDocument) ? DidDocument.fromJSON(object.didDocument) : undefined,
      didDocumentProofs: globalThis.Array.isArray(object?.didDocumentProofs)
        ? object.didDocumentProofs.map((e: any) => DocumentProof.fromJSON(e))
        : undefined,
      versionId: isSet(object.versionId) ? globalThis.String(object.versionId) : undefined,
      txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
    };
  },

  toJSON(message: MsgUpdateDID): unknown {
    const obj: any = {};
    if (message.didDocument !== undefined) {
      obj.didDocument = DidDocument.toJSON(message.didDocument);
    }
    if (message.didDocumentProofs?.length) {
      obj.didDocumentProofs = message.didDocumentProofs.map((e) => DocumentProof.toJSON(e));
    }
    if (message.versionId !== undefined && message.versionId !== "") {
      obj.versionId = message.versionId;
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      obj.txAuthor = message.txAuthor;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateDID>, I>>(base?: I): MsgUpdateDID {
    return MsgUpdateDID.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateDID>, I>>(object: I): MsgUpdateDID {
    const message = createBaseMsgUpdateDID();
    message.didDocument = (object.didDocument !== undefined && object.didDocument !== null)
      ? DidDocument.fromPartial(object.didDocument)
      : undefined;
    message.didDocumentProofs = object.didDocumentProofs?.map((e) => DocumentProof.fromPartial(e)) || undefined;
    message.versionId = object.versionId ?? undefined;
    message.txAuthor = object.txAuthor ?? undefined;
    return message;
  },
};

function createBaseMsgUpdateDIDResponse(): MsgUpdateDIDResponse {
  return {};
}

export const MsgUpdateDIDResponse = {
  encode(_: MsgUpdateDIDResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateDIDResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateDIDResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgUpdateDIDResponse {
    return {};
  },

  toJSON(_: MsgUpdateDIDResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateDIDResponse>, I>>(base?: I): MsgUpdateDIDResponse {
    return MsgUpdateDIDResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateDIDResponse>, I>>(_: I): MsgUpdateDIDResponse {
    const message = createBaseMsgUpdateDIDResponse();
    return message;
  },
};

function createBaseMsgDeactivateDID(): MsgDeactivateDID {
  return {};
}

export const MsgDeactivateDID = {
  encode(message: MsgDeactivateDID, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.didDocumentId !== undefined && message.didDocumentId !== "") {
      writer.uint32(10).string(message.didDocumentId);
    }
    if (message.didDocumentProofs !== undefined && message.didDocumentProofs.length !== 0) {
      for (const v of message.didDocumentProofs) {
        DocumentProof.encode(v!, writer.uint32(18).fork()).ldelim();
      }
    }
    if (message.versionId !== undefined && message.versionId !== "") {
      writer.uint32(26).string(message.versionId);
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      writer.uint32(34).string(message.txAuthor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeactivateDID {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeactivateDID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.didDocumentId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          if (message.didDocumentProofs === undefined) {
            message.didDocumentProofs = [];
          }
          message.didDocumentProofs!.push(DocumentProof.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.versionId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.txAuthor = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgDeactivateDID {
    return {
      didDocumentId: isSet(object.didDocumentId) ? globalThis.String(object.didDocumentId) : undefined,
      didDocumentProofs: globalThis.Array.isArray(object?.didDocumentProofs)
        ? object.didDocumentProofs.map((e: any) => DocumentProof.fromJSON(e))
        : undefined,
      versionId: isSet(object.versionId) ? globalThis.String(object.versionId) : undefined,
      txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
    };
  },

  toJSON(message: MsgDeactivateDID): unknown {
    const obj: any = {};
    if (message.didDocumentId !== undefined && message.didDocumentId !== "") {
      obj.didDocumentId = message.didDocumentId;
    }
    if (message.didDocumentProofs?.length) {
      obj.didDocumentProofs = message.didDocumentProofs.map((e) => DocumentProof.toJSON(e));
    }
    if (message.versionId !== undefined && message.versionId !== "") {
      obj.versionId = message.versionId;
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      obj.txAuthor = message.txAuthor;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDeactivateDID>, I>>(base?: I): MsgDeactivateDID {
    return MsgDeactivateDID.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDeactivateDID>, I>>(object: I): MsgDeactivateDID {
    const message = createBaseMsgDeactivateDID();
    message.didDocumentId = object.didDocumentId ?? undefined;
    message.didDocumentProofs = object.didDocumentProofs?.map((e) => DocumentProof.fromPartial(e)) || undefined;
    message.versionId = object.versionId ?? undefined;
    message.txAuthor = object.txAuthor ?? undefined;
    return message;
  },
};

function createBaseMsgDeactivateDIDResponse(): MsgDeactivateDIDResponse {
  return {};
}

export const MsgDeactivateDIDResponse = {
  encode(_: MsgDeactivateDIDResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeactivateDIDResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeactivateDIDResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgDeactivateDIDResponse {
    return {};
  },

  toJSON(_: MsgDeactivateDIDResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDeactivateDIDResponse>, I>>(base?: I): MsgDeactivateDIDResponse {
    return MsgDeactivateDIDResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDeactivateDIDResponse>, I>>(_: I): MsgDeactivateDIDResponse {
    const message = createBaseMsgDeactivateDIDResponse();
    return message;
  },
};

function createBaseMsgRegisterCredentialSchema(): MsgRegisterCredentialSchema {
  return {};
}

export const MsgRegisterCredentialSchema = {
  encode(message: MsgRegisterCredentialSchema, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credentialSchemaDocument !== undefined) {
      CredentialSchemaDocument.encode(message.credentialSchemaDocument, writer.uint32(10).fork()).ldelim();
    }
    if (message.credentialSchemaProof !== undefined) {
      DocumentProof.encode(message.credentialSchemaProof, writer.uint32(18).fork()).ldelim();
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      writer.uint32(26).string(message.txAuthor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterCredentialSchema {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterCredentialSchema();
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
        case 3:
          if (tag !== 26) {
            break;
          }

          message.txAuthor = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterCredentialSchema {
    return {
      credentialSchemaDocument: isSet(object.credentialSchemaDocument)
        ? CredentialSchemaDocument.fromJSON(object.credentialSchemaDocument)
        : undefined,
      credentialSchemaProof: isSet(object.credentialSchemaProof)
        ? DocumentProof.fromJSON(object.credentialSchemaProof)
        : undefined,
      txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
    };
  },

  toJSON(message: MsgRegisterCredentialSchema): unknown {
    const obj: any = {};
    if (message.credentialSchemaDocument !== undefined) {
      obj.credentialSchemaDocument = CredentialSchemaDocument.toJSON(message.credentialSchemaDocument);
    }
    if (message.credentialSchemaProof !== undefined) {
      obj.credentialSchemaProof = DocumentProof.toJSON(message.credentialSchemaProof);
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      obj.txAuthor = message.txAuthor;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRegisterCredentialSchema>, I>>(base?: I): MsgRegisterCredentialSchema {
    return MsgRegisterCredentialSchema.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRegisterCredentialSchema>, I>>(object: I): MsgRegisterCredentialSchema {
    const message = createBaseMsgRegisterCredentialSchema();
    message.credentialSchemaDocument =
      (object.credentialSchemaDocument !== undefined && object.credentialSchemaDocument !== null)
        ? CredentialSchemaDocument.fromPartial(object.credentialSchemaDocument)
        : undefined;
    message.credentialSchemaProof =
      (object.credentialSchemaProof !== undefined && object.credentialSchemaProof !== null)
        ? DocumentProof.fromPartial(object.credentialSchemaProof)
        : undefined;
    message.txAuthor = object.txAuthor ?? undefined;
    return message;
  },
};

function createBaseMsgRegisterCredentialSchemaResponse(): MsgRegisterCredentialSchemaResponse {
  return {};
}

export const MsgRegisterCredentialSchemaResponse = {
  encode(_: MsgRegisterCredentialSchemaResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterCredentialSchemaResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterCredentialSchemaResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgRegisterCredentialSchemaResponse {
    return {};
  },

  toJSON(_: MsgRegisterCredentialSchemaResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRegisterCredentialSchemaResponse>, I>>(
    base?: I,
  ): MsgRegisterCredentialSchemaResponse {
    return MsgRegisterCredentialSchemaResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRegisterCredentialSchemaResponse>, I>>(
    _: I,
  ): MsgRegisterCredentialSchemaResponse {
    const message = createBaseMsgRegisterCredentialSchemaResponse();
    return message;
  },
};

function createBaseMsgUpdateCredentialSchema(): MsgUpdateCredentialSchema {
  return {};
}

export const MsgUpdateCredentialSchema = {
  encode(message: MsgUpdateCredentialSchema, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credentialSchemaDocument !== undefined) {
      CredentialSchemaDocument.encode(message.credentialSchemaDocument, writer.uint32(10).fork()).ldelim();
    }
    if (message.credentialSchemaProof !== undefined) {
      DocumentProof.encode(message.credentialSchemaProof, writer.uint32(18).fork()).ldelim();
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      writer.uint32(26).string(message.txAuthor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateCredentialSchema {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateCredentialSchema();
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
        case 3:
          if (tag !== 26) {
            break;
          }

          message.txAuthor = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateCredentialSchema {
    return {
      credentialSchemaDocument: isSet(object.credentialSchemaDocument)
        ? CredentialSchemaDocument.fromJSON(object.credentialSchemaDocument)
        : undefined,
      credentialSchemaProof: isSet(object.credentialSchemaProof)
        ? DocumentProof.fromJSON(object.credentialSchemaProof)
        : undefined,
      txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
    };
  },

  toJSON(message: MsgUpdateCredentialSchema): unknown {
    const obj: any = {};
    if (message.credentialSchemaDocument !== undefined) {
      obj.credentialSchemaDocument = CredentialSchemaDocument.toJSON(message.credentialSchemaDocument);
    }
    if (message.credentialSchemaProof !== undefined) {
      obj.credentialSchemaProof = DocumentProof.toJSON(message.credentialSchemaProof);
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      obj.txAuthor = message.txAuthor;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateCredentialSchema>, I>>(base?: I): MsgUpdateCredentialSchema {
    return MsgUpdateCredentialSchema.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateCredentialSchema>, I>>(object: I): MsgUpdateCredentialSchema {
    const message = createBaseMsgUpdateCredentialSchema();
    message.credentialSchemaDocument =
      (object.credentialSchemaDocument !== undefined && object.credentialSchemaDocument !== null)
        ? CredentialSchemaDocument.fromPartial(object.credentialSchemaDocument)
        : undefined;
    message.credentialSchemaProof =
      (object.credentialSchemaProof !== undefined && object.credentialSchemaProof !== null)
        ? DocumentProof.fromPartial(object.credentialSchemaProof)
        : undefined;
    message.txAuthor = object.txAuthor ?? undefined;
    return message;
  },
};

function createBaseMsgUpdateCredentialSchemaResponse(): MsgUpdateCredentialSchemaResponse {
  return {};
}

export const MsgUpdateCredentialSchemaResponse = {
  encode(_: MsgUpdateCredentialSchemaResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateCredentialSchemaResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateCredentialSchemaResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgUpdateCredentialSchemaResponse {
    return {};
  },

  toJSON(_: MsgUpdateCredentialSchemaResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateCredentialSchemaResponse>, I>>(
    base?: I,
  ): MsgUpdateCredentialSchemaResponse {
    return MsgUpdateCredentialSchemaResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateCredentialSchemaResponse>, I>>(
    _: I,
  ): MsgUpdateCredentialSchemaResponse {
    const message = createBaseMsgUpdateCredentialSchemaResponse();
    return message;
  },
};

function createBaseMsgRegisterCredentialStatus(): MsgRegisterCredentialStatus {
  return {};
}

export const MsgRegisterCredentialStatus = {
  encode(message: MsgRegisterCredentialStatus, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credentialStatusDocument !== undefined) {
      CredentialStatusDocument.encode(message.credentialStatusDocument, writer.uint32(10).fork()).ldelim();
    }
    if (message.credentialStatusProof !== undefined) {
      DocumentProof.encode(message.credentialStatusProof, writer.uint32(18).fork()).ldelim();
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      writer.uint32(26).string(message.txAuthor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterCredentialStatus {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterCredentialStatus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.credentialStatusDocument = CredentialStatusDocument.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.credentialStatusProof = DocumentProof.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.txAuthor = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterCredentialStatus {
    return {
      credentialStatusDocument: isSet(object.credentialStatusDocument)
        ? CredentialStatusDocument.fromJSON(object.credentialStatusDocument)
        : undefined,
      credentialStatusProof: isSet(object.credentialStatusProof)
        ? DocumentProof.fromJSON(object.credentialStatusProof)
        : undefined,
      txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
    };
  },

  toJSON(message: MsgRegisterCredentialStatus): unknown {
    const obj: any = {};
    if (message.credentialStatusDocument !== undefined) {
      obj.credentialStatusDocument = CredentialStatusDocument.toJSON(message.credentialStatusDocument);
    }
    if (message.credentialStatusProof !== undefined) {
      obj.credentialStatusProof = DocumentProof.toJSON(message.credentialStatusProof);
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      obj.txAuthor = message.txAuthor;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRegisterCredentialStatus>, I>>(base?: I): MsgRegisterCredentialStatus {
    return MsgRegisterCredentialStatus.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRegisterCredentialStatus>, I>>(object: I): MsgRegisterCredentialStatus {
    const message = createBaseMsgRegisterCredentialStatus();
    message.credentialStatusDocument =
      (object.credentialStatusDocument !== undefined && object.credentialStatusDocument !== null)
        ? CredentialStatusDocument.fromPartial(object.credentialStatusDocument)
        : undefined;
    message.credentialStatusProof =
      (object.credentialStatusProof !== undefined && object.credentialStatusProof !== null)
        ? DocumentProof.fromPartial(object.credentialStatusProof)
        : undefined;
    message.txAuthor = object.txAuthor ?? undefined;
    return message;
  },
};

function createBaseMsgRegisterCredentialStatusResponse(): MsgRegisterCredentialStatusResponse {
  return {};
}

export const MsgRegisterCredentialStatusResponse = {
  encode(_: MsgRegisterCredentialStatusResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterCredentialStatusResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterCredentialStatusResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgRegisterCredentialStatusResponse {
    return {};
  },

  toJSON(_: MsgRegisterCredentialStatusResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRegisterCredentialStatusResponse>, I>>(
    base?: I,
  ): MsgRegisterCredentialStatusResponse {
    return MsgRegisterCredentialStatusResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRegisterCredentialStatusResponse>, I>>(
    _: I,
  ): MsgRegisterCredentialStatusResponse {
    const message = createBaseMsgRegisterCredentialStatusResponse();
    return message;
  },
};

function createBaseMsgUpdateCredentialStatus(): MsgUpdateCredentialStatus {
  return {};
}

export const MsgUpdateCredentialStatus = {
  encode(message: MsgUpdateCredentialStatus, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credentialStatusDocument !== undefined) {
      CredentialStatusDocument.encode(message.credentialStatusDocument, writer.uint32(10).fork()).ldelim();
    }
    if (message.credentialStatusProof !== undefined) {
      DocumentProof.encode(message.credentialStatusProof, writer.uint32(18).fork()).ldelim();
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      writer.uint32(26).string(message.txAuthor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateCredentialStatus {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateCredentialStatus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.credentialStatusDocument = CredentialStatusDocument.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.credentialStatusProof = DocumentProof.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.txAuthor = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateCredentialStatus {
    return {
      credentialStatusDocument: isSet(object.credentialStatusDocument)
        ? CredentialStatusDocument.fromJSON(object.credentialStatusDocument)
        : undefined,
      credentialStatusProof: isSet(object.credentialStatusProof)
        ? DocumentProof.fromJSON(object.credentialStatusProof)
        : undefined,
      txAuthor: isSet(object.txAuthor) ? globalThis.String(object.txAuthor) : undefined,
    };
  },

  toJSON(message: MsgUpdateCredentialStatus): unknown {
    const obj: any = {};
    if (message.credentialStatusDocument !== undefined) {
      obj.credentialStatusDocument = CredentialStatusDocument.toJSON(message.credentialStatusDocument);
    }
    if (message.credentialStatusProof !== undefined) {
      obj.credentialStatusProof = DocumentProof.toJSON(message.credentialStatusProof);
    }
    if (message.txAuthor !== undefined && message.txAuthor !== "") {
      obj.txAuthor = message.txAuthor;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateCredentialStatus>, I>>(base?: I): MsgUpdateCredentialStatus {
    return MsgUpdateCredentialStatus.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateCredentialStatus>, I>>(object: I): MsgUpdateCredentialStatus {
    const message = createBaseMsgUpdateCredentialStatus();
    message.credentialStatusDocument =
      (object.credentialStatusDocument !== undefined && object.credentialStatusDocument !== null)
        ? CredentialStatusDocument.fromPartial(object.credentialStatusDocument)
        : undefined;
    message.credentialStatusProof =
      (object.credentialStatusProof !== undefined && object.credentialStatusProof !== null)
        ? DocumentProof.fromPartial(object.credentialStatusProof)
        : undefined;
    message.txAuthor = object.txAuthor ?? undefined;
    return message;
  },
};

function createBaseMsgUpdateCredentialStatusResponse(): MsgUpdateCredentialStatusResponse {
  return {};
}

export const MsgUpdateCredentialStatusResponse = {
  encode(_: MsgUpdateCredentialStatusResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateCredentialStatusResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateCredentialStatusResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgUpdateCredentialStatusResponse {
    return {};
  },

  toJSON(_: MsgUpdateCredentialStatusResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateCredentialStatusResponse>, I>>(
    base?: I,
  ): MsgUpdateCredentialStatusResponse {
    return MsgUpdateCredentialStatusResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateCredentialStatusResponse>, I>>(
    _: I,
  ): MsgUpdateCredentialStatusResponse {
    const message = createBaseMsgUpdateCredentialStatusResponse();
    return message;
  },
};

export interface Msg {
  RegisterDID(request: MsgRegisterDID): Promise<MsgRegisterDIDResponse>;
  UpdateDID(request: MsgUpdateDID): Promise<MsgUpdateDIDResponse>;
  DeactivateDID(request: MsgDeactivateDID): Promise<MsgDeactivateDIDResponse>;
  RegisterCredentialSchema(request: MsgRegisterCredentialSchema): Promise<MsgRegisterCredentialSchemaResponse>;
  UpdateCredentialSchema(request: MsgUpdateCredentialSchema): Promise<MsgUpdateCredentialSchemaResponse>;
  RegisterCredentialStatus(request: MsgRegisterCredentialStatus): Promise<MsgRegisterCredentialStatusResponse>;
  UpdateCredentialStatus(request: MsgUpdateCredentialStatus): Promise<MsgUpdateCredentialStatusResponse>;
}

export const MsgServiceName = "hypersign.ssi.v1.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.RegisterDID = this.RegisterDID.bind(this);
    this.UpdateDID = this.UpdateDID.bind(this);
    this.DeactivateDID = this.DeactivateDID.bind(this);
    this.RegisterCredentialSchema = this.RegisterCredentialSchema.bind(this);
    this.UpdateCredentialSchema = this.UpdateCredentialSchema.bind(this);
    this.RegisterCredentialStatus = this.RegisterCredentialStatus.bind(this);
    this.UpdateCredentialStatus = this.UpdateCredentialStatus.bind(this);
  }
  RegisterDID(request: MsgRegisterDID): Promise<MsgRegisterDIDResponse> {
    const data = MsgRegisterDID.encode(request).finish();
    const promise = this.rpc.request(this.service, "RegisterDID", data);
    return promise.then((data) => MsgRegisterDIDResponse.decode(_m0.Reader.create(data)));
  }

  UpdateDID(request: MsgUpdateDID): Promise<MsgUpdateDIDResponse> {
    const data = MsgUpdateDID.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateDID", data);
    return promise.then((data) => MsgUpdateDIDResponse.decode(_m0.Reader.create(data)));
  }

  DeactivateDID(request: MsgDeactivateDID): Promise<MsgDeactivateDIDResponse> {
    const data = MsgDeactivateDID.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeactivateDID", data);
    return promise.then((data) => MsgDeactivateDIDResponse.decode(_m0.Reader.create(data)));
  }

  RegisterCredentialSchema(request: MsgRegisterCredentialSchema): Promise<MsgRegisterCredentialSchemaResponse> {
    const data = MsgRegisterCredentialSchema.encode(request).finish();
    const promise = this.rpc.request(this.service, "RegisterCredentialSchema", data);
    return promise.then((data) => MsgRegisterCredentialSchemaResponse.decode(_m0.Reader.create(data)));
  }

  UpdateCredentialSchema(request: MsgUpdateCredentialSchema): Promise<MsgUpdateCredentialSchemaResponse> {
    const data = MsgUpdateCredentialSchema.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateCredentialSchema", data);
    return promise.then((data) => MsgUpdateCredentialSchemaResponse.decode(_m0.Reader.create(data)));
  }

  RegisterCredentialStatus(request: MsgRegisterCredentialStatus): Promise<MsgRegisterCredentialStatusResponse> {
    const data = MsgRegisterCredentialStatus.encode(request).finish();
    const promise = this.rpc.request(this.service, "RegisterCredentialStatus", data);
    return promise.then((data) => MsgRegisterCredentialStatusResponse.decode(_m0.Reader.create(data)));
  }

  UpdateCredentialStatus(request: MsgUpdateCredentialStatus): Promise<MsgUpdateCredentialStatusResponse> {
    const data = MsgUpdateCredentialStatus.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateCredentialStatus", data);
    return promise.then((data) => MsgUpdateCredentialStatusResponse.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

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
