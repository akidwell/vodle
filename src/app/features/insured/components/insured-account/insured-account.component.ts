import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, tap } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { InsuredClass } from '../../classes/insured-class';
import { InsuredAccountAddressComponent } from '../insured-account-address/insured-account-address.component';
import { InsuredAccountCenterComponent } from '../insured-account-center/insured-account-center.component';
import { InsuredAccountRightComponent } from '../insured-account-right/insured-account-right.component';

@Component({
  selector: 'rsps-insured-account',
  templateUrl: './insured-account.component.html',
  styleUrls: ['./insured-account.component.css']
})
export class InsuredAccountComponent implements OnInit {
  canEditInsured = false;
  authSub: Subscription;
  accountCollapsed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  sicCodes$: Observable<Code[]> | undefined;
  naicsCodes$: Observable<Code[]> | undefined;
  loadingSic = true;
  loadingNaics = true;

  @Input() public insured!: InsuredClass;
  @ViewChild(InsuredAccountAddressComponent) addressComp: InsuredAccountAddressComponent | undefined;
  @ViewChild(InsuredAccountCenterComponent) centerComp: InsuredAccountCenterComponent | undefined;
  @ViewChild(InsuredAccountRightComponent) rightComp: InsuredAccountRightComponent | undefined;

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
  }

  ngOnInit(): void {
    this.sicCodes$ = this.dropdowns.getSicCodes()
      .pipe(tap(() => this.loadingSic = false));

    if (this.insured.sicCode != null) {
      this.naicsCodes$ = this.dropdowns.getNaicsCodes(this.insured.sicCode)
        .pipe(tap(() => this.loadingNaics = false));
    }
    else {
      this.loadingNaics = false;
    }
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }

  changeSicCode() {
    if (this.insured.sicCode != null) {
      this.loadingNaics = true;
      this.insured.naicsCode = null;
      this.naicsCodes$ = this.dropdowns.getNaicsCodes(this.insured.sicCode)
        .pipe(tap(() => this.loadingNaics = false));
    }
    else {
      this.naicsCodes$ = new Observable<Code[]>();
    }
  }
}
