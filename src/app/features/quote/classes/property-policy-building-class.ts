
import { PropertyBuildingCoverage } from '../models/property-building-coverage';
import { PropertyBuildingClass } from './property-building-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { PropertyBuilding } from '../models/property-building';
import { QuoteValidationClass } from './quote-validation-class';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { PolicyValidation } from 'src/app/shared/interfaces/policy-validation';
import { PropertyPolicyBuildingCoverageClass } from './property-policy-building-coverage-class';

export class PropertyPolicyBuildingClass extends PropertyBuildingClass implements PolicyValidation {
  addCoverage() {
    const newCoverage = new PropertyPolicyBuildingCoverageClass();
    newCoverage.focus = true;
    newCoverage.subjectNumber = this._subjectNumber;
    newCoverage.premisesNumber = this._premisesNumber;
    newCoverage.buildingNumber = this._buildingNumber;
    newCoverage.propertyQuoteBuildingId = this.propertyQuoteBuildingId ?? 0;
    this.endorsementBuildingCoverage.push(newCoverage);
    this.property.calculateSubjectAmounts();
    this.property.calculateLargestPremTiv();
    this.property.calculateLargestExposure();
    this.property.calculateLawLimits();
    return newCoverage;
  }

  deleteCoverage(coverage: PropertyPolicyBuildingCoverageClass) {
    const index = this.endorsementBuildingCoverage.indexOf(coverage, 0);
    this.endorsementBuildingCoverage.splice(index, 1);

    if (index > -1) {
      coverage.markForDeletion = true;
    }
    this.property.calculateSubjectAmounts();
    this.property.calculateLargestPremTiv();
    this.property.calculateLargestExposure();
    this.property.calculateLawLimits();
  }

  copyCoverage(coverage: PropertyPolicyBuildingCoverageClass) {
    coverage.expand = true;
    coverage.focus = true;
    coverage.propertyQuoteBuildingCoverageId = 0;
    coverage.propertyQuoteBuildingId = 0;
    coverage.subjectNumber = this._subjectNumber;
    coverage.premisesNumber = this._premisesNumber;
    coverage.buildingNumber = this._buildingNumber;
    coverage.isNew = true;
    coverage.markDirty();
    this.endorsementBuildingCoverage.push(coverage);
    this.property.calculateSubjectAmounts();
    this.property.calculateLargestPremTiv();
    this.property.calculateLargestExposure();
    this.property.calculateLawLimits();
  }

  validateObject(): ErrorMessage[] {
    this.classValidation();
    return this.errorMessagesList;
  }
  validate() {
    return new QuoteValidationClass(ValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyLocationCoverages);
  }
  constructor(building?: PropertyBuilding) {
    super(building);
    if (building) {
      this.existingInit(building);
    } else {
      this.newInit();
    }
    this.validate();
    //////////////////////
    // if (!building) {
    //   this.markDirty();
    // }
  }

  onGuidNewMatch(T: PropertyPolicyBuildingClass): void {
    super.baseOnGuidNewMatch(T);
    this.endorsementBuildingId = T.endorsementBuildingId;
  }
  onGuidUpdateMatch(T: PropertyPolicyBuildingClass): void {
    super.baseOnGuidUpdateMatch(T);
  }
  errorMessages!: string[];
  propertyPolicyId: number | null = null;
  propertyQuoteId: number | null = 0;
  endorsementBuildingId: number | null = 0;

  get buildingIndex(): string {
    return (this.subjectNumber ?? '') + '/' + (this.premisesNumber ?? '')+ '/' + (this.buildingNumber ?? '');
  }
  get subjectNumber() : number | null {
    return this._subjectNumber;
  }
  set subjectNumber(value: number | null) {
    this._subjectNumber = value ? parseInt(value.toString()) : null;
    this.markDirty();
    this.endorsementBuildingCoverage.map(c => c.subjectNumber = value);
  }

  get premisesNumber() : number | null {
    return this._premisesNumber;
  }
  set premisesNumber(value: number | null) {
    this._premisesNumber = value ? parseInt(value.toString()) : null;
    this.markDirty();
    this.endorsementBuildingCoverage.map(c => c.premisesNumber = value);
    this.property.calculateLargestPremTiv();
    this.property.calculateLargestExposure();
    this.property.calculateLawLimits();
  }
  get buildingNumber() : number | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: number | null) {
    // Need to Check with original value
    this.property.onPremisesBuildingChange(this._premisesNumber,this._buildingNumber);
    this._buildingNumber = value ? parseInt(value.toString()) : null;
    this.markDirty();
    this.endorsementBuildingCoverage.map(c => c.buildingNumber = value);
  }

  toJSON() {
    const coverages: PropertyBuildingCoverage[] = [];
    this.endorsementBuildingCoverage.forEach(c => coverages.push(c.toJSON()));
    console.log('line 92' + coverages);
    return {
      endorsementBuildingId: this.endorsementBuildingId,
      propertyQuoteBuildingId: this.propertyQuoteBuildingId,
      propertyQuoteId: this.propertyQuoteId,
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
      guid: this.guid,
      markForDeletion: this.markForDeletion,
      isNew: this.isNew

    };
  }
}
