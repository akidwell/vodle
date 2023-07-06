import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PropertyQuoteBuildingClass } from 'src/app/features/quote/classes/property-quote-building-class';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';
import { faAngleDown, faAngleUp, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { PageState } from 'src/app/core/models/page-state';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { ThemePalette } from '@angular/material/core';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
import { PropertyPolicyBuildingClass } from 'src/app/features/quote/classes/property-policy-building-class';
import { PropertyBuildingBaseComponent } from '../property-building-base-component/property-building-base-component';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
import { PropertyBuildingCoverageClass } from 'src/app/features/quote/classes/property-building-coverage-class';
import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';
import { PropertyQuote } from 'src/app/features/quote/models/property-quote';

@Component({
  selector: 'rsps-property-building-group',
  templateUrl: './property-building-group.component.html',
  styleUrls: ['./property-building-group.component.css']
})
export class PropertyBuildingGroupComponent extends PropertyBuildingBaseComponent implements OnInit {
  deleteSub!: Subscription;
  searchSub!: Subscription;
  collapsed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faCircleXmark = faCircleXmark;
  canFilter = false;
  color: ThemePalette = 'warn';
  searchThrottle = new Subject<void>();
  private _buildings: PropertyBuildingClass[] = [];

  //@Input() public propertyParent!: PropertyQuoteClass | PolicyClass;
  @Input() public readOnlyQuote!: boolean;
  @Input() public buildingCount!: number;
  @Input() public canEdit = false;
  @Input() public classType!: ClassTypeEnum;
  @Input() public rateEffectiveDate!: Date | null;
  @Input() set buildings(value: PropertyBuildingClass[]) {
    this._buildings = value;
    console.log('input buildings: ', value);
    this._search$.next();
  }
  get buildings(): PropertyBuildingClass[] {
    return this.filteredBuildingsService.filteredBuildings;
  }

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _policies$ = new BehaviorSubject<PropertyBuildingClass[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  get policies$() { return this._policies$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  set page(page: number) {this._set({page});}
  get pageSize() { return this._state.pageSize; }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  @Input() public programId!: number;


  // Default pagination settings
  private _state: PageState = {
    page: 1,
    pageSize: 15,
    searchTerm: ''
  };

  constructor(private notification: NotificationService, private quoteService: QuoteService, private messageDialogService: MessageDialogService, filteredBuildingsService: FilteredBuildingsService) {
    super(filteredBuildingsService);
    // Get the default size from local storage
    let pageSize = localStorage.getItem('building-page-size');
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
      console.log('RESUlTTTTt ' + result);
      this._policies$.next(result.buildings);
      this._total$.next(result.total);
    });
  }

  ngOnInit(): void {
    this._search$.next();
    this.searchSub = this.searchThrottle.pipe(debounceTime(500)).subscribe(() => {
      //this.searchAddress = this.searchAddress;
    });
    this.filterBuildings();
    this.filterCoverages();
  }

  ngOnDestroy(): void {
    this.deleteSub?.unsubscribe();
    this.searchSub?.unsubscribe();
  }

  private _set(patch: Partial<PageState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {pageSize, page } = this._state;
    // 1. Populate from source
    let buildings = this.buildings;
    console.log('buildingssss: ', this.buildings);
    // 2.  Set Focus Page
    const focusIndex = buildings.findIndex((c) => c.focus);
    console.log('focusindex ', focusIndex, page);
    let focusPage = page;
    if (focusIndex >= 0) {
      buildings[focusIndex].focus = false;
      focusPage = Math.floor((focusIndex + 1) / this.pageSize) + ((focusIndex + 1) % this.pageSize == 0 ? 0 : 1);
      this._state.page = focusPage;
    }
    // 3. paginate
    const total = buildings.length;
    buildings = buildings.slice((focusPage - 1) * pageSize, (focusPage - 1) * pageSize + pageSize);
    this.filteredBuildingsService.filteredBuildings = buildings;
    return of({buildings, total});
  }

  addBuilding() {
    this.collapsed = false;
    if (this.classType == ClassTypeEnum.Quote) {
      const newBuilding = new PropertyQuoteBuildingClass();
      if (this.propertyParent instanceof PropertyQuoteClass) {
        this.propertyParent.addBuilding(newBuilding);
        newBuilding.isExpanded = true;

      }
    }
    else if (this.classType == ClassTypeEnum.Policy) {
      const newBuilding = new PropertyPolicyBuildingClass();
      console.log('line 148',this.propertyParent);
      if (this.propertyParent instanceof PolicyClass) {
        this.propertyParent.addBuilding(newBuilding);
        newBuilding.isExpanded = true;

      }
    }
    this.filterBuildings();
    this.filterCoverages();
  }

  addCoverage(building: PropertyBuildingClass) {
    console.log('line 156', building instanceof PropertyPolicyBuildingClass);
    console.log('line 158', this.classType);
    if (this.propertyParent instanceof PropertyQuoteClass) {
      this.propertyParent.addCoverage(building as PropertyQuoteBuildingClass);
      this.filterCoverages();
    }
    else if (this.propertyParent instanceof PolicyClass) {
      this.propertyParent.addCoverage(building as PropertyPolicyBuildingClass);
      this.filterCoverages();
    }
  }

  copyBuilding(building: PropertyBuildingClass) {
    if (this.propertyParent instanceof PropertyQuoteClass) {
      const x = new PropertyQuoteBuildingClass(building);
      const clone = deepClone(x.toJSON());
      const newBuilding = new PropertyQuoteBuildingClass(clone);
      newBuilding.propertyQuoteBuildingId = 0;
      newBuilding.isNew = true;
      newBuilding.markDirty();
      newBuilding.propertyQuoteBuildingCoverage.map(x => x.propertyQuoteBuildingCoverageId = 0);
      newBuilding.guid = crypto.randomUUID();
      //newBuilding.propertyParent = building.propertyParent;
      this.propertyParent.addBuilding(newBuilding);
      newBuilding.propertyQuoteBuildingCoverage.map( x=> x.expand = true);
      this.filterBuildingsCoverages();
      this.propertyParent.showDirty = true;
    }
    else if (this.propertyParent instanceof PolicyClass) {
      const x = new PropertyPolicyBuildingClass(building);
      const clone = deepClone(x.toJSON());
      const newBuilding = new PropertyPolicyBuildingClass(clone);
      newBuilding.endorsementBuildingId = 0;
      newBuilding.isNew = true;
      newBuilding.markDirty();
      newBuilding.endorsementBuildingCoverage.map(x => x.endorsementBuildingCoverageId = 0);
      newBuilding.guid = crypto.randomUUID();
      //newBuilding.propertyParent = building.propertyParent;
      this.propertyParent.addBuilding(newBuilding);
      newBuilding.endorsementBuildingCoverage.map( x=> x.expand = true);
      this.filterBuildingsCoverages();
      this.propertyParent.isDirty = true;
    }
  }

  deleteBuilding(building: PropertyBuildingClass) {
    const index = this.buildings.indexOf(building, 0);
    building.markForDeletion = true;
    if (index > -1) {
      // TO DO :
      console.log('line 202',this.propertyParent);
      if (this.propertyParent instanceof PropertyQuoteClass) {
        if (!building.isNew && building.propertyQuoteBuildingId != null && building.propertyQuoteBuildingId > 0) {
          this.deleteSub = this.quoteService
            .deleteBuilding(building.propertyQuoteBuildingId ?? 0)
            .subscribe({
              next: () => {
                if (this.propertyParent instanceof PropertyQuoteClass) {
                  this.propertyParent.deleteBuilding(building);
                  const index = this.filteredBuildings.indexOf(building, 0);
                  if (index > -1) {
                    this.filteredBuildings.splice(index, 1);
                  }
                }
                setTimeout(() => {
                  this.notification.show('Building deleted.', {
                    classname: 'bg-success text-light',
                    delay: 5000,
                  });
                });
                this.propertyParent.markDirty();
              },
              error: (error) => {
                this.messageDialogService.open('Delete error', error.error.Message ?? error.message);
                this.notification.show('Building not deleted.', {
                  classname: 'bg-danger text-light',
                  delay: 5000,
                });
              },
            });
        }
        console.log('line 238', building.isNew);
        if(building.isNew){
          const index = this.propertyParent.propertyQuoteBuildingList.findIndex(x => x.propertyQuoteBuildingId == building.propertyQuoteBuildingId);
          this.propertyParent.propertyQuoteBuildingList.splice(index, 1);

          // this.filteredBuildingsService.filteredCoverages.map(x => {
          //   const index = this.filteredCoverages.indexOf(x, 0);
          //   if (x.propertyQuoteBuildingId == building.propertyQuoteBuildingId) {
          //     this.filteredBuildingsService.filteredCoverages.splice(index, 1);
          //   }});
          this.propertyParent.deleteBuilding(building);
        }

      }
      if (this.propertyParent instanceof PolicyClass) {
        building.markForDeletion = true;
        this.propertyParent.deleteBuilding(building as PropertyPolicyBuildingClass);
      }
      // }
    }
    this.filterBuildings();
    this.filterCoverages();
  }

  filterBuilding(building: PropertyBuildingClass) {
    this.canFilter = true;
    this.searchSubject = building.subjectNumber?.toString() ?? '';
    this.searchPremises = building.premisesNumber?.toString() ?? '';
    this.searchBuilding = building.buildingNumber?.toString() ?? '';
    this.searchAddress = '';
  }

  get showCollapseAll() {
    return this.filteredBuildings.filter(c => c.isExpanded).length > 1;
  }

  collapseAll() {
    this.buildings.forEach(c => c.isExpanded = false);
  }

  clear() {
    this.searchSubject = '';
    this.searchPremises = '';
    this.searchBuilding = '';
    this.searchAddress = '';
    this.searchAddress = '';
  }

  hide() {
    this.clear();
    this.canFilter = false;
  }

  get filteredBuildingCount(): number {
    return this.filteredBuildings.filter(x => !x.markForDeletion).length;
  }
}

export interface SearchResult {
  buildings: PropertyBuildingClass[];
  total: number;
}
