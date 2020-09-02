const lib = require('../dist/index')
const { getChallange, getDidDocAndKeys, sign, verify} = lib

let challenge = ""
const userData = {
  name: "Vishwas",
  phNumber: "phoneNumber"
}
const domain = "www.abc.com"

console.log("Start.....")
// getDidDoc(userData.name).then(res =>  console.log(res))

const sampleDidDoc = {"@context":["https://www.w3.org/ns/did/v1","https://w3id.org/security/v1","https://schema.org","http://localhost:5000/api/did/resolve"],"@type":"https://schema.org/Person","id":"did:hs:6af8fa78-ac40-4dd7-9ba0-b4641ef35545","name":"Vishwas Anand","publicKey":[{"@context":"https://w3id.org/security/v2","id":"did:hs:6af8fa78-ac40-4dd7-9ba0-b4641ef35545#z6MknoNTxEWCrhsJ29EZCzcbkBw9pjXqRLaCzBUoUKxr4Ktk","type":"Ed25519VerificationKey2018","publicKeyBase58":"9M7RMzFmXANpuePrXReku6PA1AFz1TKrJAZse3zq977N"}],"authentication":["did:hs:6af8fa78-ac40-4dd7-9ba0-b4641ef35545#z6MknoNTxEWCrhsJ29EZCzcbkBw9pjXqRLaCzBUoUKxr4Ktk"],"assertionMethod":["did:hs:6af8fa78-ac40-4dd7-9ba0-b4641ef35545#z6MknoNTxEWCrhsJ29EZCzcbkBw9pjXqRLaCzBUoUKxr4Ktk"],"keyAgreement":["did:hs:6af8fa78-ac40-4dd7-9ba0-b4641ef35545#z6MknoNTxEWCrhsJ29EZCzcbkBw9pjXqRLaCzBUoUKxr4Ktk"],"capabilityInvocation":["did:hs:6af8fa78-ac40-4dd7-9ba0-b4641ef35545#z6MknoNTxEWCrhsJ29EZCzcbkBw9pjXqRLaCzBUoUKxr4Ktk"],"created":"2020-09-02T05:26:59.775Z","updated":"2020-09-02T05:26:59.775Z"}
const keys = {"publicKey":{"@context":"https://w3id.org/security/v2","id":"did:hs:6af8fa78-ac40-4dd7-9ba0-b4641ef35545#z6MknoNTxEWCrhsJ29EZCzcbkBw9pjXqRLaCzBUoUKxr4Ktk","type":"Ed25519VerificationKey2018","publicKeyBase58":"9M7RMzFmXANpuePrXReku6PA1AFz1TKrJAZse3zq977N"},"privateKeyBase58":"61BJKDZDiYiXqTwWPapyx59XuqXpTiqTj8ZFqivbGAmXSfyGnxeUBMCTcmWXZPUBc3Y24iA3vjNSMebjmouFMjUc"}

getDidDocAndKeys(userData)
.then(res => {
  console.log("=============GENERATE CREDENTIALS=========================")
  // const { keys, didDoc } = res
  const { privateKeyBase58, publicKey } = keys
  console.log("cred =", keys )
  
  console.log("=============GENERATE USER DOC=========================")
  console.log("UserDoc =", sampleDidDoc)

  challenge = getChallange()
  console.log("==============GENERATE NEW CHALLENGE STRING=======================")
  console.log("challenge =", challenge)
  return sign({
    did: sampleDidDoc['id'],
    privateKeyBase58,
    challenge,
    domain
  })
})
.then((signedDoc) => {
  console.log("===============SIGNED DOC=======================")
  console.log("signedDoc =", signedDoc)
  return verify({
    doc: signedDoc, 
    challenge,
    domain
  })
})
.then((verified) => {
  console.log("===============VERIFED DOC=======================")
  console.log("verified =", verified)
  console.log("Finised.")
})
.catch(e => console.log(e))


