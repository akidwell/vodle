import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { AdditionalNamedInsured, coverageANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { SharedAdditionalNamedInsuredsGroupComponent } from 'src/app/shared/components/additional-named-insured/additional-named-insureds-group/additional-named-insureds-group.component';
import { EndorsementLocation } from '../../models/policy';
import { PolicySave } from '../../models/policy-save';
import { PolicyService } from '../../services/policy/policy.service';
import { UpdatePolicyChild } from '../../services/update-child/update-child.service';
import { EndorsementLocationGroupComponent } from '../schedules-endorsement-location-group/endorsement-location-group.component';
import { UnderlyingCoveragesComponent } from '../schedules-underlying-coverages/underlying-coverages.component';

@Component({
  selector: 'rsps-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit, PolicySave {
  aniGroups!: AdditionalNamedInsured[];
  // formStatus: any;
  authSub: Subscription;
  canEditPolicy = false;
  invalidMessage = '';
  showInvalid = false;
  // aniData!: AdditionalNamedInsureds[];
  aniSub!: Subscription;
  // notification: any;
  locationData: EndorsementLocation[] = [];
  newInsuredANI!: coverageANI;

  @ViewChild(EndorsementLocationGroupComponent) locationComp!: EndorsementLocationGroupComponent;
  @Output() status: EventEmitter<any> = new EventEmitter();
  // @ViewChild(AdditionalNamedInsuredsGroupComponent) aniGroupComp!: AdditionalNamedInsuredsGroupComponent;
  @ViewChild(SharedAdditionalNamedInsuredsGroupComponent) aniGroupComp!: SharedAdditionalNamedInsuredsGroupComponent;
  @ViewChild(UnderlyingCoveragesComponent) underlyingCoveragesComp!: UnderlyingCoveragesComponent;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private updatePolicyChild: UpdatePolicyChild, private policyService: PolicyService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }
  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.aniGroups = data['aniData'].additionalNamedInsureds;
      this.locationData = data['endorsementLocationData'].endorsementLocation;
      // const policy = data['policyInfoData'].policyInfo;
      const endorsement = data['endorsementData'].endorsement;
      this.newInsuredANI = new coverageANI(this.policyService);
      this.newInsuredANI.policyId = endorsement.policyId;
      this.newInsuredANI.endorsementNo = endorsement.endorsementNumber;
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
      for (const child of this.locationComp.components) {
        for (const name in child.locationForm.controls) {
          if (child.locationForm.controls[name].invalid) {
            invalid.push(name + ' - Location: #' + child.location.sequence.toString());
          }
        }
      }
    }

    if (!this.aniGroupComp.isValid()) {
      invalid = invalid.concat(this.aniGroupComp.invalidList);
    }
    this.invalidMessage = '';
    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (const error of invalid) {
        this.invalidMessage += '<br><li>' + error;
      }
    }

    if (this.showInvalid) {
      this.invalidMessage = 'Following fields are invalid' + this.invalidMessage;
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
