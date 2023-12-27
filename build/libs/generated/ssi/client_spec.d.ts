export declare const protobufPackage = "hypersign.ssi.v1";
export declare enum ClientSpecType {
    CLIENT_SPEC_TYPE_NONE = "CLIENT_SPEC_TYPE_NONE",
    CLIENT_SPEC_TYPE_COSMOS_ADR036 = "CLIENT_SPEC_TYPE_COSMOS_ADR036",
    CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN = "CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN"
}
export declare function clientSpecTypeFromJSON(object: any): ClientSpecType;
export declare function clientSpecTypeToJSON(object: ClientSpecType): string;
export declare function clientSpecTypeToNumber(object: ClientSpecType): number;
//# sourceMappingURL=client_spec.d.ts.map