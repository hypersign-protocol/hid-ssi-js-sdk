import HypersignDID from '../did/did';
import { expect, should } from 'chai';
import { IPublicKey, IController } from '../did/IDID';
const hypersignDid = new HypersignDID();
const seed = '';
let privateKeyMultibase;
let publicKeyMultibase;
let verificationMethodId;
let didDocument;
let didDocId;
let signedDocument;
const challenge = '1231231231';
const domain = 'www.adbv.com';

describe('#generateKeys() method to generate publicKyeMultibase and privateKeyMultiBase', function () {
  it('should return publickeyMultibase and privateKeyMultibase', async function () {
    const result = await hypersignDid.generateKeys({ seed });
    privateKeyMultibase = result.privateKeyMultibase;
    publicKeyMultibase = result.publicKeyMultibase;
    expect(result).to.be.a('object');
    should().exist(result.privateKeyMultibase);
    should().exist(result.publicKeyMultibase);
  });
});
describe('#generate() method to generate did document', function () {
  it('should not able to generate did document and throw error as publickKeyMultibase is not passed or it is empty', function () {
    return hypersignDid.generate({ publicKeyMultibase: '' }).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.publicKeyMultibase is required to generate new did didoc');
    });
  });
  it('should return didDocument', async function () {
    didDocument = await hypersignDid.generate({ publicKeyMultibase });
    didDocId = didDocument['id'];
    verificationMethodId = didDocument['verificationMethod'][0].id;
    expect(didDocument).to.be.a('object');
    should().exist(didDocument['@context']);
    should().exist(didDocument['id']);
    should().exist(didDocument['controller']);
    should().exist(didDocument['alsoKnownAs']);

    should().exist(didDocument['verificationMethod']);
    expect(
      didDocument['verificationMethod'] &&
        didDocument['authentication'] &&
        didDocument['assertionMethod'] &&
        didDocument['keyAgreement'] &&
        didDocument['capabilityInvocation'] &&
        didDocument['capabilityDelegation'] &&
        didDocument['service']
    ).to.be.a('array');
    should().exist(didDocument['authentication']);
    should().exist(didDocument['assertionMethod']);
    should().exist(didDocument['keyAgreement']);
    should().exist(didDocument['capabilityInvocation']);
    should().exist(didDocument['capabilityDelegation']);
    should().exist(didDocument['service']);
  });
});
describe('#sign() this is to sign didDoc', function () {
  const publicKey: IPublicKey = {
    '@context': '',
    id: '',
    type: '',
    publicKeyBase58: '',
  };
  const controller: IController = {
    '@context': '',
    id: '',
    authentication: [],
  };

  it('should not able to sign did document and throw error as privateKey is not passed or it is empty', function () {
    const params = {
      privateKey: privateKeyMultibase as string,
      challenge: challenge as string,
      domain: domain as string,
      did: didDocId,
      doc: didDocument as object,
      verificationMethodId: verificationMethodId as string,
      publicKey,
      controller,
    };
    params.privateKey = '';
    return hypersignDid.signDid(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKey is required to sign a did');
    });
  });
  it('should not able to sign did document and throw error as challenge is not passed or it is empty', function () {
    const params = {
      privateKey: privateKeyMultibase as string,
      challenge: challenge as string,
      domain: domain as string,
      did: didDocId,
      doc: didDocument as object,
      verificationMethodId: verificationMethodId as string,
      publicKey,
      controller,
    };
    params.challenge = '';
    return hypersignDid.signDid(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.challenge is required to sign a did');
    });
  });
  it('should not able to sign did document and throw error as domain is not passed or it is empty', function () {
    const params = {
      privateKey: privateKeyMultibase as string,
      challenge: challenge as string,
      domain: domain as string,
      did: didDocId,
      doc: didDocument as object,
      verificationMethodId: verificationMethodId as string,
      publicKey,
      controller,
    };
    params.domain = '';
    return hypersignDid.signDid(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.domain is required to sign a did');
    });
  });
  it('should not able to sign did document and throw error as did is not resolved', function () {
    const params = {
      privateKey: privateKeyMultibase as string,
      challenge: challenge as string,
      domain: domain as string,
      did: didDocId as string,
      doc: didDocument as object,
      verificationMethodId: verificationMethodId as string,
      publicKey,
      controller,
    };
    return hypersignDid.signDid(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a public did');
    });
  });
  // it('should not able to sign did document and throw error as neither did nor doc is passed', function () {
  //   const params = {
  //     privateKey: privateKeyMultibase as string,
  //     challenge: challenge as string,
  //     domain: domain as string,
  //     did: didDocId as string,
  //     doc: didDocId,
  //     verificationMethodId: verificationMethodId as string,
  //     publicKey,
  //     controller,
  //   };
  //   params.did = '';
  //   return hypersignDid.signDid(params).catch(function (err) {
  //     expect(function () {
  //       throw err;
  //     }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did or params.doc is required to sign a did');
  //   });
  // });
  it('should able to sign did document', async function () {
    const params = {
      privateKey: privateKeyMultibase as string,
      challenge: challenge as string,
      domain: domain as string,
      did: '',
      doc: didDocument as object,
      verificationMethodId: verificationMethodId as string,
      publicKey,
      controller,
    };
    signedDocument = await hypersignDid.signDid(params);
    expect(signedDocument).to.be.a('object');
    signedDocument = signedDocument.signedDidDocument;
    should().exist(signedDocument['@context']);
    should().exist(signedDocument['id']);
    expect(didDocId).to.be.equal(signedDocument['id']);
    should().exist(signedDocument['controller']);
    should().exist(signedDocument['alsoKnownAs']);
    should().exist(signedDocument['verificationMethod']);
    should().exist(signedDocument['authentication']);
    should().exist(signedDocument['assertionMethod']);
    should().exist(signedDocument['keyAgreement']);
    should().exist(signedDocument['capabilityInvocation']);
    should().exist(signedDocument['capabilityDelegation']);
    should().exist(signedDocument['service']);
    should().exist(signedDocument['proof']);
  });
});
describe('#verify() method to verify did document', function () {
  it('should not able to verify did document and throw error as verificationMethodId is not passed or it is empty', function () {
    return hypersignDid
      .verify({ doc: signedDocument, verificationMethodId: '', challenge, domain })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to verify a did');
      });
  });
  it('should not able to verify did document and throw error as challenge is not passed or it is empty', function () {
    return hypersignDid
      .verify({ doc: signedDocument, verificationMethodId, challenge: '', domain })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.challenge is required to verify a did');
      });
  });

  it('should return verification result', async function () {
    const result = await hypersignDid.verify({
      doc: signedDocument,
      verificationMethodId,
      challenge,
      domain,
    });
    expect(result).to.be.a('object');
    should().exist(result.verificationResult);
    should().exist(result.verificationResult.verified);
    should().exist(result.verificationResult.results);
    expect(result.verificationResult.results).to.be.a('array');
    expect(result.verificationResult.verified).to.equal(true);
  });
});

