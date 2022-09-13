const { extendContextLoader } = require("jsonld-signatures")
const jsigs = require('jsonld-signatures');
const { IVerifiableCredential } = require('../../build/src/credential/ICredential')
const { VC, DID } = require('../../build/src/constants');

const vc = require('vc-js')
const documentLoader = require('jsonld').documentLoader;
const { AssertionProofPurpose } = jsigs.purposes;
const { Bip39 } = require('@cosmjs/crypto')
const HypersignSsiSDK = require("../../build/src")
const HypersignDID = require("../../build/src/did/did.js")
const { createWallet, mnemonic, hidNodeEp, writeDataInFile } = require("../config")
const { Ed25519VerificationKey2020 } = require("@digitalbazaar/ed25519-verification-key-2020")
const { Ed25519Signature2020 } = require("@digitalbazaar/ed25519-signature-2020")
const { id } = require("../mock/schema.json");
const { type } = require("os");
const { defaultDocumentLoader } = vc

async function test() {
  const schemaId = id
  const issuerDid = 'did:hid:devnet:zHByfNVfzzLD15nkpdpwYLkvkkPdGgdppznXUxTJ1Ws8v'
  const subjectDid = 'did:hid:devnet:zHByfNVfzzLD15nkpdpwYLkvkkPdGgdppznXUxTJ1Ws8v'
  const offlineSigner = await createWallet(mnemonic);
  const hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
  await hsSdk.init()
  const { didDocument: issuerDidDoc } = await hsSdk.vc.hsDid.resolve({ did: issuerDid });

  const { didDocument: subjectDidDoc } = await hsSdk.vc.hsDid.resolve({ did: subjectDid });
  const didDoc = subjectDidDoc



  const keyPair = await Ed25519VerificationKey2020.generate({ seed: Bip39.decode(mnemonic) })

  const suite = new Ed25519Signature2020({ key: keyPair });


  const context = {
    "@context": ["https://www.w3.org/2018/credentials/v1", "https://schema.org"],
    "id": "vc:hid:devnet:zAAzPpqHQ4ojvFdACYsEyBcTZCtBhdWLVAC7n5UFiJFPC",
    "type": ["VerifiableCredential", "Patient"],
    "expirationDate": "2027-12-10T18:30:00Z",
    "issuanceDate": "2022-09-06T14:41:18Z",
    "issuer": "did:hid:devnet:zHByfNVfzzLD15nkpdpwYLkvkkPdGgdppznXUxTJ1Ws8v",
    "credentialSubject": {
      "@type": "Patient",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Seattle",
        "addressRegion": "WA",
        "postalCode": "98052",
        "streetAddress": "20341 Whitworth Institute 405 N. Whitworth"
      },
      "email": "mailto:jane-doe@xyz.edu",
      "image": "janedoe.jpg",
      "jobTitle": "Professor",
      "name": "Jane Doe",
      "telephone": "(425) 123-4567",
      "url": "http://www.janedoe.com",
      "id": "did:hid:devnet:zHByfNVfzzLD15nkpdpwYLkvkkPdGgdppznXUxTJ1Ws8v",
      "diagonsis": {
        "@context": "https://schema.org",
        "@type": "MedicalCondition",
        "alternateName": "angina pectoris",
        "associatedAnatomy": {
          "@type": "AnatomicalStructure",
          "name": "heart"
        },
        "cause": [
          {
            "@type": "MedicalCause",
            "name": "atherosclerosis"
          },
          {
            "@type": "MedicalCause",
            "name": "spasms of the epicardial artery"
          }
        ],
        "code": {
          "@type": "MedicalCode",
          "code": "413",
          "codingSystem": "ICD-9"
        },
        "differentialDiagnosis": {
          "@type": "DDxElement",
          "diagnosis": {
            "@type": "MedicalCondition",
            "name": "heart attack"
          },
          "distinguishingSign": [
            {
              "@type": "MedicalSymptom",
              "name": "chest pain lasting at least 10 minutes at rest"
            },
            {
              "@type": "MedicalSymptom",
              "name": "repeated episodes of chest pain at rest lasting 5 or more minutes"
            },
            {
              "@type": "MedicalSymptom",
              "name": "an accelerating pattern of chest discomfort (episodes that are more frequent, severe, longer in duration, and precipitated by minimal exertion)"
            }
          ]
        },
        "name": "Stable angina",
        "possibleTreatment": [
          {
            "@type": "Drug",
            "name": "aspirin"
          },
          {
            "@type": "DrugClass",
            "name": "beta blockers"
          },
          {
            "@type": "DrugClass",
            "name": "ACE inhibitors"
          },
          {
            "@type": "Drug",
            "name": "nitroglycerine"
          }
        ],
        "riskFactor": [
          {
            "@type": "MedicalRiskFactor",
            "name": "Age"
          },
          {
            "@type": "MedicalRiskFactor",
            "name": "Gender"
          },
          {
            "@type": "MedicalRiskFactor",
            "name": "Systolic blood pressure"
          },
          {
            "@type": "MedicalRiskFactor",
            "name": "Smoking"
          },
          {
            "@type": "MedicalRiskFactor",
            "name": "Total cholesterol and/or cholesterol:HDL ratio"
          },
          {
            "@type": "MedicalRiskFactor",
            "name": "Coronary artery disease"
          }
        ],
        "secondaryPrevention": [
          {
            "@type": "LifestyleModification",
            "name": "stopping smoking"
          },
          {
            "@type": "LifestyleModification",
            "name": "weight management"
          },
          {
            "@type": "LifestyleModification",
            "name": "increased physical activity"
          }
        ],
        "signOrSymptom": [
          {
            "@type": "MedicalSymptom",
            "name": "chest discomfort"
          },
          {
            "@type": "MedicalSymptom",
            "name": "feeling of tightness, heaviness, or pain in the chest"
          }
        ]
      },


    },


  }
  // const documentLoader = extendContextLoader(async (url) => {
  //   if (url.startsWith('https://jagrat.hypersign.id/')) {
  //     return {
  //       contextUrl: null,
  //       documentUrl: url,
  //       document: context
  //     };
  //   }

  //   return defaultDocumentLoader(url);
  // }
  // );




  const fields = {
    email: "vishwas@anand.com",
    name: "Vishwas Anand Bhushan",
    modelname: "abcd"
  }
  const expirationDate = new Date('12/11/2027');

  // const credential = await hsSdk.vc.getCredential({
  //   schemaId,
  //   subjectDid,
  //   issuerDid,
  //   fields,
  //   expirationDate
  // })
  // console.log(credential);

  suite.verificationMethod = 'Ed25519VerificationKey2020'
  try {
    console.log(context);
    // const signedCredential = await vc.issue({
    //   credential: context,
    //   suite,
    //   documentLoader,
    // });
    const { privateKeyMultibase } = suite.key

    const signedCredential = await hsSdk.vc.issueCredential({
      credential: context,
      issuerDid: 'did:hid:devnet:zHByfNVfzzLD15nkpdpwYLkvkkPdGgdppznXUxTJ1Ws8v',
      privateKey: privateKeyMultibase
    })

    writeDataInFile('../mock/SignedCred.json', JSON.stringify(signedCredential))
    // const verifiableCreadStatus = await vc.verifyCredential({
    //   credential: signedCredential, suite, documentLoader
    // });
    // console.log(verifiableCreadStatus);

    const verifiableCreadStatus = await hsSdk.vc.verifyCredential({ credential: signedCredential, issuerDid })
    console.log(verifiableCreadStatus);


    const unsignedVp = await hsSdk.vp.getPresentation({
      verifiableCredential: context,
      holderDid: subjectDid
    })
    console.log(unsignedVp);
    const SignedPresentation = await hsSdk.vp.signPresentation({
      presentation: unsignedVp,
      holderDid: subjectDid,
      privateKey: privateKeyMultibase,
      challenge: '123',
      domain: 'example.com',
    })
    console.log(SignedPresentation);
    writeDataInFile('../mock/SignedPresentation.json', JSON.stringify(SignedPresentation))
    const verify = await hsSdk.vp.verifyPresentation({
      signedPresentation: SignedPresentation,
      challenge: '123',
      domain: 'example.com',
      issuerDid,
      holderDid: subjectDid
    })
    console.log(verify);
    writeDataInFile('../mock/verifyPresentation.json', JSON.stringify(verify))

  } catch (error) {
    console.log(error);
  }
}




