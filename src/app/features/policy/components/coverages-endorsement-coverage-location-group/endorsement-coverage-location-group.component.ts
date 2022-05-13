import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faAngleDown, faAngleUp, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { newEndorsementCoverage, EndorsementCoverage, EndorsementCoveragesGroup } from '../coverages-base/coverages';
import { EndorsementCoverageLocationComponent, LocationResult } from '../coverages-endorsement-coverage-location/endorsement-coverage-location.component';
import { EndorsementCoverageComponent } from '../coverages-endorsement-coverage/endorsement-coverage.component';
import { EndorsementCoverageDirective } from '../coverages-endorsement-coverage/endorsement-coverage.directive';
import { Endorsement, PolicyInformation } from '../../models/policy';
import { UpdatePolicyChild } from '../../services/update-child/update-child.service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';

@Component({
  selector: 'rsps-endorsement-coverage-location-group',
  templateUrl: './endorsement-coverage-location-group.component.html',
  styleUrls: ['./endorsement-coverage-location-group.component.css']
})
export class EndorsementCoverageLocationGroupComponent implements OnInit {
  faPlus = faPlus;
  faMinus = faMinus;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  authSub: Subscription;
  canEditPolicy = false;
  setLocationOnInit = false;
  formStatus!: string;
  anchorId!: string;
  locationCollapsed = true;
  collapsePanelSubscription!: Subscription;
  expandPanelSubscription!: Subscription;
  loaded = false;
  components: EndorsementCoverageComponent[] = [];
  canEditEndorsement = false;
  statusSub!: Subscription;

  @Input() public endorsement!: Endorsement;
  @Input() public policyInfo!: PolicyInformation;
  @Input() public endorsementCoveragesGroup!: EndorsementCoveragesGroup;
  @Input() public currentSequence!: number;
  @Input() public locationIndex!: number;
  @Input() public groupCount!: number;
  @Input() public copyCoverageGroupsActive!: boolean;
  @Output() incrementSequence: EventEmitter<number> = new EventEmitter();
  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild('modal') private locationComponent!: EndorsementCoverageLocationComponent;
  @ViewChild(NgForm, { static: false }) endorsementCoveragesForm!: NgForm;
  @Output() deleteThisGroup: EventEmitter<EndorsementCoveragesGroup> = new EventEmitter();

