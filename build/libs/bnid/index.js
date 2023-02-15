"use strict";
/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSecretKeySeed = exports.generateSecretKeySeed = exports.maxEncodedIdBytes = exports.minEncodedIdBytes = exports.decodeId = exports.generateId = exports.IdDecoder = exports.IdEncoder = exports.IdGenerator = void 0;
var pkg = require('base58-universal');
var encode = pkg.encode, decode = pkg.decode;
var base58encoder = encode;
var base58decoder = decode;
var util_js_1 = require("./util.js");
// multihash identity function code
var MULTIHASH_IDENTITY_FUNCTION_CODE = 0x00;
function _calcOptionsBitLength(_a) {
    var defaultLength = _a.defaultLength, 
    // TODO: allow any bit length
    _b = _a.minLength, 
    // TODO: allow any bit length
    minLength = _b === void 0 ? 8 : _b, 
    // TODO: support maxLength
    //maxLength = Infinity,
    bitLength = _a.bitLength;
    if (bitLength === undefined) {
        return defaultLength;
    }
    // TODO: allow any bit length
    if (bitLength % 8 !== 0) {
        throw new Error('Bit length must be a multiple of 8.');
    }
    if (bitLength < minLength) {
        throw new Error("Minimum bit length is ".concat(minLength, "."));
    }
    // TODO: support maxLength
    //if(bitLength > maxLength) {
    //  throw new Error(`Maximum bit length is ${maxLength}.`);
    //}
    return bitLength;
}
function _calcDataBitLength(_a) {
    var bitLength = _a.bitLength, maxLength = _a.maxLength;
    if (maxLength === 0) {
        return bitLength;
    }
    if (bitLength > maxLength) {
        throw new Error("Input length greater than ".concat(maxLength, " bits."));
    }
    return maxLength;
}
function _bytesWithBitLength(_a) {
    var bytes = _a.bytes, bitLength = _a.bitLength;
    var length = bytes.length * 8;
    if (length === bitLength) {
        return bytes;
    }
    if (length < bitLength) {
        // pad start
        var data = new Uint8Array(bitLength / 8);
        data.set(bytes, data.length - bytes.length);
        return data;
    }
    // trim start, ensure trimmed data is zero
    var start = (length - bitLength) / 8;
    if (bytes.subarray(0, start).some(function (d) { return d !== 0; })) {
        throw new Error("Data length greater than ".concat(bitLength, " bits."));
    }
    return bytes.subarray(start);
}
var _log2_16 = 4;
function _base16Encoder(_a) {
    var bytes = _a.bytes, idEncoder = _a.idEncoder;
    var encoded = (0, util_js_1.bytesToHex)(bytes);
    if (idEncoder.encoding === 'base16upper') {
        encoded = encoded.toUpperCase();
    }
    if (idEncoder.fixedLength) {
        var fixedBitLength = _calcDataBitLength({
            bitLength: bytes.length * 8,
            maxLength: idEncoder.fixedBitLength
        });
        var wantLength = Math.ceil(fixedBitLength / _log2_16);
        // pad start with 0s
        return encoded.padStart(wantLength, '0');
    }
    return encoded;
}
var _log2_58 = Math.log2(58);
function _base58Encoder(_a) {
    var bytes = _a.bytes, idEncoder = _a.idEncoder;
    var encoded = base58encoder(bytes);
    if (idEncoder.fixedLength) {
        var fixedBitLength = _calcDataBitLength({
            bitLength: bytes.length * 8,
            maxLength: idEncoder.fixedBitLength
        });
        var wantLength = Math.ceil(fixedBitLength / _log2_58);
        // pad start with 0s (encoded as '1's)
        return encoded.padStart(wantLength, '1');
    }
    return encoded;
}
var IdGenerator = /** @class */ (function () {
    function IdGenerator(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.bitLength, bitLength = _c === void 0 ? 128 : _c;
        this.bitLength = _calcOptionsBitLength({
            // default to 128 bits / 16 bytes
            defaultLength: 128,
            // TODO: allow any bit length
            minLength: 8,
            bitLength: bitLength,
        });
    }
    /**
     * Generate random id bytes.
     *
     * @returns {Uint8Array} - Array of random id bytes.
     */
    IdGenerator.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        buf = new Uint8Array(this.bitLength / 8);
                        return [4 /*yield*/, (0, util_js_1.getRandomBytes)(buf)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, buf];
                }
            });
        });
    };
    return IdGenerator;
}());
exports.IdGenerator = IdGenerator;
var IdEncoder = /** @class */ (function () {
    function IdEncoder(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.encoding, encoding = _c === void 0 ? 'base58' : _c, _d = _b.fixedLength, fixedLength = _d === void 0 ? false : _d, _e = _b.fixedBitLength, fixedBitLength = _e === void 0 ? 0 : _e, _f = _b.multibase, multibase = _f === void 0 ? true : _f, _g = _b.multihash, multihash = _g === void 0 ? false : _g;
        switch (encoding) {
            case 'hex':
            case 'base16':
                this.encoder = _base16Encoder;
                this.multibasePrefix = 'f';
                break;
            case 'base16upper':
                this.encoder = _base16Encoder;
                this.multibasePrefix = 'F';
                break;
            case 'base58':
            case 'base58btc':
                this.encoder = _base58Encoder;
                this.multibasePrefix = 'z';
                break;
            default:
                throw new Error("Unknown encoding type: \"".concat(encoding, "\"."));
        }
        this.fixedLength = fixedLength || fixedBitLength !== undefined;
        if (this.fixedLength) {
            this.fixedBitLength = _calcOptionsBitLength({
                // default of 0 calculates from input size
                defaultLength: 0,
                bitLength: fixedBitLength
            });
        }
        this.encoding = encoding;
        this.multibase = multibase;
        this.multihash = multihash;
    }
    /**
     * Encode id bytes into a string.
     *
     * @param {Uint8Array} bytes - Bytes to encode.
     *
     * @returns {string} - Encoded string.
     */
    IdEncoder.prototype.encode = function (bytes) {
        if (this.multihash) {
            var byteSize = bytes.length;
            if (byteSize > 127) {
                throw new RangeError('Identifier size too large.');
            }
            // <varint hash fn code> <varint digest size in bytes> <hash fn output>
            //  <identity function>             <byte size>                <raw bytes>
            var multihash = new Uint8Array(2 + byteSize);
            // <varint hash fn code>: identity function
            multihash.set([MULTIHASH_IDENTITY_FUNCTION_CODE]);
            // <varint digest size in bytes>
            multihash.set([byteSize], 1);
            // <hash fn output>: identifier bytes
            multihash.set(bytes, 2);
            bytes = multihash;
        }
        var encoded = this.encoder({ bytes: bytes, idEncoder: this });
        if (this.multibase) {
            return this.multibasePrefix + encoded;
        }
        return encoded;
    };
    return IdEncoder;
}());
exports.IdEncoder = IdEncoder;
var IdDecoder = /** @class */ (function () {
    function IdDecoder(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.encoding, encoding = _c === void 0 ? 'base58' : _c, _d = _b.fixedBitLength, fixedBitLength = _d === void 0 ? 0 : _d, _e = _b.multibase, multibase = _e === void 0 ? true : _e, _f = _b.multihash, multihash = _f === void 0 ? false : _f, _g = _b.expectedSize, expectedSize = _g === void 0 ? 32 : _g;
        this.encoding = encoding;
        this.fixedBitLength = fixedBitLength;
        this.multibase = multibase;
        this.multihash = multihash;
        this.expectedSize = expectedSize;
    }
    /**
     * Decode id string into bytes.
     *
     * @param {string} id - Id to decode.
     *
     * @returns {Uint8Array} - Array of decoded id bytes.
     */
    IdDecoder.prototype.decode = function (id) {
        var encoding;
        var data;
        if (this.multibase) {
            if (id.length < 1) {
                throw new Error('Multibase encoding not found.');
            }
            var prefix = id[0];
            data = id.substring(1);
            switch (id[0]) {
                case 'f':
                    encoding = 'base16';
                    break;
                case 'F':
                    encoding = 'base16upper';
                    break;
                case 'z':
                    encoding = 'base58';
                    break;
                default:
                    throw new Error("Unknown multibase prefix \"".concat(prefix, "\"."));
            }
        }
        else {
            encoding = this.encoding;
            data = id;
        }
        var decoded;
        switch (encoding) {
            case 'hex':
            case 'base16':
            case 'base16upper':
                if (data.length % 2 !== 0) {
                    throw new Error('Invalid base16 data length.');
                }
                decoded = (0, util_js_1.bytesFromHex)(data);
                break;
            case 'base58':
                decoded = base58decoder(data);
                break;
            default:
                throw new Error("Unknown encoding \"".concat(encoding, "\"."));
        }
        if (!decoded) {
            throw new Error("Invalid encoded data \"".concat(data, "\"."));
        }
        if (this.fixedBitLength) {
            return _bytesWithBitLength({
                bytes: decoded,
                bitLength: this.fixedBitLength
            });
        }
        if (this.multihash) {
            // <varint hash fn code>: identity function
            var hashFnCode = decoded[0];
            if (hashFnCode !== MULTIHASH_IDENTITY_FUNCTION_CODE) {
                throw new Error('Invalid multihash function code.');
            }
            // <varint digest size in bytes>
            var digestSize = decoded[1];
            if (digestSize > 127) {
                throw new RangeError('Decoded identifier size too large.');
            }
            var bytes = decoded.subarray(2);
            if (bytes.byteLength !== digestSize) {
                throw new RangeError('Unexpected identifier size.');
            }
            if (this.expectedSize && bytes.byteLength !== this.expectedSize) {
                throw new RangeError("Invalid decoded identifier size. Identifier must be " +
                    "\"".concat(this.expectedSize, "\" bytes."));
            }
            decoded = bytes;
        }
        return decoded;
    };
    return IdDecoder;
}());
exports.IdDecoder = IdDecoder;
/**
 * Generates an encoded id string from random bits.
 *
 * @param {object} [options] - The options to use. See `IdEncoder` and
 *   `IdGenerator` for available options.
 *
 * @returns {string} - Encoded string id.
 */
