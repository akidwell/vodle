import { Injectable } from '@angular/core';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { PolicyClass } from '../../classes/policy-class';
import { BehaviorSubject, Subscription, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { PolicyInformation } from 'src/app/features/policy/models/policy';

@Injectable({
  providedIn: 'root'
})
export class PolicySavingService {



  policySub!: Subscription;
  policy: PolicyClass |PolicyInformation | null = null;

  isSaving$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isSaving= false;

  get isSaving(): boolean { return this._isSaving; }
  set isSaving(value: boolean) {
    this._isSaving = value;
    this.isSaving$.next(this._isSaving);
  }

  constructor(
  private router: Router,
  private policyService: PolicyService,
  public pageDataService: PageDataService,
  private notification: NotificationService,
  private messageDialogService: MessageDialogService
  ) {
    console.log('init');
    this.policySub = this.pageDataService.policyData$.subscribe(
      (policy: PolicyClass | PolicyInformation |null) => {
        this.policy = policy;
      }
    );
  }

  async savePolicy() {
    const policy = this.policy;
    if (policy && this.policy instanceof PolicyClass && policy instanceof PolicyClass) {
      console.log('policy: ', policy, 'id: ');
      this.isSaving = true;
      console.log(policy);
      const results$ = this.policyService.updatePolicyInfoV2(policy);
      await lastValueFrom(results$)
        .then(async (policyData: PolicyClass) => {
          this.policy = policyData;
          const x = new PolicyClass(policyData);
          x?.onSave(x);
          x?.afterSave();
          this.notification.show('Quote Saved.', {
            classname: 'bg-success text-light',
            delay: 5000,
          });
          this.isSaving = false;
          return true;
        })
        .catch((error) => {
          this.isSaving = false;
          this.messageDialogService.open('Quote Save Error!', error.error.Message);
        });
    }
  }
}
