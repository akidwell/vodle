import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountInformationResolved, PolicyInformationResolved, PolicyResolved } from './policy';
import { PolicyService } from './policy.service';

@Injectable({
    providedIn: 'root'
})
export class PolicyResolver implements Resolve<PolicyResolved> {

    constructor(private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PolicyResolved> {
        const id = route.paramMap.get('id') ?? "";
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            console.error(message);    
            // TODO: Might want to do this
            //throw Error("Policy id was not a number");
            return of({ policy: null, error: message });
        }

        return this.policyService.getPolicy(Number(id))
            .pipe(
                map(policy => ({ policy }))
            );
    }

}
@Injectable({
    providedIn: 'root'
})
export class AccountInformationResolver implements Resolve<AccountInformationResolved> {

    constructor(private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountInformationResolved> {
        const id = route.paramMap.get('id') ?? "";
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            console.error(message);    
            // TODO: Might want to do this
            //throw Error("Policy id was not a number");
            return of({ accountInfo: null, error: message });
        }

        return this.policyService.getPolicyAccountInfo(Number(id))
            .pipe(
                map(accountInfo => ({ accountInfo }))
            );
    }

}
@Injectable({
    providedIn: 'root'
})
export class PolicyInformationResolver implements Resolve<PolicyInformationResolved> {

    constructor(private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PolicyInformationResolved> {
        const id = route.paramMap.get('id') ?? "";
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            console.error(message);    
            // TODO: Might want to do this
            //throw Error("Policy id was not a number");
            return of({ policyInfo: null, error: message });
        }

        return this.policyService.getPolicyInfo(Number(id))
            .pipe(
                map(policyInfo => ({ policyInfo }))
            );
    }

}


