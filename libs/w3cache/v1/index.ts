import did from './did.json'
import ed25519signature2020 from './ed25519-signature-2020.json'
import securityv2  from './security-v2.json'
import credentials from './credentials.json'
import jsonld from 'jsonld';

// Ref: https://github.com/digitalbazaar/jsonld.js/#custom-document-loader
const nodeDocumentLoader = jsonld.documentLoaders.node();
const CONTEXTS = Object.freeze({
    "https://www.w3.org/ns/did/v1": {
        ...did
    },
    "https://w3id.org/security/suites/ed25519-2020/v1": {
        ...ed25519signature2020
    },
    "https://w3id.org/security/v2": {
        ...securityv2
    },
    "https://www.w3.org/2018/credentials/v1": {
        ...credentials
    },
    "https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary": {
        "@context": {
            "sec": "https://w3id.org/security/v1",
            "cred": "https://w3.org/2018/credentials#",
            "dc": "http://purl.org/dc/terms/",
            "owl": "http://www.w3.org/2002/07/owl#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "dc:title": {
                "@container": "@language"
            },
            "dc:description": {
                "@container": "@language"
            },
            "dc:date": {
                "@type": "xsd:date"
            },
            "rdfs:comment": {
                "@container": "@language"
            },
            "rdfs:domain": {
                "@type": "@id"
            },
            "rdfs:label": {
                "@container": "@language"
            },
            "rdfs:range": {
                "@type": "@id"
            },
            "rdfs:seeAlso": {
                "@type": "@id"
            },
            "rdfs:subClassOf": {
                "@type": "@id"
            },
            "rdfs:subPropertyOf": {
                "@type": "@id"
            },
            "owl:equivalentClass": {
                "@type": "@vocab"
            },
            "owl:equivalentProperty": {
                "@type": "@vocab"
            },
            "owl:oneOf": {
                "@container": "@list",
                "@type": "@vocab"
            },
            "owl:deprecated": {
                "@type": "xsd:boolean"
            },
            "owl:imports": {
                "@type": "@id"
            },
            "owl:versionInfo": {
                "@type": "@id"
            },
            "owl:inverseOf": {
                "@type": "@vocab"
            },
            "owl:unionOf": {
                "@type": "@vocab",
                "@container": "@list"
            },
            "rdfs_classes": {
                "@reverse": "rdfs:isDefinedBy",
                "@type": "@id"
            },
            "rdfs_properties": {
                "@reverse": "rdfs:isDefinedBy",
                "@type": "@id"
            },
            "rdfs_instances": {
                "@reverse": "rdfs:isDefinedBy",
                "@type": "@id"
            }
        },
        "@id": "https://w3id.org/security/v1",
        "@type": "owl:Ontology",
        "dc:title": {
            "en": "Security Vocabulary"
        },
        "dc:description": {
            "en": "vocabulary used to ensure the authenticity and integrity of Verifiable Credentials and similar types of constrained digital documents using cryptography, especially through the use of digital signatures and related mathematical proofs \n"
        },
        "rdfs:seeAlso": "https://www.w3.org/TR/vc-data-integrity/",
        "dc:date": "2023-02-11",
        "rdfs_classes": [
            {
                "@id": "sec:Proof",
                "@type": "rdfs:Class",
                "rdfs:label": {
                    "en": "Digital proof"
                },
                "rdfs:comment": {
                    "en": "This class represents a digital proof on serialized data. "
                }
            },
            {
                "@id": "sec:ProofGraph",
                "@type": "rdfs:Class",
                "rdfs:label": {
                    "en": "An RDF Graph for a digital proof"
                },
                "rdfs:comment": {
                    "en": "Instances of this class are RDF Graphs, where each of these graphs must include exactly one Proof."
                }
            },
            {
                "@id": "sec:VerificationMethod",
                "@type": "rdfs:Class",
                "rdfs:label": {
                    "en": "Verification method"
                },
                "rdfs:comment": {
                    "en": "A Verification Method class can express different verification methods, such as cryptographic public keys, which can be used to authenticate or authorize interaction with the `controller` or associated parties. Verification methods might take many parameters."
                }
            },
            {
                "@id": "sec:DataIntegrityProof",
                "@type": "rdfs:Class",
                "rdfs:subClassOf": [
                    "sec:Proof"
                ],
                "rdfs:label": {
                    "en": "A Data Integrity Proof"
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity proof used to encode a variety of cryptographic suite proof encodings."
                },
                "rdfs:seeAlso": [
                    "https://www.w3.org/TR/vc-data-integrity/#dataintegrityproof"
                ]
            },
            {
                "@id": "sec:Ed25519Signature2020",
                "@type": "rdfs:Class",
                "rdfs:subClassOf": [
                    "sec:Proof"
                ],
                "rdfs:label": {
                    "en": "ED2559 Signature Suite, 2020 version"
                },
                "rdfs:comment": {
                    "en": "T.B.D."
                }
            },
            {
                "@id": "sec:Key",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Cryptographic key"
                },
                "rdfs:comment": {
                    "en": "This class represents a cryptographic key that may be used for encryption, decryption, or digitally signing data."
                }
            },
            {
                "@id": "sec:Signature",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Proof"
                ],
                "rdfs:label": {
                    "en": "Digital signature"
                },
                "rdfs:comment": {
                    "en": "This class represents a digital signature on serialized data. It is an abstract class and should not be used other than for Semantic Web reasoning purposes, such as by a reasoning agent. This class MUST NOT be used directly, but only through its subclasses."
                }
            },
            {
                "@id": "sec:SignatureGraph",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:ProofGraph"
                ],
                "rdfs:label": {
                    "en": "An RDF Graph for a digital signature"
                },
                "rdfs:comment": {
                    "en": "Instances of this class are RDF Graphs, where each of these graphs must include exactly one Signature."
                }
            },
            {
                "@id": "sec:EcdsaSecp256k1Signature2019",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "TBD."
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity signature suite."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/#ecdsa-secp256k1"
                ]
            },
            {
                "@id": "sec:EcdsaSecp256k1Signature2020",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "TBD."
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity signature suite."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/#ecdsa-secp256k1"
                ]
            },
            {
                "@id": "sec:EcdsaSecp256k1RecoverySignature2020",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "TBD."
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity signature."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/#ecdsasecp256k1recoverysignature2020"
                ]
            },
            {
                "@id": "sec:EcdsaSecp256k1VerificationKey2019",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Key"
                ],
                "rdfs:label": {
                    "en": "TBD."
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity verification method."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/#ecdsa-secp256k1"
                ]
            },
            {
                "@id": "sec:EcdsaSecp256k1RecoveryMethod2020",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Key"
                ],
                "rdfs:label": {
                    "en": "TBD."
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity verification method."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/#ecdsasecp256k1recoverymethod2020"
                ]
            },
            {
                "@id": "sec:RsaSignature2018",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "Signature Suite for RSA (was deprecated in the CCG document)"
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity signature suite."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/#rsa"
                ]
            },
            {
                "@id": "sec:RsaVerificationKey2018",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Key"
                ],
                "rdfs:label": {
                    "en": "Verification Key for RSA (was deprecated in the CCG document)"
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity verification method."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/#rsa"
                ]
            },
            {
                "@id": "sec:SchnorrSecp256k1Signature2019",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "TBD."
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity signature suite."
                }
            },
            {
                "@id": "sec:SchnorrSecp256k1VerificationKey2019",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Key"
                ],
                "rdfs:label": {
                    "en": "TBD."
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity verification method."
                }
            },
            {
                "@id": "sec:ServiceEndpointProxyService",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "TBD."
                },
                "rdfs:comment": {
                    "en": "T.B.D."
                }
            },
            {
                "@id": "sec:Digest",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Message digest"
                },
                "rdfs:comment": {
                    "en": "This class represents a message digest that may be used for data integrity verification. The digest algorithm used will determine the cryptographic properties of the digest."
                }
            },
            {
                "@id": "sec:EncryptedMessage",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Encrypted message"
                },
                "rdfs:comment": {
                    "en": "A class of messages that are obfuscated in some cryptographic manner. These messages are incredibly difficult to decrypt without the proper decryption key."
                }
            },
            {
                "@id": "sec:GraphSignature2012",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "RDF graph signature"
                },
                "rdfs:comment": {
                    "en": "A graph signature is used for digital signatures on RDF graphs. The default canonicalization mechanism is specified in the RDF Graph normalization specification, which effectively deterministically names all unnamed nodes. The default signature mechanism uses a SHA-256 digest and RSA to perform the digital signature."
                }
            },
            {
                "@id": "sec:LinkedDataSignature2015",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "Linked data signature, 2015 version (was deprecated in the CCG document)"
                },
                "rdfs:comment": {
                    "en": "A Linked Data signature is used for digital signatures on RDF Datasets. The default canonicalization mechanism is specified in the RDF Dataset Normalization specification, which effectively deterministically names all unnamed nodes. The default signature mechanism uses a SHA-256 digest and RSA to perform the digital signature."
                }
            },
            {
                "@id": "sec:LinkedDataSignature2016",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "Linked data signature, 2016 version (was deprecated in the CCG document)"
                },
                "rdfs:comment": {
                    "en": "A Linked Data signature is used for digital signatures on RDF Datasets. The default canonicalization mechanism is specified in the RDF Dataset Normalization specification, which effectively deterministically names all unnamed nodes. The default signature mechanism uses a SHA-256 digest and RSA to perform the digital signature."
                }
            },
            {
                "@id": "sec:MerkleProof2019",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "Merkle Proof"
                },
                "rdfs:comment": {
                    "en": "Linked Data signature is used for digital signatures on RDF Datasets. The default canonicalization mechanism is specified in the RDF Dataset Normalization specification, which effectively deterministically names all unnamed nodes. The default signature mechanism uses a SHA-256 digest and ECDSA to perform the digital signature."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/lds-merkle-proof-2019/"
                ]
            },
            {
                "@id": "sec:X25519KeyAgreementKey2019",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Key"
                ],
                "rdfs:label": {
                    "en": "X25519 Key Agreement Key 2019"
                },
                "rdfs:comment": {
                    "en": "This class represents a verification key."
                }
            },
            {
                "@id": "sec:Ed25519VerificationKey2018",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Key"
                ],
                "rdfs:label": {
                    "en": "ED2559 Verification Key, 2018 version"
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity verification method."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/#ed25519"
                ]
            },
            {
                "@id": "sec:Ed25519VerificationKey2020",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Key"
                ],
                "rdfs:label": {
                    "en": "ED2559 Verification Key, 2020 version"
                },
                "rdfs:comment": {
                    "en": "A linked data proof suite verification method type used with `Ed25519Signature2020`."
                }
            },
            {
                "@id": "sec:JsonWebKey2020",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Key"
                ],
                "rdfs:label": {
                    "en": "JSON Web Key, 2020 version"
                },
                "rdfs:comment": {
                    "en": "A linked data proof suite verification method type used with `JsonWebSignature2020`"
                }
            },
            {
                "@id": "sec:JsonWebSignature2020",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "JSON Web Signature, 2020 version"
                },
                "rdfs:comment": {
                    "en": "A Linked Data signature is used for digital signatures on RDF Datasets. The default canonicalization mechanism is specified in the RDF Dataset Normalization specification, which deterministically names all unnamed nodes. The default signature mechanism uses a SHA-256 digest and JWS to perform the digital signature."
                }
            },
            {
                "@id": "sec:BbsBlsSignature2020",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "BBS Signature, 2020 version"
                },
                "rdfs:comment": {
                    "en": "A Linked Data signature is used for digital signatures on RDF Datasets. The default canonicalization mechanism is specified in the RDF Dataset Normalization specification, which deterministically names all unnamed nodes. Importantly, a `BbsBlsSignature` digests each of the statements produced by the normalization process individually to enable selective disclosure. The signature mechanism uses Blake2B as the digest for each statement and produces a single output digital signature."
                }
            },
            {
                "@id": "sec:BbsBlsSignatureProof2020",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Signature"
                ],
                "rdfs:label": {
                    "en": "BBS Signature Proof, 2020 version"
                },
                "rdfs:comment": {
                    "en": "A Linked Data signature is used for digital signatures on RDF Datasets. The default canonicalization mechanism is specified in the RDF Dataset Normalization specification, which deterministically names all unnamed nodes. Importantly, a `BbsBlsSignatureProof2020` is in fact a proof of knowledge of an unrevealed BbsBlsSignature2020 enabling the ability to selectively reveal information from the set that was originally signed. Each of the statements produced by the normalizing process for a JSON-LD document featuring a `BbsBlsSignatureProof2020` represent statements that were originally signed in producing the `BbsBlsSignature2020` and represent the denomination under which information can be selectively disclosed. The signature mechanism uses Blake2B as the digest for each statement and produces a single output digital signature."
                }
            },
            {
                "@id": "sec:Bls12381G1Key2020",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Key"
                ],
                "rdfs:label": {
                    "en": "BLS 12381 G1 Signature Key, 2020 version"
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity signature key."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/#ed25519"
                ]
            },
            {
                "@id": "sec:Bls12381G2Key2020",
                "@type": [
                    "rdfs:Class",
                    "owl:DeprecatedClass"
                ],
                "owl:deprecated": true,
                "rdfs:subClassOf": [
                    "sec:Key"
                ],
                "rdfs:label": {
                    "en": "BLS 12381 G2 Signature Key, 2020 version"
                },
                "rdfs:comment": {
                    "en": "This class represents a data integrity signature key."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/#ed25519"
                ]
            }
        ],
        "rdfs_properties": [
            {
                "@id": "sec:verificationMethod",
                "@type": "rdfs:Property",
                "rdfs:range": "sec:VerificationMethod",
                "rdfs:label": {
                    "en": "Verification method"
                },
                "rdfs:comment": {
                    "en": "A `verificationMethod` property is used to specify a URL that contains information used for proof verification."
                },
                "rdfs:seeAlso": [
                    "https://www.w3.org/TR/did-core/#verification-methods"
                ]
            },
            {
                "@id": "sec:domain",
                "@type": [
                    "rdfs:Property",
                    "owl:DatatypeProperty"
                ],
                "rdfs:domain": "sec:Proof",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Domain of a proof"
                },
                "rdfs:comment": {
                    "en": "The `domain` property is used to associate a domain with a proof, for use with a `proofPurpose` such as `authentication` and indicating its intended usage."
                }
            },
            {
                "@id": "sec:challenge",
                "@type": [
                    "rdfs:Property",
                    "owl:DatatypeProperty"
                ],
                "rdfs:domain": "sec:Proof",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Challenge with a proof"
                },
                "rdfs:comment": {
                    "en": "The challenge property is used to associate a challenge with a proof, for use with a `proofPurpose` such as `authentication`. This string value SHOULD be included in a proof if a `domain` is specified."
                }
            },
            {
                "@id": "sec:proofPurpose",
                "@type": [
                    "rdfs:Property",
                    "owl:DatatypeProperty"
                ],
                "rdfs:domain": "sec:Proof",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Proof purpose"
                },
                "rdfs:comment": {
                    "en": "The` proofPurpose` property is used to associate a purpose, such as `assertionMethod` or `authentication` with a proof. The proof purpose acts as a safeguard to prevent the proof from being misused by being applied to a purpose other than the one that was intended."
                }
            },
            {
                "@id": "sec:proofValue",
                "@type": [
                    "rdfs:Property",
                    "owl:DatatypeProperty"
                ],
                "rdfs:domain": "sec:Proof",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Proof value"
                },
                "rdfs:comment": {
                    "en": "A string value that contains the data necessary to verify the digital proof using the `verificationMethod` specified"
                }
            },
            {
                "@id": "sec:proof",
                "@type": "rdfs:Property",
                "rdfs:range": "sec:ProofGraph",
                "rdfs:label": {
                    "en": "Proof sets"
                },
                "rdfs:comment": {
                    "en": "The value of the `proof` property MUST identify `ProofGraph` instances (informally, it indirectly identifies `Proof` instances, each contained in a separate graph). The property is used to associate a proof with a graph of information. The proof property is typically not included in the canonicalized graphs that are then digested and digitally signed. The order of the proofs is not relevant."
                }
            },
            {
                "@id": "sec:proofChain",
                "@type": "rdfs:Property",
                "rdfs:range": "rdf:List",
                "rdfs:label": {
                    "en": "Proof chain"
                },
                "rdfs:comment": {
                    "en": "The value of the `proofChain` property MUST identify a sequence of `ProofGraph` instances (informally, it indirectly identifies a series of `Proof` instances, each contained in a separate graph). The property is used to provide a sequence of multiple proofs where the order of when the proofs occurred matters. The proof chain property is typically not included in the canonicalized graphs that are then separately digested and digitally signed."
                }
            },
            {
                "@id": "sec:controller",
                "@type": [
                    "rdfs:Property",
                    "owl:ObjectProperty"
                ],
                "rdfs:domain": "sec:VerificationMethod",
                "rdfs:label": {
                    "en": "Controller"
                },
                "rdfs:comment": {
                    "en": "A controller is an entity that claims control over a particular resource. Note that control is best validated as a two-way relationship, where the controller claims control over a particular resource, and the resource clearly identifies its controller."
                }
            },
            {
                "@id": "sec:authentication",
                "@type": "rdfs:Property",
                "rdfs:range": "VerificationMethod",
                "rdfs:label": {
                    "en": "Authentication method"
                },
                "rdfs:comment": {
                    "en": "An `authentication` property is used to specify a URL that contains information about a `verificationMethod` used for authentication."
                }
            },
            {
                "@id": "sec:assertionMethod",
                "@type": "rdfs:Property",
                "rdfs:range": "VerificationMethod",
                "rdfs:label": {
                    "en": "Assertion method"
                },
                "rdfs:comment": {
                    "en": "An `assertionMethod` property is used to specify a URL that contains information about a `verificationMethod` used for assertions."
                }
            },
            {
                "@id": "sec:capabilityDelegation",
                "@type": "rdfs:Property",
                "rdfs:range": "VerificationMethod",
                "rdfs:label": {
                    "en": "Capability Delegation Method"
                },
                "rdfs:comment": {
                    "en": "A `capabilityDelegation` property is used to express that one or more `verificationMethods` are authorized to verify cryptographic proofs that were created for the purpose of delegating capabilities.\nA `verificationMethod` may be referenced by its identifier (a URL) or expressed in full.\nThe aforementioned proofs are created to prove that some entity is delegating the authority to take some action to another entity. A verifier of the proof should expect the proof to express a `proofPurpose` of `capabilityDelegation` and reference a `verificationMethod` to verify it. The dereferenced `verificationMethod` MUST have a controller property that has a property of `capabilityDelegation` that references the `verificationMethod`. This indicates that the controller has authorized it for the expressed `proofPurpose`."
                }
            },
            {
                "@id": "sec:capabilityInvocation",
                "@type": "rdfs:Property",
                "rdfs:range": "VerificationMethod",
                "rdfs:label": {
                    "en": "Capability Invocation Method"
                },
                "rdfs:comment": {
                    "en": "A `capabilityInvocation` property is used to express that one or more `verificationMethods` are authorized to verify cryptographic proofs that were created for the purpose of invoking capabilities.\nA `verificationMethod` MAY be referenced by its identifier (a URL) or expressed in full.\nThe aforementioned proofs are created to prove that some entity is attempting to exercise some authority they possess to take an action. A verifier of the proof should expect the proof to express a `proofPurpose` of `capabilityInvocation` and reference a `verificationMethod` to verify it. The dereferenced `verificationMethod` MUST have a controller property that, when dereferenced, has a property of `capabilityInvocation` that references the `verificationMethod.` This indicates that the controller has authorized it for the expressed `proofPurpose`."
                }
            },
            {
                "@id": "sec:keyAgreement",
                "@type": "rdfs:Property",
                "rdfs:range": "VerificationMethod",
                "rdfs:label": {
                    "en": "Key agreement protocols"
                },
                "rdfs:comment": {
                    "en": "Indicates that a proof is used for for key agreement protocols, such as Elliptic Curve Diffie Hellman key agreement used by popular encryption libraries."
                }
            },
            {
                "@id": "sec:cryptosuite",
                "@type": [
                    "rdfs:Property",
                    "owl:DatatypeProperty"
                ],
                "rdfs:domain": "sec:DataIntegrityProof",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Cryptographic suite"
                },
                "rdfs:comment": {
                    "en": "A text-based identifier for a specific cryptographic suite."
                },
                "rdfs:seeAlso": [
                    "https://www.w3.org/TR/vc-data-integrity/#dataintegrityproof"
                ]
            },
            {
                "@id": "sec:publicKeyMultibase",
                "@type": [
                    "rdfs:Property",
                    "owl:DatatypeProperty"
                ],
                "rdfs:domain": "sec:VerificationMethod",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Public key multibase"
                },
                "rdfs:comment": {
                    "en": "The public key multibase property is used to specify the multibase-encoded version of a public key. The contents of the property are defined by specifications such as ED25519-2020 and listed in the Linked Data Cryptosuite Registry. Most public key type definitions are expected to:\n• Specify only a single encoding base per public key type as it reduces implementation burden and increases the chances of reaching broad interoperability.\n• Specify a multicodec header on the encoded public key to aid encoding and decoding applications in confirming that they are serializing and deserializing an expected public key type.\n• Use compressed binary formats to ensure efficient key sizes."
                },
                "rdfs:seeAlso": [
                    "https://datatracker.ietf.org/doc/html/draft-multiformats-multibase-03",
                    "https://w3c-ccg.github.io/ld-cryptosuite-registry/",
                    "https://github.com/multiformats/multicodec/blob/master/table.csv",
                    "https://w3c-ccg.github.io/lds-ed25519-2020/"
                ]
            },
            {
                "@id": "sec:publicKeyJwk",
                "@type": [
                    "rdfs:Property",
                    "owl:DatatypeProperty"
                ],
                "rdfs:domain": "sec:VerificationMethod",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Public key JWK"
                },
                "rdfs:comment": {
                    "en": "See the JOSE suite."
                },
                "rdfs:seeAlso": [
                    "https://www.iana.org/assignments/jose/jose.xhtml",
                    "https://tools.ietf.org/html/rfc7517"
                ]
            },
            {
                "@id": "sec:cipherAlgorithm",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:EncryptedMessage",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Cipher algorithm"
                },
                "rdfs:comment": {
                    "en": "The cipher algorithm describes the mechanism used to encrypt a message. It is typically a string expressing the cipher suite, the strength of the cipher, and a block cipher mode."
                }
            },
            {
                "@id": "sec:cipherData",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:EncryptedMessage",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Cipher data"
                },
                "rdfs:comment": {
                    "en": "Cipher data is an opaque blob of information that is used to specify an encrypted message."
                }
            },
            {
                "@id": "sec:cipherKey",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:EncryptedMessage",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Cipher key"
                },
                "rdfs:comment": {
                    "en": "A cipher key is a symmetric key that is used to encrypt or decrypt a piece of information. The key itself may be expressed in clear text or encrypted."
                }
            },
            {
                "@id": "sec:digestAlgorithm",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Digest algorithm"
                },
                "rdfs:comment": {
                    "en": "The digest algorithm is used to specify the cryptographic function to use when generating the data to be digitally signed. Typically, data that is to be signed goes through three steps: 1) canonicalization, 2) digest, and 3) signature. This property is used to specify the algorithm that should be used for step 2. A signature class typically specifies a default digest method, so this property is typically used to specify information for a signature algorithm."
                }
            },
            {
                "@id": "sec:digestValue",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Digest value"
                },
                "rdfs:comment": {
                    "en": "The digest value is used to express the output of the digest algorithm expressed in Base-16 (hexadecimal) format."
                }
            },
            {
                "@id": "sec:blockchainAccountId",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Blockchain account ID"
                },
                "rdfs:comment": {
                    "en": "A `blockchainAccountId` property is used to specify a blockchain account identifier, as per the CAIP-10Account ID Specification."
                }
            },
            {
                "@id": "sec:ethereumAddress",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Ethereum address"
                },
                "rdfs:comment": {
                    "en": "An `ethereumAddress` property is used to specify the Ethereum address. As per the Ethereum Yellow Paper “Ethereum: a secure decentralised generalised transaction ledger” in consists of a prefix \"0x\", a common identifier for hexadecimal, concatenated with the rightmost 20 bytes of the Keccak-256 hash (big endian) of the ECDSA public key (the curve used is the so-called secp256k1). In hexadecimal, 2 digits represent a byte, meaning addresses contain 40 hexadecimal digits. The Ethereum address should also contain a checksum as per EIP-55."
                },
                "rdfs:seeAlso": [
                    "https://eips.ethereum.org/EIPS/eip-55",
                    "https://ethereum.github.io/yellowpaper/paper.pdf"
                ]
            },
            {
                "@id": "sec:expires",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:range": "xsd:dateTime",
                "rdfs:label": {
                    "en": "Expiration time"
                },
                "rdfs:comment": {
                    "en": "The expiration time is typically associated with a `Key` and specifies when the validity of the key will expire."
                }
            },
            {
                "@id": "sec:initializationVector",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:EncryptedMessage",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Initialization vector"
                },
                "rdfs:comment": {
                    "en": "The initialization vector (IV) is a byte stream that is typically used to initialize certain block cipher encryption schemes. For a receiving application to be able to decrypt a message, it must know the decryption key and the initialization vector. The value is typically base-64 encoded."
                }
            },
            {
                "@id": "sec:nonce",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Signature",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Nonce"
                },
                "rdfs:comment": {
                    "en": "This property is used in conjunction with the input to the signature hashing function in order to protect against replay attacks. Typically, receivers need to track all nonce values used within a certain time period in order to ensure that an attacker cannot merely re-send a compromised packet in order to execute a privileged request."
                }
            },
            {
                "@id": "sec:canonicalizationAlgorithm",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Signature",
                "rdfs:label": {
                    "en": "Canonicalization algorithm"
                },
                "rdfs:comment": {
                    "en": "The canonicalization algorithm is used to transform the input data into a form that can be passed to a cryptographic digest method. The digest is then digitally signed using a digital signature algorithm. Canonicalization ensures that a piece of software that is generating a digital signature is able to do so on the same set of information in a deterministic manner."
                }
            },
            {
                "@id": "sec:controller",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:ObjectProperty"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Controller"
                },
                "rdfs:comment": {
                    "en": "A controller is an entity that claims control over a particular resource. Note that control is best validated as a two-way relationship where the controller claims control over a particular resource, and the resource clearly identifies its controller."
                }
            },
            {
                "@id": "sec:owner",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:ObjectProperty"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Owner (was deprecated in the CCG document)"
                },
                "rdfs:comment": {
                    "en": "An owner is an entity that claims control over a particular resource. Note that ownership is best validated as a two-way relationship where the owner claims ownership over a particular resource, and the resource clearly identifies its owner."
                }
            },
            {
                "@id": "sec:password",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Password"
                },
                "rdfs:comment": {
                    "en": "A secret that is used to generate a key that can be used to encrypt or decrypt message. It is typically a string value."
                }
            },
            {
                "@id": "sec:privateKeyPem",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Key",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "PEM encoded private key"
                },
                "rdfs:comment": {
                    "en": "A private key PEM property is used to specify the PEM-encoded version of the private key. This encoding is compatible with almost every Secure Sockets Layer library implementation and typically plugs directly into functions intializing private keys."
                },
                "rdfs:seeAlso": [
                    "http://en.wikipedia.org/wiki/Privacy_Enhanced_Mail"
                ]
            },
            {
                "@id": "sec:publicKey",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:ObjectProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Key",
                "rdfs:label": {
                    "en": "Public Key"
                },
                "rdfs:comment": {
                    "en": "A public key property is used to specify a URL that contains information about a public key."
                }
            },
            {
                "@id": "sec:publicKeyBase58",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Key",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Base58-encoded Public Key"
                },
                "rdfs:comment": {
                    "en": "A public key Base58 property is used to specify the base58-encoded version of the public key."
                }
            },
            {
                "@id": "sec:publicKeyPem",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Key",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Public key PEM"
                },
                "rdfs:comment": {
                    "en": "A public key PEM property is used to specify the PEM-encoded version of the public key. This encoding is compatible with almost every Secure Sockets Layer library implementation and typically plugs directly into functions initializing public keys."
                }
            },
            {
                "@id": "sec:publicKeyHex",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Key",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Hex-encoded version of public Key"
                },
                "rdfs:comment": {
                    "en": "A `publicKeyHex` property is used to specify the hex-encoded version of the public key, based on section 8 of rfc4648. Hex encoding is also known as Base16 encoding."
                },
                "rdfs:seeAlso": [
                    "https://tools.ietf.org/html/rfc4648#section-8"
                ]
            },
            {
                "@id": "sec:publicKeyService",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:ObjectProperty"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Public key service"
                },
                "rdfs:comment": {
                    "en": "The publicKeyService property is used to express the REST URL that provides public key management services."
                }
            },
            {
                "@id": "sec:revoked",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:range": "xsd:dateTime",
                "rdfs:label": {
                    "en": "Revocation time"
                },
                "rdfs:comment": {
                    "en": "The revocation time is typically associated with a `Key` that has been marked as invalid as of the date and time associated with the property. Key revocations are often used when a key is compromised, such as the theft of the private key, or during the course of best-practice key rotation schedules."
                }
            },
            {
                "@id": "sec:jws",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:range": "sec:Signature",
                "rdfs:label": {
                    "en": "Json Web Signature"
                },
                "rdfs:comment": {
                    "en": "The jws property is used to associate a detached Json Web Signature with a proof."
                },
                "rdfs:seeAlso": [
                    "https://tools.ietf.org/html/rfc7797"
                ]
            },
            {
                "@id": "sec:challenge",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Proof",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Challenge with a proof"
                },
                "rdfs:comment": {
                    "en": "The challenge property is used to associate a challenge with a proof, for use with a `proofPurpose` such as `authentication`. This string value SHOULD be included in a proof if a `domain` is specified."
                }
            },
            {
                "@id": "sec:expirationDate",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Proof",
                "rdfs:range": "xsd:dateTime",
                "rdfs:label": {
                    "en": "Expiration date for proof"
                },
                "rdfs:comment": {
                    "en": "The `expirationDate` property is used to associate an expiration date with a proof."
                }
            },
            {
                "@id": "sec:signature",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:range": "sec:Signature",
                "rdfs:label": {
                    "en": "Signature  (was deprecated in the CCG document)"
                },
                "rdfs:comment": {
                    "en": "The property is used to associate a proof with a graph of information. The proof property is typically not included in the canonicalized graph that is then digested, and digitally signed."
                }
            },
            {
                "@id": "sec:signatureValue",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:DatatypeProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Signature",
                "rdfs:range": "xsd:string",
                "rdfs:label": {
                    "en": "Signature value  (was deprecated in the CCG document)"
                },
                "rdfs:comment": {
                    "en": "The signature value is used to express the output of the signature algorithm expressed in base-64 format."
                }
            },
            {
                "@id": "sec:signatureAlgorithm",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:ObjectProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Signature",
                "rdfs:label": {
                    "en": "Signature algorithm  (was deprecated in the CCG document)"
                },
                "rdfs:comment": {
                    "en": "The signature algorithm is used to specify the cryptographic signature function to use when digitally signing the digest data. Typically, text to be signed goes through three steps: 1) canonicalization, 2) digest, and 3) signature. This property is used to specify the algorithm that should be used for step #3. A signature class typically specifies a default signature algorithm, so this property rarely needs to be used in practice when specifying digital signatures."
                }
            },
            {
                "@id": "sec:service",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:ObjectProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Signature",
                "rdfs:label": {
                    "en": "Service"
                },
                "rdfs:comment": {
                    "en": "Examples of specific services include discovery services, social networks, file storage services, and verifiable claim repository services."
                }
            },
            {
                "@id": "sec:serviceEndpoint",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty",
                    "owl:ObjectProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Signature",
                "rdfs:label": {
                    "en": "Service endpoint"
                },
                "rdfs:comment": {
                    "en": "A network address at which a service operates on behalf of a controller. Examples of specific services include discovery services, social networks, file storage services, and verifiable claim repository services. Service endpoints might also be provided by a generalized data interchange protocol, such as extensible data interchange."
                }
            },
            {
                "@id": "sec:x509CertificateChain",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Signature",
                "rdfs:range": "sec:Signature",
                "rdfs:label": {
                    "en": "X509 Certificate chain"
                },
                "rdfs:comment": {
                    "en": "The x509CertificateChain property is used to associate a chain of X.509 Certificates with a proof. The value of this property is an ordered list where each value in the list is an X.509 Certificate expressed as a DER PKIX format, that is encoded with multibase using the base64pad variant. The certificate directly associated to the verification method used to verify the proof MUST be the first element in the list. Subsequent certificates in the list MAY be included where each one MUST certify the previous one."
                },
                "rdfs:seeAlso": [
                    "https://tools.ietf.org/html/rfc5280",
                    "https://tools.ietf.org/id/draft-multiformats-multibase-00.html"
                ]
            },
            {
                "@id": "sec:x509CertificateFingerprint",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:domain": "sec:Signature",
                "rdfs:range": "sec:Signature",
                "rdfs:label": {
                    "en": "X509 Certificate fingerprint"
                },
                "rdfs:comment": {
                    "en": "The x509CertificateFingerprint property is used to associate an X.509 Certificate with a proof via its fingerprint. The value is a multihash encoded then multibase encoded value using the base64pad variant. It is RECOMMENDED that the fingerprint value be the SHA-256 hash of the X.509 Certificate."
                },
                "rdfs:seeAlso": [
                    "https://tools.ietf.org/html/rfc5280",
                    "https://tools.ietf.org/id/draft-multiformats-multibase-00.html"
                ]
            },
            {
                "@id": "sec:allowedAction",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Allowed action"
                },
                "rdfs:comment": {
                    "en": "An action that the controller of a capability may take when invoking the capability."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/zcap-spec/#delegated-capability"
                ]
            },
            {
                "@id": "sec:capabilityChain",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Capability chain"
                },
                "rdfs:comment": {
                    "en": "An list of delegated capabilities from a delegator to a delegatee."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/zcap-spec/#delegation"
                ]
            },
            {
                "@id": "sec:capabilityAction",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Capability action"
                },
                "rdfs:comment": {
                    "en": "An action that can be taken given a capability."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/zcap-spec/#invoking-root-capability"
                ]
            },
            {
                "@id": "sec:caveat",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Caveat"
                },
                "rdfs:comment": {
                    "en": "A restriction on the way the capability may be used."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/zcap-spec/#caveats"
                ]
            },
            {
                "@id": "sec:delegator",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Delegator"
                },
                "rdfs:comment": {
                    "en": "An entity that delegates a capability to a delegatee."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/zcap-spec/#delegation"
                ]
            },
            {
                "@id": "sec:invocationTarget",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Invocation target"
                },
                "rdfs:comment": {
                    "en": "An invocation target identifies where a capability may be invoked, and identifies the target object for which the root capability expresses authority."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/zcap-spec/#root-capability"
                ]
            },
            {
                "@id": "sec:invoker",
                "@type": [
                    "rdf:Property",
                    "owl:DeprecatedProperty"
                ],
                "owl:deprecated": true,
                "rdfs:label": {
                    "en": "Invoker"
                },
                "rdfs:comment": {
                    "en": "An identifier to cryptographic material that can invoke a capability."
                },
                "rdfs:seeAlso": [
                    "https://w3c-ccg.github.io/zcap-spec/#invocation"
                ]
            }
        ]
    }
})

export default async (url, options) => {
    if(url in CONTEXTS) {
        return {
            contextUrl: null, // this is for a context via a link header
            document: CONTEXTS[url], // this is the actual document that was loaded
            documentUrl: url // this is the actual context URL after redirects
        };
    }
    // call the default documentLoader
    return nodeDocumentLoader(url);
};
  
  
  
