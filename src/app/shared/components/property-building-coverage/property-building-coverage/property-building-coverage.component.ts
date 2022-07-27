import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { State } from '@popperjs/core';
import { Observable, Subscription } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';
import { PropertyBuildingCoverage } from 'src/app/features/quote/models/property-building-coverage';

@Component({
  selector: 'rsps-property-building-coverage',
  templateUrl: './property-building-coverage.component.html',
  styleUrls: ['./property-building-coverage.component.css']
})
export class PropertyBuildingCoverageComponent implements OnInit {
  collapsed = true;
  faAngleUp = faAngleUp;
  coverages$: Observable<Code[]> | undefined;
  causeOfLoss$: Observable<Code[]> | undefined;
  valuations$: Observable<Code[]> | undefined;
  firstExpand = true;
  anchorId!: string;
  isLoadingAddress = false;
  addressSub!: Subscription;

  @Input() public building!: PropertyBuilding;
  @Input() public coverage!: PropertyBuildingCoverage;
  @Input() public canEdit = false;
  @Input() public index = 0;
  @Output() deleteCoverage: EventEmitter<PropertyBuildingCoverage> = new EventEmitter();
  @Output() copyCoverage: EventEmitter<PropertyBuildingCoverage> = new EventEmitter();

  constructor(private confirmationDialogService: ConfirmationDialogService, private dropdowns: DropDownsService,
    private messageDialogService: MessageDialogService) { }

  ngOnInit(): void {
    this.coverages$ = this.dropdowns.getPropertyCoverages();
    this.causeOfLoss$ = this.dropdowns.getPropertyCauseOfLoss();
    this.valuations$ = this.dropdowns.getPropertyValuations();
    this.anchorId = 'focusHere' + this.index;
    if (this.coverage.isNew && !this.coverage.isImport) {
      this.collapseExpand(false);
      this.focus();
    }
  }

  collapseExpand(event: boolean) {
    if (this.firstExpand) {

      this.firstExpand = false;
    }
    this.collapsed = event;
  }

  copy(): void {
    this.copyCoverage.emit(this.coverage);
  }

  openDeleteConfirmation() {
    this.confirmationDialogService.open('Delete Confirmation','Are you sure you want to delete this coverage?').then((result: boolean) => {
      if (result) {
        this.delete();
      }
    });
  }

  async delete() {
    const index = this.building.propertyQuoteBuildingCoverage.indexOf(this.coverage, 0);
    if (index > -1) {
      this.building.propertyQuoteBuildingCoverage.splice(index, 1);
      if (!this.coverage.isNew && this.coverage.propertyQuoteBuildingCoverageId != null) {
        // this.deleteSub = this.quoteService
        //   .deleteDeductible(coverage.propertyQuoteBuildingId)
        //   .subscribe((result) => {
        //     if (result) {
        //       setTimeout(() => {
        //         this.notification.show('Building deleted.', { classname: 'bg-success text-light', delay: 5000 });
        //       });
        //     }
        //   });
      }
    }
    //this.deleteCoverage.emit(this.coverage);
  }

  focus(): void {
    this.collapsed = false;
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView();
    }, 250);
  }
}