//test()



async function test2() {
  const schemaId = id
  const issuerDid = 'did:hid:devnet:zHByfNVfzzLD15nkpdpwYLkvkkPdGgdppznXUxTJ1Ws8v'
  const subjectDid = 'did:hid:devnet:zHByfNVfzzLD15nkpdpwYLkvkkPdGgdppznXUxTJ1Ws8v'
  const offlineSigner = await createWallet(mnemonic);
  const hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
  await hsSdk.init()




  const expirationDate = new Date('12/11/2027');

  const context = [ "https://schema.org"]
       
  
  const fields = {    
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Seattle",
      "addressRegion": "WA",
      "postalCode": "98052",
      "streetAddress": "20341 Whitworth Institute 405 N. Whitworth"
    },
    "email": "mailto:jane-doe@xyz.edu",
    "image": "janedoe.jpg",
    "jobTitle": "Professor",
    "name": "Jane Doe",
    "telephone": "(425) 123-4567",
    "url": "http://www.janedoe.com",
    "id": "did:hid:devnet:zHByfNVfzzLD15nkpdpwYLkvkkPdGgdppznXUxTJ1Ws8v",
    "diagonsis": {      
      "alternateName": "angina pectoris",
      "associatedAnatomy": {
        "@type": "AnatomicalStructure",
        "name": "heart"
      },
      "cause": [
        {
          "@type": "MedicalCause",
          "name": "atherosclerosis"
        },
        {
          "@type": "MedicalCause",
          "name": "spasms of the epicardial artery"
        }
      ],
      "code": {
        "@type": "MedicalCode",
        "code": "413",
        "codingSystem": "ICD-9"
      },
      "differentialDiagnosis": {
        "@type": "DDxElement",
        "diagnosis": {
          "@type": "MedicalCondition",
          "name": "heart attack"
        },
        "distinguishingSign": [
          {
            "@type": "MedicalSymptom",
            "name": "chest pain lasting at least 10 minutes at rest"
          },
          {
            "@type": "MedicalSymptom",
            "name": "repeated episodes of chest pain at rest lasting 5 or more minutes"
          },
          {
            "@type": "MedicalSymptom",
            "name": "an accelerating pattern of chest discomfort (episodes that are more frequent, severe, longer in duration, and precipitated by minimal exertion)"
          }
        ]
      },
      "name": "Stable angina",
      "possibleTreatment": [
        {
          "@type": "Drug",
          "name": "aspirin"
        },
        {
          "@type": "DrugClass",
          "name": "beta blockers"
        },
        {
          "@type": "DrugClass",
          "name": "ACE inhibitors"
        },
        {
          "@type": "Drug",
          "name": "nitroglycerine"
        }
      ],
      "riskFactor": [
        {
          "@type": "MedicalRiskFactor",
          "name": "Age"
        },
        {
          "@type": "MedicalRiskFactor",
          "name": "Gender"
        },
        {
          "@type": "MedicalRiskFactor",
          "name": "Systolic blood pressure"
        },
        {
          "@type": "MedicalRiskFactor",
          "name": "Smoking"
        },
        {
          "@type": "MedicalRiskFactor",
          "name": "Total cholesterol and/or cholesterol:HDL ratio"
        },
        {
          "@type": "MedicalRiskFactor",
          "name": "Coronary artery disease"
        }
      ],
      "secondaryPrevention": [
        {
          "@type": "LifestyleModification",
          "name": "stopping smoking"
        },
        {
          "@type": "LifestyleModification",
          "name": "weight management"
        },
        {
          "@type": "LifestyleModification",
          "name": "increased physical activity"
        }
      ],
      "signOrSymptom": [
        {
          "@type": "MedicalSymptom",
          "name": "chest discomfort"
        },
        {
          "@type": "MedicalSymptom",
          "name": "feeling of tightness, heaviness, or pain in the chest"
        }
      ]
    },


  }

  // const documentLoader = extendContextLoader(async (url) => {
  //   if (url.startsWith('https://jagrat.hypersign.id/node1/rest/hypersign-protocol/hidnode/ssi/schema/')) {
  //     return {
  //       contextUrl: 'https://jagrat.hypersign.id/node1/rest/hypersign-protocol/hidnode/ssi/schema/sch:hid:devnet:zDeoRRueW8mAKsxxwxRT4J7aT8iyUTLZy6TpCD3H3zamo:1.0:',
  //       documentUrl: url,
  //       document: context
  //     };
  //   }

  //   return defaultDocumentLoader(url);
  // }
  // );
  const keyPair = await Ed25519VerificationKey2020.generate({ seed: Bip39.decode(mnemonic) })

  const suite = new Ed25519Signature2020({ key: keyPair });
  const {privateKeyMultibase}=suite.key