function generateId(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = new IdEncoder(options))
                        .encode;
                    return [4 /*yield*/, new IdGenerator(options).generate()];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        });
    });
}
exports.generateId = generateId;
/**
 * Decodes an encoded id string to an array of bytes.
 *
 * @param {object} options - The options to use. See `IdDecoder` for available
 *   options.
 * @param {string} options.id - Id to decode.
 *
 * @returns {Uint8Array} - Decoded array of id bytes.
 */
function decodeId(options) {
    return new IdDecoder(options).decode(options.id);
}
exports.decodeId = decodeId;
/**
 * Minimum number of bytes needed to encode an id of a given bit length.
 *
 * @param {object} options - The options to use.
 * @param {string} [options.encoding='base58'] - Encoding format.
 * @param {number} [options.bitLength=128] - Number of id bits.
 * @param {boolean} [options.multibase=true] - Account for multibase encoding.
 *
 * @returns {number} - The minimum number of encoded bytes.
 */
function minEncodedIdBytes(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.encoding, encoding = _c === void 0 ? 'base58' : _c, _d = _b.bitLength, bitLength = _d === void 0 ? 128 : _d, _e = _b.multibase, multibase = _e === void 0 ? true : _e;
    var plainBytes;
    switch (encoding) {
        case 'hex':
        case 'base16':
        case 'base16upper':
            plainBytes = bitLength / 4;
            break;
        case 'base58':
        case 'base58btc':
            plainBytes = bitLength / 8;
            break;
        default:
            throw new Error("Unknown encoding type: \"".concat(encoding, "\"."));
    }
    return plainBytes + (multibase ? 1 : 0);
}
exports.minEncodedIdBytes = minEncodedIdBytes;
/**
 * Maximum number of bytes needed to encode an id of a given bit length.
 *
 * @param {object} options - The options to use.
 * @param {string} [options.encoding='base58'] - Encoding format.
 * @param {number} [options.bitLength=128] - Number of id bits.
 * @param {boolean} [options.multibase=true] - Account for multibase encoding.
 *
 * @returns {number} - The maximum number of encoded bytes.
 */
