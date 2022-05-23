import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { InsuredSearchResponses } from 'src/app/features/home/models/search-results';
import { insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { newInsured, newInsuredFromPacer } from '../../models/insured';
import { InsuredResolved } from '../../models/insured-resolved';
import { InsuredService } from '../insured-service/insured.service';

@Injectable({
  providedIn: 'root'
})
export class InsuredResolver implements Resolve<InsuredResolved> {

  constructor(private router: Router, private insuredService: InsuredService) { }
  pacer!: InsuredSearchResponses;
  newInsuredANI!: insuredANI;


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InsuredResolved> {
    const id = route.paramMap.get('id') ?? '';
    if (id =='' && route.queryParams.name){
      const data: insuredANI[] = [];
      if(route.queryParams.insuredName){
        data.push(new insuredANI(this.insuredService, route.queryParams.insuredName));
        data[0].name = route.queryParams.insuredName;
        data[0].role = 2;
      }
      return of({ insured: newInsuredFromPacer(data, route.queryParams)});
    }
    if (id == '') {
      return of({ insured: newInsured() });
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