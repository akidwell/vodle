import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { EndorsementLocation } from 'src/app/policy/policy';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { NgForm } from '@angular/forms';
import { AddressLookupService } from 'src/app/policy/address-lookup/address-lookup.service';
import { PolicyService } from 'src/app/policy/policy.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdatePolicyChild } from 'src/app/policy/services/update-child.service';
import { EndorsementStatusService } from 'src/app/policy/services/endorsement-status.service';

@Component({
  selector: 'rsps-endorsement-location',
  templateUrl: './endorsement-location.component.html',
  styleUrls: ['./endorsement-location.component.css']
})
export class EndorsementLocationComponent implements OnInit {
  canEditPolicy: boolean = false;
  authSub: Subscription;
  collapsed: boolean = true;
  firstExpand: boolean = true;
  faArrowUp = faAngleUp;
  isLoadingAddress: boolean = false;
  states$: Observable<Code[]> | undefined;
  counties: string[] = [];
  addressSub!: Subscription;
  isDirty: boolean = false;
  dirtySub!: Subscription | undefined;
  deleteSub!: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  anchorId!: string;
  saveSub!: Subscription;
  collapsePanelSubscription!: Subscription;
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;

  @Input() location!: EndorsementLocation;
  @Input() index!: number;
  @ViewChild(NgForm, { static: false }) locationForm!: NgForm;
  @Output() copyExistingLocation: EventEmitter<EndorsementLocation> = new EventEmitter();
  @Output() deleteThisLocation: EventEmitter<EndorsementLocation> = new EventEmitter();
  @ViewChild('modalConfirmation') modalConfirmation: any;

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private addressLookupService: AddressLookupService, private policyService: PolicyService, private modalService: NgbModal, private updatePolicyChild: UpdatePolicyChild, private endorsementStatusService: EndorsementStatusService) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.anchorId = 'focusHere' + this.location.sequence;
    if (this.location.isNew) {
      this.collapseExpand(false);
      this.focus();
    }
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;  
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
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

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
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

  copyLocation(): void {
     this.copyExistingLocation.emit(this.location);
  }

  openDeleteConfirmation() {
    this.modalService.open(this.modalConfirmation, { backdrop: 'static', centered: true }).result.then((result) => {
      if (result == 'Yes') {
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
    })
  }

  collapseExpand(event: boolean) {
    if (this.firstExpand) {
      this.states$ = this.dropdowns.getStates();
      this.firstExpand = false;
    }
    this.collapsed = event;
  }

  focus(): void {
    this.collapsed = false;
    setTimeout(() => {
      document.getElementById(this.anchorId)!.scrollIntoView();
    }, 250);
  }
}
