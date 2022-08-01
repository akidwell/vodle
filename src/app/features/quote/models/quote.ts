import { Moment } from 'moment';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { Submission } from '../../submission/models/submission';
import { PropertyQuote } from './property-quote';
import { QuoteRate } from './quote-rate';

export interface Quote {
  submissionNumber: number | null;
  quoteId: number | null;
  cuspNumber: number | null;
  quoteNumber: number | null;
  sequenceNumber: number | null;
  policyEffectiveDate: Date | Moment | null;
  policyExpirationDate: Date | Moment | null;
  status: number;
  claimsMadeOrOccurrence: string;
  admittedStatus: string;
  policyNumber: string | number;
  coverageCode: number | null;
  carrierCode: string;
  pacCode: string;
  submission: Submission;
  quoteName: string | null;
  policySymbol: string;
  formName: string;
  terrorismCoverageSelected: boolean;
  terrorismPremium: number | null;
  terrorismTemplateCode: string;
  grossPremium: number | null;
  grossLimits: number | null;
  partOf: number | null;
  attachmentPoint: number | null;
  underlyingLimits: number | null;
  commissionRate: number | null;
  ratingBasis: number | null;
  riskSelectionComments: string | null;
  approvalRequired: boolean;
  approvalStatus: string | null;
  approvalUserName: string | null;
  approvalDate: Date | Moment | null;
  comments: string | null;
  createdBy: string | null;
  createdDate: Date | Moment | null;
  modifiedUserName: string | null;
  modifiedDate: Date | Moment | null;
  groupId: number;
  programId: number;
  validated: boolean;
  ratedPremium: number | null;
  auditCode: string | null;
  umuimAccepted: boolean;
  retainedLimit: number | null;
  approvalReason: string | null;
  retroDate: Date | Moment | null;
  quoteExpirationDate: Date | Moment | null;
  projectSpecific: boolean;
  generalAggregateLimits: number | null;
  productAggregateLimits: number | null;
  persInjAdvertInjLimits: number | null;
  fireDamageLimits: number | null;
  medicalPayments: number | null;
  fullPriorActs: boolean;
  validatedRisk: string | null;
  triaFormReceived: string | null;
  annualizedPremium: number | null;
  manualApprovalRequired: boolean;
  submissionGroupsStatusId: number;
  modifiedUserId: number | null;
  approvalUserId: number | null;
  terrorismCoverage: string | null;
  minimumPremiumRequired: boolean;
  userFacultativeReins: boolean;
  excessOfAuto: boolean;
  underlyingUMLimit1Mil: boolean;
  umuimAcceptedLastYear: boolean;
  indicationPremium: number | null;
  printedAt: Date | Moment | null;
  facTreatyType: string | null;
  premiumRate: number | null;
  ownerId: number | null;
  ownerUserId: number | null;
  flatRateIndicator: boolean;
  sinceInception: boolean;
  formsVersion: number | null; //intVersion in PAUL
  specPlusEndorsement: boolean;
  proRatePremium: boolean;
  overridePremium: boolean;
  ratingDataChanged: boolean | null;
  rated: boolean | null;
  overrideTRIAPremium: boolean;
  coinsurancePercentage: number | null;
  productManufactureDate: Date | Moment | null;
  discontinuedProducts: boolean | null;
  autoCalcMiscPremium: boolean;
  minimumPremium: number | null;
  advancePremium: number | null;
  earnedPremiumPct: number | null;
  variesByLoc: boolean;
  pcfCharge: number | null;
  pcfChargeDesc: string | null;
  professionalAggregateLimits: number | null;
  professionalLiabilityLimits: number | null;
  qsPercentTotalTRIPRAPremium: number | null;
  quotaShare: boolean;
  qsPartOfLimits: number | null;
  qsPercentTotalPremium: number | null;
  quotaSharePercent: number | null;
  maxPolicyAggregate: string | null;
  displayCommissionRate: boolean;
  supportedStatus: string | null;
  quoteRates: QuoteRate[];
  propertyQuote: PropertyQuote;
  importWarnings: string[];
  importErrors: string[];
}
