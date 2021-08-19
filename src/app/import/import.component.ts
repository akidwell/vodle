import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IImportPolicy } from './import-policy';
import { ImportService } from './import.service';
import { UserAuth } from '../authorization/user-auth';
import { IImportParameter } from './import-parameter';
import { IImportResult } from './import-response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rsps-import',
  templateUrl: './import.component.html',
  styleUrls: ['../app.component.css', './import.component.css']
})
export class ImportComponent implements OnInit {
  errorMessage = '';
  sub!: Subscription;
  filteredImportPolicies: IImportPolicy[] = [];
  importPolicies: IImportPolicy[] = []
  openModal: boolean = false;
  importPolicyResponse!: IImportResult;
  pipeMessage: string = "";

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredImportPolicies = this.listFilter ? this.performFilter(this.listFilter) : this.importPolicies;
  }

  constructor(private importService: ImportService, private userAuth: UserAuth, private modalService: NgbModal) { }

  performFilter(filterBy: string): IImportPolicy[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.importPolicies.filter((product: IImportPolicy) =>
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

  import(selectedRow: any): void {
    const parm: IImportParameter = { submissionNumber: selectedRow.submissionNumber, quoteId: selectedRow.quoteId, programId: selectedRow.programId };

    this.sub = this.importService.postImportPolicies(parm).subscribe({
      next: importPolicyResponse => {
        this.importPolicyResponse = importPolicyResponse;
      },
      error: err => this.errorMessage = err
    });

    if (this.importPolicyResponse?.isPolicyImported) {
      this.pipeMessage = this.importPolicyResponse.policyId.toString();
      this.triggerModal();
    }
    else if (this.importPolicyResponse!= null) {
      this.pipeMessage = "Not imported!";
      this.triggerModal();
    }
    
  }

  @ViewChild('modalPipe') modalPipe: any;

  triggerModal() {
    this.modalService.open(this.modalPipe);
  }
}
