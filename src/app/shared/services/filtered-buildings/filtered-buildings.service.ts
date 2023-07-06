import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
import { PropertyBuildingCoverageClass } from 'src/app/features/quote/classes/property-building-coverage-class';

export class FilteredBuildingsService {

  // constructor() {}
  private _filteredBuildings: PropertyBuildingClass[] = [];
  private _filteredCoverages: PropertyBuildingCoverageClass[] = [];
  public get filteredCoverages(): PropertyBuildingCoverageClass[] {
    return this._filteredCoverages;
  }
  public set filteredCoverages(value: PropertyBuildingCoverageClass[]) {
    this._filteredCoverages = value;
  }

  public get filteredBuildings(): PropertyBuildingClass[] {
    return this._filteredBuildings;
  }
  public set filteredBuildings(value: PropertyBuildingClass[]) {
    this._filteredBuildings = value;
  }




}
