import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImportPolicy } from './interfaces/import-policy';
import { ImportService } from './import.service';
import { UserAuth } from '../authorization/user-auth';
import { ImportRequest } from './interfaces/import-request';
import { ImportResult } from './interfaces/import-response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Router } from "@angular/router";

@Component({
  selector: 'rsps-import',
  templateUrl: './import.component.html',
  styleUrls: ['../app.component.css', './import.component.css']
})
export class ImportComponent implements OnInit {
  errorMessage = '';
  sub!: Subscription;
  filteredImportPolicies: ImportPolicy[] = [];
  importPolicies: ImportPolicy[] = []
  openModal: boolean = false;
  importPolicyResponse!: ImportResult;
  pipeMessage: string = "";
  faSearch = faSearch;
  showBusy: boolean = false;

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredImportPolicies = this.listFilter ? this.performFilter(this.listFilter) : this.importPolicies;
  }

  constructor(private importService: ImportService, private userAuth: UserAuth, private modalService: NgbModal, private router: Router) { }

  performFilter(filterBy: string): ImportPolicy[] {
    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars
    if (pattern.test(filterBy)) {
        throw Error("No special characters");
    }

    filterBy = filterBy.toLocaleLowerCase();
    return this.importPolicies.filter((product: ImportPolicy) =>
      product.submissionNumber.toString().toLocaleLowerCase().includes(filterBy) || product.policyNumber.toString().toLocaleLowerCase().includes(filterBy));
  }

  ngOnInit(): void {
    this.sub = this.importService.getImportPolicies().subscribe({
      next: importPolicies => {
        this.importPolicies = importPolicies;
        this.filteredImportPolicies = this.importPolicies;
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  canExecuteImport(): boolean {
    return this.userAuth.canExecuteImport == "True" ? true : false;
  }

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

  routeImport() {
    this.showBusy = false;
    if (this.importPolicyResponse?.isPolicyImported) {
      console.log(this.importPolicyResponse.policyId);
      this.router.navigate(['/policy/' + this.importPolicyResponse.policyId.toString()]);
    }
    else if (this.importPolicyResponse!= null) {
      this.pipeMessage = this.importPolicyResponse.errorMessage;
      this.triggerModal();
    }
  }

  @ViewChild('modalPipe') modalPipe: any;

  triggerModal() {
    this.modalService.open(this.modalPipe, { scrollable: true });
  }
}