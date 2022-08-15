import { AdditionalInterestData } from './additional-interest';
import { MortgageeData } from './mortgagee';
import { PropertyBuilding, PropertyBuildingData } from './property-building';
import { PropertyDeductible } from './property-deductible';

export interface PropertyQuoteData {
  propertyQuoteId: number | null;
  quoteId: number | null;
  riskDescription: string | null;
  propertyQuoteDeductible: PropertyDeductible[];
  propertyQuoteBuilding: PropertyBuilding[];
  propertyQuoteMortgagee: MortgageeData[];
  propertyQuoteAdditionalInterest: AdditionalInterestData[];
}

export interface PropertyQuote extends PropertyQuoteData {
  searchSubject: string;
  searchPremises: string;
  searchBuilding: string;
  searchAddress: string;
  addBuilding(building: PropertyBuilding): void;
  deleteBuilding(building: PropertyBuilding): void;
  clearBuildings(): void;
}
