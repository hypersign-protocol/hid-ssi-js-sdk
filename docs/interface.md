
## Verfiable Credential

### `CredentialStatus`

```js
interface CredentialStatus {
  claim: Claim | undefined;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialHash: string;
}
```

### `CredentialProof`

```js
interface CredentialProof {
  type: string;
  created: string;
  updated: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
}
```

### `IVerifiableCredential`

```js
interface IVerifiableCredential {
  context: Array<string>;
  id: string;
  type: Array<string>;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: object;
  credentialSchema: ISchema;
  // Ref: https://www.w3.org/TR/vc-data-model/#status
  credentialStatus: ICredentialStatus;
  proof?: object;
}
```


### `DeliverTxResponse`

```js
interface DeliverTxResponse {
    readonly height: number;
    /** Error code. The transaction suceeded iff code is 0. */
    readonly code: number;
    readonly transactionHash: string;
    readonly rawLog?: string;
    readonly data?: readonly MsgData[];
    readonly gasUsed: number;
    readonly gasWanted: number;
}
```