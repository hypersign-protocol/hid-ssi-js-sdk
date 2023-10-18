import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { Slip10RawIndex } from '@cosmjs/crypto';
export declare const mnemonic = "verify sustain lumber boat demise parade special soft bargain scout spoil there addict move badge rebuild horn achieve hollow acquire glide bundle curious present";
export declare const hidNodeEp: {
    rpc: string;
    rest: string;
    namespace: string;
};
export declare function makeCosmoshubPath(a: any): Slip10RawIndex[];
export declare const createWallet: (mnemonic: any) => Promise<DirectSecp256k1HdWallet>;
//# sourceMappingURL=config.d.ts.map