import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { PolicyInformation } from 'src/app/features/policy/models/policy';
import { ControllingLayerTypes, ControllingLayerTypeProgramIds, ExcessUmbrellaProgramIds, FirstLayerTypes, FirstLayerTypeProgramIds } from 'src/app/core/constants/program-types';
import { UnderlyingLimitBasis } from '../../models/schedules';
import { UnderlyingCoverageService } from '../../services/underlying-coverage/underlying-coverage.service';
import { LimitsPatternHelperService } from '../../services/limits-pattern-helper/limits-pattern-helper.service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';
import { UCCoverage } from '../../classes/UCCoverage';
import { UpdatePolicyChild } from '../../services/update-child/update-child.service';

@Component({
  selector: 'rsps-underlying-coverage-detail',
  templateUrl: './underlying-coverage-detail.component.html',
  styleUrls: ['./underlying-coverage-detail.component.css']
})
export class UnderlyingCoverageDetailComponent implements OnInit {
  canEditPolicy = true;
  ucbCollapsed = true;
  isReadOnly = false;
  limitBasisSubscription!: Subscription;
  limitsPatternSubscription?: Subscription;
  coverageTypes$: Observable<Code[]> | undefined;
  allLimitsPatternDescription: Code[] = [];
  policyInfo!: PolicyInformation;
  authSub: Subscription;
  endorsementNumber!: number;
  policyId!: number;
  faArrowUp = faAngleUp;
  isAPPolicy = false;
  isExcessUmbrella = false;
  isLimitsPatternValid = true;
  isExcessOfLimitsPatternValid = true;
  statusSub!: Subscription;
  canEditEndorsement = false;
  layerTypes: string[] = [];
  ucdCollapsed = true;
  collapsePanelSubscription!: Subscription;

