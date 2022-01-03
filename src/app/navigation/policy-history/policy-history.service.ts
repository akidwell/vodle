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
        }
        else {
            // if list is larger then maxPolicyHistorySize then remove item before adding new one to beginning
            if (previousPolicies.length >= this.configService.maxPolicyHistorySize) {
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
        if (favCount < this.configService.maxPolicyHistorySize - 1 || !favorite) {
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
        if (currentPolicy != null) {
            const data: PolicyHistory[] = JSON.parse(currentPolicy);
            if (data != null) {
                this._policyHistory.next(data.sort((a, b) =>
                    Number(b.favorite ?? 0) - Number(a.favorite ?? 0) || new Date(b.openDate).getTime() - new Date(a.openDate).getTime()
                ));
            }
        }
    }
}

function replacer(key: string, value: string) {
    if (key == "hover") return undefined;
    else return value;
}