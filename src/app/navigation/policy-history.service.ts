import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PolicyHistoryService {

    private _policyHistory = new BehaviorSubject<PolicyHistory[]>([]);
    get policyHistory$() { return this._policyHistory.asObservable(); }

    constructor() { }

    updatePolicyHistory(policyId: number, policyNumber: string, endorsementNumber: number) {
        let policy = ({} as any) as PolicyHistory;
        policy.policyId = policyId;
        policy.policyNumber = policyNumber;
        policy.endorsementNumber = endorsementNumber;
        policy.openDate = new Date;
        let previousPolicies = this._policyHistory.getValue();
        // Check to see if the policy already exists
        let match = previousPolicies.find(x => x.policyId == policyId && x.endorsementNumber == endorsementNumber);
        // If exists than just update open date
        if (match != null) {
            match.openDate = new Date;
        }
        else {
            // if list if list is large then 5 then remove item before adding new one to beggining
            if (previousPolicies.length >= 5) {
                previousPolicies.pop();
            }
            previousPolicies.unshift(policy);
        }
        localStorage.setItem('policy-history', JSON.stringify(previousPolicies));
        this._policyHistory.next(previousPolicies);
    }

    loadInfo() {
        let currentPolicy = localStorage.getItem('policy-history');

        if (currentPolicy != null) {
            const data:PolicyHistory[] = JSON.parse(currentPolicy);
            if (data != null) {
                this._policyHistory.next(data.sort((a,b) => new Date(b.openDate).getTime() - new Date(a.openDate).getTime()));
            }
        }
    }
}

export interface PolicyHistory {
    policyId: number;
    policyNumber: string;
    endorsementNumber: number;
    openDate: Date;
}
