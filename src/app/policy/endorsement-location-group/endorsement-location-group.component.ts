import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { EndorsementCoverageLocation, EndorsementCoveragesGroup } from '../coverages/coverages';
import { EndorsementCoverageLocationComponent } from '../endorsement-coverage-location/endorsement-coverage-location.component';

@Component({
  selector: 'rsps-endorsement-location-group',
  templateUrl: './endorsement-location-group.component.html',
  styleUrls: ['./endorsement-location-group.component.css']
})
export class EndorsementLocationGroupComponent implements OnInit {
  ecCollapsed = true;
  faPlus = faPlus;
  faMinus = faMinus;
  authSub: Subscription;
  canEditPolicy: boolean = false;
  @ViewChild(NgForm,  { static: false })endorsementCoveragesForm!: NgForm;
  formStatus!: string;
  coveragesSequence: number = 1;

  constructor(private userAuth: UserAuth) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
     (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
   );
 }

  ngOnInit(): void {

  }
  @Input()
  public endorsementCoveragesGroup!: EndorsementCoveragesGroup;
  @Output() status: EventEmitter<any> = new EventEmitter();


  @ViewChild('modal') private locationComponent: EndorsementCoverageLocationComponent   | undefined

  // Modal is used to show import errors
  async triggerModal() {
    const location: EndorsementCoverageLocation = { policyId: 1, taxCode: "test", street: "test", locationId: 1, street2: "test", city: "test", state: "OH", zip: "45202", county: "" };

    return await this.locationComponent?.open(location);
  }

}

