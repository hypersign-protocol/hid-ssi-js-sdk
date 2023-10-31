/* eslint-disable */

export const protobufPackage = "hypersign.ssi.v1";

export enum ClientSpecType {
  CLIENT_SPEC_TYPE_NONE = "CLIENT_SPEC_TYPE_NONE",
  CLIENT_SPEC_TYPE_COSMOS_ADR036 = "CLIENT_SPEC_TYPE_COSMOS_ADR036",
  CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN = "CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN",
}

export function clientSpecTypeFromJSON(object: any): ClientSpecType {
  switch (object) {
    case 0:
    case "CLIENT_SPEC_TYPE_NONE":
      return ClientSpecType.CLIENT_SPEC_TYPE_NONE;
    case 1:
    case "CLIENT_SPEC_TYPE_COSMOS_ADR036":
      return ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036;
    case 2:
    case "CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN":
      return ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ClientSpecType");
  }
}

export function clientSpecTypeToJSON(object: ClientSpecType): string {
  switch (object) {
    case ClientSpecType.CLIENT_SPEC_TYPE_NONE:
      return "CLIENT_SPEC_TYPE_NONE";
    case ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036:
      return "CLIENT_SPEC_TYPE_COSMOS_ADR036";
    case ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN:
      return "CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ClientSpecType");
  }
}

export function clientSpecTypeToNumber(object: ClientSpecType): number {
  switch (object) {
    case ClientSpecType.CLIENT_SPEC_TYPE_NONE:
      return 0;
    case ClientSpecType.CLIENT_SPEC_TYPE_COSMOS_ADR036:
      return 1;
    case ClientSpecType.CLIENT_SPEC_TYPE_ETH_PERSONAL_SIGN:
      return 2;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ClientSpecType");
  }
}
