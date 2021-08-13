import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IImportPolicy } from './import-policy';
import { ImportService } from './import.service';
import { UserAuth } from '../authorization/user-auth';

@Component({
  selector: 'rsps-import',
  templateUrl: './import.component.html',
  styleUrls: ['../app.component.css','./import.component.css']
})
export class ImportComponent implements OnInit {
  errorMessage = '';
  sub!: Subscription;
  filteredImportPolicies: IImportPolicy[] = [];
  importPolicies: IImportPolicy[] = []

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredImportPolicies = this.listFilter ? this.performFilter(this.listFilter) : this.importPolicies;
  }

  constructor(private importService: ImportService, private userAuth: UserAuth) {}

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

}
