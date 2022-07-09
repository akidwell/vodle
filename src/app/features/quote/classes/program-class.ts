import { Code } from 'src/app/core/models/code';
import { Program } from '../models/program';
import { ProgramCoverageCarrierMapping } from '../models/program-coverage-carrier-mapping';
import { QuoteClass } from './quote-class';

export class ProgramClass implements Program {
  constructor(program: Program, availableCarrierCodes?: Code[], availablePacCodes?: Code[]) {
    this.init(program, availableCarrierCodes, availablePacCodes);
  }

  programId = 0;
  quoteData: QuoteClass | null = null;
  programDesc = '';
  ratingTabEnabled = false;
  availablePacCodes: Code[] = [];
  availableCarrierCodes: Code[] = [];
  selectedCoverageCarrierMapping: ProgramCoverageCarrierMapping | null = null;
  programCoverageCarrierMappings: ProgramCoverageCarrierMapping[] = [];

  init(program: Program, availableCarrierCodes?: Code[], availablePacCodes?: Code[]) {
    this.programId = program.programId;
    this.quoteData = program.quoteData;
    this.ratingTabEnabled = program.ratingTabEnabled;
    this.programDesc = program.programDesc;
    this.availableCarrierCodes = availableCarrierCodes || [];
    this.availablePacCodes = availablePacCodes || [];
    this.programCoverageCarrierMappings = program.programCoverageCarrierMappings;
    if (this.quoteData != null) {
      this.setCoverageCarrierMapping();
    }
  }
  setCoverageCarrierMapping() {
    if (this.quoteData != null) {
      this.selectedCoverageCarrierMapping = this.programCoverageCarrierMappings.find(m =>
        m.admittedStatus == this.quoteData?.admittedStatus &&
      m.coverageCode == this.quoteData.coverageCode &&
      m.claimsMadeOrOccurrence == this.quoteData.claimsMadeOrOccurrence) || null;
    }
    console.log(this.selectedCoverageCarrierMapping);
  }
}
