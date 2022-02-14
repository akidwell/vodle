import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { AccountInformation } from '../../policy';
import { NgForm } from '@angular/forms';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/notification/notification-service';
import { EndorsementStatusService } from '../../services/endorsement-status.service';

@Component({
  selector: 'rsps-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {
  isReadOnly: boolean = true;
  accountCollapsed = false;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  accountSub!: Subscription;
  faPlus = faAngleDown;
  faMinus = faAngleUp;
  canEditEndorsement: boolean = false;
  statusSub!: Subscription;

  @Input() public accountInfo!: AccountInformation;
  @Input() public lockEndorsementFields!: boolean;

  @ViewChild(NgForm, { static: false }) accountInfoForm!: NgForm;

  constructor(private userAuth: UserAuth, private notification: NotificationService, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
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

  allowSave(): boolean {
    if (this.canEditPolicy && this.accountInfoForm.dirty) {
      if (this.accountInfoForm.status != "VALID") {
        this.notification.show('Account Information not saved.', { classname: 'bg-danger text-light', delay: 5000 });
        return false;
      }
      return true;
    }
    return false;
  }
  isFieldReadOnly(checkEndorsementLockStatus: boolean): boolean {
    if(!checkEndorsementLockStatus) {
      return !this.canEdit;
    } else {
      if (this.lockEndorsementFields) {
        return true;
      } else {
        return !this.canEdit;
      }
    }
  }
  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }
}
