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
  policyId: number;
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
  commissionRate: number;
  producerName: string;
}

export interface AccountInformationResolved {
  accountInfo: AccountInformation | null;
  error?: any;
}

export interface PolicyInformation {
  quoteData: QuoteData;
  riskLocation: RiskLocation;
  policyEventCode: string;
  packageInd: string
  policyType: string | null
  policySymbol: string
  policyNo: string
  policyModNo: string
  enteredDate: Date
  policyId: number
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
  nyftz: string
  riskType: string
  assumedCarrier: string
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
export interface RiskLocation {

  policyId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  taxCode: string;
  countryCode: string;

}

export interface EndorsementResolved {
  endorsement: Endorsement | null;
  error?: any;
}

export interface Endorsement {
  policyId: number;
  endorsementNumber: number;
  transactionTypeCode: number;
  transactionEffectiveDate: Date;
  transactionExpirationDate: Date;
  terrorismCode: string;
  sir: number;
  premium: number;
  limit: number;
  attachmentPoint: number;
  invoiceStatus: string;
}

export interface AdditionalNamedInsuredsResolved {
  additionalNamedInsureds:  AdditionalNamedInsureds[] | null;
  error?: any;
}

export interface AdditionalNamedInsureds {
  intPolicyId: number;
  srtEndorsementNo: number;
  intSequenceNo: number;
  intRole : number;
  strName: string;
  intCreatedBy: number;
  dtmCreatedDate : Date;
  intModifiedBy? : number;
  dtmModifiedDate?: Date;
}

export interface EndorsementLocationResolved {
  endorsementLocation:  EndorsementLocation[] | null;
  error?: any;
}

export interface EndorsementLocation {
  policyId: number;
  endorsementNumber: number;
  sequence: number;
  street1: string;
  street2? : string | null;
  city: string;
  state? : string | null;
  county? : string | null;
  zip: string;
  isNew: boolean;
}
export const newEndorsementLocation = (): EndorsementLocation => ({
  policyId: 0,
  endorsementNumber: 0,
  sequence: 0,
  street1: '',
  street2: null,
  city: '',
  state: null,
  county: null,
  zip: '',
  isNew: true
});

