import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { ComponentBase } from './component-base';

@Component({
  template: ''
})
export abstract class SharedComponentBase extends ComponentBase implements OnDestroy {
  submissionAuthSub: Subscription;
  policyAuthSub: Subscription;
  private _canEditSubmission = false;
  private _canEditPolicy = false;
  private _type!: SharedComponentType;

  @Input() set type(value: SharedComponentType) {
    this._type = value;
    this.handleSecurity(this._type);
  }
  get type(): SharedComponentType {
    return this._type;
  }

  constructor(private userAuth: UserAuth) {
    super();
    this.submissionAuthSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => {
        this._canEditSubmission = canEditSubmission;
        this.handleSecurity(this.type);
      }
    );
    this.policyAuthSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => {
        this._canEditPolicy = canEditPolicy;
        this.handleSecurity(this.type);
      }
    );
  }

  ngOnDestroy() {
    this.submissionAuthSub.unsubscribe();
    this.policyAuthSub.unsubscribe();
  }
  handleSecurity(type: SharedComponentType) {
    if (type === SharedComponentType.Policy) {
      this.canEdit = this._canEditPolicy;
    }
    if (type === SharedComponentType.Quote) {
      this.canEdit = this._canEditSubmission;
    }
  }
}
