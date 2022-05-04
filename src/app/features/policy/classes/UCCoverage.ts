import { UnderlyingCoverage, UnderlyingCoverageLimit, UnderlyingLimitBasis } from '../models/schedules';
import { UCLimit } from './UCLimit';

export class UCCoverage implements UnderlyingCoverage {
  policyId: number = 0;
  endorsementNo: number = 0;
  sequence: number = 0;
  primaryCoverageCode?: number = 0;
  limitsPatternGroupCode?: number = 0;
  limitsPattern?: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  policyNumber?: String;
  carrierCode?: Number = 0;
  carrierName?: String;
  retroDate?: Date;
  label?: String;
  excessOfLimitsPattern?: string;
  underlyingScheduleLimitData: UCLimit[] = [];
  isNew: boolean = false;
  userAddedCount: number = 0;
  limitsBasisList: UnderlyingLimitBasis[] = [];
  limitsPatternString: string = '';

  constructor(uc?: UnderlyingCoverage) {
    this.policyId = uc?.policyId ?? 0;
    this.endorsementNo = uc?.endorsementNo ?? 0;
    this.sequence = uc?.sequence ?? 0;
    this.primaryCoverageCode = uc?.primaryCoverageCode ?? 0;
    this.limitsPatternGroupCode = uc?.limitsPatternGroupCode ?? 0;
    this.limitsPattern = uc?.limitsPattern ?? '';
    this.effectiveDate = uc?.effectiveDate;
    this.expirationDate = uc?.expirationDate;
    this.policyNumber = uc?.policyNumber;
    this.carrierCode = uc?.carrierCode ?? 0;
    this.carrierName = uc?.carrierName ?? '';
    this.retroDate = uc?.retroDate;
    this.label = uc?.label ?? '';
    this.excessOfLimitsPattern = uc?.excessOfLimitsPattern;
    this.underlyingScheduleLimitData = (uc && uc.underlyingScheduleLimitData) ? this.transformUnderlyingCoverageLimitData(uc.underlyingScheduleLimitData) : [];
    this.isNew = uc?.isNew ?? false;
    this.limitsBasisList = [];
  }
  //convert an array of UnderlyingCoverageLimits to UCLimits
  transformUnderlyingCoverageLimitData(limits: UnderlyingCoverageLimit[]): UCLimit[] {
    var ucLimits: UCLimit[] = [];
    limits.forEach(element => {
      ucLimits.push(new UCLimit(element))
    });
    return ucLimits;
  }
  //add a user defined limit
  addUserDefinedLimit(): void {
    var newLimit = new UCLimit(this.createNewLimit());
    this.underlyingScheduleLimitData.push(newLimit);
    this.getUserAddedCount();
  }
  //delete user defined limit
  deleteUserDefinedLimit(limit: UCLimit): void {
    const index = this.underlyingScheduleLimitData.indexOf(limit, 0);
    if (index > -1) {
      this.underlyingScheduleLimitData.splice(index, 1);
      this.getUserAddedCount();
    }
  }
  isUserAddedLimitCheck() {
    this.underlyingScheduleLimitData.forEach((limit) => {
      var limitFound = false;
      this.limitsBasisList.forEach((basis) => {
        if (limit.limitBasisCode == basis.limitBasisCode){
          limitFound = true;
        }
      });
      limit.isUserAdded = !limitFound;
    });
  }
  generateLimitsOnChange() {
    this.createDefaultsForNewLimitsPattern();
    this.buildLimitsPattern();
    this.buildLimitsPatternString();
  }
  //sets the amount of user added limits
  getUserAddedCount(): void {
    this.userAddedCount = 0;
    this.underlyingScheduleLimitData?.forEach(d => {
      if (d.isUserAdded)
        this.userAddedCount++;
    });
  }
  //Update the visual display on the underlying-coverage-detail-component
  buildLimitsPattern() {
    var limitsPattern = ''
    var limitPatternLength = this.limitsBasisList.length;
    this.limitsBasisList.forEach((basis, index) => {
      this.underlyingScheduleLimitData.forEach((limit) => {
        if (!limit.isUserAdded && limit.limitBasisCode == basis.limitBasisCode){
          limitsPattern += limit.limitDisplay;
          if (limitPatternLength -1 != index) {
            limitsPattern += '/';
          }
        }
      });
    });
    this.limitsPattern = limitsPattern;
  }
  //Update the visual display on the underlying-coverage-detail-component
  buildExcessOfLimitsPattern() {
    var limitsPattern = ''
    var limitPatternLength = this.limitsBasisList.length;
    this.limitsBasisList.forEach((basis, index) => {
      this.underlyingScheduleLimitData.forEach((limit) => {
        if (!limit.isUserAdded && limit.limitBasisCode == basis.limitBasisCode){
          limitsPattern += limit.excessDisplay;
          if (limitPatternLength -1 != index) {
            limitsPattern += '/';
          }
        }
      });
    });
    this.excessOfLimitsPattern = limitsPattern;
  }
  checkIfLimitsPatternIsValid(limitsPattern: string): boolean {
    let isValid = limitsPattern?.split('/').length == this.limitsBasisList.length;
    for (let x of limitsPattern?.split("/") || []) {
      if ((x == '') || (x == '0')) {
        isValid = false;
      }
    }
    return isValid;
  }
  isFirstOrControlling(): boolean {
    return (this.label == 'First Underlying Insurance' || this.label == 'Controlling Underlying Insurance')
  }

