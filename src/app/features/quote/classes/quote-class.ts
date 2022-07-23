import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { SubmissionClass } from '../../submission/classes/SubmissionClass';
import { Quote } from '../models/quote';
import { QuoteChildValidation } from '../models/quote-child-validation';
import { ProgramClass } from './program-class';
import { PropertyQuoteClass } from './property-quote-class';
import { QuoteRateClass } from './quote-rate-class';

export class QuoteClass implements Quote {
  coverageTabValidation!: QuoteChildValidation;
  submissionNumber = 0;
  quoteId = 0;
  cuspNumber = 0;
  quoteNumber = 0;
  sequenceNumber = 0;
  policyEffectiveDate: Date | Moment | null = null;
  policyExpirationDate: Date | Moment | null = null;
  status = 0;
  coverageCode = 0;
  claimsMadeOrOccurrence = '';
  admittedStatus = '';
  policyNumber: string | number = '--';
  carrierCode = '';
  pacCode = '';
  quoteName = null;
  policySymbol = '';
  formName = '';
  terrorismCoverageSelected = false;
  terrorismPremium = null;
  terrorismTemplateCode = '';
  grossPremium = null;
  grossLimits = null;
  partOf = null;
  attachmentPoint = null;
  underlyingLimits = null;
  commissionRate = null;
  ratingBasis = null;
  riskSelectionComments = null;
  approvalRequired = false;
  approvalStatus = null;
  approvalUserName = null;
  approvalDate = null;
  comments = null;
  createdBy = '';
  createdDate: Date | Moment | null = null;
  modifiedUserName = null;
  modifiedDate = null;
  groupId = 3;
  programId = 0;
  validated = false;
  ratedPremium = null;
  auditCode = null;
  umuimAccepted = false;
  retainedLimit = null;
  approvalReason = null;
  retroDate = null;
  quoteExpirationDate = null;
  projectSpecific = false;
  generalAggregateLimits = null;
  productAggregateLimits = null;
  persInjAdvertInjLimits = null;
  fireDamageLimits = null;
  medicalPayments = null;
  fullPriorActs = false;
  validatedRisk = null;
  triaFormReceived = null;
  annualizedPremium = null;
  manualApprovalRequired = false;
  submissionGroupsStatusId = 1;
  modifiedUserId = null;
  approvalUserId = null;
  terrorismCoverage = null;
  minimumPremiumRequired = false;
  userFacultativeReins = false;
  excessOfAuto = false;
  underlyingUMLimit1Mil = false;
  umuimAcceptedLastYear = false;
  indicationPremium = null;
  printedAt = null;
  facTreatyType = null;
  premiumRate = null;
  ownerId = null;
  ownerUserId = null;
  flatRateIndicator = false;
  sinceInception = false;
  formsVersion = null; //intVersion in PAUL
  specPlusEndorsement = false;
  proRatePremium = false;
  overridePremium = false;
  ratingDataChanged = null;
  rated = null;
  overrideTRIAPremium = false;
  coinsurancePercentage = null;
  productManufactureDate = null;
  discontinuedProducts = null;
  autoCalcMiscPremium = false;
  minimumPremium = null;
  advancePremium = null;
  earnedPremiumPct = null;
  variesByLoc = false;
  pcfCharge = null;
  pcfChargeDesc = null;
  professionalAggregateLimits = null;
  professionalLiabilityLimits = null;
  qsPercentTotalTRIPRAPremium = null;
  quotaShare = false;
  qsPartOfLimits = null;
  qsPercentTotalPremium = null;
  quotaSharePercent = null;
  maxPolicyAggregate = null;
  displayCommissionRate = false;
  supportedStatus = null;
  ////////End Datbase fields
  mappingError = false;
  submission!: SubmissionClass;
  // quoteBuilding: QuoteBuildingClass[] = [];
  // quoteCoverage: QuoteCoverageClass[] = [];
  // quoteLocation: QuoteLocationClass[] = [];
  quoteRates: QuoteRateClass[] = [];
  propertyQuote!: PropertyQuoteClass;

  propertyQuoteMortgagee: MortgageeClass[] = [];
  propertyQuoteAdditionalInterest: AdditionalInterestClass[] = [];

  private _isDirty = false;
  isNew = false;
  invalidList: string[] = [];

  get isDirty(): boolean {
    return this._isDirty ;
  }
  get isValid(): boolean {
    // let valid = true;
    // valid = this.validate(valid);
    return true;
  }

  private datepipe = new DatePipe('en-US');


