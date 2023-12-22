import { DeliverTxResponse } from "@cosmjs/stargate";
import { CredentialSchemaDocument as SchemaDocument } from "../../../../libs/generated/ssi/credential_schema";
import { DocumentProof as SchemaProof } from '../../../../libs/generated/ssi/proof';
export interface IRegisterSchema {
    schemaDocument: SchemaDocument;
    schemaProof: SchemaProof;
}
export interface ISchemaService {
    auth(): void;
    registerSchema(params: IRegisterSchema): Promise<Pick<DeliverTxResponse, 'transactionHash'>>;
}
//# sourceMappingURL=ISchemaApi.d.ts.map