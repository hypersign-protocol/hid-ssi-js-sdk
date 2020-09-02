import { HYPERSIGN_NETWORK_DID_URL }  from './constants'
const fetch = require('node-fetch');


export const fetchData = async (url) => (await (await fetch(url)).json())

export const resolve = async (did) => {
    const didDoc = await fetchData(HYPERSIGN_NETWORK_DID_URL + did);
    if(didDoc['status'] === 500) throw new Error('Could not resolve did ='+ did)
    return didDoc;
} 

export const getControllerAndPublicKeyFromDid = async(did, type) =>{
    let controller = {}, publicKey = {}
    did = did.split('#')[0]
    let didDoc = await resolve(did);
    
    let methodType = didDoc[type];
    publicKey = didDoc['publicKey'].find(x => x.id == methodType[0])
    if(!publicKey['controller']){
        controller = {
            '@context' : "https://w3id.org/security/v2",
            'id': did
        }
        controller[type] = methodType
    }else{
        controller = publicKey['controller']
    }

    return {
        controller, publicKey, didDoc
    }
    
}

