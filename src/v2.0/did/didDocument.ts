import { IDidDocument, IVerificationMethod, IService, IDIDDocumentService  } from "./types";
import { IVerificationRelationship } from './types';
import BaseDIDDocument from "./BaseDIDDocument";


export default class DIDDocument extends BaseDIDDocument  implements IDIDDocumentService{
    constructor(verificationMethods: Array<IVerificationMethod>,
      verificationRelationships: Array<IVerificationRelationship>,
      id: string,
      controller: Array<string>,
      alsoKnownAs?: string[],
      services?: Array<IService>,){
      super(verificationMethods,
        verificationRelationships,
        id,
        controller,
        alsoKnownAs,
        services)
    }
    addVerificationMethod(verificationMethod: IVerificationMethod) {
      // todo
      this.verificationMethod.push(verificationMethod);
    }

    removeVerificationMethod(verificationMethodId: string) { throw new Error('Not implemented'); }

    addService(service: IService) {
      throw new Error('Not implemented');
    }

    removeService(serviceId: string) {
      throw new Error('Not implemented');
    }

    getDIDDocument(): IDidDocument {
      return {
        '@context': this['@context'],
        id: this.id,
        controller: this.controller,
        alsoKnownAs: this.alsoKnownAs,
        verificationMethod: this.verificationMethod,
        authentication: this.authentication,
        assertionMethod: this.assertionMethod,
        keyAgreement: this.keyAgreement,
        capabilityDelegation: this.capabilityDelegation,
        capabilityInvocation: this.capabilityInvocation,
        service: this.service
      } 
    }

    toString(): string{
      return JSON.stringify(this.getDIDDocument(), null, 2)
    }
}

