export interface PolicySearchResults {
    policyId: number;
    policyNumber: string;
    fullPolicyNumber: string;
    insuredName: string;
    endorsementNumber: number;
    policyEffectiveDate: Date;
    policyExpirationDate: Date;
    policyExtendedDate: Date;
    invoiceNumber:number;
    invoiceDate?: Date;
    transactionEffectiveDate: Date;
    transactionExpirationDate: Date;
    voidDate?: Date;
    invoiceStatus: string;
    transactionType: string;
    action: string;
    firstPolicyRow : boolean;
    masterPolicy: string;
  }

  export interface EndorsementAction {
    endorsementNumber: number;
    transactionType: string;
    endorsementReason: string;
    transEffectiveDate: Date;
    transExpirationDate: Date;
    premium: number;
  }
