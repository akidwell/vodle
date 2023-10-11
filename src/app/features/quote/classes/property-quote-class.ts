
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Code } from 'src/app/core/models/code';
import { MortgageeClass } from 'src/app/shared/components/property-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { Validation } from 'src/app/shared/interfaces/validation';
import { AdditionalInterestData } from '../models/additional-interest';
import { MortgageeData } from '../models/mortgagee';
import { PropertyBuilding } from '../models/property-building';
import { PropertyBuildingCoverageSubjectAmountData } from '../models/property-building-coverage';
import { PropertyDeductible, PropertyQuoteDeductible } from '../models/property-deductible';
import { PropertyQuote } from '../models/property-quote';
import { QuoteAfterSave } from '../models/quote-after-save';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { PropertyBuildingCoverageClass } from './property-building-coverage-class';
import { PropertyQuoteDeductibleClass } from './property-quote-deductible-class';
import { QuoteOptionalPremiumClass } from './quote-optional-premium-class';
import { QuoteValidationClass } from './quote-validation-class';
import { TabValidationClass } from 'src/app/shared/classes/tab-validation-class';
import { QuoteClass } from './quote-class';
import { Quote } from '../models/quote';
import { SubmissionClass } from '../../submission/classes/submission-class';
import { ProgramClass } from './program-class';
import * as moment from 'moment';
import { PolicyTermEnum } from 'src/app/core/enums/policy-term-enum';
import { QuoteOptionalPremium } from '../models/quote-optional-premium';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';

export class PropertyQuoteClass extends QuoteClass implements  Validation, QuoteAfterSave {
  propertyQuoteId = 0;
  quote!: QuoteClass;
  //quoteId: number | null = null;
  minimumEarnedPremium = 0;

  propertyQuoteDeductibleList: PropertyQuoteDeductibleClass[] = [];
  propertyQuoteBuildingOptionalCoverage: QuoteOptionalPremiumClass[] = [];
  coveragesTabValidation: TabValidationClass | null = null;

  termsAndConditionsTabValidation: TabValidationClass | null = null;
  formsListTabValidation: TabValidationClass | null = null;
  summaryTabValidation: TabValidationClass | null = null;

  propertyQuoteBuildingList: PropertyQuoteBuildingClass[] = [];
  propertyQuoteBuildingLocationTabValidation: TabValidationClass | null = null;

  propertyQuoteMortgageeList: MortgageeClass[] = [];
  propertyQuoteAdditionalInterestList: AdditionalInterestClass[] = [];
  propertyQuoteMortgageeAdditionalInterestTabValidation: TabValidationClass | null = null;
  invalidList: string[] = [];

  private _riskDescription: string | null = null;
  //private _validationResults: QuoteValidationClass;
  private _lastLargestExposure = 0;

