import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { ComponentBase } from './component-base';

@Component({
  template: ''
})
export abstract class DepartmentComponentBase extends ComponentBase implements OnDestroy {
  authSub: Subscription;

  private _type!: SharedComponentType;

  constructor(private userAuth: UserAuth) {
    super();
    this.authSub = this.userAuth.canEditQuote$.subscribe(
      (canEditQuote: boolean) => {
        this.canEdit = canEditQuote;
      }
    );
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }
}
