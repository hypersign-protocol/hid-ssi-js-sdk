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

getDidDocAndKeys(userData)
.then(res => {
  console.log("=============GENERATE CREDENTIALS=========================")
  const { keys, didDoc } = res
  const { privateKeyBase58, publicKey } = keys
  console.log("cred =", keys )
  
  console.log("=============GENERATE USER DOC=========================")
  console.log("UserDoc =", didDoc)

  challenge = getChallange()
  console.log("==============GENERATE NEW CHALLENGE STRING=======================")
  console.log("challenge =", challenge)
  return sign({
    doc: didDoc, 
    privateKeyBase58,
    publicKey,
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


