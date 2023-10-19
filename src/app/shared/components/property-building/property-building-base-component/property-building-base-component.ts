import { Component, Input } from '@angular/core';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
import { PropertyBuildingCoverageClass } from 'src/app/features/quote/classes/property-building-coverage-class';
import { PropertyPolicyBuildingClass } from 'src/app/features/quote/classes/property-policy-building-class';
import { PropertyQuoteBuildingClass } from 'src/app/features/quote/classes/property-quote-building-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';

@Component({
  template: ''
})
export abstract class PropertyBuildingBaseComponent {
  @Input() propertyParent!: PropertyQuoteClass | PolicyClass;
  private _searchSubject = '';
  get searchSubject() : string {
    return this._searchSubject;
  }
  set searchSubject(value: string) {
    this._searchSubject = value;
    this.filterBuildingsCoverages();
  }
  private _searchPremises = '';
  get searchPremises() : string {
    return this._searchPremises;
  }
  set searchPremises(value: string) {
    this._searchPremises = value;
    this.filterBuildingsCoverages();
  }
  private _searchBuilding = '';
  get searchBuilding() : string {
    return this._searchBuilding;
  }
  set searchBuilding(value: string) {
    this._searchBuilding = value;
    this.filterBuildingsCoverages();
  }
  private _searchAddress = '';
  get searchAddress() : string {
    return this._searchAddress;
  }
  set searchAddress(value: string) {
    this._searchAddress = value;
    this.filterBuildingsCoverages();
  }
  get filteredBuildings(): PropertyBuildingClass[] {
    return this.filteredBuildingsService.filteredBuildings || [];
  }
  get filteredCoverages(): PropertyBuildingCoverageClass[] {
    return this.filteredBuildingsService.filteredCoverages || [];
  }

  get pagedBuildings(): PropertyBuildingClass[] {
    return this.filteredBuildingsService.pagedBuildings || [];
  }


  get pagedCoverages(): PropertyBuildingCoverageClass[] {
    return this.filteredBuildingsService.pagedCoverages || [];
  }
  constructor(public filteredBuildingsService: FilteredBuildingsService) {

  }

  filterBuildings() {
    if ((this.propertyParent instanceof PropertyQuoteClass)) {
      const allBuildings: PropertyQuoteBuildingClass[] = [];
      this.propertyParent.propertyQuoteBuildingList.map((element) => {
        if ( !element.markForDeletion && (this.searchSubject == '' || element.subjectNumber == Number(this.searchSubject)) &&
        (this.searchPremises == '' || element.premisesNumber == Number(this.searchPremises)) &&
        (this.searchBuilding == '' || element.buildingNumber == Number(this.searchBuilding)) &&
        (this.searchAddress == '' || element.address.toLowerCase().includes(this.searchAddress.toLowerCase()))) {
          allBuildings.push(element as PropertyQuoteBuildingClass);
        }
      });

      this.filteredBuildingsService.filteredBuildings = allBuildings;
    } else if (this.propertyParent instanceof PolicyClass) {
      const allBuildings: PropertyPolicyBuildingClass[] = [];
      this.propertyParent.endorsementData.endorsementBuilding.map((element) => {
        if (!element.markForDeletion && (this.searchSubject == '' || element.subjectNumber == Number(this.searchSubject)) &&
        (this.searchPremises == '' || element.premisesNumber == Number(this.searchPremises)) &&
        (this.searchBuilding == '' || element.buildingNumber == Number(this.searchBuilding)) &&
        (this.searchAddress == '' || element.address.toLowerCase().includes(this.searchAddress.toLowerCase()))) {
          allBuildings.push(element as PropertyPolicyBuildingClass);
        }
      });
      this.filteredBuildingsService.filteredBuildings = allBuildings;
    }
    this.filterCoverages();
  }

  filterCoverages() {
    if (this.propertyParent instanceof PropertyQuoteClass) {
      const filtered: PropertyBuildingCoverageClass[] = [];
      this.filteredBuildings.map((element) => {
        if(!element.markForDeletion){
          element.propertyQuoteBuildingCoverage.map((x) => {
            filtered.push(x);
          });
        }
      });
      this.filteredBuildingsService.filteredCoverages = filtered;
    } else if(this.propertyParent instanceof PolicyClass){
      const filtered: PropertyBuildingCoverageClass[] = [];
      this.filteredBuildings.map((element) => {
        if(!element.markForDeletion){
          element.endorsementBuildingCoverage.map((x) => {
            filtered.push(x);
          });
        }
      });
      this.filteredBuildingsService.filteredCoverages = filtered;
    }
  }

  clearBuildings() {
    this.filteredBuildingsService.filteredBuildings = [];
    this.filteredBuildingsService.filteredCoverages = [];
    // TODO: GAM need to work on this
    // this.propertyQuoteDeductibleList.map(c => {c.premisesNumber = null; c.buildingNumber = null;});
  }

  filterBuildingsCoverages() {
    this.filterBuildings();
    this.filterCoverages();
  }
}
