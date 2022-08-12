import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { NgOption, NgSelectComponent } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PropertyBuildingCoverage } from 'src/app/features/quote/models/property-building-coverage';

@Component({
  selector: 'rsps-property-building-coverage',
  templateUrl: './property-building-coverage.component.html',
  styleUrls: ['./property-building-coverage.component.css'],
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

  @Input() public coverage!: PropertyBuildingCoverage;
  @Input() public canEdit = false;
  @Input() public buildingIndex = 0;
  @Input() public coverageIndex = 0;
  @Output() deleteCoverage: EventEmitter<PropertyBuildingCoverage> = new EventEmitter();
  @Output() copyCoverage: EventEmitter<PropertyBuildingCoverage> = new EventEmitter();
  @ViewChild('coverageComp') coverageComp!: NgSelectComponent;
  @ViewChild('causeOfLossComp') causeOfLossComp!: NgSelectComponent;
  @ViewChild('valuationComp') valuationComp!: NgSelectComponent;

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private dropdowns: DropDownsService,
    private messageDialogService: MessageDialogService,
    private ref: ChangeDetectorRef
  ) {
    this.ref.detach();
  }

  ngOnInit(): void {
    this.coverages$ = this.dropdowns.getPropertyCoverages();
    this.causeOfLoss$ = this.dropdowns.getPropertyCauseOfLoss();
    this.valuations$ = this.dropdowns.getPropertyValuations();
    this.anchorId = 'focusCoverage' + this.buildingIndex + '/' + this.coverageIndex;
    if (this.coverage.expand) {
      this.coverage.expand = false;
      this.collapseExpand(false);
      this.focus();
    }
  }

  ngAfterViewChecked(){
    this.ref.detectChanges();
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
    this.confirmationDialogService
      .open('Delete Confirmation', 'Are you sure you want to delete this coverage?')
      .then((result: boolean) => {
        if (result) {
          this.delete();
        }
      });
  }

  async delete() {
    // const index = this.building.propertyQuoteBuildingCoverage.indexOf(this.coverage, 0);
    // if (index > -1) {
    //   this.building.propertyQuoteBuildingCoverage.splice(index, 1);
    //   if (!this.coverage.isNew && this.coverage.propertyQuoteBuildingCoverageId != null) {
    //     // this.deleteSub = this.quoteService
    //     //   .deleteDeductible(coverage.propertyQuoteBuildingId)
    //     //   .subscribe((result) => {
    //     //     if (result) {
    //     //       setTimeout(() => {
    //     //         this.notification.show('Building deleted.', { classname: 'bg-success text-light', delay: 5000 });
    //     //       });
    //     //     }
    //     //   });
    //   }
    // }
    this.deleteCoverage.emit(this.coverage);
  }

  focus(): void {
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  }

  get coverageTooltip(): string | undefined {
    return this.coverageComp?.selectedItems?.find((e: NgOption) => typeof e !== 'undefined')?.label;
  }
  get causeOfLossTooltip(): string {
    return this.causeOfLossComp?.selectedItems?.find((e: NgOption) => typeof e !== 'undefined')?.label ?? '';
  }
  get valuationTooltip(): string {
    return this.valuationComp?.selectedItems?.find((e: NgOption) => typeof e !== 'undefined')?.label ?? '';
  }
}
