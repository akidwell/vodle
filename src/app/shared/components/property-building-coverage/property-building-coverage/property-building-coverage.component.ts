import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { NgOption, NgSelectComponent } from '@ng-select/ng-select';
import { lastValueFrom, Observable } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { PropertyCoverageLookup } from 'src/app/core/models/property-coverage-lookup';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { PropertyQuoteBuildingCoverageClass } from 'src/app/features/quote/classes/property-quote-building-coverage-class';

@Component({
  selector: 'rsps-property-building-coverage',
  templateUrl: './property-building-coverage.component.html',
  styleUrls: ['./property-building-coverage.component.css'],
})
export class PropertyBuildingCoverageComponent implements OnInit {
  collapsed = true;
  faAngleUp = faAngleUp;
  coverages$: Observable<PropertyCoverageLookup[]> | undefined;
  causeOfLoss$: Observable<Code[]> | undefined;
  valuations$: Observable<Code[]> | undefined;
  coinsurance$: Observable<Code[]> | undefined;
  firstExpand = true;
  anchorId!: string;
  isLoadingAddress = false;

  @Input() public coverage!: PropertyQuoteBuildingCoverageClass;
  @Input() public canEdit = false;
  @Input() public buildingIndex = 0;
  @Input() public coverageIndex = 0;
  @Output() deleteCoverage: EventEmitter<PropertyQuoteBuildingCoverageClass> = new EventEmitter();
  @Output() copyCoverage: EventEmitter<PropertyQuoteBuildingCoverageClass> = new EventEmitter();
  @ViewChild('coinsuranceComp') coinsuranceComp!: NgSelectComponent;
  @ViewChild('coverageComp') coverageComp!: NgSelectComponent;
  @ViewChild('causeOfLossComp') causeOfLossComp!: NgSelectComponent;
  @ViewChild('valuationComp') valuationComp!: NgSelectComponent;

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private dropdowns: DropDownsService,
    private ref: ChangeDetectorRef
  ) {
    this.ref.detach();
  }

  ngOnInit(): void {
    this.coverages$ = this.dropdowns.getPropertyCoverages();
    lastValueFrom(this.coverages$).then(
      coverages => {
        // Populate Coinsurance list depending if BI Coverage
        if (this.coverage.propertyCoverageId != null) {
          const match = coverages.find((c) => c.propertyCoverageId == this.coverage.propertyCoverageId);
          if (match?.isBi) {
            this.coinsurance$ = this.dropdowns.getPropertyBICoinsurance();
          }
          else {
            this.coinsurance$ = this.dropdowns.getPropertyCoinsurance();
          }
        }
      }
    );
    this.causeOfLoss$ = this.dropdowns.getPropertyCauseOfLoss();
    this.valuations$ = this.dropdowns.getPropertyValuations();
    this.coinsurance$ = this.dropdowns.getPropertyCoinsurance();
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
    this.deleteCoverage.emit(this.coverage);
  }

  focus(): void {
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  }

  changeCoverage(coverage: PropertyCoverageLookup) {
    this.coverage.valuationId = coverage.defaultValuationTypeId;
    if (coverage.isBi) {
      // Remove NIL if selected for a BI
      if (this.coverage.coinsuranceId == 1) {
        this.coverage.coinsuranceId = null;
      }
      this.coinsurance$ = this.dropdowns.getPropertyBICoinsurance();
    }
    else {
      this.coinsurance$ = this.dropdowns.getPropertyCoinsurance();
    }
  }

  get coinsuranceTooltip(): string | undefined {
    return this.coinsuranceComp?.selectedItems?.find((e: NgOption) => typeof e !== 'undefined')?.label;
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
