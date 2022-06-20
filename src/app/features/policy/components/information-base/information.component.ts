import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { PolicyHistoryService } from 'src/app/core/services/policy-history/policy-history.service';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { AccountInformation, Endorsement, PolicyInformation } from '../../models/policy';
import { PolicySave } from '../../models/policy-save';
import { PolicyService } from '../../services/policy/policy.service';
import { AccountInformationComponent } from '../information-account/account-information.component';
import { PolicyInformationComponent } from '../information-policy/policy-information.component';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';

@Component({
  selector: 'rsps-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit, PolicySave {
  isReadOnly = true;
  accountCollapsed = false;
  faPlus = faPlus;
  faMinus = faMinus;
  invalidMessage = '';
  showInvalid = false;
  data!: Data;
  accountInfo!: AccountInformation;
  policyInfo!: PolicyInformation;
  endorsement!: Endorsement;
  lockEndorsementFields = false;
  canEditEndorsement = false;
  canEditPolicy = false;
  authSub: Subscription;
  statusSub!: Subscription;

  constructor(private endorsementStatusService: EndorsementStatusService, private route: ActivatedRoute, private notification: NotificationService,
    private policyService: PolicyService, private policyHistoryService: PolicyHistoryService,private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  @ViewChild(PolicyInformationComponent) policyInfoComp!: PolicyInformationComponent;
  @ViewChild(AccountInformationComponent) accountInfoComp!: AccountInformationComponent;

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.data = deepClone(data);
      this.accountInfo = data['accountData'].accountInfo;
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.endorsement = data['endorsementData'].endorsement;
      this.lockEndorsementFields = this.setEndorsementFieldStatus();
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
  }

  isValid(): boolean {
    if (!this.canEdit) {
      return true;
    }
    this.endorsementStatusService.policyInfoValidated = this.policyInfoComp.isValid() && this.accountInfoComp.accountInfoForm.status == 'VALID';
    return this.policyInfoComp.isValid() && this.accountInfoComp.accountInfoForm.status == 'VALID';
  }

  isDirty(): boolean {
    return this.canEdit && ((this.policyInfoComp.policyInfoForm.dirty == true || this.accountInfoComp.accountInfoForm.dirty == true) ? true : false);
  }

  save(): void {
    this.saveEndorsementInfo().subscribe(() => {
      this.savePolicyInfo().subscribe(() => {
        this.saveAccountInfo().subscribe();
      });
    });
  }

  saveEndorsementInfo(): Observable<boolean> {
    const subject = new Subject<boolean>();
    if (this.policyInfoComp.allowEndorsementSave()) {
      this.policyService.updateEndorsement(this.endorsement).subscribe(() => {
        subject.next(true);
      });
    } else {
      setTimeout(() => subject.next(true), 0);
    }
    return subject.asObservable();
  }

  savePolicyInfo(): Observable<boolean> {
    const subject = new Subject<boolean>();
    if (this.policyInfoComp.allowSave()) {
      this.policyService.updatePolicyInfo(this.policyInfo).subscribe(() => {
        this.data['policyInfoData'].policyInfo = deepClone(this.policyInfo);
        this.policyHistoryService.updatePolicyHistory(this.policyInfo.policyId, this.policyInfo.policySymbol.trim() + ' ' + this.policyInfo.formattedPolicyNo, this.endorsement.endorsementNumber);
        this.policyInfoComp.policyInfoForm.form.markAsPristine();
        this.policyInfoComp.policyInfoForm.form.markAsUntouched();
        this.notification.show('Policy Information successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        subject.next(true);
      });
    } else {
      setTimeout(() => subject.next(true), 0);
    }
    return subject.asObservable();
  }

  saveAccountInfo(): Observable<boolean> {
    const subject = new Subject<boolean>();
    if (this.accountInfoComp.allowSave()) {
      this.policyService.updateAccountInfo(this.accountInfo).subscribe(() => {
        this.data['accountData'].accountInfo = deepClone(this.accountInfo);
        this.accountInfoComp.accountInfoForm.form.markAsPristine();
        this.accountInfoComp.accountInfoForm.form.markAsUntouched();
        this.notification.show('Account Information successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        subject.next(true);
      });
    } else {
      setTimeout(() => subject.next(true), 0);
    }
    return subject.asObservable();
  }

  showInvalidControls(): void {
    const invalid = [];
    const policyControls = this.policyInfoComp.policyInfoForm.controls;
    this.showInvalid = false;

    // Check each control in policy information component if it is valid
    for (const name in policyControls) {
      if (policyControls[name].invalid) {
        invalid.push(name);
      }
    }
    // Check each control in account information component if it is valid
    const accountControls = this.accountInfoComp.accountInfoForm.controls;
    for (const name in accountControls) {
      if (accountControls[name].invalid) {
        invalid.push(name);
      }
    }
    this.invalidMessage = '';
    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (const error of invalid) {
        this.invalidMessage += '<br><li>' + error;
      }
    }
    if (this.policyInfoComp.ErrorMessages().length > 0) {
      this.showInvalid = true;
      this.policyInfoComp.ErrorMessages().forEach(error => {
        this.invalidMessage += '<br><li>' + error;
      });
    }
    if (this.showInvalid) {
      this.invalidMessage = 'Following fields are invalid' + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }
  setEndorsementFieldStatus(): boolean {
    if (this.endorsement.endorsementNumber > 0) {
      return true;
    } else {
      return false;
    }
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy;
  }
}
