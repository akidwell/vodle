import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PropertyQuoteBuildingClass } from 'src/app/features/quote/classes/property-quote-building-class';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';
import { faAngleDown, faAngleUp, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { PropertyQuote } from 'src/app/features/quote/models/property-quote';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { PageState } from 'src/app/core/models/page-state';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { ThemePalette } from '@angular/material/core';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';

@Component({
  selector: 'rsps-property-building-group',
  templateUrl: './property-building-group.component.html',
  styleUrls: ['./property-building-group.component.css']
})
export class PropertyBuildingGroupComponent implements OnInit {
  deleteSub!: Subscription;
  searchSub!: Subscription;
  collapsed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faCircleXmark = faCircleXmark;
  canFilter = false;
  color: ThemePalette = 'warn';
  searchThrottle = new Subject<void>();
  searchAddress = '';
  private _buildings: PropertyQuoteBuildingClass[] = [];

  @Input() public propertyQuote!: PropertyQuoteClass;
  @Input() public buildingCount!: number;
  @Input() public canEdit = false;
  @Input() public classType!: ClassTypeEnum;
  @Input() set buildings(value: PropertyQuoteBuildingClass[]) {
    this._buildings = value;
    this._search$.next();
  }
  get buildings(): PropertyQuoteBuildingClass[] {
    return this._buildings;
  }

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _policies$ = new BehaviorSubject<PropertyQuoteBuildingClass[]>([]);
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

  constructor(private notification: NotificationService, private quoteService: QuoteService, private messageDialogService: MessageDialogService) {
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
      this._policies$.next(result.buildings);
      this._total$.next(result.total);
    });
  }

  ngOnInit(): void {
    this._search$.next();
    this.searchSub = this.searchThrottle.pipe(debounceTime(500)).subscribe(() => {
      this.propertyQuote.searchAddress = this.searchAddress;
    });

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
    // 2.  Set Focus Page
    const focusIndex = buildings.findIndex((c) => c.focus);
    let focusPage = page;
    if (focusIndex >= 0) {
      buildings[focusIndex].focus = false;
      focusPage = Math.floor((focusIndex + 1) / this.pageSize) + ((focusIndex + 1) % this.pageSize == 0 ? 0 : 1);
      this._state.page = focusPage;
    }
    // 3. paginate
    const total = buildings.length;
    buildings = buildings.slice((focusPage - 1) * pageSize, (focusPage - 1) * pageSize + pageSize);
    return of({buildings, total});
  }

  addBuilding() {
    if (this.classType == ClassTypeEnum.Quote) {
      const newBuilding = new PropertyQuoteBuildingClass();
      this.propertyQuote.addBuilding(newBuilding);
    }
    else if (this.classType == ClassTypeEnum.Policy) {
      //TODO
    }
  }

  addCoverage(building: PropertyQuoteBuildingClass) {
    if (this.classType == ClassTypeEnum.Quote) {
      building.addCoverage();
    }
    else if (this.classType == ClassTypeEnum.Policy) {
      //TODO
    }
  }

  copyBuilding(building: PropertyQuoteBuildingClass) {
    if (this.classType == ClassTypeEnum.Quote) {
      const clone = deepClone(building.toJSON());
      const newBuilding = new PropertyQuoteBuildingClass(clone);
      newBuilding.propertyQuoteBuildingId = 0;
      newBuilding.isNew = true;
      newBuilding.expand = true;
      newBuilding.markDirty();
      this.propertyQuote.addBuilding(newBuilding);
      this.propertyQuote.showDirty = true;
    }
  }

  deleteBuilding(building: PropertyQuoteBuildingClass) {
    const index = this.buildings.indexOf(building, 0);
    if (index > -1) {
      if (!building.isNew && building.propertyQuoteBuildingId > 0) {
        this.deleteSub = this.quoteService
          .deleteBuilding(building.propertyQuoteBuildingId)
          .subscribe({
            next: () => {
              this.propertyQuote.deleteBuilding(building);
              setTimeout(() => {
                this.notification.show('Building deleted.', {
                  classname: 'bg-success text-light',
                  delay: 5000,
                });
              });
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
      else {
        this.propertyQuote.deleteBuilding(building);
      }
    }
  }

  filterBuilding(building: PropertyQuoteBuildingClass) {
    this.canFilter = true;
    this.propertyQuote.searchSubject = building.subjectNumber?.toString() ?? '';
    this.propertyQuote.searchPremises = building.premisesNumber?.toString() ?? '';
    this.propertyQuote.searchBuilding = building.buildingNumber?.toString() ?? '';
    this.propertyQuote.searchAddress = '';
  }

  get showCollapseAll() {
    return this.buildings.filter(c => c.isExpanded).length > 1;
  }

  collapseAll() {
    this.buildings.forEach(c => c.isExpanded = false);
  }

  clear() {
    this.propertyQuote.searchSubject = '';
    this.propertyQuote.searchPremises = '';
    this.propertyQuote.searchBuilding = '';
    this.searchAddress = '';
    this.propertyQuote.searchAddress = '';
  }

  hide() {
    this.clear();
    this.canFilter = false;
  }
}

export interface SearchResult {
  buildings: PropertyQuoteBuildingClass[];
  total: number;
}
