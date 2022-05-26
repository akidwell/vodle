export interface SearchResults {
  policySearchResponses: PolicySearchResponses[];
  submissionSearchResponses: SubmissionSearchResponses[];
  insuredSearchResponses: InsuredSearchResponses[];
  searchType: string;
}

export interface PolicySearchResponses {
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
    canBackOut: boolean;
    isRewrite: boolean;
  }

export interface SubmissionSearchResponses{
    submissionNumber: number;
    quoteNumber: number;
    underwriter: string;
    producerBranch: string;
    submissionStatus: string;
    insuredName: string;
    policyNumber: string;
    policyNo: string;
    effectiveDate: Date;
    expirationDate: Date;
    submissionDate: Date;
    renewalFlag: string;
    coverageType: string;
    profitCenter: string;
    cancelDate: Date;
  }

export interface InsuredSearchResponses{
    insuredName: string;
    insuredCode: number;
    name: string;
    insuredCity: string;
    insuredState: string;
    zip: string;
    formerName: string;
    streetAddress: string;
    isPacerResult: boolean;
    pacerId: string;
    effectiveDate: Date;
    recievedDate: Date;
    subStatus: string;
    policyNumber: string;
    type: string;
    producer: string;
    stateName: string;
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
    isRewrite: boolean;
  }
