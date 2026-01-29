"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnvFromPrompt = exports.promptForConfig = void 0;
const readlineSync = __importStar(require("readline-sync"));
const promptForConfig = () => {
    console.log('\n=== Blockchain Configuration ===\n');
    const rpcInput = readlineSync.question('Enter RPC Endpoint (Press enter to use default value): ');
    const restInput = readlineSync.question('Enter REST Endpoint (Press enter to use default value): ');
    const namespaceInput = readlineSync.question('Enter Namespace (Press enter to use default value): ');
    const mnemonicInput = readlineSync.question('Enter Wallet Mnemonic (Press enter to use default value): ', {
        hideEchoBack: true,
    });
    const rpcEndpoint = rpcInput || process.env.RPC_ENDPOINT || 'https://rpc.atman.hypersign.id';
    const restEndpoint = restInput || process.env.REST_ENDPOINT || 'https://api.atman.hypersign.id';
    const namespace = namespaceInput || process.env.NAMESPACE || '';
    const mnemonic = mnemonicInput ||
        process.env.MNEMONIC ||
        // 'verify sustain lumber boat demise parade special soft bargain scout spoil there addict move badge rebuild horn achieve hollow acquire glide bundle curious present';
        'cream lyrics abandon coach outside again paper admit until bean kingdom local ball practice bread degree input milk pretty put margin recall candy reflect';
    console.log('\n=== Configuration Summary ===');
    console.log(`RPC Endpoint: ${rpcEndpoint}`);
    console.log(`REST Endpoint: ${restEndpoint}`);
    console.log(`Namespace: ${namespace}`);
    console.log(`Mnemonic: ${mnemonic ? '****** (set)' : 'not set'}`);
    console.log('');
    return { rpc: rpcEndpoint, rest: restEndpoint, namespace, mnemonic };
};
exports.promptForConfig = promptForConfig;
const setEnvFromPrompt = () => {
    const cfg = (0, exports.promptForConfig)();
    process.env.RPC_ENDPOINT = cfg.rpc;
    process.env.REST_ENDPOINT = cfg.rest;
    process.env.NAMESPACE = cfg.namespace;
    process.env.MNEMONIC = cfg.mnemonic;
};
exports.setEnvFromPrompt = setEnvFromPrompt;
// Only run prompt if this file is executed directly
if (require.main === module) {
    (0, exports.setEnvFromPrompt)();
}
