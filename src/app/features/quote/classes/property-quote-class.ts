
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Code } from 'src/app/core/models/code';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { Validation } from 'src/app/shared/interfaces/validation';
import { AdditionalInterestData } from '../models/additional-interest';
import { MortgageeData } from '../models/mortgagee';
import { PropertyBuilding } from '../models/property-building';
import { PropertyBuildingCoverageSubjectAmountData } from '../models/property-building-coverage';
import { PropertyDeductible } from '../models/property-deductible';
import { PropertyQuote } from '../models/property-quote';
import { QuoteAfterSave } from '../models/quote-after-save';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';
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

export class PropertyQuoteClass extends QuoteClass implements PropertyQuote, Validation, QuoteAfterSave {
  propertyQuoteId = 0;
  quote!: QuoteClass;
  //quoteId: number | null = null;

  propertyQuoteDeductibleList: PropertyQuoteDeductibleClass[] = [];
  propertyQuoteBuildingOptionalCoverage: QuoteOptionalPremiumClass[] = [];
  coveragesTabValidation: TabValidationClass | null = null;

  termsAndConditionsTabValidation: TabValidationClass | null = null;
  formsListTabValidation: TabValidationClass | null = null;

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
    this.validate();
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
    return this.propertyQuoteBuildingList?.length ?? 0;
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
  }

  calculateLargestExposure(){
    const lawLimit = this.lawLimits;
    const largestPremTiv = this.largestPremTiv;
    const exposure = lawLimit + largestPremTiv;
    if (this._lastLargestExposure != exposure){
      this._lastLargestExposure = exposure;
    }
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

  private _searchSubject = '';
  get searchSubject() : string {
    return this._searchSubject;
  }
  set searchSubject(value: string) {
    this._searchSubject = value;
    this.filterBuildingsCoverages();
  }
  private _searchPremises = '';
  get searchPremises() : string {
    return this._searchPremises;
  }
  set searchPremises(value: string) {
    this._searchPremises = value;
    this.filterBuildingsCoverages();
  }
  private _searchBuilding = '';
  get searchBuilding() : string {
    return this._searchBuilding;
  }
  set searchBuilding(value: string) {
    this._searchBuilding = value;
    this.filterBuildingsCoverages();
  }
  private _searchAddress = '';
  get searchAddress() : string {
    return this._searchAddress;
  }
  set searchAddress(value: string) {
    this._searchAddress = value;
    this.filterBuildingsCoverages();
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
    this.propertyQuoteBuildingList.push(building);
    building.propertyQuote = this;
    building.focus = true;
    building.markDirty();
    this.filterBuildings();
    this.calculateSubjectAmounts();
    this.calculateLargestPremTiv();
    this.calculateLargestExposure();
    this.calculateLawLimits();
  }

  deleteBuilding(building: PropertyQuoteBuildingClass) {
    const index = this.propertyQuoteBuildingList.indexOf(building, 0);
    if (index > -1) {
      this.propertyQuoteBuildingList.splice(index, 1);
      // Mark dirty to force form rules check
      this.markDirty();
    }
    if (building.propertyQuoteBuildingCoverage.length > 0) {
      this.filterBuildingsCoverages();
      this.calculateSubjectAmounts();
      this.calculateLargestPremTiv();
      this.calculateLargestExposure();
      this.calculateLawLimits();
    }
    else {
      this.filterBuildings();
      this.calculateSubjectAmounts();
      this.calculateLargestPremTiv();
      this.calculateLargestExposure();
      this.calculateLawLimits();
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

  clearBuildings() {
    this.propertyQuoteBuildingList = [];
    this.filteredBuildings = [];
    this.filteredCoverages = [];
    // TODO: GAM need to work on this
    // this.propertyQuoteDeductibleList.map(c => {c.premisesNumber = null; c.buildingNumber = null;});
  }

  filteredBuildings: PropertyQuoteBuildingClass[] = [];
  filteredCoverages: PropertyQuoteBuildingCoverageClass[] = [];

  filterBuildings() {
    const allBuildings: PropertyQuoteBuildingClass[] = [];
    this.propertyQuoteBuildingList.map((element) => {
      if ((this.searchSubject == '' || element.subjectNumber == Number(this.searchSubject)) &&
      (this.searchPremises == '' || element.premisesNumber == Number(this.searchPremises)) &&
      (this.searchBuilding == '' || element.buildingNumber == Number(this.searchBuilding)) &&
      (this.searchAddress == '' || element.address.toLowerCase().includes(this.searchAddress.toLowerCase()))) {
        allBuildings.push(element);
      }
    });
    this.filteredBuildings = allBuildings;
  }

  filterCoverages() {
    const filtered: PropertyQuoteBuildingCoverageClass[] = [];
    this.filteredBuildings.map((element) => {
      element.propertyQuoteBuildingCoverage.map((x) => {
        filtered.push(x);
      });
    });
    this.filteredCoverages = filtered;
  }

  filterBuildingsCoverages() {
    this.filterBuildings();
    this.filterCoverages();
  }

  existingClassInit(propertyQuote: PropertyQuote) {
    this.propertyQuoteId = propertyQuote.propertyQuoteId;
    //this.quoteId = propertyQuote.quoteId;
    this._riskDescription = propertyQuote.riskDescription;

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
    //this.propertyQuoteMortgageeList = mortgagee;
    this.propertyQuoteAdditionalInterestList = ai;

    const buildings: PropertyQuoteBuildingClass[] = [];
    if(propertyQuote.propertyQuoteBuilding) {
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

    this.filterBuildingsCoverages();
    this.setReadonlyFields();
    this.setRequiredFields();
    this.calculateSubjectAmounts();
    this.calculateLargestPremTiv();
    this.calculateLargestExposure();
    this.calculateLawLimits();
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
    this._validationResults.mapValues(this);
    //validate children
    this.callChildValidations();

    //tab validations
    this.validateLocationCoverageTab();
    this.validateCoveragesTab();
    this.validateMortgageeAdditionalInterestTab();
    this.validateTermsAndConditionsTab();
    this.validateFormsListTab();

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
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteBuildingOptionalCoverage);
    // Rest flag based on validation
    this.showDirty = this._validationResults.isDirty;
    return this._validationResults;
  }

  callChildValidations() {
    // Validate all buildings for duplicates
    this.validateBuildings();
    this.validateDeductibles();
    this.childArrayValidate(this.propertyQuoteDeductibleList);
    this.childArrayValidate(this.propertyQuoteMortgageeList);
    this.childArrayValidate(this.propertyQuoteAdditionalInterestList);
    this.childArrayValidate(this.propertyQuoteBuildingList);
    this.childArrayValidate(this.quoteLineItems);
    this.childArrayValidate(this.quoteRates);
    this.childArrayValidate(this.quotePolicyForms);
    this.childArrayValidate(this.subjectivityData);
    this.childArrayValidate(this.disclaimerData);
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
  markDirty() {
    this._isDirty = true;
    ////////////////////////
    this.showDirty = true;
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
    console.log(this.largestExposure);
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
    this.propertyQuoteBuildingLocationTabValidation?.validateChildrenAndMerge(this.propertyQuoteBuildingList);
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
  }
  validateTermsAndConditionsTab() {
    this.termsAndConditionsTabValidation?.resetValidation();
    this.termsAndConditionsTabValidation?.validateChildrenAsStandalone(this.subjectivityData);
    this.termsAndConditionsTabValidation?.validateChildrenAsStandalone(this.disclaimerData);
    console.log('TODO: Validate T&C');
  }
  validateMortgageeAdditionalInterestTab() {
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.resetValidation();
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.validateChildrenAsStandalone(this.propertyQuoteMortgageeList);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.validateChildrenAndMerge(this.propertyQuoteAdditionalInterestList);
  }
  validateFormsListTab() {
    this.formsListTabValidation?.resetValidation();
    this.formsListTabValidation?.validateChildrenAsStandalone(this.quotePolicyForms);
    console.log('TODO: Validate Forms');
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
  onSave(savedQuote: PropertyQuoteClass) {
    this.submission.policyEffectiveDate = moment(savedQuote.policyEffectiveDate).toDate();
    this.submission.policyExpirationDate = moment(savedQuote.policyExpirationDate).toDate();
    this.submission.policyTerm = PolicyTermEnum.custom;
    this.onSaveBuilding(this.propertyQuoteBuildingList,savedQuote);
    this.onSaveDeductible(this.propertyQuoteDeductibleList,savedQuote);
    this.onSaveMortgagee(this.propertyQuoteMortgageeList,savedQuote);
    this.onSaveOptionalCoverages(this.propertyQuoteBuildingOptionalCoverage,savedQuote);
    this.onSaveAdditionalInterest(this.propertyQuoteAdditionalInterestList,savedQuote);
    this.onSaveForms(savedQuote);
    this.onSaveSubjectivities(savedQuote);
    this.onSaveDisclaimers(savedQuote);
  }

  private onSaveForms(savedQuote: PropertyQuoteClass) {
    this.quotePolicyForms = savedQuote.quotePolicyForms;
  }

  private onSaveOptionalCoverages(coverages: QuoteOptionalPremiumClass[], savedQuote: PropertyQuoteClass): void {
    coverages.forEach(coverage => {
      if (coverage.isNew) {
        console.log(coverage);
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
    buildings.forEach(building => {
      if (building.isNew) {
        const match = savedQuote.propertyQuoteBuildingList.find(c => c.guid == building.guid);
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

  private onSaveCoverage(coverages: PropertyQuoteBuildingCoverageClass[], savedQuote: PropertyQuoteClass): void {
    coverages.forEach(coverage => {
      if (coverage.isNew) {
        const buildingMatch = savedQuote.propertyQuoteBuildingList.find(c => c.propertyQuoteBuildingId == coverage.building.propertyQuoteBuildingId);
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

  toJSON(): Quote {
    const obj = this.baseToJSON();
    obj.propertyQuote = this.classToJSON();
    console.log(obj);
    return obj;
  }

  classToJSON(): PropertyQuote {
    const deductibles: PropertyDeductible[] = [];
    this.propertyQuoteDeductibleList.forEach(c => deductibles.push(c.toJSON()));

    const mortgagee: MortgageeData[] = [];
    this.propertyQuoteMortgageeList.forEach(c => mortgagee.push(c.toJSON()));

    const ai: AdditionalInterestData[] = [];
    this.propertyQuoteAdditionalInterestList.forEach(c => ai.push(c.toJSON()));

    const buildings: PropertyBuilding[] = [];
    this.propertyQuoteBuildingList.forEach(c => buildings.push(c.toJSON()));

    const optionalCoverages: QuoteOptionalPremium[] = [];
    this.propertyQuoteBuildingOptionalCoverage.forEach(c => optionalCoverages.push(c.toJSON()));

    return {
      propertyQuoteId: this.propertyQuoteId,
      quoteId: this.quoteId,
      riskDescription: this.riskDescription,
      propertyQuoteDeductible: deductibles,
      propertyQuoteMortgagee: mortgagee,
      propertyQuoteAdditionalInterest: ai,
      propertyQuoteBuilding: buildings,
      propertyQuoteBuildingOptionalCoverage: optionalCoverages
    };
  }
}
