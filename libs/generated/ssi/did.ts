/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "hypersign.ssi.v1";

export interface DidDocument {
  "@context"?: string[] | undefined;
  id?: string | undefined;
  controller?: string[] | undefined;
  alsoKnownAs?: string[] | undefined;
  verificationMethod?: VerificationMethod[] | undefined;
  authentication?: string[] | undefined;
  assertionMethod?: string[] | undefined;
  keyAgreement?: string[] | undefined;
  capabilityInvocation?: string[] | undefined;
  capabilityDelegation?: string[] | undefined;
  service?: Service[] | undefined;
}

export interface DidDocumentMetadata {
  created?: string | undefined;
  updated?: string | undefined;
  deactivated?: boolean | undefined;
  versionId?: string | undefined;
}

export interface VerificationMethod {
  id?: string | undefined;
  type?: string | undefined;
  controller?:
  | string
  | undefined;
  /** If value is provided, `blockchainAccountId` must be empty */
  publicKeyMultibase?:
  | string
  | undefined;
  /** If value is provided, `publicKeyMultibase` must be empty */
  blockchainAccountId?: string | undefined;
}

export interface Service {
  id?: string | undefined;
  type?: string | undefined;
  serviceEndpoint?: string | undefined;
}

export interface DidDocumentState {
  didDocument?: DidDocument | undefined;
  didDocumentMetadata?: DidDocumentMetadata | undefined;
}

function createBaseDidDocument(): DidDocument {
  return {};
}

