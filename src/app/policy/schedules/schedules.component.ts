import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { AdditionalNamedInsureds } from '../policy';
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
  additionalNamedInsuredsSequence!: number;
  aniSub!: Subscription;
  notification: any;
  
  @ViewChild(AdditionalNamedInsuredsGroupComponent) aniComp!: AdditionalNamedInsuredsGroupComponent;
  @ViewChild(EndorsementLocationGroupComponent2) locationComp!: EndorsementLocationGroupComponent2;


  constructor(private route: ActivatedRoute, private userAuth: UserAuth,  private policyService: PolicyService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }
  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
    this.aniGroups = data['aniData'].additionalNamedInsureds;
    //This flattens the sequence number over all the coverages data and gets the highest value. This value will be used for adding any new coverage.
    this.additionalNamedInsuredsSequence = this.getNextAniSequence(this.aniGroups);
    this.saveAdditionalNamedInsureds = this.saveAdditionalNamedInsureds;

  });
  }

  getNextAniSequence(allGroups: AdditionalNamedInsureds[]) {
    return allGroups.map(group => group.intSequenceNo).reduce(
        (a,b) => Math.max(a,b),0) + 1;}
  
  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild(AdditionalNamedInsuredsGroupComponent) groupComp!: AdditionalNamedInsuredsGroupComponent;


  isValid(): boolean {
    return this.locationComp.isValid() ;
    // return this.groupComp.aniForm.status == 'VALID' &&  this.locationComp.isValid();
  }

  isDirty(): boolean {
    return this.locationComp.isDirty();
    // return (this.groupComp.aniForm.dirty ?? false)  || this.locationComp.isDirty();
  }

  save(): void {
    //this.locationComp.save();
  }

  onIncrement(newSeq : number) {
    this.additionalNamedInsuredsSequence = newSeq;
  }

  saveAdditionalNamedInsureds(): any {
    console.log(this.groupComp)
    console.log("aniData " + this.groupComp.aniComp.aniData)

    this.groupComp.aniData.forEach((ani)=>{
      this.aniSub = this.policyService.updateAdditionalNamedInsureds(ani).subscribe(() => {
        console.log(ani)
      });
  });

    if (this.groupComp.newAni != null) {
      console.log(this.groupComp)
    this.aniSub = this.policyService.addAdditionalNamedInsureds(this.groupComp.newAni).subscribe(() => {
        //this.notification.show('ANI successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
    });
    }
    if (this.groupComp.copyAni != null) {
      console.log(this.groupComp)
    this.aniSub = this.policyService.addAdditionalNamedInsureds(this.groupComp.copyAni).subscribe(() => {
        //this.notification.show('ANI successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
    });
    }
    if (this.groupComp.deletedAni != null) {
      console.log(this.groupComp)
    this.aniSub = this.policyService.deleteAdditionalNamedInsureds(this.groupComp.deletedAni.intPolicyId, this.groupComp.deletedAni.srtEndorsementNo, this.groupComp.deletedAni.intSequenceNo).subscribe(() => {
        //this.notification.show('ANI successfully deleted.', { classname: 'bg-success text-light', delay: 5000 });
    });
    }
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

}
