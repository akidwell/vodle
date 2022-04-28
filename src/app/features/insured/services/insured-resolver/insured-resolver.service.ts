import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { catchError, map, Observable, of, tap } from "rxjs";
import { newInsured } from "../../models/insured";
import { InsuredAdditionalNamedInsuredsResolved } from "../../models/insured-additional-named-insured-resolved";
import { InsuredContactsResolved } from "../../models/insured-contacts-resolved";
import { InsuredResolved } from "../../models/insured-resolved";
import { InsuredService } from "../insured-service/insured.service";

@Injectable({
    providedIn: 'root'
})
export class InsuredResolver implements Resolve<InsuredResolved> {

    constructor(private router: Router, private insuredService: InsuredService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InsuredResolved> {
        const id = route.paramMap.get('id') ?? "";
        if (id == "") {
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


@Injectable({
    providedIn: 'root'
})
export class InsuredContactResolver implements Resolve<InsuredContactsResolved> {

    constructor(private router: Router, private insuredService: InsuredService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InsuredContactsResolved> {
        const id = route.paramMap.get('id') ?? "";
    
        if (isNaN(+id)) {
            const message = `Insured id was not a number: ${id}`;
            return of({ insuredContacts: [], error: message });
        }
       
        return this.insuredService.getInsuredContacts(Number(id))
            .pipe(
                map(insuredContacts => ({ insuredContacts })),
                catchError((error) => {
                    return of({ insuredContacts: [], error: error });
                })
            );
    }
}


@Injectable({
    providedIn: 'root'
})
export class InsuredAdditionalNamedInsuredsResolver implements Resolve<InsuredAdditionalNamedInsuredsResolved> {

    constructor(private router: Router, private insuredService: InsuredService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InsuredAdditionalNamedInsuredsResolved> {
        const id = route.paramMap.get('id') ?? "";
    
        if (isNaN(+id)) {
            const message = `Insured id was not a number: ${id}`;
            return of({ additionalNamedInsureds: null, error: message });
        }
       
        return this.insuredService.getInsuredAdditionalNamedInsured(Number(id))
            .pipe(
                map(additionalNamedInsureds => ({ additionalNamedInsureds })),
                catchError((error) => {
                    return of({ additionalNamedInsureds: null, error: error });
                })
            );
    }
}
