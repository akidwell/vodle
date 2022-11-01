import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
import { SubmissionClass } from '../../submission/classes/submission-class';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { Quote } from '../models/quote';
import { ProgramClass } from './program-class';
import { QuoteRateClass } from './quote-rate-class';
import { QuoteValidationClass } from './quote-validation-class';
import { QuoteRate } from '../models/quote-rate';
import { QuoteAfterSave } from '../models/quote-after-save';
import { Validation } from 'src/app/shared/interfaces/validation';
import { QuoteLineItemClass } from './quote-line-item-class';
import { QuoteLineItem } from '../models/quote-line-item';
import { ValidationClass } from 'src/app/shared/classes/validation-class';
import { PropertyQuoteClass } from './property-quote-class';
import { QuotePolicyFormClass } from './quote-policy-forms-class';
import { PolicyForm } from 'src/app/shared/interfaces/policy-form';
import { PolicyDatesRuleClass } from 'src/app/shared/classes/policy-dates-rule-class';
import { QuoteSubjectivitiesClass } from './quote-subjectivities-class';
import { Subjectivities } from 'src/app/shared/interfaces/subjectivities';
import { QuoteDisclaimersClass } from './quote-disclaimers-class';
import { Disclaimers } from 'src/app/shared/interfaces/disclaimers';
import { Warranties } from 'src/app/shared/interfaces/warranties';
import { QuoteWarrantiesClass } from './quote-warranties-class';

export abstract class QuoteClass extends PolicyDatesRuleClass implements Quote, Validation, QuoteAfterSave {
  _validateOnLoad = true;
  _validationResults: QuoteValidationClass;
  _canBeSaved = true;
  _errorMessages: string[] = [];
  _isValid = true;
  _classCode : number | null = null;
  _isDirty = false;
  isNew = false;
  invalidList: string[] = [];
  warningsList: string[] = [];
  warningsMessage = '';
  brokerCommission = 0;
  advancePremiumValue = 0;
  totalAdvancePremium = 0;

  submissionNumber = 0;
  quoteId = 0;
  cuspNumber = 0;
  quoteNumber = 0;
  sequenceNumber = 0;
  status = 0;
  statusDescription = '';
  coverageCode = 0;
  claimsMadeOrOccurrence = '';
  admittedStatus = '';
  policyNumber: string | number = '--';
  policyMod: string | null = '--';
  carrierCode = '';
  pacCode = '';
  quoteName = null;
  policySymbol = '';
  formName = '';
  terrorismCoverageSelected = false;
  terrorismTemplateCode = '';
  grossPremium = null;
  grossLimits = null;
  partOf = null;
  attachmentPoint = null;
  underlyingLimits = null;
  commissionRate: number | null = null;
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
  manualApprovalRequired = 'N';
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
  printedAt: Date | Moment | null = null;
  facTreatyType = null;
  premiumRate = null;
  ownerId: number | null = null;
  ownerUserId: number | null = null;
  flatRateIndicator = false;
  sinceInception = false;
  formsVersion: number | null = null; //intVersion in PAUL
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
  minimumPremium: number | null = null;
  advancePremium = null;
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
  displayCommissionRate = 0;
  supportedStatus = null;
  importWarnings = [];
  importErrors = [];
  naicsCode = null;
  sicCode = null;
  formsVersionDescription: string | null = null;
  departmentId: number | null = null;
  ////////End Database fields
  mappingError = false;
  submission!: SubmissionClass;
  quoteRates: QuoteRateClass[] = [];
  quoteRatesValidation: QuoteValidationClass | null = null;
  quoteLineItems: QuoteLineItemClass[] = [];
  quoteLineItemsValidation: QuoteValidationClass | null = null;
  quotePolicyForms: QuotePolicyFormClass[] = [];
  subjectivityData:QuoteSubjectivitiesClass[] = [];
  warrantyData:QuoteWarrantiesClass[] = [];
  disclaimerData:QuoteDisclaimersClass[] = [];

  propertyQuote!: PropertyQuoteClass;
  quoteValidation!: QuoteValidationClass;
  quoteChildValidations: QuoteValidationClass[] = [];

