
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Code } from 'src/app/core/models/code';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { Validation } from 'src/app/shared/interfaces/validation';
import { AdditionalInterestData } from '../models/additional-interest';
import { MortgageeData } from '../models/mortgagee';
import { PropertyBuildingData } from '../models/property-building';
import { PropertyBuildingCoverageSubjectAmountData } from '../models/property-building-coverage';
import { PropertyDeductibleData } from '../models/property-deductible';
import { PropertyQuote } from '../models/property-quote';
import { QuoteAfterSave } from '../models/quote-after-save';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';
import { PropertyQuoteDeductibleClass } from './property-quote-deductible-class';
import { QuoteOptionalPremiumClass } from './quote-optional-premium-class';
import { QuoteValidationClass } from './quote-validation-class';
import { TabValidationClass } from 'src/app/shared/classes/tab-validation-class';

export class PropertyQuoteClass implements PropertyQuote, Validation, QuoteAfterSave {
  propertyQuoteId: number | null = null;
  quoteId: number | null = null;

  propertyQuoteDeductibleList: PropertyQuoteDeductibleClass[] = [];
  propertyOptionalPremiumList: QuoteOptionalPremiumClass[] = [];
  coveragesTabValidation: TabValidationClass | null = null;

  termsAndConditionsTabValidation: TabValidationClass | null = null;

  propertyQuoteBuildingList: PropertyQuoteBuildingClass[] = [];
  propertyQuoteBuildingLocationTabValidation: TabValidationClass | null = null;

  propertyQuoteMortgageeList: MortgageeClass[] = [];
  propertyQuoteAdditionalInterestList: AdditionalInterestClass[] = [];
  propertyQuoteMortgageeAdditionalInterestTabValidation: TabValidationClass | null = null;
  invalidList: string[] = [];

  private _riskDescription: string | null = null;
  private _isDirty = false;
  private _isValid = true;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;
  private _lastLargestExposure = 0;

  constructor(propertyQuote?: PropertyQuote) {
    if (propertyQuote) {
      this.existingInit(propertyQuote);
    } else {
      this.newInit();
    }
    this.propertyOptionalPremiumList.push(new QuoteOptionalPremiumClass());
    console.log(this.propertyOptionalPremiumList);
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Quote, null);
    this.propertyQuoteBuildingLocationTabValidation = new TabValidationClass(QuoteValidationTabNameEnum.PropertyLocationCoverages);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation = new TabValidationClass(QuoteValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
    this.termsAndConditionsTabValidation = new TabValidationClass(QuoteValidationTabNameEnum.TermsAndConditions);
    this.coveragesTabValidation= new TabValidationClass(QuoteValidationTabNameEnum.CoveragePremium);

    this.validate();
  }

  get riskDescription() : string | null {
    return this._riskDescription;
  }
  set riskDescription(value: string | null) {
    this._riskDescription = value;
    this._isDirty = true;
  }
  get limitTotal(): number {
    let total = 0;
    this.propertyQuoteBuildingList.map((c) =>
      c.propertyQuoteBuildingCoverage.map((coverage) => (total += coverage.limit ?? 0))
    );
    return total;
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
      if(this._lastLargestExposure != 0){
        this._isDirty = true;
      }
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
    // this.propertyQuoteBuilding.forEach(c => c.focus = false);

    building.propertyQuote = this;
    building.focus = true;
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

  existingInit(propertyQuote: PropertyQuote) {
    this.propertyQuoteId = propertyQuote.propertyQuoteId;
    this.quoteId = propertyQuote.quoteId;
    this._riskDescription = propertyQuote.riskDescription;

    const deductibles: PropertyQuoteDeductibleClass[] = [];
    console.log(propertyQuote);
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
    this.propertyQuoteMortgageeList = mortgagee;
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
      this.classValidation();
      this._validateOnLoad = false;
    }
    //reset validation results
    this._validationResults.resetValidation();

    //validate children
    this.callChildValidations();

    //tab validations
    this.validateLocationCoverageTab();
    this.validateCoveragesTab();
    this.validateMortgageeAdditionalInterestTab();
    this.validateTermsAndConditionsTab();

    //map this to validation results
    this._validationResults.mapValues(this);

    //map children to validation results
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteDeductibleList);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteMortgageeList);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteAdditionalInterestList);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteBuildingList);

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
  }
  cleanChildArray(children: QuoteAfterSave[]) {
    children.forEach(child => {
      child.markStructureClean();
    });
  }
  newInit() {
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
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }

  classValidation() {
    this.invalidList = [];
    this._canBeSaved = true;
    this._isValid = true;
    if (this.validateLargestExposure()) {
      this._isValid = false;
    }
    this._errorMessages = this.invalidList;
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
    this.propertyQuoteBuildingLocationTabValidation?.validateChildrenAsStandalone(this.propertyQuoteBuildingList);
  }
  validateCoveragesTab() {
    //this.coveragesTabValidation?.nullCheck();
    console.log('TODO: Validate Coverages');

  }
  validateTermsAndConditionsTab() {
    console.log('TODO: Validate T&C');
  }
  validateMortgageeAdditionalInterestTab() {
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.validateChildrenAsStandalone(this.propertyQuoteMortgageeList);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.validateChildrenAndMerge(this.propertyQuoteAdditionalInterestList);
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

  validateDeductibles() {
    this.propertyQuoteDeductibleList.map(c => {
      if (c.isDuplicate) {
        c.isDuplicate = false;
      }
    });
    this.propertyQuoteDeductibleList.map(x => {
      if (!x.isDuplicate) {
        const dupes = this.propertyQuoteDeductibleList.filter(c => c.propertyDeductibleId == x.propertyDeductibleId && c.premisesNumber == x.premisesNumber && c.buildingNumber == x.buildingNumber);
        if (dupes.length > 1) {
          dupes.forEach(c => {
            c.isDuplicate = true;
          });
        }
      }
    });
  }

  toJSON() {
    const deductibles: PropertyDeductibleData[] = [];
    this.propertyQuoteDeductibleList.forEach(c => deductibles.push(c.toJSON()));

    const mortgagee: MortgageeData[] = [];
    this.propertyQuoteMortgageeList.forEach(c => mortgagee.push(c.toJSON()));

    const ai: AdditionalInterestData[] = [];
    this.propertyQuoteAdditionalInterestList.forEach(c => ai.push(c.toJSON()));

    const buildings: PropertyBuildingData[] = [];
    this.propertyQuoteBuildingList.forEach(c => buildings.push(c.toJSON()));

    return {
      propertyQuoteId: this.propertyQuoteId,
      quoteId: this.quoteId,
      riskDescription: this.riskDescription,
      propertyQuoteDeductible: deductibles,
      propertyQuoteMortgagee: mortgagee,
      propertyQuoteAdditionalInterest: ai,
      propertyQuoteBuilding: buildings
    };
  }
}
