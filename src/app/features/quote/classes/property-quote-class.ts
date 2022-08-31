
import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
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

export class PropertyQuoteClass implements PropertyQuote, Validation, QuoteAfterSave {
  propertyQuoteId: number | null = null;
  quoteId: number | null = null;

  propertyQuoteDeductible: PropertyQuoteDeductibleClass[] = [];
  propertyOptionalPremium: QuoteOptionalPremiumClass[] = [];
  coveragesTabValidation: QuoteValidationClass | null = null;

  termsAndConditionsTabValidation: QuoteValidationClass | null = null;

  propertyQuoteBuilding: PropertyQuoteBuildingClass[] = [];
  propertyQuoteBuildingLocationTabValidation: QuoteValidationClass | null = null;

  propertyQuoteMortgagee: MortgageeClass[] = [];
  propertyQuoteAdditionalInterest: AdditionalInterestClass[] = [];
  propertyQuoteMortgageeAdditionalInterestTabValidation: QuoteValidationClass | null = null;
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
    this.propertyOptionalPremium.push(new QuoteOptionalPremiumClass());
    console.log(this.propertyOptionalPremium);
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Quote, null);
    this.propertyQuoteBuildingLocationTabValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.PropertyLocationCoverages);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
    this.termsAndConditionsTabValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.TermsAndConditions);
    this.coveragesTabValidation= new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.CoveragePremium);

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
    this.propertyQuoteBuilding.map((c) =>
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
    this.propertyQuoteBuilding.map((element) => {
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
    return this.propertyQuoteBuilding?.length ?? 0;
  }
  calculateLargestPremTiv(){
    let largest = 0;
    this.propertyQuoteBuilding.map(x => {
      if (x.propertyQuoteBuildingCoverage.length == 0){
        this._largestPremTiv = 0;
      } else{

        const premAmounts: PropertyBuildingCoverageSubjectAmountData[] = [];

        this.propertyQuoteBuilding.map((element) => {
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
    this.propertyQuoteBuilding.map((c) => total += c.propertyQuoteBuildingCoverage.length ?? 0
    );
    return total;
  }

  get buildingList(): Code[] {
    const buildings: Code[] = [];
    const all: Code = {key: 0, code: 'All', description: 'All'};
    buildings.push(all);
    this.propertyQuoteBuilding.forEach((c) => {
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
      this.propertyQuoteBuilding.map(x => x.cspCode = null);
    } else {
      this.propertyQuoteBuilding.map(x => x.cspCode = String(value).toString().padStart(4,'0') + '  ');
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
    this.propertyQuoteBuilding.push(building);
    building.propertyQuote = this;
    building.focus = true;
    this.filterBuildings();
    this.calculateSubjectAmounts();
    this.calculateLargestPremTiv();
    this.calculateLargestExposure();
    this.calculateLawLimits();
  }

  deleteBuilding(building: PropertyQuoteBuildingClass) {
    const index = this.propertyQuoteBuilding.indexOf(building, 0);
    if (index > -1) {
      this.propertyQuoteBuilding.splice(index, 1);
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
    this.propertyQuoteDeductible.map(c => {
      if (c.premisesNumber == premisesNumber && c.buildingNumber == buildingNumber) {
        c.premisesNumber = null;
        c.buildingNumber = null;
        c.markDirty();
      }
    });
    this.propertyQuoteMortgagee.map(c => {
      if (c.premisesNumber == premisesNumber && c.buildingNumber == buildingNumber) {
        c.premisesNumber = null;
        c.buildingNumber = null;
        c.markDirty();
      }
    });
    this.propertyQuoteAdditionalInterest.map(c => {
      if (c.premisesNumber == premisesNumber && c.buildingNumber == buildingNumber) {
        c.premisesNumber = null;
        c.buildingNumber = null;
        c.markDirty();
      }
    });
  }

  clearCspCodes() {
    this.propertyQuoteBuilding.forEach(x => x.cspCode == null);
  }

  clearBuildings() {
    this.propertyQuoteBuilding = [];
    this.filteredBuildings = [];
    this.filteredCoverages = [];
  }
  filteredBuildings: PropertyQuoteBuildingClass[] = [];
  filteredCoverages: PropertyQuoteBuildingCoverageClass[] = [];

  filterBuildings() {
    const allBuildings: PropertyQuoteBuildingClass[] = [];
    this.propertyQuoteBuilding.map((element) => {
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
    propertyQuote.propertyQuoteDeductible.forEach((element) => {
      deductibles.push(new PropertyQuoteDeductibleClass(element));
    });
    this.propertyQuoteDeductible = deductibles;

    const mortgagee: MortgageeClass[] = [];
    propertyQuote.propertyQuoteMortgagee.forEach((element) => {
      mortgagee.push(new MortgageeClass(element));
    });
    this.propertyQuoteMortgagee = mortgagee;

    const ai: AdditionalInterestClass[] = [];
    propertyQuote.propertyQuoteAdditionalInterest.forEach((element) => {
      ai.push(new AdditionalInterestClass(element));
    });
    this.propertyQuoteMortgagee = mortgagee;
    this.propertyQuoteAdditionalInterest = ai;

    const buildings: PropertyQuoteBuildingClass[] = [];
    propertyQuote.propertyQuoteBuilding.forEach((element) => {
      const building = new PropertyQuoteBuildingClass(element);
      building.propertyQuote = this;
      buildings.push(building);
    });
    this.propertyQuoteBuilding = buildings;
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
    this.propertyQuoteBuildingLocationTabValidation?.validateChildrenAsStandalone(this.propertyQuoteBuilding);
    if (this.propertyQuoteBuildingLocationTabValidation?.isDirty) {
      //complex validations on building location tab
    }
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.validateChildrenAsStandalone(this.propertyQuoteMortgagee);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.validateChildrenAndMerge(this.propertyQuoteAdditionalInterest);
    //TODO: T&C

    //map this to validation results
    this._validationResults.mapValues(this);

    //map children to validation results
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteDeductible);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteMortgagee);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteAdditionalInterest);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteBuilding);

    return this._validationResults;
  }

  callChildValidations() {
    // Validate all buildings for duplicates
    this.validateBuildings();
    this.validateDeductibles();

    this.childArrayValidate(this.propertyQuoteDeductible);
    this.childArrayValidate(this.propertyQuoteMortgagee);
    this.childArrayValidate(this.propertyQuoteAdditionalInterest);
    this.childArrayValidate(this.propertyQuoteBuilding);
  }
  childArrayValidate(children: Validation[]) {
    children.forEach(child => {
      child.validate ? child.validate() : null;
    });
  }
  markChildrenClean() {
    this.cleanChildArray(this.propertyQuoteDeductible);
    this.cleanChildArray(this.propertyQuoteMortgagee);
    this.cleanChildArray(this.propertyQuoteAdditionalInterest);
    this.cleanChildArray(this.propertyQuoteBuilding);
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

  validateBuildings() {
    this.propertyQuoteBuilding.map(c => {
      if (c.isDuplicate) {
        c.isDuplicate = false;
      }
    });
    this.propertyQuoteBuilding.map(x => {
      if (!x.isDuplicate) {
        const dupes = this.propertyQuoteBuilding.filter(c => c.subjectNumber == x.subjectNumber && c.premisesNumber == x.premisesNumber && c.buildingNumber == x.buildingNumber);
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
    this.propertyQuoteDeductible.map(c => {
      if (c.isDuplicate) {
        c.isDuplicate = false;
      }
    });
    this.propertyQuoteDeductible.map(x => {
      if (!x.isDuplicate) {
        const dupes = this.propertyQuoteDeductible.filter(c => c.propertyDeductibleId == x.propertyDeductibleId && c.premisesNumber == x.premisesNumber && c.buildingNumber == x.buildingNumber);
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
    this.propertyQuoteDeductible.forEach(c => deductibles.push(c.toJSON()));

    const mortgagee: MortgageeData[] = [];
    this.propertyQuoteMortgagee.forEach(c => mortgagee.push(c.toJSON()));

    const ai: AdditionalInterestData[] = [];
    this.propertyQuoteAdditionalInterest.forEach(c => ai.push(c.toJSON()));

    const buildings: PropertyBuildingData[] = [];
    this.propertyQuoteBuilding.forEach(c => buildings.push(c.toJSON()));

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
