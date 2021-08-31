import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PolicyResolved } from './policy';
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
