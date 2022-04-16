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
import { UnderlyingCoverage, UnderlyingLimitBasis, UnderlyingCoverageLimit } from '../../models/schedules';
import { UnderlyingCoverageService } from '../../services/underlying-coverage/underlying-coverage.service';
import { LimitsPatternHelperService } from '../../services/limits-pattern-helper/limits-pattern-helper.service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';


@Component({
  selector: 'rsps-underlying-coverage-detail',
  templateUrl: './underlying-coverage-detail.component.html',
  styleUrls: ['./underlying-coverage-detail.component.css']
})
export class UnderlyingCoverageDetailComponent implements OnInit {
  canEditPolicy: boolean = true;
  ucbCollapsed = true;
  isReadOnly: boolean = false;
  limitsPatternString: string = '';
  limitedLimitsPatternString: string = '';
  limitedLimitsBasis: number[] = [];
  userAddedCount: number = 0;
  limitBasisOrder: number = 1;
  limitBasisDescriptions: UnderlyingLimitBasis[] | undefined;
  limitBasisSubscription!: Subscription;
  limitsPatternSubscription?: Subscription;
  coverageTypes$: Observable<Code[]> | undefined;
  allLimitsPatternDescription: Code[] = [];
  policyInfo!: PolicyInformation;
  authSub: Subscription;
  endorsementNumber!: number;
  policyId!: number;
  faArrowUp = faAngleUp;
  isAPPolicy: boolean = false;
  isExcessUmbrella: boolean = false;
  isLimitsPatternValid: boolean = true;
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;
  layerTypes: string[] = [];
  @Input() ucData!: UnderlyingCoverage;
  ucdCollapsed = true;

