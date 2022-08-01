export interface PropertyBuildingCoverageData {
  propertyQuoteBuildingCoverageId: number | null;
  propertyQuoteBuildingId: number | null;
  propertyCoverageId: number | null;
  subjectNumber: number | null;
  limit: number | null;
  coinsurancePct: number | null;
  causeOfLossId: number | null;
  valuationId: number | null;
  additionalDetail: string | null;
  isNew: boolean;
}

export interface PropertyBuildingCoverage extends PropertyBuildingCoverageData {
  locationNumberRequired: boolean;
  buildingNumberRequired: boolean;
  propertyCoverageIdRequired: boolean;
  coinsuranceRequired: boolean;
  causeOfLossIdRequired: boolean;
  valuationIdRequired: boolean;
  subjectNumberRequired: boolean;
  propertyCoverageIdReadonly: boolean;
  limitRequired: boolean
  causeOfLossIdReadonly: boolean;
  valuationIdReadonly: boolean;
  isImport: boolean;
}