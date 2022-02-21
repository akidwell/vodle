export interface PolicySearchResults {
    policyId: number;
    policyNumber: string;
    fullPolicyNumber: string;
    insuredName: string;
    endorsementNumber: number;
    policyEffectiveDate: Date;
    policyExpirationDate: Date;
    policyExtendedDate: Date;
    policyCancelDate: Date;
    invoiceNumber:number;
    invoiceDate?: Date;
    transactionEffectiveDate: Date;
    transactionExpirationDate: Date;
    voidDate?: Date;
    invoiceStatus: string;
    transactionType: string;
    amount: number;
    action: string;
    firstPolicyRow : boolean;
    masterPolicy: string;
    canBackOut:  boolean;
  }

  export interface NewEndorsementData {
    endorsementNumber: number;
    sourcePolicyId: number;
    destinationPolicyId: number;
    newEndorsementNumber: number;
    transactionType: number;
    endorsementReason: string;
    transEffectiveDate: Date;
    transExpirationDate: Date;
    premium: number;
    backout: boolean;
  }
