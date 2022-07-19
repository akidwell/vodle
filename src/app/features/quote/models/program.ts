import { QuoteClass } from '../classes/quote-class';
import { ProgramCoverageCarrierMapping } from './program-coverage-carrier-mapping';
import { ProgramDeductibleMapping } from './program-deductible-mappings';

export interface Program {
  programId: number;
  programDesc: string;
  ratingTabEnabled: boolean;
  quoteData: QuoteClass | null;
  programCoverageCarrierMappings: ProgramCoverageCarrierMapping[];
  programDeductibleMappings: ProgramDeductibleMapping[];
}
