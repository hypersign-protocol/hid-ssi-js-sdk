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
const schemaRPC_1 = require("./schemaRPC");
const constants = __importStar(require("../constants"));
const jsonld_signatures_1 = __importDefault(require("jsonld-signatures"));
const { AssertionProofPurpose } = jsonld_signatures_1.default.purposes;
const utils_1 = __importDefault(require("../utils"));
const jsonld_signatures_2 = require("jsonld-signatures");
const schema_service_1 = __importDefault(require("../ssiApi/services/schema/schema.service"));
const v1_1 = __importDefault(require("../../libs/w3cache/v1"));
const documentLoader = (0, jsonld_signatures_2.extendContextLoader)(v1_1.default);
const did_1 = __importDefault(require("../did/did"));
const babyjubjub2021_1 = require("babyjubjub2021");
const babyjubjubsignature2021_1 = require("babyjubjubsignature2021");
class HypersignBJJSchema {
    constructor(params = {}) {
        const { namespace, offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, entityApiSecretKey } = params;
        const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
        const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
        this.schemaRpc = new schemaRPC_1.SchemaRpc({ offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp });
        this.hsDid = new did_1.default({ offlineSigner, nodeRpcEndpoint: nodeRPCEp, nodeRestEndpoint: nodeRestEp });
        if (entityApiSecretKey && entityApiSecretKey != '') {
            this.schemaApiService = new schema_service_1.default(entityApiSecretKey);
            this.schemaRpc = null;
        }
        else {
            this.schemaApiService = null;
        }
        this['@context'] = [constants.SCHEMA.SCHEMA_CONTEXT, constants.DID_BabyJubJubKey2021.BABYJUBJUBSIGNATURE];
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
    isPascalCase(inputString) {
        const pattern = /^[A-Z][a-zA-Z0-9]*$/;
        return pattern.test(inputString);
    }
    _jsonLdSign(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { schema, privateKeyMultibase, verificationMethodId } = params;
            const keyPair = yield babyjubjub2021_1.BabyJubJubKeys2021.fromKeys({
                options: {
                    controller: verificationMethodId,
                    id: verificationMethodId,
                },
                privateKeyMultibase: privateKeyMultibase,
                publicKeyMultibase: params.publicKeyMultibase,
            });
            const suite = new babyjubjubsignature2021_1.BabyJubJubSignature2021Suite({ key: keyPair });
            const signedSchema = yield jsonld_signatures_1.default.sign(schema, {
                suite,
                purpose: new AssertionProofPurpose(),
                documentLoader,
            });
            return signedSchema.proof;
        });
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.author)
                throw new Error('HID-SSI-SDK:: Error: Author must be passed');
            if (!this.isPascalCase(params.name))
                throw new Error('HID-SSI-SDK:: Error: schema name should always be in PascalCase');
            this['@context'] = [constants.SCHEMA.SCHEMA_CONTEXT, constants.DID_BabyJubJubKey2021.BABYJUBJUBSIGNATURE];
            this.id = yield this._getSchemaId();
            this.name = params.name;
            this.author = params.author;
            this.authored = this._getDateTime();
            this.schema = {
                schema: constants.SCHEMA.SCHEMA_JSON,
                description: params.description ? params.description : '',
                type: 'https://schema.org/object',
                properties: '',
                required: [],
                additionalProperties: params.additionalProperties,
            };
            const t = {};
            if (params.fields && params.fields.length > 0) {
                params.fields.forEach((prop) => {
                    var _a;
                    if (!prop.name)
                        throw new Error("HID-SSI-SDK:: Error: All fields must contains property 'name'");
                    const schemaPropsObj = {};
                    schemaPropsObj.propName = prop.name;
                    schemaPropsObj.val = {};
                    schemaPropsObj.val.type = (_a = prop === null || prop === void 0 ? void 0 : prop.type) !== null && _a !== void 0 ? _a : 'string';
                    if (prop.format)
                        schemaPropsObj.val.format = prop.format;
                    t[schemaPropsObj.propName] = schemaPropsObj.val;
                    if (prop.isRequired) {
                        this.schema.required.push(prop.name);
                    }
                });
                this.schema.properties = JSON.stringify(t);
            }
            if (!this.schema.additionalProperties) {
                delete this.schema.additionalProperties;
            }
            if (((_a = this.schema.required) === null || _a === void 0 ? void 0 : _a.length) == 0) {
                delete this.schema.required;
            }
            return {
                '@context': this['@context'],
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
     * @returns {Promise<IResolveSchema>} Schema with proof
     */
    sign(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.privateKeyMultibase)
                throw new Error('HID-SSI-SDK:: Error: params.privateKeyMultibase must be passed');
            if (!params.verificationMethodId)
                throw new Error('HID-SSI-SDK:: Error: params.verificationMethodId must be passed');
            if (!params.schema)
                throw new Error('HID-SSI-SDK:: Error: Schema must be passed');
            const { schema, privateKeyMultibase, verificationMethodId } = params;
            const schemaDoc = params.schema;
            const { didDocument } = yield this.hsDid.resolve({ did: schema.author });
            if (!didDocument) {
                throw new Error('HID-SSI-SDK:: Error: can not resolve the author');
            }
            const verificationMethod = didDocument['verificationMethod'].find((x) => x.id == verificationMethodId);
            if (!verificationMethod) {
                throw new Error('HID-SSI-SDK:: Error: verificationMethod not matched');
            }
            const proof = yield this._jsonLdSign({
                schema,
                privateKeyMultibase,
                verificationMethodId,
                publicKeyMultibase: verificationMethod.publicKeyMultibase,
            });
            schemaDoc['proof'] = {};
            const schemaToReturn = schemaDoc;
            if (proof) {
                schemaToReturn['proof'] = Object.assign(Object.assign({}, schemaToReturn['proof']), proof);
            }
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
            if (this.schemaRpc) {
                const result = yield this.schemaRpc.registerSchema(schemaDoc, proof);
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
            const schemaT = schemaArr[0];
            const schema = {
                credentialSchemaDocument: schemaArr[0].schema ? schemaArr[0] : schemaT.credentialSchemaDocument,
                credentialSchemaProof: schemaArr[0].proof ? schemaArr[0].proof : schemaT.credentialSchemaProof,
            };
            const response = Object.assign(Object.assign({}, schema.credentialSchemaDocument), { proof: schema.credentialSchemaProof });
            // Competable Schema  with https://www.w3.org/TR/vc-json-schema/#jsonschema    currently not used
            return response;
        });
    }
    vcJsonSchema(schemaResolved) {
        var _a, _b, _c;
        const schemaWrapper = schemaResolved;
        const properties = JSON.parse((_a = schemaResolved.schema) === null || _a === void 0 ? void 0 : _a.properties);
        const ld = {};
        const schemaProp = {};
        Object.entries(properties).forEach((elm) => {
            ld[elm[0]] = {
                '@id': 'https://hypersign-schema.org/' + elm[0],
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                '@type': 'xsd:' + elm[1].type,
            };
            schemaProp[elm[0]] = {
                description: `Enter value for ${elm[0]}`,
                title: `${elm[0]}`,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                type: elm[1].type,
            };
        });
        const jsonLdcontext = {
            '@protected': true,
            '@version': 1.1,
            id: '@id',
            type: '@type',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            [schemaWrapper.name]: {
                '@context': Object.assign({ '@propagate': true, '@protected': true, xsd: 'http://www.w3.org/2001/XMLSchema#' }, ld),
                '@id': 'https://hypersign-schema.org',
            },
        };
        const schemaDoc = {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            description: (_b = schemaWrapper.schema) === null || _b === void 0 ? void 0 : _b.description,
            properties: {
                credentialSubject: {
                    description: 'Stores the data of the credential',
                    title: 'Credential subject',
                    properties: Object.assign({ id: {
                            description: 'Stores the DID of the subject that owns the credential',
                            title: 'Credential subject ID',
                            format: 'uri',
                            type: 'string',
                        } }, schemaProp),
                    required: (_c = schemaWrapper.schema) === null || _c === void 0 ? void 0 : _c.required,
                    type: 'object',
                },
            },
            type: 'object',
            required: ['credentialSubject'],
        };
        schemaDoc['$metadata'] = {
            type: schemaWrapper.name,
            version: 1.0,
            jsonLdContext: { '@context': Object.assign({}, jsonLdcontext) },
        };
        return schemaDoc;
    }
}
exports.default = HypersignBJJSchema;
