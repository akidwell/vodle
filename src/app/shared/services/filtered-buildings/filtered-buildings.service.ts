import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
import { PropertyBuildingCoverageClass } from 'src/app/features/quote/classes/property-building-coverage-class';

export class FilteredBuildingsService {

  // constructor() {}
  private _filteredBuildings: PropertyBuildingClass[] = [];
  private _filteredCoverages: PropertyBuildingCoverageClass[] = [];
  private _pagedBuildings: PropertyBuildingClass[] = [];

  private _pagedCoverages: PropertyBuildingCoverageClass[] = [];

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

  public get pagedBuildings(): PropertyBuildingClass[] {
    return this._pagedBuildings;
  }
  public set pagedBuildings(value: PropertyBuildingClass[]) {
    this._pagedBuildings = value;
  }

  public get pagedCoverages(): PropertyBuildingCoverageClass[] {
    return this._pagedCoverages;
  }
  public set pagedCoverages(value: PropertyBuildingCoverageClass[]) {
    this._pagedCoverages = value;
  }
}
