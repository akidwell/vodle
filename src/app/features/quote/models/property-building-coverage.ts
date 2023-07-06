
export interface PropertyBuildingCoverage {
  propertyQuoteBuildingCoverageId: number;
  propertyQuoteBuildingId: number;
  endorsementBuildingCoverageId: number;
  endorsementBuildingId: number;
  propertyCoverageId: number | null;
  limit: number | null;
  coinsuranceId: number | null;
  causeOfLossId: number | null;
  valuationId: number | null;
  additionalDetail: string | null;
  guid: string;
  isNew: boolean;
  markForDeletion: boolean;
}


export interface PropertyBuildingCoverageSubjectAmountData {
subject: number | null;
limit: number | null;
}

