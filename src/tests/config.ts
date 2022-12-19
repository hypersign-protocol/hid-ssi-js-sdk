const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const { HdPath, Slip10RawIndex } = require('@cosmjs/crypto');

export const mnemonic =
  'zero require alcohol swamp hover punch celery common merge embrace flock dumb unit capital problem future canal improve auto home apple avoid tragic mechanic'; //"judge harvest lion steak possible ship dog outside local hunt portion fix blast answer walnut injury food clever hen wrist casual humble script alter"//"napkin delay purchase easily camp mimic share wait stereo reflect allow soccer believe exhibit laptop upset tired talent transfer talk surface solution omit crack"

export const hidNodeEp = {
  rpc: 'https://jagrat.hypersign.id/rpc',
  rest: 'https://jagrat.hypersign.id/rest',
  namespace: 'testnet',
};
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
