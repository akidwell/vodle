import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, tap } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { newAddressVerificationReques } from '../../models/address-verification-request';
import { Insured } from '../../models/insured';
import { AddressVerificationService } from '../../services/address-verification/address-verification.service';

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
  cityUpdated: string = "";
  stateUpdated: string = "";
  zipUpdated: string = "";
  countyUpdated: string = "";
  countryUpdated: string = "";
  loading: boolean = false;
  addressErrorMessage: string = "";
  loadingNaics: boolean = false;

  @Input() public insured!: Insured;
  @ViewChild(NgForm, { static: false }) accountInfoForm!: NgForm;

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private addressVerificationService: AddressVerificationService, private messageDialogService: MessageDialogService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
  }

  ngOnInit(): void {
    this.states$ = this.dropdowns.getStates();
    this.countries$ = this.dropdowns.getCountries();
    this.entityType$ = this.dropdowns.getEntityType();
    this.sicCodes$ = this.dropdowns.getSicCodes();
    if (this.insured.sicCode != null) {
      this.naicsCodes$ = this.dropdowns.getNaicsCodes(this.insured.sicCode)
        .pipe(tap(() => this.loadingNaics = false));
    }
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  verify() {
    this.loading = true;
    const address = newAddressVerificationReques(this.insured);
    this.addressVerificationService.getAddressVerification(address).subscribe({
      next: result => {
        this.addressErrorMessage = result.message;
        if (this.insured.city != (result.city ?? "")) {
          this.insured.city = result.city
          this.cityUpdated = "updated";
        }
        else {
          this.cityUpdated = "";
        }
        if (this.insured.state != (result.state ?? "")) {
          this.insured.state = result.state
          this.stateUpdated = "updated";
        }
        else {
          this.stateUpdated = "";
        }
        if (this.insured.zip != (result.zip ?? "")) {
          this.insured.zip = result.zip
          this.zipUpdated = "updated";
        }
        else {
          this.zipUpdated = "";
        }
        if (this.insured.county != (result.county ?? "")) {
          this.insured.county = result.county
          this.countyUpdated = "updated";
        }
        else {
          this.countyUpdated = "";
        }
        if (this.insured.country != result.country) {
          this.insured.country = result.country
          this.countryUpdated = "updated";
        }
        else {
          this.countryUpdated = "";
        }
        this.insured.addressVerifiedDate = result.verifyDate;
        this.loading = false;
        this.accountInfoForm.form.markAsDirty();
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open("Errpr", errorMessage);
      }
    });

  }

  addressOverride() {
    this.insured.addressVerifiedDate = null;
    this.addressErrorMessage = "";
  }

  public get isVerified(): boolean {
    return this.insured.addressVerifiedDate != null;
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
