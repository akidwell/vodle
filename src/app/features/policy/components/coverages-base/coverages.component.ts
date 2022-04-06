import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { lastValueFrom, Observable, Subject, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { PolicyService } from '../../services/policy/policy.service';
import { EndorsementCoverageLocationComponent, LocationResult } from '../coverages-endorsement-coverage-location/endorsement-coverage-location.component';
import { EndorsementCoverageLocationGroupComponent } from '../coverages-endorsement-coverage-location-group/endorsement-coverage-location-group.component';
import { Endorsement, PolicyInformation } from '../../models/policy';
import { PolicySave } from '../../models/policy-save';
import { EndorsementCoverage, EndorsementCoverageLocation, EndorsementCoveragesGroup, newEndorsementCoverage } from './coverages';
import { EndorsementHeaderComponent } from '../coverages-endorsement-header/endorsement-header.component';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { UpdatePolicyChild } from '../../services/update-child/update-child.service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';

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
  endorsement!: Endorsement;
  invalidMessage: string = "";
  showInvalid: boolean = false;
  coveragesSequence!: number;
  coveragesSub!: Subscription;
  canEditEndorsement: boolean = false;
  statusSub!: Subscription;
  data!: Data;

  @ViewChild(EndorsementHeaderComponent) headerComp!: EndorsementHeaderComponent;
  @ViewChildren(EndorsementCoverageLocationGroupComponent) components: QueryList<EndorsementCoverageLocationGroupComponent> | undefined;
  @ViewChild('modal') private locationComponent: EndorsementCoverageLocationComponent | undefined

  constructor(private route: ActivatedRoute, private userAuth: UserAuth,public modalService: NgbModal, private messageDialogService: MessageDialogService, private policyService: PolicyService, private updatePolicyChild: UpdatePolicyChild, private endorsementStatusService: EndorsementStatusService, private notification: NotificationService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.data = deepClone(data);
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.endorsement = data['endorsementData'].endorsement;
      this.endorsementCoveragesGroups = data['endorsementCoveragesGroups'].endorsementCoveragesGroups;
      //This flattens the sequence number over all the coverages data and gets the highest value. This value will be used for adding any new coverage.
      this.coveragesSequence = this.getNextCoverageSequence(this.endorsementCoveragesGroups);
      this.saveEndorsementCoverages = this.saveEndorsementCoverages;
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.coveragesSub?.unsubscribe();
    this.statusSub?.unsubscribe();
  }

  onIncrement(newSeq: number) {
    this.coveragesSequence = newSeq;
  }
  getNextCoverageSequence(allGroups: EndorsementCoveragesGroup[]) {
    return allGroups.map(group => group.coverages.map(coverage => coverage.sequence)).reduce(
      (locGroup, seq) => locGroup.concat(seq), []).reduce(
        (a, b) => Math.max(a, b), 0) + 1;
  }
  getProgramId(firstGroup: EndorsementCoveragesGroup) {
    return firstGroup.coverages[0].programId;
  }

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

        coverage.sequence = this.coveragesSequence;
        this.coveragesSequence++;
        coverage.locationId = location.locationId;
        coverage.endorsementNumber = this.endorsement.endorsementNumber,
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
    if (!this.canEdit) {
      return true;
    }
    if (this.components != null) {
      for (let child of this.components) {
        if (!child.isValid()) {
          this.endorsementStatusService.coverageValidated = false;
          return false;
        }
      }
    }
    this.endorsementStatusService.coverageValidated = this.headerComp.endorsementHeaderForm.status == 'VALID'
      && this.checkPremiumMatches() && this.headerComp.checkUnderlyingLimitValid() && this.headerComp.checkAttachmentPointValid()
      && this.headerComp.checkAttachmentPointUnderlyingLimitValid() && this.checkTerrorismMessage() == "";
    return this.endorsementStatusService.coverageValidated;
  }

  isCoveragesDirty(): boolean {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.isDirty()) {
          return true;
        }
      }
    }
    return false;
  }

  isDirty(): boolean {
    return this.canEdit && (this.isCoveragesDirty() || (this.headerComp.endorsementHeaderForm.dirty ?? false));
  }

  save(): void {
    this.savePolicyInfo().subscribe(() => {
      this.saveEndorsementInfo().subscribe(() => {
        this.saveEndorsementCoverages().subscribe(() => {
        });
      });
    })
  }

  saveEndorsementInfo(): Observable<boolean> {
    var subject = new Subject<boolean>();

    if (this.headerComp.canSave()) {
      const results$ = this.policyService.updateEndorsement(this.endorsement);
      lastValueFrom(results$)
      .then(x => {
        this.data['endorsementData'].endorsement = deepClone(this.endorsement);
        this.headerComp.endorsementHeaderForm.form.markAsPristine();
        this.headerComp.endorsementHeaderForm.form.markAsUntouched();
        this.notification.show('Endorsesement Header successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        subject.next(true)
      }).catch((error) => {
        this.messageDialogService.open("Endorsement Header Error", error.error.Message)
        this.endorsementStatusService.coverageValidated = false;
      });
    } else {
      setTimeout(() => subject.next(true), 0)
    }
    return subject.asObservable();
  }

  saveEndorsementCoverages(): Observable<boolean> {
    var subject = new Subject<boolean>();
    if (this.isCoveragesDirty()) {
      this.coveragesSub = this.policyService.updateEndorsementGroups(this.endorsementCoveragesGroups).subscribe(() => {
        this.data['endorsementCoveragesGroups'].endorsementCoveragesGroups = deepClone(this.endorsementCoveragesGroups);
        this.updatePolicyChild.notifyEndorsementCoverages();
        this.refreshEndorsement();
        this.notification.show('Coverages successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
      });
    } else {
      setTimeout(() => subject.next(true), 0)
    }
    return subject.asObservable();
  }
  savePolicyInfo(): Observable<boolean> {
    var subject = new Subject<boolean>();
    if (this.headerComp.savePolicyInfo) {
      this.policyService.updatePolicyInfo(this.policyInfo).subscribe(() => {
          this.data['policyInfoData'].policyInfo = deepClone(this.policyInfo);
          this.notification.show('Policy Information successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
          this.headerComp.savePolicyInfo = false;
          subject.next(true)
        })
    } else {
      setTimeout(() => subject.next(true), 0)
    }
    return subject.asObservable();
  }
  refreshEndorsement() {
    this.coveragesSub = this.policyService.getEndorsement(this.endorsement.policyId, this.endorsement.endorsementNumber).subscribe(endorsement => {
      if (this.endorsement.limit !== endorsement.limit) {
        this.endorsementStatusService.reinsuranceValidated = false;
        this.endorsement.limit = endorsement.limit;
      }
    });
  }

  deleteGroup(existingGroup: EndorsementCoveragesGroup) {
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
        if (!child.isLimitsPatternValid) {
          invalid.push("Location: #" + child.coverage.locationId.toString() + " Invalid Limit Pattern");
        }
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
    const terrorismMessage = this.checkTerrorismMessage();
    if (terrorismMessage != "") {
      this.showInvalid = true;
      this.invalidMessage += "<br><li>" + terrorismMessage;
    }
    if (!this.checkPremiumMatches()) {
      this.showInvalid = true;
      this.invalidMessage += "<br><li>Premium totals do not match";
    }
    if (!this.headerComp.checkAttachmentPointValid()) {
      this.showInvalid = true;
      this.invalidMessage += "<br><li>Attachment must be greater than 0 on Excess Policy";
    }
    if (!this.headerComp.checkAttachmentPointUnderlyingLimitValid()) {
      this.showInvalid = true;
      this.invalidMessage += "<br><li>Attachment Point must be greater than the underlying limits";
    }
    if (!this.headerComp.checkUnderlyingLimitValid()) {
      this.showInvalid = true;
      this.invalidMessage += "<br><li>Underlying Limit must be greater than 0 for XS policy";
    }
    if (this.showInvalid) {
      this.invalidMessage = "Following fields are invalid" + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  checkTerrorismMessage(): string {
    let terrorCoverageCount = 0;
    this.endorsementCoveragesGroups.forEach(group => {
      group.coverages.forEach(coverage => {
        if (coverage.premiumType == "T") {
          terrorCoverageCount++;
        }
      })
    })
    if (this.endorsement.terrorismCode == "D" && terrorCoverageCount > 0) {
      return "There should be no Terrorism Coverages when Terorism Code is D"
    }
    else if (this.endorsement.terrorismCode == "F" && terrorCoverageCount == 0) {
      return "There should be at least one Terrorism Coverage when Terorism Code is F"
    }
    return "";
  }

  checkPremiumMatches(): boolean {
    let total: number = 0;
    this.endorsementCoveragesGroups.forEach(group => { group.coverages.forEach(coverage => total += Number(coverage.premium) ?? 0) });
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

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }

}
