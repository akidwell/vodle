import { PropertyBuilding } from './property-building';

export interface PropertyBuildingCoverage {
  propertyQuoteBuildingCoverageId: number;
  propertyQuoteBuildingId: number;
  propertPolicyBuildingCoverageId: number;
  endorsementBuildingId: number;
  propertyCoverageId: number | null;
  limit: number | null;
  coinsuranceId: number | null;
  causeOfLossId: number | null;
  valuationId: number | null;
  additionalDetail: string | null;
  guid: string;
}


export interface PropertyBuildingCoverageSubjectAmountData {
subject: number | null;
limit: number | null;
}

