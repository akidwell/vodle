import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { EndorsementLocation } from 'src/app/policy/policy';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { NgForm } from '@angular/forms';
import { AddressLookupService } from 'src/app/policy/address-lookup/address-lookup.service';
import { PolicyService } from 'src/app/policy/policy.service';

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
  anchorId!: string;

  @Input() location!: EndorsementLocation;
  @Input() index!: number;
  @ViewChild(NgForm, { static: false }) locationForm!: NgForm;
  @Output() copyExistingLocation: EventEmitter<EndorsementLocation> = new EventEmitter();
  @Output() deleteThisLocation: EventEmitter<EndorsementLocation> = new EventEmitter();

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private addressLookupService: AddressLookupService, private policyService: PolicyService) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.anchorId = 'focusHere' + this.location.sequence;
    if (this.location.isNew) {
      this.collapsed = false;
      this.focus();
    }
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.dirtySub?.unsubscribe();
    this.addressSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dirtySub = this.locationForm.statusChanges?.subscribe(() => {
      this.isDirty = this.locationForm.dirty ?? false;
    });
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
