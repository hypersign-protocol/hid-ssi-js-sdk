/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */

const pkg=require('base58-universal')
const {encode,decode}=pkg
const base58encoder=encode
const base58decoder=decode
  import {
    getRandomBytes,
    bytesToHex,
    bytesFromHex
  } from './util.js';
  
  // multihash identity function code
  const MULTIHASH_IDENTITY_FUNCTION_CODE = 0x00;
  
  function _calcOptionsBitLength({
    defaultLength,
    // TODO: allow any bit length
    minLength = 8,
    // TODO: support maxLength
    //maxLength = Infinity,
    bitLength
  }) {
    if(bitLength === undefined) {
      return defaultLength;
    }
    // TODO: allow any bit length
    if(bitLength % 8 !== 0) {
      throw new Error('Bit length must be a multiple of 8.');
    }
    if(bitLength < minLength) {
      throw new Error(`Minimum bit length is ${minLength}.`);
    }
    // TODO: support maxLength
    //if(bitLength > maxLength) {
    //  throw new Error(`Maximum bit length is ${maxLength}.`);
    //}
    return bitLength;
  }
  
  function _calcDataBitLength({
    bitLength,
    maxLength
  }) {
    if(maxLength === 0) {
      return bitLength;
    }
    if(bitLength > maxLength) {
      throw new Error(`Input length greater than ${maxLength} bits.`);
    }
    return maxLength;
  }
  
  function _bytesWithBitLength({
    bytes,
    bitLength
  }) {
    const length = bytes.length * 8;
    if(length === bitLength) {
      return bytes;
    }
    if(length < bitLength) {
      // pad start
      const data = new Uint8Array(bitLength / 8);
      data.set(bytes, data.length - bytes.length);
      return data;
    }
    // trim start, ensure trimmed data is zero
    const start = (length - bitLength) / 8;
    if(bytes.subarray(0, start).some(d => d !== 0)) {
      throw new Error(
        `Data length greater than ${bitLength} bits.`);
    }
    return bytes.subarray(start);
  }
  
  const _log2_16 = 4;
  function _base16Encoder({bytes, idEncoder}) {
    let encoded = bytesToHex(bytes);
    if(idEncoder.encoding === 'base16upper') {
      encoded = encoded.toUpperCase();
    }
    if(idEncoder.fixedLength) {
      const fixedBitLength = _calcDataBitLength({
        bitLength: bytes.length * 8,
        maxLength: idEncoder.fixedBitLength
      });
      const wantLength = Math.ceil(fixedBitLength / _log2_16);
      // pad start with 0s
      return encoded.padStart(wantLength, '0');
    }
    return encoded;
  }
  
  const _log2_58 = Math.log2(58);
  function _base58Encoder({bytes, idEncoder}) {
    const encoded = base58encoder(bytes);
    if(idEncoder.fixedLength) {
      const fixedBitLength = _calcDataBitLength({
        bitLength: bytes.length * 8,
        maxLength: idEncoder.fixedBitLength
      });
      const wantLength = Math.ceil(fixedBitLength / _log2_58);
      // pad start with 0s (encoded as '1's)
      return encoded.padStart(wantLength, '1');
    }
    return encoded;
  }
  
  export class IdGenerator {
    /**
     * Creates a new IdGenerator instance.
     *
     * An IdGenerator generates an array of id bytes.
     *
     * @param {object} [options] - The options to use.
     * @param {number} [options.bitLength=128] - Number of bits to generate.
     *
     * @returns {IdGenerator} - New IdGenerator.
     */
    bitLength
    constructor({
      bitLength=128
    } = {}) {
      this.bitLength = _calcOptionsBitLength({
        // default to 128 bits / 16 bytes
        defaultLength: 128,
        // TODO: allow any bit length
        minLength: 8,
        bitLength,
      });
    }
  
    /**
     * Generate random id bytes.
     *
     * @returns {Uint8Array} - Array of random id bytes.
     */
    async generate() {
      const buf = new Uint8Array(this.bitLength / 8);
      await getRandomBytes(buf);
      return buf;
    }
  }
  
  export class IdEncoder {
    /**
     * Creates a new IdEncoder instance.
     *
     * An IdEncoder encodes an array of id bytes into a specific encoding.
     *
     * @param {object} [options] - The options to use.
     * @param {string} [options.encoding='base58'] - Encoding format.
     * @param {boolean} [options.fixedLength=false] - `true` to ensure fixed
     *   output length.
     * @param {number} [options.fixedBitLength] - Fixed output bit length or 0 to
     *   base on input byte size.
     * @param {boolean} [options.multibase=true] - Use multibase encoding.
     * @param {boolean} [options.multihash=false] - Use multihash encoding.
     *
     * @returns {IdEncoder} - New IdEncoder.
     */
    fixedBitLength
    encoding
    fixedLength
    multibase
    multihash
    encoder
    multibasePrefix

    constructor({
      encoding = 'base58',
      fixedLength = false,
      fixedBitLength=0,
      multibase = true,
      multihash = false,
    } = {}) {
      switch(encoding) {
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
          throw new Error(`Unknown encoding type: "${encoding}".`);
      }
      this.fixedLength = fixedLength || fixedBitLength !== undefined;
      if(this.fixedLength) {
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
    encode(bytes) {
      if(this.multihash) {
        const byteSize = bytes.length;
  
        if(byteSize > 127) {
          throw new RangeError('Identifier size too large.');
        }
        // <varint hash fn code> <varint digest size in bytes> <hash fn output>
        //  <identity function>             <byte size>                <raw bytes>
        const multihash = new Uint8Array(2 + byteSize);
        // <varint hash fn code>: identity function
        multihash.set([MULTIHASH_IDENTITY_FUNCTION_CODE]);
        // <varint digest size in bytes>
        multihash.set([byteSize], 1);
        // <hash fn output>: identifier bytes
        multihash.set(bytes, 2);
        bytes = multihash;
      }
      const encoded = this.encoder({bytes, idEncoder: this});
      if(this.multibase) {
        return this.multibasePrefix + encoded;
      }
      return encoded;
    }
  }
  
  export class IdDecoder {
    /**
     * Creates a new IdDecoder instance.
     *
     * An IdDecoder decodes an id string into a byte array. It is recommended to
     * use the fixedBitLength option to avoid padding ids resulting in a larger
     * than expected byte length.
     *
     * @param {object} [options] - The options to use.
     * @param {string} [options.encoding='base58'] - Encoding format. Ignored if
     *   multibase is true.
     * @param {number} [options.fixedBitLength] - Fixed output bit length. Values
     *   with leading non-zero data will error.
     * @param {boolean} [options.multibase=true] - Use multibase encoding to
     *   detect the id format.
     * @param {boolean} [options.multihash=false] - Use multihash encoding to
     *   detect the id format.
     * @param {number} [options.expectedSize=32] - Optional expected identifier
     *   size in bytes (only for multihash encoding). Use `0` to disable size
     *   check.
     * @returns {IdDecoder} - New IdDecoder.
     */
    fixedBitLength
    encoding
    fixedLength
    multibase
    multihash
    encoder
    multibasePrefix
    expectedSize
    constructor({
      encoding = 'base58',
      fixedBitLength=0,
      multibase = true,
      multihash = false,
      expectedSize = 32
    } = {}) {
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
    decode(id) {
      let encoding;
      let data;
      if(this.multibase) {
        if(id.length < 1) {
          throw new Error('Multibase encoding not found.');
        }
        const prefix = id[0];
        data = id.substring(1);
        switch(id[0]) {
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
            throw new Error(`Unknown multibase prefix "${prefix}".`);
        }
      } else {
        encoding = this.encoding;
        data = id;
      }
      let decoded;
      switch(encoding) {
        case 'hex':
        case 'base16':
        case 'base16upper':
          if(data.length % 2 !== 0) {
            throw new Error('Invalid base16 data length.');
          }
          decoded = bytesFromHex(data);
          break;
        case 'base58':
          decoded = base58decoder(data);
          break;
        default:
          throw new Error(`Unknown encoding "${encoding}".`);
      }
      if(!decoded) {
        throw new Error(`Invalid encoded data "${data}".`);
      }
      if(this.fixedBitLength) {
        return _bytesWithBitLength({
          bytes: decoded,
          bitLength: this.fixedBitLength
        });
      }
      if(this.multihash) {
        // <varint hash fn code>: identity function
        const [hashFnCode] = decoded;
  
        if(hashFnCode !== MULTIHASH_IDENTITY_FUNCTION_CODE) {
          throw new Error('Invalid multihash function code.');
        }
        // <varint digest size in bytes>
        const digestSize = decoded[1];
  
        if(digestSize > 127) {
          throw new RangeError('Decoded identifier size too large.');
        }
  
        const bytes = decoded.subarray(2);
  
        if(bytes.byteLength !== digestSize) {
          throw new RangeError('Unexpected identifier size.');
        }
        if(this.expectedSize && bytes.byteLength !== this.expectedSize) {
          throw new RangeError(
            `Invalid decoded identifier size. Identifier must be ` +
              `"${this.expectedSize}" bytes.`);
        }
  
        decoded = bytes;
      }
      return decoded;
    }
  }
  
  /**
   * Generates an encoded id string from random bits.
   *
   * @param {object} [options] - The options to use. See `IdEncoder` and
   *   `IdGenerator` for available options.
   *
   * @returns {string} - Encoded string id.
   */
  export async function generateId(options) {
    return new IdEncoder(options)
      .encode(await new IdGenerator(options).generate());
  }
  
  /**
   * Decodes an encoded id string to an array of bytes.
   *
   * @param {object} options - The options to use. See `IdDecoder` for available
   *   options.
   * @param {string} options.id - Id to decode.
   *
   * @returns {Uint8Array} - Decoded array of id bytes.
   */
  export function decodeId(options) {
    return new IdDecoder(options).decode(options.id);
  }
  
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
  export function minEncodedIdBytes({
    encoding = 'base58',
    bitLength = 128,
    multibase = true
  } = {}) {
    let plainBytes;
    switch(encoding) {
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
        throw new Error(`Unknown encoding type: "${encoding}".`);
    }
    return plainBytes + (multibase ? 1 : 0);
  }
  
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
  export function maxEncodedIdBytes({
    encoding = 'base58',
    bitLength = 128,
    multibase = true
  } = {}) {
    let plainBytes;
    switch(encoding) {
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
        throw new Error(`Unknown encoding type: "${encoding}".`);
    }
    return plainBytes + (multibase ? 1 : 0);
  }
  
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
  export async function generateSecretKeySeed({
    bitLength = 32 * 8,
    encoding = 'base58',
    multibase = true,
    multihash = true
  } = {}) {
    // reuse `generateId` for convenience, but a key seed is *SECRET* and
    // not an identifier itself, rather it is used to generate an identifier via
    // a public key
    // Note: Setting fixedLength to false even though that's the (current)
    // default as not using a fixed length of false for a seed is a security
    // problem
    return generateId(
      {bitLength, encoding, fixedLength: false, multibase, multihash});
  }
  
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
  export function decodeSecretKeySeed({
    multibase = true,
    multihash = true,
    expectedSize = 32,
    secretKeySeed,
  }) {
    // reuse `decodeId` for convenience, but key seed bytes are *SECRET* and
    // are NOT identifiers, they are used to generate identifiers from public keys
    return decodeId({multihash, multibase, expectedSize, id: secretKeySeed});
  }
  