"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialStatusState = exports.CredentialStatusDocument = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const proof_1 = require("./proof");
exports.protobufPackage = "hypersign.ssi.v1";
function createBaseCredentialStatusDocument() {
    return {};
}
exports.CredentialStatusDocument = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message["@context"] !== undefined && message["@context"].length !== 0) {
            for (const v of message["@context"]) {
                writer.uint32(10).string(v);
            }
        }
        if (message.id !== undefined && message.id !== "") {
            writer.uint32(18).string(message.id);
        }
        if (message.revoked === true) {
            writer.uint32(24).bool(message.revoked);
        }
        if (message.suspended === true) {
            writer.uint32(32).bool(message.suspended);
        }
        if (message.remarks !== undefined && message.remarks !== "") {
            writer.uint32(42).string(message.remarks);
        }
        if (message.issuer !== undefined && message.issuer !== "") {
            writer.uint32(50).string(message.issuer);
        }
        if (message.issuanceDate !== undefined && message.issuanceDate !== "") {
            writer.uint32(58).string(message.issuanceDate);
        }
        if (message.credentialMerkleRootHash !== undefined && message.credentialMerkleRootHash !== "") {
            writer.uint32(66).string(message.credentialMerkleRootHash);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCredentialStatusDocument();
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
                    message["@context"].push(reader.string());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.id = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.revoked = reader.bool();
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.suspended = reader.bool();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.remarks = reader.string();
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.issuer = reader.string();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.issuanceDate = reader.string();
                    continue;
                case 8:
                    if (tag !== 66) {
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
    fromJSON(object) {
        return {
            "@context": globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object["@context"])
                ? object["@context"].map((e) => globalThis.String(e))
                : undefined,
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
    toJSON(message) {
        var _a;
        const obj = {};
        if ((_a = message["@context"]) === null || _a === void 0 ? void 0 : _a.length) {
            obj["@context"] = message["@context"];
        }
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
    create(base) {
        return exports.CredentialStatusDocument.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = createBaseCredentialStatusDocument();
        message["@context"] = ((_a = object["@context"]) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || undefined;
        message.id = (_b = object.id) !== null && _b !== void 0 ? _b : undefined;
        message.revoked = (_c = object.revoked) !== null && _c !== void 0 ? _c : undefined;
        message.suspended = (_d = object.suspended) !== null && _d !== void 0 ? _d : undefined;
        message.remarks = (_e = object.remarks) !== null && _e !== void 0 ? _e : undefined;
        message.issuer = (_f = object.issuer) !== null && _f !== void 0 ? _f : undefined;
        message.issuanceDate = (_g = object.issuanceDate) !== null && _g !== void 0 ? _g : undefined;
        message.credentialMerkleRootHash = (_h = object.credentialMerkleRootHash) !== null && _h !== void 0 ? _h : undefined;
        return message;
    },
};
function createBaseCredentialStatusState() {
    return {};
}
exports.CredentialStatusState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.credentialStatusDocument !== undefined) {
            exports.CredentialStatusDocument.encode(message.credentialStatusDocument, writer.uint32(10).fork()).ldelim();
        }
        if (message.credentialStatusProof !== undefined) {
            proof_1.DocumentProof.encode(message.credentialStatusProof, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCredentialStatusState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.credentialStatusDocument = exports.CredentialStatusDocument.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.credentialStatusProof = proof_1.DocumentProof.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            credentialStatusDocument: isSet(object.credentialStatusDocument)
                ? exports.CredentialStatusDocument.fromJSON(object.credentialStatusDocument)
                : undefined,
            credentialStatusProof: isSet(object.credentialStatusProof)
                ? proof_1.DocumentProof.fromJSON(object.credentialStatusProof)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.credentialStatusDocument !== undefined) {
            obj.credentialStatusDocument = exports.CredentialStatusDocument.toJSON(message.credentialStatusDocument);
        }
        if (message.credentialStatusProof !== undefined) {
            obj.credentialStatusProof = proof_1.DocumentProof.toJSON(message.credentialStatusProof);
        }
        return obj;
    },
    create(base) {
        return exports.CredentialStatusState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseCredentialStatusState();
        message.credentialStatusDocument =
            (object.credentialStatusDocument !== undefined && object.credentialStatusDocument !== null)
                ? exports.CredentialStatusDocument.fromPartial(object.credentialStatusDocument)
                : undefined;
        message.credentialStatusProof =
            (object.credentialStatusProof !== undefined && object.credentialStatusProof !== null)
                ? proof_1.DocumentProof.fromPartial(object.credentialStatusProof)
                : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
