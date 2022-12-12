/**
 * - Testing create, sign, verify VC using custom schema
 * - Testing create, sign, verify VP
 * - Testing of private and public did 
 */

const HypersignSsiSDK = require('../../../build/src')
const { createWallet, mnemonic, hidNodeEp, writeDataInFile } = require('../../config')
const issuerDidDoc = require('../../mock/public/did.json')
const { id: schemaId } = require('../../mock/public/schema.json')
const { privateKeyMultibase } = require('../../mock/public/keys.json')

const holderSignedDIDDoc = require('../../mock/private/signed-did.json')
const { default: Axios } = require('axios')


let hsSdk;
let unsignedVc;
let signedVC;
let unsignedVp;
let signedVP;
const challenge = "12312301231231jnj12n3123123s"
const subjectDid = holderSignedDIDDoc.id
console.log(subjectDid)
const issuerDid = issuerDidDoc.id;
const privateKey = privateKeyMultibase;

createWallet(mnemonic)
    .then((offlineSigner) => {
        hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
        return hsSdk.init();
    })
    .then(() => {
        const fields = {
            email: "vishwas@anand.com",
            name: "Vishwas Anand Bhushan",
            modelname: "abcd"
        };
        const expirationDate = new Date('12/11/2027');
        console.log('================Genenrate Verifiable Credential================')
        return hsSdk.vc.getCredential({
            schemaId,
            subjectDidDocSigned: holderSignedDIDDoc,
            issuerDid,
            expirationDate,
            fields
        })
    })
    .then((vc) => {
        console.log(JSON.stringify(vc, null, 2))
        unsignedVc = vc;
        console.log('================Issue Verifiable Credential================')
        return hsSdk.vc.issueCredential({
            credential: vc,
            issuerDid,
            privateKey,
            verificationMethodId: issuerDidDoc.assertionMethod[0]
        })
    })
    .then((svc) => {
        writeDataInFile('../../mock/Before-revoke-vc.json', JSON.stringify(svc))
        console.log(JSON.stringify(svc, null, 2))
        signedVC = svc;
        console.log('================Verify Verifiable Credential================')
        return hsSdk.vc.verifyCredential({ credential: svc, issuerDid, verificationMethodId: issuerDidDoc.assertionMethod[0] })
    })
    .then((result) => {
        console.log(result)
    })

    .then(async () => {
        console.log('================Revoke Verifiable Credential================')
        const credentialStatus  = await Axios.get(signedVC.credentialStatus.id) 
        const {credStatus}= credentialStatus.data
        return hsSdk.vc.updateCredentialStatus({
            credStatus,
            issuerDid,
            privateKey,
            verificationMethodId: issuerDidDoc.assertionMethod[0],
            status: 'SUSPENDED',
            statusReason: 'I am the issuer i can do whatever'
        })
    })
    .then((result) => {
        console.log(JSON.stringify(result, null, 2))
        writeDataInFile('../../mock/After-revoke-vc.json', JSON.stringify(result))
        
        console.log('================Verify Verifiable Credential================')
        return hsSdk.vc.verifyCredential({ credential: signedVC, issuerDid, verificationMethodId: issuerDidDoc.assertionMethod[0] })


    }).then((result) => {
        console.log("===================Verification after revocation ====================")
    
        console.log(result)
    })
