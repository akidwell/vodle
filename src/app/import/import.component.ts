import { Component, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { ImportPolicy } from './interfaces/import-policy';
import { ImportService } from './import.service';
import { UserAuth } from '../authorization/user-auth';
import { ImportRequest } from './interfaces/import-request';
import { ImportResult } from './interfaces/import-response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Router } from "@angular/router";
import { DecimalPipe } from '@angular/common';
import { switchMap, tap } from 'rxjs/operators';
import { State } from './interfaces/state';
import { SearchResult } from './interfaces/serarch-result';


function matches(policy: ImportPolicy, term: string, pipe: PipeTransform) {
  return policy.uwLastName.toLowerCase().includes(term.toLowerCase())
    || policy.policyNumber.toLowerCase().includes(term)
    || policy.submissionNumber.toString().replace(',','').includes(term);
}

@Component({
  selector: 'rsps-import',
  templateUrl: './import.component.html',
  styleUrls: ['../app.component.css', './import.component.css'],
})
export class ImportComponent implements OnInit {
  errorMessage = '';
  sub!: Subscription;
  importPolicies: ImportPolicy[] = []
  openModal: boolean = false;
  importPolicyResponse!: ImportResult;
  pipeMessage: string = "";
  faSearch = faSearch;
  showBusy: boolean = false;
  authSub: Subscription;
  canExecuteImport: boolean = false;

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _policies$ = new BehaviorSubject<ImportPolicy[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  get policies$() { return this._policies$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }

  // Defaul pagination settings
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: ''
  };

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {pageSize, page, searchTerm} = this._state;
    
    // Catch invaldid characters, this is used for demonstration purposes
    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars
    if (pattern.test(searchTerm)) {
        this._loading$.next(false);
        throw Error("No special characters");
    }

    // 1. Populate from source
    let policies = this.importPolicies;

    // 2. filter
    policies = policies.filter(policy => matches(policy, searchTerm, this.pipe));
    const total = policies.length;

    // 3. paginate
    policies = policies.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({policies, total});
  }

  constructor(private importService: ImportService, private userAuth: UserAuth, private modalService: NgbModal, private router: Router,private pipe: DecimalPipe) { 
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false)),
    ).subscribe(result => {
      this._policies$.next(result.policies);
      this._total$.next(result.total);
    });

    this._search$.next();

    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canExecuteImport2$.subscribe(
      (canExecuteImport2: boolean) => this.canExecuteImport = canExecuteImport2
    );
  }

  ngOnInit(): void {
    this.sub = this.importService.getImportPolicies().subscribe({
      next: importPolicies => {
        this.importPolicies = importPolicies;
        this.searchTerm = "";
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.authSub.unsubscribe();
  }

  // GAM - TEMP - commented for now
  // canExecuteImport(): boolean {
  //   return this.userAuth.canExecuteImport == "True" ? true : false;
  // }

  async import(selectedRow: any): Promise<void> {
    const parm: ImportRequest = { submissionNumber: selectedRow.submissionNumber };
    this.showBusy = true;
    this.sub = this.importService.postImportPolicies(parm).subscribe({
      next: importPolicyResponse => {
        this.importPolicyResponse = importPolicyResponse;
        this.routeImport();
      },
      error: err => { this.errorMessage = err; this.showBusy = false;}
    });
  }

  // Decide to either show errors or if succesful open up the policy
  routeImport() {
    this.showBusy = false;
    if (this.importPolicyResponse?.isPolicyImported) {
      console.log(this.importPolicyResponse.policyId);
      this.router.navigate(['/policy/' + this.importPolicyResponse.policyId.toString()]) + '/0';
    }
    else if (this.importPolicyResponse!= null) {
      this.pipeMessage = this.importPolicyResponse.errorMessage;
      this.triggerModal();
    }
  }

  @ViewChild('modalPipe') modalPipe: any;

  // Modal is used to show import errors
  triggerModal() {
    this.modalService.open(this.modalPipe, { scrollable: true });
  }

}