function maxEncodedIdBytes(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.encoding, encoding = _c === void 0 ? 'base58' : _c, _d = _b.bitLength, bitLength = _d === void 0 ? 128 : _d, _e = _b.multibase, multibase = _e === void 0 ? true : _e;
    var plainBytes;
    switch (encoding) {
        case 'hex':
        case 'base16':
        case 'base16upper':
            plainBytes = bitLength / 4;
            break;
        case 'base58':
        case 'base58btc':
            plainBytes = Math.ceil(bitLength / Math.log2(58));
            break;
        default:
            throw new Error("Unknown encoding type: \"".concat(encoding, "\"."));
    }
    return plainBytes + (multibase ? 1 : 0);
}
exports.maxEncodedIdBytes = maxEncodedIdBytes;
/**
 * Generates a secret key seed encoded as a string that can be stored and later
 * used to generate a key pair. The public key from the key pair can be used as
 * an identifier. The key seed (both raw and encoded form) MUST be kept secret.
 *
 * @param {object} [options] - The options to use.
 * @param {string} [options.encoding='base58'] - Encoding format.
 * @param {number} [options.bitLength=32 * 8] - Number of bits to generate.
 * @param {boolean} [options.multibase=true] - Use multibase encoding.
 * @param {boolean} [options.multihash=true] - Use multihash encoding.

 * @returns {string} - Secret key seed encoded as a string.
 */
