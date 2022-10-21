import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { ComponentBase } from './component-base';

@Component({
  template: ''
})
export abstract class DepartmentComponentBase extends ComponentBase implements OnDestroy {
  submissionAuthSub: Subscription;

  private _type!: SharedComponentType;

  constructor(private userAuth: UserAuth) {
    super();
    this.submissionAuthSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => {
        this.canEdit = canEditSubmission;
      }
    );
  }

  ngOnDestroy() {
    this.submissionAuthSub?.unsubscribe();
  }
}
