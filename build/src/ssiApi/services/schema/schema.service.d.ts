import { IRegisterSchema, ISchemaService } from "./ISchemaApi";
export default class SchemaApiService implements ISchemaService {
    private authService;
    private accessToken;
    constructor(apiKey: string);
    auth(): Promise<void>;
    /**
     * Register schema on blockchain
     * @param
     * - params.SchemaDocument    :Schema document to be registered on blockchain
     * - params.SchemaProof       :Proof of schema document
     * @return {Promise<{transactionHash: string}>}
     */
    registerSchema(params: IRegisterSchema): Promise<{
        transactionHash: string;
    }>;
}
//# sourceMappingURL=schema.service.d.ts.map