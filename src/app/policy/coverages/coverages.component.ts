import { Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { PolicyService } from '../policy.service';
import { EndorsementCoverageLocationComponent, LocationResult } from './endorsement-coverage-location-group/endorsement-coverage-location/endorsement-coverage-location.component';
import { EndorsementCoverageLocationGroupComponent } from './endorsement-coverage-location-group/endorsement-coverage-location-group.component';
import { PolicyInformation } from '../policy';
import { PolicySave } from '../policy-save';
import { EndorsementCoverage, EndorsementCoverageLocation, EndorsementCoveragesGroup, newEndorsementCoverage } from './coverages';
import { EndorsementHeaderComponent } from './endorsement-header/endorsement-header.component';
import { UpdatePolicyChild } from '../services/update-child.service';
import { EndorsementStatusService } from '../services/endorsement-status.service';
import { NotificationService } from 'src/app/notification/notification-service';

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
  endorsementNumber!: number;
  canEditEndorsement: boolean = false;
  statusSub!: Subscription;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private policyService: PolicyService, private updatePolicyChild: UpdatePolicyChild, private endorsementStatusService: EndorsementStatusService, private notification: NotificationService) {
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
      this.endorsementNumber = Number(this.route.snapshot.paramMap.get('end') ?? 0);
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;  
      }
    });
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }
  
  onIncrement(newSeq : number) {
    this.coveragesSequence = newSeq;
  }
  getNextCoverageSequence(allGroups: EndorsementCoveragesGroup[]) {
    return allGroups.map(group => group.coverages.map(coverage => coverage.sequence)).reduce(
      (locGroup, seq) => locGroup.concat(seq),[]).reduce(
        (a,b) => Math.max(a,b),0) + 1;
  }
  getProgramId(firstGroup: EndorsementCoveragesGroup){
    return firstGroup.coverages[0].programId;
  }
  @Output() status: EventEmitter<any> = new EventEmitter();

  saveEndorsementCoverages(): any {
    console.log(this.endorsementCoveragesGroups)
    this.coveragesSub = this.policyService.updateEndorsementGroups(this.endorsementCoveragesGroups).subscribe(() => {
        this.updatePolicyChild.notifyEndorsementCoverages();
        this.notification.show('Coverages successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.coveragesSub?.unsubscribe();
    this.statusSub?.unsubscribe();
  }

  @ViewChild(EndorsementHeaderComponent) headerComp!: EndorsementHeaderComponent;
  @ViewChildren(EndorsementCoverageLocationGroupComponent) components: QueryList<EndorsementCoverageLocationGroupComponent> | undefined;
  @ViewChild('modal') private locationComponent: EndorsementCoverageLocationComponent | undefined

  async newLocation() {
    if (this.locationComponent != null) {
      let location: EndorsementCoverageLocation = ({} as any) as EndorsementCoverageLocation;
      // get policyId from route
      let policyId: number = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
      location.policyId = policyId;

      var result = await this.locationComponent.new(location);
      if (result == LocationResult.new) {
        let coverage: EndorsementCoverage = ({} as EndorsementCoverage) as EndorsementCoverage;
        let group: EndorsementCoveragesGroup = { coverages: [], location: location }
        coverage = newEndorsementCoverage();

        coverage.locationId = location.locationId;
        coverage.endorsementNumber =  this.endorsementNumber,
        coverage.programId = this.policyInfo.programId;
        coverage.coverageCode = this.policyInfo.quoteData.coverageCode;
        coverage.policySymbol = this.policyInfo.policySymbol;
        coverage.policyId = this.policyInfo.policyId;
        group.coverages.push(coverage);
        this.endorsementCoveragesGroups.push(group);
      }
      return result;
    }
    return false;
  }

  isValid(): boolean {
    let total:number = 0;
    this.endorsementCoveragesGroups.forEach( group => { group.coverages.forEach(coverage => { total += coverage.premium.toString() == "" ? 0 : coverage.premium ?? 0})});
    if (this.components != null) {
      for (let child of this.components) {
        if (!child.isValid()) {
          this.endorsementStatusService.coverageValidated = false;
          return false;
        }
      }
    }

    this.endorsementStatusService.coverageValidated =  this.headerComp.endorsementHeaderForm.status == 'VALID' && this.headerComp.endorsement.premium == total;
    return this.headerComp.endorsementHeaderForm.status == 'VALID' && this.headerComp.endorsement.premium == total;
  }

  isDirty(): boolean {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.isDirty()) {
          return true;
        }
      }
    }
    return (this.headerComp.endorsementHeaderForm.dirty ?? false); //|| this.groupComp.isDirty();
  }

  save(): void {
    this.headerComp.save();
    this.saveEndorsementCoverages();
  }

  deleteGroup(existingGroup: EndorsementCoveragesGroup){
    const index = this.endorsementCoveragesGroups.indexOf(existingGroup, 0);
    if (index > -1) {
      this.endorsementCoveragesGroups.splice(index, 1);
    }
  }

  showInvalidControls(): void {
    let invalid = [];
    let controls = this.headerComp.endorsementHeaderForm.controls;

    this.showInvalid = false;

    // Check each control if it is valid
    for (let name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    // Loop through each child component to see it any of them have invalid controls
    for (let groups of this.components!) {
      for (let child of groups.components) {
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
    this.endorsementCoveragesGroups.forEach( group => { group.coverages.forEach(coverage => { total += coverage.premium.toString() == "" ? 0 : coverage.premium ?? 0 })});
    return this.headerComp.endorsement.premium == total
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }
  collapseAllLocations(): void {
    this.updatePolicyChild.collapseLocationsCoverages();
  }
  expandAllLocations(): void {
    this.updatePolicyChild.expandLocationsCoverages();
  }
}
