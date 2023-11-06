"use strict";
/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const credential_schema_1 = require("../../libs/generated/ssi/credential_schema");
const schemaRPC_1 = require("./schemaRPC");
const constants = __importStar(require("../constants"));
const utils_1 = __importDefault(require("../utils"));
const schema_service_1 = __importDefault(require("../ssiApi/services/schema/schema.service"));
const ed25519 = require('@stablelib/ed25519');
const base58_1 = require("multiformats/bases/base58");
class HyperSignSchema {
    constructor(params = {}) {
        const { namespace, offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, entityApiSecretKey } = params;
        const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
        const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
        this.schemaRpc = new schemaRPC_1.SchemaRpc({ offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp });
        if (entityApiSecretKey && entityApiSecretKey != '') {
            this.schemaApiService = new schema_service_1.default(entityApiSecretKey);
            this.schemaRpc = null;
        }
        else {
            this.schemaApiService = null;
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
    _getSchemaId() {
        return __awaiter(this, void 0, void 0, function* () {
            const b = yield utils_1.default.getUUID();
            // ID Structure ->  sch:<method>:<namespace>:<method-specific-id>:<version>
            let id;
            if (this.namespace && this.namespace != '') {
                id = `${constants.SCHEMA.SCHEME}:${constants.SCHEMA.METHOD}:${this.namespace}:${b}:${this.modelVersion}`;
            }
            else {
                id = `${constants.SCHEMA.SCHEME}:${constants.SCHEMA.METHOD}:${b}:${this.modelVersion}`;
            }
            return id;
        });
    }
    _getDateTime() {
        return new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z';
    }
    /**
     * Initialise the offlinesigner to interact with Hypersign blockchain
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.schemaRpc && !this.schemaApiService) {
                throw new Error('HID-SSI-SDK:: Error: HypersignVerifiableCredential class is not instantiated with Offlinesigner or have not been initilized with entityApiSecretKey');
            }
            if (this.schemaRpc) {
                yield this.schemaRpc.init();
            }
            if (this.schemaApiService) {
                yield this.schemaApiService.auth();
            }
        });
    }
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
    generate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.author)
                throw new Error('HID-SSI-SDK:: Error: Author must be passed');
            this.id = yield this._getSchemaId();
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
            const t = {};
            if (params.fields && params.fields.length > 0) {
                params.fields.forEach((prop) => {
                    const schemaPropsObj = {};
                    schemaPropsObj.propName = prop.name;
                    schemaPropsObj.val = {};
                    schemaPropsObj.val.type = prop.type;
                    if (prop.format)
                        schemaPropsObj.val.format = prop.format;
                    t[schemaPropsObj.propName] = schemaPropsObj.val;
                    if (prop.isRequired) {
                        this.schema.required.push(prop.name);
                    }
                });
                this.schema.properties = JSON.stringify(t);
            }
            return {
                type: this.type,
                modelVersion: this.modelVersion,
                id: this.id,
                name: this.name,
                author: this.author,
                authored: this.authored,
                schema: this.schema,
            };
        });
    }
    /**
     * Signs a schema document and attaches proof
     * @params
     *  - params.schema               : The schema document without proof
     *  - params.privateKeyMultibase  : Private Key to sign the doc
     *  - params.verificationMethodId : VerificationMethodId of the document
     * @returns {Promise<Schema>} Schema with proof
     */
    sign(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.privateKeyMultibase)
                throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase must be passed');
            if (!params.verificationMethodId)
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId must be passed');
            if (!params.schema)
                throw new Error('HID-SSI-SDK:: Error: Schema must be passed');
            const { privateKeyMultibase: privateKeyMultibaseConverted } = utils_1.default.convertEd25519verificationkey2020toStableLibKeysInto({
                privKey: params.privateKeyMultibase,
            });
            const schemaDoc = params.schema;
            const dataBytes = (yield credential_schema_1.CredentialSchemaDocument.encode(schemaDoc)).finish();
            const signed = ed25519.sign(privateKeyMultibaseConverted, dataBytes);
            const proof = {
                type: constants.SCHEMA.SIGNATURE_TYPE,
                created: this._getDateTime(),
                verificationMethod: params.verificationMethodId,
                proofPurpose: constants.SCHEMA.PROOF_PURPOSE,
                proofValue: base58_1.base58btc.encode(signed),
            };
            schemaDoc['proof'] = {};
            const schemaToReturn = schemaDoc;
            Object.assign(schemaToReturn['proof'], Object.assign({}, proof));
            return schemaToReturn;
        });
    }
    /**
     * Register a schema Document in Hypersign blockchain - an onchain activity
     * @params
     *  - params.schema               : The schema document with schemaProof
     * @returns {Promise<object>} Result of the registration
     */
    register(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.schema)
                throw new Error('HID-SSI-SDK:: Error: schema must be passed');
            if (!params.schema['proof'])
                throw new Error('HID-SSI-SDK:: Error: schema.proof must be passed');
            if (!params.schema['proof'].created)
                throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain created');
            if (!params.schema['proof'].proofPurpose)
                throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain proofPurpose');
            if (!params.schema['proof'].proofValue)
                throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain proofValue');
            if (!params.schema['proof'].type)
                throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain type');
            if (!params.schema['proof'].verificationMethod)
                throw new Error('HID-SSI-SDK:: Error: schema.proof must Contain verificationMethod');
            if (!this.schemaRpc && !this.schemaApiService) {
                throw new Error('HID-SSI-SDK:: Error: HypersignSchema class is not instantiated with Offlinesigner or have not been initilized with entityApiSecret');
            }
            const response = {};
            const schemaDoc = params.schema;
            const proof = schemaDoc['proof'];
            delete schemaDoc['proof'];
            if (this.schemaRpc) {
                const result = yield this.schemaRpc.createSchema(schemaDoc, proof);
                response.transactionHash = result.transactionHash;
            }
            else if (this.schemaApiService) {
                const result = yield this.schemaApiService.registerSchema({
                    schemaDocument: params.schema,
                    schemaProof: params.schema['proof'],
                });
                response.transactionHash = result.transactionHash;
            }
            return response;
        });
    }
    /**
     * Resolves a schema document with schemId from Hypersign blockchain - an onchain activity
     * @params
     *  - params.schemaId             : Id of the schema document
     * @returns {Promise<IResolveSchema>} Returns schema document
     */
    resolve(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.schemaId)
                throw new Error('HID-SSI-SDK:: Error: SchemaId must be passed');
            if (!this.schemaRpc) {
                throw new Error('HID-SSI-SDK:: Error: HypersignSchema class is not instantiated with Offlinesigner or have not been initilized');
            }
            const schemaArr = yield this.schemaRpc.resolveSchema(params.schemaId);
            if (!schemaArr || schemaArr.length < 0) {
                throw new Error('HID-SSI-SDK:: Error: No schema found, id = ' + params.schemaId);
            }
            const schema = schemaArr[0];
            const response = Object.assign(Object.assign({}, schema.credentialSchemaDocument), { proof: schema.credentialSchemaProof });
            return response;
        });
    }
}
exports.default = HyperSignSchema;