  constructor(quote?: Quote, program?: ProgramClass, submission?: SubmissionClass) {
    super(quote, program, submission);
    if (quote && quote.propertyQuote) {
      console.log(quote.propertyQuote.propertyQuoteBuildingList);
      this.existingClassInit(quote.propertyQuote);
    } else {
      this.newClassInit();
    }

    //this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Quote, null);
    this.propertyQuoteBuildingLocationTabValidation = new TabValidationClass(QuoteValidationTabNameEnum.PropertyLocationCoverages);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation = new TabValidationClass(QuoteValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
    this.termsAndConditionsTabValidation = new TabValidationClass(QuoteValidationTabNameEnum.TermsAndConditions);
    this.coveragesTabValidation = new TabValidationClass(QuoteValidationTabNameEnum.CoveragePremium);
    this.formsListTabValidation = new TabValidationClass(QuoteValidationTabNameEnum.FormsList);
    this.summaryTabValidation = new TabValidationClass(QuoteValidationTabNameEnum.Summary);
    this.validate();
  }

  private _rateEffectiveDate: Date | null = null;
  get rateEffectiveDate(): Date | null {
    return this._rateEffectiveDate;
  }
  set rateEffectiveDate(value: Date | null) {
    this.rateEffectiveDate = value;
  }

  get riskDescription() : string | null {
    return this._riskDescription;
  }
  set riskDescription(value: string | null) {
    this._riskDescription = value;
    this.markDirty();
    // this._isDirty = true;
  }
  get limitTotal(): number {
    let total = 0;
    this.propertyQuoteBuildingList.map((c) =>
      c.propertyQuoteBuildingCoverage.map((coverage) => (total += coverage.limit ?? 0))
    );
    return total;
  }

  get totalPremium(): number{
    let optionalPremTotal = 0;
    let ratesTotal = 0;

    this.propertyQuoteBuildingOptionalCoverage.map((x) => (optionalPremTotal += x.additionalPremium ?? 0));
    this.quoteRates.map((x) =>(ratesTotal += x.premium ?? 0));
    return Number(optionalPremTotal) + Number(ratesTotal);
  }

  private _subjectAmounts: Map<any,any> = new Map();

  get subjectAmounts(): Map<any,any> {
    return this._subjectAmounts;
  }
  set subjectAmounts(value: Map<any,any>) {
    this._subjectAmounts = value;
  }

  private _largestPremTiv = 0;

  get largestPremTiv():number {
    return this._largestPremTiv;
  }
  set largestPremTiv(value:number) {
    this._largestPremTiv = value;
  }

  private _largestExposure = 0;

  get largestExposure():number {
    return this._largestExposure;
  }
  set largestExposure(value:number) {
    this._largestExposure = value;
  }

  private _lawLimits = 0;

  get lawLimits():number {
    return this._lawLimits;
  }
  set lawLimits(value:number) {
    this._lawLimits = value;
  }

  calculateSubjectAmounts() {
    const subjectAmounts: PropertyBuildingCoverageSubjectAmountData[] = [];
    console.log(this);
    this.propertyQuoteBuildingList.map((element) => {
      element.propertyQuoteBuildingCoverage.map((x) => {
        const subAm: PropertyBuildingCoverageSubjectAmountData = {} as PropertyBuildingCoverageSubjectAmountData;
        subAm.subject = Number(element.subjectNumber);
        subAm.limit = x.limit;
        subjectAmounts.push(subAm);
      });
    });
    const res = subjectAmounts.reduce((a, b) =>
      a.set(b.subject, (a.get(b.subject) || 0) + Number(b.limit)), new Map);

    const sortedList = new Map([...res].sort((a, b) => b[1] - a[1]));

    this._subjectAmounts = sortedList;
  }

  get buildingCount(): number {
    return this.propertyQuoteBuildingList.filter(x=> !x.markForDeletion)?.length ?? 0;
  }
  calculateLargestPremTiv(){
    let largest = 0;
    this.propertyQuoteBuildingList.map(x => {
      if (x.propertyQuoteBuildingCoverage.length == 0){
        this._largestPremTiv = 0;
      } else{

        const premAmounts: PropertyBuildingCoverageSubjectAmountData[] = [];

        this.propertyQuoteBuildingList.map((element) => {
          element.propertyQuoteBuildingCoverage.map((x) => {
            const subAm: PropertyBuildingCoverageSubjectAmountData = {} as PropertyBuildingCoverageSubjectAmountData;
            subAm.subject = element.premisesNumber;
            subAm.limit = x.limit;
            premAmounts.push(subAm);
          });
        });
        const res = premAmounts.reduce((a, b) =>
          a.set(b.subject, (a.get(b.subject) || 0) + Number(b.limit)), new Map);

        largest = Math.max(...res.values());
        this._largestPremTiv = largest;
      }
    });
    this._largestPremTiv = largest;
  }

  calculateLawLimits(){
    this._lawLimits = 0;
    this.propertyQuoteBuildingOptionalCoverage.map((x) =>{
      if(x.coverageCode == 2 || x.coverageCode == 3 || x.coverageCode == 4 || x.coverageCode == 5)
      {
        this._lawLimits += x.limit ?? 0;
      }
    });
  }

  calculateLargestExposure(){
    const lawLimit = this.lawLimits;
    const largestPremTiv = this.largestPremTiv;
    const exposure = lawLimit + largestPremTiv;
    this._largestExposure = exposure;
  }

  get coverageCount(): number {
    let total = 0;
    this.propertyQuoteBuildingList.map((c) => total += c.propertyQuoteBuildingCoverage.length ?? 0
    );
    return total;
  }

  get buildingList(): Code[] {
    const buildings: Code[] = [];
    const all: Code = {key: 0, code: 'All', description: 'All'};
    buildings.push(all);
    this.propertyQuoteBuildingList.forEach((c) => {
      const building = (c.premisesNumber?.toString() ?? '') + '-' + (c.buildingNumber?.toString() ?? '');
      const code: Code = {key: 0, code: building, description: building + ' : ' + c.address};
      buildings.push(code);
    });
    return buildings;
  }

  private _cspCode! : Code;

  get cspCode() : Code {
    return this._cspCode;
  }
  set cspCode(value: Code) {
    this._cspCode = value;
    if(value == null){
      this.propertyQuoteBuildingList.map(x => x.cspCode = null);
    } else {
      this.propertyQuoteBuildingList.map(x => x.cspCode = String(value).toString().padStart(4,'0') + '  ');
    }
  }

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

  addBuilding(building: PropertyQuoteBuildingClass) {
    building.propertyQuoteBuildingId = 0;
    this.propertyQuoteBuildingList.push(building);
    building.propertyQuote = this;
    building.focus = true;
    building.isNew = true;
    building.isExpanded = true;
    building.markDirty();
    //this.filterBuildings();
    this.calculateSubjectAmounts();
    this.calculateLargestPremTiv();
    this.calculateLawLimits();
    this.calculateLargestExposure();
  }

  addCoverage(building: PropertyQuoteBuildingClass) {
    const newCoverage = new PropertyQuoteBuildingCoverageClass();
    newCoverage.focus = true;
    newCoverage.subjectNumber = building.subjectNumber;
    newCoverage.premisesNumber = building.premisesNumber;
    newCoverage.buildingNumber = building.buildingNumber;
    newCoverage.propertyQuoteBuildingId = building.propertyQuoteBuildingId ?? 0;
    newCoverage.isNew = true;
    newCoverage.guid = crypto.randomUUID();
    building.propertyQuoteBuildingCoverage.push(newCoverage);
    return newCoverage;
    //this.filterCoverages();
    // this.propertyQuote.calculateSubjectAmounts();
    // this.propertyQuote.calculateLargestPremTiv();
    // this.propertyQuote.calculateLargestExposure();
    // this.propertyQuote.calculateLawLimits();
  }

  addMortgagee(mortgagee: MortgageeClass){
    mortgagee.markDirty();
    mortgagee.isNew = true;
    mortgagee.mortgageeType = 1;
    this.propertyQuoteMortgageeList.push(mortgagee);
    this.markDirty();
  }

  addAdditionalInterest(additionalInterest: AdditionalInterestClass){
    additionalInterest.markDirty();
    additionalInterest.isNew = true;
    additionalInterest.additionalInterestType = 1;
    this.propertyQuoteAdditionalInterestList.push(additionalInterest);
    this.markDirty();
  }

  deleteBuilding(building: PropertyQuoteBuildingClass) {
    if (building instanceof PropertyQuoteBuildingClass) {
      const index = this.propertyQuoteBuildingList.indexOf(building, 0);
      if (index > -1) {
        this.propertyQuoteBuildingList.splice(index, 1);
        this.markDirty();
      }
      if (building.propertyQuoteBuildingCoverage.length > 0) {
        this.propertyQuoteBuildingList.map(x => {
          if(x.propertyQuoteBuildingId == building.propertyQuoteBuildingId){
            x.propertyQuoteBuildingCoverage = [];
          }
        });
      }
      this.calculateSubjectAmounts();
      this.calculateLargestPremTiv();
      this.calculateLawLimits();
      this.calculateLargestExposure();
    }
  }

  onPremisesBuildingChange(premisesNumber: number | null, buildingNumber: number | null) {
    this.propertyQuoteDeductibleList.map(c => {
      if (c.premisesNumber == premisesNumber && c.buildingNumber == buildingNumber) {
        c.premisesNumber = null;
        c.buildingNumber = null;
        c.markDirty();
      }
    });
    this.propertyQuoteMortgageeList.map(c => {
      if (c.premisesNumber == premisesNumber && c.buildingNumber == buildingNumber) {
        c.premisesNumber = null;
        c.buildingNumber = null;
        c.markDirty();
      }
    });
    this.propertyQuoteAdditionalInterestList.map(c => {
      if (c.premisesNumber == premisesNumber && c.buildingNumber == buildingNumber) {
        c.premisesNumber = null;
        c.buildingNumber = null;
        c.markDirty();
      }
    });
  }

  clearCspCodes() {
    this.propertyQuoteBuildingList.forEach(x => x.cspCode == null);
  }

  existingClassInit(propertyQuote: PropertyQuote) {
    this.propertyQuoteId = propertyQuote.propertyQuoteId;
    //this.quoteId = propertyQuote.quoteId;
    this._riskDescription = propertyQuote.riskDescription;
    this._rateEffectiveDate = propertyQuote.rateEffectiveDate;

    const deductibles: PropertyQuoteDeductibleClass[] = [];

    if(propertyQuote.propertyQuoteDeductible) {
      propertyQuote.propertyQuoteDeductible.forEach((element) => {
        deductibles.push(new PropertyQuoteDeductibleClass(element));
      });
    }
    this.propertyQuoteDeductibleList = deductibles;

    const mortgagee: MortgageeClass[] = [];
    if(propertyQuote.propertyQuoteMortgagee) {
      propertyQuote.propertyQuoteMortgagee.forEach((element) => {
        mortgagee.push(new MortgageeClass(element));
      });
    }
    this.propertyQuoteMortgageeList = mortgagee;

    const ai: AdditionalInterestClass[] = [];
    if(propertyQuote.propertyQuoteAdditionalInterest) {
      propertyQuote.propertyQuoteAdditionalInterest.forEach((element) => {
        ai.push(new AdditionalInterestClass(element));
      });
    }
    this.propertyQuoteAdditionalInterestList = ai;

    const buildings: PropertyQuoteBuildingClass[] = [];
    if(propertyQuote.propertyQuoteBuilding) {
      console.log('adsfasdf' + propertyQuote.propertyQuoteBuilding);
      propertyQuote.propertyQuoteBuilding.forEach((element) => {
        const building = new PropertyQuoteBuildingClass(element);
        building.propertyQuote = this;
        buildings.push(building);
      });
    }
    this.propertyQuoteBuildingList = buildings;

    const optionalCoverages: QuoteOptionalPremiumClass[] = [];
    if(propertyQuote.propertyQuoteBuildingOptionalCoverage) {
      propertyQuote.propertyQuoteBuildingOptionalCoverage.forEach((element) => {
        const oc = new QuoteOptionalPremiumClass(element);
        optionalCoverages.push(oc);
      });
    }
    this.propertyQuoteBuildingOptionalCoverage = optionalCoverages;

    //this.filterBuildingsCoverages();
    this.setReadonlyFields();
    this.setRequiredFields();
    this.calculateSubjectAmounts();
    this.calculateLargestPremTiv();
    this.calculateLawLimits();
    this.calculateLargestExposure();
  }
  validate(){
    console.log('validate property quote');
    //on load or if dirty validate this
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this.validateBase();
      this._validateOnLoad = false;
    }
    //reset validation results
    this._validationResults.resetValidation();
    //this._validationResults.mapValues(this);
    //validate children
    this.callChildValidations();
    //tab validations
    this.validateLocationCoverageTab();
    this.validateCoveragesTab();
    this.validateMortgageeAdditionalInterestTab();
    this.validateTermsAndConditionsTab();
    this.validateFormsListTab();
    this.validateSummaryTab();

    //map this to validation results
    this._validationResults.mapValues(this);

    //map children to validation results
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteDeductibleList);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteMortgageeList);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteAdditionalInterestList);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteBuildingList);
    this._validationResults.validateChildrenAndMerge(this.quoteRates);
    this._validationResults.validateChildrenAndMerge(this.quoteLineItems);
    this._validationResults.validateChildrenAndMerge(this.quotePolicyForms);
    this._validationResults.validateChildrenAndMerge(this.subjectivityData);
    this._validationResults.validateChildrenAndMerge(this.disclaimerData);
    this._validationResults.validateChildrenAndMerge(this.warrantyData);
    this._validationResults.validateChildrenAndMerge(this.generalRemarksData);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteBuildingOptionalCoverage);
    this._validationResults.validateChildrenAndMerge(this.internalNotesData);
    // Rest flag based on validation
    this.showDirty = this._validationResults.isDirty;
    return this._validationResults;
  }

  callChildValidations() {
    // Validate all buildings for duplicates
    this.validateBuildings();
    this.validateDeductibles();
    this.validateLineItems();
    this.validateAdditionalInterest();
    this.validateMortgagees();
    this.childArrayValidate(this.propertyQuoteDeductibleList);
    this.childArrayValidate(this.propertyQuoteMortgageeList);
    this.childArrayValidate(this.propertyQuoteAdditionalInterestList);
    this.childArrayValidate(this.propertyQuoteBuildingList as PropertyQuoteBuildingClass[]);
    this.childArrayValidate(this.quoteLineItems);
    this.childArrayValidate(this.quoteRates);
    this.childArrayValidate(this.quotePolicyForms);
    this.childArrayValidate(this.subjectivityData);
    this.childArrayValidate(this.disclaimerData);
    this.childArrayValidate(this.warrantyData);
    this.childArrayValidate(this.generalRemarksData);
    this.childArrayValidate(this.internalNotesData);
    this.childArrayValidate(this.propertyQuoteBuildingOptionalCoverage);
  }
  childArrayValidate(children: Validation[]) {
    children.forEach(child => {
      child.validate ? child.validate() : null;
    });
  }
  markChildrenClean() {
    this.cleanChildArray(this.propertyQuoteDeductibleList);
    this.cleanChildArray(this.propertyQuoteMortgageeList);
    this.cleanChildArray(this.propertyQuoteAdditionalInterestList);
    this.cleanChildArray(this.propertyQuoteBuildingList);
    this.cleanChildArray(this.quoteLineItems);
    this.cleanChildArray(this.quoteRates);
    this.cleanChildArray(this.quotePolicyForms);
    this.cleanChildArray(this.propertyQuoteBuildingOptionalCoverage);
    this.cleanChildArray(this.subjectivityData);
    this.cleanChildArray(this.disclaimerData);
    this.cleanChildArray(this.warrantyData);
    this.cleanChildArray(this.generalRemarksData);
    this.cleanChildArray(this.internalNotesData);
  }
  cleanChildArray(children: QuoteAfterSave[]) {
    children.forEach(child => {
      child.markStructureClean();
    });
  }
  newClassInit() {
    this.setReadonlyFields();
    this.setRequiredFields();
  }

  markClean() {
    this._isDirty = false;
  }
  markStructureClean() {
    this.markClean();
    this.markChildrenClean();
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }
  validateClass(): void {
    //this.validate();
    const childValidations: QuoteValidationClass[] = [];

    const classcode = this.validateClassCode();
    if (classcode)
    {
      this._isValid = false;
      this.validationResults.errorMessages.push(classcode);
      this._errorMessages.push(classcode);
    }

    if (this.propertyQuote) {
      childValidations.push(this.validationResults);
    }
    // if (this.quoteRatesValidation){
    //   childValidations.push(this.quoteRatesValidation);
    // }
    // if (this.quoteLineItemsValidation){
    //   childValidations.push(this.quoteLineItemsValidation);
    // }
    if (childValidations.length > 0) {
      this.validationResults.validateChildValidations(childValidations);
    }
    console.log('final quote validation: ', this.validationResults);
    //this._validateOnLoad = false;
  }
  classValidation() {
    this.invalidList = [];
    this._canBeSaved = true;
    this._isValid = true;

    const amountValidation = this.validateClassCode();
    if (amountValidation) {
      this._isValid = false;
      this._errorMessages.push(amountValidation);
    }

    if (this.validateLargestExposure()) {
      this._isValid = false;
    }
    this._errorMessages = this.invalidList;
  }

  validateClassCode(): string | null {
    if (this.classCode == null){
      return 'CSP Code is required';
    }
    return null;
  }

  validateLargestExposure(): boolean {
    let invalid = false;
    if (this.largestExposure > 15000000){
      invalid = true;
      this.invalidList.push('Largest Premises TIV + Building Law Limits is greater than 15,000,000');
    }
    return invalid;
  }
  validateLocationCoverageTab() {
    this.propertyQuoteBuildingLocationTabValidation?.resetValidation();
    const classCodeValidation = this.validateClassCode();
    if (classCodeValidation) {
      this.propertyQuoteBuildingLocationTabValidation?.errorMessages.push(classCodeValidation);
    }
    this.propertyQuoteBuildingLocationTabValidation?.validateChildrenAndMerge(this.propertyQuoteBuildingList as PropertyQuoteBuildingClass[]);
  }
  validateCoveragesTab() {
    this.coveragesTabValidation?.resetValidation();
    if (this.quoteRates.length > 0) {
      const amountValidation = this.quoteRates[0].validateAmount();
      if (amountValidation) {
        this.coveragesTabValidation?.errorMessages.push(amountValidation);
      }
    }
    this.coveragesTabValidation?.validateChildrenAndMerge(this.propertyQuoteDeductibleList);
    this.coveragesTabValidation?.validateChildrenAndMerge(this.propertyQuoteBuildingOptionalCoverage);
    this.coveragesTabValidation?.validateChildrenAndMerge(this.quoteLineItems);
  }
  validateTermsAndConditionsTab() {
    this.termsAndConditionsTabValidation?.resetValidation();
    this.termsAndConditionsTabValidation?.validateChildrenAsStandalone(this.subjectivityData);
    this.termsAndConditionsTabValidation?.validateChildrenAsStandalone(this.disclaimerData);
    this.termsAndConditionsTabValidation?.validateChildrenAsStandalone(this.generalRemarksData);
    this.termsAndConditionsTabValidation?.validateChildrenAsStandalone(this.warrantyData);
  }
  validateMortgageeAdditionalInterestTab() {
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.resetValidation();
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.validateChildrenAsStandalone(this.propertyQuoteMortgageeList);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.validateChildrenAndMerge(this.propertyQuoteAdditionalInterestList);
  }
  validateFormsListTab() {
    this.formsListTabValidation?.resetValidation();
    this.formsListTabValidation?.validateChildrenAsStandalone(this.quotePolicyForms);
    this.generalRemarksData.forEach(x => x.classValidation());
  }

  validateSummaryTab(){
    this._errorMessages = [];
    this.summaryTabValidation?.resetValidation();
    this.summaryTabValidation?.validateChildrenAsStandalone(this.internalNotesData);

    if(this.overridePremium){
      if(this.propertyPremium == null){
        this._errorMessages.push('Property Premium is Required');
        this._isDirty = true;
        this._isValid = false;
        //this._canBeSaved = false;
      }
    } if(this.overrideMinPolPrem){
      if(this.minimumPremium == null){
        this._errorMessages.push('Minimum Policy Premium is Required');
        this._isDirty = true;
        this._isValid = false;
        this._canBeSaved = false;

      }
    }
    if(this.commissionRate?.toString() == ''){
      this._errorMessages.push('Commission Rate is Required');
      this._isDirty = true;
      this._isValid = false;
      this._canBeSaved = false;
    }
  }
  validateBuildings() {
    this.propertyQuoteBuildingList.map(c => {
      if (c.isDuplicate) {
        c.isDuplicate = false;
      }
    });
    this.propertyQuoteBuildingList.map(x => {
      if (!x.isDuplicate) {
        const dupes = this.propertyQuoteBuildingList.filter(c => c.subjectNumber == x.subjectNumber && c.premisesNumber == x.premisesNumber && c.buildingNumber == x.buildingNumber);
        if (dupes.length > 1) {
          dupes.forEach(c => {
            c.isDuplicate = true;
          });
        }
      }

      // Check coverage for duplicates
      x.propertyQuoteBuildingCoverage.map(c => {
        if (c.isDuplicate) {
          c.isDuplicate = false;
        }
      });
      x.propertyQuoteBuildingCoverage.map(coverage => {
        if (!coverage.isDuplicate) {
          const dupes = x.propertyQuoteBuildingCoverage.filter(c => c.propertyCoverageId == coverage.propertyCoverageId);
          if (dupes.length > 1) {
            dupes.forEach(dupe => {
              dupe.isDuplicate = true;
            });
          }
        }
      });
    });
  }
  markImported() {
    this.propertyQuoteBuildingList.forEach(c => {
      c.markImported();
      c.calculateITV();
    });
    this.propertyQuoteBuildingOptionalCoverage.forEach(c => {
      c.markImported();
    });
    this.validate();
  }
  validateDeductibles() {
    this.propertyQuoteDeductibleList.map(c => {
      if (c.isDuplicate) {
        c.isDuplicate = false;
      }
    });
    this.propertyQuoteDeductibleList.map(x => {
      if (!x.isDuplicate) {
        const dupes = this.propertyQuoteDeductibleList.filter(c => c.propertyDeductibleId == x.propertyDeductibleId && (c.premisesNumber == x.premisesNumber && c.buildingNumber == x.buildingNumber && c.isAppliedToAll == x.isAppliedToAll));
        if (dupes.length > 1) {
          dupes.forEach(c => {
            c.isDuplicate = true;
          });
        }
      }
    });
  }

  validateLineItems() {
    this.quoteLineItems.forEach(a => a.isDuplicate = false);
    this.quoteLineItems.forEach(x => {
      if (!x.isDuplicate) {
        const dupes = this.quoteLineItems.filter(c => c.lineItemCode == x.lineItemCode);
        if (dupes.length > 1) {
          dupes.forEach(d =>{ d.isDuplicate = true;});
        }
      }
    });
  }

  validateAdditionalInterest() {
    this.propertyQuoteAdditionalInterestList.forEach(a => a.isDuplicate = false);
    this.propertyQuoteAdditionalInterestList.forEach(x => {
      if (!x.isDuplicate) {
        const dupes = this.propertyQuoteAdditionalInterestList.filter(c => c.interest?.toUpperCase() == x.interest?.toUpperCase());
        if (dupes.length > 1) {
          dupes.forEach(d =>{ d.isDuplicate = true;});
        }
      }
    });
  }

  validateMortgagees() {
    this.propertyQuoteMortgageeList.forEach(a => a.isDuplicate = false);
    this.propertyQuoteMortgageeList.forEach(x => {
      if (!x.isDuplicate) {
        const dupes = this.propertyQuoteMortgageeList.filter(c => c.mortgageHolder?.toUpperCase() == x.mortgageHolder?.toUpperCase());
        if (dupes.length > 1) {
          dupes.forEach(d =>{ d.isDuplicate = true;});
        }
      }
    });
  }
  // calculateSummaryPremiums(): void {
  //   //Add all commission eligible premium
  //   let premiumCommissionAvailable = this.quoteRates[0].premium ?? 0;
  //   this.propertyQuoteBuildingOptionalCoverage.map((coverage) => (coverage.isAccepted ? premiumCommissionAvailable += coverage.additionalPremium ?? 0 : 0));
  //   premiumCommissionAvailable += (this.terrorismCoverageSelected ? this.terrorismPremium || 0 : 0);
  //   this.brokerCommission = premiumCommissionAvailable * (this.commissionRate ? this.commissionRate/100 : 0);
  //   //Add all non-commission eligible items for total premium
  //   let advancePremiumValue = premiumCommissionAvailable;
  //   if (this.autoCalcMiscPremium) {
  //     this.advancePremium = advancePremiumValue;
  //     this.minimumPremium = this.advancePremium;
  //     this.totalAdvancePremium = advancePremiumValue;

  //   } else if (!this.autoCalcMiscPremium && this.minimumPremiumRequired){
  //     this.totalAdvancePremium = Number(this.advancePremium) + (this.terrorismCoverageSelected ? this.terrorismPremium || 0 : 0);
  //   }
  //   this.minimumEarnedPremium = (Number(this.advancePremium) * (this.earnedPremiumPct)) ?? 0;

  //   this.quoteLineItems.map((surchargeOrFee) => (advancePremiumValue += surchargeOrFee.amount ?? 0));
  // }
  calculatePropertyPremiums(): void {
    let propPremValue = 0;
    let ratesTotal = 0;

    // calculate broker commission, but not displayed on UI
    let premiumCommissionAvailable = this.quoteRates[0].premium ?? 0;
    this.propertyQuoteBuildingOptionalCoverage.map((coverage) => (coverage.isAccepted ? premiumCommissionAvailable += coverage.additionalPremium ?? 0 : 0));
    premiumCommissionAvailable += (this.terrorismCoverageSelected ? this.terrorismPremium || 0 : 0);
    this.brokerCommission = premiumCommissionAvailable * (this.commissionRate ? this.commissionRate/100 : 0);

    // calculate property premium
    this.propertyQuoteBuildingOptionalCoverage.map((coverage) => ((coverage.isAccepted && !coverage.isFlat) ? propPremValue += coverage.additionalPremium ?? 0 : 0));

    this.quoteRates.map((x) =>(ratesTotal += x.premium ?? 0));

    if(!this.overridePremium){
      this.propertyPremium = propPremValue + ratesTotal;
    }

    // calculate flat prem
    let flatPremValue = 0;
    this.propertyQuoteBuildingOptionalCoverage.map((coverage) => (coverage.isFlat ? flatPremValue += coverage.additionalPremium ?? 0 : 0));
    this.flatPremium = flatPremValue;

    //sub total premium
    let subTotal = 0;
    this.propertyQuoteBuildingOptionalCoverage.map((coverage) => (coverage.isAccepted ? subTotal += coverage.additionalPremium ?? 0 : 0));
    this.propertySubTotalPremium = subTotal + (this.quoteRates[0].premium ?? 0);
    if(this.overridePremium){
      this.propertySubTotalPremium = this.propertyPremium ?? 0 + this.flatPremium;
    }

    // total advance premium
    this.totalAdvancePremium = Number(this.propertySubTotalPremium) + (this.terrorismCoverageSelected ? this.terrorismPremium || 0 : 0);

    // minimum premiums
    if(this.overrideMinPolPrem){
      this.minimumEarnedPremium = (Number(this.minimumPremium) * (this.earnedPremiumPct)) ?? 0;
    } else {
      this.minimumPremium = this.totalAdvancePremium;
      this.minimumEarnedPremium = (Number(this.minimumPremium) * (this.earnedPremiumPct)) ?? 0;
    }
  }

  calculateMinEarnedPrem(): void {
    if(this.overrideMinPolPrem){
      this.minimumEarnedPremium = (Number(this.minimumPremium) * (this.earnedPremiumPct)) ?? 0;
    } else {
      this.minimumPremium = this.totalAdvancePremium;
      this.minimumEarnedPremium = (Number(this.minimumPremium) * (this.earnedPremiumPct)) ?? 0;
    }
  }


  onSave(savedQuote: PropertyQuoteClass) {
    console.log('savedquote', savedQuote);
    this.submission.policyEffectiveDate = moment(savedQuote.policyEffectiveDate).toDate();
    this.submission.policyExpirationDate = moment(savedQuote.policyExpirationDate).toDate();
    this.submission.policyTerm = PolicyTermEnum.custom;
    this.onSaveBuilding(this.propertyQuoteBuildingList as PropertyQuoteBuildingClass[],savedQuote);
    this.onSaveDeductible(this.propertyQuoteDeductibleList,savedQuote);
    this.onSaveMortgagee(this.propertyQuoteMortgageeList,savedQuote);
    this.onSaveOptionalCoverages(this.propertyQuoteBuildingOptionalCoverage,savedQuote);
    this.onSaveAdditionalInterest(this.propertyQuoteAdditionalInterestList,savedQuote);
    this.onSaveForms(savedQuote);
    this.onSaveSubjectivities(savedQuote);
    this.onSaveDisclaimers(savedQuote);
    this.onSaveWarranties(savedQuote);
    this.onSaveGeneralRemarks(savedQuote);
    this.onSaveInternalNotes(savedQuote);
    console.log('Property Quote after save: ', this);
  }

  private onSaveForms(savedQuote: PropertyQuoteClass) {
    this.quotePolicyForms = savedQuote.quotePolicyForms;
  }

  private onSaveOptionalCoverages(coverages: QuoteOptionalPremiumClass[], savedQuote: PropertyQuoteClass): void {
    coverages.forEach(coverage => {
      if (coverage.isNew) {
        const match = savedQuote.propertyQuoteBuildingOptionalCoverage.find(c => c.guid == coverage.guid);
        if (match != null) {
          coverage.propertyQuoteBuildingOptionalCoverageId = match.propertyQuoteBuildingOptionalCoverageId;
          coverage.quoteId = match.quoteId;
        }
        coverage.isNew = false;
        coverage.guid = '';
      }
    });
  }
  private onSaveSubjectivities(savedQuote: PropertyQuoteClass) {
    this.subjectivityData = savedQuote.subjectivityData;
  }
  private onSaveDisclaimers(savedQuote: PropertyQuoteClass) {
    this.disclaimerData = savedQuote.disclaimerData;
  }
  private onSaveWarranties(savedQuote: PropertyQuoteClass) {
    this.warrantyData = savedQuote.warrantyData;
  }

  private onSaveGeneralRemarks(savedQuote: PropertyQuoteClass) {
    this.generalRemarksData = savedQuote.generalRemarksData;
    this.generalRemarksData.map(x => x.isNew = false);
  }

  private onSaveInternalNotes(savedQuote: PropertyQuoteClass) {
    this.internalNotesData = savedQuote.internalNotesData;
    this.internalNotesData.map(x => x.isNew = false);
  }

  private onSaveMortgagee(mortgagees: MortgageeClass[], savedQuote: PropertyQuoteClass): void {
    mortgagees.forEach(mortgagee => {
      if (mortgagee.isNew) {
        const match = savedQuote.propertyQuoteMortgageeList.find(c => c.guid == mortgagee.guid);
        if (match != null) {
          mortgagee.propertyQuoteMortgageeId = match.propertyQuoteMortgageeId;
          mortgagee.propertyQuoteId = match.propertyQuoteId;
        }
        mortgagee.isNew = false;
        mortgagee.guid = '';
      }
    });
  }
  private onSaveAdditionalInterest(additionalInterests: AdditionalInterestClass[], savedQuote: PropertyQuoteClass): void {
    additionalInterests.forEach(additionalInterest => {
      if (additionalInterest.isNew) {
        const match = savedQuote.propertyQuoteAdditionalInterestList.find(c => c.guid == additionalInterest.guid);
        if (match != null) {
          additionalInterest.propertyQuoteAdditionalInterestId = match.propertyQuoteAdditionalInterestId;
          additionalInterest.propertyQuoteId = match.propertyQuoteId;
        }
        additionalInterest.isNew = false;
        additionalInterest.guid = '';
      }
    });
  }

  private onSaveDeductible(deductibles: PropertyQuoteDeductibleClass[], savedQuote: PropertyQuoteClass): void {
    deductibles.forEach(deductible => {
      if (deductible.isNew) {
        const match = savedQuote.propertyQuoteDeductibleList.find(c => c.guid == deductible.guid);
        if (match != null) {
          deductible.propertyQuoteDeductibleId = match.propertyQuoteDeductibleId;
          deductible.propertyQuoteId = match.propertyQuoteId;
        }
        deductible.isNew = false;
        deductible.guid = '';
      }
    });
  }

  private onSaveBuilding(buildings: PropertyQuoteBuildingClass[], savedQuote: PropertyQuoteClass): void {
    console.log('line861', buildings);
    buildings.forEach(building => {
      if (building.isNew) {
        const match = savedQuote.propertyQuoteBuildingList.find(c => c.guid == building.guid);
        if (match != null) {
          building.propertyQuoteBuildingId = match.propertyQuoteBuildingId;
        }
        building.isNew = false;
        //building.guid = '';
      }
      this.onSaveCoverage(building.propertyQuoteBuildingCoverage, savedQuote);
    });
  }

  private onSaveCoverage(coverages: PropertyBuildingCoverageClass[], savedQuote: PropertyQuoteClass): void {
    console.log('line 894', coverages);
    console.log('line 895' , savedQuote);
    coverages.forEach(coverage => {
      if (coverage.isNew) {
        const buildingMatch = savedQuote.propertyQuoteBuildingList.find(c => c.propertyQuoteBuildingId == coverage.propertyQuoteBuildingId);
        console.log('line 898', buildingMatch);
        const coverageMatch = savedQuote?.propertyQuoteBuildingList.flatMap(x => x.propertyQuoteBuildingCoverage).find(x => x.guid == coverage.guid);
        console.log('line 901', coverageMatch);

        if (coverageMatch != null) {
          coverage.propertyQuoteBuildingCoverageId = coverageMatch.propertyQuoteBuildingCoverageId ?? 0;
          coverage.propertyQuoteBuildingId = coverageMatch.propertyQuoteBuildingId;
        }
        coverage.isNew = false;
        //coverage.guid = '';
      }
    });
  }

  toJSON(): Quote {
    const obj = this.baseToJSON();
    obj.propertyQuote = this.classToJSON();
    console.log(obj);
    return obj;
  }

  classToJSON(): PropertyQuote {
    const deductibles: PropertyQuoteDeductible[] = [];
    this.propertyQuoteDeductibleList.forEach(c => deductibles.push(c.toJSON()));

    const mortgagee: MortgageeData[] = [];
    this.propertyQuoteMortgageeList.forEach(c => mortgagee.push(c.toJSON()));

    const ai: AdditionalInterestData[] = [];
    this.propertyQuoteAdditionalInterestList.forEach(c => ai.push(c.toJSON()));

    const buildings: PropertyBuilding[] = [];
    (this.propertyQuoteBuildingList as PropertyQuoteBuildingClass[]).forEach(c => buildings.push(c.toJSON()));

    const optionalCoverages: QuoteOptionalPremium[] = [];
    this.propertyQuoteBuildingOptionalCoverage.forEach(c => optionalCoverages.push(c.toJSON()));

    return {
      propertyQuoteId: this.propertyQuoteId,
      quoteId: this.quoteId,
      riskDescription: this.riskDescription,
      rateEffectiveDate: this.rateEffectiveDate,
      propertyQuoteDeductible: deductibles,
      propertyQuoteMortgagee: mortgagee,
      propertyQuoteAdditionalInterest: ai,
      propertyQuoteBuilding: buildings,
      propertyQuoteBuildingOptionalCoverage: optionalCoverages
    };
  }
}
