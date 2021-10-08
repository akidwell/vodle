import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/notification/notification-service';
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

  constructor(private notification: NotificationService) { }

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

  isDirty() {
    return this.policyInfoComp.policyInfoForm.dirty || this.accountInfoComp.accountInfoForm.dirty;
  }

  save() {
    this.accountInfoComp.save();
    this.policyInfoComp.save();
  }
  
  invalidControls() {
    let invalid = [];
    let policyControls = this.policyInfoComp.policyInfoForm.controls;
    for (let name in policyControls) {
      if (policyControls[name].invalid) {
        invalid.push(name);
      }
    }

    let accountControls = this.accountInfoComp.accountInfoForm.controls;
    for (let name in accountControls) {
      if (accountControls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

}
