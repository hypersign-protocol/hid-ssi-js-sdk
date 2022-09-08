import * as ed25519 from '@stablelib/ed25519';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import crypto from 'crypto';
import * as bip39 from 'bip39';
import * as argon2 from 'argon2';

export = class SSIWallet {
  private isWalletLocked: boolean;
  private walletLockHash: string;
  private keyPair: any;
  private entropy: string;
  private isReady = false;
  private readonly password: string;
  private mnemonic: string | undefined;
  private constructor(password: string, mnemonic?: string | undefined) {
    this.password = password;
    this.mnemonic = mnemonic;
    this.entropy = '';
    this.password = password;
    this.isWalletLocked = true;
    this.walletLockHash = '';
  }

  public async isWalletReady(): Promise<boolean> {
    const { hash, entropy } = await this.init(this.password, this.mnemonic);
    this.walletLockHash = hash;
    this.entropy = entropy;

    this.isReady = true;
    const walletCredentials = await this.generateKeys();
    this.keyPair = walletCredentials;

    this.isReady = true;
    return this.isReady;
  }
  public async getMnemomic({ password }) {
    if (!this.isReady) {
      throw new Error('SSIWallet Error:: Wallet is not Initialized');
    }
    if ((await this.unlockWallet(password)) === true) {
      const mnemonic = bip39.entropyToMnemonic(this.entropy);
      return mnemonic;
    } else {
      throw new Error('SSIWallet Error:: Wallet is locked');
    }
  }

  private async init(password: string, mnemonic?: string): Promise<{ hash: string; entropy: string }> {
    return new Promise((resolve, reject) => {
      try {
        argon2.hash(password).then(async (hash) => {
          console.log(hash);

          let entropy;
          if (mnemonic) {
            entropy = bip39.mnemonicToEntropy(mnemonic);
          } else {
            entropy = crypto.randomBytes(32).toString('hex');
          }

          resolve({ hash, entropy });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private async generateKeys(): Promise<{ walletCredentials: any }> {
    const seedBytes = Buffer.from(this.entropy, 'hex');
    console.log('seedBytes', seedBytes);

    const edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes });

    const exportedKp = await edKeyPair.export({ publicKey: true, privateKey: true });

    return { walletCredentials: exportedKp };
  }

  // private  async generateKeys(params: {
  //   seed: string;
  // }): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string }> {
  //   let edKeyPair;
  //   if (params && params.seed) {
  //     const seedBytes = new Uint8Array(Buffer.from(params.seed));
  //     edKeyPair = await Ed25519VerificationKey2020.generate({ seed: seedBytes });
  //   } else {
  //     edKeyPair = await Ed25519VerificationKey2020.generate();
  //   }
  //   const exportedKp = await edKeyPair.export({ publicKey: true, privateKey: true });
  //   console.log(exportedKp);

  //   return {
  //     privateKeyMultibase: exportedKp.privateKeyMultibase, // 91byte //zbase58
  //     publicKeyMultibase: exportedKp.publicKeyMultibase, //48 bytes
  //   };
  // }
  public async unlockWallet(password: string): Promise<boolean> {
    if (await argon2.verify(this.walletLockHash, password)) {
      console.log('Wallet Unlocked');

      this.isWalletLocked = false;
      return true;
    } else {
      this.isWalletLocked = true;
      console.log('Wallet Locked');
      return false;
    }
  }
  public lockWallet(): boolean {
    this.isWalletLocked = true;
    return this.isWalletLocked;
  }
};
