import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { Insured } from '../../models/insured';

@Component({
  selector: 'rsps-insured-account',
  templateUrl: './insured-account.component.html',
  styleUrls: ['./insured-account.component.css']
})
export class InsuredAccountComponent implements OnInit {
  canEditInsured: boolean = false;
  authSub: Subscription;
  accountCollapsed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  states$: Observable<Code[]> | undefined;
  countries$: Observable<Code[]> | undefined;
  entityType$: Observable<Code[]> | undefined;
  sicCodes$: Observable<Code[]> | undefined;
  naicsCodes$: Observable<Code[]> | undefined;

  @Input() public insured!: Insured;
  @ViewChild(NgForm, { static: false }) accountInfoForm!: NgForm;

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService) { 
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
  }

  ngOnInit(): void {
    this.states$ = this.dropdowns.getStates();
    this.countries$ = this.dropdowns.getCountries();
    this.entityType$ = this.dropdowns.getEntityType();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  verify() {

  }
}