  showDirty = false ;

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
    this.markDirty();
  }
  private _riskState = '';

  get riskState() : string {
    return this._riskState;
  }

  set riskState(value: string) {
    this._riskState = value;
    this.markDirty();
  }

  private _totalPremium : number | null = null;
  get totalPremium() : number | null {
    return this._totalPremium;
  }
  set totalPremium(value: number | null) {
    this._totalPremium = value;
    this.markDirty();
  }
  private _terrorismPremium = 0;
  get terrorismPremium(): number {
    return this._terrorismPremium;
  }
  set terrorismPremium(value: number | null) {
    this.markDirty();
    this._terrorismPremium = value || 0;
  }
  private _earnedPremiumPct = 0;
  get earnedPremiumPct(): number {
    return this._earnedPremiumPct;
  }
  set earnedPremiumPct(value: number | null) {
    this.markDirty();
    this._earnedPremiumPct = value || 0;
  }
  get policyEffectiveDate() : Date | null {
    return this._policyEffectiveDate;
  }
  set policyEffectiveDate(value: Date | null) {
    this._policyEffectiveDate = value;
    this.markDirty();
    this.setWarnings();
  }

  get policyExpirationDate() : Date | null {
    return this._policyExpirationDate;
  }
  set policyExpirationDate(value: Date | null) {
    this._policyExpirationDate = value;
    this.markDirty();
    this.setWarnings();
  }

  constructor(quote?: Quote, program?: ProgramClass, submission?: SubmissionClass) {
    super();
    if (quote) {
      this.existingInit(quote);
    } else if (program && submission) {
      this.newInit(program, submission);
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Quote, null);
    this.setWarnings();
  }
  existingInit(quote: Quote) {
    this.submissionNumber = quote.submissionNumber || 0;
    this.quoteId = quote.quoteId || 0;
    this.cuspNumber = quote.cuspNumber || 0;
    this.sequenceNumber = quote.sequenceNumber || 0;
    this.quoteNumber = quote.quoteNumber || 1;
    this.claimsMadeOrOccurrence = quote.claimsMadeOrOccurrence || '';
    this.admittedStatus = quote.admittedStatus || '';
    this.status = quote.status || 0;
    this.statusDescription = quote.statusDescription || '';
    this.coverageCode = quote.coverageCode || 0;
    this.carrierCode = quote.carrierCode || '';
    this.pacCode = quote.pacCode || '';
    this.policySymbol = quote.policySymbol || '';
    this.policyNumber = quote.policyNumber || '--';
    this.policyMod = quote.policyMod || '--';
    this.terrorismTemplateCode = quote.terrorismTemplateCode || '';
    this.autoCalcMiscPremium = quote.autoCalcMiscPremium || false;
    this.programId = quote.programId || 0;
    this.submissionGroupsStatusId = quote.submissionGroupsStatusId || 0;
    this.submissionNumber = quote.submissionNumber || 0;
    this.commissionRate = quote.commissionRate || 17.5; //TODO: remove hardcode for service
    this.displayCommissionRate = quote.displayCommissionRate || 1;
    this.createdBy = quote.createdBy || '';
    this.createdDate = quote.createdDate || null;
    this.printedAt = quote.printedAt || null;
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
    this.formsVersion = quote.formsVersion;
    this.formsVersionDescription = quote.formsVersionDescription;
    this.departmentId = quote.departmentId;
    this.ownerUserId = quote.ownerUserId;
    this._classCode = quote.quoteRates[0]?.classCode || null;
    this._riskState = quote.riskState;
    this._totalPremium = quote.totalPremium;
    this._terrorismPremium = quote.terrorismPremium || 0;
    this._earnedPremiumPct = quote.earnedPremiumPct || 0;
    this._policyEffectiveDate = quote.policyEffectiveDate || null;
    this._policyExpirationDate = quote.policyExpirationDate || null;

    const policyForms: QuotePolicyFormClass[] = [];
    if(quote.quotePolicyForms) {
      quote.quotePolicyForms.forEach((element) => {
        policyForms.push(new QuotePolicyFormClass(element));
      });
    }
    this.quotePolicyForms = policyForms;

    const subs: QuoteSubjectivitiesClass[] = [];
    if(quote.subjectivityData) {
      quote.subjectivityData.forEach((element) => {
        subs.push(new QuoteSubjectivitiesClass(element));
      });
    }
    this.subjectivityData = subs;

    const disclaimers: QuoteDisclaimersClass[] = [];
    if(quote.disclaimerData) {
      quote.disclaimerData.forEach((element) => {
        disclaimers.push(new QuoteDisclaimersClass(element));
      });
    }
    this.disclaimerData = disclaimers;


    const warranties: QuoteWarrantiesClass[] = [];
    if(quote.warrantyData) {
      quote.warrantyData.forEach((element) => {
        warranties.push(new QuoteWarrantiesClass(element));
      });
    }
    this.warrantyData = warranties;


    this.setReadonlyFields();
    this.setRequiredFields();
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
    this.policyEffectiveDate = submission.policyEffectiveDate;
    this.policyExpirationDate = submission.policyExpirationDate;
    this.programId = program.programId;
    this.status = 1;
    this.riskState = '';
  }

  markClean() {
    this._isDirty = false;
    this.showDirty = false;
  }

  markDirty() {
    this._isDirty = true;
    this._validationResults.isDirty = true;
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
      this.showDirty = false;
    }
  }
  abstract markChildrenClean(): void;

  cleanChildArray(children: QuoteAfterSave[]) {
    children.forEach(child => {
      child.markStructureClean();
    });
  }

  // validateQuoteChildren() {
  //   this.quoteRatesValidation?.validateChildrenAsStandalone(this.quoteRates);
  //   console.log('Quote Rates: ', this.quoteRatesValidation);
  //   this.quoteRatesValidation?.validateChildrenAndMerge(this.quoteLineItems);

  //   //this.propertyQuoteMortgageeValidation?.validateChildrenAsStandalone(this.propertyQuoteMortgagee);
  //   //this.propertyQuoteAdditionalInterestValidation?.validateChildrenAsStandalone(this.propertyQuoteAdditionalInterest);
  // }

  validateQuote() {
    this._errorMessages = [];
    this._canBeSaved = true;
    this._isValid = true;
  }

  validateBase(){
    this.validateQuote();
    this.validateClass();
    return this.validationResults;
  }
  abstract validate(): ValidationClass;
  abstract validateClass(): void;

  sortForms() {
    this.quotePolicyForms = this.quotePolicyForms
      .sort((a,b) =>
        ((a.categorySequence ?? 9999) - (b.categorySequence ?? 9999)) ||
        ((a.sortSequence ?? 9999) - (b.sortSequence ?? 9999)) ||
        (a.formTitle?.localeCompare(b.formTitle ?? '')) ||
        (a.formName?.localeCompare(b.formName ?? '')) ||
        ((a.formIndex ?? 9999) - (b.formIndex ?? 9999))
      );
  }

  // validatePropertyQuote(quote: Validation){
  //   quote.validate ? quote.validate(): null;
  // }
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


  // onSave(savedQuote: QuoteClass) {
  //   this.onSaveBuilding(this.propertyQuote.propertyQuoteBuildingList,savedQuote);
  //   this.onSaveDeductible(this.propertyQuote.propertyQuoteDeductibleList,savedQuote);
  //   this.onSaveMortgagee(this.propertyQuote.propertyQuoteMortgageeList,savedQuote);
  //   this.onSaveAdditionalInterest(this.propertyQuote.propertyQuoteAdditionalInterestList,savedQuote);
  // }
  abstract onSave(savedQuote:PropertyQuoteClass): void;

  abstract calculateSummaryPremiums(): void;

  abstract toJSON(): Quote;

  baseToJSON(): Quote {
    const rates: QuoteRate[] = [];
    this.quoteRates.forEach(c => rates.push(c.toJSON(Number(this.classCode))));
    const lineItems: QuoteLineItem[] = [];
    this.quoteLineItems.forEach(c => lineItems.push(c.toJSON()));
    const forms: PolicyForm[] = [];
    this.quotePolicyForms.forEach(c => forms.push(c.toJSON()));
    const subjectivities: Subjectivities[] = [];
    this.subjectivityData.forEach(c => subjectivities.push(c.toJSON()));
    const warranties: Warranties[] = [];
    this.warrantyData.forEach(c => warranties.push(c.toJSON()));
    const disclaimers: Disclaimers[] = [];
    this.disclaimerData.forEach(c => disclaimers.push(c.toJSON()));
    return {
      submissionNumber: this.submissionNumber,
      quoteId: this.quoteId,
      cuspNumber: this.cuspNumber,
      quoteNumber: this.quoteNumber,
      sequenceNumber: this.sequenceNumber,
      policyEffectiveDate: this.policyEffectiveDate,
      policyExpirationDate: this.policyExpirationDate,
      status: this.status,
      statusDescription: this.statusDescription,
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
      propertyQuote: null,
      quoteRates: rates,
      quoteLineItems: lineItems,
      quotePolicyForms: forms,
      subjectivityData: subjectivities,
      warrantyData: warranties,
      disclaimerData: disclaimers,
      terrorismCoverage: this.terrorismCoverage,
      terrorismCoverageSelected: this.terrorismCoverageSelected,
      terrorismPremium: this.terrorismPremium,
      terrorismTemplateCode: this.terrorismTemplateCode,
      advancePremium: this.advancePremium,
      annualizedPremium: this.annualizedPremium,
      approvalDate: this.approvalDate,
      approvalReason: this.approvalReason,
      approvalRequired: this.approvalRequired,
      approvalStatus: this.approvalStatus,
      approvalUserId: this.approvalUserId,
      approvalUserName: this.approvalUserName,
      manualApprovalRequired: this.manualApprovalRequired,
      attachmentPoint: this.attachmentPoint,
      auditCode: this.auditCode,
      ratingBasis: this.ratingBasis,
      //variesByLoc: this.variesByLoc,
      coinsurancePercentage: this.coinsurancePercentage,
      comments: this.comments,
      commissionRate: this.commissionRate,
      //discontinuedProducts: this.discontinuedProducts,
      displayCommissionRate: this.displayCommissionRate,
      earnedPremiumPct: this.earnedPremiumPct,
      //excessOfAuto: this.excessOfAuto,
      facTreatyType: this.facTreatyType,
      fireDamageLimits: this.fireDamageLimits,
      //flatRateIndicator: this.flatRateIndicator,
      formsVersion: this.formsVersion,
      fullPriorActs: this.fullPriorActs,
      generalAggregateLimits: this.generalAggregateLimits,
      grossLimits: this.grossLimits,
      grossPremium: this.grossPremium,
      groupId: this.groupId,
      indicationPremium: this.indicationPremium,
      maxPolicyAggregate: this.maxPolicyAggregate,
      medicalPayments: this.medicalPayments,
      minimumPremium: this.minimumPremium,
      //minimumPremiumRequired: this.minimumPremiumRequired,
      modifiedDate: this.modifiedDate,
      modifiedUserId: this.modifiedUserId,
      modifiedUserName: this.modifiedUserName,
      naicsCode: this.naicsCode,
      //overridePremium: this.overridePremium,
      //overrideTRIAPremium: this.overrideTRIAPremium,
      ownerId: this.ownerId,
      ownerUserId: this.ownerUserId,
      partOf: this.partOf,
      pcfCharge: this.pcfCharge,
      pcfChargeDesc: this.pcfChargeDesc,
      persInjAdvertInjLimits: this.persInjAdvertInjLimits,
      premiumRate: this.premiumRate,
      printedAt: this.printedAt,
      productAggregateLimits: this.productAggregateLimits,
      productManufactureDate: this.productManufactureDate,
      professionalAggregateLimits: this.professionalAggregateLimits,
      professionalLiabilityLimits: this.professionalLiabilityLimits,
      projectSpecific: this.projectSpecific,
      //proRatePremium: this.proRatePremium,
      qsPartOfLimits: this.qsPartOfLimits,
      qsPercentTotalPremium: this.qsPercentTotalPremium,
      qsPercentTotalTRIPRAPremium: this.qsPercentTotalTRIPRAPremium,
      //quotaShare: this.quotaShare,
      quotaSharePercent: this.quotaSharePercent,
      quoteExpirationDate: this.quoteExpirationDate,
      quoteName: this.quoteName,
      rated: this.rated,
      ratedPremium: this.ratedPremium,
      //ratingDataChanged: this.ratingDataChanged,
      retainedLimit: this.retainedLimit,
      retroDate: this.retroDate,
      riskSelectionComments: this.riskSelectionComments,
      sicCode: this.sicCode,
      riskState: this.riskState,
      //sinceInception: this.sinceInception,
      //specPlusEndorsement: this.specPlusEndorsement,
      submissionGroupsStatusId: this.submissionGroupsStatusId,
      supportedStatus: this.supportedStatus,
      triaFormReceived: this.triaFormReceived,
      umuimAccepted: this.umuimAccepted,
      //umuimAcceptedLastYear: this.umuimAcceptedLastYear,
      underlyingLimits: this.underlyingLimits,
      //underlyingUMLimit1Mil: this.underlyingUMLimit1Mil,
      //userFacultativeReins: this.userFacultativeReins,
      validated: this.validated,
      validatedRisk: this.validatedRisk,
      importErrors: this.importErrors,
      importWarnings: this.importWarnings,
      totalPremium: this.totalPremium,
      formsVersionDescription: this.formsVersionDescription,
      departmentId: this.departmentId,
      policyMod: this.policyMod
    };
  }
}
