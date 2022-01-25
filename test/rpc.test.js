const { HIDWallet,  } = require('../dist/wallet/wallet')
const { HIDRpcFactory } = require('../dist/rpc/rpcFactory')
const { DIDRpc } = require('../dist/rpc/didRPC')

const { HYPERSIGN_TESTNET_RPC, HIDRpcEnums } = require('../dist/constants')




// Register RPC using factory




// Call did_register

const mnemonic = "engage start cigar bulb naive borrow damp march hotel scare basic begin nest increase maid damage march spice eternal myself nose shy eye simple"
const toAddress =  "cosmos12g32k94y4xxzv4zq9378yl0cy5f3jh73en2yfp"

let hdWallet = null;
async function initWallet(){
    console.log('Initiating wallet')
    hdWallet = new HIDWallet({
        mnemonic,
        rpcEndpoint: HYPERSIGN_TESTNET_RPC
    })
    await hdWallet.init();    
    console.log('Wallet inislized account', hdWallet.account)
    return hdWallet.account;  
}

async function addSigner(registry){
    console.log('connecting signer')
    await hdWallet.connectSigner(registry);   
}

async function registryRPC(){
    console.log('registering create did rpc')
    // This should happen when the sdk is inistalised
    const rf = new HIDRpcFactory()
    console.log(HIDRpcEnums.MsgCreateDID)

    rf.registerRpc(HIDRpcEnums.MsgCreateDID)
    await addSigner(rf.hidRPCRegistery);
}

let didrpc = null; 
async function  call_did_create_rpc(did, didDocString){
    console.log('calling resiterDID rpc')
    didrpc = new DIDRpc(hdWallet);
    return didrpc.registerDID({
        did,
        didDocString
    })
}

async function resolve_did(did){
    const didDoc = await didrpc.resolveDID(did)
    return didDoc;
}


const did = "did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51"
initWallet()
    .then(account => {
        console.log(account)
        return registryRPC()
    })
    .then(() => {
        return call_did_create_rpc(
            did,
            "{\"@context\":[\"https://www.w3.org/ns/did/v1\",\"https://w3id.org/security/v1\",\"https://schema.org\"],\"@type\":\"https://schema.org/Person\",\"id\":\"did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51\",\"name\":\"Vishwas\",\"publicKey\":[{\"@context\":\"https://w3id.org/security/v2\",\"id\":\"did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51#z6MkjAwRoZNV1oifLPb2GzLatZ7sVxY5jZ16xYTTAgSgCqQQ\",\"type\":\"Ed25519VerificationKey2018\",\"publicKeyBase58\":\"5igPDK83gGECDtkKbRNk3TZsgPGEKfkkGXYXLQUfHcd2\"}],\"authentication\":[\"did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51#z6MkjAwRoZNV1oifLPb2GzLatZ7sVxY5jZ16xYTTAgSgCqQQ\"],\"assertionMethod\":[\"did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51#z6MkjAwRoZNV1oifLPb2GzLatZ7sVxY5jZ16xYTTAgSgCqQQ\"],\"keyAgreement\":[\"did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51#z6MkjAwRoZNV1oifLPb2GzLatZ7sVxY5jZ16xYTTAgSgCqQQ\"],\"capabilityInvocation\":[\"did:hs:0f49341a-20ef-43d1-bc93-de30993e6c51#z6MkjAwRoZNV1oifLPb2GzLatZ7sVxY5jZ16xYTTAgSgCqQQ\"],\"created\":\"2021-04-06T14:13:14.018Z\",\"updated\":\"2021-04-06T14:13:14.018Z\"}" 
        )
    })
    .then(r => {
        console.log(r)
        return resolve_did(did)
    })
    .then(didDoc => {
        console.log(didDoc)
    })
    .catch(e => {
        console.log(e)
    })
