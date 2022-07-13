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
  defaultAdmittedStatus = '';
  defaultClaimsMadeOrOccurrence = '';
  availablePacCodes: Code[] = [];
  availableCarrierCodes: Code[] = [];
  allCarrierCodes: Code[] = [];
  allPacCodes: Code[] = [];
  selectedCoverageCarrierMapping: ProgramCoverageCarrierMapping | null = null;
  programCoverageCarrierMappings: ProgramCoverageCarrierMapping[] = [];

  init(program: Program, availableCarrierCodes?: Code[], availablePacCodes?: Code[]) {
    this.programId = program.programId;
    this.quoteData = program.quoteData ? new QuoteClass(program.quoteData || undefined) : null;
    this.ratingTabEnabled = program.ratingTabEnabled;
    this.programDesc = program.programDesc;
    this.allCarrierCodes = availableCarrierCodes || [];
    this.allPacCodes = availablePacCodes || [];
    this.availableCarrierCodes = availableCarrierCodes || [];
    this.availablePacCodes = availablePacCodes || [];
    this.programCoverageCarrierMappings = program.programCoverageCarrierMappings;
    this.setCoverageCarrierMapping();
  }
  updateGlobalSettings(admittedStatus: string, claimsMadeOrOccurrence: string) {
    if (this.quoteData != null) {
      this.quoteData.admittedStatus = admittedStatus;
      this.quoteData.claimsMadeOrOccurrence = claimsMadeOrOccurrence;
      console.log('admittedStatus: ',this.quoteData.admittedStatus, 'claimsMadeOrOccurrence: ', this.quoteData.claimsMadeOrOccurrence, 'coverageCode: ', this.quoteData.coverageCode);

      this.setCoverageCarrierMapping();
      this.setCoverageCarrierDefaults();
    }
  }
  updateGlobalDefaults(admittedStatus: string, claimsMadeOrOccurrence: string) {
    this.defaultAdmittedStatus = admittedStatus;
    this.defaultClaimsMadeOrOccurrence = claimsMadeOrOccurrence;
  }
  setCoverageCarrierMapping() {
    console.log('availableMappings: ', this.programCoverageCarrierMappings);
    if (this.quoteData != null) {
      this.selectedCoverageCarrierMapping = this.programCoverageCarrierMappings.find(m =>
        m.admittedStatus == this.quoteData?.admittedStatus &&
      m.claimsMadeOrOccurrence == this.quoteData.claimsMadeOrOccurrence) || null;
      console.log('selected: ',this.selectedCoverageCarrierMapping);
      this.availableCarrierCodes = this.allCarrierCodes.filter(carrier => this.selectedCoverageCarrierMapping != null ? this.selectedCoverageCarrierMapping.availableCarrierCodes.includes(carrier.code.trim()) : carrier);
      this.availablePacCodes = this.allPacCodes.filter(pac => this.selectedCoverageCarrierMapping != null ? this.selectedCoverageCarrierMapping.availablePacCodes.includes(pac.code.trim()) : pac);
      if (this.selectedCoverageCarrierMapping == null) {
        this.quoteData.mappingError = true;
      }
    } else {
      this.selectedCoverageCarrierMapping = this.programCoverageCarrierMappings[0];
    }

  }
  setCoverageCarrierDefaults() {
    if (this.quoteData != null && this.selectedCoverageCarrierMapping != null) {
      this.quoteData.pacCode = this.selectedCoverageCarrierMapping.defPacCode;
      this.quoteData.carrierCode = this.selectedCoverageCarrierMapping.defCarrierCode;
      this.quoteData.coverageCode = this.selectedCoverageCarrierMapping.coverageCode;
      this.quoteData.mappingError = false;
    }
    if (this.quoteData != null &&this.selectedCoverageCarrierMapping == null) {
      this.quoteData.mappingError = true;
    }
  }
}
