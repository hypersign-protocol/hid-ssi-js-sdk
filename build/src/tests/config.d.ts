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
export declare const entityApiSecret = "29a393a5d70094e409824359fc5d5.befc6c6f32d622e1c29ca900299a5695251b2407ca7cf6db8e6b2569dc13f937a4b83f4fa78738715d6267d3733e4f139";
//# sourceMappingURL=config.d.ts.map