  constructor(private userAuth: UserAuth, private updatePolicyChild: UpdatePolicyChild, private componentFactoryResolver: ComponentFactoryResolver, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  async addNewCoverage(): Promise<void> {
    await this.collapsePanel(false);
    const newCoverage: EndorsementCoverage = this.createNewCoverage();
    this.incrementSequence.emit(this.currentSequence + 1);
    this.endorsementCoveragesGroup.coverages.push(newCoverage);
    this.endorsementCoveragesGroup.coverages[0].isFirst = true;
    this.addComponent(newCoverage, true);
  }

  copyExistingCoverage(existingCoverage: EndorsementCoverage) {
    const newCoverage: EndorsementCoverage = JSON.parse(JSON.stringify(existingCoverage));
    newCoverage.sequence = this.currentSequence;
    newCoverage.ecCollapsed = true;
    newCoverage.isNew = true;
    newCoverage.isFirst = false;
    this.incrementSequence.emit(this.currentSequence + 1);
    this.endorsementCoveragesGroup.coverages.push(newCoverage);
    this.addComponent(newCoverage, true);
  }

  deleteCoverage(existingCoverage: EndorsementCoverage) {
    const index = this.endorsementCoveragesGroup.coverages.indexOf(existingCoverage, 0);
    if (index > -1) {
      this.deleteComponent(index);
      this.endorsementCoveragesGroup.coverages.splice(index, 1);
      if (this.endorsementCoveragesGroup.coverages.length > 0) {
        this.endorsementCoveragesGroup.coverages[0].isFirst = true;
      }
      this.endorsementStatusService.coverageValidated = false;
    }
  }

  ngOnInit(): void {
    this.anchorId = 'focusHere' + this.endorsementCoveragesGroup.location.locationId;
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    if (this.locationIndex == 0) {
      this.collapsePanel(false);
    }
    // If adding a new location then the coverage will be new them expand and focus
    else if (this.endorsementCoveragesGroup.coverages[0]?.isNew) {
      this.collapsePanel(false);
    }
    this.checkIfLocationEmptyAddFromRiskLocation(this.endorsementCoveragesGroup);
  }

  ngAfterViewInit() {
    this.collapsePanelSubscription = this.updatePolicyChild.collapseLocationsObservable$.subscribe(() => {
      this.collapsePanel(true);
    });
    this.expandPanelSubscription = this.updatePolicyChild.expandLocationsObservable$.subscribe(() => {
      this.collapsePanel(false);
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
    this.collapsePanelSubscription?.unsubscribe();
    this.expandPanelSubscription?.unsubscribe();
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy;
  }

  async openLocation(group: EndorsementCoveragesGroup) {
    if (this.locationComponent != null) {
      const result = await this.locationComponent.open(group, this);
      if (result == LocationResult.delete) {
        this.deleteThisGroup.emit(this.endorsementCoveragesGroup);
      }
    }
  }

  checkIfLocationEmptyAddFromRiskLocation(group: EndorsementCoveragesGroup){
    if (!group.location.city && !group.location.state && !group.location.zip) {
      group.location.city = this.policyInfo.riskLocation.city;
      group.location.state = this.policyInfo.riskLocation.state;
      group.location.zip = this.policyInfo.riskLocation.zip;
      this.setLocationOnInit = true;
    }
  }
  isValid(): boolean {
    if (this.components != null) {
      for (const child of this.components) {
        if (child.endorsementCoveragesForm.status != 'VALID' || !child.isLimitsPatternValid) {
          return false;
        }
      }
    }
    return true;
  }

  isDirty() {
    if (this.components != null) {
      for (const child of this.components) {
        console.log(child.coverage.locationId,child.coverage.isCopied);
        if (child.endorsementCoveragesForm.dirty || this.setLocationOnInit || child.coverage.isCopied) {
          this.setLocationOnInit = false;
          return true;
        }
      }
    }
    return false;
  }

  createNewCoverage(): EndorsementCoverage {
    const newCoverage = newEndorsementCoverage();
    newCoverage.sequence = this.currentSequence;
    newCoverage.locationId = this.endorsementCoveragesGroup.location.locationId;
    newCoverage.endorsementNumber = this.endorsement.endorsementNumber;
    // newCoverage.endorsementNumber = this.endorsementNumber;
    newCoverage.programId = this.policyInfo.programId;
    newCoverage.coverageCode = this.policyInfo.quoteData.coverageCode;
    newCoverage.policySymbol = this.policyInfo.policySymbol;
    newCoverage.policyId = this.endorsementCoveragesGroup.location.policyId;
    return newCoverage;
  }

  @ViewChild(EndorsementCoverageDirective) endorsementCoverageDirective!: EndorsementCoverageDirective;

  async collapsePanel(action: boolean) {
    if (!action && !this.loaded) {

      if (this.endorsementCoveragesGroup.coverages.length > 0) {
        this.endorsementCoveragesGroup.coverages[0].isFirst = true;
      }

      await import('../coverages-endorsement-coverage/endorsement-coverage.component');
      const viewContainerRef = this.endorsementCoverageDirective.viewContainerRef;
      viewContainerRef.clear();

      for (const coverage of this.endorsementCoveragesGroup.coverages) {
        this.addComponent(coverage, false);
      }
      this.loaded = true;
    }
    this.locationCollapsed = action;
  }

  async addComponent(coverage: any, focus: boolean) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EndorsementCoverageComponent);
    const viewContainerRef = this.endorsementCoverageDirective.viewContainerRef;
    const componentRef = viewContainerRef.createComponent<EndorsementCoverageComponent>(componentFactory);
    componentRef.instance.coverage = coverage;
    componentRef.instance.policyInfo = this.policyInfo;
    componentRef.instance.copyExistingCoverage.subscribe(evt => this.copyExistingCoverage(evt));
    componentRef.instance.deleteThisCoverage.subscribe(evt => this.deleteCoverage(evt));
    this.components.push(componentRef.instance);
  }

  async deleteComponent(index: any) {
    const viewContainerRef = this.endorsementCoverageDirective.viewContainerRef;
    viewContainerRef.remove(index);
    this.components.splice(index,1);
  }

  focus(): void {
    setTimeout(() => {
      document.getElementById(this.anchorId)!.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }, 250);
  }

  calcTotal(): number {
    let total = 0;
    this.endorsementCoveragesGroup.coverages.forEach(coverage => {
      total += Number.isNaN(Number(coverage.premium)) ? 0 : Number(coverage.premium);
    });
    return total;
  }
}
