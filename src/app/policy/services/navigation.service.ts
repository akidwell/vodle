import { Injectable } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { Subject } from 'rxjs';
import { CustomReuseStrategy } from 'src/app/app-reuse-strategy';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { PolicySearchResults } from 'src/app/home/search-results/policy-search-results';
import { ReinsuranceLookupService } from '../reinsurance/reinsurance-lookup/reinsurance-lookup.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private createDirectPolicy = new Subject<void>();
  createDirectPolicy$ = this.createDirectPolicy.asObservable();

  private createCancelRewrite = new Subject<void>();
  createCancelRewrite$ = this.createCancelRewrite.asObservable();

  rewriteInfo!: PolicySearchResults;

  constructor(private routeReuseStrategy: RouteReuseStrategy, private dropDownService: DropDownsService, private reinsuranceLookupService: ReinsuranceLookupService){ }

  public create() {
    this.createDirectPolicy.next();
  }

  public createRewrite(policy: PolicySearchResults) {
    this.rewriteInfo = policy;
    this.createCancelRewrite.next();
  }

  public resetPolicy() {
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('information');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('coverages');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('schedules');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('reinsurance');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('summary');
    this.dropDownService.clearPolicyDropDowns();
    this.reinsuranceLookupService.clearReinsuranceCodes();
  }
}
