import { AdditionalInterestData } from './additional-interest';
import { MortgageeData } from './mortgagee';
import { PropertyBuilding } from './property-building';
import { PropertyDeductible } from './property-deductible';

export interface PropertyQuote {
    quoteId: number | null;
    riskDesciption: string | null;
    propertyQuoteDeductible: PropertyDeductible[];
    propertyQuoteBuilding: PropertyBuilding[];
    propertyQuoteMortgagee: MortgageeData[];
    propertyQuoteAdditionalInterest: AdditionalInterestData[];

}