const creadential=await hsSdk.vc.getCredential({
    
    schemaContext:context,
    type:['Patient'],
    subjectDid,
    issuerDid,
    fields,
    expirationDate
  })
  console.log(creadential);
const issueCread=await hsSdk.vc.issueCredential({
  credential: creadential,
  issuerDid: 'did:hid:devnet:zHByfNVfzzLD15nkpdpwYLkvkkPdGgdppznXUxTJ1Ws8v',
  privateKey: privateKeyMultibase
})
console.log(issueCread);



const verifiableCreadStatus = await hsSdk.vc.verifyCredential({ credential: issueCread, issuerDid })
    console.log(verifiableCreadStatus);


    const unsignedVp = await hsSdk.vp.getPresentation({
      verifiableCredential: creadential,
      holderDid: subjectDid
    })
    console.log(unsignedVp);
    const SignedPresentation = await hsSdk.vp.signPresentation({
      presentation: unsignedVp,
      holderDid: subjectDid,
      privateKey: privateKeyMultibase,
      challenge: '123',
      domain: 'example.com',
    })
    console.log(SignedPresentation);
    const verify = await hsSdk.vp.verifyPresentation({
      signedPresentation: SignedPresentation,
      challenge: '123',
      domain: 'example.com',
      issuerDid,
      holderDid: subjectDid
    })
    console.log(verify);

}


test2()


