/* eslint-disable */
import { ClientSpec } from "./clientSpec";
import { Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "hypersignprotocol.hidnode.ssi";

export interface Did {
  context: string[];
  id: string;
  controller: string[];
  alsoKnownAs: string[];
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement: string[];
  capabilityInvocation: string[];
  capabilityDelegation: string[];
  service: Service[];
}

export interface Metadata {
  created: string;
  updated: string;
  deactivated: boolean;
  versionId: string;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  /** If value is provided, `blockchainAccountId` must be empty */
  publicKeyMultibase: string;
  /** If value is provided, `publicKeyMultibase` must be empty */
  blockchainAccountId: string;
}

export interface Service {
  id: string;
  type: string;
  serviceEndpoint: string;
}

export interface SignInfo {
  verification_method_id: string;
  signature: string;
  clientSpec: ClientSpec | undefined;
}

export interface DidDocumentState {
  didDocument: Did | undefined;
  didDocumentMetadata: Metadata | undefined;
}

const baseDid: object = {
  context: "",
  id: "",
  controller: "",
  alsoKnownAs: "",
  authentication: "",
  assertionMethod: "",
  keyAgreement: "",
  capabilityInvocation: "",
  capabilityDelegation: "",
};

export const Did = {
  encode(message: Did, writer: Writer = Writer.create()): Writer {
    for (const v of message.context) {
      writer.uint32(10).string(v!);
    }
    if (message.id !== "") {
      writer.uint32(18).string(message.id);
    }
    for (const v of message.controller) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.alsoKnownAs) {
      writer.uint32(34).string(v!);
    }
    for (const v of message.verificationMethod) {
      VerificationMethod.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.authentication) {
      writer.uint32(50).string(v!);
    }
    for (const v of message.assertionMethod) {
      writer.uint32(58).string(v!);
    }
    for (const v of message.keyAgreement) {
      writer.uint32(66).string(v!);
    }
    for (const v of message.capabilityInvocation) {
      writer.uint32(74).string(v!);
    }
    for (const v of message.capabilityDelegation) {
      writer.uint32(82).string(v!);
    }
    for (const v of message.service) {
      Service.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Did {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDid } as Did;
    message.context = [];
    message.controller = [];
    message.alsoKnownAs = [];
    message.verificationMethod = [];
    message.authentication = [];
    message.assertionMethod = [];
    message.keyAgreement = [];
    message.capabilityInvocation = [];
    message.capabilityDelegation = [];
    message.service = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.context.push(reader.string());
          break;
        case 2:
          message.id = reader.string();
          break;
        case 3:
          message.controller.push(reader.string());
          break;
        case 4:
          message.alsoKnownAs.push(reader.string());
          break;
        case 5:
          message.verificationMethod.push(
            VerificationMethod.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.authentication.push(reader.string());
          break;
        case 7:
          message.assertionMethod.push(reader.string());
          break;
        case 8:
          message.keyAgreement.push(reader.string());
          break;
        case 9:
          message.capabilityInvocation.push(reader.string());
          break;
        case 10:
          message.capabilityDelegation.push(reader.string());
          break;
        case 11:
          message.service.push(Service.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Did {
    const message = { ...baseDid } as Did;
    message.context = [];
    message.controller = [];
    message.alsoKnownAs = [];
    message.verificationMethod = [];
    message.authentication = [];
    message.assertionMethod = [];
    message.keyAgreement = [];
    message.capabilityInvocation = [];
    message.capabilityDelegation = [];
    message.service = [];
    if (object.context !== undefined && object.context !== null) {
      for (const e of object.context) {
        message.context.push(String(e));
      }
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = "";
    }
    if (object.controller !== undefined && object.controller !== null) {
      for (const e of object.controller) {
        message.controller.push(String(e));
      }
    }
    if (object.alsoKnownAs !== undefined && object.alsoKnownAs !== null) {
      for (const e of object.alsoKnownAs) {
        message.alsoKnownAs.push(String(e));
      }
    }
    if (
      object.verificationMethod !== undefined &&
      object.verificationMethod !== null
    ) {
      for (const e of object.verificationMethod) {
        message.verificationMethod.push(VerificationMethod.fromJSON(e));
      }
    }
    if (object.authentication !== undefined && object.authentication !== null) {
      for (const e of object.authentication) {
        message.authentication.push(String(e));
      }
    }
    if (
      object.assertionMethod !== undefined &&
      object.assertionMethod !== null
    ) {
      for (const e of object.assertionMethod) {
        message.assertionMethod.push(String(e));
      }
    }
    if (object.keyAgreement !== undefined && object.keyAgreement !== null) {
      for (const e of object.keyAgreement) {
        message.keyAgreement.push(String(e));
      }
    }
    if (
      object.capabilityInvocation !== undefined &&
      object.capabilityInvocation !== null
    ) {
      for (const e of object.capabilityInvocation) {
        message.capabilityInvocation.push(String(e));
      }
    }
    if (
      object.capabilityDelegation !== undefined &&
      object.capabilityDelegation !== null
    ) {
      for (const e of object.capabilityDelegation) {
        message.capabilityDelegation.push(String(e));
      }
    }
    if (object.service !== undefined && object.service !== null) {
      for (const e of object.service) {
        message.service.push(Service.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: Did): unknown {
    const obj: any = {};
    if (message.context) {
      obj.context = message.context.map((e) => e);
    } else {
      obj.context = [];
    }
    message.id !== undefined && (obj.id = message.id);
    if (message.controller) {
      obj.controller = message.controller.map((e) => e);
    } else {
      obj.controller = [];
    }
    if (message.alsoKnownAs) {
      obj.alsoKnownAs = message.alsoKnownAs.map((e) => e);
    } else {
      obj.alsoKnownAs = [];
    }
    if (message.verificationMethod) {
      obj.verificationMethod = message.verificationMethod.map((e) =>
        e ? VerificationMethod.toJSON(e) : undefined
      );
    } else {
      obj.verificationMethod = [];
    }
    if (message.authentication) {
      obj.authentication = message.authentication.map((e) => e);
    } else {
      obj.authentication = [];
    }
    if (message.assertionMethod) {
      obj.assertionMethod = message.assertionMethod.map((e) => e);
    } else {
      obj.assertionMethod = [];
    }
    if (message.keyAgreement) {
      obj.keyAgreement = message.keyAgreement.map((e) => e);
    } else {
      obj.keyAgreement = [];
    }
    if (message.capabilityInvocation) {
      obj.capabilityInvocation = message.capabilityInvocation.map((e) => e);
    } else {
      obj.capabilityInvocation = [];
    }
    if (message.capabilityDelegation) {
      obj.capabilityDelegation = message.capabilityDelegation.map((e) => e);
    } else {
      obj.capabilityDelegation = [];
    }
    if (message.service) {
      obj.service = message.service.map((e) =>
        e ? Service.toJSON(e) : undefined
      );
    } else {
      obj.service = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Did>): Did {
    const message = { ...baseDid } as Did;
    message.context = [];
    message.controller = [];
    message.alsoKnownAs = [];
    message.verificationMethod = [];
    message.authentication = [];
    message.assertionMethod = [];
    message.keyAgreement = [];
    message.capabilityInvocation = [];
    message.capabilityDelegation = [];
    message.service = [];
    if (object.context !== undefined && object.context !== null) {
      for (const e of object.context) {
        message.context.push(e);
      }
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = "";
    }
    if (object.controller !== undefined && object.controller !== null) {
      for (const e of object.controller) {
        message.controller.push(e);
      }
    }
    if (object.alsoKnownAs !== undefined && object.alsoKnownAs !== null) {
      for (const e of object.alsoKnownAs) {
        message.alsoKnownAs.push(e);
      }
    }
    if (
      object.verificationMethod !== undefined &&
      object.verificationMethod !== null
    ) {
      for (const e of object.verificationMethod) {
        message.verificationMethod.push(VerificationMethod.fromPartial(e));
      }
    }
    if (object.authentication !== undefined && object.authentication !== null) {
      for (const e of object.authentication) {
        message.authentication.push(e);
      }
    }
    if (
      object.assertionMethod !== undefined &&
      object.assertionMethod !== null
    ) {
      for (const e of object.assertionMethod) {
        message.assertionMethod.push(e);
      }
    }
    if (object.keyAgreement !== undefined && object.keyAgreement !== null) {
      for (const e of object.keyAgreement) {
        message.keyAgreement.push(e);
      }
    }
    if (
      object.capabilityInvocation !== undefined &&
      object.capabilityInvocation !== null
    ) {
      for (const e of object.capabilityInvocation) {
        message.capabilityInvocation.push(e);
      }
    }
    if (
      object.capabilityDelegation !== undefined &&
      object.capabilityDelegation !== null
    ) {
      for (const e of object.capabilityDelegation) {
        message.capabilityDelegation.push(e);
      }
    }
    if (object.service !== undefined && object.service !== null) {
      for (const e of object.service) {
        message.service.push(Service.fromPartial(e));
      }
    }
    return message;
  },
};

const baseMetadata: object = {
  created: "",
  updated: "",
  deactivated: false,
  versionId: "",
};

export const Metadata = {
  encode(message: Metadata, writer: Writer = Writer.create()): Writer {
    if (message.created !== "") {
      writer.uint32(10).string(message.created);
    }
    if (message.updated !== "") {
      writer.uint32(18).string(message.updated);
    }
    if (message.deactivated === true) {
      writer.uint32(24).bool(message.deactivated);
    }
    if (message.versionId !== "") {
      writer.uint32(34).string(message.versionId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Metadata {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMetadata } as Metadata;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.created = reader.string();
          break;
        case 2:
          message.updated = reader.string();
          break;
        case 3:
          message.deactivated = reader.bool();
          break;
        case 4:
          message.versionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Metadata {
    const message = { ...baseMetadata } as Metadata;
    if (object.created !== undefined && object.created !== null) {
      message.created = String(object.created);
    } else {
      message.created = "";
    }
    if (object.updated !== undefined && object.updated !== null) {
      message.updated = String(object.updated);
    } else {
      message.updated = "";
    }
    if (object.deactivated !== undefined && object.deactivated !== null) {
      message.deactivated = Boolean(object.deactivated);
    } else {
      message.deactivated = false;
    }
    if (object.versionId !== undefined && object.versionId !== null) {
      message.versionId = String(object.versionId);
    } else {
      message.versionId = "";
    }
    return message;
  },

  toJSON(message: Metadata): unknown {
    const obj: any = {};
    message.created !== undefined && (obj.created = message.created);
    message.updated !== undefined && (obj.updated = message.updated);
    message.deactivated !== undefined &&
      (obj.deactivated = message.deactivated);
    message.versionId !== undefined && (obj.versionId = message.versionId);
    return obj;
  },

  fromPartial(object: DeepPartial<Metadata>): Metadata {
    const message = { ...baseMetadata } as Metadata;
    if (object.created !== undefined && object.created !== null) {
      message.created = object.created;
    } else {
      message.created = "";
    }
    if (object.updated !== undefined && object.updated !== null) {
      message.updated = object.updated;
    } else {
      message.updated = "";
    }
    if (object.deactivated !== undefined && object.deactivated !== null) {
      message.deactivated = object.deactivated;
    } else {
      message.deactivated = false;
    }
    if (object.versionId !== undefined && object.versionId !== null) {
      message.versionId = object.versionId;
    } else {
      message.versionId = "";
    }
    return message;
  },
};

const baseVerificationMethod: object = {
  id: "",
  type: "",
  controller: "",
  publicKeyMultibase: "",
  blockchainAccountId: "",
};

export const VerificationMethod = {
  encode(
    message: VerificationMethod,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.controller !== "") {
      writer.uint32(26).string(message.controller);
    }
    if (message.publicKeyMultibase !== "") {
      writer.uint32(34).string(message.publicKeyMultibase);
    }
    if (message.blockchainAccountId !== "") {
      writer.uint32(42).string(message.blockchainAccountId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): VerificationMethod {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseVerificationMethod } as VerificationMethod;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.controller = reader.string();
          break;
        case 4:
          message.publicKeyMultibase = reader.string();
          break;
        case 5:
          message.blockchainAccountId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): VerificationMethod {
    const message = { ...baseVerificationMethod } as VerificationMethod;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = "";
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (object.controller !== undefined && object.controller !== null) {
      message.controller = String(object.controller);
    } else {
      message.controller = "";
    }
    if (
      object.publicKeyMultibase !== undefined &&
      object.publicKeyMultibase !== null
    ) {
      message.publicKeyMultibase = String(object.publicKeyMultibase);
    } else {
      message.publicKeyMultibase = "";
    }
    if (
      object.blockchainAccountId !== undefined &&
      object.blockchainAccountId !== null
    ) {
      message.blockchainAccountId = String(object.blockchainAccountId);
    } else {
      message.blockchainAccountId = "";
    }
    return message;
  },

  toJSON(message: VerificationMethod): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.type !== undefined && (obj.type = message.type);
    message.controller !== undefined && (obj.controller = message.controller);
    message.publicKeyMultibase !== undefined &&
      (obj.publicKeyMultibase = message.publicKeyMultibase);
    message.blockchainAccountId !== undefined &&
      (obj.blockchainAccountId = message.blockchainAccountId);
    return obj;
  },

  fromPartial(object: DeepPartial<VerificationMethod>): VerificationMethod {
    const message = { ...baseVerificationMethod } as VerificationMethod;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = "";
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (object.controller !== undefined && object.controller !== null) {
      message.controller = object.controller;
    } else {
      message.controller = "";
    }
    if (
      object.publicKeyMultibase !== undefined &&
      object.publicKeyMultibase !== null
    ) {
      message.publicKeyMultibase = object.publicKeyMultibase;
    } else {
      message.publicKeyMultibase = "";
    }
    if (
      object.blockchainAccountId !== undefined &&
      object.blockchainAccountId !== null
    ) {
      message.blockchainAccountId = object.blockchainAccountId;
    } else {
      message.blockchainAccountId = "";
    }
    return message;
  },
};

const baseService: object = { id: "", type: "", serviceEndpoint: "" };

export const Service = {
  encode(message: Service, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.serviceEndpoint !== "") {
      writer.uint32(26).string(message.serviceEndpoint);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Service {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseService } as Service;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.serviceEndpoint = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Service {
    const message = { ...baseService } as Service;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = "";
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (
      object.serviceEndpoint !== undefined &&
      object.serviceEndpoint !== null
    ) {
      message.serviceEndpoint = String(object.serviceEndpoint);
    } else {
      message.serviceEndpoint = "";
    }
    return message;
  },

  toJSON(message: Service): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.type !== undefined && (obj.type = message.type);
    message.serviceEndpoint !== undefined &&
      (obj.serviceEndpoint = message.serviceEndpoint);
    return obj;
  },

  fromPartial(object: DeepPartial<Service>): Service {
    const message = { ...baseService } as Service;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = "";
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (
      object.serviceEndpoint !== undefined &&
      object.serviceEndpoint !== null
    ) {
      message.serviceEndpoint = object.serviceEndpoint;
    } else {
      message.serviceEndpoint = "";
    }
    return message;
  },
};

const baseSignInfo: object = { verification_method_id: "", signature: "" };

export const SignInfo = {
  encode(message: SignInfo, writer: Writer = Writer.create()): Writer {
    if (message.verification_method_id !== "") {
      writer.uint32(10).string(message.verification_method_id);
    }
    if (message.signature !== "") {
      writer.uint32(18).string(message.signature);
    }
    if (message.clientSpec !== undefined) {
      ClientSpec.encode(message.clientSpec, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SignInfo {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSignInfo } as SignInfo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.verification_method_id = reader.string();
          break;
        case 2:
          message.signature = reader.string();
          break;
        case 3:
          message.clientSpec = ClientSpec.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignInfo {
    const message = { ...baseSignInfo } as SignInfo;
    if (
      object.verification_method_id !== undefined &&
      object.verification_method_id !== null
    ) {
      message.verification_method_id = String(object.verification_method_id);
    } else {
      message.verification_method_id = "";
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = String(object.signature);
    } else {
      message.signature = "";
    }
    if (object.clientSpec !== undefined && object.clientSpec !== null) {
      message.clientSpec = ClientSpec.fromJSON(object.clientSpec);
    } else {
      message.clientSpec = undefined;
    }
    return message;
  },

  toJSON(message: SignInfo): unknown {
    const obj: any = {};
    message.verification_method_id !== undefined &&
      (obj.verification_method_id = message.verification_method_id);
    message.signature !== undefined && (obj.signature = message.signature);
    message.clientSpec !== undefined &&
      (obj.clientSpec = message.clientSpec
        ? ClientSpec.toJSON(message.clientSpec)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<SignInfo>): SignInfo {
    const message = { ...baseSignInfo } as SignInfo;
    if (
      object.verification_method_id !== undefined &&
      object.verification_method_id !== null
    ) {
      message.verification_method_id = object.verification_method_id;
    } else {
      message.verification_method_id = "";
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = object.signature;
    } else {
      message.signature = "";
    }
    if (object.clientSpec !== undefined && object.clientSpec !== null) {
      message.clientSpec = ClientSpec.fromPartial(object.clientSpec);
    } else {
      message.clientSpec = undefined;
    }
    return message;
  },
};

const baseDidDocumentState: object = {};

export const DidDocumentState = {
  encode(message: DidDocumentState, writer: Writer = Writer.create()): Writer {
    if (message.didDocument !== undefined) {
      Did.encode(message.didDocument, writer.uint32(10).fork()).ldelim();
    }
    if (message.didDocumentMetadata !== undefined) {
      Metadata.encode(
        message.didDocumentMetadata,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DidDocumentState {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDidDocumentState } as DidDocumentState;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.didDocument = Did.decode(reader, reader.uint32());
          break;
        case 2:
          message.didDocumentMetadata = Metadata.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DidDocumentState {
    const message = { ...baseDidDocumentState } as DidDocumentState;
    if (object.didDocument !== undefined && object.didDocument !== null) {
      message.didDocument = Did.fromJSON(object.didDocument);
    } else {
      message.didDocument = undefined;
    }
    if (
      object.didDocumentMetadata !== undefined &&
      object.didDocumentMetadata !== null
    ) {
      message.didDocumentMetadata = Metadata.fromJSON(
        object.didDocumentMetadata
      );
    } else {
      message.didDocumentMetadata = undefined;
    }
    return message;
  },

  toJSON(message: DidDocumentState): unknown {
    const obj: any = {};
    message.didDocument !== undefined &&
      (obj.didDocument = message.didDocument
        ? Did.toJSON(message.didDocument)
        : undefined);
    message.didDocumentMetadata !== undefined &&
      (obj.didDocumentMetadata = message.didDocumentMetadata
        ? Metadata.toJSON(message.didDocumentMetadata)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<DidDocumentState>): DidDocumentState {
    const message = { ...baseDidDocumentState } as DidDocumentState;
    if (object.didDocument !== undefined && object.didDocument !== null) {
      message.didDocument = Did.fromPartial(object.didDocument);
    } else {
      message.didDocument = undefined;
    }
    if (
      object.didDocumentMetadata !== undefined &&
      object.didDocumentMetadata !== null
    ) {
      message.didDocumentMetadata = Metadata.fromPartial(
        object.didDocumentMetadata
      );
    } else {
      message.didDocumentMetadata = undefined;
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
