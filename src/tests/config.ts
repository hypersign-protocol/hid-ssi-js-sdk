import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { HdPath, Slip10RawIndex } from '@cosmjs/crypto';

export const mnemonic =
  'verify sustain lumber boat demise parade special soft bargain scout spoil there addict move badge rebuild horn achieve hollow acquire glide bundle curious present';

export const hidNodeEp = {
  rpc: 'https://rpc.jagrat.hypersign.id',
  rest: 'https://api.jagrat.hypersign.id',
  namespace: 'testnet',
};
// export const hidNodeEp = {
//   rpc: 'http://localhost:26657',
//   rest: 'http://localhost:1317',
//   namespace: 'testnet',
// };
export function makeCosmoshubPath(a) {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(118),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(a),
  ];
}

export const createWallet = async (mnemonic) => {
  let options;
  if (!mnemonic) {
    return await DirectSecp256k1HdWallet.generate(
      24,
      (options = {
        prefix: 'hid',
        hdPaths: [makeCosmoshubPath(0)],
      })
    );
  } else {
    return await DirectSecp256k1HdWallet.fromMnemonic(
      mnemonic,
      (options = {
        prefix: 'hid',
        hdPaths: [makeCosmoshubPath(0)],
      })
    );
  }
};
