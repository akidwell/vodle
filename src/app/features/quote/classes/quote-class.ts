import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
import { SubmissionClass } from '../../submission/classes/SubmissionClass';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Quote } from '../models/quote';
import { QuoteValidation } from '../models/quote-validation';
import { ProgramClass } from './program-class';
import { PropertyQuoteClass } from './property-quote-class';
import { QuoteRateClass } from './quote-rate-class';
import { QuoteValidationClass } from './quote-validation-class';

export class QuoteClass implements Quote, QuoteValidation {
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _isValid = true;

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
  importWarnings = [];
  importErrors = [];
  ////////End Datbase fields
  mappingError = false;
  submission!: SubmissionClass;
  quoteRates: QuoteRateClass[] = [];
  quoteRatesValidation: QuoteValidationClass | null = null;

  propertyQuote!: PropertyQuoteClass;

  quoteValidation!: QuoteValidationClass;
  quoteChildValidations: QuoteValidationClass[] = [];

  private _isDirty = false;
  isNew = false;
  invalidList: string[] = [];

  get isDirty(): boolean {
    return this._isDirty ;
  }
  get isValid(): boolean {
    // let valid = true;
    // valid = this.validate(valid);
    return this._isValid;
  }
  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  get errorMessages(): string[] {
    return this._errorMessages;
  }
  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }
  private datepipe = new DatePipe('en-US');


  constructor(quote?: Quote, program?: ProgramClass, submission?: SubmissionClass) {
    console.log('quote constructor')
    if (quote) {
      this.existingInit(quote);
    } else if (program && submission) {
      this.newInit(program, submission);
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Quote, QuoteValidationTabNameEnum.CoveragePremium);
    this.validate();
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
    console.log(this.propertyQuote);
    this.setReadonlyFields();
    this.setRequiredFields();
    console.log(this.submission);
    this.validateQuoteChildren();
  }
  newInit(program: ProgramClass, submission: SubmissionClass) {
    //if first quote on group attach to existing submission
    //else duplicate submission and attach to that
    //quote data will be tied to tblCUSP_Quotes
    //need to add record to tbl_SubmissionGroupQuotes
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
  markImported() {
    this.propertyQuote.propertyQuoteBuilding.forEach(c => c.markImported());
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }

  // createPropertyLocationCoverageValidation() {
  //   this.propertyQuoteValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.PropertyLocationCoverages);

  // }
  // createPropertyMortgageeAdditionalInterestValidation() {
  //   this.mortgageeAdditionalInterestValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
  //   this.propertyQuoteAdditionalInterestValidation = this.propertyQuoteAdditionalInterest.length > 0 ? new QuoteValidationClass(QuoteValidationTypeEnum.Child, null) : null;
  //   this.propertyQuoteAdditionalInterestValidation?.addValidationToChildGroup(this.quoteChildValidations);

  //   this.propertyQuoteMortgageeValidation = this.propertyQuoteMortgagee.length > 0 ? new QuoteValidationClass(QuoteValidationTypeEnum.Child, null) : null;
  //   this.propertyQuoteMortgageeValidation?.addValidationToChildGroup(this.quoteChildValidations);
  // }
  validateQuoteChildren() {
    this.quoteRatesValidation?.validateChildrenAsStandalone(this.quoteRates);
    //this.propertyQuoteMortgageeValidation?.validateChildrenAsStandalone(this.propertyQuoteMortgagee);
    //this.propertyQuoteAdditionalInterestValidation?.validateChildrenAsStandalone(this.propertyQuoteAdditionalInterest);
  }
  validateQuote() {
    this._canBeSaved = true;
    this._errorMessages = ['quote'];
    this._isValid = true;
    this.validationResults.mapValues(this);
    this.validateQuoteChildren();
  }
  validate(){
    this.validateQuote();
    this.propertyQuote.validate();
    this.validationResults.mapValues(this);
    const childValidations: QuoteValidationClass[] = [];
    childValidations.push(this.propertyQuote.validationResults);
    if (this.quoteRatesValidation){
      childValidations.push(this.quoteRatesValidation);
    }
    this.validationResults.validateChildrenAndMerge(childValidations);
    console.log('final quote validation: ', this.validationResults);
    //TODO: class based validation checks
    this._validateOnLoad = false;
    return this.validationResults;
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
      autoCalcMiscPremium: this.autoCalcMiscPremium,
      propertyQuote: this.propertyQuote.toJSON()
    };
  }
}
