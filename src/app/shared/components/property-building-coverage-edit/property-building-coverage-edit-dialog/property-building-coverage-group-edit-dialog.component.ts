import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, Observable } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { PropertyCoverageLookup } from 'src/app/core/models/property-coverage-lookup';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';

@Component({
  selector: 'rsps-property-building-coverage-edit-dialog',
  templateUrl: './property-building-coverage-edit-dialog.component.html',
  styleUrls: ['./property-building-coverage-edit-dialog.component.css']
})
export class PropertyBuildingCoverageEditDialogComponent implements OnInit {
  buildings: PropertyBuilding[] = [];
  filteredCoverage: PropertyCoverageLookup[] = [];
  propertyCoverageId: number | null = null;
  coinsuranceId: number| null = null;
  causeOfLossId: number| null = null;
  valuationId: number| null = null;
  causeOfLoss$: Observable<Code[]> | undefined;
  valuations$: Observable<Code[]> | undefined;
  coinsurance$: Observable<Code[]> | undefined;

  private modalRef!: NgbModalRef;

  @ViewChild('modal') private modalContent!: TemplateRef<PropertyBuildingCoverageEditDialogComponent>;

  constructor(private modalService: NgbModal, private dropdowns: DropDownsService, private messageDialogService: MessageDialogService) { }

  ngOnInit(): void {
    this.causeOfLoss$ = this.dropdowns.getPropertyCauseOfLoss();
    this.valuations$ = this.dropdowns.getPropertyValuations();
    this.coinsurance$ = this.dropdowns.getPropertyCoinsurance();
  }

  async open(buildings: PropertyBuilding[]): Promise<boolean> {
    this.buildings = buildings;
    this.propertyCoverageId = null;
    this.coinsuranceId = null;
    this.causeOfLossId = null;
    this.valuationId = null;

    const result$ = this.dropdowns.getPropertyCoverages();
    await lastValueFrom(result$).then((results) =>
    {
      buildings.map(c => {
        c.propertyQuoteBuildingCoverage.map(coverage=> {
          if (this.filteredCoverage.find(d => d.propertyCoverageId == coverage.propertyCoverageId) == undefined) {
            const match = results.find(f => f.propertyCoverageId == coverage.propertyCoverageId);
            if (match) {
              this.filteredCoverage.push(match);
            }
          }
        });
      });
    }
    );

    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { scrollable: true, backdrop: 'static', size: 'xl' });
      this.modalRef.result.then(resolve, resolve);
      return true;
    });
  }

  update() {
    let updateCount = 0;
    this.buildings.map(building => {
      building.propertyQuoteBuildingCoverage.map(coverage=> {
        if (coverage.propertyCoverageId == this.propertyCoverageId) {
          updateCount++;
          if (this.coinsuranceId != null) {
            console.log(this.coinsuranceId);
            coverage.coinsuranceId = this.coinsuranceId;
          }
          if (this.causeOfLossId != null) {
            coverage.causeOfLossId = this.causeOfLossId;
          }
          if (this.valuationId != null) {
            coverage.valuationId = this.valuationId;
          }
        }
      });
    });
    this.modalRef.close(true);
    this.messageDialogService.open('Updated',updateCount.toString() + ' updates!');
  }

  cancel() {
    this.modalRef.close(false);
  }

  changeCoverage(coverage: PropertyCoverageLookup) {
    if (coverage.isBi) {
      // Remove NIL if selected for a BI
      if (this.coinsuranceId == 1) {
        this.coinsuranceId = null;
      }
      this.coinsurance$ = this.dropdowns.getPropertyBICoinsurance();
    }
    else {
      this.coinsurance$ = this.dropdowns.getPropertyCoinsurance();
    }
  }

  get canUpdate(): boolean {
    return this.propertyCoverageId != null && (this.coinsuranceId != null || this.causeOfLossId != null || this.valuationId != null);
  }
}
