/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { DocumentProof } from "./proof";

export const protobufPackage = "hypersign.ssi.v1";

export interface CredentialStatusDocument {
  id?: string | undefined;
  revoked?: boolean | undefined;
  suspended?: boolean | undefined;
  remarks?: string | undefined;
  issuer?: string | undefined;
  issuanceDate?: string | undefined;
  credentialMerkleRootHash?: string | undefined;
}

export interface CredentialStatusState {
  credentialStatusDocument?: CredentialStatusDocument | undefined;
  credentialStatusProof?: DocumentProof | undefined;
}

function createBaseCredentialStatusDocument(): CredentialStatusDocument {
  return {};
}

export const CredentialStatusDocument = {
  encode(message: CredentialStatusDocument, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.revoked === true) {
      writer.uint32(16).bool(message.revoked);
    }
    if (message.suspended === true) {
      writer.uint32(24).bool(message.suspended);
    }
    if (message.remarks !== undefined && message.remarks !== "") {
      writer.uint32(34).string(message.remarks);
    }
    if (message.issuer !== undefined && message.issuer !== "") {
      writer.uint32(42).string(message.issuer);
    }
    if (message.issuanceDate !== undefined && message.issuanceDate !== "") {
      writer.uint32(50).string(message.issuanceDate);
    }
    if (message.credentialMerkleRootHash !== undefined && message.credentialMerkleRootHash !== "") {
      writer.uint32(58).string(message.credentialMerkleRootHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialStatusDocument {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialStatusDocument();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.revoked = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.suspended = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.remarks = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.issuer = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.issuanceDate = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.credentialMerkleRootHash = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CredentialStatusDocument {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : undefined,
      revoked: isSet(object.revoked) ? globalThis.Boolean(object.revoked) : undefined,
      suspended: isSet(object.suspended) ? globalThis.Boolean(object.suspended) : undefined,
      remarks: isSet(object.remarks) ? globalThis.String(object.remarks) : undefined,
      issuer: isSet(object.issuer) ? globalThis.String(object.issuer) : undefined,
      issuanceDate: isSet(object.issuanceDate) ? globalThis.String(object.issuanceDate) : undefined,
      credentialMerkleRootHash: isSet(object.credentialMerkleRootHash)
        ? globalThis.String(object.credentialMerkleRootHash)
        : undefined,
    };
  },

  toJSON(message: CredentialStatusDocument): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.revoked === true) {
      obj.revoked = message.revoked;
    }
    if (message.suspended === true) {
      obj.suspended = message.suspended;
    }
    if (message.remarks !== undefined && message.remarks !== "") {
      obj.remarks = message.remarks;
    }
    if (message.issuer !== undefined && message.issuer !== "") {
      obj.issuer = message.issuer;
    }
    if (message.issuanceDate !== undefined && message.issuanceDate !== "") {
      obj.issuanceDate = message.issuanceDate;
    }
    if (message.credentialMerkleRootHash !== undefined && message.credentialMerkleRootHash !== "") {
      obj.credentialMerkleRootHash = message.credentialMerkleRootHash;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialStatusDocument>, I>>(base?: I): CredentialStatusDocument {
    return CredentialStatusDocument.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialStatusDocument>, I>>(object: I): CredentialStatusDocument {
    const message = createBaseCredentialStatusDocument();
    message.id = object.id ?? undefined;
    message.revoked = object.revoked ?? undefined;
    message.suspended = object.suspended ?? undefined;
    message.remarks = object.remarks ?? undefined;
    message.issuer = object.issuer ?? undefined;
    message.issuanceDate = object.issuanceDate ?? undefined;
    message.credentialMerkleRootHash = object.credentialMerkleRootHash ?? undefined;
    return message;
  },
};

function createBaseCredentialStatusState(): CredentialStatusState {
  return {};
}

export const CredentialStatusState = {
  encode(message: CredentialStatusState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credentialStatusDocument !== undefined) {
      CredentialStatusDocument.encode(message.credentialStatusDocument, writer.uint32(10).fork()).ldelim();
    }
    if (message.credentialStatusProof !== undefined) {
      DocumentProof.encode(message.credentialStatusProof, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CredentialStatusState {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredentialStatusState();
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CredentialStatusState {
    return {
      credentialStatusDocument: isSet(object.credentialStatusDocument)
        ? CredentialStatusDocument.fromJSON(object.credentialStatusDocument)
        : undefined,
      credentialStatusProof: isSet(object.credentialStatusProof)
        ? DocumentProof.fromJSON(object.credentialStatusProof)
        : undefined,
    };
  },

  toJSON(message: CredentialStatusState): unknown {
    const obj: any = {};
    if (message.credentialStatusDocument !== undefined) {
      obj.credentialStatusDocument = CredentialStatusDocument.toJSON(message.credentialStatusDocument);
    }
    if (message.credentialStatusProof !== undefined) {
      obj.credentialStatusProof = DocumentProof.toJSON(message.credentialStatusProof);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CredentialStatusState>, I>>(base?: I): CredentialStatusState {
    return CredentialStatusState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CredentialStatusState>, I>>(object: I): CredentialStatusState {
    const message = createBaseCredentialStatusState();
    message.credentialStatusDocument =
      (object.credentialStatusDocument !== undefined && object.credentialStatusDocument !== null)
        ? CredentialStatusDocument.fromPartial(object.credentialStatusDocument)
        : undefined;
    message.credentialStatusProof =
      (object.credentialStatusProof !== undefined && object.credentialStatusProof !== null)
        ? DocumentProof.fromPartial(object.credentialStatusProof)
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
