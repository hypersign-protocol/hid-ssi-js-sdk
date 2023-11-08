import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { Slip10RawIndex } from '@cosmjs/crypto';
import Web3 from 'web3';
import { ProofTypes, VerificationMethodRelationships } from '../../libs/generated/ssi/client/enums';
export declare const mnemonic = "verify sustain lumber boat demise parade special soft bargain scout spoil there addict move badge rebuild horn achieve hollow acquire glide bundle curious present";
export declare const hidNodeEp: {
    rpc: string;
    rest: string;
    namespace: string;
};
export declare function makeCosmoshubPath(a: any): Slip10RawIndex[];
export declare const createWallet: (mnemonic: any) => Promise<DirectSecp256k1HdWallet>;
export declare const generatePresentationProof: (presentation: any, challenge: any, holderDid: any, authentication: any, verificationMethodId: any, domain?: any) => Promise<any>;
export declare const verifyPresentation: (signedPresentaion: any, challenge: any, holderDid: any, domain?: any) => Promise<import("ethereumeip712signature2021suite").VerifyProofResult>;
export declare const metamaskProvider = "https://linea-goerli.infura.io/v3/6014efc44d9346bcb69d99d97aa0ad27";
export declare const generateWeb3Obj: () => Promise<Web3>;
export declare const signDid: (didDocument: any, clientSpec: any, verificationMethodId: any, account: any) => Promise<{
    '@context': any;
    type: ProofTypes;
    created: string;
    verificationMethod: any;
    proofPurpose: VerificationMethodRelationships;
} | undefined>;
export declare const entityApiSecret = "29a393a5d70094e409824359fc5d5.befc6c6f32d622e1c29ca900299a5695251b2407ca7cf6db8e6b2569dc13f937a4b83f4fa78738715d6267d3733e4f139";
//# sourceMappingURL=config.d.ts.map