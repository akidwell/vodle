import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { AdditionalNamedInsureds, EndorsementLocation } from '../policy';
import { PolicySave } from '../policy-save';
import { PolicyService } from '../policy.service';
import { AdditionalNamedInsuredsGroupComponent } from './additional-named-insureds-group/additional-named-insureds-group.component';
import { EndorsementLocationGroupComponent2 } from './endorsement-location-group/endorsement-location-group.component';

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
  
  @ViewChild(EndorsementLocationGroupComponent2) locationComp!: EndorsementLocationGroupComponent2;
  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild(AdditionalNamedInsuredsGroupComponent) aniGroupComp!: AdditionalNamedInsuredsGroupComponent;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth,  private policyService: PolicyService) {
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
    return this.locationComp.isValid() && this.aniGroupComp.isValid();
  }

  isDirty(): boolean {
    return this.locationComp.isDirty() || this.aniGroupComp.isDirty();
  }

  save(): void {
    this.locationComp.save();
    this.aniGroupComp.saveAdditionalNamedInsureds();
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
    console.log('collapse')
  }
  
  expandAllLocations(): void {
    console.log('expand')
  }

}
