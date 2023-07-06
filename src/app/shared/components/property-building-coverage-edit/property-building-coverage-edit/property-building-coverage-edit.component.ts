import { Component, Input, ViewChild } from '@angular/core';
import { PropertyQuoteBuildingClass } from 'src/app/features/quote/classes/property-quote-building-class';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';
import { PropertyBuildingCoverageEditDialogComponent } from '../property-building-coverage-edit-dialog/property-building-coverage-group-edit-dialog.component';
import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';

@Component({
  selector: 'rsps-property-building-coverage-edit',
  templateUrl: './property-building-coverage-edit.component.html',
  styleUrls: ['./property-building-coverage-edit.component.css']
})
export class PropertyBuildingCoverageEditComponent {

  @Input() public canEdit = false;
  @Input() public buildings: PropertyBuildingClass[] = [];
  @ViewChild('modal') private groupEditComponent!: PropertyBuildingCoverageEditDialogComponent;
  @Input() propertyParent!: PropertyQuoteClass | PolicyClass;


  get hasCoverages(): boolean {
    let hasCoverages = false;
    if (this.propertyParent instanceof PropertyQuoteClass){
      hasCoverages = this.buildings.some(c => c.propertyQuoteBuildingCoverage.length > 0);
    } else if( this.propertyParent instanceof PolicyClass){
      hasCoverages = this.buildings.some(c => c.endorsementBuildingCoverage.length > 0);
    }
    return hasCoverages;
  }
  async groupEdit() {
    return await this.groupEditComponent.open(this.buildings);
  }
}
