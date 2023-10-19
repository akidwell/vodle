import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, tap, switchMap, Observable, of } from 'rxjs';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PageState } from 'src/app/core/models/page-state';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { PropertyBuildingCoverage, PropertyBuildingCoverageSubjectAmountData } from 'src/app/features/quote/models/property-building-coverage';
import { Quote } from 'src/app/features/quote/models/quote';

@Component({
  selector: 'rsps-property-detail-left',
  templateUrl: './property-detail-left.component.html',
  styleUrls: ['./property-detail-left.component.css']
})
export class PropertyDetailLeftComponent implements OnInit {
  @Input() public propertyParent!: PropertyQuoteClass | PolicyClass;
  @Input() public classType!: ClassTypeEnum;
  @Input() public canEdit = false;
  @Input() public buildings!: PropertyBuildingClass[];
  @Input() public limitTotal!: number;
  @Input() public largestTiv!: number;
  @Input() public lawLimits!: number;
  @Input() public largestExposure!: number;

  private _subjects$ = new BehaviorSubject< PropertyBuildingCoverageSubjectAmountData[]>([]);
  get subjects$() { return this._subjects$.asObservable(); }

  private _loading$ = new BehaviorSubject<boolean>(true);
  get loading$() { return this._loading$.asObservable(); }

  get pageSize() { return this._state.pageSize; }
  set pageSize(pageSize: number) {
    this._set({pageSize});
  }

  private _search$ = new Subject<void>();

  private _total$ = new BehaviorSubject<number>(0);
  get total$() { return this._total$.asObservable(); }

  get page() { return this._state.page; }
  set page(page: number) { this._set({page}); }

  private _set(patch: Partial<PageState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  // Default pagination settings
  private _state: PageState = {
    page: 1,
    pageSize: 5,
    searchTerm: ''
  };
  private _subjectAmount!: Map<any, any>;

  @Input() set subjectAmount(value:Map<any, any>) {
    this._subjectAmount = value;
    this._search$.next();
  }
  get subjectAmount():Map<any, any> {
    return this._subjectAmount;
  }
  number!: number;

  propBuildings: PropertyBuildingCoverage[] = [];

  constructor() {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false)),
    ).subscribe(result => {
      this._subjects$.next(result.subjects);
      this._total$.next(result.total);
    });
  }

  ngOnInit(): void {
  }

  private _search(): Observable<SearchResult> {
    const {pageSize, page} = this._state;
    // 1. Populate from source
    const array = Array.from(this.subjectAmount);
    let subjects: PropertyBuildingCoverageSubjectAmountData[] = [];

    array.forEach(x => {
      const subAm: PropertyBuildingCoverageSubjectAmountData = {} as PropertyBuildingCoverageSubjectAmountData;
      subAm.subject = x[0];
      subAm.limit = x[1];
      subjects.push(subAm);});

    const total = subjects.length;

    subjects = subjects.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({subjects, total});
  }
}

export interface SearchResult {
  subjects: PropertyBuildingCoverageSubjectAmountData[];
  total: number;
}
