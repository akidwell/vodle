import { Injectable } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { Subject } from 'rxjs';
import { CustomReuseStrategy } from 'src/app/app-reuse-strategy';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { ReinsuranceLookupService } from '../reinsurance-lookup/reinsurance-lookup.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private createDirectPolicy = new Subject<void>();
  createDirectPolicy$ = this.createDirectPolicy.asObservable();

  constructor(private routeReuseStrategy: RouteReuseStrategy, private dropDownService: DropDownsService, private reinsuranceLookupService: ReinsuranceLookupService) { }

  public create() {
    this.createDirectPolicy.next();
  }

  public clearReuse() {
    (this.routeReuseStrategy as CustomReuseStrategy).clearAllHandles();
    this.dropDownService.clearPolicyDropDowns();
    this.reinsuranceLookupService.clearReinsuranceCodes();
  }
}
