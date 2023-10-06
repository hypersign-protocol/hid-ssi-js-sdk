import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import {IKeyManager, IKeyPair } from  '../IKeyManager'

export default class Ed25519KeyManager implements IKeyManager {
    #signer: any = null;
    #keypair: IKeyPair | undefined;
    #controller: string | undefined;
    #seed: string | undefined | Uint8Array;
    constructor(params : {seed?: string | Uint8Array; controller?: string} ){
        this.#seed = params.seed || undefined;
        this.#controller = params.controller || undefined;
        this.#keypair = undefined ;
    }
    
    async initiate(): Promise<IKeyPair> {
        let edKeyPair;
        if (this.#seed && this.#controller) {
            const seedBytes = this.#seed instanceof Uint8Array ? this.#seed : new Uint8Array(Buffer.from(this.#seed));
            edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes, id: this.#controller });
        } else if (this.#controller) {
            edKeyPair = await Ed25519VerificationKey2020.generate({ id: this.#controller });
        } else if (this.#seed) {
            const seedBytes = this.#seed instanceof Uint8Array ? this.#seed : new Uint8Array(Buffer.from(this.#seed));
            edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes });
        } else {
            edKeyPair = await Ed25519VerificationKey2020.generate();
        }
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
        return this.#keypair?.publicKeyMultibase
    }
    get id() {
        return this.#keypair?.id
    }

    get type() {
        return this.#keypair?.type
    }

}
