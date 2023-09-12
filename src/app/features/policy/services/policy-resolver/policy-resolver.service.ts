import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { lastValueFrom, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HistoryService } from '../../../../core/services/policy-history/policy-history.service';
import { EndorsementCoveragesResolved } from '../../components/coverages-base/coverages';
import { AccountInformationResolved, AdditionalNamedInsuredsResolved, EndorsementLocationResolved, EndorsementResolved, EndorsementStatusResolved, PolicyInformationResolved, PolicyLayerDataResolved } from '../../models/policy';
import { PolicyService } from '../policy/policy.service';
import { ReinsuranceLookupService } from '../reinsurance-lookup/reinsurance-lookup.service';
import { UnderlyingCoveragesResolved } from '../../models/schedules';
import { EndorsementStatusService } from '../endorsement-status/endorsement-status.service';

@Injectable({
  providedIn: 'root'
})
export class AccountInformationResolver  {

  constructor(private router: Router, private policyService: PolicyService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountInformationResolved> {
    const id = route.paramMap.get('id') ?? '';
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
          this.router.navigate(['/policy/policy-not-found'], { state: { error: error.message } });
          return of({ accountInfo: null, error: error });
        })
      );
  }
}

@Injectable({
  providedIn: 'root'
})
export class PolicyInformationResolver  {

  constructor(private router: Router, private policyService: PolicyService, private historyService: HistoryService, private reinsuranceLookupService: ReinsuranceLookupService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PolicyInformationResolved> {
    const id = route.paramMap.get('id') ?? '';
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
        tap(async res => {
          // Update history for opened Policy
          this.historyService.updatePolicyHistory(res.policyId, res.policySymbol.trim() + ' ' + res.formattedPolicyNo, Number(end), res.programId);
          // Preload aggreements
          const results$ = this.reinsuranceLookupService.getReinsurance(res.programId, res.policyEffectiveDate);
          await lastValueFrom(results$);
          const resultsFAC$ = this.reinsuranceLookupService.getFaculativeReinsurance(res.policyEffectiveDate);
          await lastValueFrom(resultsFAC$);
        }),
        map(policyInfo => ({ policyInfo })),
        catchError((error) => {
          this.router.navigate(['/policy/policy-not-found'], { state: { error: error.message } });
          return of({ policyInfo: null, error: error });
        })
      );
  }
}

@Injectable({
  providedIn: 'root'
})
export class EndorsementResolver  {

  constructor(private router: Router, private policyService: PolicyService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EndorsementResolved> {
    const id = route.paramMap.get('id') ?? '';
    const end = route.paramMap.get('end') ?? '0';
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
          this.router.navigate(['/policy/policy-not-found'], { state: { error: error.message } });
          return of({ endorsement: null, error: error });
        })
      );
  }
}

@Injectable({
  providedIn: 'root'
})
export class EndorsementCoveragesResolver  {

  constructor(private router: Router, private policyService: PolicyService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EndorsementCoveragesResolved> {
    const id = route.paramMap.get('id') ?? '';
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
          this.router.navigate(['/policy/policy-not-found'], { state: { error: error.message } });
          return of({ endorsementCoveragesGroups: null, error: error });
        })
      );
  }
}
@Injectable({
  providedIn: 'root'
})
export class AdditionalNamedInsuredsResolver  {

  constructor(private router: Router, private policyService: PolicyService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AdditionalNamedInsuredsResolved> {
    const id = route.paramMap.get('id') ?? '';
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
          this.router.navigate(['/policy/ANI-not-found'], { state: { error: error.message } });
          return of({ additionalNamedInsureds: null, error: error });
        })
      );
  }
}

@Injectable({
  providedIn: 'root'
})
export class EndorsementLocationResolver  {

  constructor(private router: Router, private policyService: PolicyService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EndorsementLocationResolved> {
    const id = route.paramMap.get('id') ?? '';
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
          this.router.navigate(['/policy/policy-not-found'], { state: { error: error.message } });
          return of({ endorsementLocation: null, error: error });
        })
      );
  }
}

@Injectable({
  providedIn: 'root'
})
export class PolicyLayerResolver  {

  constructor(private router: Router, private policyService: PolicyService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PolicyLayerDataResolved> {
    const id = route.paramMap.get('id') ?? '';
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
          this.router.navigate(['/policy/policy-not-found'], { state: { error: error.message } });
          return of({ policyLayer: null, error: error });
        })
      );
  }
}

@Injectable({
  providedIn: 'root'
})
export class UnderlyingCoveragesResolver  {

  constructor(private router: Router, private policyService: PolicyService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UnderlyingCoveragesResolved> {
    const id = route.paramMap.get('id') ?? '';
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
          this.router.navigate(['/policy/policy-not-found'], { state: { error: error.message } });
          return of({ underlyingCoverages: null, error: error });
        })
      );
  }
}

// @Injectable({
//     providedIn: 'root'
// })
// export class InvoiceResolver implements Resolve<InvoiceResolved> {

//     constructor(private router: Router, private policyService: PolicyService) { }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InvoiceResolved> {
//         let id: any;
//         let end: any;
//         if ((route.parent?.paramMap?.keys?.length ?? 0) > 0) {
//             id = route.parent?.paramMap.get('id') ?? "";
//             end = route.parent?.paramMap.get('end') ?? 0;
//         }
//         else {
//             id = route.paramMap.get('id') ?? "";
//             end = route.paramMap.get('end') ?? 0;
//         }
//         if (isNaN(+id)) {
//             const message = `Policy id was not a number: ${id}`;
//             this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
//             return of({ invoicesData: null, error: message });
//         }
//         if (isNaN(+end)) {
//             const message = `Endorsement was not a number: ${end}`;
//             this.router.navigate(['/policy/policy-not-found'], { state: { error: message } });
//             return of({ invoicesData: null, error: message });
//         }
//         return this.policyService.getPolicyInvoices(Number(id), Number(end))
//             .pipe(
//                 map(invoicesData => ({ invoicesData })),
//                 catchError((error) => {
//                     this.router.navigate(['/policy/policy-not-found'], { state: { error: error.message } });
//                     return of({ invoicesData: null, error: error });
//                 })
//             );
//     }
// }


@Injectable({
  providedIn: 'root'
})
export class EndorsementStatusResolver  {

  constructor(private router: Router, private endorsementStatusService: EndorsementStatusService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EndorsementStatusResolved> {
    const id = route.paramMap.get('id') ?? '';
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
          this.router.navigate(['/policy/policy-not-found'], { state: { error: error.message } });
          return of({ status: null, error: error });
        })
      );
  }
}
