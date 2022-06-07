import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { SubmissionClass } from '../../classes/SubmissionClass';
import { SubmissionResolved } from '../../models/submission-resolved';
import { SubmissionService } from '../submission-service/submission-service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionResolver implements Resolve<SubmissionResolved> {

  constructor(private router: Router, private submissionService: SubmissionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SubmissionResolved> {
    const id = route.paramMap.get('id') ?? '';
    if (id == '') {
      const insured = this.router.getCurrentNavigation()?.extras?.state?.insured;
      return of({ submission: new SubmissionClass(undefined, insured) });
    }

    // Extract submission from routing if possible - This  might not be needed anymore keeping for reference only for now
    const submission = this.router.getCurrentNavigation()?.extras?.state?.submission;
    if (submission != null){
      return of({ submission: submission});
    }

    console.log(+id,isNaN(+id));
    if (isNaN(+id)) {
      const message = `Submission number was not a number: ${id}`;
      this.router.navigate(['/submission/submission-not-found'], { state: { error: message } });
      return of({ submission: null, error: message });
    }

    return this.submissionService.getSubmission(Number(id))
      .pipe(
        tap((submission) => console.log(submission)),
        map(submission => ({ submission })),
        catchError((error) => {
          console.log(error);
          this.router.navigate(['/submission/submission-not-found'], { state: { error: error.message } });
          return of({ submission: null, error: error });
        })
      );
  }
}


// @Injectable({
//     providedIn: 'root'
// })
// export class InsuredContactResolver implements Resolve<InsuredContactsResolved> {

//     constructor(private router: Router, private insuredService: InsuredService) { }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InsuredContactsResolved> {
//         const id = route.paramMap.get('id') ?? "";

//         if (isNaN(+id)) {
//             const message = `Insured id was not a number: ${id}`;
//             return of({ insuredContacts: [], error: message });
//         }

//         return this.insuredService.getInsuredContacts(Number(id))
//             .pipe(
//                 map(insuredContacts => ({ insuredContacts })),
//                 catchError((error) => {
//                     return of({ insuredContacts: [], error: error });
//                 })
//             );
//     }
// }


// @Injectable({
//     providedIn: 'root'
// })
// export class InsuredAdditionalNamedInsuredsResolver implements Resolve<InsuredAdditionalNamedInsuredsResolved> {

//     constructor(private router: Router, private insuredService: InsuredService) { }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InsuredAdditionalNamedInsuredsResolved> {
//         const id = route.paramMap.get('id') ?? "";

//         if (isNaN(+id)) {
//             const message = `Insured id was not a number: ${id}`;
//             return of({ additionalNamedInsureds: null, error: message });
//         }

//         return this.insuredService.getInsuredAdditionalNamedInsured(Number(id))
//             .pipe(
//                 map(additionalNamedInsureds => ({ additionalNamedInsureds })),
//                 catchError((error) => {
//                     return of({ additionalNamedInsureds: null, error: error });
//                 })
//             );
//     }
// }
