"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = exports.Did = exports.IClientSpec = exports.IKeyType = exports.IVerificationRelationships = exports.HypersignVerifiablePresentation = exports.HypersignVerifiableCredential = exports.HypersignSchema = exports.HypersignDID = exports.HypersignSSISdk = void 0;
const did_1 = __importDefault(require("./did/did"));
exports.HypersignDID = did_1.default;
const vc_1 = __importDefault(require("./credential/vc"));
exports.HypersignVerifiableCredential = vc_1.default;
const vp_1 = __importDefault(require("./presentation/vp"));
exports.HypersignVerifiablePresentation = vp_1.default;
const schema_1 = __importDefault(require("./schema/schema"));
exports.HypersignSchema = schema_1.default;
const IDID_1 = require("./did/IDID");
Object.defineProperty(exports, "IClientSpec", { enumerable: true, get: function () { return IDID_1.IClientSpec; } });
const enums_1 = require("../libs/generated/ssi/client/enums");
Object.defineProperty(exports, "IKeyType", { enumerable: true, get: function () { return enums_1.VerificationMethodTypes; } });
const enums_2 = require("../libs/generated/ssi/client/enums");
Object.defineProperty(exports, "IVerificationRelationships", { enumerable: true, get: function () { return enums_2.VerificationMethodRelationships; } });
const did_2 = require("../libs/generated/ssi/did");
Object.defineProperty(exports, "Did", { enumerable: true, get: function () { return did_2.DidDocument; } });
const credential_schema_1 = require("../libs/generated/ssi/credential_schema");
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return credential_schema_1.CredentialSchemaDocument; } });
class HypersignSSISdk {
    constructor(params) {
        const { offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, namespace, entityApiSecretKey } = params;
        this.signer = offlineSigner;
        this.nodeRpcEndpoint = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
        this.nodeRestEndpoint = nodeRestEndpoint ? nodeRestEndpoint : '';
        this.namespace = namespace ? namespace : '';
        this.entityApiSecretKey = entityApiSecretKey ? entityApiSecretKey : '';
        const constructorParams = {
            offlineSigner: this.signer,
            nodeRpcEndpoint: this.nodeRpcEndpoint,
            nodeRestEndpoint: this.nodeRestEndpoint,
            namespace: this.namespace,
            entityApiSecretKey: this.entityApiSecretKey,
        };
        this.did = new did_1.default(constructorParams);
        this.schema = new schema_1.default(constructorParams);
        this.vc = new vc_1.default(constructorParams);
        this.vp = new vp_1.default(constructorParams);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.did.init();
            yield this.schema.init();
            yield this.vc.init();
        });
    }
}
exports.HypersignSSISdk = HypersignSSISdk;
