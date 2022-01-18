import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { AddressLookupService } from '../../../address-lookup/address-lookup.service';
import { EndorsementCoverage, EndorsementCoverageLocation, EndorsementCoveragesGroup } from '../../coverages';
import { EndorsementCoverageLocationGroupComponent } from '../endorsement-coverage-location-group.component';
import { PolicyService } from '../../../policy.service';
import { EndorsementStatusService } from 'src/app/policy/services/endorsement-status.service';

@Component({
  selector: 'rsps-endorsement-coverage-location',
  templateUrl: './endorsement-coverage-location.component.html',
  styleUrls: ['./endorsement-coverage-location.component.css']
})
export class EndorsementCoverageLocationComponent implements OnInit {
  location!: EndorsementCoverageLocation;
  originallocation!: EndorsementCoverageLocation;
  isReadOnly: boolean = false;
  authSub: Subscription;
  canEditPolicy: boolean = false;
  canDeleteLocation: boolean = false;
  states$: Observable<Code[]> | undefined;
  showLocationId: boolean = false;
  locationSub!: Subscription;
  isDirty: boolean = false;
  dirtySub!: Subscription | undefined;
  addressSub!: Subscription;
  isLoadingAddress: boolean = false;
  counties: string[] = [];
  coverage!: EndorsementCoveragesGroup;
  parent!: EndorsementCoverageLocationGroupComponent;
  canEditEndorsement: boolean = false;
  statusSub!: Subscription;
  confirmation: string = "";

  @ViewChild(NgForm, { static: false }) locationForm!: NgForm;

  constructor(private modalService: NgbModal, private dropdowns: DropDownsService, private userAuth: UserAuth, private policyService: PolicyService, private addressLookupService: AddressLookupService, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.states$ = this.dropdowns.getStates();
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;  
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
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

  @ViewChild('modal') private modalContent!: TemplateRef<EndorsementCoverageLocationComponent>
  private modalRef!: NgbModalRef

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }
  
  open(locationInfo: EndorsementCoveragesGroup, parent: EndorsementCoverageLocationGroupComponent): Promise<LocationResult> {
    return new Promise<LocationResult>(resolve => {
      this.coverage = locationInfo;
      this.parent = parent;
      this.locationForm.form.markAsPristine();
      this.originallocation = Object.assign({}, locationInfo.location);
      this.location = locationInfo.location;
      this.showLocationId = (this.location.locationId ?? 0) > 0;
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' })
      this.modalRef.result.then(resolve, resolve)
      this.canDeleteLocation = true;
      for (let x of locationInfo.coverages) {
        if (x.action != "A") {
          this.canDeleteLocation = false;
          break;
        }
      }
    })
  }

  new(locationInfo: EndorsementCoverageLocation): Promise<LocationResult> {
    return new Promise<LocationResult>(resolve => {
      this.locationForm.form.markAsPristine();
      this.location = locationInfo;
      this.location.isNew = true;
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' })
      this.modalRef.result.then(resolve, resolve)
    })
  }

  changeZipCode(): void {
    if (this.locationForm.controls["zipCode"].valid) {
      this.isLoadingAddress = true;
      this.location.city = "";
      this.location.state = "";
      this.location.county = "";
      this.addressSub = this.addressLookupService.getAddress(this.location.zip).subscribe({
        next: address => {
          if (address != null) {
            this.location.city = address?.city;
            this.location.state = address?.state;
            this.location.county = address?.county[0];
            this.counties = [];
            for (let county of address.county) {
              this.counties = this.counties.concat(county);
            }
          }
          this.isLoadingAddress = false;
        }
      });
    }
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
          window.alert("Could not delete location!");
        }
      });
  }

  @ViewChild('modalConfirmation') modalConfirmation: any;

  openDeleteConfirmation() {
  
    this.confirmation = "overlay"
    this.modalService.open(this.modalConfirmation, { backdrop: 'static', centered: true }).result.then((result) => {
      this.confirmation = ""
      if (result == 'Yes') {
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
