import { PropertyBuilding } from './property-building';

export interface PropertyBuildingCoverage {
  propertyQuoteBuildingCoverageId: number;
  propertyQuoteBuildingId: number;
  propertyCoverageId: number | null;
  limit: number | null;
  coinsuranceId: number | null;
  causeOfLossId: number | null;
  valuationId: number | null;
  additionalDetail: string | null;
}

// export interface PropertyBuildingCoverage extends PropertyBuildingCoverageData {
//   propertyCoverageIdRequired: boolean;
//   coinsuranceRequired: boolean;
//   causeOfLossIdRequired: boolean;
//   valuationIdRequired: boolean;
//   propertyCoverageIdReadonly: boolean;
//   limitRequired: boolean
//   causeOfLossIdReadonly: boolean;
//   valuationIdReadonly: boolean;
//   isImport: boolean;
//   premisesNumber: number | null;
//   subjectNumber: number | null;
//   buildingNumber: number | null;
//   buildingIndex: string;
//   building: PropertyBuilding;
//   isNew: boolean;
//   expand: boolean;
//   focus: boolean;
//   limitFormatted: string;
//   toJSON(): any;
// }

export interface PropertyBuildingCoverageSubjectAmountData {
subject: number | null;
limit: number | null;
}

