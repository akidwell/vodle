import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { ImportPolicy } from '../../models/import-policy';
import { ImportResult } from '../../models/import-response';
import { PageState } from '../../../../core/models/page-state';
import { SearchResult } from '../../models/search-result';
import { ImportService } from '../../services/import/import.service';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { ImportRequest } from '../../models/import-request';

function matches(policy: ImportPolicy, term: string) {
  return policy.uwLastName.toLowerCase().includes(term.toLowerCase())
    || policy.policyNumber.toLowerCase().includes(term)
    || policy.submissionNumber.toString().replace(',','').includes(term);
}

@Component({
  selector: 'rsps-import',
  templateUrl: './import.component.html',
  styleUrls: ['../../../../app.component.css', './import.component.css'],
})
export class ImportComponent implements OnInit {
  errorMessage = '';
  sub!: Subscription;
  importPolicies: ImportPolicy[] = [];
  openModal = false;
  importPolicyResponse!: ImportResult;
  faSearch = faSearch;
  showBusy = false;
  authSub: Subscription;
  canExecuteImport = false;

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _policies$ = new BehaviorSubject<ImportPolicy[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  get policies$() { return this._policies$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  set page(page: number) { this._set({page}); }
  get pageSize() { return this._state.pageSize; }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  get searchTerm() { return this._state.searchTerm; }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }

  // Defaul pagination settings
  private _state: PageState = {
    page: 1,
    pageSize: 15,
    searchTerm: ''
  };

  private _set(patch: Partial<PageState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {pageSize, page, searchTerm} = this._state;

    // 1. Populate from source
    let policies = this.importPolicies;

    // 2. filter
    policies = policies.filter(policy => matches(policy, searchTerm.trim().toLowerCase()));
    const total = policies.length;

    // 3. paginate
    policies = policies.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({policies, total});
  }

  constructor(private importService: ImportService, private userAuth: UserAuth, private router: Router, private navigationService: NavigationService, private messageDialogService: MessageDialogService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false)),
    ).subscribe(result => {
      this._policies$.next(result.policies);
      this._total$.next(result.total);
    });

    this._search$.next();
    this.authSub = this.userAuth.canExecuteImport$.subscribe(
      (canExecuteImport: boolean) => this.canExecuteImport = canExecuteImport
    );
  }

  ngOnInit(): void {
    this.sub = this.importService.getImportPolicies().subscribe({
      next: importPolicies => {
        this.importPolicies = importPolicies;
        this.searchTerm = '';
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.authSub.unsubscribe();
  }

  async import(selectedRow: ImportPolicy): Promise<void> {
    const parm: ImportRequest = { submissionNumber: selectedRow.submissionNumber };
    this.showBusy = true;
    this.sub = this.importService.postImportPolicies(parm).subscribe({
      next: importPolicyResponse => {
        this.importPolicyResponse = importPolicyResponse;
        this.routeImport();
      },
      error: err => {
        this.errorMessage = err;
        this.showBusy = false;
        this.messageDialogService.open('Import Error', err.error.Message);
      }
    });
  }

  // Decide to either show errors or if succesful open up the policy
  routeImport() {
    this.showBusy = false;
    if (this.importPolicyResponse?.isPolicyImported) {
      this.navigationService.clearReuse();
      this.router.navigate(['/policy/' + this.importPolicyResponse.policyId.toString() + '/0']);
    }
    else if (this.importPolicyResponse!= null) {
      this.messageDialogService.open('Import Error', this.importPolicyResponse.errorMessage);
    }
  }
}
