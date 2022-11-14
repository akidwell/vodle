import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { ComponentBase } from './component-base';

@Component({
  template: ''
})
export abstract class SharedComponentBase extends ComponentBase implements OnDestroy {
  quoteAuthSub: Subscription;
  policyAuthSub: Subscription;
  private _canEditQuote = false;
  private _canEditPolicy = false;
  private _type!: SharedComponentType;

  @Input() set type(value: SharedComponentType) {
    this._type = value;
    this.handleSecurity(this._type);
  }
  get type(): SharedComponentType {
    return this._type;
  }

  get userName(): string {
    return this.userAuth.userName;
  }

  constructor(private userAuth: UserAuth) {
    super();
    this.quoteAuthSub = this.userAuth.canEditQuote$.subscribe(
      (canEditQuote: boolean) => {
        this._canEditQuote = canEditQuote;
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
    this.quoteAuthSub?.unsubscribe();
    this.policyAuthSub?.unsubscribe();
  }
  handleSecurity(type: SharedComponentType) {
    if (type === SharedComponentType.Policy) {
      this.canEdit = this._canEditPolicy;
    }
    if (type === SharedComponentType.Quote) {
      this.canEdit = this._canEditQuote;
    }
  }
}
