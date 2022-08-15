import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Code } from 'src/app/core/models/code';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { AdditionalInterestData } from '../models/additional-interest';
import { MortgageeData } from '../models/mortgagee';
import { PropertyBuildingData } from '../models/property-building';
import { PropertyBuildingCoverage, PropertyBuildingCoverageSubjectAmountData } from '../models/property-building-coverage';
import { PropertyDeductibleData } from '../models/property-deductible';
import { PropertyQuote } from '../models/property-quote';
import { QuoteValidation } from '../models/quote-validation';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';
import { PropertyQuoteDeductibleClass } from './property-quote-deductible-class';
import { QuoteValidationClass } from './quote-validation-class';

export class PropertyQuoteClass implements PropertyQuote, QuoteValidation {
  propertyQuoteId: number | null = null;
  quoteId: number | null = null;
  propertyQuoteDeductible: PropertyQuoteDeductibleClass[] = [];
  propertyQuoteBuilding: PropertyQuoteBuildingClass[] = [];
  propertyQuoteMortgagee: MortgageeClass[] = [];
  propertyQuoteAdditionalInterest: AdditionalInterestClass[] = [];

  private _riskDescription: string | null = null;
  private _isDirty = false;
  private _isValid = true;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  get riskDescription() : string | null {
    return this._riskDescription;
  }
  set riskDescription(value: string | null) {
    this._riskDescription = value;
    this._isDirty = true;
  }
  get limitTotal(): number {
    let total = 0;
    this.propertyQuoteBuilding.forEach((c) =>
      c.propertyQuoteBuildingCoverage.forEach((coverage) => (total += coverage.limit ?? 0))
    );
    return total;
  }

  get largestTiv(): number {
    let largest = 0;
    this.propertyQuoteBuilding.forEach(x => {
      if (x.propertyQuoteBuildingCoverage.length == 0){
        return 0;
      } else {
        const coverages: PropertyBuildingCoverage[] = [];
        this.propertyQuoteBuilding.forEach(element => {
          element.propertyQuoteBuildingCoverage.forEach(x => {
            coverages.push(new PropertyQuoteBuildingCoverageClass(x));
          });
        });
        largest = Math.max(...coverages.map( c => c.limit? c.limit : 0));
        return largest;
      }
    });
    return largest;
  }


  get subjectAmount(): Map<any,any> {
    const subjectAmounts: PropertyBuildingCoverageSubjectAmountData[] = [];

    this.propertyQuoteBuilding.forEach((element) => {
      element.propertyQuoteBuildingCoverage.forEach((x) => {
        const subAm: PropertyBuildingCoverageSubjectAmountData = {} as PropertyBuildingCoverageSubjectAmountData;
        subAm.subject = element.subjectNumber;
        subAm.limit = x.limit;
        subjectAmounts.push(subAm);
      });
    });
    const res = subjectAmounts.reduce((a, b) =>
      a.set(b.subject, (a.get(b.subject) || 0) + Number(b.limit)), new Map);

    return res;
  }

  get buildingCount(): number {
    return this.propertyQuoteBuilding?.length ?? 0;
  }

  get coverageCount(): number {
    let total = 0;
    this.propertyQuoteBuilding.forEach((c) => total += c.propertyQuoteBuildingCoverage.length ?? 0
    );
    return total;
  }

  get buildingList(): Code[] {
    // console.log('buildings');
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

  addBuilding(building: PropertyQuoteBuildingClass) {
    this.propertyQuoteBuilding.push(building);
    // this.propertyQuoteBuilding.forEach(c => c.focus = false);
    building.propertyQuote = this;
    building.focus = true;
    this.filterBuildings();
  }

  deleteBuilding(building: PropertyQuoteBuildingClass) {
    const index = this.propertyQuoteBuilding.indexOf(building, 0);
    if (index > -1) {
      this.propertyQuoteBuilding.splice(index, 1);
    }
    this.filterBuildings();
  }

  clearBuildings() {
    this.propertyQuoteBuilding = [];
    this.filteredBuildings = [];
    this.filteredCoverage = [];
  }
  filteredBuildings: PropertyQuoteBuildingClass[] = [];

  filteredCoverage: PropertyQuoteBuildingCoverageClass[] = [];

  filterBuildings() {
    const allBuildings: PropertyQuoteBuildingClass[] = [];
    this.propertyQuoteBuilding.forEach((element) => {
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
    const allChildren: PropertyQuoteBuildingCoverageClass[] = [];
    this.filteredBuildings.forEach((element) => {
      element.propertyQuoteBuildingCoverage.forEach((x) => {
        allChildren.push(x);
      });
    });
    this.filteredCoverage = allChildren;
  }

  filterBuildingsCoverages() {
    this.filterBuildings();
    this.filterCoverages();
  }

  constructor(propertyQuote?: PropertyQuote) {
    if (propertyQuote) {
      this.existingInit(propertyQuote);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyLocationCoverages);
    // this.propertyQuoteDeductible.push(new PropertyQuoteDeductibleClass());
    // this.propertyQuoteDeductible.push(new PropertyQuoteDeductibleClass());
    this.validate();
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
  existingInit(propertyQuote: PropertyQuote) {
    this.propertyQuoteId = propertyQuote.propertyQuoteId;
    this.quoteId = propertyQuote.quoteId;
    this.riskDescription = propertyQuote.riskDescription;

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
  }
  validate(){
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this._isValid = true;
      this._canBeSaved = true;
      this._errorMessages = ['Property Quote'];
      this._validateOnLoad = false;
    }
    this._validationResults.mapValues(this);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteDeductible);
    return this._validationResults;
  }
  newInit() {
    this.setReadonlyFields();
    this.setRequiredFields();
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
