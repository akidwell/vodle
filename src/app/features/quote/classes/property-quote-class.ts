
import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Code } from 'src/app/core/models/code';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { AdditionalInterestData } from '../models/additional-interest';
import { MortgageeData } from '../models/mortgagee';
import { PropertyBuildingData } from '../models/property-building';
import { PropertyBuildingCoverageSubjectAmountData } from '../models/property-building-coverage';
import { PropertyDeductibleData } from '../models/property-deductible';
import { PropertyQuote } from '../models/property-quote';
import { QuoteAfterSave } from '../models/quote-after-save';
import { QuoteValidation } from '../models/quote-validation';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';
import { PropertyQuoteDeductibleClass } from './property-quote-deductible-class';
import { QuoteValidationClass } from './quote-validation-class';

export class PropertyQuoteClass implements PropertyQuote, QuoteValidation, QuoteAfterSave {
  propertyQuoteId: number | null = null;
  quoteId: number | null = null;

  propertyQuoteDeductible: PropertyQuoteDeductibleClass[] = [];
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
  private _errorMessages: string[] = ['Property Quote'];
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
    this.propertyQuoteBuilding.map((c) =>
      c.propertyQuoteBuildingCoverage.map((coverage) => (total += coverage.limit ?? 0))
    );
    return total;
  }

  get subjectAmount(): Map<any,any> {
    const subjectAmounts: PropertyBuildingCoverageSubjectAmountData[] = [];

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


    return res;
  }

  get buildingCount(): number {
    return this.propertyQuoteBuilding?.length ?? 0;
  }
  get largestTiv(): number {
    let largest = 0;
    this.propertyQuoteBuilding.map(x => {
      if (x.propertyQuoteBuildingCoverage.length == 0){
        return 0;
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
        return largest;
      }
    });
    return largest;
  }

  get lawLimits(): number {
    return 0;
  }

  get largestExposure(): number {
    const lawLimit = this.lawLimits;
    const largestPremTiv = this.largestTiv;
    return lawLimit + largestPremTiv;
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
    this.propertyQuoteBuilding.forEach(x => x.cspCode = String(value).toString().padStart(4,'0') + '  ');
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
    if (building.propertyQuoteBuildingCoverage.length > 0) {
      this.filterBuildingsCoverages();
    }
    else {
      this.filterBuildings();
    }
  }

  onPremisesBuildingChange(premisesNumber: number | null, buildingNumber: number | null) {
    this.propertyQuoteDeductible.map(c => {
      if (c.premisesNumber == premisesNumber && c.buildingNumber == buildingNumber) {
        c.premisesNumber = null;
        c.buildingNumber = null;
      }
    });
    this.propertyQuoteMortgagee.map(c => {
      if (c.premisesNumber == premisesNumber && c.buildingNumber == buildingNumber) {
        c.premisesNumber = null;
        c.buildingNumber = null;
      }
    });
    this.propertyQuoteAdditionalInterest.map(c => {
      if (c.premisesNumber == premisesNumber && c.buildingNumber == buildingNumber) {
        c.premisesNumber = null;
        c.buildingNumber = null;
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

  constructor(propertyQuote?: PropertyQuote) {
    if (propertyQuote) {
      this.existingInit(propertyQuote);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Quote, null);
    this.propertyQuoteBuildingLocationTabValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.PropertyLocationCoverages);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
    this.termsAndConditionsTabValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.TermsAndConditions);
    this.coveragesTabValidation= new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.CoveragePremium);

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
    this. validateDeductibles();

    this.childArrayValidate(this.propertyQuoteDeductible);
    this.childArrayValidate(this.propertyQuoteMortgagee);
    this.childArrayValidate(this.propertyQuoteAdditionalInterest);
    this.childArrayValidate(this.propertyQuoteBuilding);
  }
  childArrayValidate(children: QuoteValidation[]) {
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
    this._errorMessages = this.invalidList;
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
