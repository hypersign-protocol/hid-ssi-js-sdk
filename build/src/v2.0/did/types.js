"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIDEncoder = exports.IService = exports.IVerificationMethod = exports.IDidDocumentMetadata = exports.IDidDocument = void 0;
const did_1 = require("../../../libs/generated/ssi/did");
Object.defineProperty(exports, "IDidDocument", { enumerable: true, get: function () { return did_1.Did; } });
Object.defineProperty(exports, "DIDEncoder", { enumerable: true, get: function () { return did_1.Did; } });
Object.defineProperty(exports, "IDidDocumentMetadata", { enumerable: true, get: function () { return did_1.Metadata; } });
Object.defineProperty(exports, "IVerificationMethod", { enumerable: true, get: function () { return did_1.VerificationMethod; } });
Object.defineProperty(exports, "IService", { enumerable: true, get: function () { return did_1.Service; } });
