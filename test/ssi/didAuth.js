const { createWallet, writeDataInFile, mnemonic, hidNodeEp } = require('../config')
const HypersignSsiSDK = require('../../build/src')
const { Bip39 } = require('@cosmjs/crypto')
let hsSdk = null;
let didDocString;
let versionId;
let verificationMethodId;
let didDoc;
let privateKeyMultibase;
let offlineSigner

createWallet(mnemonic)
    .then(async (offlineSigner11) => {
        offlineSigner = offlineSigner11
        console.log("offlineSigner", offlineSigner);
        const accounts = await offlineSigner.getAccounts();
        console.log(accounts)
        hsSdk = new HypersignSsiSDK(offlineSigner, hidNodeEp.rpc, hidNodeEp.rest, hidNodeEp.namespace);
        return hsSdk.init();
    })
    .then(async () => {
        const seed = Bip39.decode(mnemonic)
        const kp = await hsSdk.did.generateKeys({ seed });
        console.log("kp", kp);
        privateKeyMultibase = kp.privateKeyMultibase
        const publicKeyMultibase = kp.publicKeyMultibase
        // didDocString = await hsSdk.did.generate({ publicKeyMultibase });
        // didDoc = JSON.parse(didDocString);

        // verificationMethodId = didDoc.verificationMethod[0].id
        // await hsSdk.did.register({ didDocString, privateKeyMultibase, verificationMethodId })


        const didDoc = { "id": "did:hid:devnet:zGotbuQPTSANMtVFZuPvSr1Dedw9rZs5MpdkiBSwY4tnV", "controller": ["did:hid:devnet:zGotbuQPTSANMtVFZuPvSr1Dedw9rZs5MpdkiBSwY4tnV"], "alsoKnownAs": ["did:hid:devnet:zGotbuQPTSANMtVFZuPvSr1Dedw9rZs5MpdkiBSwY4tnV"], "verificationMethod": [{ "id": "did:hid:devnet:zGotbuQPTSANMtVFZuPvSr1Dedw9rZs5MpdkiBSwY4tnV#key-1", "type": "Ed25519VerificationKey2020", "controller": "did:hid:devnet:zGotbuQPTSANMtVFZuPvSr1Dedw9rZs5MpdkiBSwY4tnV", "publicKeyMultibase": "zBsgb2aLJfMZArfXwjejSX8gMVz1k5zhf5bEn3WACz2wG" }], "authentication": ["did:hid:devnet:zGotbuQPTSANMtVFZuPvSr1Dedw9rZs5MpdkiBSwY4tnV#key-1"], "assertionMethod": ["did:hid:devnet:zGotbuQPTSANMtVFZuPvSr1Dedw9rZs5MpdkiBSwY4tnV#key-1"], "keyAgreement": ["did:hid:devnet:zGotbuQPTSANMtVFZuPvSr1Dedw9rZs5MpdkiBSwY4tnV#key-1"], "capabilityInvocation": ["did:hid:devnet:zGotbuQPTSANMtVFZuPvSr1Dedw9rZs5MpdkiBSwY4tnV#key-1"], "capabilityDelegation": ["did:hid:devnet:zGotbuQPTSANMtVFZuPvSr1Dedw9rZs5MpdkiBSwY4tnV#key-1"], "service": [], "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/ed25519-2020/v1"] }
        console.log("============Sign==================");
        const { signedDidDocument } = await hsSdk.did.signDid({ privateKey: kp.privateKeyMultibase, challenge: "123", domain: 'abc', did: didDoc.id })
        writeDataInFile("../mock/signedError.json", JSON.stringify(signedDidDocument))
        console.log(signedDidDocument);
        let obj={

        }
        Object.assign(obj,signedDidDocument)
        const {  context,didDocument } = await hsSdk.did.resolve({ didDoc: signedDidDocument })
        console.log("============Verify==================");
        console.log(didDocument);
        const {VerificationResult} = await hsSdk.did.verify({ doc : obj})
        console.log("verifiedSig", JSON.stringify(VerificationResult, null, 2));
       
    })


