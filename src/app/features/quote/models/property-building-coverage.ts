import { PropertyBuilding } from './property-building';

export interface PropertyBuildingCoverageData {
  propertyQuoteBuildingCoverageId: number | null;
  propertyQuoteBuildingId: number | null;
  propertyCoverageId: number | null;
  limit: number | null;
  coinsurancePct: number | null;
  causeOfLossId: number | null;
  valuationId: number | null;
  additionalDetail: string | null;
  isNew: boolean;
}

export interface PropertyBuildingCoverage extends PropertyBuildingCoverageData {
  propertyCoverageIdRequired: boolean;
  coinsuranceRequired: boolean;
  causeOfLossIdRequired: boolean;
  valuationIdRequired: boolean;
  propertyCoverageIdReadonly: boolean;
  limitRequired: boolean
  causeOfLossIdReadonly: boolean;
  valuationIdReadonly: boolean;
  isImport: boolean;
  premisesNumber: number | null;
  subjectNumber: number | null;
  buildingNumber: number | null;
  buildingIndex: string;
  building: PropertyBuilding;
  expand: boolean;
  focus: boolean;
  toJSON(): any;
}

export interface PropertyBuildingCoverageSubjectAmountData {
subject: number | null;
limit: number | null;
}

