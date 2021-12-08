import { Component, OnInit, ViewChild } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { AccountInformation } from '../../policy';
import { NgForm } from '@angular/forms';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Subscription } from 'rxjs';
import { PolicyService } from '../../policy.service';
import { NotificationService } from 'src/app/notification/notification-service';
import { PolicyStatusService } from '../../services/policy-status.service';

@Component({
  selector: 'rsps-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {
  accountInfo!: AccountInformation;
  isReadOnly: boolean = true;
  accountCollapsed = false;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  accountSub!: Subscription;
  faPlus = faAngleDown;
  faMinus = faAngleUp;
  readonlyStatus: boolean = false;
  
  @ViewChild(NgForm, { static: false }) accountInfoForm!: NgForm;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private policyService: PolicyService, private notification: NotificationService, private policyStatusService: PolicyStatusService) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.accountInfo = data['accountData'].accountInfo;
    });
    this.policyStatusService.readonly.subscribe({
      next: readonly => {
        this.readonlyStatus = readonly;  
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  save(): boolean {
    if (this.canEditPolicy && this.accountInfoForm.dirty) {
      if (this.accountInfoForm.status != "VALID") {
        this.notification.show('Account Information not saved.', { classname: 'bg-danger text-light', delay: 5000 });
        return false;
      }

      this.accountSub = this.policyService.updateAccountInfo(this.accountInfo).subscribe(result => {
        this.accountInfoForm.form.markAsPristine();
        this.accountInfoForm.form.markAsUntouched();
        this.notification.show('Account Information successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        return result;
      });
    }
    return false;
  }

}
