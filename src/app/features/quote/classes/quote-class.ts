import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
import { SubmissionClass } from '../../submission/classes/SubmissionClass';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { Quote } from '../models/quote';
import { ProgramClass } from './program-class';
import { PropertyQuoteClass } from './property-quote-class';
import { QuoteRateClass } from './quote-rate-class';
import { QuoteValidationClass } from './quote-validation-class';
import { QuoteRate } from '../models/quote-rate';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { PropertyQuoteDeductibleClass } from './property-quote-deductible-class';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { QuoteAfterSave } from '../models/quote-after-save';
import { Validation } from 'src/app/shared/interfaces/validation';
import { QuoteLineItemClass } from './quote-line-item-class';
import { QuoteLineItem } from '../models/quote-line-item';

export class QuoteClass implements Quote, Validation, QuoteAfterSave {
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _isValid = true;
  private _classCode : number | null = null;

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
  naicsCode = null;
  sicCode = null;
  ////////End Datbase fields
  mappingError = false;
  submission!: SubmissionClass;
  quoteRates: QuoteRateClass[] = [];
  quoteRatesValidation: QuoteValidationClass | null = null;

  quoteLineItems: QuoteLineItemClass[] = [];
  quoteLineItemsValidation: QuoteValidationClass | null = null;

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

  get classCode() : number | null {
    return this._classCode;
  }
  set classCode(value: number | null) {
    this._classCode = value == 0 ? null : value;
    this._isDirty = true;
  }
  private _riskState : string | null = null;

  get riskState() : string | null {
    return this._riskState;
  }

  constructor(quote?: Quote, program?: ProgramClass, submission?: SubmissionClass) {
    if (quote) {
      this.existingInit(quote);
    } else if (program && submission) {
      this.newInit(program, submission);
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Quote, null);
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
    const lineItems: QuoteLineItemClass[] = [];
    quote.quoteLineItems?.forEach(element => {
      lineItems.push(new QuoteLineItemClass(element));
    });
    this.quoteLineItems = lineItems;
    this.propertyQuote = new PropertyQuoteClass(quote.propertyQuote);
    this._classCode = quote.quoteRates[0].classCode || null;
    this._riskState = quote.riskState;

    this.setReadonlyFields();
    this.setRequiredFields();
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
    this.propertyQuote.propertyQuoteBuildingList.forEach(c => {
      c.markImported();
      c.calculateITV();
    });
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }
  markStructureClean() {
    this.markClean();
    this.markChildrenClean();
  }
  afterSave() {
    if (this._validationResults.canBeSaved) {
      this.markStructureClean();
    }
  }
  markChildrenClean() {
    console.log(this.propertyQuote);
    if (this.propertyQuote) {
      this.propertyQuote.markStructureClean();
    }
    this.cleanChildArray(this.quoteRates);
    this.cleanChildArray(this.quoteLineItems);

  }
  cleanChildArray(children: QuoteAfterSave[]) {
    children.forEach(child => {
      child.markStructureClean();
    });
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
    this.quoteRatesValidation?.validateChildrenAsStandalone(this.quoteLineItems);

    //this.propertyQuoteMortgageeValidation?.validateChildrenAsStandalone(this.propertyQuoteMortgagee);
    //this.propertyQuoteAdditionalInterestValidation?.validateChildrenAsStandalone(this.propertyQuoteAdditionalInterest);
  }
  validateQuote() {
    //this._canBeSaved = true;
    this._errorMessages = [];
    this._isValid = true;
    this.validateClassCode();
    this.validationResults.mapValues(this);
    this.validateQuoteChildren();
  }

  validateClassCode(): boolean {
    let invalid = false;
    console.log(this.classCode);
    if (this.classCode == null){
      invalid = true;
      this._errorMessages.push('CSP Code is required');
    }
    return invalid;
  }

