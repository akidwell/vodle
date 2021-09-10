export interface Policy {
    policyId: number;
    policySymbol: string;
    fullPolicyNumber: string;
}

export interface PolicyResolved {
    policy: Policy | null;
    error?: any;
  }

  export interface AccountInformation {
        insuredCode: string;
        namedInsured: string;
        insuredAddress1: string;
        insuredAddress2: string; 
        insuredCity: string; 
        insuredState: string; 
        insuredZip: string; 
        producerCode: string; 
        producerBranch: string; 
        producerAddress1: string; 
        producerAddress2: string; 
        producerCity: string; 
        producerState: string; 
        producerZip: string; 
        commissionRate: string;
        producerName: string;
}

export interface AccountInformationResolved {
    accountInfo: AccountInformation | null;
    error?: any;
  }

  export interface PolicyInformation {
       
          quoteData: QuoteData;
          policyEventCode: string;
          packageInd: string
          policyType: string
          policySymbol: string
          policyNo: string
          policyModNo: string
          enteredDate: Date
          policyId: string
          policyInsuredState: string
          policyEffectiveDate: Date
          policyExpirationDate: Date
          policyExtendedExpDate: Date
          policyCancelDate: Date
          programId: number
          programName: string
          riskGradeCode: string
          auditCode: string
          paymentFrequency: string
          deregulationIndicator: string
          NYFTZ: string
          riskType: string
          assumedCarrier:  string
          coinsurancePercentage: number
          productManufactureDate: Date
          submissionNumber: number
}

export interface PolicyInformationResolved {
policyInfo: PolicyInformation | null;
error?: any;
}
export interface QuoteData {
       
  pacCode: string;
  quoteNumber: string;
  carrierCode: string;
  coverageCode: string;
  creditDays: string;

}
