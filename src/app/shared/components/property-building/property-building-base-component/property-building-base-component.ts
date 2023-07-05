import { Component, Input } from '@angular/core';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
import { PropertyBuildingCoverageClass } from 'src/app/features/quote/classes/property-building-coverage-class';
import { PropertyPolicyBuildingClass } from 'src/app/features/quote/classes/property-policy-building-class';
import { PropertyQuoteBuildingClass } from 'src/app/features/quote/classes/property-quote-building-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';

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
    console.log('in set subject' + value);
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
  filteredBuildings: PropertyBuildingClass[] = [];
  filteredCoverages: PropertyBuildingCoverageClass[] = [];
  filterBuildings() {
    console.log('PROP PARENT' + this.propertyParent);
    if ((this.propertyParent instanceof PropertyQuoteClass)) {
      const allBuildings: PropertyQuoteBuildingClass[] = [];
      this.propertyParent.propertyQuoteBuildingList.map((element) => {
        if ((this.searchSubject == '' || element.subjectNumber == Number(this.searchSubject)) &&
        (this.searchPremises == '' || element.premisesNumber == Number(this.searchPremises)) &&
        (this.searchBuilding == '' || element.buildingNumber == Number(this.searchBuilding)) &&
        (this.searchAddress == '' || element.address.toLowerCase().includes(this.searchAddress.toLowerCase()))) {
          allBuildings.push(element as PropertyQuoteBuildingClass);
        }
      });

      this.filteredBuildings = allBuildings;
      console.log('filteredbuildings' + this.filteredBuildings) ;


    } else if (this.propertyParent instanceof PolicyClass) {
      const allBuildings: PropertyPolicyBuildingClass[] = [];
      console.log('BUILDING LIST: ',this.propertyParent.propertyBuildingList);
      console.log(this.searchSubject);
      this.propertyParent.propertyBuildingList.map((element) => {
        if ((this.searchSubject == '' || element.subjectNumber == Number(this.searchSubject)) &&
        (this.searchPremises == '' || element.premisesNumber == Number(this.searchPremises)) &&
        (this.searchBuilding == '' || element.buildingNumber == Number(this.searchBuilding)) &&
        (this.searchAddress == '' || element.address.toLowerCase().includes(this.searchAddress.toLowerCase()))) {
          allBuildings.push(element as PropertyPolicyBuildingClass);
        }
      });
      this.filteredBuildings = allBuildings;
      console.log(this.filteredBuildings);
    }

  }

  filterCoverages() {
    const filtered: PropertyBuildingCoverageClass[] = [];
    this.filteredBuildings.map((element) => {
      element.propertyBuildingCoverage.map((x) => {
        filtered.push(x);
      });
    });
    this.filteredCoverages = filtered;
  }

  clearBuildings() {
    this.filteredBuildings = [];
    this.filteredCoverages = [];
    // TODO: GAM need to work on this
    // this.propertyQuoteDeductibleList.map(c => {c.premisesNumber = null; c.buildingNumber = null;});
  }

  filterBuildingsCoverages() {
    this.filterBuildings();
    this.filterCoverages();
  }
}
