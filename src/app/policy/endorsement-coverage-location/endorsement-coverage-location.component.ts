import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { EndorsementCoverageLocation } from '../coverages/coverages';
import { PolicyService } from '../policy.service';

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
  states$: Observable<Code[]> | undefined;
  showLocationId: boolean = false;
  locationSub!: Subscription;
  isDirty: boolean = false;
  dirtySub!: Subscription | undefined;
  @ViewChild(NgForm, { static: false }) locationForm!: NgForm;

  constructor(private modalService: NgbModal, private dropdowns: DropDownsService, private userAuth: UserAuth, private policyService: PolicyService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.states$ = this.dropdowns.getStates();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.locationSub?.unsubscribe();
    this.dirtySub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dirtySub = this.locationForm.statusChanges?.subscribe(() => {
      this.isDirty = this.locationForm.dirty ?? false;
      console.log("Is form dirty yet: " + this.locationForm?.dirty);
    });
  }

  @ViewChild('modal') private modalContent!: TemplateRef<EndorsementCoverageLocationComponent>
  private modalRef!: NgbModalRef

  open(locationInfo: EndorsementCoverageLocation): Promise<boolean> {  
    return new Promise<boolean>(resolve => {
      this.locationForm.form.markAsPristine();
      this.originallocation = Object.assign({}, locationInfo);
      this.location = locationInfo;
      this.showLocationId = (this.location.locationId ?? 0) > 0;
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' })
      this.modalRef.result.then(resolve, resolve)
    })
  }

  async save(): Promise<void> {
    this.locationSub = this.policyService.addEndorsementCoverageLocation(this.location).subscribe(result => this.location.locationId = result);
    this.modalRef.close(true);
  }

  async cancel(): Promise<void> {
    // Rollback changes if editing existing location
    if (this.location.locationId > 0) {
      // this.location = this.copylocation;
      // this.location = Object.assign({}, this.copylocation);
      this.location.street = this.originallocation.street;
      this.location.street2 = this.originallocation.street2;
      this.location.city = this.originallocation.city;
      this.location.zip = this.originallocation.zip;
      this.location.state = this.originallocation.state;
      this.location.county = this.originallocation.county;
    }
    this.modalRef.close(false);
  }

}