  constructor(quote?: Quote, program?: ProgramClass, submission?: SubmissionClass) {
    if (quote) {
      this.existingInit(quote);
    } else if (program && submission) {
      this.newInit(program, submission);
    }
  }
  existingInit(quote: Quote) {
    this.submissionNumber = quote.submissionNumber || 0;
    this.quoteId = quote.quoteId || 0;
    this.cuspNumber = quote.cuspNumber || 0;
    this.sequenceNumber = quote.sequenceNumber || 0;
    this.quoteNumber = quote.quoteNumber || 1;
    this.claimsMadeOrOccurrence = quote.claimsMadeOrOccurrence || '';
    this.admittedStatus = quote.admittedStatus || '';
    this.policyEffectiveDate = quote.policyEffectiveDate || null;
    this.policyExpirationDate = quote.policyExpirationDate || null;
    this.status = quote.status || 0;
    this.coverageCode = quote.coverageCode || 0;
    this.carrierCode = quote.carrierCode || '';
    this.pacCode = quote.pacCode || '';
    this.policySymbol = quote.policySymbol || '';
    this.terrorismTemplateCode = quote.terrorismTemplateCode || '';
    this.autoCalcMiscPremium = quote.autoCalcMiscPremium || false;
    this.programId = quote.programId || 0;
    this.submissionGroupsStatusId = quote.submissionGroupsStatusId || 0;
    this.submissionNumber = quote.submissionNumber || 0;
    this.displayCommissionRate = quote.displayCommissionRate || true;
    this.createdBy = quote.createdBy || '';
    this.createdDate = quote.createdDate || null;
    this.submission = new SubmissionClass(quote.submission);
    const rates: QuoteRateClass[] = [];
    quote.quoteRates?.forEach(element => {
      rates.push(new QuoteRateClass(element));
    });
    this.quoteRates = rates;
    this.propertyQuote = new PropertyQuoteClass(quote.propertyQuote);

    quote.propertyQuoteMortgagee?.forEach(x => {
      this.propertyQuoteMortgagee.push(new MortgageeClass(x));
    });

    quote.propertyQuoteAdditionalInterest?.forEach(x => {
      this.propertyQuoteAdditionalInterest.push( new AdditionalInterestClass(x));
    });
    this.setReadonlyFields();
    this.setRequiredFields();
    console.log(this.submission);
    //for demo purposes add empty coverage classes
    // this.quoteCoverages.push(new QuoteCoverageClass());
    // this.quoteCoverages.push(new QuoteCoverageClass());
  }
  newInit(program: ProgramClass, submission: SubmissionClass) {
    //if first quote on group attach to existing submission
    //else duplicate submission and attach to that
    //quote data will be tied to tblCUSP_Quotes
    //need to add record to tbl_SubmissionGroupQuotes
    console.log(program);
    this.submissionNumber = submission.submissionNumber;
    this.quoteNumber = 1;
    this.cuspNumber = 0; //Need to set on save
    this.quoteId = 0; //Need to set on save
    this.sequenceNumber = 0; //Need to set on save
    this.submission = submission;
    this.claimsMadeOrOccurrence = program.selectedCoverageCarrierMapping?.claimsMadeOrOccurrence || '';
    this.pacCode = program.selectedCoverageCarrierMapping?.defPacCode || '';
    this.carrierCode = program.selectedCoverageCarrierMapping?.defCarrierCode || '';
    this.policySymbol = program.selectedCoverageCarrierMapping?.policySymbol || '';
    this.formName = program.selectedCoverageCarrierMapping?.defCoverageForm || '';
    this.terrorismTemplateCode = program.selectedCoverageCarrierMapping?.defTRIATemplateCode || '';
    this.coverageCode = program.selectedCoverageCarrierMapping?.coverageCode || 0;
    this.admittedStatus = program.selectedCoverageCarrierMapping?.admittedStatus || '';
    this.policyEffectiveDate = submission.polEffDate;
    this.policyExpirationDate = submission.polExpDate;
    this.programId = program.programId;
    this.status = 1;
  }

  markClean() {
    this._isDirty = false;
  }
  markDirty() {
    this._isDirty = true;
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }
  areChildrenValid() {
    //TODO::Program specific validation
  }
  // validateCoverageTab(): QuoteChildValidation {
  //   const validation: QuoteChildValidation = {
  //     className: 'CoverageClass',
  //     isDirty: this.quoteCoverages.map(x => x.isDirty).includes(true),
  //     isValid: this.quoteCoverages.map(x => x.isValid).includes(true),
  //     canBeSaved: this.quoteCoverages.map(x => x.canBeSaved).includes(true),
  //     isEmpty: this.quoteCoverages.length === 0,
  //     errorMessages: this.quoteCoverages.flatMap(x => x.errorMessages)
  //   };
  //   return validation;
  //}
  // validate(valid: boolean): boolean {
  //   this.invalidList = [];
  //   if (!this.validateName()) {
  //     valid = false;
  //   }
  //   return valid;
  // }

  // validateName(): boolean {
  //   let valid = true;
  //   if (!this.name) {
  //     valid = false;
  //     this.invalidList.push('First Named Insured is required.');
  //   }
  //   return valid;
  // }


  toJSON() {
    return {
      submissionNumber: this.submissionNumber,
      quoteId: this.quoteId,
      cuspNumber: this.cuspNumber,
      quoteNumber: this.quoteNumber,
      sequenceNumber: this.sequenceNumber,
      policyEffectiveDate: this.policyEffectiveDate,
      policyExpirationDate: this.policyExpirationDate,
      status: this.status,
      claimsMadeOrOccurrence: this.claimsMadeOrOccurrence,
      admittedStatus: this.admittedStatus,
      policyNumber: this.policyNumber,
      coverageCode: this.coverageCode,
      carrierCode: this.carrierCode,
      pacCode: this.pacCode,
      createdBy: this.createdBy,
      createdDate: this.createdDate,
      submission: this.submission.toJSON(),
      policySymbol: this.policySymbol,
      formName: this.formName,
      programId: this.programId,
      autoCalcMiscPremium: this.autoCalcMiscPremium
    };
  }
}
