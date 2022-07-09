export interface ProgramCoverageCarrierMapping {
  programId: number;
  coverageCode: number;
  admittedStatus: string;
  claimsMadeOrOccurrence: string;
  uwBranchCode: string;
  policySymbol: string;
  defCarrierCode: number;
  defPacCode: number;
  defCoverageForm: string;
  defTRIATemplateCode: string;
  availableCarrierCodes: number[];
  availablePacCodes: string[];
  availableCoverageForms: string[];
  availableTRIATemplateCodes: string[];
}