  validate(){
    this.validateQuote();
    this.propertyQuote?.validate();
    const childValidations: QuoteValidationClass[] = [];
    if (this.propertyQuote) {
      childValidations.push(this.propertyQuote?.validationResults);
    }
    if (this.quoteRatesValidation){
      childValidations.push(this.quoteRatesValidation);
    }
    if (this.quoteLineItemsValidation){
      childValidations.push(this.quoteLineItemsValidation);
    }
    console.log(childValidations);
    if (childValidations.length > 0) {
      this.validationResults.validateChildValidations(childValidations);
    }
    console.log('final quote validation: ', this.validationResults);
    //TODO: class based validation checks
    this._validateOnLoad = false;
    return this.validationResults;
  }
  validatePropertyQuote(quote: Validation){
    quote.validate ? quote.validate(): null;
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


  onSave(savedQuote: QuoteClass) {
    this.onSaveBuilding(this.propertyQuote.propertyQuoteBuildingList,savedQuote);
    this.onSaveDeductible(this.propertyQuote.propertyQuoteDeductibleList,savedQuote);
    this.onSaveMortgagee(this.propertyQuote.propertyQuoteMortgageeList,savedQuote);
    this.onSaveAdditionalInterest(this.propertyQuote.propertyQuoteAdditionalInterestList,savedQuote);
  }

  private onSaveMortgagee(mortgagees: MortgageeClass[], savedQuote: QuoteClass): void {
    mortgagees.forEach(mortgagee => {
      if (mortgagee.isNew) {
        const match = savedQuote.propertyQuote.propertyQuoteMortgageeList.find(c => c.guid == mortgagee.guid);
        if (match != null) {
          mortgagee.propertyQuoteMortgageeId = match.propertyQuoteMortgageeId;
          mortgagee.propertyQuoteId = match.propertyQuoteId;
        }
        mortgagee.isNew = false;
        mortgagee.guid = '';
      }
    });
  }

  private onSaveAdditionalInterest(additionalInterests: AdditionalInterestClass[], savedQuote: QuoteClass): void {
    additionalInterests.forEach(additionalInterest => {
      if (additionalInterest.isNew) {
        const match = savedQuote.propertyQuote.propertyQuoteAdditionalInterestList.find(c => c.guid == additionalInterest.guid);
        if (match != null) {
          additionalInterest.propertyQuoteAdditionalInterestId = match.propertyQuoteAdditionalInterestId;
          additionalInterest.propertyQuoteId = match.propertyQuoteId;
        }
        additionalInterest.isNew = false;
        additionalInterest.guid = '';
      }
    });
  }

  private onSaveDeductible(deductibles: PropertyQuoteDeductibleClass[], savedQuote: QuoteClass): void {
    deductibles.forEach(deductible => {
      if (deductible.isNew) {
        const match = savedQuote.propertyQuote.propertyQuoteDeductibleList.find(c => c.guid == deductible.guid);
        if (match != null) {
          deductible.propertyQuoteDeductibleId = match.propertyQuoteDeductibleId;
          deductible.propertyQuoteId = match.propertyQuoteId;
        }
        deductible.isNew = false;
        deductible.guid = '';
      }
    });
  }

  private onSaveBuilding(buildings: PropertyQuoteBuildingClass[], savedQuote: QuoteClass): void {
    buildings.forEach(building => {
      if (building.isNew) {
        const match = savedQuote.propertyQuote.propertyQuoteBuildingList.find(c => c.guid == building.guid);
        if (match != null) {
          building.propertyQuoteBuildingId = match.propertyQuoteBuildingId;
          building.propertyQuoteId = match.propertyQuoteId;
        }
        building.isNew = false;
        building.guid = '';
      }
      this.onSaveCoverage(building.propertyQuoteBuildingCoverage, savedQuote);
    });
  }

  private onSaveCoverage(coverages: PropertyQuoteBuildingCoverageClass[], savedQuote: QuoteClass): void {
    coverages.forEach(coverage => {
      if (coverage.isNew) {
        const buildingMatch = savedQuote.propertyQuote.propertyQuoteBuildingList.find(c => c.propertyQuoteBuildingId == coverage.building.propertyQuoteBuildingId);
        const coverageMatch = buildingMatch?.propertyQuoteBuildingCoverage.find(c => c.guid == coverage.guid);
        if (coverageMatch != null) {
          coverage.propertyQuoteBuildingCoverageId = coverageMatch.propertyQuoteBuildingCoverageId;
          coverage.propertyQuoteBuildingId = coverageMatch.propertyQuoteBuildingId;
        }
        coverage.isNew = false;
        coverage.guid = '';
      }
    });
  }

  toJSON() {
    const rates: QuoteRate[] = [];
    this.quoteRates.forEach(c => rates.push(c.toJSON(Number(this.classCode))));
    const lineItems: QuoteLineItem[] = [];
    this.quoteLineItems.forEach(c => lineItems.push(c.toJSON()));
    console.log(lineItems);
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
      submission: this.submission?.toJSON(),
      policySymbol: this.policySymbol,
      formName: this.formName,
      programId: this.programId,
      classCode: this.classCode,
      autoCalcMiscPremium: this.autoCalcMiscPremium,
      propertyQuote: this.propertyQuote?.toJSON(),
      quoteRates: rates,
      quoteLineItems: lineItems
    };
  }
}
