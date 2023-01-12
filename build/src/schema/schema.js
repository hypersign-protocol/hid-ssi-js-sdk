"use strict";
/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../../libs/generated/ssi/schema");
var schemaRPC_1 = require("./schemaRPC");
var constants = __importStar(require("../constants"));
var utils_1 = __importDefault(require("../utils"));
var ed25519 = require('@stablelib/ed25519');
var HyperSignSchema = /** @class */ (function () {
    function HyperSignSchema(params) {
        if (params === void 0) { params = {}; }
        var namespace = params.namespace, offlineSigner = params.offlineSigner, nodeRpcEndpoint = params.nodeRpcEndpoint, nodeRestEndpoint = params.nodeRestEndpoint;
        var nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'TEST';
        var nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
        if (offlineSigner) {
            this.schemaRpc = new schemaRPC_1.SchemaRpc({ offlineSigner: offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp });
        }
        else {
            this.schemaRpc = null;
        }
        this.namespace = namespace && namespace != '' ? namespace : '';
        (this.type = constants.SCHEMA.SCHEMA_TYPE),
            (this.modelVersion = '1.0'),
            (this.id = ''),
            (this.name = ''),
            (this.author = ''),
            (this.authored = '');
        this.schema = {
            schema: '',
            description: '',
            type: '',
            properties: '',
            required: [],
            additionalProperties: false,
        };
    }
    // Ref:
    HyperSignSchema.prototype._getSchemaId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var b, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.default.getUUID()];
                    case 1:
                        b = _a.sent();
                        if (this.namespace && this.namespace != '') {
                            id = "".concat(constants.SCHEMA.SCHEME, ":").concat(constants.SCHEMA.METHOD, ":").concat(this.namespace, ":").concat(b, ":").concat(this.modelVersion);
                        }
                        else {
                            id = "".concat(constants.SCHEMA.SCHEME, ":").concat(constants.SCHEMA.METHOD, ":").concat(b, ":").concat(this.modelVersion);
                        }
                        return [2 /*return*/, id];
                }
            });
        });
    };
    HyperSignSchema.prototype._getDateTime = function () {
        return new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
    };
    /**
     * Initialise the offlinesigner to interact with Hypersign blockchain
     */
    HyperSignSchema.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.schemaRpc) {
                            throw new Error('HID-SSI-SDK:: Error: HID-SSI-SDK:: Error: HypersignSchema class is not instantiated with Offlinesigner or have not been initilized');
                        }
                        return [4 /*yield*/, this.schemaRpc.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generates a new schema doc without proof
     * @params
     *  - params.name                 : Name of the schema
     *  - params.description          : Optional - Description of the schema
     *  - params.author               : DID of the author
     *  - params.fields               : Schema fields of type ISchemaFields
     *  - params.additionalProperties : If additionalProperties can be added, boolean
     * @returns {Promise<SchemaDocument>} SchemaDocument object
     */
    HyperSignSchema.prototype.generate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, t;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!params.author)
                            throw new Error('HID-SSI-SDK:: Error: Author must be passed');
                        _a = this;
                        return [4 /*yield*/, this._getSchemaId()];
                    case 1:
                        _a.id = _b.sent();
                        this.name = params.name;
                        this.author = params.author;
                        this.authored = this._getDateTime();
                        this.schema = {
                            schema: constants.SCHEMA.SCHEMA_JSON,
                            description: params.description ? params.description : '',
                            type: 'object',
                            properties: '',
                            required: [],
                            additionalProperties: params.additionalProperties,
                        };
                        t = {};
                        if (params.fields && params.fields.length > 0) {
                            params.fields.forEach(function (prop) {
                                var schemaPropsObj = {};
                                schemaPropsObj.propName = prop.name;
                                schemaPropsObj.val = {};
                                schemaPropsObj.val.type = prop.type;
                                if (prop.format)
                                    schemaPropsObj.val.format = prop.format;
                                t[schemaPropsObj.propName] = schemaPropsObj.val;
                                if (prop.isRequired) {
                                    _this.schema.required.push(prop.name);
                                }
                            });
                            this.schema.properties = JSON.stringify(t);
                        }
                        return [2 /*return*/, {
                                type: this.type,
                                modelVersion: this.modelVersion,
                                id: this.id,
                                name: this.name,
                                author: this.author,
                                authored: this.authored,
                                schema: this.schema,
                            }];
                }
            });
        });
    };
    /**
     * Signs a schema document and attaches proof
     * @params
     *  - params.schema               : The schema document without proof
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     * @returns {Promise<Schema>} Schema with proof
     */
    HyperSignSchema.prototype.sign = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKeyMultibaseConverted, schemaDoc, dataBytes, signed, proof;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.privateKeyMultibase)
                            throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase must be passed');
                        if (!params.verificationMethodId)
                            throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId must be passed');
                        if (!params.schema)
                            throw new Error('HID-SSI-SDK:: Error: Schema must be passed');
                        privateKeyMultibaseConverted = utils_1.default.convertEd25519verificationkey2020toStableLibKeysInto({
                            privKey: params.privateKeyMultibase,
                        }).privateKeyMultibase;
                        schemaDoc = params.schema;
                        return [4 /*yield*/, schema_1.Schema.encode(schemaDoc)];
                    case 1:
                        dataBytes = (_a.sent()).finish();
                        signed = ed25519.sign(privateKeyMultibaseConverted, dataBytes);
                        proof = {
                            type: constants.SCHEMA.SIGNATURE_TYPE,
                            created: this._getDateTime(),
                            verificationMethod: params.verificationMethodId,
                            proofPurpose: constants.SCHEMA.PROOF_PURPOSE,
                            proofValue: Buffer.from(signed).toString('base64'),
                        };
                        schemaDoc.proof = {};
                        Object.assign(schemaDoc.proof, __assign({}, proof));
                        return [2 /*return*/, schemaDoc];
                }
            });
        });
    };
    /**
     * Register a schema Document in Hypersign blockchain - an onchain activity
     * @params
     *  - params.schema               : The schema document with schemaProof
     * @returns {Promise<object>} Result of the registration
     */
    HyperSignSchema.prototype.register = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!params.schema)
                    throw new Error('HID-SSI-SDK:: Error: schema must be passed');
                if (!params.schema.proof)
                    throw new Error('HID-SSI-SDK:: Error: schema.proof must be passed');
                if (!params.schema.proof.created)
                    throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain created');
                if (!params.schema.proof.proofPurpose)
                    throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain proofPurpose');
                if (!params.schema.proof.proofValue)
                    throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain proofValue');
                if (!params.schema.proof.type)
                    throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain type');
                if (!params.schema.proof.verificationMethod)
                    throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain verificationMethod');
                if (!this.schemaRpc) {
                    throw new Error('HID-SSI-SDK:: Error: HypersignSchema class is not instantiated with Offlinesigner or have not been initilized');
                }
                return [2 /*return*/, this.schemaRpc.createSchema(params.schema, params.schema.proof)];
            });
        });
    };
    /**
     * Resolves a schema document with schemId from Hypersign blockchain - an onchain activity
     * @params
     *  - params.schemaId             : Id of the schema document
     * @returns {Promise<Schema>} Returns schema document
     */
    HyperSignSchema.prototype.resolve = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaArr, schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.schemaId)
                            throw new Error('HID-SSI-SDK:: Error: SchemaId must be passed');
                        if (!this.schemaRpc) {
                            throw new Error('HID-SSI-SDK:: Error: HypersignSchema class is not instantiated with Offlinesigner or have not been initilized');
                        }
                        return [4 /*yield*/, this.schemaRpc.resolveSchema(params.schemaId)];
                    case 1:
                        schemaArr = _a.sent();
                        if (!schemaArr || schemaArr.length < 0) {
                            throw new Error('HID-SSI-SDK:: Error: No schema found, id = ' + params.schemaId);
                        }
                        schema = schemaArr[0];
                        return [2 /*return*/, schema];
                }
            });
        });
    };
    return HyperSignSchema;
}());
exports.default = HyperSignSchema;
