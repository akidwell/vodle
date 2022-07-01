import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map, Observable, Subscription, tap } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { newAddressVerificationReques } from '../../models/address-verification-request';
import { AddressVerificationService } from '../../services/address-verification/address-verification.service';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { AddressLookupService } from 'src/app/core/services/address-lookup/address-lookup.service';
import { InsuredClass } from '../../classes/insured-class';
import { State } from 'src/app/core/models/state';

@Component({
  selector: 'rsps-insured-account-address',
  templateUrl: './insured-account-address.component.html',
  styleUrls: ['./insured-account-address.component.css'],
})
export class InsuredAccountAddressComponent implements OnInit {
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  cityUpdated = '';
  stateUpdated = '';
  zipUpdated = '';
  countyUpdated = '';
  countryUpdated = '';
  addressErrorMessage = '';
  canEditInsured = false;
  authSub: Subscription;
  addressSub!: Subscription;
  // stateLookup: State[] = [];
  states$: Observable<State[]> | undefined;
  countries$: Observable<Code[]> | undefined;

  @Input() public insured!: InsuredClass;
  @ViewChild(NgForm, { static: false }) addressPanel!: NgForm;

  constructor(
    private userAuth: UserAuth,
    private dropdowns: DropDownsService,
    private addressVerificationService: AddressVerificationService,
    private messageDialogService: MessageDialogService,
    private addressLookupService: AddressLookupService
  ) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => (this.canEditInsured = canEditInsured)
    );
  }

  ngOnInit(): void {
    this.states$ = this.dropdowns.getStates(this.insured.country);
    this.countries$ = this.dropdowns.getCountries();
  }

  changeState(state: State) {
    if (this.insured.country != state.countryCode) {
      console.log('repop: ' + state.code);
      this.insured.country = state.countryCode;
      this.populateStates(state.code);
    }
    else {
      this.insured.country = state.countryCode;
    }
  }

  changeCountry() {
    this.populateStates(this.insured.state, true);
  }

  populateStates(state: string | null, reset = false) {
    this.states$ = this.dropdowns.getStates(this.insured.country).pipe(
      tap((c) => {
        const map = c.filter((c) => c.code == state);
        if (map.length == 0 && reset) {
          console.log('reset');
          setTimeout(() => this.insured.state = null);
        }
      })
    );
  }

  verify() {
    this.insured.isVerifying = true;
    const address = newAddressVerificationReques(this.insured);
    this.addressVerificationService.getAddressVerification(address).subscribe({
      next: (result) => {
        this.addressErrorMessage = result.message;
        if (this.insured.city != (result.city ?? '')) {
          this.insured.city = result.city;
          this.cityUpdated = 'updated';
        } else {
          this.cityUpdated = '';
        }
        if (this.insured.country != result.country) {
          this.insured.country = result.country;
          this.countryUpdated = 'updated';
        } else {
          this.countryUpdated = '';
        }
        if (this.insured.state != (result.state ?? '')) {
          this.insured.state = result.state;
          this.stateUpdated = 'updated';
        } else {
          this.stateUpdated = '';
        }
        if (this.insured.zip != (result.zip ?? '')) {
          this.insured.zip = result.zip;
          this.zipUpdated = 'updated';
        } else {
          this.zipUpdated = '';
        }
        if (this.insured.county != (result.county ?? '')) {
          this.insured.county = result.county;
          this.countyUpdated = 'updated';
        } else {
          this.countyUpdated = '';
        }
        this.insured.addressVerifiedDate = result.verifyDate;
        this.insured.isVerifying = false;
      },
      error: (error) => {
        this.insured.isVerifying = false;
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open('Error', errorMessage);
      },
    });
  }

  addressOverride() {
    this.addressErrorMessage = '';
  }

  public get showVerifiedStatus(): boolean {
    return (
      !this.insured.isVerifying &&
      this.insured.addressVerifiedDate !== null &&
      !this.insured.isAddressOverride
    );
  }

  public get showUnverifiedStatus(): boolean {
    return (
      !this.insured.isVerifying &&
      this.insured.addressVerifiedDate == null &&
      !this.insured.isAddressOverride
    );
  }
  public get showErrorMessages(): boolean {
    return this.showUnverifiedStatus && (this.addressErrorMessage?.length ?? 0) == 0;
  }

  changeZip(): void {
    console.log('pre change zip: ' + this.addressPanel.controls['zip'].valid);
    if (this.addressPanel.controls['zip'].valid) {
      console.log('change zip');
      this.insured.isZipLookup = true;
      this.addressSub = this.addressLookupService.getAddress(this.insured.zip).subscribe({
        next: (address) => {
          if (address != null) {
            if (address.city != null) {
              this.insured.city = address?.city;
            }
            if (address.country != null) {
              this.insured.country = address.country;
              this.populateStates(address.state);
            }
            if (address.state != null) {
              this.insured.state = address.state;
            }
            if (address.county[0] != null) {
              this.insured.county = address.county[0];
            }
          }
          this.insured.isZipLookup = false;
        },
        error: (error) => {
          this.insured.isZipLookup = false;
          const errorMessage = error.error?.Message ?? error.message;
          this.messageDialogService.open('Error', errorMessage);
        },
      });
    }
  }
}
