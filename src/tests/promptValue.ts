import * as readlineSync from 'readline-sync';

export const promptForConfig = () => {
  console.log('\n=== Blockchain Configuration ===\n');

  const rpcInput = readlineSync.question('Enter RPC Endpoint (Press enter to use default value): ');
  const restInput = readlineSync.question('Enter REST Endpoint (Press enter to use default value): ');
  const namespaceInput = readlineSync.question('Enter Namespace (Press enter to use default value): ');
  const mnemonicInput = readlineSync.question('Enter Wallet Mnemonic (Press enter to use default value): ', {
    hideEchoBack: true,
  });

  const rpcEndpoint = rpcInput || process.env.RPC_ENDPOINT || 'https://rpc.prajna-1.hypersign.id';
  const restEndpoint = restInput || process.env.REST_ENDPOINT || 'https://api.prajna-1.hypersign.id';
  const namespace = namespaceInput || process.env.NAMESPACE || 'testnet';
  const mnemonic =
    mnemonicInput ||
    process.env.MNEMONIC ||
    'verify sustain lumber boat demise parade special soft bargain scout spoil there addict move badge rebuild horn achieve hollow acquire glide bundle curious present';

  console.log('\n=== Configuration Summary ===');
  console.log(`RPC Endpoint: ${rpcEndpoint}`);
  console.log(`REST Endpoint: ${restEndpoint}`);
  console.log(`Namespace: ${namespace}`);
  console.log(`Mnemonic: ${mnemonic ? '****** (set)' : 'not set'}`);
  console.log('');

  return { rpc: rpcEndpoint, rest: restEndpoint, namespace, mnemonic };
};

export const setEnvFromPrompt = () => {
  const cfg = promptForConfig();
  process.env.RPC_ENDPOINT = cfg.rpc;
  process.env.REST_ENDPOINT = cfg.rest;
  process.env.NAMESPACE = cfg.namespace;
  process.env.MNEMONIC = cfg.mnemonic;
};

// Only run prompt if this file is executed directly
if (require.main === module) {
  setEnvFromPrompt();
}
