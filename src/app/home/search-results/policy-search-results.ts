export interface PolicySearchResults {
    policyId: number;
    policyNumber: string;
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
  }