import { expect, should } from 'chai';
import { HypersignDID } from '../../index';
import Web3 from 'web3';
import crypto from 'crypto';
import { HDNodeWallet, Mnemonic, Wallet } from 'ethers';
import { createWallet, mnemonic, hidNodeEp } from '../config';
import * as bip39 from 'bip39';

let hypersignDID;
let MMWalletAddress;
let MMPrivateKey;
let MMPublicKey;
let offlineSigner;
let didDocumentByClientspec;
const metamaskProvider = 'https://linea-goerli.infura.io/v3/6014efc44d9346bcb69d99d97aa0ad27';

beforeEach(async function () {
    offlineSigner = await createWallet(mnemonic)
    const params = {
        offlineSigner,
        nodeRestEndpoint: hidNodeEp.rest,
        nodeRpcEndpoint: hidNodeEp.rpc,
        namespace: hidNodeEp.namespace,
    };
    hypersignDID = new HypersignDID(params);
    await hypersignDID.init();
})
async function generateSignature() {
    const mnemonic = await bip39.generateMnemonic(256, crypto.randomBytes);
    const Mnemonics = await Mnemonic.fromPhrase(mnemonic);
    const wallet = await HDNodeWallet.fromMnemonic(Mnemonics, `m/44'/60'/0'/0/${0}`);
    const web3 = new Web3();
    const account = await web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
    MMWalletAddress = account.address;
    MMPrivateKey = wallet.privateKey;
    MMPublicKey = wallet.publicKey;
}
describe('DID Test scenarion for clientSpec', () => {

    describe('#createByClientSpec() this is to generate did using clientSpec', function () {

        const param = {
            methodSpecificId: "xyz",
            address: "xyz",
            chainId: '0x1',
            clientSpec: 'eth-personalSign',
        };
        it('should not be able to create did using clientSpec as methodSpecificId is null or empty', async () => {
            const tempParams = { ...param };
            tempParams.methodSpecificId = '';
            const params = tempParams;
            return hypersignDID.createByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.methodSpecificId is required to create didoc');
            });
        });
        it('Should not be able to create did using clientSpec as address is null or empty', async () => {
            const tempParams = { ...param };
            tempParams.address = '';
            const params = tempParams;
            return hypersignDID.createByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.address is required to create didoc');
            });
        });
        it('should not be able to create did using clientSpec as chainId is null or empty', async () => {
            const tempParams = { ...param };
            tempParams.chainId = '';
            const params = tempParams;
            return hypersignDID.createByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.chainId is required to create didoc');
            });
        });
        it('should not be able to create did using clientSpec as clientSpec is null or empty', async () => {
            const tempParams = { ...param };
            tempParams.clientSpec = '';
            const params = tempParams;

            return hypersignDID.createByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is required to create didoc');
            });
        });
        it('should not be able to create did using clientSpec as clientSpec passed is invalid', async () => {
            const tempParams = { ...param };
            tempParams.clientSpec = 'xyz';
            const params = tempParams;

            return hypersignDID.createByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is invalid');
            });
        });
        it('should not be able to create did using clientSpec as clientSpec is of type "cosmos-ADR036" but publicKey is not passed ', async () => {
            const tempParams = { ...param };
            tempParams.clientSpec = 'cosmos-ADR036';
            const params = tempParams;

            return hypersignDID.createByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(
                    Error,
                    'HID-SSI-SDK:: Error: params.publicKey is required to create didoc for EcdsaSecp256k1VerificationKey2019'
                );
            });
        });
        it('should not be able to create did using clientSpec as clientSpec is of type "cosmos-ADR036" and invalid public key is passed', async () => {
            const tempParams = { ...param };
            tempParams.clientSpec = 'cosmos-ADR036';
            tempParams['publicKey'] = 'xyzt';
            const params = tempParams;

            return hypersignDID.createByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(
                    Error,
                    'HID-SSI-SDK:: Error: params.publicKey mustbe multibase encoded base58 string for EcdsaSecp256k1VerificationKey2019'
                );
            });
        });
        it('should be able to create did using clientSpec', async () => {
            await generateSignature()
            const tempParams = { ...param };
            tempParams.address = MMWalletAddress
            tempParams.methodSpecificId = MMWalletAddress
            const params = tempParams;
            didDocumentByClientspec = await hypersignDID.createByClientSpec(params);
            expect(didDocumentByClientspec).to.be.a('object');
            should().exist(didDocumentByClientspec['@context']);
            should().exist(didDocumentByClientspec['id']);
            should().exist(didDocumentByClientspec['controller']);
            should().exist(didDocumentByClientspec['alsoKnownAs']);
            should().exist(didDocumentByClientspec['verificationMethod']);
            expect(
                didDocumentByClientspec['verificationMethod'] &&
                didDocumentByClientspec['authentication'] &&
                didDocumentByClientspec['assertionMethod'] &&
                didDocumentByClientspec['keyAgreement'] &&
                didDocumentByClientspec['capabilityInvocation'] &&
                didDocumentByClientspec['capabilityDelegation']
            ).to.be.a('array');
            should().exist(didDocumentByClientspec['authentication']);
            should().exist(didDocumentByClientspec['assertionMethod']);
            should().exist(didDocumentByClientspec['keyAgreement']);
            should().exist(didDocumentByClientspec['capabilityInvocation']);
            should().exist(didDocumentByClientspec['capabilityDelegation']);
        });
    });

    describe('#signByClientSpec() this is to generate signature of the didDoc', function () {
        it('should not be able to generate signature as didDocument is not passed', async () => {
            const params = {
                didDocument: null
            }
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to sign')
            })
        })

        it('should not be able to generate signature as address is not passed', async () => {
            const params = {
                didDocument: didDocumentByClientspec
            }
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.address is required to sign a did')
            })
        })

        it('should not be able to generate signature as clientSpec is not passed', async () => {
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress
            }
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is required to sign')
            })
        })

        it('should not be able to generate signature as clientSpec passed is invalid', async () => {
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
                clientSpec: "xyz"
            }
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.clientSpec is invalid')
            })
        })
        it('should not be able to generate signature as web3 object is required but not passed', async () => {
            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
                clientSpec: "eth-personalSign"
            }
            return hypersignDID.signByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.web3 is required to sign')
            })
        })
        it('should not be able to generate signature as clientSpec passed is of type "cosmos-ADR036" but chainId is not passed', async () => {
            const web3 = new Web3(metamaskProvider)

            const params = {
                didDocument: didDocumentByClientspec,
                address: MMWalletAddress,
                web3,
                clientSpec: "cosmos-ADR036"
            }

            return hypersignDID.signByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error:  params.chainId is required to sign for clientSpec ${params.clientSpec} and keyType EcdsaSecp256k1VerificationKey2019`)
            })
        })
        // it('Should be able to generate signature for didDoc', async()=>{
        //   const web3= new Web3(metamaskProvider)
        //   console.log(web3.eth.personal.sign)
        //   const params={
        //     didDocument:didDocumentByClientspec,
        //     address:MMWalletAddress,
        //     clientSpec:"eth-personalSign",
        //     web3:web3
        //   }
        //   const signedDidDocByClientSpec= await hypersignDID.signByClientSpec(params)
        //   console.log(signedDidDocByClientSpec)

        //   // error Cannot read properties of undefined (reading 'eth')
        // })
    })

    describe("#registerByClientSpec() this is to register did generated using clientspec on the blockchain", function () {
        const signInfo = [{
            verification_method_id: "",
            clientSpec: undefined,
            signature: "rrnenf"
        }]
        const param = {
            didDocument: didDocumentByClientspec,
            signInfos: signInfo
        }
        it('should not be able to register did using registerByClientSpec() as didDocument is not passed', async () => {
            const tempParams = { ...param }
            tempParams.didDocument = {}
            const params = tempParams
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: params.didDocString is required to register a did")
            })
        })


        it('should not be able to register did using registerByClientSpec() as signInfos is not passed', async () => {
            const params = {
                didDocument: didDocumentByClientspec
            }
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: params.signInfos is required to register a did")
            })
        })
        it('should not be able to register did using registerByClientSpec() as signInfos is an empty array', async () => {
            const tempParams = { ...param }
            tempParams.didDocument = didDocumentByClientspec
            tempParams.signInfos = []
            const params = tempParams
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array')
            })
        })
        it('should not be able to register did using registerByClientSpec() as clientSpec passed in signInfo parameter is not valid', async () => {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: { type: 'xyz' },
                },
            ];
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo,
            };
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`);
            });
        });
        it('should not be able to register did using registerByClientSpec() as hypersign is not initialised with offlinesigner', async () => {
            const hypersignDid = new HypersignDID({
                nodeRestEndpoint: hidNodeEp.rest,
                nodeRpcEndpoint: hidNodeEp.rpc,
                namespace: hidNodeEp.namespace,
            });
            await hypersignDid.init().catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: DIDRpc class is not initialise with offlinesigner")
            })
        })
        it('should not be able to register did using registerByClientSpec() as verificationMethodId is not passed in signInfo parameter', async () => {
            const tempParams = { ...param }
            tempParams.didDocument = didDocumentByClientspec
            tempParams.signInfos = signInfo
            const params = tempParams
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error,
                    `HID-SSI-SDK:: Error: params.signInfos[${0}].verification_method_id is required to register a did`)

            })
        })
        it('should not be able to register did using registerByClientSpec() as signature is not passed in signInfo parameter', async () => {
            const signInfo = [
                {
                    verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                    clientSpec: {},
                }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.registerByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error,
                    `HID-SSI-SDK:: Error: params.signInfos[${0}].signature is required to register a did`)
            })
        })
        // it('should be able to register did using registerByClientSpec()', async () => {
        //     const privateKey = MMPrivateKey
        //     const wallet = new Wallet(privateKey)
        //     const signature = await wallet.signMessage(JSON.stringify(didDocumentByClientspec))
        //     const signInfo = [
        //         {
        //             verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
        //             clientSpec: { type: 'eth-personalSign' },
        //             signature: signature
        //         }]
        //     const params = {
        //         didDocument: didDocumentByClientspec,
        //         signInfos: signInfo
        //     }
        //     const registerdDidDoc = await hypersignDID.registerByClientSpec(params)
        //     // console.log(registerdDidDoc)
        // })
    })
    describe('#signAndRegisterByClientSpec() this is to sign and register did using clientspec on the blockchain', function () {
        it('should not able to sign and register did as didDocument is not passed', async () => {
            const params = {
                didDocument: null
            }
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocString is required to register a did')
            })
        })
        it('should not be able to sign and register did as clientSpec is not passed', async () => {
            const params = {
                didDocument: didDocumentByClientspec,
            }
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error:  params.clientSpec is required to sign")
            })
        })

        it('should not be able to sign and register did as clientspec passed is invalid', async () => {
            const params = {
                didDocument: didDocumentByClientspec,
                clientSpec: "xyz"
            }
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: invalid clientSpec")
            })
        })

        it('should not be able to sign and register did as verificationMethodId is not passed', async () => {
            const params = {
                didDocument: didDocumentByClientspec,
                clientSpec: "eth-personalSign"
            }
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did')
            })
        })

        it('should not be able to sign and register did as web3 is not passed', async () => {
            const params = {
                didDocument: didDocumentByClientspec,
                clientSpec: "eth-personalSign",
                verificationMethodId: didDocumentByClientspec.verificationMethod[0].id
            }
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.web should be passed')
            })
        })

        it('should not be able to sign and register did as address is not passed', async () => {
            const web3 = new Web3(metamaskProvider)
            const params = {
                didDocument: didDocumentByClientspec,
                clientSpec: "eth-personalSign",
                verificationMethodId: didDocumentByClientspec.verificationMethod[0].id,
                web3: web3
            }
            return hypersignDID.signAndRegisterByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, "HID-SSI-SDK:: Error: params.address is required to sign a did")
            })
        })
        // it('should be able to sign and register did', async ()=>{
        //   const web3= new Web3(metamaskProvider)
        //   const params={
        //     didDocument:didDocumentByClientspec,
        //     clientSpec:"eth-personalSign",
        //     verificationMethodId:didDocumentByClientspec.verificationMethod[0].id,
        //     web3:web3,
        //     address:MMWalletAddress
        //   }
        //   const regDId= await hypersignDID.signAndRegisterByClientSpec(params)
        //   console.log(regDId)
        // Error: Returned error: The method personal_sign does not exist/is not available
        //})
    })
    describe('#updateByClientSpec() this is for updating didDocument', function () {
        it('should not be able to updateDid as didDocument is not passed', async () => {
            const params = {
                didDocument: null
            }
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to update a did')
            })
        })
        it('should not be able to updateDid as signInfos is not passed', async () => {
            const params = {
                didDocument: didDocumentByClientspec
            }
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos is required to register a did')
            })
        })
        it('should not be able to updateDid as signInfos passed is an empty array', async () => {
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: []
            }
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array')
            })
        })

        it('should not be able to updateDid as verificationMethod is not passed inside signInfos', async () => {
            const signInfo = [{
                verification_method_id: "",
                clientSpec: "xyz",
                signature: "rrnenf"
            }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].verification_method_id is required to register a did`)
            })
        })
        it('should not be able to updateDid as invalid clientSpec is passed inside signInfos', async () => {
            const signInfo = [{
                verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                clientSpec: { type: "xyz" }
            }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`)
            })
        })
        it('should not be able to updateDid as signature is not passed inside signInfos', async () => {
            const signInfo = [{
                verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                clientSpec: { type: "eth-personalSign" },
            }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].signature is required to register a did`)
            })
        })

        it('should not be able to updateDid as clientSpec is of type "cosmos-ADR036" and adr036SignerAddress is not passed inside signInfos', async () => {
            const signInfo = [{
                verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                clientSpec: { type: "cosmos-ADR036" },
            }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error,
                    `HID-SSI-SDK:: Error: params.signInfos[${0}].adr036SignerAddress is required to register a did, when clientSpec type is${params.signInfos[0].clientSpec?.type} `
                )
            })
        })

        it('should not be able to updateDid as versionId is not passed', async () => {
            const signInfo = [{
                verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                clientSpec: { type: "eth-personalSign" },
                signature: "xyz"
            }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.updateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error,
                    'HID-SSI-SDK:: Error: params.versionId is required to update a did'
                )
            })
        })
    })
    describe('#deactivateByClientSpec() this is for deactivating didDocument', function () {
        it('should not be able to deactivate did as didDocument is not passed', async () => {
            const params = {
                didDocument: null
            }
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did')
            })
        })
        it('should not be able to deactivate did as signInfos is not passed', async () => {
            const params = {
                didDocument: didDocumentByClientspec
            }
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos is required to deactivate a did')
            })
        })
        it('should not be able to deactivate did as signInfos passed is an empty array', async () => {
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: []
            }
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, 'HID-SSI-SDK:: Error: params.signInfos must be a non empty array')
            })
        })

        it('should not be able to deactivate did as verificationMethod is not passed inside signInfos', async () => {
            const signInfo = [{
                verification_method_id: "",
                clientSpec: "xyz",
                signature: "rrnenf"
            }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].verification_method_id is required to deactivate a did`)
            })
        })
        it('should not be able to deactivate did as invalid clientSpec is passed inside signInfos', async () => {
            const signInfo = [{
                verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                clientSpec: { type: "xyz" },
            }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].clientSpec is invalid`)
            })
        })
        it('should not be able to deactivate did as signature is not passed inside signInfos', async () => {
            const signInfo = [{
                verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                clientSpec: "xyz",
            }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error, `HID-SSI-SDK:: Error: params.signInfos[${0}].signature is required to deactivate a did`)
            })
        })
        it('should not be able to deactivate did as clientSpec is of type "cosmos-ADR036" and adr036SignerAddress is not passed inside signInfos', async () => {
            const signInfo = [{
                verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                clientSpec: { type: "cosmos-ADR036" },
            }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error,
                    `HID-SSI-SDK:: Error: params.signInfos[${0}].adr036SignerAddress is required to deactivate a did, when clientSpec type is${params.signInfos[0].clientSpec?.type} `
                )
            })
        })
        it('should not be able to deactivate did as versionId is not passed', async () => {
            const signInfo = [{
                verification_method_id: didDocumentByClientspec.verificationMethod[0].id,
                clientSpec: { type: "eth-personalSign" },
                signature: "xyz"
            }]
            const params = {
                didDocument: didDocumentByClientspec,
                signInfos: signInfo
            }
            return hypersignDID.deactivateByClientSpec(params).catch(function (err) {
                expect(function () {
                    throw err;
                }).to.throw(Error,
                    'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did'
                )
            })
        })
    })
});
