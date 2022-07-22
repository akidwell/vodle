import { PropertyBuilding } from './property-building';
import { PropertyDeductible } from './property-deductible';

export interface PropertyQuote {
    quoteId: number | null;
    riskDescription: string | null;
    propertyQuoteDeductible: PropertyDeductible[];
    propertyQuoteBuilding: PropertyBuilding[];
}