import { Component, Input, IterableDiffers, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Observable, Subject, Subscription, of, switchMap, tap } from 'rxjs';
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
import { PropertyBuildingBaseComponent } from '../../property-building/property-building-base-component/property-building-base-component';


@Component({
  selector: 'rsps-property-building-coverage-group',
  templateUrl: './property-building-coverage-group.component.html',
  styleUrls: ['./property-building-coverage-group.component.css']
})
export class PropertyBuildingCoverageGroupComponent extends PropertyBuildingBaseComponent implements OnInit {
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

  constructor(private notification: NotificationService,
    public iterableDiffers: IterableDiffers,
    private quoteService: QuoteService,
    private messageDialogService: MessageDialogService, public filteredBuildingsService: FilteredBuildingsService) {
    // Get the default size from local storage
    super(filteredBuildingsService);
    let pageSize = localStorage.getItem('coverage-page-size');
    if (pageSize == null) {
      this.pageSize = this._state.pageSize;
      pageSize = this.pageSize.toString();
    }
    if (!isNaN(Number(pageSize))) {
      this._state.pageSize = Number(pageSize);
    }
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false)),
    ).subscribe(result => {
      this._policies$.next(result.coverages);
      this._total$.next(result.total);
    });
  }

  ngOnInit(): void {
    this._search$.next();
  }
  private _search(): Observable<SearchResult> {
    const {pageSize, page } = this._state;
    // 1. Populate from source
    let coverages = this.coverages;
    // 2.  Set Focus Page
    const focusIndex = coverages.findIndex((c) => c.focus);
    let focusPage = page;
    if (focusIndex >= 0) {
      coverages[focusIndex].focus = false;
      focusPage = Math.floor((focusIndex + 1) / this.pageSize) + ((focusIndex + 1) % this.pageSize == 0 ? 0 : 1);
      this._state.page = focusPage;
    }
    // 3. paginate
    const total = coverages.length;
    coverages = coverages.slice((focusPage - 1) * pageSize, (focusPage - 1) * pageSize + pageSize);
    this.filteredBuildingsService.pagedCoverages = coverages;
    return of({coverages, total});
  }

  ngDoCheck() {
    const changes = this.iterableDiffers.find(this.filteredBuildingsService.pagedCoverages);
    if (changes) {
      this._search();
    }
  }

  ngOnDestroy(): void {
    this.deleteSub?.unsubscribe();
  }

  private _set(patch: Partial<PageState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  copyCoverage(coverage: PropertyBuildingCoverageClass) {
    if (this.propertyParent instanceof PropertyQuoteClass) {
      const clone = deepClone(coverage.toJSON());
      const x = new PropertyQuoteBuildingCoverageClass(clone);
      this.propertyParent.propertyQuoteBuildingList.find(x => x.propertyQuoteBuildingId == coverage.propertyQuoteBuildingId)?.copyCoverage(x);
      this.filterCoverages();
      this.filteredBuildingsService?.pagedCoverages.push(x as PropertyBuildingCoverageClass);
    } else if(this.propertyParent instanceof PolicyClass){
      const clone = deepClone(coverage.toJSON());
      const x = new PropertyPolicyBuildingCoverageClass(clone);
      this.propertyParent.endorsementData?.endorsementBuilding?.find(x => x.endorsementBuildingId == coverage.endorsementBuildingId)?.copyCoverage(x);
      this.filteredBuildingsService?.pagedCoverages.push(clone as PropertyBuildingCoverageClass);
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
