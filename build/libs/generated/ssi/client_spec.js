"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSpecTypeToNumber = exports.clientSpecTypeToJSON = exports.clientSpecTypeFromJSON = exports.ClientSpecType = exports.protobufPackage = void 0;
exports.protobufPackage = "hypersign.ssi.v1";
var ClientSpecType;
(function (ClientSpecType) {
    ClientSpecType["CLIENT_SPEC_TYPE_NONE"] = "CLIENT_SPEC_TYPE_NONE";
    ClientSpecType["CLIENT_SPEC_TYPE_COSMOS_ADR036"] = "CLIENT_SPEC_TYPE_COSMOS_ADR036";
    ClientSpecType["CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN"] = "CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN";
})(ClientSpecType = exports.ClientSpecType || (exports.ClientSpecType = {}));
function clientSpecTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "CLIENT_SPEC_TYPE_NONE":
            return ClientSpecType.CLIENT_SPEC_TYPE_NONE;
        case 1:
        case "CLIENT_SPEC_TYPE_COSMOS_ADR036":
            return ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036;
        case 2:
        case "CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN":
            return ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN;
        default:
            throw new globalThis.Error("Unrecognized enum value " + object + " for enum ClientSpecType");
    }
}
exports.clientSpecTypeFromJSON = clientSpecTypeFromJSON;
function clientSpecTypeToJSON(object) {
    switch (object) {
        case ClientSpecType.CLIENT_SPEC_TYPE_NONE:
            return "CLIENT_SPEC_TYPE_NONE";
        case ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036:
            return "CLIENT_SPEC_TYPE_COSMOS_ADR036";
        case ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN:
            return "CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN";
        default:
            throw new globalThis.Error("Unrecognized enum value " + object + " for enum ClientSpecType");
    }
}
exports.clientSpecTypeToJSON = clientSpecTypeToJSON;
function clientSpecTypeToNumber(object) {
    switch (object) {
        case ClientSpecType.CLIENT_SPEC_TYPE_NONE:
            return 0;
        case ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036:
            return 1;
        case ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN:
            return 2;
        default:
            throw new globalThis.Error("Unrecognized enum value " + object + " for enum ClientSpecType");
    }
}
exports.clientSpecTypeToNumber = clientSpecTypeToNumber;
