import { NullVisitor } from "@angular/compiler/src/render3/r3_ast";
import { BooleanLiteral } from "typescript";

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
  commissionRate: number | null;
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
  packageInd: string;
  policyType: string | null;
  policySymbol: string;
  policyNo: string;
  policyModNo: string;
  fullPolicyNo: string;
  formattedPolicyNo: string;
  enteredDate: Date;
  policyId: number;
  policyInsuredState: string;
  policyEffectiveDate: Date;
  policyExpirationDate: Date;
  policyExtendedExpDate: Date;
  policyCancelDate: Date;
  programId: number;
  programName: string;
  riskGradeCode: string;
  auditCode: string;
  paymentFrequency: string;
  deregulationIndicator: string;
  nyftz: string;
  riskType: string;
  assumedCarrier: string;
  coinsurancePercentage: number;
  productManufactureDate: Date;
  submissionNumber: number;
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
  claimsMadeOrOccurrence: string;
  retroDate: Date | null;
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
  premium: number| null;
  limit: number;
  underlyingLimit: number;
  attachmentPoint: number;
}

export interface AdditionalNamedInsuredsResolved {
  additionalNamedInsureds:  AdditionalNamedInsureds[] | null;
  error?: any;
}

export interface AdditionalNamedInsureds {
  policyId: number;
  endorsementNo: number;
  sequenceNo: number;
  role? : number;
  name: string;
  createdBy: number;
  createdDate : Date;
  modifiedBy? : number;
  modifiedDate?: Date;
  isNew: boolean;
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
  street2 : string | null;
  city: string;
  state : string | null;
  county : string | null;
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

export interface PolicyLayerData {
  policyId: number;
  endorsementNo: number;
  policyLayerNo: number
  policyLayerAttachmentPoint?: number;
  policyLayerLimit?: number;
  policyLayerPremium?: number;
  invoiceNo: number| null;
  copyEndorsementNo: number| null;
  endType: number| null;
  transCode: number| null;
  transEffectiveDate: Date| null;
  transExpirationDate: Date| null;
  isNew: Boolean;
  reinsuranceData: ReinsuranceLayerData[];
}

export const newPolicyLayer = (policyId: number, endorsementNumber: number, policyLayerNo: number): PolicyLayerData => {
  return {
    policyId: policyId,
    endorsementNo: endorsementNumber,
    policyLayerNo: policyLayerNo,
    policyLayerAttachmentPoint: undefined,
    policyLayerLimit: undefined,
    policyLayerPremium: undefined,
    invoiceNo: null,
    copyEndorsementNo: null,
    endType: null,
    transCode: null,
    transEffectiveDate: null,
    transExpirationDate: null,
    reinsuranceData: [],
    isNew: true
  }
}

export interface ReinsuranceLayerData {
  policyId: number;
  endorsementNumber: number;
  policyLayerNo: number;
  reinsLayerNo: number;
  reinsLimit: number | null;
  reinsCededPremium: number | null;
  reinsCededCommRate: number;
  treatyType: string | null;
  treatyNo?: number | null;
  subTreatyNo: number | null;
  reinsurerCode: number | null;
  reinsCertificateNo?: string | null;
  proflag: number | null;
  enteredDate: Date | null;
  invoiceNo: number | null;
  payableNo: number | null;
  intermediaryNo: number | null;
  facBalance: number | null;
  cededPremium: number | undefined;
  cededCommission: number | null;
  sumIuscededPrmByTreatyInv: number | null;
  sumProcededPrmByTreatyInv: number | null;
  expirationDate: Date | null;
  cededCommissionRat: number | null;
  effectiveDate: Date | null;
  isFaculative: boolean | null;
  maxLayerLimit?: number | null;
  attachmentPoint?: number | null;
  isNew: Boolean;
}

export interface PolicyLayerDataResolved {
  policyLayer:  PolicyLayerData[] | null;
  error?: any;
}

export const newReinsuranceLayer = (policyId: number, endorsementNumber: number, policyLayerNo: number, reinsLayerNo: number): ReinsuranceLayerData => {
  return {
    policyId: policyId,
    endorsementNumber: endorsementNumber,
    policyLayerNo: policyLayerNo,
    reinsLayerNo!: reinsLayerNo,
    reinsLimit: null,
    reinsCededPremium: null,
    reinsCededCommRate: 0,
    treatyType: null,
    treatyNo: undefined,
    subTreatyNo: null,
    reinsurerCode: null,
    reinsCertificateNo: null,
    proflag: null,
    enteredDate: null,
    invoiceNo: null,
    payableNo: null,
    intermediaryNo: null,
    facBalance: null,
    cededPremium: 0,
    cededCommission: null,
    sumIuscededPrmByTreatyInv: null,
    sumProcededPrmByTreatyInv: null,
    expirationDate: null,
    cededCommissionRat: null,
    effectiveDate: null,
    isFaculative: false,
    attachmentPoint: undefined,
    isNew: true
    }
}

export interface EndorsementStatusData {
  policyId: number;
  endorsementNumber: number;
  invoiceStatus: string;
  invoiceStatusDescription: string;
  proFlag?: number | null;
  isPolicyValidated: boolean;
  isCoverageValidated: boolean;
  isReinsuranceValidated: boolean;
  isDirectQuote: boolean;
  endorsementReason: string | null;
}

export const newEndorsementStatusData = (policyId: number, endorsementNumber: number, endorsementReason: string): EndorsementStatusData => {
  return {
  policyId: policyId,
  endorsementNumber: endorsementNumber,
  invoiceStatus: "null",
  invoiceStatusDescription: "null",
  isPolicyValidated: false,
  isCoverageValidated: false,
  isReinsuranceValidated: false,
  isDirectQuote: false,
  endorsementReason: endorsementReason
}
};


export interface EndorsementStatusResolved {
  status: EndorsementStatusData | null;
  error?: any;
}

export interface PolicyData {
  policySymbol: string;
  policyNumber: string;
  submissionNumber: number | null;
  policyEffectiveDate: Date | null;
  policyExpirationDate: Date | null;
}

export const newPolicyData = (): PolicyData => {
  return {
    policySymbol: "",
    policyNumber: "",
    submissionNumber: null,
    policyEffectiveDate: null,
    policyExpirationDate: null
  }
}

// export interface PolicyResponse {
//   policyId: number;
// }

export interface PolicyAddResponse {
  isPolicyCreated: boolean;
  policyId: number;
}
