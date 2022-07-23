export interface PropertyBuildingCoverageData {
  propertyQuoteCoverageId: number | null;
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

}