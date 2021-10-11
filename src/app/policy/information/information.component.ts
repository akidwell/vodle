import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/notification/notification-service';
import { PolicySave } from '../policy-save';
import { AccountInformationComponent } from './account-information/account-information.component';
import { PolicyInformationComponent } from './policy-information/policy-information.component';

@Component({
  selector: 'rsps-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit, PolicySave {
  isReadOnly: boolean = true;
  accountCollapsed = false;
  faPlus = faPlus;
  faMinus = faMinus;
  formStatus: boolean | null = false;
  invalidMessage: string = "";
  showInvalid: boolean = false;

  constructor(private notification: NotificationService) { }

  @ViewChild(PolicyInformationComponent) policyInfoComp!: PolicyInformationComponent;
  @ViewChild(AccountInformationComponent) accountInfoComp!: AccountInformationComponent;

  // @Output() status: EventEmitter<any> = new EventEmitter();

  // checkFormStatus() {
  //   //emit data to parent component
  //   if (this.policyInfoComp != null)
  //     this.policyInfoComp.policyInfoForm?.statusChanges?.subscribe(res => {
  //       this.formStatus = res; // Return VALID or INVALID
  //       this.status.emit(res);
  //     })
  // }

  ngOnInit(): void { }

  isValid(): boolean {
    return this.policyInfoComp.policyInfoForm.status == 'VALID' && this.accountInfoComp.accountInfoForm.status == 'VALID'
  }

  isDirty(): boolean {
    return (this.policyInfoComp.policyInfoForm.dirty ?? false) || (this.accountInfoComp.accountInfoForm.dirty ?? false);
  }

  save(): void {
    this.accountInfoComp.save();
    this.policyInfoComp.save();
  }
  
  showInvalidControls(): void {
    let invalid = [];
    let policyControls = this.policyInfoComp.policyInfoForm.controls;

    // Check each control in policy information component if it is valid
    for (let name in policyControls) {
      if (policyControls[name].invalid) {
        invalid.push(name);
      }
    }

    // Check each control in account information component if it is valid
    let accountControls = this.accountInfoComp.accountInfoForm.controls;
    for (let name in accountControls) {
      if (accountControls[name].invalid) {
        invalid.push(name);
      }
    }

    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      this.invalidMessage = "Following fields are invalid";
      for (let test of invalid) {
        this.invalidMessage += "<br><li>" + test;
      }
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

}
