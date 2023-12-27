import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { HdPath, Slip10RawIndex } from '@cosmjs/crypto';
import { EthereumEip712Signature2021 } from 'ethereumeip712signature2021suite';
import { purposes } from 'jsonld-signatures';
import { DID } from '../constants';
import customLoader from '../../libs/w3cache/v1';
import { JCS } from 'jcs';
import Web3 from 'web3';
import jsonld from 'jsonld';

import crypto from 'crypto';
import { ProofTypes, VerificationMethodRelationships } from '../../libs/generated/ssi/client/enums';
const documentLoader = customLoader;

let keyPair;
export const mnemonic =
  'verify sustain lumber boat demise parade special soft bargain scout spoil there addict move badge rebuild horn achieve hollow acquire glide bundle curious present';

export const hidNodeEp = {
  rpc: 'https://rpc.prajna.hypersign.id',
  rest: 'https://api.prajna.hypersign.id',
  namespace: 'testnet',
};
// export const hidNodeEp = {
//   rpc: 'http://127.0.0.1:26657',
//   rest: 'http://127.0.0.1:1317',
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
const phrase = 'flat vessel crawl guess female tray breeze bachelor rare fragile pottery observe';

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

export const generatePresentationProof = async (
  presentation,
  challenge,
  holderDid,
  authentication,
  verificationMethodId,
  domain?
) => {
  const web3 = await generateWeb3Obj();
  const EthereumEip712Signature2021obj = new EthereumEip712Signature2021({}, web3);

  keyPair = await EthereumEip712Signature2021obj.fromPrivateKey(
    '0x149195a4059ac8cafe2d56fc612f613b6b18b9265a73143c9f6d7cfbbed76b7e'
  );
  const vcs: Array<string> = [];
  presentation.verifiableCredential.forEach((vc) => {
    return vcs.push(JCS.cannonicalize(vc));
  });
  presentation.verifiableCredential = vcs;
  const proof = await EthereumEip712Signature2021obj.createProof({
    document: presentation,
    purpose: new purposes.AuthenticationProofPurpose({
      challenge,
      domain: domain,
      controller: {
        '@context': DID.CONTROLLER_CONTEXT,
        id: holderDid,
        authentication: authentication,
      },
    }),
    verificationMethod: verificationMethodId,
    date: new Date().toISOString(),
    documentLoader,
    domain: domain ? { name: domain } : undefined,
  });
  presentation.proof = proof;
  return presentation;
};
// will remove unused functions later
export const verifyPresentation = async (signedPresentaion, challenge, holderDid, domain?) => {
  const EthereumEip712Signature2021obj = new EthereumEip712Signature2021({});
  const proof = signedPresentaion.proof;
  delete signedPresentaion.proof;
  const verifResult = await EthereumEip712Signature2021obj.verifyProof({
    proof: proof,
    domain: domain ? { name: domain } : undefined,
    document: signedPresentaion,
    types: 'EthereumEip712Signature2021',
    purpose: new purposes.AuthenticationProofPurpose({
      challenge,
      domain: domain,
      controller: {
        '@context': DID.CONTROLLER_CONTEXT,
        id: holderDid,
        authentication: [`${holderDid}#key-1`],
      },
    }),
    documentLoader: customLoader,
  });
  return verifResult;
};
async function _jsonLdNormalize(params: { doc }) {
  const docToNormalize = params.doc;
  const normalizedoc = await jsonld.normalize(docToNormalize, {
    format: 'application/n-quads',
    algorithm: 'URDNA2015',
  });

  return normalizedoc;
}
function _concat(arr1, arr2) {
  const concatenatedArr = new Uint8Array(arr1.length + arr2.length);
  concatenatedArr.set(arr1, 0);
  concatenatedArr.set(arr2, arr1.length);
  return concatenatedArr;
}
export const metamaskProvider = 'https://linea-goerli.infura.io/v3/6014efc44d9346bcb69d99d97aa0ad27';

export const generateWeb3Obj = async () => {
  const provider = new Web3.providers.HttpProvider(metamaskProvider);
  const web3 = new Web3(provider);
  return web3;
};

export const signDid = async (didDocument, clientSpec, verificationMethodId, account) => {
  if (clientSpec == 'eth-personalSign') {
    const normalizedDidDoc = await _jsonLdNormalize({ doc: didDocument });
    const normalizedDidDocHash = new Uint8Array(
      Buffer.from(crypto.createHash('sha256').update(normalizedDidDoc).digest('hex'), 'hex')
    );
    const proof = {
      '@context': didDocument['@context'],
      type: ProofTypes.EcdsaSecp256k1RecoverySignature2020,
      created: new Date(new Date().getTime() - 100000).toISOString().slice(0, -5) + 'Z',
      verificationMethod: verificationMethodId, //didDoc?.verificationMethod && (didDoc.verificationMethod[0]?.id as string), // which vmId to use in case of multiple vms  or we should pass vmId also in sign function
      proofPurpose: VerificationMethodRelationships.assertionMethod,
    };
    const normalizedProof = await _jsonLdNormalize({ doc: proof });
    delete proof['@context'];
    const normalizedProofhash = new Uint8Array(
      Buffer.from(crypto.createHash('sha256').update(normalizedProof).digest('hex'), 'hex')
    );
    const combinedHash = _concat(normalizedProofhash, normalizedDidDocHash);
    const didDocJsonDigest = {
      didId: didDocument.id,
      didDocDigest: Buffer.from(combinedHash).toString('hex'),
    };
    const web3 = new Web3();
    const signature = await web3.eth.personal.sign(
      JSON.stringify(didDocJsonDigest, (key, value) => {
        if (value === '' || (Array.isArray(value) && value.length === 0)) {
          return undefined;
        }
        return value;
      }),
      account.address,
      account.privateKey
    );
    delete proof['@context'];
    proof['proofValue'] = signature;
    return proof;
  }
};

export const entityApiSecret =
  '29a393a5d70094e409824359fc5d5.befc6c6f32d622e1c29ca900299a5695251b2407ca7cf6db8e6b2569dc13f937a4b83f4fa78738715d6267d3733e4f139';
// wallet address: hid1rh5h603fv9dneqm422uvl4xk3fc77a4uheleq5
