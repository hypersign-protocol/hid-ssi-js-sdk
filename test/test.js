const lib = require('../dist/index')
const { getChallange, getUserDoc, sign, verify, getCredential} = lib

let credential = {};
let doc = {};
let challenge = ""
const userData = {
  name: "Vishwas",
  email: "vishu.anand1@gmail.com",
  telephone: "+91-8444072883",
  birthdate: "1993-11-12",
  jobTitle: "Software Enginner"
}
const domain = "www.abc.com"

console.log("Start.....")
getCredential(userData.name)
.then(cred => {
  console.log("=============GENERATE CREDENTIALS=========================")
  console.log("cred =", cred)
  credential = cred
  
  doc = getUserDoc(userData)
  console.log("=============GENERATE USER DOC=========================")
  console.log("UserDoc =", doc)

  challenge = getChallange()
  console.log("==============GENERATE NEW CHALLENGE STRING=======================")
  console.log("challenge =", challenge)
  return sign({
    doc, 
    privateKeyBase58: credential.keys.privateKeyBase58,
    publicKey: credential.keys.publicKey,
    challenge,
    domain
  })
})
.then((signedDoc) => {
  console.log("===============SIGNED DOC=======================")
  console.log("signedDoc =", signedDoc)
  return verify({
    doc: signedDoc, 
    publicKey: credential.keys.publicKey,
    challenge,
    domain,
    controller: credential.controller
  })
})
.then((verified) => {
  console.log("===============VERIFED DOC=======================")
  console.log("verified =", verified)
  console.log("Finised.")
})
.catch(e => console.log(e))


