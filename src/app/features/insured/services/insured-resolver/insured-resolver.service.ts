import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { InsuredClass } from '../../classes/insured-class';
import { newInsuredFromPacer } from '../../models/insured';
import { InsuredResolved } from '../../models/insured-resolved';
import { InsuredService } from '../insured-service/insured.service';

@Injectable({
  providedIn: 'root'
})
export class InsuredResolver implements Resolve<InsuredResolved> {

  constructor(private router: Router, private insuredService: InsuredService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InsuredResolved> {
    const id = route.paramMap.get('id') ?? '';
    const pacerInsured = this.router.getCurrentNavigation()?.extras?.state?.pacerInsured;
    if (pacerInsured != null){
      return of({ insured: new InsuredClass(newInsuredFromPacer(pacerInsured))});
    }
    if (id == '') {
      return of({ insured: new InsuredClass()});
    }
    if (isNaN(+id)) {
      const message = `Insured id was not a number: ${id}`;
      this.router.navigate(['/insured/insured-not-found'], { state: { error: message } });
      return of({ insured: null, error: message });
    }

    return this.insuredService.getInsured(Number(id))
      .pipe(
        map(insured => ({ insured })),
        catchError((error) => {
          this.router.navigate(['/insured/insured-not-found'], { state: { error: error.message } });
          return of({ insured: null, error: error });
        })
      );
  }
}