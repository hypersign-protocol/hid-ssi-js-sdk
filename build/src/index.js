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
exports.HypersignVerifiablePresentation = exports.HypersignVerifiableCredential = exports.HypersignSchema = exports.HypersignDID = exports.HypersignSSISdk = void 0;
const did_1 = __importDefault(require("./did/did"));
exports.HypersignDID = did_1.default;
const vc_1 = __importDefault(require("./credential/vc"));
exports.HypersignVerifiableCredential = vc_1.default;
const vp_1 = __importDefault(require("./presentation/vp"));
exports.HypersignVerifiablePresentation = vp_1.default;
const schema_1 = __importDefault(require("./schema/schema"));
exports.HypersignSchema = schema_1.default;
class HypersignSSISdk {
    constructor(params) {
        const { offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, namespace } = params;
        this.signer = offlineSigner;
        this.nodeRpcEndpoint = nodeRpcEndpoint ? nodeRpcEndpoint : "MAIN";
        this.nodeRestEndpoint = nodeRestEndpoint ? nodeRestEndpoint : "";
        this.namespace = namespace ? namespace : "";
        const constructorParams = {
            offlineSigner: this.signer,
            nodeRpcEndpoint: this.nodeRpcEndpoint,
            nodeRestEndpoint: this.nodeRestEndpoint,
            namespace: this.namespace
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