function generateSecretKeySeed(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.bitLength, bitLength = _c === void 0 ? 32 * 8 : _c, _d = _b.encoding, encoding = _d === void 0 ? 'base58' : _d, _e = _b.multibase, multibase = _e === void 0 ? true : _e, _f = _b.multihash, multihash = _f === void 0 ? true : _f;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_g) {
            // reuse `generateId` for convenience, but a key seed is *SECRET* and
            // not an identifier itself, rather it is used to generate an identifier via
            // a public key
            // Note: Setting fixedLength to false even though that's the (current)
            // default as not using a fixed length of false for a seed is a security
            // problem
            return [2 /*return*/, generateId({ bitLength: bitLength, encoding: encoding, fixedLength: false, multibase: multibase, multihash: multihash })];
        });
    });
}
exports.generateSecretKeySeed = generateSecretKeySeed;
/**
 * Decodes an encoded secret key seed into an array of secret key seed bytes.
 * The key seed bytes MUST be kept secret.
 *
 * @param {object} options - The options to use.
 * @param {boolean} [options.multibase=true] - Use multibase encoding to detect
 *   the id format.
 * @param {boolean} [options.multihash=true] - Use multihash encoding to detect
 *   the id format.
 * @param {number} [options.expectedSize] - Optional expected identifier size
 *   in bytes (only for multihash encoding). Use `0` to disable size check.
 * @param {string} options.secretKeySeed - The secret key seed to be decoded.
 *
 * @returns {Uint8Array} - An array of secret key seed bytes (default size:
 *   32 bytes).
 */
function decodeSecretKeySeed(_a) {
    var _b = _a.multibase, multibase = _b === void 0 ? true : _b, _c = _a.multihash, multihash = _c === void 0 ? true : _c, _d = _a.expectedSize, expectedSize = _d === void 0 ? 32 : _d, secretKeySeed = _a.secretKeySeed;
    // reuse `decodeId` for convenience, but key seed bytes are *SECRET* and
    // are NOT identifiers, they are used to generate identifiers from public keys
    return decodeId({ multihash: multihash, multibase: multibase, expectedSize: expectedSize, id: secretKeySeed });
}
exports.decodeSecretKeySeed = decodeSecretKeySeed;
