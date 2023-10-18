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


export const entityApiSecret = '29a393a5d70094e409824359fc5d5.befc6c6f32d622e1c29ca900299a5695251b2407ca7cf6db8e6b2569dc13f937a4b83f4fa78738715d6267d3733e4f139'
// wallet address: hid1rh5h603fv9dneqm422uvl4xk3fc77a4uheleq5
