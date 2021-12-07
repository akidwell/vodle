import { sequence } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { finalize, share, tap } from 'rxjs/operators';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { PolicyInformation } from 'src/app/policy/policy';
import { UnderlyingCoveragesResolver } from 'src/app/policy/policy-resolver-service';
import { UnderlyingCoverage, UnderlyingLimitBasis, UnderlyingCoverageLimit } from '../../schedules';
import { UnderlyingCoverageService } from '../../services/underlying-coverage.service';


@Component({
  selector: 'rsps-underlying-coverage-detail',
  templateUrl: './underlying-coverage-detail.component.html',
  styleUrls: ['./underlying-coverage-detail.component.css']
})
export class UnderlyingCoverageDetailComponent implements OnInit {
  canEditPolicy: boolean = true;
  ucdCollapsed = true;
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
  policyInfo!: PolicyInformation;
  authSub: Subscription;
  endorsementNumber!: number;
  policyId!: number;
  isAPPolicy: boolean = false;
  @Input() ucData!: UnderlyingCoverage;
  constructor(private route: ActivatedRoute, private dropdowns: DropDownsService, private userAuth: UserAuth, public UCService: UnderlyingCoverageService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );

   }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
    this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
    this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
    this.isAPPolicy = (this.policyInfo.programId == 84 || this.policyInfo.programId == 85) ? true : false;
    if ((this.ucData.primaryCoverageCode && this.ucData.primaryCoverageCode > 0) || (this.ucData.limitsPatternGroupCode && this.ucData.limitsPatternGroupCode > 0)) {
      this.limitBasisSubscription = this.dropdowns.getLimitBasisDescriptions(this.ucData.primaryCoverageCode || 0, this.policyInfo.programId, this.ucData.limitsPatternGroupCode || 0).subscribe(
        (limitBasisDescriptions: UnderlyingLimitBasis[]) =>
        {
          this.limitBasisDescriptions = limitBasisDescriptions;

          this.updateStrings(true);

          //Get count of untracked limits
          this.getUserAddedCount();
        }
      );
    }
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
    if (this.isAPPolicy && onInit) {
      this.updateAPLimitsPattern();
    } else {
      this.updateLimitsPattern();
    }
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
      limit: '0',
      limitBasisCode: basis?.limitBasisCode || 0,
      order: basis?.order || 999,
      sequence: this.ucData.sequence,
      includeExclude: null,
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
          if(element.limit && (element.limit.toString().toLowerCase() == 'e' || element.limit.toString().toLowerCase() == 'exclude')) {
            this.ucData.limitsPattern += 'Exclude'
          } else if (element.limit && (element.limit.toString().toLowerCase() == 'i' || element.limit.toString().toLowerCase() == 'include')) {
            this.ucData.limitsPattern += 'Include'
          } else if (!parseInt(element.limit)){
            element.limit = '0';
            this.ucData.limitsPattern += element.limit;
          } else {
            this.ucData.limitsPattern += element.limit;
          }
          if(index < this.limitedLimitsBasis.length - 1) {
            this.ucData.limitsPattern += '/';
          }
        }
      });
    })
  }
  updateAPLimitsPattern(): void {
    this.ucData.limitsPattern = '';
    this.limitedLimitsBasis.forEach((basis,index) => {
      this.ucData.underlyingScheduleLimitData.forEach(element => {
        if(!element.isUserAdded && element.limitBasisCode == basis) {
          console.log(this.ucData.limitsPattern)
          if(element.includeExclude && element.includeExclude?.toLowerCase() == 'e') {
            this.ucData.limitsPattern += 'Exclude'
            element.limit = 'Exclude';
          } else if (element.includeExclude && element.includeExclude?.toLowerCase() == 'i') {
            this.ucData.limitsPattern += 'Include'
            element.limit = 'Include';
          } else if (!parseInt(element.limit)){
            element.limit = '0';
            this.ucData.limitsPattern += element.limit;
          } else {
          this.ucData.limitsPattern += element.limit;
          }
          if(index < this.limitedLimitsBasis.length - 1) {
            this.ucData.limitsPattern += '/';
          }
        }

      });
    })
  }
  //On Limits field change
  updateLimitBasisData(): void {
    var regenerateString = false;
    var limits: string[] = this.ucData.limitsPattern?.split('/') || [];
    this.ucData.underlyingScheduleLimitData.forEach((element,index) => {
      if (this.limitedLimitsBasis.includes(element.limitBasisCode)){
        if(limits[index].toLowerCase() == 'e' || limits[index].toLowerCase() == 'exclude') {
          element.limit = 'Exclude';
          element.includeExclude = 'e';
        } else if (limits[index].toLowerCase() == 'i' || limits[index].toLowerCase() == 'include') {
          element.limit = 'Include';
          element.includeExclude = 'I';
        } else if (!parseInt(limits[index])){
          element.limit = '0';
          element.includeExclude = null;
          regenerateString = true;
        } else {
          element.limit = limits[index];
          element.includeExclude = null;
        }

      }
      if (regenerateString) {
        this.updateLimitsPattern();
      }
    });
  }
  generateLimits(): void {
    this.getUserAddedCount();
    this.limitedLimitsPatternString = '';
    this.limitBasisOrder = 1;
    for (let index = 0; index < this.ucData.underlyingScheduleLimitData?.length; index++) {
      const element = this.ucData.underlyingScheduleLimitData[index];

      for (let limitIndex = 0; limitIndex < (this.limitBasisDescriptions?.length || 0); limitIndex++) {
        if (this.limitBasisDescriptions && (element.limitBasisCode == this.limitBasisDescriptions[limitIndex].limitBasisCode)) {
          element.limitBasis = this.limitBasisDescriptions[limitIndex].limitBasisDesc;
          element.order = this.limitBasisDescriptions[limitIndex].order;
          break;
        }
      }

      element.order = element.order ? element.order : 999;
      element.isUserAdded = element.order == 999 ? true : false;
    }


    if(this.isAPPolicy) {
      this.updateAPLimitsPatternBasisCodes();
      this.updateAPLimitsPattern();
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
    this.UCService.limitsPatternDescriptions.forEach(element => {
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
}
