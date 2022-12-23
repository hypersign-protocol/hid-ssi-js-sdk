"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var schema_1 = require("../generated/ssi/schema");
var schemaRPC_1 = require("./schemaRPC");
var constants = __importStar(require("../constants"));
var utils_1 = __importDefault(require("../utils"));
var ed25519 = require('@stablelib/ed25519');
var HyperSignSchema = /** @class */ (function () {
    function HyperSignSchema(namespace) {
        this.schemaRpc = new schemaRPC_1.SchemaRpc();
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
    HyperSignSchema.prototype.getSchemaId = function () {
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
    HyperSignSchema.prototype.getSchema = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, t;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!params.author)
                            throw new Error('HID-SSI-SDK:: Error: Author must be passed');
                        _a = this;
                        return [4 /*yield*/, this.getSchemaId()];
                    case 1:
                        _a.id = _b.sent();
                        this.name = params.name;
                        this.author = params.author;
                        this.authored = new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
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
    HyperSignSchema.prototype.signSchema = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKeyMultibaseConverted, dataBytes, signed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.privateKey)
                            throw new Error('HID-SSI-SDK:: Error: PrivateKey must be passed');
                        if (!params.schema)
                            throw new Error('HID-SSI-SDK:: Error: Schema must be passed');
                        privateKeyMultibaseConverted = utils_1.default.convertEd25519verificationkey2020toStableLibKeysInto({
                            privKey: params.privateKey,
                        }).privateKeyMultibase;
                        return [4 /*yield*/, schema_1.Schema.encode(params.schema)];
                    case 1:
                        dataBytes = (_a.sent()).finish();
                        signed = ed25519.sign(privateKeyMultibaseConverted, dataBytes);
                        return [2 /*return*/, Buffer.from(signed).toString('base64')];
                }
            });
        });
    };
    HyperSignSchema.prototype.registerSchema = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!params.schema)
                    throw new Error('HID-SSI-SDK:: Error: Schema must be passed');
                if (!params.proof)
                    throw new Error('HID-SSI-SDK:: Error: Proof must be passed');
                if (!params.proof.created)
                    throw new Error('HID-SSI-SDK:: Error: Proof must Contain created');
                if (!params.proof.proofPurpose)
                    throw new Error('HID-SSI-SDK:: Error: Proof must Contain proofPurpose');
                if (!params.proof.proofValue)
                    throw new Error('HID-SSI-SDK:: Error: Proof must Contain proofValue');
                if (!params.proof.type)
                    throw new Error('HID-SSI-SDK:: Error: Proof must Contain type');
                if (!params.proof.verificationMethod)
                    throw new Error('HID-SSI-SDK:: Error: Proof must Contain verificationMethod');
                return [2 /*return*/, this.schemaRpc.createSchema(params.schema, params.proof)];
            });
        });
    };
    HyperSignSchema.prototype.resolve = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaArr, schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!params.schemaId)
                            throw new Error('HID-SSI-SDK:: Error: SchemaId must be passed');
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
