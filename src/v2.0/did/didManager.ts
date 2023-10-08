import { IDidDocument, ISignedDIDDocument, IDidManager , DeliverTxResponse , IDidDocumentJs} from './types';
import { SignInfo } from '../../../libs/generated/ssi/did';
import { BaseSigner } from '../signers/types';
import DidDocumentMessage from '../signers/messages/DidDocumentMessage';
import BaseSignInfo from './BaseSignInfo';
import DIDRpc from './DIDRpc';
import { OfflineSigner } from '@cosmjs/proto-signing';
import assert from 'node:assert'

type registerResponseType = { didDocument: IDidDocument; transactionHash: string }

export default class DIDManager {
    readonly #didRPC: DIDRpc | null = null;
    readonly #namespace: string;
    constructor(params: {
        namespace?: string;
        offlineSigner?: OfflineSigner;
        nodeRpcEndpoint?: string;
        nodeRestEndpoint?: string;
    }){
        const { offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, namespace } = params;
        const nodeRPCEp = nodeRpcEndpoint ? nodeRpcEndpoint : 'MAIN';
        const nodeRestEp = nodeRestEndpoint ? nodeRestEndpoint : '';
        const rpcConstructorParams = {
            offlineSigner,
            nodeRpcEndpoint: nodeRPCEp,
            nodeRestEndpoint:  nodeRestEp,
        }

        if(offlineSigner){
            this.#didRPC = new DIDRpc(rpcConstructorParams);
        }

        this.#namespace = namespace ? namespace : '';
    }

    public async init() {
        assert(this.#didRPC != null, 'didRpc is null, this clas is not instantiated with offlinesigner null');
        if (this.#didRPC) {
          await this.#didRPC.init();
        }
    }

    async sign(params: {
        didDocument: IDidDocument;
        signer: BaseSigner
    }): Promise<ISignedDIDDocument>{
        const { signer , didDocument}    = params;
        const didDocMessage  = new DidDocumentMessage(didDocument)
        const proof = await signer.ldSign(didDocMessage, 'AssertionProofPurpose')
        return proof;
    }

    async register(params: {
        signedDidDocument: ISignedDIDDocument; 
    }): Promise<registerResponseType> {
        const  { signedDidDocument } = params
        const res:registerResponseType  = {} as registerResponseType

        // Create signInfo Object 
        // TODO: We need to prepare SignInfo for each clientSpecs 
        const signInfo: Array<SignInfo> = [];
        const baseSignInfo = new BaseSignInfo(signedDidDocument.proof.verificationMethod, signedDidDocument.proof.proofValue)
        
        signInfo.push(baseSignInfo.getSignInfo())
        console.log(signInfo)
        // Register through RPC
        // TOOD: Need to know from arnab, looks like a bad way to convert ld-json to json
        const didDocumentJs: IDidDocumentJs = {
            context: signedDidDocument['@context'],
            ...signedDidDocument
        } 
        assert(this.#didRPC != null, 'didRpc is null, this clas is not instantiated with offlinesigner null');
        const result = await this.#didRPC.registerDID(didDocumentJs, signInfo);
        
        
        // Register through API 
        // TODO
        
        res.didDocument = signedDidDocument  as IDidDocument;
        res.transactionHash = result.transactionHash;

        return res;
    } 
}






