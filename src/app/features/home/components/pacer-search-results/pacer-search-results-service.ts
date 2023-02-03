import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { SortColumn, SortDirection } from 'src/app/shared/directives/sortable-header';
import { InsuredSearchResponses } from '../../models/search-results';

export interface SearchResult {
    insureds: InsuredSearchResponses[];
    total: number;
  }

export interface SortableInsuredPageState {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
  }

function matches(policy: InsuredSearchResponses, term: string) {
  const datePipe = new DatePipe('en-US');
  const effectiveDate = datePipe.transform(policy.effectiveDate, 'MM/dd/yyyy');
  const recDate = datePipe.transform(policy.recievedDate, 'MM/dd/yyyy');

  return policy.name?.toLowerCase().includes(term)
      || policy.insuredCity?.toLowerCase().includes(term)
      || policy.insuredState?.toLowerCase().includes(term)
      || policy.zip?.toLowerCase().includes(term)
      || policy.insuredName?.toLowerCase().includes(term)
      || policy.streetAddress?.toLowerCase().includes(term)
      || policy.type?.toLowerCase().includes(term)
      || policy.subStatus?.toLowerCase().includes(term)
      || policy.policyNumber?.toLowerCase().includes(term)
      || policy.producer?.toLowerCase().includes(term)
      || effectiveDate?.toLowerCase().includes(term)
      || recDate?.toLowerCase().includes(term);
}

const compare = (v1: string | number , v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(insureds: InsuredSearchResponses[], column: SortColumn, direction: string): InsuredSearchResponses[] {
  if (direction === '' || column === '') {
    return insureds;
  } else {
    return [...insureds].sort((a, b) => {
      let res: number;
      if (typeof(a[column]) == 'string') {
        res = compare(a[column]!.toString().toLowerCase(), b[column]!.toString().toLowerCase());
      }
      else {
        res = compare(Number(a[column]), Number(b[column]));
      }
      return direction === 'asc' ? res : -res;
    });
  }
}

@Injectable({ providedIn: 'root' })
export class PacerSearchResultsService {
  private _search$ = new Subject<void>();
  private _total$ = new BehaviorSubject<number>(0);
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _insureds$ = new BehaviorSubject<InsuredSearchResponses[]>([]);
  private _filteredInsureds$ = new BehaviorSubject<InsuredSearchResponses[]>([]);

  private _state: SortableInsuredPageState = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  set page(page: number) {
    this._set({ page });
  }
  get pageSize() {
    return this._state.pageSize;
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  get filter() {
    return this._state.searchTerm;
  }
  set filter(searchTerm: string) {
    this._set({ searchTerm });
  }

  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }
  get insureds() {
    return this._insureds$.getValue();
  }
  set insureds(value: InsuredSearchResponses[]) {
    this._insureds$.next(value);
    this._search$.next();
  }
  get filterdInsureds$() {
    return this._filteredInsureds$.asObservable();
  }
  set filteredInsureds(value: InsuredSearchResponses[]) {
    this._filteredInsureds$.next(value);
  }

  constructor() {
    // Get the default size from local storage
    let pageSize = 8;
    if (pageSize == null) {
      this.pageSize = this._state.pageSize;
      pageSize = this.pageSize;
    }
    if (!isNaN(Number(pageSize))) {
      this._state.pageSize = Number(pageSize);
    }
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        switchMap(() => this._search()),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._filteredInsureds$.next(result.insureds);
        this._total$.next(result.total);
      });
  }

  private _set(patch: Partial<SortableInsuredPageState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;
    // 1. Populate from source
    let insureds = this.insureds;

    // // 2. filter
    insureds = insureds.filter((policy) =>
      matches(policy, searchTerm.trim().toLowerCase())
    );

    // 3. sort
    insureds = sort(insureds, sortColumn, sortDirection);

    // // 4. paginate
    const total = insureds.length;
    insureds = insureds.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );
    return of({ insureds, total });
  }
}
