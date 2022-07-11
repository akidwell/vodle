export interface ProgramCoverageCarrierMapping {
  programId: number;
  coverageCode: number;
  admittedStatus: string;
  claimsMadeOrOccurrence: string;
  uwBranchCode: string;
  policySymbol: string;
  defCarrierCode: string;
  defPacCode: string;
  defCoverageForm: string;
  defTRIATemplateCode: string;
  availableCarrierCodes: string[];
  availablePacCodes: string[];
  availableCoverageForms: string[];
  availableTRIATemplateCodes: string[];
}
