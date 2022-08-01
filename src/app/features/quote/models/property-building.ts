import { PropertyBuildingCoverage } from './property-building-coverage';

export interface PropertyBuildingData {
    propertyQuoteBuildingId: number | null;
    propertyQuoteId: number | null;
    subjectNumber: number | null;
    premisesNumber: number | null;
    buildingNumber: number | null;
    street1: string | null;
    street2: string | null
    city: string | null;
    state: string | null;
    zip: string | null;
    countryCode: string | null;
    classCode: string | null;
    taxCode: string | null;
    description: string | null;
    occupancy: string | null;
    yearBuilt: string | null;
    gutRehab: string | null;
    sprinklered: string | null;
    construction: string | null;
    stories: string | null;
    protectionClass: string | null;
    roof: string | null;
    wiring: string | null;
    plumbing: string | null;
    hvac: string | null;
    isNew: boolean;
    propertyQuoteBuildingCoverage: PropertyBuildingCoverage[];
}

export interface PropertyBuilding extends PropertyBuildingData {
    isZipLookup: boolean;
    subjectNumberRequired: boolean;
    premisesNumberRequired: boolean;
    buildingNumberRequired: boolean;
    street1Required: boolean;
    zipRequired: boolean;
    cityRequired: boolean;
    stateRequired: boolean;
    zipReadonly: boolean;
    cityReadonly: boolean;
    stateReadonly: boolean;
    isImport: boolean;
    validateAddress: boolean;
    buildingIndex: string;
    address: string;
  }