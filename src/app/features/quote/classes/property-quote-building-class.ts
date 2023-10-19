import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';
import { PropertyQuoteClass } from './property-quote-class';
import { PropertyBuildingCoverage } from '../models/property-building-coverage';
import { QuoteAfterSave } from '../models/quote-after-save';
import { Validation } from 'src/app/shared/interfaces/validation';
import { PropertyBuildingClass } from './property-building-class';
import { PropertyBuilding } from '../models/property-building';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { QuoteValidationClass } from './quote-validation-class';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';

export class PropertyQuoteBuildingClass extends PropertyBuildingClass implements Validation, QuoteAfterSave {


  private _validationResults!: QuoteValidationClass;
  constructor(building?: PropertyBuilding) {
    console.log('lalala' ,building?.propertyQuoteBuildingCoverage as PropertyQuoteBuildingCoverageClass[]);
    super(building);
    if (building) {
      this.classInit(building);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(ValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyLocationCoverages);
    this.validate();
  }
  onGuidNewMatch(T: PropertyQuoteBuildingClass): void {
    super.baseOnGuidNewMatch(T);
    this.propertyQuoteBuildingId = T.propertyQuoteBuildingId;
  }
  onGuidUpdateMatch(T: PropertyQuoteBuildingClass): void {
    super.baseOnGuidUpdateMatch(T);
  }
  validateObject(): ErrorMessage[] {
    return [];
  }
  classInit(building: PropertyBuilding) {
    this.propertyQuoteBuildingId = building.propertyQuoteBuildingId;
    this._subjectNumber = building.subjectNumber;
    this._premisesNumber = building.premisesNumber;
    this._buildingNumber = building.buildingNumber;
    this.existingInit(building);
  }
  propertyQuote!: PropertyQuoteClass;
  propertyQuoteId: number | null = 0;
  propertyPolicyId: number | null = null;
  endorsementBuildingId: number | null = 0;
  propertyQuoteBuildingId: number | null = null;

  public _validateOnLoad = true;

  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }

  get subjectNumber() : number | null {
    return this._subjectNumber;
  }
  set subjectNumber(value: number | null) {
    this._subjectNumber = value;
    this.markDirty();
    this.propertyQuoteBuildingCoverage.map(c => c.subjectNumber = value);
  }
  get errorMessages(): string[] {
    return this._errorMessages;
  }
  get buildingIndex(): string {
    return (this.subjectNumber ?? '') + '/' + (this.premisesNumber ?? '')+ '/' + (this.buildingNumber ?? '');
  }
  get premisesNumber() : number | null {
    return this._premisesNumber;
  }
  set premisesNumber(value: number | null) {
    this._premisesNumber = value;
    this.markDirty();
    this.propertyQuoteBuildingCoverage.map(c => c.premisesNumber = value);
    this.propertyQuote.calculateLargestPremTiv();
    this.propertyQuote.calculateLargestExposure();
    this.propertyQuote.calculateLawLimits();
  }
  get buildingNumber() : number | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: number | null) {
    // Need to Check with original value
    this.propertyQuote.onPremisesBuildingChange(this._premisesNumber,this._buildingNumber);
    this._buildingNumber = value;
    this.markDirty();
    this.propertyQuoteBuildingCoverage.map(c => c.buildingNumber = value);
  }
  validate(){
    if (this._validateOnLoad || this.isDirty){
      this.classValidation();
      this._validateOnLoad = false;
    }
    this._validationResults?.resetValidation();

    this.callChildValidations();
    this._validationResults.mapValues(this);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteBuildingCoverage);
    return this._validationResults;
  }

  copyCoverage(coverage: PropertyQuoteBuildingCoverageClass) {
    coverage.expand = true;
    coverage.focus = true;
    coverage.propertyQuoteBuildingCoverageId = 0;
    coverage.propertyQuoteBuildingId = 0;
    coverage.subjectNumber = this._subjectNumber;
    coverage.premisesNumber = this._premisesNumber;
    coverage.buildingNumber = this._buildingNumber;
    coverage.isNew = true;
    coverage.markDirty();
    this.propertyQuoteBuildingCoverage.push(coverage);
    this.propertyQuote.calculateSubjectAmounts();
    this.propertyQuote.calculateLargestPremTiv();
    this.propertyQuote.calculateLargestExposure();
    this.propertyQuote.calculateLawLimits();
  }

  deleteCoverage(coverage: PropertyQuoteBuildingCoverageClass) {
    const index = this.propertyQuoteBuildingCoverage.indexOf(coverage, 0);
    if (index > -1) {
      this.propertyQuote.propertyQuoteBuildingList.map(x => x.propertyQuoteBuildingCoverage.splice(index, 1));
      this.propertyQuoteBuildingCoverage.splice(index, 1);
      console.log('in delete cov list', this.propertyQuote.propertyQuoteBuildingList.map(x => x.propertyQuoteBuildingCoverage));
      coverage.markForDeletion = true;
      // Mark dirty to force form rules check
      this.propertyQuote.markDirty();
    }
    this.propertyQuote.calculateSubjectAmounts();
    this.propertyQuote.calculateLargestPremTiv();
    this.propertyQuote.calculateLargestExposure();
    this.propertyQuote.calculateLawLimits();
  }

  toJSON() {
    const coverages: PropertyBuildingCoverage[] = [];
    this.propertyQuoteBuildingCoverage.forEach(c => coverages.push(c.toJSON()));

    return {
      propertyQuoteBuildingId: this.propertyQuoteBuildingId,
      propertyQuoteId: this.propertyQuoteId,
      endorsementBuildingId: this.endorsementBuildingId,
      propertyPolicyId: this.propertyPolicyId,
      subjectNumber: this.subjectNumber,
      premisesNumber: this.premisesNumber,
      buildingNumber: this.buildingNumber,
      street1: this.street1,
      street2: this.street2,
      city: this.city,
      state: this.state,
      zip: this.zip,
      countryCode: this.countryCode,
      cspCode: this.cspCode,
      taxCode: this.taxCode,
      description: this.description,
      occupancy: this.occupancy,
      squareFeet: this.squareFeet,
      itv: this.itv,
      yearBuilt: this.yearBuilt,
      gutRehab: this.gutRehab,
      sprinklered: this.sprinklered,
      construction: this.construction,
      stories: this.stories,
      protectionClass: this.protectionClass,
      roof: this.roof,
      wiring: this.wiring,
      plumbing: this.plumbing,
      hvac: this.hvac,
      propertyQuoteBuildingCoverage: coverages,
      endorsementBuildingCoverage: coverages,
      guid: this.guid
    };
  }
}
