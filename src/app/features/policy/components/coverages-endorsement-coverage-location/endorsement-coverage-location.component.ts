import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { AddressLookupService } from '../../../../core/services/address-lookup/address-lookup.service';
import { EndorsementCoverage, EndorsementCoverageLocation, EndorsementCoveragesGroup } from '../coverages-base/coverages';
import { EndorsementCoverageLocationGroupComponent } from '../coverages-endorsement-coverage-location-group/endorsement-coverage-location-group.component';
import { PolicyService } from '../../services/policy/policy.service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { State } from 'src/app/core/models/state';
import { ZipCodeCountry } from 'src/app/core/utils/zip-code-country';

@Component({
  selector: 'rsps-endorsement-coverage-location',
  templateUrl: './endorsement-coverage-location.component.html',
  styleUrls: ['./endorsement-coverage-location.component.css']
})
export class EndorsementCoverageLocationComponent implements OnInit {
  location!: EndorsementCoverageLocation;
  originallocation!: EndorsementCoverageLocation;
  isReadOnly = false;
  authSub: Subscription;
  canEditPolicy = false;
  canDeleteLocation = false;
  states$: Observable<State[]> | undefined;
  showLocationId = false;
  locationSub!: Subscription;
  isDirty = false;
  dirtySub!: Subscription | undefined;
  addressSub!: Subscription;
  isLoadingAddress = false;
  counties: string[] = [];
  coverage!: EndorsementCoveragesGroup;
  parent!: EndorsementCoverageLocationGroupComponent;
  canEditEndorsement = false;
  statusSub!: Subscription;
  confirmation = '';

  @ViewChild(NgForm, { static: false }) locationForm!: NgForm;
  @ViewChild('modal') private modalContent!: TemplateRef<EndorsementCoverageLocationComponent>;
  private modalRef!: NgbModalRef;

  constructor(private modalService: NgbModal, private dropdowns: DropDownsService, private userAuth: UserAuth, private policyService: PolicyService, private addressLookupService: AddressLookupService, private endorsementStatusService: EndorsementStatusService, private confirmationDialogService: ConfirmationDialogService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.states$ = this.dropdowns.getStates(null);
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.locationSub?.unsubscribe();
    this.dirtySub?.unsubscribe();
    this.addressSub?.unsubscribe();
    this.statusSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dirtySub = this.locationForm.statusChanges?.subscribe(() => {
      this.isDirty = this.locationForm.dirty ?? false;
    });
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy;
  }

  open(locationInfo: EndorsementCoveragesGroup, parent: EndorsementCoverageLocationGroupComponent): Promise<LocationResult> {
    return new Promise<LocationResult>(resolve => {
      this.isLoadingAddress = false;
      this.coverage = locationInfo;
      this.parent = parent;
      this.locationForm.form.markAsPristine();
      this.originallocation = Object.assign({}, locationInfo.location);
      this.location = locationInfo.location;
      this.showLocationId = (this.location.locationId ?? 0) > 0;
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' });
      this.modalRef.result.then(resolve, resolve);
      this.canDeleteLocation = true;
      for (const x of locationInfo.coverages) {
        if (x.action != 'A') {
          this.canDeleteLocation = false;
          break;
        }
      }
    });
  }

  new(locationInfo: EndorsementCoverageLocation): Promise<LocationResult> {
    return new Promise<LocationResult>(resolve => {
      this.locationForm.form.markAsPristine();
      this.location = locationInfo;
      this.location.isNew = true;
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' });
      this.modalRef.result.then(resolve, resolve);
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

  // Only show error if valid zip
  get isZipCodeFormatValid(): boolean {
    const country = this.dropdowns.getCountryByState(this.location.state);
    return !this.locationForm.controls['zipCode']?.valid || this.location.state == null|| this.isLoadingAddress || (this.locationForm.controls['zipCode']?.valid && ZipCodeCountry(this.location.zip) == country);
  }

  async save(): Promise<void> {
    if (this.location.isNew) {
      this.locationSub = this.policyService.addEndorsementCoverageLocation(this.location)
        .subscribe(result => {
          this.location.locationId = result;
          this.location.isNew = false;
          this.modalRef.close(LocationResult.new);
        });
    }
    else {
      this.locationSub = this.policyService.updateEndorsementCoverageLocation(this.location)
        .subscribe(() => {
          this.modalRef.close(LocationResult.update);
        });
    }
  }

  async cancel(): Promise<void> {
    // Rollback changes if editing existing location
    if (this.location.locationId > 0) {
      this.location.street = this.originallocation.street;
      this.location.street2 = this.originallocation.street2;
      this.location.city = this.originallocation.city;
      this.location.zip = this.originallocation.zip;
      this.location.state = this.originallocation.state;
      this.location.county = this.originallocation.county;
      this.location.countryCode = this.originallocation.countryCode;
    }
    this.modalRef.close(LocationResult.cancel);
  }

  @Output() deleteThisCoverage: EventEmitter<EndorsementCoverage> = new EventEmitter();

  async delete(): Promise<void> {
    if (this.parent.components != null) {
      for (let i = this.parent.components.length - 1; i >= 0; i--) {
        await this.parent.components[i].deleteCoverage();
      }
    }
    this.locationSub = this.policyService.deleteEndorsementCoverageLocation(this.location)
      .subscribe(result => {
        if (result) {
          this.modalRef.close(LocationResult.delete);
        }
        else {
          window.alert('Could not delete location!');
        }
      });
  }

  openDeleteConfirmation() {
    this.confirmation = 'overlay';
    this.confirmationDialogService.open('Delete Location Confirmation','Are you sure you want to delete this location and all coverages?').then((result: boolean) => {
      this.confirmation = '';
      if (result) {
        this.delete();
      }
    });
  }
}

export enum LocationResult {
  new,
  update,
  cancel,
  delete,
}
