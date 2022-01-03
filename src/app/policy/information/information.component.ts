import { Component, OnInit, ViewChild } from '@angular/core';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { PolicySave } from '../policy-save';
import { EndorsementStatusService } from '../services/endorsement-status.service';
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

  constructor(private endorsementStatusService: EndorsementStatusService) { }

  @ViewChild(PolicyInformationComponent) policyInfoComp!: PolicyInformationComponent;
  @ViewChild(AccountInformationComponent) accountInfoComp!: AccountInformationComponent;

  ngOnInit(): void { }

  isValid(): boolean {
    this.endorsementStatusService.policyInfoValidated =  this.policyInfoComp.isValid() && this.accountInfoComp.accountInfoForm.status == 'VALID';
    return this.policyInfoComp.isValid() && this.accountInfoComp.accountInfoForm.status == 'VALID';
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
    this.showInvalid = false;

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
    this.invalidMessage = "";
    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (let error of invalid) {
        this.invalidMessage += "<br><li>" + error;
      }
    }
    if (this.policyInfoComp.ErrorMessages().length > 0) {
      this.showInvalid = true;
      this.policyInfoComp.ErrorMessages().forEach(error => {
        this.invalidMessage += "<br><li>" + error;
      }); 
    }
    if (this.showInvalid) {
      this.invalidMessage = "Following fields are invalid" + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

}
