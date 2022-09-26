import * as moment from 'moment';

export abstract class PolicyDatesRuleClass {
  warningsList: string[] = [];
  warningsMessage = '';
  _policyEffectiveDate: Date | null = null;
  _policyExpirationDate: Date | null = null;
  private readonly _effectiveDatePastWarningRange = 89;
  private readonly _effectiveDateFutureWarningRange = -180;

  setWarnings(isExpirationChange = false) {
    this.warningsList = [];
    this.warningsMessage = '';
    this.setEffectiveDateWarning();
    this.createWarningString();
  }
  setEffectiveDateWarning() {
    const diff = moment().diff(moment(this._policyEffectiveDate), 'days');
    if (diff >= this._effectiveDatePastWarningRange) {
      this.warningsList.push('Policy Effective Date is effective ' + diff + ' days ago.');
    } else if (diff <= this._effectiveDateFutureWarningRange) {
      this.warningsList.push(
        'Policy Effective Date is effective ' + (Math.abs(diff) + 1) + ' days in the future.'
      );
    }
  }

  createWarningString() {
    let firstRow = true;
    for (const error of this.warningsList) {
      if (firstRow) {
        this.warningsMessage += '<li>' + error;
        firstRow = false;
      } else {
        this.warningsMessage += '<br><li>' + error;
      }
    }
  }

  checkPolicyDates() {
    const invalidList: string[] = [];
    if (this._policyEffectiveDate == null) {
      invalidList.push('Effective Date is required');
    }
    if (this._policyExpirationDate == null) {
      invalidList.push('Expiration Date is required' );
    }
    const diff = moment(this._policyExpirationDate).diff(moment(this._policyEffectiveDate), 'days');
    if (diff < 1) {
      invalidList.push('Policy Effective Date must be before Expiration Date');
    }
    return invalidList;
  }
}
