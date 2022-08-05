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
    cspCode: string | null;
    taxCode: string | null;
    description: string | null;
    occupancy: string | null;
    squareFeet: number | null;
    itv: number | null;
    yearBuilt: number | null;
    gutRehab: number | null;
    sprinklered: number | null;
    construction: string | null;
    stories: number | null;
    protectionClass: number | null;
    roof: number | null;
    wiring: number | null;
    plumbing: number | null;
    hvac: number | null;
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