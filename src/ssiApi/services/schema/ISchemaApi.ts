import { DeliverTxResponse } from "@cosmjs/stargate";
import { SchemaDocument, SchemaProof } from "../../../../libs/generated/ssi/schema";

export interface IRegisterSchema {
    schemaDocument: SchemaDocument,
    schemaProof: SchemaProof
}

export interface ISchemaService {
    auth(): void,
    registerSchema(params: IRegisterSchema): Promise<Pick<DeliverTxResponse, 'transactionHash'>>
}

