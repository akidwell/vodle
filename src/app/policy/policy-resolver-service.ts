import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AccountInformationResolved, EndorsementResolved, PolicyInformationResolved } from './policy';
import { PolicyService } from './policy.service';

@Injectable({
    providedIn: 'root'
})
export class AccountInformationResolver implements Resolve<AccountInformationResolved> {

    constructor(private router: Router, private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountInformationResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? "0";
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ accountInfo: null, error: message });
        }
        if (isNaN(+end)) {
            const message = `Endorsement was not a number: ${end}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ accountInfo: null, error: message });
        }

        return this.policyService.getPolicyAccountInfo(Number(id))
            .pipe(
                map(accountInfo => ({ accountInfo })),
                catchError((error) => {
                    this.router.navigate(['/policy/policy-not-found'], { state: { error: error } });
                    return of({ accountInfo: null, error: error });
                })
            );
    }

}

@Injectable({
    providedIn: 'root'
})
export class PolicyInformationResolver implements Resolve<PolicyInformationResolved> {

    constructor(private router: Router, private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PolicyInformationResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? "0";
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ policyInfo: null, error: message });
        }
        if (isNaN(+end)) {
            const message = `Endorsement was not a number: ${end}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ policyInfo: null, error: message });
        }

        return this.policyService.getPolicyInfo(Number(id))
            .pipe(
                map(policyInfo => ({ policyInfo })),
                catchError((error) => {
                    this.router.navigate(['/policy/policy-not-found'], { state: { error: error } });
                    return of({ policyInfo: null, error: error });
                })
            );
    }

}

@Injectable({
    providedIn: 'root'
})
export class EndorsementResolver implements Resolve<EndorsementResolved> {

    constructor(private router: Router, private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EndorsementResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? "0";
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ endorsement: null, error: message });
        }
        if (isNaN(+end)) {
            const message = `Endorsement was not a number: ${end}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ endorsement: null, error: message });
        }

        return this.policyService.getEndorsement(Number(id),Number(end))
            .pipe(
                map(endorsement => ({ endorsement })),
                catchError((error) => {
                    this.router.navigate(['/policy/policy-not-found'], { state: { error: error } });
                    return of({ endorsement: null, error: error });
                })
            );
    }

}
