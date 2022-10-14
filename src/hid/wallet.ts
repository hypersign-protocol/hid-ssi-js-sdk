import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import axios from 'axios';
import { HYPERSIGN_NETWORK_BANK_BALANCE_PATH, HYPERSIGN_TESTNET_REST } from '../constants';

export interface IHIDWallet {
  rpc: string;
  mnemonic: string;
  account: string;
  connectSigner(registry?: any): Promise<any>;
  signAndBroadcastMessages(message: object, fee: object, memo?: string): Promise<any>;
  transferTokens(recipientAddress: string, amount: Array<object>, fee: object, memo?: string): Promise<any>;
  init(): Promise<any>;
  getFee(): object;
}

export class HIDWallet implements IHIDWallet {
  mnemonic: string;
  wallet: any;
  rpc: string;
  client: any;
  account: string;
  constructor({ mnemonic, rpc }) {
    if (!rpc) {
      throw new Error('rpc is required');
    }

    this.rpc = rpc;
    this.mnemonic = mnemonic;
    this.account = '';
  }

  private async createWallet() {
    console.log('Createing wallet with mnemonic ', this.mnemonic);
    if (!this.mnemonic) {
      this.wallet = await DirectSecp256k1HdWallet.generate();
      this.mnemonic = this.wallet.mnemonic;
    } else {
      this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(this.mnemonic);
    }
  }

  public async encryptWalletWithPassword(password) {
    return await this.wallet.serialize(password);
  }

  public async recoverWalletFromPassword(encryptedWalletStr, password) {
    this.wallet = await DirectSecp256k1HdWallet.deserialize(encryptedWalletStr, password);
    await this.setAccounts();
  }

  private async setAccounts() {
    const accounts = await this.wallet.getAccounts();
    this.mnemonic = this.wallet.mnemonic;
    this.account = accounts[0].address;
  }

  /**
   * step 1: Initiates the wallet
   */
  public async init() {
    await this.createWallet();
    await this.setAccounts();
  }

  // step2:
  public async connectSigner(registry?: any) {
    this.client = await SigningStargateClient.connectWithSigner(this.rpc, this.wallet, { registry });
    if (!this.client) throw new Error('Client could not inistliaed');
  }

  public getFee(): object {
    return {
      amount: [
        {
          denom: 'uatom',
          amount: '10',
        },
      ],
      gas: '6200000',
    };
  }

  public async signAndBroadcastMessages(message: object, fee?: object, memo?: string): Promise<any> {
    if (!this.account || !this.client) {
      throw new Error('Wallet is not initialize');
    }
    return await this.client.signAndBroadcast(this.account, [message], fee ? fee : this.getFee(), memo);
  }

  public async transferTokens(
    recipientAddress: string,
    amount: Array<object>,
    fee?: object,
    memo?: string
  ): Promise<any> {
    if (!this.account || !this.client) {
      throw new Error('Wallet is not initialize');
    }
    return await this.client.sendTokens(this.account, recipientAddress, amount, fee ? fee : this.getFee(), memo);
  }

  public async fundWalletViaFaucet(recipientAddress: string) {
    const faucetUrl = 'http://localhost:4500/';

    const req_body = {
      address: recipientAddress,
      coins: ['20uatom'],
    };
    const response = await axios.post(faucetUrl, req_body);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return 'success';
  }

  public async balance() {
    const url = `${HYPERSIGN_TESTNET_REST}${HYPERSIGN_NETWORK_BANK_BALANCE_PATH}${this.account}`;
    const response = await axios.get(url);
    return response.data;
  }
}