export const DidDocument = {
  encode(message: DidDocument, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message["@context"] !== undefined && message["@context"].length !== 0) {
      for (const v of message["@context"]) {
        writer.uint32(10).string(v!);
      }
    }
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(18).string(message.id);
    }
    if (message.controller !== undefined && message.controller.length !== 0) {
      for (const v of message.controller) {
        writer.uint32(26).string(v!);
      }
    }
    if (message.alsoKnownAs !== undefined && message.alsoKnownAs.length !== 0) {
      for (const v of message.alsoKnownAs) {
        writer.uint32(34).string(v!);
      }
    }
    if (message.verificationMethod !== undefined && message.verificationMethod.length !== 0) {
      for (const v of message.verificationMethod) {
        VerificationMethod.encode(v!, writer.uint32(42).fork()).ldelim();
      }
    }
    if (message.authentication !== undefined && message.authentication.length !== 0) {
      for (const v of message.authentication) {
        writer.uint32(50).string(v!);
      }
    }
    if (message.assertionMethod !== undefined && message.assertionMethod.length !== 0) {
      for (const v of message.assertionMethod) {
        writer.uint32(58).string(v!);
      }
    }
    if (message.keyAgreement !== undefined && message.keyAgreement.length !== 0) {
      for (const v of message.keyAgreement) {
        writer.uint32(66).string(v!);
      }
    }
    if (message.capabilityInvocation !== undefined && message.capabilityInvocation.length !== 0) {
      for (const v of message.capabilityInvocation) {
        writer.uint32(74).string(v!);
      }
    }
    if (message.capabilityDelegation !== undefined && message.capabilityDelegation.length !== 0) {
      for (const v of message.capabilityDelegation) {
        writer.uint32(82).string(v!);
      }
    }
    if (message.service !== undefined && message.service.length !== 0) {
      for (const v of message.service) {
        Service.encode(v!, writer.uint32(90).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DidDocument {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDidDocument();
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

          message.id = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          if (message.controller === undefined) {
            message.controller = [];
          }
          message.controller!.push(reader.string());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          if (message.alsoKnownAs === undefined) {
            message.alsoKnownAs = [];
          }
          message.alsoKnownAs!.push(reader.string());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          if (message.verificationMethod === undefined) {
            message.verificationMethod = [];
          }
          message.verificationMethod!.push(VerificationMethod.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          if (message.authentication === undefined) {
            message.authentication = [];
          }
          message.authentication!.push(reader.string());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          if (message.assertionMethod === undefined) {
            message.assertionMethod = [];
          }
          message.assertionMethod!.push(reader.string());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          if (message.keyAgreement === undefined) {
            message.keyAgreement = [];
          }
          message.keyAgreement!.push(reader.string());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          if (message.capabilityInvocation === undefined) {
            message.capabilityInvocation = [];
          }
          message.capabilityInvocation!.push(reader.string());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          if (message.capabilityDelegation === undefined) {
            message.capabilityDelegation = [];
          }
          message.capabilityDelegation!.push(reader.string());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          if (message.service === undefined) {
            message.service = [];
          }
          message.service!.push(Service.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DidDocument {
    return {
      "@context": globalThis.Array.isArray(object?.["@context"])
        ? object["@context"].map((e: any) => globalThis.String(e))
        : undefined,
      id: isSet(object.id) ? globalThis.String(object.id) : undefined,
      controller: globalThis.Array.isArray(object?.controller)
        ? object.controller.map((e: any) => globalThis.String(e))
        : undefined,
      alsoKnownAs: globalThis.Array.isArray(object?.alsoKnownAs)
        ? object.alsoKnownAs.map((e: any) => globalThis.String(e))
        : undefined,
      verificationMethod: globalThis.Array.isArray(object?.verificationMethod)
        ? object.verificationMethod.map((e: any) => VerificationMethod.fromJSON(e))
        : undefined,
      authentication: globalThis.Array.isArray(object?.authentication)
        ? object.authentication.map((e: any) => globalThis.String(e))
        : undefined,
      assertionMethod: globalThis.Array.isArray(object?.assertionMethod)
        ? object.assertionMethod.map((e: any) => globalThis.String(e))
        : undefined,
      keyAgreement: globalThis.Array.isArray(object?.keyAgreement)
        ? object.keyAgreement.map((e: any) => globalThis.String(e))
        : undefined,
      capabilityInvocation: globalThis.Array.isArray(object?.capabilityInvocation)
        ? object.capabilityInvocation.map((e: any) => globalThis.String(e))
        : undefined,
      capabilityDelegation: globalThis.Array.isArray(object?.capabilityDelegation)
        ? object.capabilityDelegation.map((e: any) => globalThis.String(e))
        : undefined,
      service: globalThis.Array.isArray(object?.service)
        ? object.service.map((e: any) => Service.fromJSON(e))
        : undefined,
    };
  },

  toJSON(message: DidDocument): unknown {
    const obj: any = {};
    if (message["@context"]?.length) {
      obj["@context"] = message["@context"];
    }
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.controller?.length) {
      obj.controller = message.controller;
    }
    if (message.alsoKnownAs?.length) {
      obj.alsoKnownAs = message.alsoKnownAs;
    }
    if (message.verificationMethod?.length) {
      obj.verificationMethod = message.verificationMethod.map((e) => VerificationMethod.toJSON(e));
    }
    if (message.authentication?.length) {
      obj.authentication = message.authentication;
    }
    if (message.assertionMethod?.length) {
      obj.assertionMethod = message.assertionMethod;
    }
    if (message.keyAgreement?.length) {
      obj.keyAgreement = message.keyAgreement;
    }
    if (message.capabilityInvocation?.length) {
      obj.capabilityInvocation = message.capabilityInvocation;
    }
    if (message.capabilityDelegation?.length) {
      obj.capabilityDelegation = message.capabilityDelegation;
    }
    if (message.service?.length) {
      obj.service = message.service.map((e) => Service.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DidDocument>, I>>(base?: I): DidDocument {
    return DidDocument.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DidDocument>, I>>(object: I): DidDocument {
    const message = createBaseDidDocument();
    message["@context"] = object["@context"]?.map((e) => e) || undefined;
    message.id = object.id ?? undefined;
    message.controller = object.controller?.map((e) => e) || undefined;
    message.alsoKnownAs = object.alsoKnownAs?.map((e) => e) || undefined;
    message.verificationMethod = object.verificationMethod?.map((e) => VerificationMethod.fromPartial(e)) || undefined;
    message.authentication = object.authentication?.map((e) => e) || undefined;
    message.assertionMethod = object.assertionMethod?.map((e) => e) || undefined;
    message.keyAgreement = object.keyAgreement?.map((e) => e) || undefined;
    message.capabilityInvocation = object.capabilityInvocation?.map((e) => e) || undefined;
    message.capabilityDelegation = object.capabilityDelegation?.map((e) => e) || undefined;
    message.service = object.service?.map((e) => Service.fromPartial(e)) || undefined;
    return message;
  },
};

function createBaseDidDocumentMetadata(): DidDocumentMetadata {
  return {};
}

export const DidDocumentMetadata = {
  encode(message: DidDocumentMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.created !== undefined && message.created !== "") {
      writer.uint32(10).string(message.created);
    }
    if (message.updated !== undefined && message.updated !== "") {
      writer.uint32(18).string(message.updated);
    }
    if (message.deactivated === true) {
      writer.uint32(24).bool(message.deactivated);
    }
    if (message.versionId !== undefined && message.versionId !== "") {
      writer.uint32(34).string(message.versionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DidDocumentMetadata {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDidDocumentMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.created = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.updated = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.deactivated = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.versionId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DidDocumentMetadata {
    return {
      created: isSet(object.created) ? globalThis.String(object.created) : undefined,
      updated: isSet(object.updated) ? globalThis.String(object.updated) : undefined,
      deactivated: isSet(object.deactivated) ? globalThis.Boolean(object.deactivated) : undefined,
      versionId: isSet(object.versionId) ? globalThis.String(object.versionId) : undefined,
    };
  },

  toJSON(message: DidDocumentMetadata): unknown {
    const obj: any = {};
    if (message.created !== undefined && message.created !== "") {
      obj.created = message.created;
    }
    if (message.updated !== undefined && message.updated !== "") {
      obj.updated = message.updated;
    }
    if (message.deactivated === true) {
      obj.deactivated = message.deactivated;
    }
    if (message.versionId !== undefined && message.versionId !== "") {
      obj.versionId = message.versionId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DidDocumentMetadata>, I>>(base?: I): DidDocumentMetadata {
    return DidDocumentMetadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DidDocumentMetadata>, I>>(object: I): DidDocumentMetadata {
    const message = createBaseDidDocumentMetadata();
    message.created = object.created ?? undefined;
    message.updated = object.updated ?? undefined;
    message.deactivated = object.deactivated ?? undefined;
    message.versionId = object.versionId ?? undefined;
    return message;
  },
};

function createBaseVerificationMethod(): VerificationMethod {
  return {};
}

export const VerificationMethod = {
  encode(message: VerificationMethod, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.type !== undefined && message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.controller !== undefined && message.controller !== "") {
      writer.uint32(26).string(message.controller);
    }
    if (message.publicKeyMultibase !== undefined && message.publicKeyMultibase !== "") {
      writer.uint32(34).string(message.publicKeyMultibase);
    }
    if (message.blockchainAccountId !== undefined && message.blockchainAccountId !== "") {
      writer.uint32(42).string(message.blockchainAccountId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerificationMethod {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerificationMethod();
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
          if (tag !== 18) {
            break;
          }

          message.type = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.controller = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.publicKeyMultibase = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.blockchainAccountId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VerificationMethod {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : undefined,
      type: isSet(object.type) ? globalThis.String(object.type) : undefined,
      controller: isSet(object.controller) ? globalThis.String(object.controller) : undefined,
      publicKeyMultibase: isSet(object.publicKeyMultibase) ? globalThis.String(object.publicKeyMultibase) : undefined,
      blockchainAccountId: isSet(object.blockchainAccountId)
        ? globalThis.String(object.blockchainAccountId)
        : undefined,
    };
  },

  toJSON(message: VerificationMethod): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.type !== undefined && message.type !== "") {
      obj.type = message.type;
    }
    if (message.controller !== undefined && message.controller !== "") {
      obj.controller = message.controller;
    }
    if (message.publicKeyMultibase !== undefined && message.publicKeyMultibase !== "") {
      obj.publicKeyMultibase = message.publicKeyMultibase;
    }
    if (message.blockchainAccountId !== undefined && message.blockchainAccountId !== "") {
      obj.blockchainAccountId = message.blockchainAccountId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VerificationMethod>, I>>(base?: I): VerificationMethod {
    return VerificationMethod.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VerificationMethod>, I>>(object: I): VerificationMethod {
    const message = createBaseVerificationMethod();
    message.id = object.id ?? undefined;
    message.type = object.type ?? undefined;
    message.controller = object.controller ?? undefined;
    message.publicKeyMultibase = object.publicKeyMultibase ?? undefined;
    message.blockchainAccountId = object.blockchainAccountId ?? undefined;
    return message;
  },
};

function createBaseService(): Service {
  return {};
}

export const Service = {
  encode(message: Service, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.type !== undefined && message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.serviceEndpoint !== undefined && message.serviceEndpoint !== "") {
      writer.uint32(26).string(message.serviceEndpoint);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Service {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseService();
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
          if (tag !== 18) {
            break;
          }

          message.type = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.serviceEndpoint = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Service {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : undefined,
      type: isSet(object.type) ? globalThis.String(object.type) : undefined,
      serviceEndpoint: isSet(object.serviceEndpoint) ? globalThis.String(object.serviceEndpoint) : undefined,
    };
  },

  toJSON(message: Service): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.type !== undefined && message.type !== "") {
      obj.type = message.type;
    }
    if (message.serviceEndpoint !== undefined && message.serviceEndpoint !== "") {
      obj.serviceEndpoint = message.serviceEndpoint;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Service>, I>>(base?: I): Service {
    return Service.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Service>, I>>(object: I): Service {
    const message = createBaseService();
    message.id = object.id ?? undefined;
    message.type = object.type ?? undefined;
    message.serviceEndpoint = object.serviceEndpoint ?? undefined;
    return message;
  },
};

function createBaseDidDocumentState(): DidDocumentState {
  return {};
}

export const DidDocumentState = {
  encode(message: DidDocumentState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.didDocument !== undefined) {
      DidDocument.encode(message.didDocument, writer.uint32(10).fork()).ldelim();
    }
    if (message.didDocumentMetadata !== undefined) {
      DidDocumentMetadata.encode(message.didDocumentMetadata, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DidDocumentState {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDidDocumentState();
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

          message.didDocumentMetadata = DidDocumentMetadata.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DidDocumentState {
    return {
      didDocument: isSet(object.didDocument) ? DidDocument.fromJSON(object.didDocument) : undefined,
      didDocumentMetadata: isSet(object.didDocumentMetadata)
        ? DidDocumentMetadata.fromJSON(object.didDocumentMetadata)
        : undefined,
    };
  },

  toJSON(message: DidDocumentState): unknown {
    const obj: any = {};
    if (message.didDocument !== undefined) {
      obj.didDocument = DidDocument.toJSON(message.didDocument);
    }
    if (message.didDocumentMetadata !== undefined) {
      obj.didDocumentMetadata = DidDocumentMetadata.toJSON(message.didDocumentMetadata);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DidDocumentState>, I>>(base?: I): DidDocumentState {
    return DidDocumentState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DidDocumentState>, I>>(object: I): DidDocumentState {
    const message = createBaseDidDocumentState();
    message.didDocument = (object.didDocument !== undefined && object.didDocument !== null)
      ? DidDocument.fromPartial(object.didDocument)
      : undefined;
    message.didDocumentMetadata = (object.didDocumentMetadata !== undefined && object.didDocumentMetadata !== null)
      ? DidDocumentMetadata.fromPartial(object.didDocumentMetadata)
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