describe('#register() this is to register didDoc on blockchain', function () {
  // it('should not be able to register did document on blockchain as didDocument is null or empty', function () {
  //   return hypersignDid.register({ didDocument: {}, privateKeyMultibase, verificationMethodId }).catch(function (err) {
  //     expect(function () {
  //       throw err;
  //     }).to.throw(Error, 'HID-SSI-SDK:: Error:  params.didDocString is required to register a did');
  //   });
  // });
  it('should not be able to register did document on blockchain as privateKeyMultibase is null or empty', function () {
    return hypersignDid
      .register({ didDocument: signedDocument, privateKeyMultibase: '', verificationMethodId })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to register a did');
      });
  });
  it('should not be able to register did document on blockchain as verificationMethodId is null or empty', function () {
    return hypersignDid
      .register({ didDocument: signedDocument, privateKeyMultibase, verificationMethodId: '' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to register a did');
      });
  });
  it("should not be able to register did document on blockchain as  wallet has no balance and  hidClient can't be initialized", function () {
    return hypersignDid
      .register({ didDocument: signedDocument, privateKeyMultibase, verificationMethodId })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, "Cannot read property 'signAndBroadcast' of undefined");
      });
  });
});

describe('#resolve() this is to resolve didDoc', function () {
  it('should not be able to resolve didDocument as did is not passed or it is empty', function () {
    const params = {
      did: '',
    };
    return hypersignDid.resolve(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'HID-SSI-SDK:: Error: params.did is required to resolve a did');
    });
  });
  it("should not be able to resolve did document on blockchain as hidClient can't be initialized", function () {
    const params = { did: didDocId };
    return hypersignDid.resolve(params).catch(function (err) {
      expect(function () {
        throw err;
      }).to.throw(Error, 'connect ECONNREFUSED 127.0.0.1:80');
    });
  });
});