  @Output() deleteThisCoverage: EventEmitter<UnderlyingCoverage> = new EventEmitter();
  @ViewChild(NgForm, { static: false }) ucForm!: NgForm;
  constructor(private route: ActivatedRoute, private dropdowns: DropDownsService, private userAuth: UserAuth,
    public UCService: UnderlyingCoverageService, private limitsPatternHelperService: LimitsPatternHelperService, private endorsementStatusService: EndorsementStatusService) {
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
    this.coverageTypes$ = this.dropdowns.getUnderlyingCoverageDescriptions();
    this.dropdowns.getLimitsPatternDescriptions().subscribe((limitsPattern) =>
    {
      this.allLimitsPatternDescription = limitsPattern;
      this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
      this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
      this.isAPPolicy = (this.policyInfo.programId == 84 || this.policyInfo.programId == 85) ? true : false;
      this.isExcessUmbrella = (ExcessUmbrellaProgramIds.includes(this.policyInfo.programId)) ? true : false;
      if ((this.ucData.primaryCoverageCode && this.ucData.primaryCoverageCode > 0) || (this.ucData.limitsPatternGroupCode && this.ucData.limitsPatternGroupCode > 0)) {
        this.limitBasisSubscription = this.dropdowns.getLimitBasisDescriptions(this.ucData.primaryCoverageCode || 0, this.policyInfo.programId, this.ucData.limitsPatternGroupCode || 0).subscribe(
          (limitBasisDescriptions: UnderlyingLimitBasis[]) =>
          {
            this.limitBasisDescriptions = limitBasisDescriptions;

            this.updateStrings(true);

            //Get count of untracked limits
            this.getUserAddedCount();
            this.isLimitsPatternValid = this.checkLimitsPatternValid();
          }
        );
      }
    });
    if (ControllingLayerTypeProgramIds.includes(this.policyInfo.programId)){
      this.layerTypes = ControllingLayerTypes;
    } else if (FirstLayerTypeProgramIds.includes(this.policyInfo.programId)){
      this.layerTypes = FirstLayerTypes;
    }
    this.ucdCollapsed = !this.ucData.isNew;
  }
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
  }
  //This drives PAUL policies
  updateLimitsPatternGroupCode():void {
    this.updateLimitsPatternBasisCodes();

    this.limitBasisSubscription = this.dropdowns.getLimitBasisDescriptions(this.ucData.primaryCoverageCode || 0, this.policyInfo.programId, this.ucData.limitsPatternGroupCode || 0).subscribe(
      (limitBasisDescriptions: UnderlyingLimitBasis[]) =>
      {
        this.limitBasisDescriptions = limitBasisDescriptions
        var userAddedLimits: UnderlyingCoverageLimit[] = [];
        this.ucData.underlyingScheduleLimitData.forEach(element => {
          if (element.isUserAdded) {
            userAddedLimits.push(element);
          }
        });
        this.ucData.underlyingScheduleLimitData = this.generateNewUnderlyingScheduleLimitData();
        this.updateStrings(false);
        this.ucData.underlyingScheduleLimitData = this.ucData.underlyingScheduleLimitData.concat(userAddedLimits);
        this.isLimitsPatternValid = this.checkLimitsPatternValid();
      }
    );
  }

  //This updates the coverages by primary coverage code (AP) or limits pattern group code (PAUL)
  updateCoverageType():void {
    if (this.ucData.primaryCoverageCode || this.ucData.limitsPatternGroupCode) {
      this.limitBasisSubscription = this.dropdowns.getLimitBasisDescriptions(this.ucData.primaryCoverageCode || 0, this.policyInfo.programId, this.ucData.limitsPatternGroupCode || 0).subscribe(
        (limitBasisDescriptions: UnderlyingLimitBasis[]) =>
        {
          this.limitBasisDescriptions = limitBasisDescriptions;
          if (this.isAPPolicy){
            var userAddedLimits: UnderlyingCoverageLimit[] = [];
            this.ucData.underlyingScheduleLimitData.forEach(element => {
              if (element.isUserAdded) {
                userAddedLimits.push(element);
              }
            });
            this.ucData.underlyingScheduleLimitData = this.generateNewUnderlyingScheduleLimitData();
            this.updateStrings(false);
            this.ucData.underlyingScheduleLimitData = this.ucData.underlyingScheduleLimitData.concat(userAddedLimits);

            this.updateAPLimitsPatternBasisCodes();
          }
        }
      );
    }
  }
  updateStrings(onInit: boolean): void {
    this.generateLimits();

    if (this.isAPPolicy) {
      this.updateAPLimitsPatternBasisCodes();
    } else {
      this.updateLimitsPatternBasisCodes();
    }
    this.updateLimitsPattern();
  }
  //On changing LimitsPatternGroupCode for PAUL or PrimaryCoverageCode for AP we need to regenerate default limit basis
  generateNewUnderlyingScheduleLimitData(): UnderlyingCoverageLimit[] {
    var UnderlyingCoverageLimits: UnderlyingCoverageLimit[] = [];
    if(this.limitBasisDescriptions) {
      this.limitBasisDescriptions.forEach(element => {
        UnderlyingCoverageLimits.push(this.createNewLimit(false, element))
      });
    }
    return UnderlyingCoverageLimits;
  }
  createNewLimit(userAdded: boolean, basis?: UnderlyingLimitBasis): UnderlyingCoverageLimit{
    var limit: UnderlyingCoverageLimit = {
      limitBasis: basis?.limitBasis || "0",
      endorsementNo: this.ucData.endorsementNo,
      policyId: this.ucData.policyId,
      limitDisplay: '0',
      limit: 0,
      limitBasisCode: basis?.limitBasisCode || 0,
      order: basis?.order || 999,
      sequence: this.ucData.sequence,
      includeExclude: null,
      excessDisplay: '',
      excess: null,
      isUserAdded: userAdded
    }
    return limit;
  }
  //on child limit update and on load for AP
  updateLimitsPattern(): void {
    this.ucData.limitsPattern = '';
    this.limitedLimitsBasis.forEach((basis,index) => {
      this.ucData.underlyingScheduleLimitData.forEach(element => {
        if(!element.isUserAdded && element.limitBasisCode == basis) {
          if((element.limitDisplay && (element.limitDisplay.toLowerCase() == 'e'
          || element.limitDisplay.toLowerCase() == 'exclude'
          || element.limitDisplay.toLowerCase() == 'excluded'))
          || (element.includeExclude != null && element.includeExclude.toLowerCase() == 'e')) {
            element.limitDisplay = 'Excluded'
            element.limit = null;
          } else if ((element.limitDisplay && (element.limitDisplay.toLowerCase() == 'i'
          || element.limitDisplay.toLowerCase() == 'include'
          || element.limitDisplay.toLowerCase() == 'included'))
          || (element.includeExclude != null && element.includeExclude.toLowerCase() == 'i')) {
            element.limitDisplay = 'Included'
            element.limit = null;
          } else if (!parseInt(element.limitDisplay)){
            element.limitDisplay = '0'
            element.limit = 0;
          } else if (parseInt(element.limitDisplay) < 100){
            element.limit = parseInt(element.limitDisplay) * 1000000;
            element.limitDisplay = element.limit.toString();
          } else {
            element.limit = parseInt(element.limitDisplay);
          }
          this.ucData.limitsPattern += element.limitDisplay;
          if(index < this.limitedLimitsBasis.length - 1) {
            this.ucData.limitsPattern += '/';
          }
        }
      });
    });
    //handle userAdded records
    this.ucData.underlyingScheduleLimitData.forEach(element => {
    if(element.isUserAdded) {
        if((element.includeExclude != null && element.includeExclude.toLowerCase() == 'e')) {
          element.limitDisplay = 'Excluded'
          element.limit = null;
        } else if ((element.includeExclude != null && element.includeExclude.toLowerCase() == 'i')) {
          element.limitDisplay = 'Included'
          element.limit = null;
        } else if (parseInt(element.limitDisplay) < 100){
          element.limit = parseInt(element.limitDisplay) * 1000000;
          element.limitDisplay = element.limit.toString();
        } else {
          element.limit = parseInt(element.limitDisplay);
        }
      }
    });
    this.isLimitsPatternValid = this.checkLimitsPatternValid();
  }

  handleLimitUpdate() {
    this.ucData.underlyingScheduleLimitData.forEach(element => {
      if(element.limitDisplay.toLowerCase() == 'excluded') {
        element.includeExclude = 'E';
      } else if (element.limitDisplay.toLowerCase() == 'included') {
        element.includeExclude = 'I';
      } else {
        element.includeExclude = null;
      }
    })
    this.ucForm.controls['limitsPattern'].markAsDirty();
    this.updateLimitsPattern()
  }
  //On Limits field change
  updateLimitBasisData(): void {
    this.ucData.limitsPattern = this.limitsPatternHelperService.parseLimitsPattern(this.ucData.limitsPattern || '', this.limitedLimitsBasis.length);
    var regenerateString = false;
    var limits: string[] = this.ucData.limitsPattern?.split('/') || [];
    if(limits.length != this.limitedLimitsBasis.length ) {
      //throw warning and regenerate
      this.updateLimitsPattern();
      return;
    }
    this.ucData.underlyingScheduleLimitData.forEach((element,index) => {
      if (this.limitedLimitsBasis.includes(element.limitBasisCode)){
        if(limits[index].toLowerCase() == 'e' || limits[index].toLowerCase() == 'exclude' || limits[index].toLowerCase() == 'excluded') {
          element.limitDisplay = 'Excluded';
          element.limit = null;
          element.includeExclude = 'E';
        } else if (limits[index].toLowerCase() == 'i' || limits[index].toLowerCase() == 'include' || limits[index].toLowerCase() == 'included') {
          element.limitDisplay = 'Included';
          element.limit = null;
          element.includeExclude = 'I';
        } else if (!parseInt(limits[index])){
          element.limitDisplay = '0';
          element.limit = null;
          element.includeExclude = null;
          regenerateString = true;
        } else {
          element.limitDisplay = parseInt(limits[index]).toString();
          element.limit = parseInt(limits[index]);
          element.includeExclude = null;
        }

      }
      if (regenerateString) {
        this.updateLimitsPattern();
      }
      this.isLimitsPatternValid = this.checkLimitsPatternValid();
    });
  }
  updateExcessLimitBasisData(): void {
    var limits: string[] = this.ucData.excessOfLimitsPattern?.split('/') || [];
    this.ucData.excessOfLimitsPattern = '';
    if(limits.length != this.limitedLimitsBasis.length ) {
      //throw warning and regenerate
      //this.updateLimitsPattern();
      this.ucData.excessOfLimitsPattern = '0';
      return;
    }
    this.ucData.underlyingScheduleLimitData.forEach((element,index) => {
      if (this.limitedLimitsBasis.includes(element.limitBasisCode)){
        if (!parseInt(limits[index])){
          element.excessDisplay = '0';
          element.excess = null;
        } else if (parseInt(limits[index]) < 100){
          element.excess = (parseInt(limits[index]) * 1000000);
          element.excessDisplay = element.excess.toString();
        } else {
          element.excessDisplay = limits[index];
          element.excess = parseInt(limits[index])
        }
      }
      this.ucData.excessOfLimitsPattern += element.excessDisplay;
          if(index < this.limitedLimitsBasis.length - 1) {
            this.ucData.excessOfLimitsPattern += '/';
          }
    });
  }
  //On Limits field change
  updateExcessOfLimitBasisData(): void {
    this.updateExcessLimitBasisData();
  }
  generateLimits(): void {
    this.getUserAddedCount();
    this.limitedLimitsPatternString = '';
    this.limitBasisOrder = 1;
    for (let index = 0; index < this.ucData.underlyingScheduleLimitData?.length; index++) {
      const element = this.ucData.underlyingScheduleLimitData[index];

      for (let limitIndex = 0; limitIndex < (this.limitBasisDescriptions?.length || 0); limitIndex++) {
        if (this.limitBasisDescriptions && (element.limitBasisCode == this.limitBasisDescriptions[limitIndex].limitBasisCode)) {
          element.limitDisplay = this.setLimitDisplay(element.limit, element.includeExclude);
          element.excessDisplay = this.setExcessDisplay(element.limit);
          element.limitBasis = this.limitBasisDescriptions[limitIndex].limitBasisDesc;
          element.order = this.limitBasisDescriptions[limitIndex].order;
          break;
        }
      }

      element.order = element.order ? element.order : 999;
      element.isUserAdded = element.order == 999 ? true : false;
      if (element.isUserAdded) {
        element.limitDisplay = this.setLimitDisplay(element.limit, element.includeExclude);
      }
    }

    if(this.isAPPolicy) {
      this.updateAPLimitsPatternBasisCodes();
      this.updateLimitsPattern();
    }
    this.ucData.underlyingScheduleLimitData.sort((a,b) => a.order - b.order )
    for (let index = 0; index < this.ucData.underlyingScheduleLimitData?.length; index++) {
      const element = this.ucData.underlyingScheduleLimitData[index];
      if (!element.isUserAdded) {
        this.limitedLimitsPatternString += element.limitBasis + '/';
      }
    }
    this.limitedLimitsPatternString = this.limitedLimitsPatternString.substring(0, this.limitedLimitsPatternString.length - 1);
  }
  //This creates the limit basis data that is used to determine specific limits in the limit pattern for PAUL data
  updateLimitsPatternBasisCodes(): void {
    var limitBasisCodes: string = '';
    this.limitedLimitsBasis = [];
    this.allLimitsPatternDescription.forEach(element => {
      if (element.key == this.ucData.limitsPatternGroupCode){
        limitBasisCodes = element.code;
      }
    });
    limitBasisCodes.split('/').forEach(basis => {
      this.limitedLimitsBasis.push(parseInt(basis))
    })
  }
  //this creates the limit basis data for AP
  updateAPLimitsPatternBasisCodes(): void {
    this.limitedLimitsBasis = [];
    this.ucData.underlyingScheduleLimitData.forEach(l =>
      {
        if (!l.isUserAdded) {
          this.limitedLimitsBasis[l.order -1] = l.limitBasisCode;
        }
      });
  }
  setLimitDisplay(limit: number | null, includeExclude: string | null): string {
    if (limit == null) {
      if (includeExclude == 'E') {
        return 'Exclude';
      } else if (includeExclude == 'I') {
        return 'Include';
      } else {
        return '';
      }
    } else {
      return limit.toString()
    }
  }
  setExcessDisplay(limit: number | null): string {
    if (limit == null) {
      return '';
    } else {
      return limit.toString()
    }
  }
  getUserAddedCount(): void {
    this.userAddedCount = 0;
    this.ucData.underlyingScheduleLimitData?.forEach(d => {
      if (d.isUserAdded)
        this.userAddedCount++;
    });
  }
  checkIfPartOfLimitsPattern(): void {
    this.ucData.underlyingScheduleLimitData.forEach(element => {
      if (this.limitedLimitsBasis.includes(element.limitBasisCode)){
        element.isUserAdded = false;
      } else {
        element.isUserAdded = true;
      }
    });
  }
  addUserDefinedLimitBasis(): void {
    var newLimit = this.createNewLimit(true, undefined);
    this.ucData.underlyingScheduleLimitData.push(newLimit);
    this.getUserAddedCount();
  }
  deleteUserAddedLimit(limit: UnderlyingCoverageLimit): void {
    const index = this.ucData.underlyingScheduleLimitData.indexOf(limit, 0);
    if (index > -1) {
      this.ucData.underlyingScheduleLimitData.splice(index, 1);
      this.getUserAddedCount();
    }
  }
  deleteThisUnderlyingCoverage(): void{
    this.deleteThisCoverage.emit(this.ucData)
  }
  checkLimitsPatternValid(): boolean {
    if (this.isAPPolicy && this.ucData.limitsPatternGroupCode == null) {
      return true;
    }
    let isValid = this.ucData.limitsPattern?.split('/').length == this.limitedLimitsBasis.length;
    for (let x of this.ucData.limitsPattern?.split("/") || []) {
      if ((x == "") || (x == '0')) {
        isValid = false;
      }
    }

    if (!isValid) {
      this.ucForm.controls['limitsPattern'].markAsTouched();
      this.ucForm.controls['limitsPattern'].setErrors({'incorrect': true});
    } else {
      this.ucForm.controls['limitsPattern'].setErrors(null);
    }
    return isValid;
  }
  collapseExpand(event: boolean) {
    this.ucdCollapsed = event;
  }
}