  buildLimitsPatternString() {
    var limitsPatternString = '';
    this.limitsBasisList.forEach((basis) => {
      this.underlyingScheduleLimitData.forEach(limit => {
        if (!limit.isUserAdded && limit.limitBasisCode == basis.limitBasisCode){
          limitsPatternString += basis.limitBasisDesc + '/';
        }
      });
    });
    this.limitsPatternString = limitsPatternString.substring(0, limitsPatternString.length - 1);
  }
  updateLimitsPattern(){
    var limits: string[] = this.limitsPattern?.split('/') || [];
    if(limits.length != this.limitsBasisList.length ) {
      this.limitsPattern = '';
      return;
    }
    this.limitsBasisList.forEach((basis, index) => {
      this.underlyingScheduleLimitData.forEach(limit => {
        if (!limit.isUserAdded && limit.limitBasisCode == basis.limitBasisCode){
          limit.limitDisplay = limits[index];
          limit.checkLimitDisplayForIncludeExclude();
          limit.setLimit();
          limit.limitDisplay = limit.setLimitDisplay(limit.limit, limit.includeExclude);
        }
      });
    });
    this.buildLimitsPattern();
  }
  updateUserAddedLimits() {
    this.underlyingScheduleLimitData.forEach(limit => {
      if (limit.isUserAdded) {
        limit.checkLimitDisplayForIncludeExclude();
        limit.setLimit();
        limit.limitDisplay = limit.setLimitDisplay(limit.limit, limit.includeExclude);
      }
    });
  }
  updateExcessOfLimitsPattern() {
    var limits: string[] = this.excessOfLimitsPattern?.split('/') || [];
    this.excessOfLimitsPattern = '';
    if(limits.length != this.limitsBasisList.length ) {
      this.excessOfLimitsPattern = '0';
      this.underlyingScheduleLimitData.forEach(limit => {
        limit.excess = null;
      });
    } else {
      this.limitsBasisList.forEach((basis, index) => {
        this.underlyingScheduleLimitData.forEach(limit => {
          if (!limit.isUserAdded && limit.limitBasisCode == basis.limitBasisCode){
            limit.excessDisplay = limits[index];
            limit.setExcessLimit();
            limit.excessDisplay = limit.setLimitDisplay(limit.excess, null);
          }
        });
      });
      this.buildExcessOfLimitsPattern();
    }
  }

  //Order limits so that they display as they are ordered in the limits pattern
  setLimitsOrder() {
    this.underlyingScheduleLimitData.forEach((limit) => {
      if (limit.isUserAdded) {
        limit.order = 999;
      } else {
        this.limitsBasisList.forEach((basis) => {
          if (!limit.isUserAdded && limit.limitBasisCode == basis.limitBasisCode){
            limit.order = basis.order;
          }
        });
      }
    });
    this.underlyingScheduleLimitData.sort((a,b) => a.order - b.order )
  }
  createNewLimit(basis?: UnderlyingLimitBasis): UnderlyingCoverageLimit {
    var limit: UnderlyingCoverageLimit = {
      limitBasis: basis?.limitBasis || "0",
      endorsementNo: this.endorsementNo,
      policyId: this.policyId,
      limitDisplay: '0',
      limit: 0,
      limitBasisCode: basis?.limitBasisCode || 0,
      order: basis?.order || 999,
      sequence: this.sequence,
      includeExclude: null,
      excessDisplay: '',
      excess: null,
      isUserAdded: (basis && basis.order < 999) ? false : true
    }
    return limit;
  }

  createDefaultsForNewLimitsPattern(){
    //first need to store any user added limits
    var userAddedLimits: UCLimit[] = [];
    this.underlyingScheduleLimitData.forEach(element => {
      if (element.isUserAdded) {
        userAddedLimits.push(element);
      }
    });
    //create new limits
    this.generateNewUnderlyingScheduleLimitData();

    //re-add user added limits to new records
    this.underlyingScheduleLimitData = this.underlyingScheduleLimitData.concat(userAddedLimits);
  }
  //On changing LimitsPatternGroupCode for PAUL or PrimaryCoverageCode for AP we need to regenerate default limit basis
  generateNewUnderlyingScheduleLimitData() {
    var UnderlyingCoverageLimits: UCLimit[] = [];
    if(this.limitsBasisList) {
      this.limitsBasisList.forEach(element => {
        UnderlyingCoverageLimits.push(new UCLimit(this.createNewLimit(element)))
      });
    }
    this.underlyingScheduleLimitData = UnderlyingCoverageLimits;
  }
}
