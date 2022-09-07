import { AdditionalInterestData } from './additional-interest';
import { MortgageeData } from './mortgagee';
import { PropertyBuilding } from './property-building';
import { PropertyDeductible } from './property-deductible';

export interface PropertyQuote {
  propertyQuoteId: number;
  quoteId: number | null;
  riskDescription: string | null;

  // GAM are these needed? Need to look at more closely!!!
  propertyQuoteDeductibleList?: PropertyDeductible[];
  propertyQuoteBuildingList?: PropertyBuilding[];
  propertyQuoteMortgageeList?: MortgageeData[];
  propertyQuoteAdditionalInterestList?: AdditionalInterestData[];

  propertyQuoteDeductible?: PropertyDeductible[];
  propertyQuoteBuilding?: PropertyBuilding[];
  propertyQuoteMortgagee?: MortgageeData[];
  propertyQuoteAdditionalInterest?: AdditionalInterestData[];
}

// export interface PropertyQuote extends PropertyQuoteData {
//   searchSubject: string;
//   searchPremises: string;
//   searchBuilding: string;
//   searchAddress: string;
//   cspCode: Code | null;

//   addBuilding(building: PropertyBuilding): void;
//   deleteBuilding(building: PropertyBuilding): void;
//   clearBuildings(): void;
//   clearCspCodes():void;
// }
