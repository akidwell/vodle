import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { lastValueFrom, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HistoryService } from '../../../../core/services/policy-history/policy-history.service';
import { PolicyService } from '../../../policy/services/policy/policy.service';
import { ReinsuranceLookupService } from '../../../policy/services/reinsurance-lookup/reinsurance-lookup.service';
import { PolicyResolved } from '../../models/policy-resolved';


@Injectable({
  providedIn: 'root'
})

export class PolicyResolver  {

  constructor(private router: Router, private policyService: PolicyService, private historyService: HistoryService, private reinsuranceLookupService: ReinsuranceLookupService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PolicyResolved> {
    console.log(route.paramMap);
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

    return this.policyService.getPolicyInfoV2(Number(id), Number(end))
      .pipe(
        tap(async (policyInfo) => {
          // Update history for opened Policy
          this.historyService.updatePolicyHistory(policyInfo?.policyId, policyInfo?.policySymbol.trim() + ' ' + policyInfo?.formattedPolicyNo, Number(end), policyInfo.programId);
          // Preload aggreements
          const results$ = this.reinsuranceLookupService.getReinsurance(policyInfo?.programId, policyInfo?.policyEffectiveDate);
          await lastValueFrom(results$);
          const resultsFAC$ = this.reinsuranceLookupService.getFaculativeReinsurance(policyInfo?.policyEffectiveDate);
          await lastValueFrom(resultsFAC$);
        }),
        map(policyInfo => ({ policyInfo })),
        catchError((error) => {
          console.log(error);
          this.router.navigate(['/policy/policy-not-found'], { state: { error: error.message } });
          return of({ policyInfo: null, error: error });
        })
      );
  }
}