  @Input() ucData!: UCCoverage;
  @Input() canDrag = false;
  @Output() deleteThisCoverage: EventEmitter<UCCoverage> = new EventEmitter();
  @ViewChild(NgForm, { static: false }) ucForm!: NgForm;
  constructor(private route: ActivatedRoute, private dropdowns: DropDownsService, private userAuth: UserAuth,
    public UCService: UnderlyingCoverageService, private limitsPatternHelperService: LimitsPatternHelperService, private endorsementStatusService: EndorsementStatusService, private updatePolicyChild: UpdatePolicyChild) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );

  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
    this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
    this.isAPPolicy = (this.policyInfo.programId == 84 || this.policyInfo.programId == 85) ? true : false;
    this.isExcessUmbrella = (ExcessUmbrellaProgramIds.includes(this.policyInfo.programId)) ? true : false;
    this.coverageTypes$ = this.dropdowns.getUnderlyingCoverageDescriptions();
    this.dropdowns.getLimitsPatternDescriptions().subscribe((limitsPattern) =>
    {
      this.allLimitsPatternDescription = limitsPattern;
    });
    this.processLimitBasisOnLoad();

    if (ControllingLayerTypeProgramIds.includes(this.policyInfo.programId)){
      this.layerTypes = ControllingLayerTypes;
    } else if (FirstLayerTypeProgramIds.includes(this.policyInfo.programId)){
      this.layerTypes = FirstLayerTypes;
    }
    this.ucdCollapsed = !this.ucData.isNew;
  }
  ngAfterViewInit(): void {
    this.collapsePanelSubscription = this.updatePolicyChild.collapseUnderlyingCoveragesObservable$.subscribe(() => {
      this.collapseExpand(true);
    });
  }
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
    this.collapsePanelSubscription?.unsubscribe();
  }
  processLimitBasisOnLoad() {
    if (this.readyToLoadLimitsBasis()) {
      this.limitBasisSubscription = this.dropdowns.getLimitBasisDescriptions(this.ucData.primaryCoverageCode || 0, this.policyInfo.programId, this.ucData.limitsPatternGroupCode || 0).subscribe(
        (limitBasisDescriptions: UnderlyingLimitBasis[]) =>
        {
          this.ucData.limitsBasisList = limitBasisDescriptions.sort((a,b) => a.order - b.order );

          this.ucData.isUserAddedLimitCheck();
          this.ucData.setLimitsOrder();

          this.ucData.buildLimitsPatternString();
          this.ucData.getUserAddedCount();
        }
      );
    }
  }
  //handles both limitPatternGroupCode and CoverageCode changes
  processValueChange() {
    this.ucForm.controls['limitsPattern'].markAsDirty();
    if (this.readyToLoadLimitsBasis()) {
      this.limitBasisSubscription = this.dropdowns.getLimitBasisDescriptions(this.ucData.primaryCoverageCode || 0, this.policyInfo.programId, this.ucData.limitsPatternGroupCode || 0).subscribe(
        (limitBasisDescriptions: UnderlyingLimitBasis[]) =>
        {
          let reapplyLimits = '';
          //if length is the same we keep the limits and reapply them
          if (this.ucData.limitsPattern && this.ucData.limitsBasisList.length == limitBasisDescriptions.length) {
            reapplyLimits = this.ucData.limitsPattern;
          }
          this.ucData.limitsBasisList = limitBasisDescriptions.sort((a,b) => a.order - b.order );
          this.ucData.generateLimitsOnChange();
          if (reapplyLimits != '') {
            this.ucData.limitsPattern = reapplyLimits;
            this.processLimitsChange();
          } else {
            this.checkLimitsPatternValid();
          }
        }
      );
    }
  }
  //fired when a child limit gets updated
  processCoverageLimitUpdate() {
    this.ucForm.controls['limitsPattern'].markAsDirty();
    this.ucData.buildLimitsPattern();
    if (this.ucData.userAddedCount > 0) {
      this.ucData.updateUserAddedLimits();
    }
    this.checkLimitsPatternValid();
  }
  //On Limits field change
  processLimitsChange(): void {
    this.ucForm.controls['limitsPattern'].markAsDirty();
    this.ucData.updateLimitsPattern();
    this.checkLimitsPatternValid();
  }

  //On Excess of Limits field change
  processExcessOfLimitsChange(): void {
    this.ucForm.controls['limitsPattern'].markAsDirty();
    this.ucData.updateExcessOfLimitsPattern();
    this.checkLimitsPatternValid();
  }

  deleteThisUnderlyingCoverage(): void{
    this.deleteThisCoverage.emit(this.ucData);
  }

  readyToLoadLimitsBasis() {
    if (this.isAPPolicy) {
      return (this.ucData.primaryCoverageCode && this.ucData.primaryCoverageCode > 0);
    } else {
      return ((this.ucData.primaryCoverageCode && this.ucData.primaryCoverageCode > 0) && (this.ucData.limitsPatternGroupCode && this.ucData.limitsPatternGroupCode > 0));
    }
  }
  checkLimitsPatternValid() {
    if (this.isAPPolicy && this.ucData.limitsBasisList.length == 0) {
      this.isLimitsPatternValid = true;
      this.isExcessOfLimitsPatternValid = true;
      return;
    }

    let isExcessOfValid = false;

    if (!this.isExcessUmbrella) {
      this.isExcessOfLimitsPatternValid = true;
    } else {
      isExcessOfValid = (this.ucData.excessOfLimitsPattern == '0' && this.ucData.isFirstOrControlling()) || this.ucData.checkIfLimitsPatternIsValid(this.ucData.excessOfLimitsPattern ?? '');
    }

    const isValid = this.ucData.checkIfLimitsPatternIsValid(this.ucData.limitsPattern ?? '');

    if (!isValid) {
      this.ucForm.controls['limitsPattern'].markAsTouched();
      this.ucForm.controls['limitsPattern'].setErrors({'incorrect': true});
    } else {
      this.ucForm.controls['limitsPattern'].setErrors(null);
    }
    this.isLimitsPatternValid = isValid;
    this.isExcessOfLimitsPatternValid = isExcessOfValid;
  }

  collapseExpand(event: boolean) {
    this.ucdCollapsed = event;
  }
}
