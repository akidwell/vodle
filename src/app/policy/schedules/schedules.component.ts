import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { AdditionalNamedInsureds, EndorsementLocation } from '../policy';
import { PolicySave } from '../policy-save';
import { PolicyService } from '../policy.service';
import { UpdatePolicyChild } from '../services/update-child.service';
import { AdditionalNamedInsuredsGroupComponent } from './additional-named-insureds-group/additional-named-insureds-group.component';
import { EndorsementLocationGroupComponent } from './endorsement-location-group/endorsement-location-group.component';
import { UnderlyingCoveragesComponent } from './underlying-coverages/underlying-coverages.component';

@Component({
  selector: 'rsps-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit, PolicySave {
  aniGroups!: AdditionalNamedInsureds[];
  formStatus: any;
  authSub: Subscription;
  canEditPolicy: boolean = false;
  invalidMessage: string = "";
  showInvalid: boolean = false;
  aniData!: AdditionalNamedInsureds[];
  aniSub!: Subscription;
  notification: any;
  locationData: EndorsementLocation[] = [];

  @ViewChild(EndorsementLocationGroupComponent) locationComp!: EndorsementLocationGroupComponent;
  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild(AdditionalNamedInsuredsGroupComponent) aniGroupComp!: AdditionalNamedInsuredsGroupComponent;
  @ViewChild(UnderlyingCoveragesComponent) underlyingCoveragesComp!: UnderlyingCoveragesComponent;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth,  private updatePolicyChild: UpdatePolicyChild) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }
  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.aniGroups = data['aniData'].additionalNamedInsureds;
      this.locationData = data['endorsementLocationData'].endorsementLocation;
    });
  }


  isValid(): boolean {
    return !this.canEditPolicy || (this.locationComp.isValid() && this.aniGroupComp.isValid() && this.underlyingCoveragesComp.isValid());
  }

  isDirty(): boolean {
    return this.canEditPolicy && (this.locationComp.isDirty() || this.aniGroupComp.isDirty() || this.underlyingCoveragesComp.isDirty());
  }

  save(): void {
    this.locationComp.save();
    this.aniGroupComp.saveAdditionalNamedInsureds();
    this.underlyingCoveragesComp.save();
  }

  showInvalidControls(): void {
    let invalid = [];

    // Loop through each child component to see it any of them have invalid controls
    if (this.locationComp.components != null) {
      for (let child of this.locationComp.components) {
        for (let name in child.locationForm.controls) {
          if (child.locationForm.controls[name].invalid) {
            invalid.push(name + " - Location: #" + child.location.sequence.toString());
          }
        }
      }
    }

    if (this.aniGroupComp.components != null) {
      for (let child of this.aniGroupComp.components) {
        for (let name in child.aniForm.controls) {
          if (child.aniForm.controls[name].invalid) {
            invalid.push(name + " - Additional Named Insured: #" + child.aniData.sequenceNo.toString());
          }
        }
      }
    }

    this.invalidMessage = "";
    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (let error of invalid) {
        this.invalidMessage += "<br><li>" + error;
      }
    }

    if (this.showInvalid) {
      this.invalidMessage = "Following fields are invalid" + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

  collapseAllLocations(): void {
    this.updatePolicyChild.collapseEndorsementLocations();
  }

}
