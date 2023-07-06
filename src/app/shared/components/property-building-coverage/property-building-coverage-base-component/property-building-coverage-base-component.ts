// import { Component, Input } from '@angular/core';
// import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
// import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
// import { PropertyBuildingCoverageClass } from 'src/app/features/quote/classes/property-building-coverage-class';
// import { PropertyPolicyBuildingClass } from 'src/app/features/quote/classes/property-policy-building-class';
// import { PropertyQuoteBuildingClass } from 'src/app/features/quote/classes/property-quote-building-class';
// import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
// import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';

// @Component({
//   template: ''
// })

// export abstract class PropertyBuildingCoverageBaseComponent {
//   constructor(public filteredBuildingsService: FilteredBuildingsService) {

//   }

//   @Input() propertyParent!: PropertyQuoteClass | PolicyClass;
//   private _searchSubject = '';
//   get searchSubject() : string {
//     return this._searchSubject;
//   }
//   set searchSubject(value: string) {
//     this._searchSubject = value;
//     console.log('in set subject' + value);
//     //this.filterBuildingsCoverages();
//   }
//   private _searchPremises = '';
//   get searchPremises() : string {
//     return this._searchPremises;
//   }
//   set searchPremises(value: string) {
//     this._searchPremises = value;
//     //this.filterBuildingsCoverages();
//   }
//   private _searchBuilding = '';
//   get searchBuilding() : string {
//     return this._searchBuilding;
//   }
//   set searchBuilding(value: string) {
//     this._searchBuilding = value;
//     //this.filterBuildingsCoverages();
//   }
//   private _searchAddress = '';
//   get searchAddress() : string {
//     return this._searchAddress;
//   }
//   set searchAddress(value: string) {
//     this._searchAddress = value;
//   }

// }
