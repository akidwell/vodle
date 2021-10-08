import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { EndorsementCoverageLocation, EndorsementCoveragesGroup } from '../coverages/coverages';
import { EndorsementCoverageLocationComponent } from '../endorsement-coverage-location/endorsement-coverage-location.component';
import { EndorsementCoverageComponent } from '../endorsement-coverage/endorsement-coverage.component';

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
  formStatus!: string;
  coveragesSequence: number = 1;

  @Input()
  public endorsementCoveragesGroup!: EndorsementCoveragesGroup;
  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild('modal') private locationComponent!: EndorsementCoverageLocationComponent
  @ViewChild(NgForm, { static: false }) endorsementCoveragesForm!: NgForm;
  @ViewChildren(EndorsementCoverageComponent) components:QueryList<EndorsementCoverageComponent> | undefined;
  
  constructor(private userAuth: UserAuth) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void { }

  async openLocation(location: EndorsementCoverageLocation) {
    if (this.locationComponent != null) {
      return await this.locationComponent.open(location);
    }
    return false;
  }

  isValid(): boolean {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.endorsementCoveragesForm.status != 'VALID') {
          return false;
        }
      }
  }
    return true;
  }

  isDirty() {
    //return this.groupComp.endorsementCoveragesForm.dirty;
  }

}

