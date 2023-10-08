
import { IDidDocument, IVerificationMethod, IService  } from "./types";
import { IVerificationRelationship } from './types';
import * as constant from '../../constants';

export default abstract class BaseDIDDocument implements IDidDocument {
    '@context': string[];
    #id: string;
    #controller: string[];
    #alsoKnownAs: string[];
    #verificationMethod: IVerificationMethod[];
    #authentication: string[];
    #assertionMethod: string[];
    #keyAgreement: string[];
    #capabilityInvocation: string[];
    #capabilityDelegation: string[];
    #service: IService[];
    constructor(
      verificationMethods: Array<IVerificationMethod>,
      verificationRelationships: Array<IVerificationRelationship>,
      id: string,
      controller: Array<string>,
      alsoKnownAs?: string[],
      services?: Array<IService>,
    ) {
      this["@context"] = [constant.DID.DID_BASE_CONTEXT];
      this.#id = id;
      this.#controller = controller 
      this.#alsoKnownAs = alsoKnownAs || []; //todo
      this.#verificationMethod = verificationMethods;
      this.#authentication = [this.#verificationMethod[0].id];
      this.#assertionMethod = [];
      this.#keyAgreement = [];
      this.#capabilityInvocation = [];
      this.#capabilityDelegation = [];
      this.#service = services || []; 
      
      // Todo : fix this hardcoing...
      verificationRelationships?.forEach((verificationRelationsShip: IVerificationRelationship) => {
        this['#'+verificationRelationsShip] = [this.#verificationMethod[0].id];
      });
    }
    
    get id() {
      return this.#id
    }

    get controller() {
      return this.#controller
    }

    get service() {
      return this.#service
    }

    get verificationMethod() {
      return this.#verificationMethod
    }

    get alsoKnownAs() {
      return this.#alsoKnownAs
    }

    get authentication() {
      return this.#authentication
    }

    get keyAgreement() {
      return this.#keyAgreement
    }

    get capabilityDelegation() {
      return this.#capabilityDelegation
    }

    get capabilityInvocation() {
      return this.#capabilityInvocation
    }

    get assertionMethod() {
      return this.#assertionMethod
    }

    // protected set verificationMethod(verificationMethods: Array<IVerificationMethod>){
    //   this.#verificationMethod = verificationMethods;
    // }
}
