import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { newHistory, History } from './policy-history';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private _policyHistory = new BehaviorSubject<History[]>([]);
  get policyHistory$() { return this._policyHistory.asObservable(); }
  private _policyhistorySize = new BehaviorSubject<number>(0);
  policyhistorySize$ = this._policyhistorySize.asObservable();
  get policyhistorySize(): number { return this._policyhistorySize.getValue(); }
  set policyhistorySize(value: number) {
    localStorage.setItem('policy-history-size', value.toString());
    this._policyhistorySize.next(value);
  }

  constructor(private configService: ConfigService) { }

  updateSubmissionHistory(submissionNumber: number) {
    const previousHistory = this._policyHistory.getValue();
    const history = newHistory();
    history.submissionNumber = submissionNumber;
    // Check to see if the submission already exists
    const match = previousHistory.find(x => x.submissionNumber == submissionNumber);
    // If exists than just update open date
    if (match != null) {
      match.openDate = new Date;
    }
    else {
      history.id = Math.max(...previousHistory.map(o => o.id ?? 0)) + 1;
      // if list is larger then maxPolicyHistorySize then remove item before adding new one to beginning
      if (previousHistory.length >= this.policyhistorySize) {
        previousHistory.pop();
      }
      // Add new policy at start of non favorited
      let lastFavoriteIndex = 0;
      previousHistory.forEach((value, index) => { if (value.favorite == true && lastFavoriteIndex < index) { lastFavoriteIndex = index; } });
      previousHistory.splice(lastFavoriteIndex + 1, 0, history);
    }
    localStorage.setItem('policy-history', JSON.stringify(previousHistory, replacer));
    this._policyHistory.next(previousHistory);
  }

  updateQuoteHistory(groupSequence: number) {
    const previousHistory = this._policyHistory.getValue();
    const history = newHistory();
    history.groupSequence = groupSequence;
    // Check to see if the submission already exists
    const match = previousHistory.find(x => x.groupSequence == groupSequence);
    // If exists than just update open date
    if (match != null) {
      match.openDate = new Date;
    }
    else {
      history.id = Math.max(...previousHistory.map(o => o.id ?? 0)) + 1;
      // if list is larger then maxPolicyHistorySize then remove item before adding new one to beginning
      if (previousHistory.length >= this.policyhistorySize) {
        previousHistory.pop();
      }
      // Add new policy at start of non favorited
      let lastFavoriteIndex = 0;
      previousHistory.forEach((value, index) => { if (value.favorite == true && lastFavoriteIndex < index) { lastFavoriteIndex = index; } });
      previousHistory.splice(lastFavoriteIndex + 1, 0, history);
    }
    localStorage.setItem('policy-history', JSON.stringify(previousHistory, replacer));
    this._policyHistory.next(previousHistory);
  }

  updatePolicyHistory(policyId: number, policyNumber: string, endorsementNumber: number) {
    const previousHistory = this._policyHistory.getValue();
    const history = newHistory();
    history.policyId = policyId;
    history.policyNumber = policyNumber;
    history.endorsementNumber = endorsementNumber;
    // Check to see if the policy already exists
    const match = previousHistory.find(x => x.policyId == policyId && x.endorsementNumber == endorsementNumber);
    // If exists than just update open date
    if (match != null) {
      match.openDate = new Date;
      match.policyNumber = policyNumber;
    }
    else {
      history.id = Math.max(...previousHistory.map(o => o.id ?? 0)) + 1;
      // if list is larger then maxPolicyHistorySize then remove item before adding new one to beginning
      if (previousHistory.length >= this.policyhistorySize) {
        previousHistory.pop();
      }
      // Add new policy at start of non favorited
      let lastFavoriteIndex = 0;
      previousHistory.forEach((value, index) => { if (value.favorite == true && lastFavoriteIndex < index) { lastFavoriteIndex = index; } });
      previousHistory.splice(lastFavoriteIndex + 1, 0, history);
    }
    localStorage.setItem('policy-history', JSON.stringify(previousHistory, replacer));
    this._policyHistory.next(previousHistory);
  }

  removePolicy(policyId: number, endorsementNumber: number)
  {
    const previousPolicies = this._policyHistory.getValue();
    const matchIndex = previousPolicies.findIndex(x => x.policyId == policyId && x.endorsementNumber == endorsementNumber);
    if (matchIndex > 0) {
      previousPolicies.splice(matchIndex,1);
      localStorage.setItem('policy-history', JSON.stringify(previousPolicies, replacer));
    }
  }

  favoriteHistory(id: number | null, favorite: boolean): boolean {
    let favCount = 0;
    const previousHistory = this._policyHistory.getValue();
    // Check to see if the item already exists
    previousHistory.forEach((value) => { if (value.favorite == true) { favCount++; } });
    if (favCount < this.policyhistorySize - 1 || !favorite) {
      const match = previousHistory.find(x => x.id == id);
      if (match != null) {
        match.favorite = favorite;
      }
      localStorage.setItem('policy-history', JSON.stringify(previousHistory, replacer));
      return favorite;
    }
    return !favorite;
  }

  loadInfo() {
    const currentPolicy = localStorage.getItem('policy-history');
    this.loadHistorySize();
    if (currentPolicy != null) {
      const data: History[] = JSON.parse(currentPolicy);
      if (data != null) {
        const policyList = data.sort((a, b) => Number(b.favorite ?? 0) - Number(a.favorite ?? 0) || new Date(b.openDate).getTime() - new Date(a.openDate).getTime());
        // Check to see if there is no id field, otherwise add, this should only run first time
        let sequence = 1;
        data.forEach(item => {
          if (item.id == null) {
            item.id = sequence;
            console.log(item.id);
            sequence++;
          }
        });
        if (policyList.length > this.policyhistorySize) {
          policyList.splice(this.policyhistorySize, policyList.length - this.policyhistorySize);
        }
        if (policyList.length == this.policyhistorySize && policyList[policyList.length - 1].favorite) {
          policyList[policyList.length - 1].favorite = false;
        }
        // If populated id then save to storage
        if (sequence != 1) {
          localStorage.setItem('policy-history', JSON.stringify(policyList, replacer));
        }
        this._policyHistory.next(policyList);
      }
    }
  }

  loadHistorySize() {
    const sizeStorage = localStorage.getItem('policy-history-size');
    if (sizeStorage === null) {
      this._policyhistorySize.next(this.configService.defaultPolicyHistorySize);
      localStorage.setItem('policy-history-size', this.policyhistorySize.toString());
    }
    else {
      let size = Number(sizeStorage);
      if (size < 1) {
        size = 1;
        localStorage.setItem('policy-history-size', size.toString());
      }
      else if (size > 20) {
        size = 20;
        localStorage.setItem('policy-history-size', size.toString());
      }
      this._policyhistorySize.next(size);
    }
  }

  clearHistory() {
    localStorage.removeItem('policy-history');
    let policies = this._policyHistory.getValue();
    policies = [];
    this._policyHistory.next(policies);
  }

}

function replacer(key: string, value: string) {
  if (key == 'hover') return undefined;
  else return value;
}