import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { AccountInformationComponent } from './account-information/account-information.component';
import { PolicyInformationComponent } from './policy-information/policy-information.component';

@Component({
  selector: 'rsps-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  isReadOnly: boolean = true;
  accountCollapsed = false;
  faPlus = faPlus;
  faMinus = faMinus;
  formStatus: boolean | null = false;

  constructor() { }

  @ViewChild(PolicyInformationComponent) policyInfoComp!: PolicyInformationComponent;
  @ViewChild(AccountInformationComponent) accountInfoComp!: AccountInformationComponent;

  @Output() status: EventEmitter<any> = new EventEmitter();

  checkFormStatus() {
    //emit data to parent component
    if (this.policyInfoComp != null)
      this.policyInfoComp.policyInfoForm?.statusChanges?.subscribe(res => {
        this.formStatus = res; // Return VALID or INVALID
        this.status.emit(res);
      })
  }

  ngOnInit(): void { }

  isValid() {
    return this.policyInfoComp.policyInfoForm.status == 'VALID' && this.accountInfoComp.accountInfoForm.status == 'VALID'
  }

  invalidControls() {
    const invalid = [];
    const controls = this.policyInfoComp.policyInfoForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

}
