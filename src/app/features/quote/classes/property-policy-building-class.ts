
import { PropertyBuildingCoverage } from '../models/property-building-coverage';
import { PropertyBuildingClass } from './property-building-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { PropertyBuilding } from '../models/property-building';
import { QuoteValidationClass } from './quote-validation-class';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { PolicyValidation } from 'src/app/shared/interfaces/policy-validation';

export class PropertyPolicyBuildingClass extends PropertyBuildingClass implements PolicyValidation {
  addCoverage() {console.log('in add coverage');}

  validateObject(): ErrorMessage[] {
    this.classValidation();
    return this.errorMessagesList;
  }
  validate() {
    return new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyLocationCoverages);
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
  errorMessages!: string[];
  propertyPolicyId: number | null = null;
  propertyQuoteId: number | null = 0;
  endorsementBuildingId: number | null = 0;


  get subjectNumber() : number | null {
    return this._subjectNumber;
  }
  set subjectNumber(value: number | null) {
    this._subjectNumber = value ? parseInt(value.toString()) : null;
    this.markDirty();
    this.propertyBuildingCoverage.map(c => c.subjectNumber = value);
  }

  get premisesNumber() : number | null {
    return this._premisesNumber;
  }
  set premisesNumber(value: number | null) {
    this._premisesNumber = value ? parseInt(value.toString()) : null;
    this.markDirty();
    this.propertyBuildingCoverage.map(c => c.premisesNumber = value);
    // this.propertyQuote.calculateLargestPremTiv();
    // this.propertyQuote.calculateLargestExposure();
    // this.propertyQuote.calculateLawLimits();
  }
  get buildingNumber() : number | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: number | null) {
    // Need to Check with original value
  //  this.propertyQuote.onPremisesBuildingChange(this._premisesNumber,this._buildingNumber);
    this._buildingNumber = value ? parseInt(value.toString()) : null;
    this.markDirty();
    this.propertyBuildingCoverage.map(c => c.buildingNumber = value);
  }
  toJSON() {
    const coverages: PropertyBuildingCoverage[] = [];
    this.propertyBuildingCoverage.forEach(c => coverages.push(c.toJSON()));

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
      propertyBuildingCoverage: coverages,
      guid: this.guid,
      markForDeletion: this.markForDeletion ?? false,
      isNew: this.isNew

    };
  }
}
