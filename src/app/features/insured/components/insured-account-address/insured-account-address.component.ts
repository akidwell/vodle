import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { newAddressVerificationReques } from '../../models/address-verification-request';
import { Insured } from '../../models/insured';
import { AddressVerificationService } from '../../services/address-verification/address-verification.service';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { AddressLookupService } from 'src/app/core/services/address-lookup/address-lookup.service';

@Component({
  selector: 'rsps-insured-account-address',
  templateUrl: './insured-account-address.component.html',
  styleUrls: ['./insured-account-address.component.css']
})
export class InsuredAccountAddressComponent implements OnInit {
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  cityUpdated = '';
  stateUpdated = '';
  zipUpdated = '';
  countyUpdated = '';
  countryUpdated = '';
  isVerifying = false;
  zipLookup = false;
  addressErrorMessage = '';
  canEditInsured = false;
  authSub: Subscription;
  addressSub!: Subscription;
  states$: Observable<Code[]> | undefined;
  countries$: Observable<Code[]> | undefined;

  @Input() public insured!: Insured;
  @ViewChild(NgForm, { static: false }) addressPanel!: NgForm;

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private addressVerificationService: AddressVerificationService, private messageDialogService: MessageDialogService, private addressLookupService: AddressLookupService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
  }

  ngOnInit(): void {
    this.states$ = this.dropdowns.getStates();
    this.countries$ = this.dropdowns.getCountries();
  }

  verify() {
    this.isVerifying = true;
    const address = newAddressVerificationReques(this.insured);
    this.addressVerificationService.getAddressVerification(address).subscribe({
      next: result => {
        this.addressErrorMessage = result.message;
        if (this.insured.city != (result.city ?? '')) {
          this.insured.city = result.city;
          this.cityUpdated = 'updated';
        }
        else {
          this.cityUpdated = '';
        }
        if (this.insured.state != (result.state ?? '')) {
          this.insured.state = result.state;
          this.stateUpdated = 'updated';
        }
        else {
          this.stateUpdated = '';
        }
        if (this.insured.zip != (result.zip ?? '')) {
          this.insured.zip = result.zip;
          this.zipUpdated = 'updated';
        }
        else {
          this.zipUpdated = '';
        }
        if (this.insured.county != (result.county ?? '')) {
          this.insured.county = result.county;
          this.countyUpdated = 'updated';
        }
        else {
          this.countyUpdated = '';
        }
        if (this.insured.country != result.country) {
          this.insured.country = result.country;
          this.countryUpdated = 'updated';
        }
        else {
          this.countryUpdated = '';
        }
        this.insured.addressVerifiedDate = result.verifyDate;
        this.isVerifying = false;
        this.addressPanel.form.markAsDirty();
      },
      error: (error) => {
        this.isVerifying = false;
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open('Error', errorMessage);
      }
    });
  }

  addressOverride() {
    this.insured.addressVerifiedDate = null;
    this.addressErrorMessage = '';
  }

  public get showVerifiedStatus(): boolean {
    return !this.isVerifying && this.insured.addressVerifiedDate !== null && !this.insured.isAddressOverride;
  }

  public get showUnverifiedStatus(): boolean {
    return !this.isVerifying && this.insured.addressVerifiedDate == null && !this.insured.isAddressOverride;
  }
  public get showErrorMessages(): boolean {
    return this.showUnverifiedStatus && (this.addressErrorMessage?.length ?? 0) == 0;
  }

  public get canEditAddress(): boolean {
    return !this.zipLookup && !this.isVerifying && this.canEditInsured;
  }

  changeStreet1() {
    this.insured.addressVerifiedDate = null;
  }
  changeStreet2() {
    this.insured.addressVerifiedDate = null;
  }
  changeCity() {
    this.insured.addressVerifiedDate = null;
  }
  changeState() {
    this.insured.addressVerifiedDate = null;
  }
  changeCounty() {
    this.insured.addressVerifiedDate = null;
  }
  changeCountry() {
    this.insured.addressVerifiedDate = null;
  }

  changeZip(): void {
    this.insured.addressVerifiedDate = null;
    if (this.addressPanel.controls['zip'].valid) {
      this.zipLookup = true;
      this.addressSub = this.addressLookupService.getAddress(this.insured.zip).subscribe({
        next: address => {
          if (address != null) {
            if (address.city != null) {
              this.insured.city = address?.city;
            }
            if (address.state != null) {
              this.insured.state = address.state;
            }
            if (address.county[0] != null) {
              this.insured.county = address.county[0];
            }
            if (address.country != null) {
              this.insured.country = address.country;
            }
          }
          this.zipLookup = false;
        },
        error: (error) => {
          this.zipLookup = false;
          const errorMessage = error.error?.Message ?? error.message;
          this.messageDialogService.open('Error', errorMessage);
        }
      });
    }
  }

}
