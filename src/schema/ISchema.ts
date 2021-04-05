export interface ISchema {
    id?: string;
    modelVersion?: string;
    author: string;
    name: string;
    description: string;
    properties: any;
    additionalProperties: boolean;
}
export interface ISchemaTemplateSchema{
    $schema?: string;
    description: string;
    type?: string;
    properties: any;
    required?: Array<string>;
    additionalProperties: boolean
}

export interface ISchemaTemplate {
    type: string;
    modelVersion: string;
    id: string;
    name: string;
    author: string;
    authored: string;
    schema: ISchemaTemplateSchema
}