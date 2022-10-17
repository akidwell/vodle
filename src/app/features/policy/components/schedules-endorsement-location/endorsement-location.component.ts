import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { EndorsementLocation } from 'src/app/features/policy/models/policy';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { NgForm } from '@angular/forms';
import { AddressLookupService } from 'src/app/core/services/address-lookup/address-lookup.service';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { UpdatePolicyChild } from '../../services/update-child/update-child.service';
import { State } from 'src/app/core/models/state';
import { ZipCodeCountry } from 'src/app/core/utils/zip-code-country';

@Component({
  selector: 'rsps-endorsement-location',
  templateUrl: './endorsement-location.component.html',
  styleUrls: ['./endorsement-location.component.css']
})
export class EndorsementLocationComponent implements OnInit {
  canEditPolicy = false;
  authSub: Subscription;
  collapsed = true;
  firstExpand = true;
  faArrowUp = faAngleUp;
  isLoadingAddress = false;
  states$: Observable<State[]> | undefined;
  counties: string[] = [];
  addressSub!: Subscription;
  isDirty = false;
  dirtySub!: Subscription | undefined;
  deleteSub!: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  anchorId!: string;
  saveSub!: Subscription;
  collapsePanelSubscription!: Subscription;
  statusSub!: Subscription;

  @Input() location!: EndorsementLocation;
  @Input() index!: number;
  @Input() canDrag = false;
  @ViewChild(NgForm, { static: false }) locationForm!: NgForm;
  @Output() copyExistingLocation: EventEmitter<EndorsementLocation> = new EventEmitter();
  @Output() deleteThisLocation: EventEmitter<EndorsementLocation> = new EventEmitter();

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private addressLookupService: AddressLookupService, private policyService: PolicyService, private confirmationDialogService: ConfirmationDialogService, private updatePolicyChild: UpdatePolicyChild) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => {
        this.canEditPolicy = canEditPolicy;
      }
    );
  }

  get addressReadOnly() {
    return (this.canEditPolicy && !this.canDrag) ? 'address' : 'address-drag';
  }

  ngOnInit(): void {
    this.anchorId = 'focusHere' + this.location.sequence;
    if (this.location.isNew) {
      this.collapseExpand(false);
      this.focus();
    }
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.dirtySub?.unsubscribe();
    this.addressSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.addSub?.unsubscribe();
    this.collapsePanelSubscription?.unsubscribe();
    this.statusSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dirtySub = this.locationForm.statusChanges?.subscribe(() => {
      this.isDirty = this.locationForm.dirty ?? false;
    });
    this.collapsePanelSubscription = this.updatePolicyChild.collapseEndorsementLocationsObservable$.subscribe(() => {
      this.collapseExpand(true);
    });
    setTimeout(() => {
      if (this.location.isNew) {
        this.locationForm.form.markAsDirty();
      }
    });
  }

  changeZipCode(): void {
    if (this.locationForm.controls['zipCode'].valid) {
      this.isLoadingAddress = true;
      this.location.city = '';
      this.location.state = '';
      this.location.county = '';
      this.location.countryCode = '';
      this.addressSub = this.addressLookupService.getAddress(this.location.zip).subscribe({
        next: address => {
          if (address != null) {
            this.location.city = address?.city;
            this.location.state = address?.state;
            this.location.county = address?.county[0];
            this.location.countryCode = address?.country;
            this.counties = [];
            for (const county of address.county) {
              this.counties = this.counties.concat(county);
            }
          }
          this.isLoadingAddress = false;
        }
      });
    }
  }

  changeState(state: State) {
    this.location.countryCode = state.countryCode;
  }

  copyLocation(): void {
    this.copyExistingLocation.emit(this.location);
  }

  openDeleteConfirmation() {
    this.confirmationDialogService.open('Delete Confirmation','Are you sure you want to delete this location?').then((result: boolean) => {
      if (result) {
        this.deleteLocation();
      }
    });
  }

  async deleteLocation() {
    if(this.location.isNew) {
      this.deleteThisLocation.emit(this.location);
    } else {
      this.deleteSub = this.policyService.deleteEndorsementLocation(this.location).subscribe(result => {
        this.deleteThisLocation.emit(this.location);
        return result;
      });
    }
  }

  isValid(): boolean {
    return this.locationForm.status == 'VALID' && this.isZipCodeValid();
  }

  isZipCodeValid() {
    if (this.locationForm.controls['zipCode'].valid) {
      return ZipCodeCountry(this.location.zip) == this.location.countryCode;
    }
    return true;
  }

  async save(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.location.isNew) {
        this.addSub = this.policyService.addEndorsementLocation(this.location).subscribe(result => {
          this.location.isNew = false;
          this.locationForm.form.markAsPristine();
          this.locationForm.form.markAsUntouched();
          resolve(result);
        });
      } else {
        this.updateSub = this.policyService.updateEndorsementLocation(this.location).subscribe(result => {
          this.locationForm.form.markAsPristine();
          this.locationForm.form.markAsUntouched();
          resolve(result);
        });
      }
    });
  }

  collapseExpand(event: boolean) {
    if (!this.canDrag) {
      if (this.firstExpand) {
        this.states$ = this.dropdowns.getStates();
        this.firstExpand = false;
      }
      this.collapsed = event;
    }
  }

  focus(): void {
    this.collapsed = false;
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView();
    }, 250);
  }
}