describe('#update() this is to update didDoc', function () {
  // it('should not be able to update did document as didDocument is null or empty', function () {
  //   return hypersignDid
  //     .update({ didDocument: {}, privateKeyMultibase, verificationMethodId, versionId: '1.0' })
  //     .catch(function (err) {
  //       expect(function () {
  //         throw err;
  //       }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to update a did');
  //     });
  // });
  it('should not be able to update did document as privateKeyMultibase is null or empty', function () {
    return hypersignDid
      .update({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to update a did');
      });
  });
  it('should not be able to update did document as verificationMethodId is null or empty', function () {
    return hypersignDid
      .update({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to update a did');
      });
  });
  it('should not be able to update did document as versionId is null or empty', function () {
    return hypersignDid
      .update({ didDocument, privateKeyMultibase, verificationMethodId, versionId: '' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to update a did');
      });
  });
  it("should not be able to update did document on hidClient can't be initialized", function () {
    return hypersignDid
      .update({ didDocument: didDocument, privateKeyMultibase, verificationMethodId, versionId: '1.0' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, "Cannot read property 'signAndBroadcast' of undefined");
      });
  });
});

describe('#deactivate() this is to deactivate didDoc', function () {
  // it('should not be able to deactivate did document as didDocument is null or empty', function () {
  //   return hypersignDid
  //     .deactivate({ didDocument: {}, privateKeyMultibase, verificationMethodId, versionId: '1.0' })
  //     .catch(function (err) {
  //       expect(function () {
  //         throw err;
  //       }).to.throw(Error, 'HID-SSI-SDK:: Error: params.didDocument is required to deactivate a did');
  //     });
  // });
  it('should not be able to deactivate did document as privateKeyMultibase is null or empty', function () {
    return hypersignDid
      .deactivate({ didDocument, privateKeyMultibase: '', verificationMethodId, versionId: '1.0' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.privateKeyMultibase is required to deactivate a did');
      });
  });
  it('should not be able to deactivate did document as verificationMethodId is null or empty', function () {
    return hypersignDid
      .deactivate({ didDocument, privateKeyMultibase, verificationMethodId: '', versionId: '1.0' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.verificationMethodId is required to deactivate a did');
      });
  });
  it('should not be able to deactivate did document as versionId is null or empty', function () {
    return hypersignDid
      .deactivate({ didDocument, privateKeyMultibase, verificationMethodId, versionId: '' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, 'HID-SSI-SDK:: Error: params.versionId is required to deactivate a did');
      });
  });
  it("should not be able to deactivate did document on hidClient can't be initialized", function () {
    return hypersignDid
      .deactivate({ didDocument: didDocument, privateKeyMultibase, verificationMethodId, versionId: '1.0' })
      .catch(function (err) {
        expect(function () {
          throw err;
        }).to.throw(Error, "Cannot read property 'signAndBroadcast' of undefined");
      });
  });
});