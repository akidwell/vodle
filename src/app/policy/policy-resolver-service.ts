import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PolicyHistoryService } from '../navigation/policy-history/policy-history.service';
import { EndorsementCoveragesResolved } from './coverages/coverages';
import { AccountInformationResolved, AdditionalNamedInsuredsResolved, EndorsementLocationResolved, EndorsementResolved, EndorsementStatusResolved, PolicyInformationResolved, PolicyLayerDataResolved } from './policy';
import { PolicyService } from './policy.service';
import { UnderlyingCoveragesResolved } from './schedules/schedules';
import { EndorsementStatusService } from './services/endorsement-status.service';
import { InvoiceResolved } from './summary/invoice';

@Injectable({
    providedIn: 'root'
})
export class AccountInformationResolver implements Resolve<AccountInformationResolved> {

    constructor(private router: Router, private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountInformationResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? 0;
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

    constructor(private router: Router, private policyService: PolicyService, private policyHistoryService: PolicyHistoryService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PolicyInformationResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? 0;
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
                tap(res => this.policyHistoryService.updatePolicyHistory(res.policyId, res.policySymbol.trim() + " " + res.formattedPolicyNo, Number(end))),
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

        return this.policyService.getEndorsement(Number(id), Number(end))
            .pipe(
                map(endorsement => ({ endorsement })),
                catchError((error) => {
                    this.router.navigate(['/policy/policy-not-found'], { state: { error: error } });
                    return of({ endorsement: null, error: error });
                })
            );
    }
}

@Injectable({
    providedIn: 'root'
})
export class EndorsementCoveragesResolver implements Resolve<EndorsementCoveragesResolved> {

    constructor(private router: Router, private policyService: PolicyService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EndorsementCoveragesResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? 0;
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ endorsementCoveragesGroups: null, error: message });
        }
        if (isNaN(+end)) {
            const message = `Endorsement was not a number: ${end}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ endorsementCoveragesGroups: null, error: message });
        }

        return this.policyService.getEndorsementCoveragesGroups(Number(id), Number(end))
            .pipe(
                map(endorsementCoveragesGroups => ({ endorsementCoveragesGroups })),
                catchError((error) => {
                    this.router.navigate(['/policy/policy-not-found'], { state: { error: error } });
                    return of({ endorsementCoveragesGroups: null, error: error });
                })
            );
    }
}
@Injectable({
    providedIn: 'root'
})
export class AdditionalNamedInsuredsResolver implements Resolve<AdditionalNamedInsuredsResolved> {

    constructor(private router: Router, private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AdditionalNamedInsuredsResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? 0;
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ additionalNamedInsureds: null, error: message });
        }
        if (isNaN(+end)) {
            const message = `Endorsement was not a number: ${end}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ additionalNamedInsureds: null, error: message });
        }

        return this.policyService.getAdditionalNamedInsureds(Number(id), Number(end))
            .pipe(
                map(additionalNamedInsureds => ({ additionalNamedInsureds })),
                catchError((error) => {
                    this.router.navigate(['/policy/ANI-not-found'], { state: { error: error } });
                    return of({ additionalNamedInsureds: null, error: error });
                })
            );
    }
}

@Injectable({
    providedIn: 'root'
})
export class EndorsementLocationResolver implements Resolve<EndorsementLocationResolved> {

    constructor(private router: Router, private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EndorsementLocationResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? 0;
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ endorsementLocation: null, error: message });
        }
        if (isNaN(+end)) {
            const message = `Endorsement was not a number: ${end}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ endorsementLocation: null, error: message });
        }

        return this.policyService.getEndorsementLocation(Number(id), Number(end))
            .pipe(
                map(endorsementLocation => ({ endorsementLocation })),
                catchError((error) => {
                    this.router.navigate(['/policy/policy-not-found'], { state: { error: error } });
                    return of({ endorsementLocation: null, error: error });
                })
            );
    }
}

@Injectable({
    providedIn: 'root'
})
export class PolicyLayerResolver implements Resolve<PolicyLayerDataResolved> {

    constructor(private router: Router, private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PolicyLayerDataResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? 0;
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ policyLayer: null, error: message });
        }
        if (isNaN(+end)) {
            const message = `Endorsement was not a number: ${end}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ policyLayer: null, error: message });
        }

        return this.policyService.getPolicyAndReinsuranceLayers(Number(id), Number(end))
            .pipe(
                map(policyLayer => ({ policyLayer })),
                catchError((error) => {
                    this.router.navigate(['/policy/policy-not-found'], { state: { error: error } });
                    return of({ policyLayer: null, error: error });
                })
            );
    }
}

@Injectable({
    providedIn: 'root'
})
export class UnderlyingCoveragesResolver implements Resolve<UnderlyingCoveragesResolved> {

    constructor(private router: Router, private policyService: PolicyService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UnderlyingCoveragesResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? 0;
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ underlyingCoverages: null, error: message });
        }
        if (isNaN(+end)) {
            const message = `Endorsement was not a number: ${end}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ underlyingCoverages: null, error: message });
        }

        return this.policyService.getUnderlyingCoverages(Number(id), Number(end))
            .pipe(
                map(underlyingCoverages => ({ underlyingCoverages })),
                catchError((error) => {
                    this.router.navigate(['/policy/policy-not-found'], { state: { error: error } });
                    return of({ underlyingCoverages: null, error: error });
                })
            );
    }
}

@Injectable({
    providedIn: 'root'
})
export class InvoiceResolver implements Resolve<InvoiceResolved> {

    constructor(private router: Router, private policyService: PolicyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InvoiceResolved> {
        let id: any;
        let end: any;
        if ((route.parent?.paramMap?.keys?.length ?? 0) > 0) {
            id = route.parent?.paramMap.get('id') ?? "";
            end = route.parent?.paramMap.get('end') ?? 0;
        }
        else {
            id = route.paramMap.get('id') ?? "";
            end = route.paramMap.get('end') ?? 0;
        }
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ invoicesData: null, error: message });
        }
        if (isNaN(+end)) {
            const message = `Endorsement was not a number: ${end}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ invoicesData: null, error: message });
        }
        return this.policyService.getPolicyInvoices(Number(id), Number(end))
            .pipe(
                map(invoicesData => ({ invoicesData })),
                catchError((error) => {
                    this.router.navigate(['/policy/policy-not-found'], { state: { error: error } });
                    return of({ invoicesData: null, error: error });
                })
            );
    }
}



@Injectable({
    providedIn: 'root'
})
export class EndorsementStatusResolver implements Resolve<EndorsementStatusResolved> {

    constructor(private router: Router, private endorsementStatusService: EndorsementStatusService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EndorsementStatusResolved> {
        const id = route.paramMap.get('id') ?? "";
        const end = route.paramMap.get('end') ?? 0;
        if (isNaN(+id)) {
            const message = `Policy id was not a number: ${id}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ status: null, error: message });
        }
        if (isNaN(+end)) {
            const message = `Endorsement was not a number: ${end}`;
            this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
            return of({ status: null, error: message });
        }
        return this.endorsementStatusService.getEndorsementStatus(Number(id), Number(end))
            .pipe(
                map(status => ({ status })),
                catchError((error) => {
                    this.router.navigate(['/policy/policy-not-found'], { state: { error: error } });
                    return of({ status: null, error: error });
                })
            );
    }
}