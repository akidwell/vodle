import { Component, Input, ViewChild } from '@angular/core';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';
import { PropertyBuildingCoverageEditDialogComponent } from '../property-building-coverage-edit-dialog/property-building-coverage-group-edit-dialog.component';

@Component({
  selector: 'rsps-property-building-coverage-edit',
  templateUrl: './property-building-coverage-edit.component.html',
  styleUrls: ['./property-building-coverage-edit.component.css']
})
export class PropertyBuildingCoverageEditComponent {

  @Input() public canEdit = false;
  @Input() public buildings: PropertyBuilding[] = [];
  @ViewChild('modal') private groupEditComponent!: PropertyBuildingCoverageEditDialogComponent;

  get hasCoverages() {
    return this.buildings.some(c => c.propertyQuoteBuildingCoverage.length > 0);
  }
  async groupEdit() {
    return await this.groupEditComponent.open(this.buildings);
  }
}