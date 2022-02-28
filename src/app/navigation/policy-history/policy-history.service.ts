import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { newPolicyHistory, PolicyHistory } from './policy-history';

@Injectable({
    providedIn: 'root'
})
export class PolicyHistoryService {

    private _policyHistory = new BehaviorSubject<PolicyHistory[]>([]);
    get policyHistory$() { return this._policyHistory.asObservable(); }

    private _policyhistorySize = new BehaviorSubject<number>(0);
    policyhistorySize$ = this._policyhistorySize.asObservable();
    get policyhistorySize(): number { return this._policyhistorySize.getValue(); }
    set policyhistorySize(value: number) {
        localStorage.setItem('policy-history-size', value.toString());
        this._policyhistorySize.next(value);
    }

    constructor(private configService: ConfigService) { }

    updatePolicyHistory(policyId: number, policyNumber: string, endorsementNumber: number) {
        let policy = newPolicyHistory();
        policy.policyId = policyId;
        policy.policyNumber = policyNumber;
        policy.endorsementNumber = endorsementNumber;
        let previousPolicies = this._policyHistory.getValue();
        // Check to see if the policy already exists
        let match = previousPolicies.find(x => x.policyId == policyId && x.endorsementNumber == endorsementNumber);
        // If exists than just update open date
        if (match != null) {
            match.openDate = new Date;
            match.policyNumber = policyNumber;
        }
        else {
            // if list is larger then maxPolicyHistorySize then remove item before adding new one to beginning
            if (previousPolicies.length >= this.policyhistorySize) {
                previousPolicies.pop();
            }
            // Add new policy at start of non favorited
            let lastFavoriteIndex: number = 0;
            previousPolicies.forEach((value, index) => { if (value.favorite == true && lastFavoriteIndex < index) { lastFavoriteIndex = index } });
            previousPolicies.splice(lastFavoriteIndex + 1, 0, policy);
        }
        localStorage.setItem('policy-history', JSON.stringify(previousPolicies, replacer));
        this._policyHistory.next(previousPolicies);
    }

    favoritePolicyHistory(policyId: number, endorsementNumber: number, favorite: boolean): boolean {
        let favCount: number = 0;
        let previousPolicies = this._policyHistory.getValue();
        // Check to see if the policy already exists
        previousPolicies.forEach((value) => { if (value.favorite == true) { favCount++ } });
        if (favCount < this.policyhistorySize - 1 || !favorite) {
            let match = previousPolicies.find(x => x.policyId == policyId && x.endorsementNumber == endorsementNumber);
            if (match != null) {
                match.favorite = favorite;
            }
            localStorage.setItem('policy-history', JSON.stringify(previousPolicies, replacer));
            return favorite;
        }
        return !favorite;
    }

    loadInfo() {
        let currentPolicy = localStorage.getItem('policy-history');
        this.loadPolicyHistorySize();

        if (currentPolicy != null) {
            const data: PolicyHistory[] = JSON.parse(currentPolicy);
            if (data != null) {
                let policyList = data.sort((a, b) => Number(b.favorite ?? 0) - Number(a.favorite ?? 0) || new Date(b.openDate).getTime() - new Date(a.openDate).getTime());
                if (policyList.length > this.policyhistorySize) {
                    policyList.splice(this.policyhistorySize, policyList.length - this.policyhistorySize);        
                }
                if (policyList.length == this.policyhistorySize && policyList[policyList.length - 1].favorite) {
                    policyList[policyList.length - 1].favorite = false;
                }
                this._policyHistory.next(policyList);
            }
        }
    }

    loadPolicyHistorySize() {
        let sizeStorage = localStorage.getItem('policy-history-size');
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
    }

}

function replacer(key: string, value: string) {
    if (key == "hover") return undefined;
    else return value;
}