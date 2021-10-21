import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { PolicyService } from '../policy.service';
import { EndorsementCoverageLocationComponent } from '../endorsement-coverage-location/endorsement-coverage-location.component';
import { EndorsementLocationGroupComponent } from '../endorsement-location-group/endorsement-location-group.component';
import { PolicyInformation } from '../policy';
import { PolicySave } from '../policy-save';
import { EndorsementCoverage, EndorsementCoverageLocation, EndorsementCoveragesGroup } from './coverages';
import { EndorsementHeaderComponent } from './endorsement-header/endorsement-header.component';
import { NotifyOnSave } from '../services/notify-on-save.service';

@Component({
  selector: 'rsps-coverages',
  templateUrl: './coverages.component.html',
  styleUrls: ['./coverages.component.css']
})
export class CoveragesComponent implements OnInit, PolicySave {
  endorsementCoveragesGroups!: EndorsementCoveragesGroup[];
  formStatus: any;
  authSub: Subscription;
  canEditPolicy: boolean = false;
  policyInfo!: PolicyInformation;
  invalidMessage: string = "";
  showInvalid: boolean = false;
  coveragesSequence!: number;
  coveragesSub!: Subscription;
  notification: any;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private policyService: PolicyService, private notifyOnSave: NotifyOnSave) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsementCoveragesGroups = data['endorsementCoveragesGroups'].endorsementCoveragesGroups;
      //This flattens the sequence number over all the coverages data and gets the highest value. This value will be used for adding any new coverage.
      this.coveragesSequence = this.getNextCoverageSequence(this.endorsementCoveragesGroups);
      this.saveEndorsementCoverages = this.saveEndorsementCoverages;
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
  }

  onIncrement(newSeq : number) {
    this.coveragesSequence = newSeq;
  }
  getNextCoverageSequence(allGroups: EndorsementCoveragesGroup[]) {
    return allGroups.map(group => group.coverages.map(coverage => coverage.sequence)).reduce(
      (locGroup, seq) => locGroup.concat(seq),[]).reduce(
        (a,b) => Math.max(a,b)) + 1;
  }
  getProgramId(firstGroup: EndorsementCoveragesGroup){
    return firstGroup.coverages[0].programId;
  }
  @Output() status: EventEmitter<any> = new EventEmitter();
  saveEndorsementCoverages(): any {
    console.log(this.endorsementCoveragesGroups)
    this.coveragesSub = this.policyService.updateEndorsementGroups(this.endorsementCoveragesGroups).subscribe(() => {
        this.notifyOnSave.notifyChild();
        this.notification.show('Coverages successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  @ViewChild(EndorsementHeaderComponent) headerComp!: EndorsementHeaderComponent;
  @ViewChild(EndorsementLocationGroupComponent) groupComp!: EndorsementLocationGroupComponent;
  @ViewChild('modal') private locationComponent: EndorsementCoverageLocationComponent | undefined

  async openLocation() {
    let result: boolean = false;

    if (this.locationComponent != null) {
      let location: EndorsementCoverageLocation = ({} as any) as EndorsementCoverageLocation;
      // get policyId from route
      let policyId: number = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
      location.policyId = policyId;

      result = await this.locationComponent.open(location);
      if (result) {
        let coverage: EndorsementCoverage = ({} as any) as EndorsementCoverage;
        let group: EndorsementCoveragesGroup = { coverages: [], location: location }
        coverage.programId = this.policyInfo.programId;
        coverage.coverageCode = this.policyInfo.quoteData.coverageCode;
        coverage.policySymbol = this.policyInfo.policySymbol;
        coverage.policyId = this.policyInfo.policyId;
        coverage.action = "A";
        group.coverages.push(coverage);
        this.endorsementCoveragesGroups.push(group);
      }
      return result;
    }
    return false;
  }

  isValid(): boolean {
    let total:number = 0;
    this.endorsementCoveragesGroups.forEach( group => { group.coverages.forEach(coverage => { total += coverage.premium })});

    return this.headerComp.endorsementHeaderForm.status == 'VALID' && this.groupComp.isValid() && this.headerComp.endorsement.premium == total;
  }

  isDirty(): boolean {
    return (this.headerComp.endorsementHeaderForm.dirty ?? false) || this.groupComp.isDirty();
  }

  save(): void {
    this.headerComp.save();
    //this.groupComp.save();
  }

  showInvalidControls(): void {
    let invalid = [];
    let controls = this.headerComp.endorsementHeaderForm.controls;

    // Check each control if it is valid
    for (let name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    // Loop through each child component to see it any of them have invalid controls
    if (this.groupComp.components != null) {
      for (let child of this.groupComp.components) {
        for (let name in child.endorsementCoveragesForm.controls) {
          if (child.endorsementCoveragesForm.controls[name].invalid) {
            invalid.push(name + " - Location: #" + child.coverage.locationId.toString());
          }
        }
      }
    }

    this.invalidMessage = "";
    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
     // this.invalidMessage = "Following fields are invalid";
      for (let error of invalid) {
        this.invalidMessage += "<br><li>" + error;
      }
    }
    if (!this.checkPremiumMatches()) {
      this.showInvalid = true;
      this.invalidMessage += "<br><li>Premium totals do not match";
    }

    if (this.showInvalid) {
      this.invalidMessage = "Following fields are invalid" + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  checkPremiumMatches() : boolean {
    let total:number = 0;
    this.endorsementCoveragesGroups.forEach( group => { group.coverages.forEach(coverage => { total += coverage.premium })});
    return this.headerComp.endorsement.premium == total
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

}
