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
        hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest,  hidNodeEp.namespace);
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
            verificationMethodId:issuerDidDoc.assertionMethod[0]
        })
    })
    .then((svc) => {
        writeDataInFile('../../mock/vc.json', JSON.stringify(svc))
        console.log(JSON.stringify(svc, null, 2))
        signedVC = svc;
        console.log('================Verify Verifiable Credential================')
        return hsSdk.vc.verifyCredential({ credential: svc, issuerDid ,verificationMethodId:issuerDidDoc.assertionMethod[0]})
    })
    .then((result) => {
        console.log(result)
    })


    .then(() => {
        console.log('================Generate Verifiable Presenatation Unsigned VC: ================')
        return hsSdk.vp.getPresentation({
            verifiableCredentials: [unsignedVc],
            holderDid: subjectDid
        })
    })
    .then(vp => {
        console.log(JSON.stringify(vp, null, 2))
        unsignedVp = vp;
        console.log('================Sign Verifiable Presenatation================')
        return hsSdk.vp.signPresentation({
            presentation: unsignedVp,
            holderDidDocSigned: holderSignedDIDDoc,
            privateKey,
            challenge,
            verificationMethodId:holderSignedDIDDoc.assertionMethod[0]
        })
    })
    .then(svp => {
        console.log(JSON.stringify(svp, null, 2))
        writeDataInFile('../../mock/vp.json', JSON.stringify(svp))
        signedVP = svp;
        console.log('================Verify Verifiable Presenatation================')
        return hsSdk.vp.verifyPresentation({
            signedPresentation: signedVP,
            challenge,
            domain: "https://localhos:20202",
            issuerDid,
            holderDidDocSigned: holderSignedDIDDoc,
            holderVerificationMethodId:holderSignedDIDDoc.authentication[0],
            issuerVerificationMethodId:issuerDidDoc.assertionMethod[0]
        })
    })
    .then(result => {
        console.log(result)
    })
    .catch((e) => {
        console.error(e)
    })