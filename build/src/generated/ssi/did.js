"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidDocument = exports.SignInfo = exports.Service = exports.VerificationMethod = exports.Metadata = exports.Did = exports.protobufPackage = void 0;
/* eslint-disable */
var minimal_1 = require("protobufjs/minimal");
exports.protobufPackage = "hypersignprotocol.hidnode.ssi";
var baseDid = {
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
exports.Did = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        for (var _i = 0, _a = message.context; _i < _a.length; _i++) {
            var v = _a[_i];
            writer.uint32(10).string(v);
        }
        if (message.id !== "") {
            writer.uint32(18).string(message.id);
        }
        for (var _b = 0, _c = message.controller; _b < _c.length; _b++) {
            var v = _c[_b];
            writer.uint32(26).string(v);
        }
        for (var _d = 0, _e = message.alsoKnownAs; _d < _e.length; _d++) {
            var v = _e[_d];
            writer.uint32(34).string(v);
        }
        for (var _f = 0, _g = message.verificationMethod; _f < _g.length; _f++) {
            var v = _g[_f];
            exports.VerificationMethod.encode(v, writer.uint32(42).fork()).ldelim();
        }
        for (var _h = 0, _j = message.authentication; _h < _j.length; _h++) {
            var v = _j[_h];
            writer.uint32(50).string(v);
        }
        for (var _k = 0, _l = message.assertionMethod; _k < _l.length; _k++) {
            var v = _l[_k];
            writer.uint32(58).string(v);
        }
        for (var _m = 0, _o = message.keyAgreement; _m < _o.length; _m++) {
            var v = _o[_m];
            writer.uint32(66).string(v);
        }
        for (var _p = 0, _q = message.capabilityInvocation; _p < _q.length; _p++) {
            var v = _q[_p];
            writer.uint32(74).string(v);
        }
        for (var _r = 0, _s = message.capabilityDelegation; _r < _s.length; _r++) {
            var v = _s[_r];
            writer.uint32(82).string(v);
        }
        for (var _t = 0, _u = message.service; _t < _u.length; _t++) {
            var v = _u[_t];
            exports.Service.encode(v, writer.uint32(90).fork()).ldelim();
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseDid);
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
            var tag = reader.uint32();
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
                    message.verificationMethod.push(exports.VerificationMethod.decode(reader, reader.uint32()));
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
                    message.service.push(exports.Service.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseDid);
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
            for (var _i = 0, _a = object.context; _i < _a.length; _i++) {
                var e = _a[_i];
                message.context.push(String(e));
            }
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.controller !== undefined && object.controller !== null) {
            for (var _b = 0, _c = object.controller; _b < _c.length; _b++) {
                var e = _c[_b];
                message.controller.push(String(e));
            }
        }
        if (object.alsoKnownAs !== undefined && object.alsoKnownAs !== null) {
            for (var _d = 0, _e = object.alsoKnownAs; _d < _e.length; _d++) {
                var e = _e[_d];
                message.alsoKnownAs.push(String(e));
            }
        }
        if (object.verificationMethod !== undefined &&
            object.verificationMethod !== null) {
            for (var _f = 0, _g = object.verificationMethod; _f < _g.length; _f++) {
                var e = _g[_f];
                message.verificationMethod.push(exports.VerificationMethod.fromJSON(e));
            }
        }
        if (object.authentication !== undefined && object.authentication !== null) {
            for (var _h = 0, _j = object.authentication; _h < _j.length; _h++) {
                var e = _j[_h];
                message.authentication.push(String(e));
            }
        }
        if (object.assertionMethod !== undefined &&
            object.assertionMethod !== null) {
            for (var _k = 0, _l = object.assertionMethod; _k < _l.length; _k++) {
                var e = _l[_k];
                message.assertionMethod.push(String(e));
            }
        }
        if (object.keyAgreement !== undefined && object.keyAgreement !== null) {
            for (var _m = 0, _o = object.keyAgreement; _m < _o.length; _m++) {
                var e = _o[_m];
                message.keyAgreement.push(String(e));
            }
        }
        if (object.capabilityInvocation !== undefined &&
            object.capabilityInvocation !== null) {
            for (var _p = 0, _q = object.capabilityInvocation; _p < _q.length; _p++) {
                var e = _q[_p];
                message.capabilityInvocation.push(String(e));
            }
        }
        if (object.capabilityDelegation !== undefined &&
            object.capabilityDelegation !== null) {
            for (var _r = 0, _s = object.capabilityDelegation; _r < _s.length; _r++) {
                var e = _s[_r];
                message.capabilityDelegation.push(String(e));
            }
        }
        if (object.service !== undefined && object.service !== null) {
            for (var _t = 0, _u = object.service; _t < _u.length; _t++) {
                var e = _u[_t];
                message.service.push(exports.Service.fromJSON(e));
            }
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        if (message.context) {
            obj.context = message.context.map(function (e) { return e; });
        }
        else {
            obj.context = [];
        }
        message.id !== undefined && (obj.id = message.id);
        if (message.controller) {
            obj.controller = message.controller.map(function (e) { return e; });
        }
        else {
            obj.controller = [];
        }
        if (message.alsoKnownAs) {
            obj.alsoKnownAs = message.alsoKnownAs.map(function (e) { return e; });
        }
        else {
            obj.alsoKnownAs = [];
        }
        if (message.verificationMethod) {
            obj.verificationMethod = message.verificationMethod.map(function (e) {
                return e ? exports.VerificationMethod.toJSON(e) : undefined;
            });
        }
        else {
            obj.verificationMethod = [];
        }
        if (message.authentication) {
            obj.authentication = message.authentication.map(function (e) { return e; });
        }
        else {
            obj.authentication = [];
        }
        if (message.assertionMethod) {
            obj.assertionMethod = message.assertionMethod.map(function (e) { return e; });
        }
        else {
            obj.assertionMethod = [];
        }
        if (message.keyAgreement) {
            obj.keyAgreement = message.keyAgreement.map(function (e) { return e; });
        }
        else {
            obj.keyAgreement = [];
        }
        if (message.capabilityInvocation) {
            obj.capabilityInvocation = message.capabilityInvocation.map(function (e) { return e; });
        }
        else {
            obj.capabilityInvocation = [];
        }
        if (message.capabilityDelegation) {
            obj.capabilityDelegation = message.capabilityDelegation.map(function (e) { return e; });
        }
        else {
            obj.capabilityDelegation = [];
        }
        if (message.service) {
            obj.service = message.service.map(function (e) {
                return e ? exports.Service.toJSON(e) : undefined;
            });
        }
        else {
            obj.service = [];
        }
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseDid);
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
            for (var _i = 0, _a = object.context; _i < _a.length; _i++) {
                var e = _a[_i];
                message.context.push(e);
            }
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.controller !== undefined && object.controller !== null) {
            for (var _b = 0, _c = object.controller; _b < _c.length; _b++) {
                var e = _c[_b];
                message.controller.push(e);
            }
        }
        if (object.alsoKnownAs !== undefined && object.alsoKnownAs !== null) {
            for (var _d = 0, _e = object.alsoKnownAs; _d < _e.length; _d++) {
                var e = _e[_d];
                message.alsoKnownAs.push(e);
            }
        }
        if (object.verificationMethod !== undefined &&
            object.verificationMethod !== null) {
            for (var _f = 0, _g = object.verificationMethod; _f < _g.length; _f++) {
                var e = _g[_f];
                message.verificationMethod.push(exports.VerificationMethod.fromPartial(e));
            }
        }
        if (object.authentication !== undefined && object.authentication !== null) {
            for (var _h = 0, _j = object.authentication; _h < _j.length; _h++) {
                var e = _j[_h];
                message.authentication.push(e);
            }
        }
        if (object.assertionMethod !== undefined &&
            object.assertionMethod !== null) {
            for (var _k = 0, _l = object.assertionMethod; _k < _l.length; _k++) {
                var e = _l[_k];
                message.assertionMethod.push(e);
            }
        }
        if (object.keyAgreement !== undefined && object.keyAgreement !== null) {
            for (var _m = 0, _o = object.keyAgreement; _m < _o.length; _m++) {
                var e = _o[_m];
                message.keyAgreement.push(e);
            }
        }
        if (object.capabilityInvocation !== undefined &&
            object.capabilityInvocation !== null) {
            for (var _p = 0, _q = object.capabilityInvocation; _p < _q.length; _p++) {
                var e = _q[_p];
                message.capabilityInvocation.push(e);
            }
        }
        if (object.capabilityDelegation !== undefined &&
            object.capabilityDelegation !== null) {
            for (var _r = 0, _s = object.capabilityDelegation; _r < _s.length; _r++) {
                var e = _s[_r];
                message.capabilityDelegation.push(e);
            }
        }
        if (object.service !== undefined && object.service !== null) {
            for (var _t = 0, _u = object.service; _t < _u.length; _t++) {
                var e = _u[_t];
                message.service.push(exports.Service.fromPartial(e));
            }
        }
        return message;
    },
};
var baseMetadata = {
    created: "",
    updated: "",
    deactivated: false,
    versionId: "",
};
exports.Metadata = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
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
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseMetadata);
        while (reader.pos < end) {
            var tag = reader.uint32();
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
    fromJSON: function (object) {
        var message = __assign({}, baseMetadata);
        if (object.created !== undefined && object.created !== null) {
            message.created = String(object.created);
        }
        else {
            message.created = "";
        }
        if (object.updated !== undefined && object.updated !== null) {
            message.updated = String(object.updated);
        }
        else {
            message.updated = "";
        }
        if (object.deactivated !== undefined && object.deactivated !== null) {
            message.deactivated = Boolean(object.deactivated);
        }
        else {
            message.deactivated = false;
        }
        if (object.versionId !== undefined && object.versionId !== null) {
            message.versionId = String(object.versionId);
        }
        else {
            message.versionId = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.created !== undefined && (obj.created = message.created);
        message.updated !== undefined && (obj.updated = message.updated);
        message.deactivated !== undefined &&
            (obj.deactivated = message.deactivated);
        message.versionId !== undefined && (obj.versionId = message.versionId);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseMetadata);
        if (object.created !== undefined && object.created !== null) {
            message.created = object.created;
        }
        else {
            message.created = "";
        }
        if (object.updated !== undefined && object.updated !== null) {
            message.updated = object.updated;
        }
        else {
            message.updated = "";
        }
        if (object.deactivated !== undefined && object.deactivated !== null) {
            message.deactivated = object.deactivated;
        }
        else {
            message.deactivated = false;
        }
        if (object.versionId !== undefined && object.versionId !== null) {
            message.versionId = object.versionId;
        }
        else {
            message.versionId = "";
        }
        return message;
    },
};
var baseVerificationMethod = {
    id: "",
    type: "",
    controller: "",
    publicKeyMultibase: "",
};
exports.VerificationMethod = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
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
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseVerificationMethod);
        while (reader.pos < end) {
            var tag = reader.uint32();
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
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseVerificationMethod);
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.controller !== undefined && object.controller !== null) {
            message.controller = String(object.controller);
        }
        else {
            message.controller = "";
        }
        if (object.publicKeyMultibase !== undefined &&
            object.publicKeyMultibase !== null) {
            message.publicKeyMultibase = String(object.publicKeyMultibase);
        }
        else {
            message.publicKeyMultibase = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.type !== undefined && (obj.type = message.type);
        message.controller !== undefined && (obj.controller = message.controller);
        message.publicKeyMultibase !== undefined &&
            (obj.publicKeyMultibase = message.publicKeyMultibase);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseVerificationMethod);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = "";
        }
        if (object.controller !== undefined && object.controller !== null) {
            message.controller = object.controller;
        }
        else {
            message.controller = "";
        }
        if (object.publicKeyMultibase !== undefined &&
            object.publicKeyMultibase !== null) {
            message.publicKeyMultibase = object.publicKeyMultibase;
        }
        else {
            message.publicKeyMultibase = "";
        }
        return message;
    },
};
var baseService = { id: "", type: "", serviceEndpoint: "" };
exports.Service = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
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
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseService);
        while (reader.pos < end) {
            var tag = reader.uint32();
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
    fromJSON: function (object) {
        var message = __assign({}, baseService);
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.serviceEndpoint !== undefined &&
            object.serviceEndpoint !== null) {
            message.serviceEndpoint = String(object.serviceEndpoint);
        }
        else {
            message.serviceEndpoint = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.type !== undefined && (obj.type = message.type);
        message.serviceEndpoint !== undefined &&
            (obj.serviceEndpoint = message.serviceEndpoint);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseService);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = "";
        }
        if (object.serviceEndpoint !== undefined &&
            object.serviceEndpoint !== null) {
            message.serviceEndpoint = object.serviceEndpoint;
        }
        else {
            message.serviceEndpoint = "";
        }
        return message;
    },
};
var baseSignInfo = { verification_method_id: "", signature: "" };
exports.SignInfo = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.verification_method_id !== "") {
            writer.uint32(10).string(message.verification_method_id);
        }
        if (message.signature !== "") {
            writer.uint32(18).string(message.signature);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseSignInfo);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.verification_method_id = reader.string();
                    break;
                case 2:
                    message.signature = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseSignInfo);
        if (object.verification_method_id !== undefined &&
            object.verification_method_id !== null) {
            message.verification_method_id = String(object.verification_method_id);
        }
        else {
            message.verification_method_id = "";
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = String(object.signature);
        }
        else {
            message.signature = "";
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.verification_method_id !== undefined &&
            (obj.verification_method_id = message.verification_method_id);
        message.signature !== undefined && (obj.signature = message.signature);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseSignInfo);
        if (object.verification_method_id !== undefined &&
            object.verification_method_id !== null) {
            message.verification_method_id = object.verification_method_id;
        }
        else {
            message.verification_method_id = "";
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = object.signature;
        }
        else {
            message.signature = "";
        }
        return message;
    },
};
var baseDidDocument = {};
exports.DidDocument = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = minimal_1.Writer.create(); }
        if (message.did !== undefined) {
            exports.Did.encode(message.did, writer.uint32(10).fork()).ldelim();
        }
        if (message.metadata !== undefined) {
            exports.Metadata.encode(message.metadata, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof Uint8Array ? new minimal_1.Reader(input) : input;
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = __assign({}, baseDidDocument);
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.did = exports.Did.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.metadata = exports.Metadata.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        var message = __assign({}, baseDidDocument);
        if (object.did !== undefined && object.did !== null) {
            message.did = exports.Did.fromJSON(object.did);
        }
        else {
            message.did = undefined;
        }
        if (object.metadata !== undefined && object.metadata !== null) {
            message.metadata = exports.Metadata.fromJSON(object.metadata);
        }
        else {
            message.metadata = undefined;
        }
        return message;
    },
    toJSON: function (message) {
        var obj = {};
        message.did !== undefined &&
            (obj.did = message.did ? exports.Did.toJSON(message.did) : undefined);
        message.metadata !== undefined &&
            (obj.metadata = message.metadata
                ? exports.Metadata.toJSON(message.metadata)
                : undefined);
        return obj;
    },
    fromPartial: function (object) {
        var message = __assign({}, baseDidDocument);
        if (object.did !== undefined && object.did !== null) {
            message.did = exports.Did.fromPartial(object.did);
        }
        else {
            message.did = undefined;
        }
        if (object.metadata !== undefined && object.metadata !== null) {
            message.metadata = exports.Metadata.fromPartial(object.metadata);
        }
        else {
            message.metadata = undefined;
        }
        return message;
    },
};
