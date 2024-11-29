import { isMainThread, parentPort, threadId, workerData } from 'worker_threads';
import jssig from 'jsonld-signatures';
import { BabyJubJubSignature2021Suite } from 'babyjubjubsignature2021';
import { BabyJubJubKeys2021 } from 'babyjubjub2021';
import { purposes } from 'jsonld-signatures';
import { extendContextLoader } from 'jsonld-signatures';
import customLoader from '../../../../libs/w3cache/v1';

const documentLoader = extendContextLoader(customLoader);

async function signCredential(params) {
  const keyPair = BabyJubJubKeys2021.fromKeys(params.keys);
  const suite = new BabyJubJubSignature2021Suite({
    key: keyPair,
    verificationMethod: params.publicKeyId,
  });
  const purpose = new purposes.AssertionProofPurpose({
    controller: {
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: params.issuerDID.id,
      assertionMethod: params.issuerDID.assertionMethod,
    },
  });

  return await jssig.sign(params.credential, {
    purpose,
    suite,
    documentLoader,
  });
}

(async () => {
  try {
    
    const result = await signCredential(workerData);
    parentPort?.postMessage({ success: true, result });
  } catch (error) {
    parentPort?.postMessage({
      success: false,
      error,
    });
  }
})();
