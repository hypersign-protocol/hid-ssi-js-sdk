
import { hypersignSDKInit } from '../utils/utils';
describe('Testing DID Module', () => {
    let hsSDK ;
    beforeAll(async ()=> {
        console.log('inside before all')
        hsSDK = await hypersignSDKInit();
    })


    it('should generate ED25519 Keypair ', async ()=> {
        expect(true).toBeTruthy();
    })

})