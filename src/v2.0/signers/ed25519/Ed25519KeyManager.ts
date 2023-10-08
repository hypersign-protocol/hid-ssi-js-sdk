import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import {IKeyManager, IKeyPair, IVerificationKeyType } from  '../types'


export default class Ed25519KeyManager implements IKeyManager {
    #signer: any = null;
    #keypair: IKeyPair = {} as IKeyPair;
    #controller = '';
    #seed: string | undefined | Uint8Array;
    // #context: Array<string> = [];
    constructor(params : {seed?: string | Uint8Array; controller?: string} ){
        this.#seed = params.seed;
        this.#controller = params.controller || '';
    }
    
    async initiate(): Promise<IKeyPair> {
        let edKeyPair;
        if (this.#seed && this.#controller) {
            const seedBytes = this.#seed instanceof Uint8Array ? this.#seed : new Uint8Array(Buffer.from(this.#seed));
            edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes, controller: this.#controller });
        } else if (this.#controller) {
            edKeyPair = await Ed25519VerificationKey2020.generate({ controller: this.#controller });
        } else if (this.#seed) {
            const seedBytes = this.#seed instanceof Uint8Array ? this.#seed : new Uint8Array(Buffer.from(this.#seed));
            edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes });
        } else {
            edKeyPair = await Ed25519VerificationKey2020.generate();
        }

        console.log(edKeyPair)
        this.#keypair = edKeyPair; 
        this.#signer = await edKeyPair.signer();
        const exportedKp = await edKeyPair.export({ publicKey: true, privateKey: true });
        delete exportedKp.privateKeyMultibase
        return {
            ...exportedKp,
        };
    }


    get signer(){
        return this.#signer
    }

    get publicKeyMultibase() {
        return this.#keypair.publicKeyMultibase
    }
    get id() {
        return this.#keypair.id
    }

    get controller(){
        return this.#controller
    }

    get type() {
        return this.#keypair.type
    }

}
