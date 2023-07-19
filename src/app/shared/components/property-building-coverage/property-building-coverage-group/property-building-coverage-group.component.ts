import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PageState } from 'src/app/core/models/page-state';
import { PropertyQuoteBuildingCoverageClass } from 'src/app/features/quote/classes/property-quote-building-coverage-class';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PropertyBuildingCoverageClass } from 'src/app/features/quote/classes/property-building-coverage-class';
import { PropertyPolicyBuildingCoverageClass } from 'src/app/features/quote/classes/property-policy-building-coverage-class';
import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';


@Component({
  selector: 'rsps-property-building-coverage-group',
  templateUrl: './property-building-coverage-group.component.html',
  styleUrls: ['./property-building-coverage-group.component.css']
})
export class PropertyBuildingCoverageGroupComponent implements OnInit {
  deleteSub!: Subscription;
  collapsed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  private _coverages: PropertyBuildingCoverageClass[] = [];

  @Input() public readOnlyQuote!: boolean;
  @Input() public limitTotal!: number;
  @Input() public canEdit = false;
  @Input() public classType!: ClassTypeEnum;
  @Input() public propertyParent!: PropertyQuoteClass | PolicyClass;


  get coverages(): PropertyBuildingCoverageClass[] {
    this._coverages = this.filteredBuildingsService.filteredCoverages;
    return this._coverages;
  }

  set coverages(value: PropertyBuildingCoverageClass[]){
    this._coverages = value;
  }

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _policies$ = new BehaviorSubject<PropertyBuildingCoverageClass[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  get policies$() { return this._policies$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  set page(page: number) { this._set({page}); }
  get pageSize() { return this._state.pageSize; }
  set pageSize(pageSize: number) {
    localStorage.setItem('coverage-page-size', pageSize.toString());
    this._set({pageSize});
  }

  // Default pagination settings
  private _state: PageState = {
    page: 1,
    pageSize: 15,
    searchTerm: ''
  };

  constructor(private notification: NotificationService, private quoteService: QuoteService, private messageDialogService: MessageDialogService, public filteredBuildingsService: FilteredBuildingsService) {
    // Get the default size from local storage
    let pageSize = localStorage.getItem('coverage-page-size');
    if (pageSize == null) {
      this.pageSize = this._state.pageSize;
      pageSize = this.pageSize.toString();
    }
    if (!isNaN(Number(pageSize))) {
      this._state.pageSize = Number(pageSize);
    }

  }

  ngOnInit(): void {
    console.log('COV' , this.coverages);

  }

  ngOnDestroy(): void {
    this.deleteSub?.unsubscribe();
  }

  private _set(patch: Partial<PageState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  copyCoverage(coverage: PropertyBuildingCoverageClass) {
    if (this.classType == ClassTypeEnum.Quote) {
      const clone = deepClone(coverage.toJSON());
      const x = new PropertyQuoteBuildingCoverageClass(clone);
      //x.building.copyCoverage(x);
    } else if(this.classType == ClassTypeEnum.Policy){
      const clone = deepClone(coverage.toJSON());
      const x = new PropertyPolicyBuildingCoverageClass(clone);
      //x.building.copyCoverage(x);
    }
  }

  deleteCoverage(coverage: PropertyBuildingCoverageClass) {
    const index = this.coverages.indexOf(coverage, 0);
    if (index > -1) {
      if (!coverage.isNew && coverage.propertyQuoteBuildingCoverageId > 0) {
        this.deleteSub = this.quoteService
          .deleteCoverage(coverage.propertyQuoteBuildingCoverageId)
          .subscribe({
            next: () => {
              // coverage.building.deleteCoverage(coverage as PropertyQuoteBuildingCoverageClass);
              setTimeout(() => {
                this.notification.show('Coverage deleted.', {
                  classname: 'bg-success text-light',
                  delay: 5000,
                });
              });
            },
            error: (error) => {
              this.messageDialogService.open('Delete error', error.error.Message ?? error.message);
              this.notification.show('Coverage not deleted.', {
                classname: 'bg-danger text-light',
                delay: 5000,
              });
            },
          });
      }
      else if(coverage.isNew) {
        if(this.propertyParent instanceof PropertyQuoteClass){
          const index2 = this.filteredBuildingsService.filteredCoverages.indexOf(coverage, 0);
          this.coverages.splice(index, 1);
          this.filteredBuildingsService.filteredCoverages.splice(index2, 1);
          this.propertyParent.propertyQuoteBuildingList.map(x => {
            if(x.propertyQuoteBuildingId == coverage.propertyQuoteBuildingId){
              x.deleteCoverage(coverage as PropertyQuoteBuildingCoverageClass);
            }
          });
        } else if(this.propertyParent instanceof PolicyClass){
          const index2 = this.filteredBuildingsService.filteredCoverages.indexOf(coverage, 0);
          this.coverages.splice(index, 1);
          this.filteredBuildingsService.filteredCoverages.splice(index2, 1);
          this.propertyParent.endorsementData.endorsementBuilding.map(x => {
            if(x.endorsementBuildingId == coverage.endorsementBuildingId){
              x.deleteCoverage(coverage as PropertyPolicyBuildingCoverageClass);
            }
          });
        }
      }
    }
  }
  get coverageCount(): number {
    let total = 0;
    total = this.filteredBuildingsService.filteredCoverages.length ?? 0;
    return total;
  }
}

export interface SearchResult {
  coverages: PropertyBuildingCoverageClass[];
  total: number;
}
