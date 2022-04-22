import { UnderlyingCoverageLimit } from '../models/schedules';

export class UCLimit implements UnderlyingCoverageLimit {
  policyId: number = 0;
  endorsementNo: number = 0;
  sequence: number= 0;
  limitBasisCode: number= 0;
  limit: number | null = null;
  limitDisplay: string = '';
  includeExclude: string | null = null;
  excess: number | null = null;
  excessDisplay: string ='';
  order: number = 0;
  limitBasis: string = '';
  isUserAdded: boolean = false;

  constructor(uc?: UnderlyingCoverageLimit) {
    this.policyId = uc?.policyId ?? 0;
    this.endorsementNo = uc?.endorsementNo ?? 0;
    this.sequence = uc?.sequence ?? 0;
    this.limitBasisCode = uc?.limitBasisCode ?? 0;
    this.limit = uc?.limit ?? null;
    this.limitDisplay = uc ? this.setLimitDisplay(uc.limit, uc.includeExclude) : '';
    this.includeExclude = uc?.includeExclude ?? null;
    this.excess = uc?.excess ?? null;
    this.excessDisplay = uc ? this.setLimitDisplay(uc.excess, null) : '';
    this.order = uc?.order ?? 0;
    this.limitBasis = uc?.limitBasis ?? '';
    this.isUserAdded = uc?.isUserAdded ?? false;
  }

  setLimitDisplay(limit: number | null, includeExclude: string | null): string {
    if(includeExclude && includeExclude.toLowerCase() == 'e') {
      return 'Excluded';
    } else if (includeExclude && includeExclude.toLowerCase() == 'i') {
      return 'Included';
    } else {
      return limit ? limit.toString() : '';
    }
  }
  setLimit() {
    if (this.includeExclude != null){
      this.limit = null;
    } else if (parseInt(this.limitDisplay) < 100){
      this.limit = parseInt(this.limitDisplay) * 1000000;
    } else {
      this.limit = parseInt(this.limitDisplay);
    }
  }
  setExcessLimit() {
    if (parseInt(this.excessDisplay) < 100){
      this.excess = parseInt(this.excessDisplay) * 1000000;
    } else {
      this.excess = parseInt(this.excessDisplay);
    }
  }
  checkLimitDisplayForIncludeExclude() {
    if(this.limitDisplay.toLowerCase() == 'e' || this.limitDisplay.toLowerCase() == 'exclude' || this.limitDisplay.toLowerCase() == 'excluded') {
      this.includeExclude = 'E';
    } else if (this.limitDisplay.toLowerCase() == 'i' || this.limitDisplay.toLowerCase() == 'include' || this.limitDisplay.toLowerCase() == 'included') {
      this.includeExclude = 'I';
    } else {
      this.includeExclude = null;
    }
  }
}
