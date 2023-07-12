/**
 * - Testing schema which are not registered in Hypersign Network 
 * - Supporting Multiple Credentials while creating presentation
 */

const {HypersignVerifiableCredential} = require("../../../build/src")
const { createWallet, mnemonic, hidNodeEp, writeDataInFile } = require("../../config")
const { privateKeyMultibase } = require('../../mock/public/keys.json')
const issuerDidDoc = require('../../mock/public/did.json')
const otherVc = require('../../mock/vc.json');
const path =  require('path');


async function test2() {
  const issuerDid = issuerDidDoc.id;
  const subjectDid = issuerDidDoc.id;;

  const offlineSigner = await createWallet(mnemonic);
  const hsSdk = new HypersignVerifiableCredential({
    offlineSigner, nodeRpcEndpoint:'https://rpc.jagrat.hypersign.id', nodeRestEndpoint:'https://api.jagrat.hypersign.id', namespace: 'testnet'
  });
  await hsSdk.init()

  const expirationDate = new Date('12/11/2027');
  const context = [ "https://schema.org"] // proving schemas which are not registered in hypersign
       

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

  console.log('Genenrate VC ==========')
  const creadential=await hsSdk.generate({
      schemaContext: context,
      type: ['Patient'],
      subjectDid,
      issuerDid,
      fields,
      expirationDate
    })
    
  console.log(JSON.stringify(creadential, null, 2));
  
  console.log('Issue VC ==========')
  const issueCread=await hsSdk.issue({
    credential: creadential,
    issuerDid,
    verificationMethodId:issuerDidDoc.assertionMethod[0] ,
    privateKeyMultibase: privateKeyMultibase
  })
  const filePath = path.join(__dirname, '../../mock/vc-with-schema-org.json')
  console.log(filePath);
  writeDataInFile(filePath, JSON.stringify(issueCread))
  console.log(JSON.stringify(issueCread, null, 2));
  
  console.log('Verify VC ==========')
  const verifiableCreadStatus = await hsSdk.verify({ credential: issueCread.signedCredential,
  issuerDid,verificationMethodId:issueCread.signedCredential.proof.verificationMethod })
  console.log(verifiableCreadStatus);

  console.log('Generate VP ==========')
  const unsignedVp = await hsSdk.vp.getPresentation({
    verifiableCredentials: [ issueCread, otherVc ], // adding two credentials to check if both credentials can be verified
    holderDid: subjectDid,
  })
  console.log(unsignedVp);

  console.log('Sign VP ==========')
  const SignedPresentation = await hsSdk.vp.signPresentation({
    presentation: unsignedVp,
    holderDid: subjectDid,
    privateKey: privateKeyMultibase,
    challenge: '123',
    domain: 'example.com',
    verificationMethodId: issuerDidDoc.assertionMethod[0]
  })
  
  console.log(JSON.stringify(SignedPresentation, null, 2));
  const vpfilePath = path.join(__dirname, '../../mock/vp-with-multi-vc.json')
  writeDataInFile(vpfilePath, JSON.stringify(SignedPresentation))
  console.log('Verify VP ==========')
  const verify = await hsSdk.vp.verifyPresentation({
    signedPresentation: SignedPresentation,
    challenge: '123',
    domain: 'example.com',
    issuerDid,
    holderDid: subjectDid,
    holderVerificationMethodId: issuerDidDoc.authentication[0],
    issuerVerificationMethodId: issuerDidDoc.assertionMethod[0]
  })
  console.log(verify);
}


test2()


