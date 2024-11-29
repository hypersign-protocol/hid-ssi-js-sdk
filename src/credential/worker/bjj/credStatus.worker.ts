import { parentPort, workerData, threadId } from 'worker_threads';
import customLoader from '../../../../libs/w3cache/v1';
import { CredentialStatusDocument as CredentialStatus } from '../../../../libs/generated/ssi/credential_status';
import { BabyJubJubKeys2021 } from 'babyjubjub2021';
import { BabyJubJubSignature2021Suite } from 'babyjubjubsignature2021';
import jsonSigs from 'jsonld-signatures';
import { extendContextLoader } from 'jsonld-signatures';
import { IVerifiableCredential } from '../../ICredential';
const documentLoader = extendContextLoader(customLoader);
const { Merklizer } = require('@iden3/js-jsonld-merklization');
import * as constant from '../../../constants';

const { AssertionProofPurpose } = jsonSigs.purposes;

async function _jsonLdSign(params: {
  credential: IVerifiableCredential;
  privateKeyMultibase: string;
  verificationMethodId: string;
  publicKeyMultibase: string;
}) {
  const merkelizerObj = await Merklizer.merklizeJSONLD(JSON.stringify(params.credential), {
    documentLoader,
  });

  let credentialHash = await merkelizerObj.mt.root();

  credentialHash = Buffer.from(credentialHash.bytes).toString('hex');

  const credentialStatus: CredentialStatus = {
    '@context': [constant.VC.CREDENTIAL_STATUS_CONTEXT, constant.DID_BabyJubJubKey2021.BABYJUBJUBSIGNATURE],
    id: params.credential.id,
    issuer: params.credential.issuer,
    issuanceDate: params.credential.issuanceDate,
    remarks: 'Credential is active',
    credentialMerkleRootHash: credentialHash,
  };
  const { privateKeyMultibase, verificationMethodId } = params;
  const keyPair = BabyJubJubKeys2021.fromKeys({
    options: { id: verificationMethodId, controller: verificationMethodId },
    privateKeyMultibase: privateKeyMultibase,
    publicKeyMultibase: params.publicKeyMultibase,
  });
  const suite = new BabyJubJubSignature2021Suite({ key: keyPair, verificationMethod: verificationMethodId });

  const signedCredStatus = await jsonSigs.sign(credentialStatus, {
    suite,
    purpose: new AssertionProofPurpose(),
    documentLoader: customLoader,
  });

  return { credentialStatus, credProof: signedCredStatus.proof };
}

(async () => {
  try {
    const result = await _jsonLdSign(workerData);

    parentPort?.postMessage({ success: true, result });
  } catch (error) {
    parentPort?.postMessage({
      success: false,
      error,
    });
  }
})();
