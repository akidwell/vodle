import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, Observable } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { PropertyCoverageLookup } from 'src/app/core/models/property-coverage-lookup';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
import { PropertyBuildingCoverageClass } from 'src/app/features/quote/classes/property-building-coverage-class';
import { PropertyQuoteBuildingClass } from 'src/app/features/quote/classes/property-quote-building-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { PropertyBuildingBaseComponent } from '../../property-building/property-building-base-component/property-building-base-component';
import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';

@Component({
  selector: 'rsps-property-building-coverage-edit-dialog',
  templateUrl: './property-building-coverage-edit-dialog.component.html',
  styleUrls: ['./property-building-coverage-edit-dialog.component.css']
})
export class PropertyBuildingCoverageEditDialogComponent extends PropertyBuildingBaseComponent implements OnInit {
  buildings: PropertyBuildingClass[] = [];
  filteredCoverage: PropertyCoverageLookup[] = [];
  propertyCoverageId: number | null = null;
  coinsuranceId: number| null = null;
  causeOfLossId: number| null = null;
  valuationId: number| null = null;
  causeOfLoss$: Observable<Code[]> | undefined;
  valuations$: Observable<Code[]> | undefined;
  coinsurance$: Observable<Code[]> | undefined;
  filteredOnly = false;

  private modalRef!: NgbModalRef;
  @Input() propertyParent!: PropertyQuoteClass | PolicyClass;

  @ViewChild('modal') private modalContent!: TemplateRef<PropertyBuildingCoverageEditDialogComponent>;

  constructor(private modalService: NgbModal, private dropdowns: DropDownsService, private messageDialogService: MessageDialogService, filteredBuildingsService: FilteredBuildingsService) {
    super(filteredBuildingsService);
  }
  ngOnInit(): void {
    this.causeOfLoss$ = this.dropdowns.getPropertyCauseOfLoss();
    this.valuations$ = this.dropdowns.getPropertyValuations();
    this.coinsurance$ = this.dropdowns.getPropertyCoinsurance();
  }

  async open(buildings: PropertyBuildingClass[]): Promise<boolean> {
    this.buildings = buildings;
    this.propertyCoverageId = null;
    this.coinsuranceId = null;
    this.causeOfLossId = null;
    this.valuationId = null;
    this.filteredOnly = false;
    const result$ = this.dropdowns.getPropertyCoverages();

    if (this.propertyParent instanceof PropertyQuoteClass){
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
    } else if(this. propertyParent instanceof PolicyClass){
      await lastValueFrom(result$).then((results) =>
      {
        buildings.map(c => {
          c.endorsementBuildingCoverage.map(coverage=> {
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
    }

    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { scrollable: true, backdrop: 'static', size: 'xl' });
      this.modalRef.result.then(resolve, resolve);
      return true;
    });
  }

  update() {
    const buildingList: PropertyBuildingClass[] = this.filteredOnly?this.filteredBuildings:this.buildings;
    let updateCount = 0;
    if(this.propertyParent instanceof PropertyQuoteClass){
      buildingList.map(building => {
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
    } else if (this.propertyParent instanceof PolicyClass){
      buildingList.map(building => {
        building.endorsementBuildingCoverage.map(coverage=> {
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
          this.propertyParent.markDirty();
        });
      });
    }
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
